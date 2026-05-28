/**
 * AI 모델 Drift 감지 — T3-005 / REQ-FUNC-AI-005
 *
 * 하위 그룹별 성능(F1, accuracy 등)의 편차가 임계값(기본 5%p)을 초과하면
 * 알림을 트리거한다. 알림 채널은 ALERT_WEBHOOK_URL (env) 사용.
 */

export interface DriftSample {
  groupId: string;
  metricValue: number; // 0~1
  sampleSize: number;
}

export interface DriftReport {
  baseline: number;
  thresholdPct: number;
  triggered: { groupId: string; deltaPct: number; metricValue: number }[];
  alertedAt?: string;
}

export function detectDrift(
  samples: DriftSample[],
  options: { thresholdPct?: number; baseline?: number } = {},
): DriftReport {
  const thresholdPct = options.thresholdPct ?? Number(process.env.DRIFT_THRESHOLD_PCT ?? 5);
  const totalWeight = samples.reduce((sum, s) => sum + s.sampleSize, 0) || 1;
  const baseline =
    options.baseline ??
    samples.reduce((sum, s) => sum + s.metricValue * s.sampleSize, 0) / totalWeight;

  const triggered = samples
    .map((s) => ({
      groupId: s.groupId,
      metricValue: s.metricValue,
      deltaPct: Math.abs(s.metricValue - baseline) * 100,
    }))
    .filter((row) => row.deltaPct > thresholdPct);

  return { baseline, thresholdPct, triggered };
}

export async function postAlert(report: DriftReport): Promise<{ ok: boolean; message?: string }> {
  if (report.triggered.length === 0) return { ok: true, message: "no drift" };
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) {
    return { ok: false, message: "ALERT_WEBHOOK_URL not configured" };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `[PRO ALI SMART] AI 모델 Drift 경고: ${report.triggered.length}개 그룹이 임계값(${report.thresholdPct}%p)을 초과했습니다.`,
        report,
      }),
    });
    return { ok: res.ok, message: res.ok ? "alert sent" : `status ${res.status}` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
