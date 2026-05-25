"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft, Database, Upload, Download, FileText,
  CheckCircle2, AlertCircle, XCircle, Loader2, RefreshCw,
  AlertTriangle, Clock, FileSpreadsheet, Trash2
} from 'lucide-react';
import { toast } from 'sonner';

import { cn } from './ui/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose
} from './ui/dialog';
import { Progress } from './ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from './ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from './ui/table';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Toaster } from './ui/sonner';

type ImportType = 'product' | 'process' | 'bom' | 'defect';
type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface BulkImportJob {
  job_id: string;
  fileName: string;
  importType: ImportType;
  status: JobStatus;
  total_rows: number;
  processed_rows: number;
  success_count: number;
  failed_count: number;
  createdAt: string;
}

interface BulkImportError {
  row: number;
  column: string;
  message: string;
}

interface BulkImportPageProps {
  onBackClick?: () => void;
}

const TEMPLATES: Record<ImportType, { columns: string[]; filename: string }> = {
  product: {
    columns: ['product_code', 'product_name', 'specification', 'unit', 'client_code', 'is_active'],
    filename: 'product_template.csv'
  },
  process: {
    columns: ['process_code', 'process_name', 'line_code', 'cycle_time_sec', 'defect_codes'],
    filename: 'process_template.csv'
  },
  bom: {
    columns: ['parent_item_code', 'child_item_code', 'quantity', 'unit', 'valid_from', 'valid_to'],
    filename: 'bom_template.csv'
  },
  defect: {
    columns: ['defect_code', 'defect_name', 'category', 'severity'],
    filename: 'defect_template.csv'
  }
};

const IMPORT_TYPE_LABELS: Record<ImportType, string> = {
  product: '제품(Product)',
  process: '공정(Process)',
  bom: 'BOM',
  defect: '불량(Defect)'
};

function formatDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function StatusBadge({ status }: { status: JobStatus }) {
  const config: Record<JobStatus, { label: string; className: string; icon: typeof Loader2 }> = {
    pending: {
      label: '대기',
      className: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
      icon: Clock
    },
    processing: {
      label: '처리중',
      className: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: Loader2
    },
    completed: {
      label: '완료',
      className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: CheckCircle2
    },
    failed: {
      label: '실패',
      className: 'bg-red-500/20 text-red-300 border-red-500/40',
      icon: XCircle
    }
  };
  const { label, className, icon: Icon } = config[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border', className)}>
      <Icon className={cn('w-3.5 h-3.5', status === 'processing' && 'animate-spin')} />
      {label}
    </span>
  );
}

function generateCsv(columns: string[]): string {
  return '\uFEFF' + columns.join(',') + '\n';
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function BulkImportPage({ onBackClick }: BulkImportPageProps) {
  const [history, setHistory] = useState<BulkImportJob[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [importType, setImportType] = useState<ImportType>('product');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pollingJobId, setPollingJobId] = useState<string | null>(null);
  const [pollingProgress, setPollingProgress] = useState(0);
  const [pollingStatus, setPollingStatus] = useState<JobStatus | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    status: 'success' | 'partial' | 'failed';
    success_count: number;
    error_count: number;
    errorMessage?: string;
    jobId?: string;
  } | null>(null);
  const [selectedJob, setSelectedJob] = useState<BulkImportJob | null>(null);
  const [errorDetailOpen, setErrorDetailOpen] = useState(false);
  const [errorRows, setErrorRows] = useState<BulkImportError[]>([]);
  const [isErrorLoading, setIsErrorLoading] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch('/api/v1/bulk-imports');
      const json = await res.json();
      if (json.success) {
        setHistory(json.data.list ?? []);
      }
    } catch {
      // silent
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (!pollingJobId) return;
    const poll = async () => {
      try {
        const res = await fetch(`/api/v1/bulk-imports/${pollingJobId}`);
        const json = await res.json();
        if (json.success) {
          const d = json.data;
          setPollingStatus(d.status);
          const pct = d.total_rows > 0 ? Math.round((d.processed_rows / d.total_rows) * 100) : 0;
          setPollingProgress(pct);
          if (d.status === 'completed' || d.status === 'failed') {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setIsUploading(false);
            setPollingJobId(null);
            if (d.status === 'completed') {
              if (d.failed_count > 0) {
                setUploadResult({
                  status: 'partial',
                  success_count: d.success_count,
                  error_count: d.failed_count,
                  jobId: pollingJobId
                });
              } else {
                setUploadResult({
                  status: 'success',
                  success_count: d.success_count,
                  error_count: 0
                });
              }
            } else {
              setUploadResult({
                status: 'failed',
                success_count: d.success_count,
                error_count: d.failed_count,
                errorMessage: '서버 처리 중 오류가 발생했습니다.',
                jobId: pollingJobId
              });
            }
            fetchHistory();
          }
        }
      } catch {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setIsUploading(false);
        setPollingJobId(null);
        setUploadResult({
          status: 'failed',
          success_count: 0,
          error_count: 0,
          errorMessage: '서버 연결에 실패했습니다.'
        });
      }
    };
    pollingRef.current = setInterval(poll, 2000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [pollingJobId, fetchHistory]);

  useEffect(() => {
    if (uploadResult?.status === 'partial' && uploadResult.jobId) {
      (async () => {
        try {
          const res = await fetch(`/api/v1/bulk-imports/${uploadResult.jobId}/failures`);
          const json = await res.json();
          if (json.success) {
            setErrorRows(json.data.errors ?? []);
          }
        } catch {
          // silent
        }
      })();
    }
  }, [uploadResult]);

  const handleFileSelect = (file: File | null) => {
    if (!file) { setSelectedFile(null); return; }
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('CSV 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('파일 크기는 10MB 이하여야 합니다.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file ?? null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) { toast.error('파일을 선택해주세요.'); return; }
    setIsUploading(true);
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('import_type', importType);
      const res = await fetch('/api/v1/bulk-imports', { method: 'POST', body: formData });
      const json = await res.json();
      if (!json.success) {
        setIsUploading(false);
        setUploadResult({
          status: 'failed',
          success_count: 0,
          error_count: 0,
          errorMessage: json.message || '파일 업로드에 실패했습니다.'
        });
        return;
      }
      setPollingJobId(json.data.job_id);
      setPollingProgress(0);
      setPollingStatus('pending');
    } catch {
      setIsUploading(false);
      setUploadResult({
        status: 'failed',
        success_count: 0,
        error_count: 0,
        errorMessage: '네트워크 오류가 발생했습니다.'
      });
    }
  };

  const handleTemplateDownload = () => {
    const template = TEMPLATES[importType];
    downloadCsv(generateCsv(template.columns), template.filename);
  };

  const handleRowClick = async (job: BulkImportJob) => {
    setSelectedJob(job);
    if (job.failed_count > 0) {
      setIsErrorLoading(true);
      setErrorDetailOpen(true);
      try {
        const res = await fetch(`/api/v1/bulk-imports/${job.job_id}/failures`);
        const json = await res.json();
        if (json.success) {
          setErrorRows(json.data.errors ?? []);
        } else {
          setErrorRows([]);
        }
      } catch {
        setErrorRows([]);
      } finally {
        setIsErrorLoading(false);
      }
    }
  };

  const handleErrorCsvDownload = (jobIdOverride?: string) => {
    if (!errorRows.length) return;
    const header = 'Row,Column,Message\n';
    const rows = errorRows.map(e => `${e.row},"${e.column}","${e.message}"`).join('\n');
    const id = jobIdOverride || selectedJob?.job_id || 'unknown';
    downloadCsv('\uFEFF' + header + rows, `errors_${id}.csv`);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setImportType('product');
    setUploadResult(null);
    setPollingProgress(0);
    setPollingStatus(null);
    setPollingJobId(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadDialogOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Toaster />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-cyan-500/10" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-cyan-400/25 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 px-6 py-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6 p-4 rounded-2xl bg-slate-800/80 backdrop-blur-2xl border border-slate-600/50 shadow-xl shadow-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackClick}
                className="p-2 rounded-xl bg-slate-700/80 backdrop-blur-xl border border-slate-500/50 text-slate-200 hover:bg-slate-600/80 hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-xl">
                  대량 기준정보 업로드 (Bulk Import)
                </h1>
                <p className="text-sm text-cyan-200/80">CSV 파일로 마스터 데이터를 대량 등록합니다</p>
              </div>
            </div>
            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white border-0 shadow-lg shadow-purple-600/30"
            >
              <Upload className="w-4 h-4" />
              + 새 파일 업로드
            </Button>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-slate-600/50 shadow-2xl shadow-slate-900/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                업로드 이력
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchHistory}
                disabled={isHistoryLoading}
                className="border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <RefreshCw className={cn('w-4 h-4 mr-1', isHistoryLoading && 'animate-spin')} />
                새로고침
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="text-slate-400 font-semibold">파일명</TableHead>
                  <TableHead className="text-slate-400 font-semibold">유형</TableHead>
                  <TableHead className="text-slate-400 font-semibold">상태</TableHead>
                  <TableHead className="text-slate-400 font-semibold">성공</TableHead>
                  <TableHead className="text-slate-400 font-semibold">실패</TableHead>
                  <TableHead className="text-slate-400 font-semibold">업로드 일시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isHistoryLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                      <p className="text-slate-400 mt-2 text-sm">불러오는 중...</p>
                    </TableCell>
                  </TableRow>
                )}
                {!isHistoryLoading && history.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                      <p className="text-slate-500">업로드 이력이 없습니다.</p>
                      <p className="text-slate-600 text-sm mt-1">새 파일을 업로드해보세요.</p>
                    </TableCell>
                  </TableRow>
                )}
                {!isHistoryLoading && history.map((job) => (
                  <TableRow
                    key={job.job_id}
                    className={cn(
                      'border-slate-700/50 cursor-pointer transition-colors',
                      job.failed_count > 0
                        ? 'hover:bg-red-900/20'
                        : job.status === 'completed'
                          ? 'hover:bg-emerald-900/20'
                          : 'hover:bg-slate-700/30'
                    )}
                    onClick={() => handleRowClick(job)}
                  >
                    <TableCell className="text-slate-200 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        {job.fileName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {IMPORT_TYPE_LABELS[job.importType]}
                      </Badge>
                    </TableCell>
                    <TableCell><StatusBadge status={job.status} /></TableCell>
                    <TableCell>
                      <span className="text-emerald-400 font-semibold">{job.success_count ?? 0}</span>
                    </TableCell>
                    <TableCell>
                      {job.failed_count > 0 ? (
                        <span className="text-red-400 font-semibold">{job.failed_count}</span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {formatDate(job.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={(open) => { if (!open) resetUpload(); }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">새 파일 업로드</DialogTitle>
            <DialogDescription className="text-slate-400">
              CSV 파일을 선택하여 마스터 데이터를 대량 등록합니다.
            </DialogDescription>
          </DialogHeader>

          {uploadResult ? (
            <div className="space-y-4">
              {uploadResult.status === 'success' && (
                <Alert className="bg-emerald-900/30 border-emerald-700/50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <AlertTitle className="text-emerald-300">업로드 완료</AlertTitle>
                  <AlertDescription className="text-emerald-200/80">
                    {uploadResult.success_count}건의 데이터가 전원 성공적으로 업로드되었습니다.
                  </AlertDescription>
                </Alert>
              )}
              {uploadResult.status === 'partial' && (
                <div className="space-y-4">
                  <Alert className="bg-orange-900/30 border-orange-700/50">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <AlertTitle className="text-orange-300">일부 오류 발생</AlertTitle>
                    <AlertDescription className="text-orange-200/80">
                      {uploadResult.success_count}건 성공, {uploadResult.error_count}건 에러 발생
                    </AlertDescription>
                  </Alert>
                  <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                      <h4 className="text-sm font-semibold text-slate-200">에러 상세</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-800/50 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                        onClick={() => handleErrorCsvDownload(uploadResult?.jobId)}
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        오류 CSV 다운로드
                      </Button>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700/50">
                            <TableHead className="text-slate-400 text-xs">Row</TableHead>
                            <TableHead className="text-slate-400 text-xs">Column</TableHead>
                            <TableHead className="text-slate-400 text-xs">Error</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {errorRows.map((err, i) => (
                            <TableRow key={i} className="border-slate-700/50">
                              <TableCell className="text-slate-300 text-sm">{err.row}</TableCell>
                              <TableCell className="text-slate-300 text-sm">{err.column}</TableCell>
                              <TableCell className="text-red-300 text-sm">{err.message}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
              {uploadResult.status === 'failed' && (
                <Alert variant="destructive" className="bg-red-900/30 border-red-700/50">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <AlertTitle className="text-red-300">업로드 실패</AlertTitle>
                  <AlertDescription className="text-red-200/80">
                    {uploadResult.errorMessage || '알 수 없는 오류가 발생했습니다.'}
                  </AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button
                  onClick={resetUpload}
                  className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white border-0"
                >
                  확인
                </Button>
              </DialogFooter>
            </div>
          ) : isUploading || pollingJobId ? (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin mx-auto text-cyan-400 mb-3" />
                <p className="text-slate-200 font-semibold">파일 처리 중...</p>
                <p className="text-slate-400 text-sm mt-1">
                  {pollingStatus === 'pending' ? '대기열에 등록되었습니다.' : '데이터를 처리하고 있습니다.'}
                </p>
              </div>
              <div className="space-y-2 px-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>진행률</span>
                  <span>{pollingProgress}%</span>
                </div>
                <Progress value={pollingProgress} className="h-2 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" />
              </div>
              <p className="text-xs text-slate-500 text-center">완료될 때까지 자동으로 갱신됩니다.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">등록 유형</label>
                <Select value={importType} onValueChange={(v) => setImportType(v as ImportType)}>
                  <SelectTrigger className="w-full bg-slate-800/80 border-slate-600 text-slate-200">
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-slate-200">
                    {Object.entries(IMPORT_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">CSV 템플릿 양식</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTemplateDownload}
                  className="border-slate-600/50 text-cyan-300 hover:text-cyan-200 hover:bg-slate-700/50"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  템플릿 다운로드
                </Button>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300',
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : selectedFile
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-slate-600/50 hover:border-slate-500 bg-slate-800/30'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                />
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileText className="w-10 h-10 mx-auto text-emerald-400" />
                    <p className="text-emerald-300 font-semibold">{selectedFile.name}</p>
                    <p className="text-slate-400 text-sm">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="text-xs text-red-400 hover:text-red-300 mt-1 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> 파일 제거
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 mx-auto text-slate-500" />
                    <p className="text-slate-300 font-medium">
                      클릭 또는 파일을 드래그하여 업로드
                    </p>
                    <p className="text-slate-500 text-sm">
                      CSV 파일만 가능 (최대 10MB)
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50">
                    취소
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white border-0"
                >
                  <Upload className="w-4 h-4" />
                  업로드 시작
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={errorDetailOpen} onOpenChange={setErrorDetailOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">에러 상세</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedJob?.fileName} - {IMPORT_TYPE_LABELS[selectedJob?.importType ?? 'product']}
            </DialogDescription>
          </DialogHeader>

          {isErrorLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            </div>
          ) : errorRows.length > 0 ? (
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">총 {errorRows.length}건의 에러</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-800/50 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                  onClick={() => handleErrorCsvDownload()}
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  CSV 다운로드
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700/50">
                    <TableHead className="text-slate-400">Row</TableHead>
                    <TableHead className="text-slate-400">Column</TableHead>
                    <TableHead className="text-slate-400">Error Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errorRows.map((err, i) => (
                    <TableRow key={i} className="border-slate-700/50">
                      <TableCell className="text-slate-200">{err.row}</TableCell>
                      <TableCell className="text-slate-200">{err.column}</TableCell>
                      <TableCell className="text-red-300">{err.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Alert className="bg-slate-800 border-slate-700">
              <AlertCircle className="w-5 h-5 text-slate-400" />
              <AlertTitle className="text-slate-300">에러 정보 없음</AlertTitle>
              <AlertDescription className="text-slate-400">
                저장된 에러 상세 정보가 없습니다.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="mt-4 pt-4 border-t border-slate-700/50">
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50">
                닫기
              </Button>
            </DialogClose>
            {errorRows.length > 0 && (
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white border-0"
                onClick={() => handleErrorCsvDownload()}
              >
                <Download className="w-4 h-4 mr-1" />
                에러 CSV 다운로드
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
