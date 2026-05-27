"use client";
import "@/components/figma-export/styles/fonts.css";
import { useRouter } from "next/navigation";
import { Header } from "@/components/figma-export/components/Header";
import { HeroSection } from "@/components/figma-export/components/HeroSection";
import { ProblemSection } from "@/components/figma-export/components/ProblemSection";
import { PersonaSolutionSection } from "@/components/figma-export/components/PersonaSolutionSection";
import { InteractiveProofSection } from "@/components/figma-export/components/InteractiveProofSection";
import { CapabilitiesSection } from "@/components/figma-export/components/CapabilitiesSection";
import { OutcomesSection } from "@/components/figma-export/components/OutcomesSection";
import { CTASection } from "@/components/figma-export/components/CTASection";
import { Footer } from "@/components/figma-export/components/Footer";

export default function Home() {
  const router = useRouter();
  return (
    <main className="w-full mx-auto overflow-x-hidden">
      <div className="min-h-screen">
        <Header
          onConsultationClick={() => router.push("/consultation")}
          onLoginClick={() => router.push("/login")}
        />
        <HeroSection
          onConsultationClick={() => router.push("/consultation")}
          onDashboardClick={() => router.push("/dashboard")}
        />
        <ProblemSection />
        <PersonaSolutionSection />
        <CapabilitiesSection />
        <InteractiveProofSection />
        <OutcomesSection />
        <CTASection onConsultationClick={() => router.push("/consultation")} />
        <Footer />
      </div>
    </main>
  );
}
