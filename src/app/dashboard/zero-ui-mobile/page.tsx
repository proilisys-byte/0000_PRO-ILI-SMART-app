"use client";
import { useRouter } from "next/navigation";
import { ZeroUiMobilePage } from "@/components/figma-export/components/ZeroUiMobilePage";

export default function ZeroUiMobileRoute() {
  const router = useRouter();
  return <ZeroUiMobilePage onBackClick={() => router.push("/dashboard")} />;
}
