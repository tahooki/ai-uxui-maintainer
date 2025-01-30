import { createClient } from "@supabase/supabase-js";
import { Alert, MonitoringData, PerformanceMetrics } from "../types/monitoring";

export class MonitoringService {
  private supabase;
  private static ALERT_THRESHOLDS = {
    lighthouse: 0.7,
    accessibility: 0.8,
    loadTime: 3000, // 3초
  };

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  async getMonitoringData(url: string): Promise<MonitoringData> {
    // 최신 메트릭 데이터 조회
    const { data: currentMetrics } = await this.supabase
      .from("performance_metrics")
      .select("*")
      .eq("url", url)
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    // 히스토리 데이터 조회 (최근 24시간)
    const { data: historicalData } = await this.supabase
      .from("performance_metrics")
      .select("*")
      .eq("url", url)
      .gte(
        "timestamp",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      )
      .order("timestamp", { ascending: true });

    // 활성화된 알림 조회
    const { data: alerts } = await this.supabase
      .from("alerts")
      .select("*")
      .eq("url", url)
      .eq("resolved", false)
      .order("timestamp", { ascending: false });

    return {
      currentMetrics,
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

    // 알림 저장
    if (alerts.length > 0) {
      await this.supabase.from("alerts").insert(alerts);
    }
  }
}
