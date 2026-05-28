import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Severity costs mapping
const SEVERITY_COST: Record<string, number> = {
  S: 150000,
  A: 80000,
  B: 40000,
  C: 20000,
};

const LABOR_RATE_PER_SEC = 30000 / 3600; // 30,000 KRW/hour = 8.3333 KRW/sec
const WAITING_COST_PER_OCCURRENCE = 15000;
const OVERPRODUCTION_THRESHOLD = 100;

// Standard product costs (since Product does not have unit cost in schema)
const PRODUCT_COST: Record<string, number> = {
  PROD001: 5000,
  PROD002: 3000,
};
const DEFAULT_PRODUCT_COST = 4000;

export async function calculateCopqForDate(tenantId: string, date: Date) {
  // Normalize date to UTC midnight
  const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

  // Query AuditDataEntry for the given tenant and date range
  const entries = await prisma.auditDataEntry.findMany({
    where: {
      session: {
        tenantId,
      },
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  let defectCost = 0;
  let reworkCost = 0;
  let waitingCost = 0;
  let overproductionCost = 0;

  // Process and Defect cache maps to optimize queries and avoid N+1 issues
  const processCache: Record<string, any> = {};
  const defectCache: Record<string, any> = {};

  for (const entry of entries) {
    const mapped = entry.mappedData as any;
    if (!mapped) continue;

    // 1. Defect & Rework calculation
    const defectQty = mapped.defectQty || mapped.defect_qty || 0;
    const defectCode = mapped.defectCode || mapped.defect_code;

    if (defectQty > 0) {
      // (1) Defect Cost
      if (defectCode) {
        let defect = defectCache[defectCode];
        if (!defect) {
          defect = await prisma.defect.findUnique({
            where: {
              tenantId_defectCode: {
                tenantId,
                defectCode,
              },
            },
          });
          defectCache[defectCode] = defect;
        }
        const severity = defect?.severity || 'B';
        const costPerDefect = SEVERITY_COST[severity] || SEVERITY_COST.B;
        defectCost += defectQty * costPerDefect;
      } else {
        // Default to severity B if no defectCode is provided
        defectCost += defectQty * SEVERITY_COST.B;
      }

      // (2) Rework Cost
      const processCodeOrName = mapped.process || mapped.process_name || mapped.processName;
      let cycleTimeSec = 60; // Default
      if (processCodeOrName) {
        let processRecord = processCache[processCodeOrName];
        if (!processRecord) {
          // Try lookup by processCode or name
          processRecord = await prisma.process.findFirst({
            where: {
              tenantId,
              OR: [
                { processCode: processCodeOrName },
                { name: processCodeOrName }
              ]
            }
          });
          processCache[processCodeOrName] = processRecord;
        }
        if (processRecord) {
          cycleTimeSec = processRecord.cycleTimeSec;
        }
      }
      reworkCost += defectQty * cycleTimeSec * LABOR_RATE_PER_SEC;
    }

    // 2. Waiting calculation
    // Check raw data text or notes for waiting keywords
    const rawText = (entry.rawData as any)?.text || '';
    const notes = mapped.notes || '';
    const searchString = `${rawText} ${notes}`.toLowerCase();
    const waitingKeywords = ['대기', '지연', '정지', 'breakdown', 'waiting', 'downtime'];
    const hasWaiting = waitingKeywords.some(keyword => searchString.includes(keyword));
    if (hasWaiting) {
      waitingCost += WAITING_COST_PER_OCCURRENCE;
    }

    // 3. Overproduction calculation
    const totalQty = mapped.totalQty || mapped.total_qty || mapped.quantity || 0;
    if (totalQty > OVERPRODUCTION_THRESHOLD) {
      const excessQty = totalQty - OVERPRODUCTION_THRESHOLD;
      const productCode = mapped.productCode || mapped.product_code;
      const productCostVal = productCode ? (PRODUCT_COST[productCode] || DEFAULT_PRODUCT_COST) : DEFAULT_PRODUCT_COST;
      overproductionCost += excessQty * productCostVal;
    }
  }

  return {
    defect: defectCost,
    rework: Math.round(reworkCost), // round to nearest integer for accounting precision
    waiting: waitingCost,
    overproduction: overproductionCost,
  };
}

export async function syncCopqMetrics(tenantId: string, startDate: Date, endDate: Date) {
  // Loop through each day in the range
  const current = new Date(startDate.getTime());
  while (current <= endDate) {
    const costs = await calculateCopqForDate(tenantId, current);
    const measuredAt = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate(), 0, 0, 0, 0));

    // Upsert each waste type
    for (const [wasteType, costVal] of Object.entries(costs)) {
      await prisma.copqMetric.upsert({
        where: {
          tenantId_wasteType_measuredAt: {
            tenantId,
            wasteType,
            measuredAt,
          },
        },
        update: {
          costValue: costVal,
        },
        create: {
          tenantId,
          wasteType,
          costValue: costVal,
          measuredAt,
        },
      });
    }

    // Increment current date by 1 day
    current.setUTCDate(current.getUTCDate() + 1);
  }
}
