export interface PerformanceMetrics {
  timestamp: Date;
  lighthouseScore: number;
  accessibilityScore: number;
  loadTime: number;
  uiScore: number;
}

export interface Alert {
  id: string;
  type: "performance" | "accessibility" | "ui";
  severity: "low" | "medium" | "high";
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface MonitoringData {
  currentMetrics: PerformanceMetrics;
  historicalData: PerformanceMetrics[];
  alerts: Alert[];
}
