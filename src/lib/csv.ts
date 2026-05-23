import Papa from 'papaparse';
import { z } from 'zod';

// CSV 파싱 결과 타입
export interface ParseCsvResult<T> {
  data: T[];
  errors: {
    row: number;
    column: string;
    message: string;
  }[];
}

// ─── 1. Zod CSV 로우 스키마 정의 ───────────────────────────

// boolean 문자열 변환용 helper
const booleanSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    const lower = val.trim().toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }
  return val;
}, z.boolean({ invalid_type_error: 'TRUE 또는 FALSE 여야 합니다.' }));

// number 변환용 helper
const numberSchema = (fieldName: string) => z.preprocess((val) => {
  if (typeof val === 'string' && val.trim() !== '') {
    const num = Number(val);
    if (!isNaN(num)) return num;
  }
  return val;
}, z.number({ invalid_type_error: `${fieldName}은 숫자여야 합니다.` }));

// date 변환용 helper
const dateSchema = (fieldName: string) => z.preprocess((val) => {
  if (typeof val === 'string' && val.trim() !== '') {
    const date = new Date(val);
    if (!isNaN(date.getTime())) return date;
  }
  return val;
}, z.date({ invalid_type_error: `${fieldName}은 올바른 날짜 형식(YYYY-MM-DD)이어야 합니다.` }));

export const ProductCsvSchema = z.object({
  product_code: z.string().min(1, '제품코드는 필수입니다.').regex(/^[A-Z0-9]+$/, '제품코드는 영문 대문자와 숫자만 가능합니다.'),
  product_name: z.string().min(1, '제품명은 필수입니다.').max(100, '제품명은 최대 100자까지 가능합니다.'),
  specification: z.string().optional().nullable().transform(v => v || null),
  unit: z.string().min(1, '단위는 필수입니다.'),
  client_code: z.string().optional().nullable().transform(v => {
    if (!v) return null;
    const trimmed = v.trim();
    return trimmed === '' ? null : trimmed;
  }).refine(val => val === null || /^[A-Z0-9]+$/.test(val), {
    message: '고객사코드는 영문 대문자와 숫자만 가능합니다.'
  }),
  is_active: booleanSchema.default(true),
});

export const ProcessCsvSchema = z.object({
  process_code: z.string().min(1, '공정코드는 필수입니다.').regex(/^[A-Z0-9]+$/, '공정코드는 영문 대문자와 숫자만 가능합니다.'),
  process_name: z.string().min(1, '공정명은 필수입니다.').max(100, '공정명은 최대 100자까지 가능합니다.'),
  line_code: z.string().min(1, '담당라인은 필수입니다.'),
  cycle_time_sec: numberSchema('사이클타임').pipe(
    z.number().int('사이클타임은 정수여야 합니다.').positive('사이클타임은 0보다 큰 양수여야 합니다.')
  ),
  defect_codes: z.string().optional().nullable().transform(v => v || null),
});

export const BomCsvSchema = z.object({
  parent_item_code: z.string().min(1, '상위제품코드는 필수입니다.'),
  child_item_code: z.string().min(1, '하위부품코드는 필수입니다.'),
  quantity: numberSchema('수량').pipe(
    z.number().positive('수량은 0보다 큰 양수여야 합니다.')
  ),
  unit: z.string().min(1, '단위는 필수입니다.'),
  valid_from: dateSchema('유효시작일'),
  valid_to: z.union([dateSchema('유효종료일'), z.literal('')]).optional().nullable().transform(v => {
    if (v instanceof Date) return v;
    return null;
  }),
}).refine(data => {
  if (data.valid_to && data.valid_from) {
    return data.valid_to >= data.valid_from;
  }
  return true;
}, {
  message: '유효종료일은 유효시작일 이후여야 합니다.',
  path: ['valid_to'],
});

export const DefectCsvSchema = z.object({
  defect_code: z.string().min(1, '불량코드는 필수입니다.').regex(/^[A-Z0-9]+$/, '불량코드는 영문 대문자와 숫자만 가능합니다.'),
  defect_name: z.string().min(1, '불량명은 필수입니다.').max(100, '불량명은 최대 100자까지 가능합니다.'),
  category: z.enum(['MAN', 'MACHINE', 'MATERIAL', 'METHOD'], {
    errorMap: () => ({ message: '카테고리는 MAN, MACHINE, MATERIAL, METHOD 중 하나여야 합니다.' }),
  }),
  severity: z.enum(['S', 'A', 'B', 'C'], {
    errorMap: () => ({ message: '심각도는 S, A, B, C 중 하나여야 합니다.' }),
  }),
});

// CSV 파싱 및 검증 메인 함수
export function parseAndValidateCsv<T>(
  csvContent: string,
  schema: z.ZodSchema<T>
): ParseCsvResult<T> {
  const parsed = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header: string) => header.trim(),
  } as any) as any;

  const validData: T[] = [];
  const errors: { row: number; column: string; message: string }[] = [];

  if (parsed.errors && parsed.errors.length > 0) {
    parsed.errors.forEach(err => {
      errors.push({
        row: (err.row ?? 0) + 2, // 1-indexed 및 헤더 포함
        column: err.code,
        message: err.message,
      });
    });
    // 치명적 구문 분석 에러가 있으면 빈 결과 반환
    if (errors.length > 0) {
      return { data: [], errors };
    }
  }

  // 데이터 검증
  parsed.data.forEach((row, index) => {
    const rowNum = index + 2; // 엑셀/CSV 행 기준 (1-indexed + 헤더 1행)
    const result = schema.safeParse(row);

    if (result.success) {
      validData.push(result.data);
    } else {
      result.error.issues.forEach(issue => {
        errors.push({
          row: rowNum,
          column: issue.path.join('.') || 'unknown',
          message: issue.message,
        });
      });
    }
  });

  return { data: validData, errors };
}
