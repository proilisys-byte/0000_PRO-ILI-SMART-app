"use client";
import { useRouter } from "next/navigation";
import { TrainingManagementPage } from "@/components/figma-export/components/TrainingManagementPage";

export default function TrainingRoute() {
  const router = useRouter();
  return <TrainingManagementPage onBackClick={() => router.push("/dashboard")} />;
}
