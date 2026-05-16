"use client";
import './styles/fonts.css';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
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

type PageType = 'home' | 'consultation' | 'dashboard' | 'login' | 'ncr' | 'rootcause' | 'capa' | 'eightd' | 'audit' | 'improvement' | 'training';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [zoom, setZoom] = useState(1);

  // 화면 크기에 따라 한눈에 볼 수 있도록 자동 비율 조정 (기준 해상도: 1440px)
  useEffect(() => {
    const updateZoom = () => {
      const width = window.innerWidth;
      // 1440px보다 작으면 그 비율만큼 축소하여 한눈에 보이게 만듦
      const newZoom = width < 1440 ? width / 1440 : 1;
      setZoom(newZoom);
    };

    updateZoom();
    window.addEventListener('resize', updateZoom);
    return () => window.removeEventListener('resize', updateZoom);
  }, []);

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

    return (
      <div className="min-h-screen">
        <Header onConsultationClick={() => setCurrentPage('consultation')} onLoginClick={() => setCurrentPage('login')} />
        <HeroSection onConsultationClick={() => setCurrentPage('consultation')} onDashboardClick={() => setCurrentPage('dashboard')} />
        <ProblemSection />
        <CapabilitiesSection />
        <OutcomesSection />
        <CTASection onConsultationClick={() => setCurrentPage('consultation')} />
        <Footer />
      </div>
    );
  };

  return (
    <div style={{ zoom: zoom, width: zoom < 1 ? '1440px' : '100%', margin: '0 auto', overflowX: 'hidden' }}>
      {renderPage()}
    </div>
  );
}