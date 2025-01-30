"use client";

import { HistoryTable } from "@/components/HistoryTable";
import { Pagination } from "@/components/Pagination";
import { AnalysisHistory, HistoryQueryParams } from "@/lib/types/analysis";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queryParams, setQueryParams] = useState<HistoryQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "date",
    order: "desc",
  });

  useEffect(() => {
    fetchHistory();
  }, [queryParams]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: queryParams.page?.toString() || "1",
        limit: queryParams.limit?.toString() || "10",
        sortBy: queryParams.sortBy || "date",
        order: queryParams.order || "desc",
      });

      const response = await fetch(`/api/history?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch history");
      }

      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analysis History</h1>

      {history && (
        <>
          <HistoryTable analyses={history.analyses} />
          <Pagination
            currentPage={queryParams.page || 1}
            totalPages={history.pageCount}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
