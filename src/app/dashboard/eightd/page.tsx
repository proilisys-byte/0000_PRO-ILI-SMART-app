"use client";
import { useRouter } from "next/navigation";
import { EightDReportPage } from "@/components/figma-export/components/EightDReportPage";

export default function EightDRoute() {
  const router = useRouter();
  return <EightDReportPage onBackClick={() => router.push("/dashboard")} />;
}
