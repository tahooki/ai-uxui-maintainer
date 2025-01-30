import { MonitoringData } from "@/lib/types/monitoring";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: MonitoringData;
}

export function MonitoringDashboard({ data }: Props) {
  return (
    <div className="space-y-8">
      {/* 현재 성능 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Lighthouse Score</h3>
          <p className="text-3xl font-bold">
            {Math.round(data.currentMetrics.lighthouseScore * 100)}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Accessibility</h3>
          <p className="text-3xl font-bold">
            {Math.round(data.currentMetrics.accessibilityScore * 100)}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Load Time</h3>
          <p className="text-3xl font-bold">{data.currentMetrics.loadTime}ms</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">UI Score</h3>
          <p className="text-3xl font-bold">
            {Math.round(data.currentMetrics.uiScore * 100)}%
          </p>
        </div>
      </div>

      {/* 성능 추이 그래프 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-medium mb-4">Performance Trends</h3>
        <LineChart width={800} height={400} data={data.historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="lighthouseScore"
            stroke="#8884d8"
            name="Lighthouse"
          />
          <Line
            type="monotone"
            dataKey="accessibilityScore"
            stroke="#82ca9d"
            name="Accessibility"
          />
          <Line
            type="monotone"
            dataKey="loadTime"
            stroke="#ffc658"
            name="Load Time"
          />
        </LineChart>
      </div>

      {/* 활성 알림 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-medium mb-4">Active Alerts</h3>
        <div className="space-y-4">
          {data.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg ${
                alert.severity === "high"
                  ? "bg-red-100"
                  : alert.severity === "medium"
                  ? "bg-yellow-100"
                  : "bg-blue-100"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    alert.severity === "high"
                      ? "bg-red-200 text-red-800"
                      : alert.severity === "medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-blue-200 text-blue-800"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
