import { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, FileText, TrendingUp, Loader2 } from 'lucide-react';

interface AuditChecklistPageProps {
  onBackClick?: () => void;
}

export function AuditChecklistPage({ onBackClick }: AuditChecklistPageProps) {
  const [isExporting, setIsExporting] = useState(false);

  const auditItems = [
    { category: '문서관리', item: 'NCR 기록 보관', status: 'pass', evidence: '최근 6개월 NCR 파일 보관 완료', risk: 'low' },
    { category: '문서관리', item: '작업 표준서 최신화', status: 'warning', evidence: '일부 표준서 미업데이트', risk: 'medium' },
    { category: '교육', item: '정기 품질교육 실시', status: 'pass', evidence: '2026년 Q1 교육 완료', risk: 'low' },
    { category: '교육', item: '교육 이수 증빙', status: 'fail', evidence: '서명부 일부 누락', risk: 'high' },
    { category: '시정조치', item: 'CAPA 완료율', status: 'pass', evidence: '98% 완료', risk: 'low' },
    { category: '시정조치', item: '효과성 검증', status: 'warning', evidence: '일부 항목 검증 미실시', risk: 'medium' }
  ];

  const riskScore = 78;

  const handlePdfDownload = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('audit-checklist-content');
      if (!element) return;

      // 1. 폰트 로딩 완료 대기 (한글 깨짐 가드)
      if (typeof window !== 'undefined' && 'fonts' in document) {
        await document.fonts.ready;
      }

      // 2. html2pdf.js 동적 임포트 (클라이언트 전용)
      const html2pdf = (await import('html2pdf.js')).default;

      // 3. 임시 스타일 락업 (가로 800px 지정하여 반응형 뭉개짐 방지)
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      element.style.width = '800px';
      element.style.maxWidth = '800px';

      const opt = {
        margin: [10, 10, 10, 10], // mm 마진
        filename: 'Audit_Checklist.pdf',
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
        <div id="audit-checklist-content" className="max-w-7xl mx-auto p-6 bg-slate-900/60 rounded-3xl backdrop-blur-md border border-white/5 shadow-2xl">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={onBackClick} className="p-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                  Audit 대응 체크리스트
                </h1>
                <p className="text-cyan-200/80">ISO 심사 및 고객사 Audit 준비 상태 점검</p>
              </div>
            </div>

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
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Checklist */}
            <div className="lg:col-span-2 space-y-4">
              {auditItems.map((item, idx) => (
                <div key={idx} className="avoid-break p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase">{item.category}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">{item.item}</h3>
                      <p className="text-sm text-slate-600 mt-2">{item.evidence}</p>
                    </div>
                    {item.status === 'pass' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : item.status === 'warning' ? (
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.risk === 'low' ? 'bg-emerald-100 text-emerald-700' :
                      item.risk === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      리스크: {item.risk === 'low' ? '낮음' : item.risk === 'medium' ? '중간' : '높음'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk Score Panel */}
            <div className="space-y-6 avoid-break">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-3xl text-center">
                <TrendingUp className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Audit 합격 예상 점수</h3>
                <div className="text-6xl font-bold text-white mb-4">{riskScore}점</div>
                <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${riskScore}%` }} />
                </div>
                <p className="text-sm text-cyan-50 mt-4">고위험 항목 개선 시 90점 이상 예상</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900 mb-4">우선 조치 사항</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-sm font-semibold text-red-800">교육 서명부 보완 필요</p>
                  </div>
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                    <p className="text-sm font-semibold text-orange-800">표준서 업데이트 필요</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
