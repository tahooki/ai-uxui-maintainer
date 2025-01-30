import { prisma } from "@/lib/db/prisma";
import { supabase } from "@/lib/db/supabase";
import { AnalysisHistory, HistoryQueryParams } from "../types/analysis";

export class HistoryService {
  async getAnalysisHistory({
    page = 1,
    limit = 10,
    sortBy = "date",
    order = "desc",
  }: HistoryQueryParams): Promise<AnalysisHistory> {
    const skip = (page - 1) * limit;

    // Prisma를 사용하여 분석 기록 조회
    const [analyses, totalCount] = await Promise.all([
      prisma.analysis.findMany({
        skip,
        take: limit,
        orderBy: {
          [sortBy === "date" ? "timestamp" : "analysis"]: order,
        },
        include: {
          improvements: true,
        },
      }),
      prisma.analysis.count(),
    ]);

    // Supabase를 사용하여 실시간 메트릭 데이터 조회
    const { data: metrics } = await supabase
      .from("performance_metrics")
      .select("*")
      .in(
        "analysis_id",
        analyses.map((a) => a.id)
      );

    return {
      analyses: analyses.map((analysis) => ({
        ...analysis,
        metrics: metrics?.find((m) => m.analysis_id === analysis.id) || null,
      })),
      totalCount,
      pageCount: Math.ceil(totalCount / limit),
    };
  }
}
