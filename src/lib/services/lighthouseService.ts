import { createClient } from "@supabase/supabase-js";
import chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import { LighthouseReport, LighthouseResult } from "../types/lighthouse";

export class LighthouseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  async analyzePage(url: string): Promise<LighthouseResult> {
    try {
      // Chrome 브라우저 실행
      const chrome = await chromeLauncher.launch({
        chromeFlags: ["--headless", "--disable-gpu", "--no-sandbox"],
      });

      // Lighthouse 실행 옵션
      const options = {
        logLevel: "info",
        output: "html",
        port: chrome.port,
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
          "pwa",
        ],
      };

      // Lighthouse 분석 실행
      const runnerResult = await lighthouse(url, options);
      const report = runnerResult?.lhr;

      if (!report) {
        throw new Error("Failed to generate Lighthouse report");
      }

      // 결과 정리
      const lighthouseReport: LighthouseReport = {
        id: crypto.randomUUID(),
        url,
        timestamp: new Date(),
        metrics: {
          performance: report.categories.performance.score || 0,
          accessibility: report.categories.accessibility.score || 0,
          bestPractices: report.categories["best-practices"].score || 0,
          seo: report.categories.seo.score || 0,
          pwa: report.categories.pwa.score || 0,
        },
        audits: report.audits,
        htmlReport: runnerResult?.report || "",
      };

      // 결과 저장
      await this.saveLighthouseReport(lighthouseReport);

      // Chrome 종료
      await chrome.kill();

      return {
        success: true,
        data: lighthouseReport,
      };
    } catch (error) {
      console.error("Lighthouse analysis failed:", error);
      return {
        success: false,
        error: "Failed to generate Lighthouse report",
      };
    }
  }

  private async saveLighthouseReport(report: LighthouseReport) {
    await this.supabase.from("lighthouse_reports").insert([report]);
  }
}
