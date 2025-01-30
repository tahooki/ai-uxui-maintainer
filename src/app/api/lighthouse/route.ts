import { LighthouseService } from "@/lib/services/lighthouseService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const lighthouseService = new LighthouseService();
    const result = await lighthouseService.analyzePage(url);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Lighthouse API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
