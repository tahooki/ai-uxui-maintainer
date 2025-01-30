"use client";

import { ImprovementResult } from "@/components/ImprovementResult";
import { LighthouseResult } from "@/components/LighthouseResult";
import { useState } from "react";

export default function AnalysisDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = useState(false);
  const [improvement, setImprovement] = useState(null);
  const [lighthouseReport, setLighthouseReport] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleImprove = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId: params.id,
          url: "현재 분석된 URL", // 실제 구현시에는 analysis 데이터에서 가져와야 함
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setImprovement(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate improvements"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLighthouseAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/lighthouse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: "현재 분석된 URL", // 실제 구현시에는 analysis 데이터에서 가져와야 함
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setLighthouseReport(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate Lighthouse report"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Analysis Details</h1>
        <div className="space-x-4">
          <button
            onClick={handleImprove}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            {loading
              ? "Generating Improvements..."
              : "Generate CSS Improvements"}
          </button>
          <button
            onClick={handleLighthouseAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            {loading ? "Running Analysis..." : "Run Lighthouse Analysis"}
          </button>
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>

      {/* Analysis Result Component */}
      {/* <AnalysisResult analysis={analysis} /> */}

      {/* Improvement Result */}
      {improvement && <ImprovementResult improvement={improvement} />}

      {/* Lighthouse Result */}
      {lighthouseReport && <LighthouseResult report={lighthouseReport} />}
    </div>
  );
}
