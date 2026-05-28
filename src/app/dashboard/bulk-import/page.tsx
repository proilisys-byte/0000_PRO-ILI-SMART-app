"use client";
import { useRouter } from "next/navigation";
import { BulkImportPage } from "@/components/figma-export/components/BulkImportPage";

export default function BulkImportRoute() {
  const router = useRouter();
  return <BulkImportPage onBackClick={() => router.push("/dashboard")} />;
}
