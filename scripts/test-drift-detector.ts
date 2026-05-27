/**
 * T3-005 — Drift detector self-test
 *
 * - baseline 자동 산출 (가중 평균)
 * - 임계값(5%p) 초과 그룹만 trigger 에 포함
 */
import { detectDrift } from "../src/lib/ai-governance/drift-detector";

const samples = [
  // 대용량 그룹은 baseline 근처에 위치 → 미감지(정상)
  { groupId: "A", metricValue: 0.9, sampleSize: 1000 },
  // 소수 인원이 큰 편차 → trigger 대상
  { groupId: "B", metricValue: 0.6, sampleSize: 10 },
  { groupId: "C", metricValue: 0.9, sampleSize: 1000 },
];

const report = detectDrift(samples, { thresholdPct: 5 });

const expectFailed = report.triggered.some((t) => t.groupId === "B" && t.deltaPct > 5);
const expectNotFailed = !report.triggered.some((t) => t.groupId === "C");

console.log(JSON.stringify(report));

if (!expectFailed || !expectNotFailed) {
  console.error("Drift detector self-test FAILED");
  process.exit(1);
}
console.log("Drift detector self-test PASSED");
