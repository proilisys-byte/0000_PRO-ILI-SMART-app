"use client";
import { useRouter } from "next/navigation";
import { NCRRegistrationPage } from "@/components/figma-export/components/NCRRegistrationPage";

export default function NCRRoute() {
  const router = useRouter();
  return <NCRRegistrationPage onBackClick={() => router.push("/dashboard")} />;
}
