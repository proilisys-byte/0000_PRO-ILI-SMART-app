"use client";
import './styles/fonts.css';
import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { PersonaSolutionSection } from './components/PersonaSolutionSection';
import { InteractiveProofSection } from './components/InteractiveProofSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { OutcomesSection } from './components/OutcomesSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { ConsultationPage } from './components/ConsultationPage';
import { DashboardPage } from './components/DashboardPage';
import { LoginPage } from './components/LoginPage';
import { NCRRegistrationPage } from './components/NCRRegistrationPage';
import { RootCauseAnalysisPage } from './components/RootCauseAnalysisPage';
import { CAPAPage } from './components/CAPAPage';
import { EightDReportPage } from './components/EightDReportPage';
import { AuditChecklistPage } from './components/AuditChecklistPage';
import { ImprovementDashboardPage } from './components/ImprovementDashboardPage';
import { TrainingManagementPage } from './components/TrainingManagementPage';
import { BulkImportPage } from './components/BulkImportPage';
import { ZeroUiMobilePage } from './components/ZeroUiMobilePage';

type PageType = 'home' | 'consultation' | 'dashboard' | 'login' | 'ncr' | 'rootcause' | 'capa' | 'eightd' | 'audit' | 'improvement' | 'training' | 'bulk-import' | 'zero-ui-mobile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const renderPage = () => {
    if (currentPage === 'login') return <LoginPage onBackClick={() => setCurrentPage('home')} />;
    if (currentPage === 'consultation') return <ConsultationPage onBackClick={() => setCurrentPage('home')} />;
    if (currentPage === 'dashboard') return <DashboardPage onBackClick={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page as PageType)} />;
    if (currentPage === 'ncr') return <NCRRegistrationPage onBackClick={() => setCurrentPage('dashboard')} />;
    if (currentPage === 'rootcause') return <RootCauseAnalysisPage onBackClick={() => setCurrentPage('dashboard')} />;
    if (currentPage === 'capa') return <CAPAPage onBackClick={() => setCurrentPage('dashboard')} />;
    if (currentPage === 'eightd') return <EightDReportPage onBackClick={() => setCurrentPage('dashboard')} />;
    if (currentPage === 'audit') return <AuditChecklistPage onBackClick={() => setCurrentPage('dashboard')} />;
    if (currentPage === 'improvement') return <ImprovementDashboardPage onBackClick={() => setCurrentPage('dashboard')} />;
    if (currentPage === 'training') return <TrainingManagementPage onBackClick={() => setCurrentPage('dashboard')} />;
    if (currentPage === 'bulk-import') return <BulkImportPage onBackClick={() => setCurrentPage('dashboard')} />;
    if (currentPage === 'zero-ui-mobile') return <ZeroUiMobilePage onBackClick={() => setCurrentPage('dashboard')} />;

    return (
      <div className="min-h-screen">
        <Header onConsultationClick={() => setCurrentPage('consultation')} onLoginClick={() => setCurrentPage('login')} />
        <HeroSection onConsultationClick={() => setCurrentPage('consultation')} onDashboardClick={() => setCurrentPage('dashboard')} />
        <ProblemSection />
        <PersonaSolutionSection />
        <CapabilitiesSection />
        <InteractiveProofSection />
        <OutcomesSection />
        <CTASection onConsultationClick={() => setCurrentPage('consultation')} />
        <Footer />
      </div>
    );
  };

  return (
    <div className="w-full mx-auto overflow-x-hidden">
      {renderPage()}
    </div>
  );
}