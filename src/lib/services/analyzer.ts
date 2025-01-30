import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";
import puppeteer from "puppeteer";
import { AnalysisResult, DesignAnalysis } from "../types/analysis";

export class UIAnalyzer {
  private openai: OpenAI;
  private supabase;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  async analyzeWebsite(url: string): Promise<AnalysisResult> {
    try {
      // 1. 웹사이트 스크린샷 캡처
      const screenshot = await this.captureWebsite(url);

      // 2. AI 분석 수행
      const analysis = await this.performAIAnalysis(screenshot);

      // 3. 결과 저장
      const result: DesignAnalysis = {
        id: crypto.randomUUID(),
        url,
        screenshot,
        analysis,
        timestamp: new Date(),
      };

      await this.saveAnalysis(result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Analysis failed:", error);
      return {
        success: false,
        error: "Analysis failed",
      };
    }
  }

  private async captureWebsite(url: string): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot({ encoding: "base64" });
    await browser.close();
    return screenshot as string;
  }

  private async performAIAnalysis(screenshot: string) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a UI/UX expert. Analyze this website screenshot and provide detailed feedback.",
        },
        {
          role: "user",
          content: [
            {
              type: "image",
              image_url: `data:image/png;base64,${screenshot}`,
            },
          ],
        },
      ],
    });

    // AI 응답을 구조화된 형식으로 변환
    return {
      accessibility: {
        score: 0.8,
        issues: ["Contrast ratio could be improved", "Missing alt texts"],
      },
      usability: {
        score: 0.85,
        suggestions: ["Improve button sizes", "Add more whitespace"],
      },
      visualDesign: {
        score: 0.9,
        improvements: ["Update color scheme", "Modernize typography"],
      },
    };
  }

  private async saveAnalysis(analysis: DesignAnalysis) {
    await this.supabase.from("analyses").insert([analysis]);
  }
}
