import { prisma } from "@/lib/db/prisma";
import { supabase } from "@/lib/db/supabase";
import { Alert, MonitoringData, PerformanceMetrics } from "../types/monitoring";

export class MonitoringService {
  private static ALERT_THRESHOLDS = {
    lighthouse: 0.7,
    accessibility: 0.8,
    loadTime: 3000, // 3초
  };

  async getMonitoringData(url: string): Promise<MonitoringData> {
    // Prisma로 기본 메트릭 데이터 조회
    const currentMetrics = await prisma.performanceMetric.findFirst({
      where: { url },
      orderBy: { timestamp: "desc" },
    });

    // Supabase로 실시간 데이터 조회
    const { data: historicalData } = await supabase
      .from("performance_metrics")
      .select("*")
      .eq("url", url)
      .gte(
        "timestamp",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      )
      .order("timestamp", { ascending: true });

    // 알림은 Prisma로 관리
    const alerts = await prisma.alert.findMany({
      where: {
        url,
        resolved: false,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return {
      currentMetrics: currentMetrics!,
      historicalData: historicalData || [],
      alerts: alerts || [],
    };
  }

  async checkAndCreateAlerts(metrics: PerformanceMetrics, url: string) {
    const alerts: Alert[] = [];

    // Lighthouse 점수 체크
    if (
      metrics.lighthouseScore < MonitoringService.ALERT_THRESHOLDS.lighthouse
    ) {
      alerts.push({
        id: crypto.randomUUID(),
        type: "performance",
        severity: "high",
        message: `Lighthouse score is below threshold: ${metrics.lighthouseScore}`,
        timestamp: new Date(),
        resolved: false,
      });
    }

    // 접근성 점수 체크
    if (
      metrics.accessibilityScore <
      MonitoringService.ALERT_THRESHOLDS.accessibility
    ) {
      alerts.push({
        id: crypto.randomUUID(),
        type: "accessibility",
        severity: "medium",
        message: `Accessibility score needs improvement: ${metrics.accessibilityScore}`,
        timestamp: new Date(),
        resolved: false,
      });
    }

    // 로드 시간 체크
    if (metrics.loadTime > MonitoringService.ALERT_THRESHOLDS.loadTime) {
      alerts.push({
        id: crypto.randomUUID(),
        type: "performance",
        severity: "medium",
        message: `Page load time is too high: ${metrics.loadTime}ms`,
        timestamp: new Date(),
        resolved: false,
      });
    }

    if (alerts.length > 0) {
      // Prisma로 알림 저장
      await prisma.alert.createMany({
        data: alerts,
      });

      // Supabase로 실시간 알림 전송
      await supabase.from("alerts").insert(alerts);
    }
  }
}
