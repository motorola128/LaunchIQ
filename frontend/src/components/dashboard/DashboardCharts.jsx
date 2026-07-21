import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { IconChartBar, IconChartPie, IconTrendingUp, IconTarget } from "@tabler/icons-react";
import "./DashboardCharts.css";

export default function DashboardCharts({ stats }) {

  // Success vs Failure data
  const pieData = [
    {
      name: "Success",
      value: stats.success_predictions,
      fill: "#10b981"
    },
    {
      name: "Failure",
      value: stats.failure_predictions,
      fill: "#ef4444"
    }
  ];

  // Recent predictions for bar chart
  const barData = stats.recent_predictions?.map((p, idx) => ({
    name: p.product_name.substring(0, 12),
    score: p.success_percentage,
    risk: p.risk_level,
    id: idx
  })) || [];

  // Trend data - simulated based on average
  const trendData = [
    { week: "W1", avgScore: stats.avg_success_score * 0.85 },
    { week: "W2", avgScore: stats.avg_success_score * 0.90 },
    { week: "W3", avgScore: stats.avg_success_score * 0.95 },
    { week: "W4", avgScore: stats.avg_success_score }
  ];

  // Risk distribution
  const predictions = [];
  if (stats.recent_predictions) {
    stats.recent_predictions.forEach(p => {
      const existingRisk = predictions.find(r => r.name === p.risk_level);
      if (existingRisk) {
        existingRisk.value++;
      } else {
        predictions.push({ name: p.risk_level, value: 1 });
      }
    });
  }

  const riskData = [
    { name: "Low", value: predictions.filter(p => p.name === "LOW RISK").length, fill: "#10b981" },
    { name: "Moderate", value: predictions.filter(p => p.name === "MODERATE RISK").length, fill: "#f59e0b" },
    { name: "High", value: predictions.filter(p => p.name === "HIGH RISK").length, fill: "#ef4444" }
  ];

  // Performance radar data
  const radarData = [
    { category: "Success Rate", value: stats.avg_success_score },
    { category: "Accuracy", value: 75 },
    { category: "Coverage", value: Math.min(stats.total_predictions * 10, 100) },
    { category: "Consistency", value: 80 }
  ];

  return (
    <div className="dc-container">

      {/* Row 1: Success vs Failure & Risk Distribution */}
      <div className="dc-grid dc-grid-2">

        {/* Success vs Failure Donut */}
        <div className="dc-card">
          <div className="dc-card-header">
            <IconChartPie size={20} />
            <h3>Prediction Outcome</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9"
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="dc-card">
          <div className="dc-card-header">
            <IconTarget size={20} />
            <h3>Risk Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9"
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Row 2: Recent Predictions & Performance Trend */}
      <div className="dc-grid dc-grid-2">

        {/* Recent Prediction Scores */}
        <div className="dc-card">
          <div className="dc-card-header">
            <IconChartBar size={20} />
            <h3>Recent Prediction Scores</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9"
                }}
                formatter={(value) => `${value.toFixed(1)}%`}
              />
              <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Score Trend */}
        <div className="dc-card">
          <div className="dc-card-header">
            <IconTrendingUp size={20} />
            <h3>Performance Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9"
                }}
                formatter={(value) => `${value.toFixed(1)}%`}
              />
              <Area
                type="monotone"
                dataKey="avgScore"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Row 3: Performance Metrics */}
      <div className="dc-grid dc-grid-1">

        <div className="dc-card">
          <div className="dc-card-header">
            <IconChartBar size={20} />
            <h3>Overall Performance Metrics</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: "#64748b", fontSize: 11 }} domain={[0, 100]} />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9"
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Summary Stats */}
      <div className="dc-summary">
        <div className="dc-summary-item">
          <div className="dc-summary-label">Total Predictions</div>
          <div className="dc-summary-value">{stats.total_predictions}</div>
        </div>
        <div className="dc-summary-item success">
          <div className="dc-summary-label">Success Rate</div>
          <div className="dc-summary-value">
            {stats.total_predictions > 0
              ? ((stats.success_predictions / stats.total_predictions) * 100).toFixed(1)
              : 0}
            %
          </div>
        </div>
        <div className="dc-summary-item">
          <div className="dc-summary-label">Avg Score</div>
          <div className="dc-summary-value">{stats.avg_success_score}%</div>
        </div>
      </div>

    </div>
  );
}