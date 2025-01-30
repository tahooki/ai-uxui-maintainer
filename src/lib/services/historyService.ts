import { createClient } from "@supabase/supabase-js";
import { AnalysisHistory, HistoryQueryParams } from "../types/analysis";

export class HistoryService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  async getAnalysisHistory({
    page = 1,
    limit = 10,
    sortBy = "date",
    order = "desc",
  }: HistoryQueryParams): Promise<AnalysisHistory> {
    const offset = (page - 1) * limit;

    // Count total records
    const { count } = await this.supabase
      .from("analyses")
      .select("*", { count: "exact", head: true });

    // Get paginated records
    const { data: analyses, error } = await this.supabase
      .from("analyses")
      .select("*")
      .order(
        sortBy === "date" ? "timestamp" : "analysis->accessibility->score",
        {
          ascending: order === "asc",
        }
      )
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error("Failed to fetch analysis history");
    }

    return {
      analyses: analyses || [],
      totalCount: count || 0,
      pageCount: Math.ceil((count || 0) / limit),
    };
  }
}
