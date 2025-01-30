import { DesignAnalysis } from "@/lib/types/analysis";

interface Props {
  analysis: DesignAnalysis;
}

export function AnalysisResult({ analysis }: Props) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">UI/UX Analysis Results</h2>

      <div className="space-y-6">
        {/* Accessibility Section */}
        <section>
          <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
          <div className="flex items-center mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${analysis.analysis.accessibility.score * 100}%`,
                }}
              />
            </div>
            <span className="ml-2 font-medium">
              {Math.round(analysis.analysis.accessibility.score * 100)}%
            </span>
          </div>
          <ul className="list-disc list-inside">
            {analysis.analysis.accessibility.issues.map((issue, i) => (
              <li key={i} className="text-gray-600">
                {issue}
              </li>
            ))}
          </ul>
        </section>

        {/* Usability Section */}
        <section>
          <h3 className="text-xl font-semibold mb-2">Usability</h3>
          <div className="flex items-center mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${analysis.analysis.usability.score * 100}%` }}
              />
            </div>
            <span className="ml-2 font-medium">
              {Math.round(analysis.analysis.usability.score * 100)}%
            </span>
          </div>
          <ul className="list-disc list-inside">
            {analysis.analysis.usability.suggestions.map((suggestion, i) => (
              <li key={i} className="text-gray-600">
                {suggestion}
              </li>
            ))}
          </ul>
        </section>

        {/* Visual Design Section */}
        <section>
          <h3 className="text-xl font-semibold mb-2">Visual Design</h3>
          <div className="flex items-center mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full"
                style={{
                  width: `${analysis.analysis.visualDesign.score * 100}%`,
                }}
              />
            </div>
            <span className="ml-2 font-medium">
              {Math.round(analysis.analysis.visualDesign.score * 100)}%
            </span>
          </div>
          <ul className="list-disc list-inside">
            {analysis.analysis.visualDesign.improvements.map(
              (improvement, i) => (
                <li key={i} className="text-gray-600">
                  {improvement}
                </li>
              )
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
