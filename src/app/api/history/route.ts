import { HistoryService } from "@/lib/services/historyService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = (searchParams.get("sortBy") || "date") as "date" | "score";
    const order = (searchParams.get("order") || "desc") as "asc" | "desc";

    const historyService = new HistoryService();
    const history = await historyService.getAnalysisHistory({
      page,
      limit,
      sortBy,
      order,
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("History API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
