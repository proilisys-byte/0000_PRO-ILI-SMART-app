"use client";
import { useRouter } from "next/navigation";
import { DashboardPage } from "@/components/figma-export/components/DashboardPage";
import { pageToRoute } from "@/lib/navigation";

export default function DashboardRoute() {
  const router = useRouter();
  return (
    <DashboardPage
      onBackClick={() => router.push("/")}
      onNavigate={(page) => router.push(pageToRoute(page))}
    />
  );
}
