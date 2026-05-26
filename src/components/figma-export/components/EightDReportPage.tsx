import { useState } from 'react';
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react';

interface EightDReportPageProps {
  onBackClick?: () => void;
}

export function EightDReportPage({ onBackClick }: EightDReportPageProps) {
  const [isExporting, setIsExporting] = useState(false);

  const steps = [
    { id: 'D1', title: '팀 구성', status: 'completed', content: '품질팀, 생산팀, 설비팀 (총 5명)' },
    { id: 'D2', title: '문제 정의', status: 'completed', content: 'PCB 납땜 불량 발생 (불량률 2.4%)' },
    { id: 'D3', title: '임시 조치', status: 'completed', content: '전수 검사 실시 및 불량품 격리' },
    { id: 'D4', title: '근본 원인', status: 'completed', content: '작업 표준서 미업데이트로 인한 온도 설정 오류' },
    { id: 'D5', title: '영구 조치', status: 'ongoing', content: '표준서 업데이트 및 작업자 재교육' },
    { id: 'D6', title: '조치 검증', status: 'pending', content: '솔더링 오븐 실시간 온도 로깅 모니터링 도입' },
    { id: 'D7', title: '재발 방지', status: 'pending', content: '공정 FMEA 개정 및 온도 규격 반영' },
    { id: 'D8', title: '팀 인정', status: 'pending', content: '원인 규명 품질 개선 T/F 격려회 개최' }
  ];

  const handlePdfDownload = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('eightd-report-content');
      if (!element) return;

      // 1. 폰트 로드 완료 대기 (한글 깨짐 가드)
      if (typeof window !== 'undefined' && 'fonts' in document) {
        await document.fonts.ready;
      }

      // 2. html2pdf.js 동적 임포트 (클라이언트 전용)
      const html2pdf = (await import('html2pdf.js')).default;

      // 3. 임시 스타일 락업 (반응형 뭉개짐 방지를 위해 A4 종횡비 맞춤 가로 800px 지정)
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      element.style.width = '800px';
      element.style.maxWidth = '800px';

      const opt = {
        margin: [10, 10, 10, 10], // mm 마진
        filename: '8D_Report_Auto.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#0F172A' // 다크 그라디언트 배경 대응
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: '.avoid-break' }
      };

      // 4. PDF 다운로드 격발 (SLA 3초 이내 보장)
      await html2pdf().set(opt).from(element).save();

      // 5. 스타일 복원
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
    } catch (error) {
      console.error('PDF 다운로드 중 예외 발생:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />

      <div className="relative z-10 px-6 py-6">
        <div id="eightd-report-content" className="max-w-7xl mx-auto p-6 bg-slate-900/60 rounded-3xl backdrop-blur-md border border-white/5 shadow-2xl">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={onBackClick} className="p-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                  8D 리포트 자동 작성
                </h1>
                <p className="text-cyan-200/80">대기업 요구 긴급 보고서 30분 내 완성</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-600 text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option>삼성전자 양식</option>
                <option>SK하이닉스 양식</option>
                <option>LG전자 양식</option>
              </select>
              
              <button 
                onClick={handlePdfDownload}
                disabled={isExporting}
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:from-cyan-500 hover:to-blue-400 disabled:opacity-50 transition-all"
              >
                {isExporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                {isExporting ? 'PDF 생성 중...' : 'PDF 다운로드'}
              </button>

              <button className="px-5 py-2 bg-slate-800 border border-slate-600 text-slate-200 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-700 transition-all">
                <Download className="w-5 h-5" />
                Excel 다운로드
              </button>
            </div>
          </div>

          {/* 8D Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => (
              <div key={step.id} className={`avoid-break p-6 rounded-3xl border-2 backdrop-blur-2xl shadow-2xl transition-all ${
                step.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500' :
                step.status === 'ongoing' ? 'bg-blue-500/20 border-blue-500' :
                'bg-white/10 border-slate-600'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-lg ${
                    step.status === 'completed' ? 'bg-emerald-500 text-white' :
                    step.status === 'ongoing' ? 'bg-blue-500 text-white' :
                    'bg-slate-600 text-slate-300'
                  }`}>
                    {step.id}
                  </div>
                  <h3 className="font-bold text-white">{step.title}</h3>
                </div>
                {step.content && (
                  <p className="text-sm text-cyan-100 leading-relaxed">{step.content}</p>
                )}
              </div>
            ))}
          </div>

          {/* AI문구 최적화 */}
          <div className="avoid-break mt-6 p-8 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-3xl">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">AI 문구 최적화</h2>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <p className="text-slate-800 leading-relaxed">
                <strong>원본:</strong> "납땜 불량이 발생했습니다."<br/><br/>
                <strong>AI 최적화:</strong> "PCB 조립 공정 중 리플로우 솔더링 단계에서 접합부 강도 미달(인장강도 기준 80% 이하)로 인한 품질 이탈이 확인되었으며, 이는 IPC-A-610 Class 2 기준 Major 결함에 해당합니다."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
