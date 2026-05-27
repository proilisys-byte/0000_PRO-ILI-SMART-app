"use client";
import { useRouter } from "next/navigation";
import { ImprovementDashboardPage } from "@/components/figma-export/components/ImprovementDashboardPage";

export default function ImprovementRoute() {
  const router = useRouter();
  return <ImprovementDashboardPage onBackClick={() => router.push("/dashboard")} />;
}
