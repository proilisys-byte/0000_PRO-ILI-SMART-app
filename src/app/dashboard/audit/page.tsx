"use client";
import { useRouter } from "next/navigation";
import { AuditChecklistPage } from "@/components/figma-export/components/AuditChecklistPage";

export default function AuditRoute() {
  const router = useRouter();
  return <AuditChecklistPage onBackClick={() => router.push("/dashboard")} />;
}
