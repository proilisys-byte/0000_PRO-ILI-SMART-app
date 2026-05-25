"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Mic,
  Shield,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import type { SttOutput } from "@/lib/schemas/stt";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Toaster } from "./ui/sonner";

interface ZeroUiMobilePageProps {
  onBackClick?: () => void;
}

type VoiceState = "idle" | "listening" | "processing" | "result" | "manual";

interface FormFields {
  process_name: string;
  quantity: string;
  defect_code: string;
  notes: string;
}

interface SttApiResponse {
  success: boolean;
  data?: SttOutput;
  error?: { message?: string };
}

const PIPA_CONSENT_KEY = "pipa_consent";
const MAX_RECORDING_MS = 15_000;
const STT_TIMEOUT_MS = 5_000;
const MIC_ACTIVATION_TARGET_MS = 500;
const FALLBACK_TRANSITION_MS = 500;

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/ogg",
  "audio/mp4",
  "audio/wav",
] as const;

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  for (const type of MIME_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

function mimeToExtension(mimeType: string): string {
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4")) return "m4a";
  if (mimeType.includes("wav")) return "wav";
  return "webm";
}

function sttOutputToForm(data: Partial<SttOutput>): FormFields {
  return {
    process_name: data.process_name ?? "",
    quantity: data.quantity != null ? String(data.quantity) : "",
    defect_code: data.defect_code ?? "",
    notes: data.notes ?? "",
  };
}

function WaveformBars() {
  const barHeights = [20, 36, 28, 48, 32, 52, 24, 44, 30, 40, 26, 38];
  const bars = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="flex items-end justify-center gap-1 h-16 mt-6">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-blue-400"
          animate={{
            height: [8, barHeights[i], 12, barHeights[i] * 0.7, 8],
          }}
          transition={{
            duration: 0.6 + (i % 4) * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
}

function PipaConsentScreen({
  onAgree,
  onDisagree,
}: {
  onAgree: () => void;
  onDisagree: () => void;
}) {
  return (
    <Card className="bg-slate-800/80 backdrop-blur-2xl border-slate-600/50 text-white shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-lg font-bold text-white">
          개인정보 수집 및 마이크 음성 데이터 처리 동의서
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-cyan-100/80 leading-relaxed">
          현장 음성 입력 기능을 사용하기 위해 마이크 접근 및 음성 데이터 AI 분석 처리에
          동의가 필요합니다. 수집된 음성은 공정명, 수량, 불량 코드 추출 목적으로만
          사용되며, 제3자에게 제공되지 않습니다.
        </p>
        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
          <li>수집 항목: 음성 녹음 데이터</li>
          <li>처리 목적: STT 기반 현장 작업 데이터 자동 입력</li>
          <li>보관 기간: 분석 완료 후 즉시 삭제</li>
        </ul>
        <div className="flex flex-col gap-3">
          <Button
            onClick={onAgree}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
          >
            동의합니다
          </Button>
          <Button
            variant="outline"
            onClick={onDisagree}
            className="w-full border-slate-500/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
          >
            동의하지 않습니다
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ManualInputForm({
  formData,
  onChange,
  onSave,
  fallbackReason,
}: {
  formData: FormFields;
  onChange: (fields: FormFields) => void;
  onSave: () => void;
  fallbackReason?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: FALLBACK_TRANSITION_MS / 1000 }}
      className="w-full"
    >
      <Card className="bg-slate-800/80 backdrop-blur-2xl border-slate-600/50 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">수동 입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fallbackReason && (
            <Alert className="bg-orange-500/10 border-orange-500/30 text-orange-100">
              <AlertCircle className="text-orange-400" />
              <AlertTitle className="text-orange-200">음성 입력 전환</AlertTitle>
              <AlertDescription className="text-orange-100/80">
                {fallbackReason}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="process_name" className="text-cyan-100">
              공정명
            </Label>
            <Input
              id="process_name"
              value={formData.process_name}
              onChange={(e) =>
                onChange({ ...formData, process_name: e.target.value })
              }
              placeholder="예: 압출, 조립"
              className="bg-slate-900/60 border-slate-600/50 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-cyan-100">
              작업 수량
            </Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              value={formData.quantity}
              onChange={(e) =>
                onChange({ ...formData, quantity: e.target.value })
              }
              placeholder="예: 150"
              className="bg-slate-900/60 border-slate-600/50 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defect_code" className="text-cyan-100">
              불량 코드
            </Label>
            <Input
              id="defect_code"
              value={formData.defect_code}
              onChange={(e) =>
                onChange({ ...formData, defect_code: e.target.value })
              }
              placeholder="예: D-001"
              className="bg-slate-900/60 border-slate-600/50 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-cyan-100">
              특이 사항
            </Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => onChange({ ...formData, notes: e.target.value })}
              placeholder="현장 특이사항 메모"
              className="bg-slate-900/60 border-slate-600/50 text-white placeholder:text-slate-500"
            />
          </div>

          <Button
            onClick={onSave}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
          >
            저장
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ZeroUiMobilePage({ onBackClick }: ZeroUiMobilePageProps) {
  const [pipaGranted, setPipaGranted] = useState<boolean | null>(null);
  const [pipaDenied, setPipaDenied] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [formData, setFormData] = useState<FormFields>(sttOutputToForm({}));
  const [sttResult, setSttResult] = useState<SttOutput | null>(null);
  const [fallbackReason, setFallbackReason] = useState<string | undefined>();

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingMimeRef = useRef<string>("");
  const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const releaseMediaStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  const clearRecordingTimer = useCallback(() => {
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }
  }, []);

  const transitionToManual = useCallback(
    (reason: string, partial?: Partial<SttOutput>) => {
      setFallbackReason(reason);
      if (partial) {
        setFormData(sttOutputToForm(partial));
      }
      setVoiceState("manual");
    },
    []
  );

  useEffect(() => {
    try {
      const consent = localStorage.getItem(PIPA_CONSENT_KEY);
      setPipaGranted(consent === "true");
    } catch {
      setPipaGranted(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearRecordingTimer();
      abortControllerRef.current?.abort();
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      releaseMediaStream();
    };
  }, [clearRecordingTimer, releaseMediaStream]);

  const handlePipaAgree = () => {
    try {
      localStorage.setItem(PIPA_CONSENT_KEY, "true");
    } catch {
      /* ignore storage errors */
    }
    setPipaGranted(true);
  };

  const handlePipaDisagree = () => {
    setPipaDenied(true);
  };

  const submitSttAudio = useCallback(
    async (audioFile: File) => {
      setVoiceState("processing");
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const timeoutId = setTimeout(() => controller.abort(), STT_TIMEOUT_MS);

      try {
        const body = new FormData();
        body.append("audio", audioFile);

        const response = await fetch("/api/v1/stt", {
          method: "POST",
          body,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const json = (await response.json()) as SttApiResponse;

        if (!response.ok || !json.success || !json.data) {
          transitionToManual(
            json.error?.message ??
              "음성 인식에 실패했습니다. 수동으로 값을 입력해주세요.",
            json.data
          );
          return;
        }

        setSttResult(json.data);
        setFormData(sttOutputToForm(json.data));
        setVoiceState("result");
      } catch (error) {
        clearTimeout(timeoutId);
        const isTimeout =
          error instanceof DOMException && error.name === "AbortError";
        transitionToManual(
          isTimeout
            ? "AI 분석 시간이 초과되었습니다. 수동 입력으로 전환합니다."
            : "네트워크 오류가 발생했습니다. 수동 입력으로 전환합니다."
        );
      }
    },
    [transitionToManual]
  );

  const stopRecording = useCallback(() => {
    clearRecordingTimer();
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      releaseMediaStream();
      setVoiceState("idle");
    }
  }, [clearRecordingTimer, releaseMediaStream]);

  const startRecording = useCallback(async () => {
    if (voiceState === "listening") {
      stopRecording();
      return;
    }

    if (voiceState !== "idle") return;

    const activationStart = performance.now();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const activationMs = performance.now() - activationStart;

      if (activationMs > MIC_ACTIVATION_TARGET_MS) {
        console.warn(
          `Microphone activation took ${activationMs.toFixed(0)}ms (target < ${MIC_ACTIVATION_TARGET_MS}ms)`
        );
      }

      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = getSupportedMimeType();
      recordingMimeRef.current = mimeType;

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        releaseMediaStream();

        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];

        if (chunks.length === 0) {
          setVoiceState("idle");
          return;
        }

        const resolvedMime =
          recordingMimeRef.current || chunks[0]?.type || "audio/webm";
        const blob = new Blob(chunks, { type: resolvedMime });
        const extension = mimeToExtension(resolvedMime);
        const audioFile = new File([blob], `recording.${extension}`, {
          type: resolvedMime,
        });

        void submitSttAudio(audioFile);
      };

      recorder.onerror = () => {
        releaseMediaStream();
        transitionToManual("녹음 중 오류가 발생했습니다. 수동 입력으로 전환합니다.");
      };

      recorder.start(250);
      setVoiceState("listening");
      setFallbackReason(undefined);

      maxDurationTimerRef.current = setTimeout(() => {
        stopRecording();
      }, MAX_RECORDING_MS);
    } catch (error) {
      releaseMediaStream();

      const isPermissionDenied =
        error instanceof DOMException &&
        (error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError");

      if (isPermissionDenied) {
        toast.error(
          "마이크 사용 권한이 거부되었습니다. 수동 입력으로 전환합니다.",
          { duration: 4000 }
        );
        transitionToManual(
          "마이크 사용 권한이 거부되었습니다. 아래 폼에 직접 입력해주세요."
        );
      } else {
        toast.error("마이크를 사용할 수 없습니다. 수동 입력으로 전환합니다.");
        transitionToManual(
          "마이크 접근에 실패했습니다. 아래 폼에 직접 입력해주세요."
        );
      }
    }
  }, [
    voiceState,
    stopRecording,
    releaseMediaStream,
    submitSttAudio,
    transitionToManual,
  ]);

  const handleSubmitResult = () => {
    toast.success("현장 입력 데이터가 저장되었습니다.", {
      description: `${formData.process_name || "공정"} · 수량 ${formData.quantity || "-"}`,
    });
    setSttResult(null);
    setFormData(sttOutputToForm({}));
    setVoiceState("idle");
  };

  const handleManualSave = () => {
    if (!formData.process_name.trim()) {
      toast.error("공정명을 입력해주세요.");
      return;
    }
    toast.success("수동 입력 데이터가 저장되었습니다.", {
      description: `${formData.process_name} · 수량 ${formData.quantity || "-"}`,
    });
    setFormData(sttOutputToForm({}));
    setFallbackReason(undefined);
    setVoiceState("idle");
  };

  const stateLabel: Record<VoiceState, string> = {
    idle: "터치하여 발화 시작",
    listening: "듣고 있습니다... 다시 터치하여 완료",
    processing: "AI 분석 진행 중...",
    result: "추출 결과를 확인하세요",
    manual: "수동 입력 모드",
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-cyan-500/10" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 left-1/4 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 px-4 py-6 min-h-screen flex flex-col">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={onBackClick}
              className="p-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200 hover:bg-slate-700/80 transition-all"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                Zero-UI 모바일
              </h1>
              <p className="text-xs text-cyan-200/70">현장 음성 입력</p>
            </div>
          </div>

          {/* Smartphone viewport wrapper */}
          <div className="flex-1 flex flex-col rounded-[2rem] border-2 border-slate-600/40 bg-slate-900/40 backdrop-blur-xl shadow-2xl shadow-slate-900/60 overflow-hidden">
            <div className="h-6 flex items-center justify-center">
              <div className="w-20 h-1 rounded-full bg-slate-700/80" />
            </div>

            <div className="flex-1 px-5 pb-8 flex flex-col">
              {pipaGranted === null && (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              )}

              {pipaGranted === false && !pipaDenied && (
                <div className="flex-1 flex items-center">
                  <PipaConsentScreen
                    onAgree={handlePipaAgree}
                    onDisagree={handlePipaDisagree}
                  />
                </div>
              )}

              {pipaDenied && (
                <div className="flex-1 flex items-center">
                  <Alert className="bg-red-500/10 border-red-500/30 text-red-100">
                    <AlertCircle className="text-red-400" />
                    <AlertTitle className="text-red-200">접근 제한</AlertTitle>
                    <AlertDescription className="text-red-100/80">
                      개인정보 및 음성 데이터 처리에 동의하지 않아 Zero-UI 음성
                      입력 기능을 사용할 수 없습니다.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {pipaGranted === true && voiceState === "manual" && (
                <div className="flex-1 flex items-center py-4">
                  <ManualInputForm
                    formData={formData}
                    onChange={setFormData}
                    onSave={handleManualSave}
                    fallbackReason={fallbackReason}
                  />
                </div>
              )}

              {pipaGranted === true && voiceState !== "manual" && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <p className="text-sm text-cyan-200/80 mb-8 text-center px-4">
                    {stateLabel[voiceState]}
                  </p>

                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ripple rings — listening state */}
                    <AnimatePresence>
                      {voiceState === "listening" && (
                        <>
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="absolute rounded-full border-2 border-cyan-400/40"
                              initial={{ width: 96, height: 96, opacity: 0.6 }}
                              animate={{
                                width: 200 + i * 24,
                                height: 200 + i * 24,
                                opacity: 0,
                              }}
                              transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                delay: i * 0.4,
                                ease: "easeOut",
                              }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>

                    {voiceState === "processing" ? (
                      <div className="w-28 h-28 rounded-full bg-slate-800/80 border border-cyan-500/30 flex items-center justify-center shadow-xl shadow-cyan-500/20">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                      </div>
                    ) : voiceState === "result" && sttResult ? (
                      <Card className="w-full bg-slate-800/80 backdrop-blur-2xl border-slate-600/50 text-white shadow-xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2 text-emerald-300">
                            <CheckCircle2 className="w-5 h-5" />
                            추출 결과
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-slate-700/50 pb-2">
                            <span className="text-slate-400">공정명</span>
                            <span className="font-medium">{sttResult.process_name}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700/50 pb-2">
                            <span className="text-slate-400">작업 수량</span>
                            <span className="font-medium">{sttResult.quantity}</span>
                          </div>
                          {sttResult.defect_code && (
                            <div className="flex justify-between border-b border-slate-700/50 pb-2">
                              <span className="text-slate-400">불량 코드</span>
                              <span className="font-medium">{sttResult.defect_code}</span>
                            </div>
                          )}
                          {sttResult.notes && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">특이 사항</span>
                              <span className="font-medium text-right max-w-[60%]">
                                {sttResult.notes}
                              </span>
                            </div>
                          )}
                          <Button
                            onClick={handleSubmitResult}
                            className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                          >
                            제출
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={() => void startRecording()}
                        className="relative w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40 border border-cyan-300/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/40"
                        whileTap={{ scale: 0.95 }}
                        animate={
                          voiceState === "listening"
                            ? { boxShadow: "0 0 40px rgba(34, 211, 238, 0.6)" }
                            : { boxShadow: "0 0 24px rgba(34, 211, 238, 0.3)" }
                        }
                        aria-label="마이크 버튼"
                      >
                        <Mic className="w-12 h-12 text-white" />
                      </motion.button>
                    )}
                  </div>

                  {voiceState === "listening" && <WaveformBars />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toaster richColors position="top-center" />
    </div>
  );
}
