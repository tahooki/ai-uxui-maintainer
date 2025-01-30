export interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

export interface LighthouseAudit {
  score: number;
  title: string;
  description: string;
  warnings?: string[];
  details?: any;
}

export interface LighthouseReport {
  id: string;
  url: string;
  timestamp: Date;
  metrics: LighthouseMetrics;
  audits: {
    [key: string]: LighthouseAudit;
  };
  htmlReport: string;
}

export interface LighthouseResult {
  success: boolean;
  data?: LighthouseReport;
  error?: string;
}
