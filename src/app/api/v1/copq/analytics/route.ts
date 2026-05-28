import { NextRequest, NextResponse } from 'next/server';
import { handleRouteError, AppError } from '@/lib/errors';
import { PrismaClient } from '@prisma/client';
import { syncCopqMetrics } from '@/lib/copq/calculator';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // 1. 사용자 인증 확인
    const mockUserCookie = request.cookies.get('mock-user');
    if (!mockUserCookie?.value) {
      throw new AppError(
        'AUTH_401_UNAUTHORIZED_ACCESS',
        '로그인이 필요합니다.',
        401
      );
    }
    const mockUser = JSON.parse(mockUserCookie.value);
    const tenantId = mockUser.tenant_id;

    // 2. Query Parameters 추출 및 검증
    const { searchParams } = new URL(request.url);
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    if (!startDateStr || !endDateStr) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '시작일(startDate)과 종료일(endDate)은 필수 입력 파라미터입니다.',
        400
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '올바르지 않은 날짜 형식입니다. (YYYY-MM-DD)',
        400
      );
    }

    if (startDate > endDate) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '시작일은 종료일보다 이전이어야 합니다.',
        400
      );
    }

    // 3. COPQ 캐시 테이블 동기화 (최근 데이터 기준 계산 및 Upsert)
    await syncCopqMetrics(tenantId, startDate, endDate);

    // 4. CopqMetric 테이블에서 데이터 조회
    const metrics = await prisma.copqMetric.findMany({
      where: {
        tenantId,
        measuredAt: {
          gte: new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), 0, 0, 0, 0)),
          lte: new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 23, 59, 59, 999)),
        },
      },
      orderBy: {
        measuredAt: 'asc',
      },
    });

    // 5. 응답 포맷팅
    // 일자별 그룹화 데이터 구축
    const dailyMap: Record<string, Record<string, number>> = {};
    
    // 요청 기간 내 모든 날짜를 키로 초기화 (0원 기본값 적용)
    const cur = new Date(startDate.getTime());
    while (cur <= endDate) {
      const dateKey = cur.toISOString().split('T')[0];
      dailyMap[dateKey] = {
        defect: 0,
        rework: 0,
        waiting: 0,
        overproduction: 0,
      };
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    // DB에서 조회한 값을 날짜별 맵에 매핑
    metrics.forEach(m => {
      const dateKey = m.measuredAt.toISOString().split('T')[0];
      if (dailyMap[dateKey]) {
        const costNum = Number(m.costValue);
        dailyMap[dateKey][m.wasteType] = costNum;
      }
    });

    // daily 리스트 및 전체 요약(summary) 빌드
    const dailyList: any[] = [];
    const summary = {
      defect: 0,
      rework: 0,
      waiting: 0,
      overproduction: 0,
      total: 0,
    };

    Object.entries(dailyMap).forEach(([dateStr, wastes]) => {
      const dailyTotal = wastes.defect + wastes.rework + wastes.waiting + wastes.overproduction;
      dailyList.push({
        date: dateStr,
        ...wastes,
        total: dailyTotal,
      });

      summary.defect += wastes.defect;
      summary.rework += wastes.rework;
      summary.waiting += wastes.waiting;
      summary.overproduction += wastes.overproduction;
      summary.total += dailyTotal;
    });

    return NextResponse.json({
      success: true,
      data: {
        summary,
        daily: dailyList,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
