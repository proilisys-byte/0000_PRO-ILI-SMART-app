import { NextRequest, NextResponse } from 'next/server';
import { handleRouteError, AppError } from '@/lib/errors';
import { PrismaClient } from '@prisma/client';
import { syncCopqMetrics } from '@/lib/copq/calculator';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // 1. 사용자 인증 확인
    const mockUserCookie = request.cookies.get('mock-user');
    if (!mockUserCookie?.value) {
      throw new AppError(
        'AUTH_401_UNAUTHORIZED_ACCESS',
        '로그인이 필요합니다.',
        401
      );
    }
    const mockUser = JSON.parse(mockUserCookie.value);
    const tenantId = mockUser.tenant_id;

    // 2. Request Body 파싱
    let body: any;
    try {
      body = await request.json();
    } catch (e) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '요청 바디의 JSON 형식이 올바르지 않습니다.',
        400
      );
    }

    const { site_id, period_start, period_end } = body;

    if (!period_start || !period_end) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '시작일(period_start)과 종료일(period_end)은 필수 입력 파라미터입니다.',
        400
      );
    }

    const startDate = new Date(period_start);
    const endDate = new Date(period_end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '올바르지 않은 날짜 형식입니다. (YYYY-MM-DD)',
        400
      );
    }

    if (startDate > endDate) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '시작일은 종료일보다 이전이어야 합니다.',
        400
      );
    }

    // 3. COPQ 캐시 테이블 동기화
    await syncCopqMetrics(tenantId, startDate, endDate);

    // 4. CopqMetric 테이블에서 데이터 조회
    const metrics = await prisma.copqMetric.findMany({
      where: {
        tenantId,
        measuredAt: {
          gte: new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), 0, 0, 0, 0)),
          lte: new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 23, 59, 59, 999)),
        },
      },
      orderBy: {
        measuredAt: 'asc',
      },
    });

    // 5. 응답 포맷팅
    const dailyMap: Record<string, Record<string, number>> = {};
    const cur = new Date(startDate.getTime());
    while (cur <= endDate) {
      const dateKey = cur.toISOString().split('T')[0];
      dailyMap[dateKey] = {
        defect: 0,
        rework: 0,
        waiting: 0,
        overproduction: 0,
      };
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    metrics.forEach(m => {
      const dateKey = m.measuredAt.toISOString().split('T')[0];
      if (dailyMap[dateKey]) {
        dailyMap[dateKey][m.wasteType] = Number(m.costValue);
      }
    });

    const dailyList: any[] = [];
    const summary = {
      defect: 0,
      rework: 0,
      waiting: 0,
      overproduction: 0,
      total: 0,
    };

    Object.entries(dailyMap).forEach(([dateStr, wastes]) => {
      const dailyTotal = wastes.defect + wastes.rework + wastes.waiting + wastes.overproduction;
      dailyList.push({
        date: dateStr,
        ...wastes,
        total: dailyTotal,
      });

      summary.defect += wastes.defect;
      summary.rework += wastes.rework;
      summary.waiting += wastes.waiting;
      summary.overproduction += wastes.overproduction;
      summary.total += dailyTotal;
    });

    return NextResponse.json({
      success: true,
      data: {
        summary,
        daily: dailyList,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
