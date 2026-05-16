// page.tsx
/**
 * @file src/app/page.tsx
 * @description PRO ILI SMART 랜딩 페이지의 메인 엔트리(Entry) 페이지입니다.
 * 정적 컴포넌트(Server)와 동적 애니메이션 컴포넌트(Client)를 하나의 레이아웃 안에서 조립합니다.
 */

import React from "react";
import FigmaApp from "@/components/figma-export/App";

export default function Home() {
  return (
    <main>
      <FigmaApp />
    </main>
  );
}
