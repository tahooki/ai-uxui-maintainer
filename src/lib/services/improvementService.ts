import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";
import puppeteer from "puppeteer";
import { CSSImprovement, ImprovementSuggestion } from "../types/improvement";

export class ImprovementService {
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

  async extractCSS(url: string): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const css = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      return styleSheets
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch (e) {
            return "";
          }
        })
        .join("\n");
    });

    await browser.close();
    return css;
  }

  async improveCSS(
    url: string,
    analysisId: string
  ): Promise<ImprovementSuggestion> {
    try {
      // 1. Extract current CSS
      const originalCSS = await this.extractCSS(url);

      // 2. Generate improvements using AI
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a UI/UX expert specializing in CSS improvements. Analyze the CSS and suggest specific improvements for better accessibility, usability, and visual design.",
          },
          {
            role: "user",
            content: `Improve this CSS and provide specific improvements:\n\n${originalCSS}`,
          },
        ],
      });

      // 3. Parse AI response and generate improved CSS
      const improvements = this.parseAIResponse(
        response.choices[0].message.content || ""
      );
      const improvedCSS = this.generateImprovedCSS(originalCSS, improvements);

      // 4. Save improvement
      const improvement: CSSImprovement = {
        id: crypto.randomUUID(),
        analysisId,
        originalCSS,
        improvedCSS,
        improvements,
        score: this.calculateImprovementScore(improvements),
        timestamp: new Date(),
      };

      await this.saveImprovement(improvement);

      return {
        success: true,
        data: improvement,
      };
    } catch (error) {
      console.error("CSS Improvement failed:", error);
      return {
        success: false,
        error: "Failed to generate CSS improvements",
      };
    }
  }

  private parseAIResponse(response: string) {
    // 여기서는 간단한 예시로 구현합니다.
    // 실제로는 AI 응답을 더 정교하게 파싱해야 합니다.
    return [
      {
        description: "Improved color contrast for better accessibility",
        before: "color: #666;",
        after: "color: #444;",
      },
      {
        description: "Increased button size for better usability",
        before: "padding: 0.5rem;",
        after: "padding: 0.75rem 1rem;",
      },
      // ... 기타 개선사항들
    ];
  }

  private generateImprovedCSS(originalCSS: string, improvements: any[]) {
    let improvedCSS = originalCSS;
    improvements.forEach((improvement) => {
      improvedCSS = improvedCSS.replace(improvement.before, improvement.after);
    });
    return improvedCSS;
  }

  private calculateImprovementScore(improvements: any[]) {
    // 간단한 점수 계산 로직
    return Math.min(improvements.length * 0.1 + 0.7, 1);
  }

  private async saveImprovement(improvement: CSSImprovement) {
    await this.supabase.from("improvements").insert([improvement]);
  }
}
