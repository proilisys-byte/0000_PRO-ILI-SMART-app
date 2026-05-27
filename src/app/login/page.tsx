"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginPage } from "@/components/figma-export/components/LoginPage";

function LoginRouteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  return (
    <LoginPage
      onBackClick={() => router.push("/")}
      onLoginSuccess={() => router.replace(redirect)}
    />
  );
}

export default function LoginRoute() {
  return (
    <Suspense fallback={null}>
      <LoginRouteInner />
    </Suspense>
  );
}
