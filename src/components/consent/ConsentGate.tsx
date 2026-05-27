"use client";
/**
 * PIPA 동의 게이트
 *
 * 보호 라우트 진입 시 GET /api/v1/consent 로 활성 동의 상태를 확인하고,
 * 미동의 시 모달로 강제 표시. 동의 후 POST /api/v1/consent 로 기록합니다.
 *
 * REQ-NF-COMPLIANCE (PIPA), T1-014 / T4-002.
 *
 * 다국어(KR/EN/JA/ZH/VI) 컨텐츠는 LocalStorage에서 사용자 선택 언어를 읽어 표시합니다.
 */
import { useEffect, useState } from "react";

type Locale = "ko" | "en" | "ja" | "zh" | "vi";

const COPY: Record<
  Locale,
  {
    title: string;
    description: string;
    items: { type: string; label: string; required: boolean }[];
    agree: string;
    decline: string;
    declineWarning: string;
  }
> = {
  ko: {
    title: "개인정보 수집 동의",
    description:
      "PRO ALI SMART는 품질 감사 / NC 시정 / 음성 수집 기능 제공을 위해 다음 정보 수집에 동의를 요청합니다.",
    items: [
      { type: "PIPA_DATA_COLLECTION", label: "현장 품질 데이터 수집 및 처리", required: true },
      { type: "PIPA_VOICE_RECORDING", label: "Zero-UI 음성 입력 데이터 수집", required: true },
    ],
    agree: "동의하고 계속",
    decline: "동의 거부",
    declineWarning: "필수 항목 동의 없이는 서비스를 이용하실 수 없습니다.",
  },
  en: {
    title: "Personal Data Collection Consent",
    description:
      "PRO ALI SMART requires consent to collect data necessary for audit/NC/voice features.",
    items: [
      { type: "PIPA_DATA_COLLECTION", label: "Field quality data collection and processing", required: true },
      { type: "PIPA_VOICE_RECORDING", label: "Zero-UI voice input data collection", required: true },
    ],
    agree: "Agree and continue",
    decline: "Decline",
    declineWarning: "Required items must be agreed to use the service.",
  },
  ja: {
    title: "個人情報収集同意",
    description: "PRO ALI SMART は監査/NC/音声機能のため以下の情報収集に同意を求めます。",
    items: [
      { type: "PIPA_DATA_COLLECTION", label: "現場品質データの収集と処理", required: true },
      { type: "PIPA_VOICE_RECORDING", label: "Zero-UI 音声入力データの収集", required: true },
    ],
    agree: "同意して続ける",
    decline: "拒否",
    declineWarning: "必須項目の同意がないとサービスをご利用いただけません。",
  },
  zh: {
    title: "个人信息收集同意",
    description: "PRO ALI SMART 为提供审计/NC/语音功能,需要您同意以下信息的收集。",
    items: [
      { type: "PIPA_DATA_COLLECTION", label: "现场质量数据采集与处理", required: true },
      { type: "PIPA_VOICE_RECORDING", label: "Zero-UI 语音输入数据采集", required: true },
    ],
    agree: "同意并继续",
    decline: "拒绝",
    declineWarning: "未同意必填项无法使用本服务。",
  },
  vi: {
    title: "Đồng ý thu thập dữ liệu cá nhân",
    description:
      "PRO ALI SMART yêu cầu sự đồng ý để thu thập dữ liệu cần thiết cho các tính năng audit/NC/giọng nói.",
    items: [
      { type: "PIPA_DATA_COLLECTION", label: "Thu thập và xử lý dữ liệu chất lượng tại hiện trường", required: true },
      { type: "PIPA_VOICE_RECORDING", label: "Thu thập dữ liệu giọng nói Zero-UI", required: true },
    ],
    agree: "Đồng ý và tiếp tục",
    decline: "Từ chối",
    declineWarning: "Các mục bắt buộc phải được đồng ý để sử dụng dịch vụ.",
  },
};

export function ConsentGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [locale, setLocale] = useState<Locale>("ko");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("locale") : null;
    if (stored && stored in COPY) setLocale(stored as Locale);
    (async () => {
      try {
        const res = await fetch("/api/v1/consent");
        if (res.status === 401) {
          setAllowed(true); // unauthenticated; middleware will redirect to /login
          return;
        }
        if (!res.ok) throw new Error("동의 상태를 확인하지 못했습니다.");
        const json = await res.json();
        setAllowed(Boolean(json.data?.allRequiredAgreed));
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setAllowed(false);
      }
    })();
  }, []);

  const copy = COPY[locale];

  const handleAgree = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const consents = copy.items
        .filter((i) => i.required)
        .map((i) => ({ consentType: i.type, isAgreed: true }));
      const res = await fetch("/api/v1/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consents }),
      });
      if (!res.ok) throw new Error("동의 기록 저장에 실패했습니다.");
      setAllowed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (allowed === null) {
    return <div className="p-6 text-sm text-muted-foreground">동의 상태 확인 중…</div>;
  }
  if (allowed) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 text-black shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{copy.title}</h2>
          <select
            value={locale}
            onChange={(e) => {
              const next = e.target.value as Locale;
              setLocale(next);
              window.localStorage.setItem("locale", next);
            }}
            className="rounded border px-2 py-1 text-sm"
            aria-label="Language"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="zh">中文</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>
        <p className="mb-4 text-sm text-gray-700">{copy.description}</p>
        <ul className="mb-4 space-y-2 text-sm">
          {copy.items.map((item) => (
            <li key={item.type} className="rounded border bg-gray-50 px-3 py-2">
              <span className="mr-2 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">필수</span>
              {item.label}
            </li>
          ))}
        </ul>
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setError(copy.declineWarning)}
            className="rounded-md border px-4 py-2 text-sm"
          >
            {copy.decline}
          </button>
          <button
            onClick={handleAgree}
            disabled={submitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "…" : copy.agree}
          </button>
        </div>
      </div>
    </div>
  );
}
