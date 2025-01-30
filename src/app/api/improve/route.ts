import { ImprovementService } from "@/lib/services/improvementService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, analysisId } = await request.json();

    if (!url || !analysisId) {
      return NextResponse.json(
        { error: "URL and analysisId are required" },
        { status: 400 }
      );
    }

    const improvementService = new ImprovementService();
    const result = await improvementService.improveCSS(url, analysisId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Improvement API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
