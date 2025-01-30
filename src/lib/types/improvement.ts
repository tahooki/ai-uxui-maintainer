export interface CSSImprovement {
  id: string;
  analysisId: string;
  originalCSS: string;
  improvedCSS: string;
  improvements: {
    description: string;
    before: string;
    after: string;
  }[];
  score: number;
  timestamp: Date;
}

export interface ImprovementSuggestion {
  success: boolean;
  data?: CSSImprovement;
  error?: string;
}
