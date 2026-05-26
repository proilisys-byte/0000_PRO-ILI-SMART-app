"use client";
import React, { useState } from 'react';
import { ArrowLeft, Upload, Camera, FileText, Sparkles, CheckCircle2, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface NCRRegistrationPageProps {
  onBackClick?: () => void;
}

interface UploadedImage {
  id: string;
  originalSize: number;
  compressedSize: number;
  previewUrl: string;
  file: File;
}

export function NCRRegistrationPage({ onBackClick }: NCRRegistrationPageProps) {
  const [formData, setFormData] = useState({
    title: '',
    defectType: '',
    description: '',
    location: '',
    severity: ''
  });

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const [aiSuggestions, setAiSuggestions] = useState([
    '어떤 제품/공정에서 문제가 발생했나요?',
    '불량이 발견된 시점은 언제인가요?',
    '예상되는 불량 수량은 얼마인가요?'
  ]);

  // 클라이언트(Edge) 사이드 Canvas 이미지 리사이징 및 JPEG 압축 로직
  const compressImage = (file: File): Promise<{ compressedFile: File; originalSize: number; compressedSize: number; previewUrl: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDimension = 1920; // 긴 축 최대 1920px 리사이즈 규격

          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context is null'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Blob conversion failed'));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              const previewUrl = URL.createObjectURL(compressedFile);
              resolve({
                compressedFile,
                originalSize: file.size,
                compressedSize: compressedFile.size,
                previewUrl,
              });
            },
            'image/jpeg',
            0.8 // JPEG Quality 80% 압축 적용
          );
        };
        img.onerror = () => reject(new Error('Image loading failed'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    try {
      const newImages: UploadedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          toast.error('이미지 파일만 업로드할 수 있습니다.');
          continue;
        }
        const result = await compressImage(file);
        newImages.push({
          id: Math.random().toString(36).substring(2, 9),
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          previewUrl: result.previewUrl,
          file: result.compressedFile,
        });
      }
      setUploadedImages((prev) => [...prev, ...newImages]);
      toast.success(`${newImages.length}개의 이미지가 압축 처리 후 정상 업로드되었습니다.`);
    } catch (err) {
      console.error(err);
      toast.error('이미지 리사이징/압축 과정 중 오류가 발생했습니다.');
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-cyan-500/10" />

      <div className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={onBackClick}
              className="p-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200 hover:bg-slate-700/80 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                NCR(부적합 보고서) 등록
              </h1>
              <p className="text-cyan-200/80">현장에서 발생한 품질 문제를 즉시 디지털화</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form - Left Side (2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl shadow-slate-900/50">
                <h2 className="text-xl font-bold text-slate-900 mb-6">기본 정보</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-2 block">문제 제목 *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/40 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                      placeholder="예: PCB 납땜 불량 발견"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-2 block">불량 유형 *</label>
                      <select
                        value={formData.defectType}
                        onChange={(e) => setFormData({ ...formData, defectType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-blue-500 transition-all outline-none"
                      >
                        <option value="">선택하세요</option>
                        <option value="material">자재 불량</option>
                        <option value="process">공정 이상</option>
                        <option value="equipment">설비 문제</option>
                        <option value="dimension">치수 불량</option>
                        <option value="appearance">외관 불량</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-800 mb-2 block">심각도 *</label>
                      <select
                        value={formData.severity}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-blue-500 transition-all outline-none"
                      >
                        <option value="">선택하세요</option>
                        <option value="critical">Critical - 즉시 조치 필요</option>
                        <option value="major">Major - 신속 조치 필요</option>
                        <option value="minor">Minor - 일반 조치</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-800 mb-2 block">문제 상세 설명 *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/40 transition-all outline-none resize-none"
                      placeholder="발생한 문제를 상세히 기술해주세요..."
                    />
                  </div>
                </div>
              </div>

              {/* Photo/Data Upload Card */}
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl shadow-slate-900/50">
                <h2 className="text-xl font-bold text-slate-900 mb-6">사진/데이터 첨부</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Hidden Input for Camera/Gallery */}
                  <input
                    type="file"
                    id="ncr-camera-input"
                    accept="image/*"
                    capture="environment"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <div
                    onClick={() => !isCompressing && document.getElementById('ncr-camera-input')?.click()}
                    className="p-6 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 transition-all cursor-pointer text-center relative flex flex-col justify-center items-center"
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-3" />
                        <p className="text-sm font-semibold text-slate-700">이미지 압축 중...</p>
                        <p className="text-xs text-slate-500 mt-1">대용량 파일 리사이징 중</p>
                      </>
                    ) : (
                      <>
                        <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-700">불량 샘플 사진</p>
                        <p className="text-xs text-slate-500 mt-1">촬영 또는 갤러리 선택</p>
                      </>
                    )}
                  </div>

                  <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 transition-all cursor-pointer text-center flex flex-col justify-center items-center">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-700">검사 데이터</p>
                    <p className="text-xs text-slate-500 mt-1">Excel, PDF 파일</p>
                  </div>
                </div>

                {/* Uploaded Images Grid with compression feedback */}
                {uploadedImages.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((img) => {
                      const reduction = Math.round(((img.originalSize - img.compressedSize) / img.originalSize) * 100);
                      const origMB = (img.originalSize / (1024 * 1024)).toFixed(2);
                      const compMB = (img.compressedSize / (1024 * 1024)).toFixed(2);

                      return (
                        <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
                          <img
                            src={img.previewUrl}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="p-3 bg-slate-50 border-t border-slate-100">
                            <p className="text-[10px] text-slate-600 font-mono text-center font-semibold">
                              {origMB}MB ➔ {compMB}MB
                            </p>
                            <div className="mt-1 text-center">
                              <span className="inline-block text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                {reduction}% 압축 완료
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* AI Generated Preview */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-3xl shadow-blue-600/50">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">AI 생성 NCR 보고서 미리보기</h2>
                </div>
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30">
                  <p className="text-white text-sm leading-relaxed">
                    입력하신 내용을 바탕으로 ISO 9001 표준 양식의 NCR 보고서가 자동으로 생성됩니다.
                    모든 필수 항목을 입력하시면 즉시 PDF로 다운로드 가능합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Guide - Right Side */}
            <div className="space-y-6">
              {/* AI Question Guide */}
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-cyan-200/60 shadow-3xl shadow-slate-900/50">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-cyan-600" />
                  <h2 className="text-lg font-bold text-slate-900">AI 질문 가이드</h2>
                </div>

                <div className="space-y-3">
                  {aiSuggestions.map((question, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 transition-all cursor-pointer">
                      <p className="text-sm text-slate-800">{question}</p>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-cyan-500/50 transition-all">
                  AI 자동 작성 도움받기
                </button>
              </div>

              {/* Quick Stats */}
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-2xl shadow-slate-900/50">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">오늘의 NCR 통계</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">등록된 NCR</span>
                    <span className="text-lg font-bold text-blue-600">12건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">처리 완료</span>
                    <span className="text-lg font-bold text-emerald-600">8건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">처리 중</span>
                    <span className="text-lg font-bold text-orange-600">4건</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end gap-4">
            <button className="px-8 py-4 rounded-2xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-all">
              임시 저장
            </button>
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              NCR 보고서 발행
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
