"use client";
import { useRouter } from "next/navigation";
import { ConsultationPage } from "@/components/figma-export/components/ConsultationPage";

export default function ConsultationRoute() {
  const router = useRouter();
  return <ConsultationPage onBackClick={() => router.push("/")} />;
}
