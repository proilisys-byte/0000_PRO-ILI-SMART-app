// landing.ts
/**
 * @file src/data/landing.ts
 * @description 랜딩 페이지 전체의 텍스트, 설정 및 비즈니스 데이터를 정의하는 데이터 레이어 파일입니다.
 * UI 컴포넌트(Sections, Cards 등)는 오직 화면을 렌더링하는 데만 집중하며, 실제 콘텐츠는 모두 이 곳에서 관리됩니다.
 * Data Flow: 
 *   이 파일의 데이터 객체(problems, workflows 등)
 *   -> Sections.tsx / StaticSections.tsx (map 순회)
 *   -> Cards.tsx (개별 아이템 렌더링)
 */

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  FileWarning,
  Activity,
  Lock,
  CheckCircle2,
  Database,
  Clock,
  Zap,
  Mic,
  FileSearch,
  BarChart3,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

/**
 * @interface ProblemItem
 * @description 품질 팀이 겪고 있는 페인포인트 데이터를 정의합니다.
 */
export interface ProblemItem {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;         // pre-resolved Tailwind color classes
  hoverBorderClass: string;
  iconBgClass: string;
}

/**
 * @interface WorkflowStep
 * @description 단절 없는 품질 파이프라인의 각 단계를 정의합니다.
 */
export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  align: "left" | "right";
}

/**
 * @interface SecurityFeature
 * @description B2B 신뢰를 위한 보안/무결성 기능 리스트를 정의합니다.
 */
export interface SecurityFeature {
  icon: LucideIcon;
  title: string;
  detail: string;
}

/**
 * @interface OutcomeMetric
 * @description 시스템 도입 후 발생하는 압도적인 지표(ROI) 변화량을 정의합니다.
 */
export interface OutcomeMetric {
  from: string;
  to: string;
  label: string;
  icon: LucideIcon;
}

/**
 * @interface CapabilityCard
 * @description 핵심 역량(Bento UI) 카드 데이터와 내부 시각적 렌더링 타입을 정의합니다.
 */
export interface CapabilityCard {
  icon: LucideIcon;
  title: string;
  description: string;
  colSpan: string;           // e.g. "md:col-span-8"
  iconColor: string;         // e.g. "text-cyan-400"
  visualType: "waveform" | "progress" | "badge" | "chart";
}

export interface HeroContent {
  badgeText: string;
  headlinePre: string;
  headlineHighlight: string;
  headlinePost: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface CtaContent {
  headline: string;
  subtitle: string;
  submitLabel: string;
  disclaimer: string;
  fields: { name: string; placeholder: string; type: string; icon: LucideIcon }[];
}

// ---------------------------------------------------------------------------
// Static Content – Hero & CTA
// ---------------------------------------------------------------------------

import { User, Phone, Building2, Briefcase, Mail } from "lucide-react";

/**
 * @constant heroContent
 * @description 페이지 최상단 Hero 섹션에 표시될 메인 카피와 버튼 텍스트
 */
export const heroContent: HeroContent = {
  badgeText: "Smart Manufacturing Quality Platform",
  headlinePre: "품질 운영을 하나의 ",
  headlineHighlight: "연결된 워크플로우",
  headlinePost: "로 전환.",
  subtitle:
    "현장 데이터 수집부터 원청 Audit 증빙, 긴급 NC 시정까지.\n제조 품질팀을 위한 단일 플랫폼.",
  ctaPrimary: "무료 도입 컨설팅 신청",
  ctaSecondary: "워크플로우 보기",
};

/**
 * @constant ctaContent
 * @description 페이지 하단 CTA 폼 영역의 안내 텍스트와 폼 필드 정의
 */
export const ctaContent: CtaContent = {
  headline: "당신의 품질 비용(COPQ)을\n지금 바로 영업 이익으로 전환하세요.",
  subtitle: "전문화된 도입 컨설팅을 통해 최적의 워크플로우를 제안해 드립니다.",
  submitLabel: "무료 컨설팅 신청하기",
  disclaimer: "No credit card required • Secure data processing",
  fields: [
    { name: "name", placeholder: "성명", type: "text", icon: User },
    { name: "phone", placeholder: "전화번호", type: "tel", icon: Phone },
    { name: "company", placeholder: "회사명", type: "text", icon: Building2 },
    { name: "role", placeholder: "담당업무", type: "text", icon: Briefcase },
    { name: "email", placeholder: "이메일", type: "email", icon: Mail },
  ],
};

// ---------------------------------------------------------------------------
// Section Data
// ---------------------------------------------------------------------------

export const problems: ProblemItem[] = [
  {
    icon: AlertTriangle,
    title: "종이 기록의 한계",
    description:
      "수기 기록은 오기입과 누락의 위험이 크며, 즉각적인 데이터 분석이 불가능합니다.",
    colorClass: "text-orange-500",
    hoverBorderClass: "hover:border-orange-500/30",
    iconBgClass: "bg-orange-500/10",
  },
  {
    icon: FileWarning,
    title: "Audit 준비의 고통",
    description:
      "원청 Audit 증빙을 위해 매번 120시간 이상의 수작업 매핑과 문서 정리가 필요합니다.",
    colorClass: "text-red-500",
    hoverBorderClass: "hover:border-red-500/30",
    iconBgClass: "bg-red-500/10",
  },
  {
    icon: Activity,
    title: "추적 불가능한 NC",
    description:
      "부적합(NC) 발생 시 원인 분석과 시정 조치 이력이 파편화되어 추적이 어렵습니다.",
    colorClass: "text-rose-500",
    hoverBorderClass: "hover:border-rose-500/30",
    iconBgClass: "bg-rose-500/10",
  },
];

export const workflows: WorkflowStep[] = [
  {
    step: "01",
    title: "현장 수집 (Zero-UI)",
    description: "현장 작업자의 음성과 센서 데이터를 즉시 디지털화합니다.",
    icon: Mic,
    align: "left",
  },
  {
    step: "02",
    title: "자동 문서화",
    description:
      "수집된 데이터를 기반으로 Audit 대응용 리포트를 자동 생성합니다.",
    icon: FileSearch,
    align: "right",
  },
  {
    step: "03",
    title: "NC 대응 & 추적",
    description:
      "부적합 발생 시 즉각적인 알림과 함께 시정 조치 워크플로우를 가동합니다.",
    icon: AlertTriangle,
    align: "left",
  },
  {
    step: "04",
    title: "관리자 분석",
    description:
      "Lean COPQ 분석을 통해 품질 비용을 실시간으로 최적화합니다.",
    icon: BarChart3,
    align: "right",
  },
];

export const capabilities: CapabilityCard[] = [
  {
    icon: Mic,
    title: "Zero-UI 수집기",
    description:
      "기록을 위한 멈춤이 없습니다. 작업 중 음성 명령만으로 모든 품질 데이터를 실시간 기록합니다.",
    colSpan: "md:col-span-8",
    iconColor: "text-cyan-400",
    visualType: "waveform",
  },
  {
    icon: FileSearch,
    title: "Smart Audit",
    description:
      "클릭 한 번으로 6개월치 현장 데이터를 원청 요구 서식으로 자동 매핑합니다.",
    colSpan: "md:col-span-4",
    iconColor: "text-emerald-400",
    visualType: "progress",
  },
  {
    icon: AlertTriangle,
    title: "NC Management",
    description:
      "부적합 발생 즉시 협력사부터 관리자까지 실시간 전파 및 조치 이력을 추적합니다.",
    colSpan: "md:col-span-5",
    iconColor: "text-rose-400",
    visualType: "badge",
  },
  {
    icon: BarChart3,
    title: "Lean COPQ / ROI",
    description:
      "실시간 품질 비용 분석을 통해 도입 1개월 내 가시적인 ROI를 증명합니다.",
    colSpan: "md:col-span-7",
    iconColor: "text-cyan-400",
    visualType: "chart",
  },
];

export const securityFeatures: SecurityFeature[] = [
  { icon: Lock, title: "RBAC 권한 제어", detail: "사용자별 접근 제어" },
  { icon: Database, title: "Insert-only DB", detail: "수정 불가 감사 로그" },
  {
    icon: CheckCircle2,
    title: "ISO 9001 대응",
    detail: "글로벌 품질 표준 준수",
  },
  { icon: Activity, title: "유실률 0%", detail: "이중화 백업 시스템" },
];

export const outcomes: OutcomeMetric[] = [
  {
    from: "120h",
    to: "10m",
    label: "보고서 준비 시간 99% 단축",
    icon: Clock,
  },
  {
    from: "$50K+",
    to: "$0",
    label: "초기 인프라 도입 비용",
    icon: Zap,
  },
  {
    from: "3 Month",
    to: "1 Sprint",
    label: "현장 시스템 적용 기간",
    icon: Activity,
  },
];
