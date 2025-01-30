import { LighthouseReport } from "@/lib/types/lighthouse";

interface Props {
  report: LighthouseReport;
}

export function LighthouseResult({ report }: Props) {
  const metrics = [
    { name: "Performance", score: report.metrics.performance, color: "blue" },
    {
      name: "Accessibility",
      score: report.metrics.accessibility,
      color: "green",
    },
    {
      name: "Best Practices",
      score: report.metrics.bestPractices,
      color: "purple",
    },
    { name: "SEO", score: report.metrics.seo, color: "yellow" },
    { name: "PWA", score: report.metrics.pwa, color: "pink" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6">Lighthouse Analysis</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-gray-50 rounded-lg p-4 text-center"
          >
            <div className="text-lg font-medium mb-2">{metric.name}</div>
            <div className="flex justify-center items-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={`var(--${metric.color}-500)`}
                    strokeWidth="3"
                    strokeDasharray={`${metric.score * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {Math.round(metric.score * 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium mb-2">Detailed Audits</h4>
        {Object.entries(report.audits)
          .filter(([_, audit]) => audit.score !== null)
          .map(([key, audit]) => (
            <div key={key} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium">{audit.title}</h5>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    audit.score >= 0.9
                      ? "bg-green-100 text-green-800"
                      : audit.score >= 0.5
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {Math.round(audit.score * 100)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{audit.description}</p>
              {audit.warnings && audit.warnings.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-yellow-600">
                    Warnings:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {audit.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="mt-6">
        <button
          onClick={() => {
            const blob = new Blob([report.htmlReport], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          View Full Report
        </button>
      </div>
    </div>
  );
}
