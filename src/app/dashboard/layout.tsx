/**
 * Dashboard 보호 라우트 레이아웃
 * - 미들웨어(`src/middleware.ts`)가 인증/RBAC을 1차 게이트
 * - 본 레이아웃은 PIPA 동의 게이트(T1-014/T4-002)를 강제하여
 *   미동의 사용자의 메인 라우팅 진입을 차단합니다.
 */
import type { ReactNode } from "react";
import { ConsentGate } from "@/components/consent/ConsentGate";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <ConsentGate>{children}</ConsentGate>
    </div>
  );
}
