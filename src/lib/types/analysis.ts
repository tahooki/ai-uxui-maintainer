export interface DesignAnalysis {
  id: string;
  url: string;
  screenshot: string;
  analysis: {
    accessibility: {
      score: number;
      issues: string[];
    };
    usability: {
      score: number;
      suggestions: string[];
    };
    visualDesign: {
      score: number;
      improvements: string[];
    };
  };
  timestamp: Date;
}

export interface AnalysisResult {
  success: boolean;
  data?: DesignAnalysis;
  error?: string;
}

export interface AnalysisHistory {
  analyses: DesignAnalysis[];
  totalCount: number;
  pageCount: number;
}

export interface HistoryQueryParams {
  page?: number;
  limit?: number;
  sortBy?: "date" | "score";
  order?: "asc" | "desc";
}
