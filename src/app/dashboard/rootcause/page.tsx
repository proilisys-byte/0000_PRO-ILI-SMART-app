"use client";
import { useRouter } from "next/navigation";
import { RootCauseAnalysisPage } from "@/components/figma-export/components/RootCauseAnalysisPage";

export default function RootCauseRoute() {
  const router = useRouter();
  return <RootCauseAnalysisPage onBackClick={() => router.push("/dashboard")} />;
}
