// Legacy prototype landing (Trae variant).
// 원본 JSX의 한글 텍스트가 mojibake(인코딩 깨짐) 상태로 저장되어
// `next build` 파서를 깨뜨리는 문제가 있어, 라우트는 보존하되 본문은
// placeholder로 대체합니다. 원본은 git history에 보존되어 있으며,
// 추후 별도 PR에서 인코딩 복구 후 복원하세요.

export default function TraeProAliSmartLandingLegacyPage() {
  return (
    <main style={{ padding: "4rem 1.5rem", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>
        Trae PRO ILI SMART Landing — Legacy (placeholder)
      </h1>
      <p style={{ color: "#475569", lineHeight: 1.6 }}>
        이 페이지의 원본 콘텐츠는 인코딩 손상으로 임시 정비 중입니다.
        최신 마케팅 펀널은 <code>proalismart_Landing_funnel</code>를 참고하세요.
      </p>
    </main>
  );
}
