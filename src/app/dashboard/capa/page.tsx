"use client";
import { useRouter } from "next/navigation";
import { CAPAPage } from "@/components/figma-export/components/CAPAPage";

export default function CAPARoute() {
  const router = useRouter();
  return <CAPAPage onBackClick={() => router.push("/dashboard")} />;
}
