import { DesignAnalysis } from "@/lib/types/analysis";
import Link from "next/link";

interface Props {
  analyses: DesignAnalysis[];
}

export function HistoryTable({ analyses }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Accessibility
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usability
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Visual Design
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {analyses.map((analysis) => (
            <tr key={analysis.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(analysis.timestamp).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {analysis.url}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {Math.round(analysis.analysis.accessibility.score * 100)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {Math.round(analysis.analysis.usability.score * 100)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {Math.round(analysis.analysis.visualDesign.score * 100)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/analysis/${analysis.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
