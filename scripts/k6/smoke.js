/**
 * T4-005 — 기본 부하 스모크 테스트 (k6)
 *
 * 사용:
 *   k6 run scripts/k6/smoke.js --env BASE_URL=http://localhost:9002
 *
 * SLO 게이트:
 *   - p95 응답 시간 ≤ 1500ms
 *   - 실패율 ≤ 1%
 */
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1500"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:9002";

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/health`);
  check(res, {
    "status 200/503": (r) => r.status === 200 || r.status === 503,
    "has db check": (r) => {
      try {
        return Boolean(r.json("checks.db") !== undefined);
      } catch {
        return false;
      }
    },
  });
  sleep(1);
}
