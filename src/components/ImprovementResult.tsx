import { CSSImprovement } from "@/lib/types/improvement";

interface Props {
  improvement: CSSImprovement;
}

export function ImprovementResult({ improvement }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">CSS Improvements</h3>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${improvement.score * 100}%` }}
              />
            </div>
            <span className="ml-2 font-medium">
              {Math.round(improvement.score * 100)}% Improved
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {improvement.improvements.map((imp, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">{imp.description}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Before:</p>
                  <pre className="bg-gray-50 p-2 rounded text-sm">
                    {imp.before}
                  </pre>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">After:</p>
                  <pre className="bg-gray-50 p-2 rounded text-sm">
                    {imp.after}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={() => {
              // Copy improved CSS to clipboard
              navigator.clipboard.writeText(improvement.improvedCSS);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy Improved CSS
          </button>
        </div>
      </div>
    </div>
  );
}
