import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ReferenceLine, CartesianGrid
} from "recharts";
import {
  IconArrowLeft, IconTrendingUp, IconTrendingDown,
  IconAlertTriangle, IconBulb, IconCalendar,
  IconCurrencyDollar, IconChartBar, IconLoader
} from "@tabler/icons-react";
import "./PredictionDetails.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"];

export default function PredictionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrediction();
  }, [id]);

  const loadPrediction = async () => {
    try {
      const response = await apiClient.predict.getPrediction(id);
      setPrediction(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <IconLoader size={32} className="pd-spinner"/>
        <p>Loading prediction details...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="pd-empty">
        <h2>Prediction not found</h2>
        <button onClick={() => navigate("/history")}>Back to history</button>
      </div>
    );
  }

  const report = prediction;
  const strat = prediction.stratergy_reports || {};
  const opt = strat.optimizations || {};
  const drivers = strat.key_success_drivers ?? [];

  const prob = report.success_percentage;
  const risk = report.risk_level;

  const riskMeta = {
    "LOW RISK":      { color: "#10b981", bg: "rgba(16,185,129,0.15)", icon: <IconTrendingUp  size={18}/> },
    "MODERATE RISK": { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: <IconAlertTriangle size={18}/> },
    "HIGH RISK":     { color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: <IconTrendingDown size={18}/> },
  };
  const rm = riskMeta[risk] ?? riskMeta["MODERATE RISK"];

  const gaugeData = [{ value: prob, fill: rm.color }];

  const driverData = drivers.slice(0, 8).map(d => ({
    name: d.feature.replace(/_/g," "),
    value: parseFloat(d.impact.toFixed(4)),
    color: d.impact >= 0 ? "#6366f1" : "#ef4444",
  }));

  const priceOpt = opt?.price_optimization;
  const timeOpt = opt?.time_optimization;

  return (
    <div className="pd-page">

      {/* Back */}
      <button className="pd-back" onClick={() => navigate("/history")}>
        <IconArrowLeft size={16}/> Back to history
      </button>

      {/* Hero */}
      <div className="pd-hero">
        {/* Gauge */}
        <div className="pd-gauge-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart
              cx="50%" cy="75%"
              innerRadius="70%" outerRadius="90%"
              startAngle={180} endAngle={0}
              data={[{ value: 100, fill: "rgba(255,255,255,0.05)" }, ...gaugeData]}
            >
              <RadialBar dataKey="value" cornerRadius={8} background={false}/>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pd-gauge-center">
            <div className="pd-prob-num" style={{ color: rm.color }}>
              {prob.toFixed(1)}%
            </div>
            <div className="pd-prob-label">success probability</div>
          </div>
        </div>

        {/* Summary */}
        <div className="pd-summary">
          <div className="pd-product-name">{report.product_name}</div>

          <div className="pd-label" style={{ color: rm.color }}>
            {report.prediction_label}
          </div>

          <div className="pd-risk-badge" style={{ background: rm.bg, color: rm.color }}>
            {rm.icon} {risk}
          </div>

          <div className="pd-meta-row">
            <div className="pd-meta-item">
              <span className="pd-meta-label">Category</span>
              <span className="pd-meta-val">{report.atomic_category}</span>
            </div>
            <div className="pd-meta-item">
              <span className="pd-meta-label">Store</span>
              <span className="pd-meta-val">{report.store}</span>
            </div>
            <div className="pd-meta-item">
              <span className="pd-meta-label">Broad</span>
              <span className="pd-meta-val">{report.broad_category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature drivers */}
      {driverData.length > 0 && (
        <div className="pd-card drivers-card">
          <div className="pd-card-hdr">
            <IconChartBar size={20}/>
            <h2>Key success drivers</h2>
          </div>
          <p className="pd-card-sub">
            Positive bars push toward success · Negative bars pull toward failure
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={driverData}
              layout="vertical"
              margin={{ left: 20, right: 30, top: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false}/>
              <XAxis type="number" tick={{ fill:"#64748b", fontSize:13 }} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" width={200}
                     tick={{ fill:"#0f172a", fontSize:13, fontWeight:600 }} axisLine={false} tickLine={false}/>
              <Tooltip
                contentStyle={{ background:"#1e293b", border:"1px solid #334155",
                                borderRadius:"8px", color:"#f1f5f9" }}
                formatter={v => [v.toFixed(4), "Impact"]}
              />
              <ReferenceLine x={0} stroke="rgba(255,255,255,0.15)" strokeWidth={1}/>
              <Bar dataKey="value" radius={[0,4,4,0]} maxBarSize={22}>
                {driverData.map((d, i) => (
                  <Cell key={i} fill={d.color} fillOpacity={0.85}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Optimizations */}
      <div className="pd-opt-grid">
        {/* Price */}
        {priceOpt && (
          <div className="pd-card">
            <div className="pd-card-hdr">
              <IconCurrencyDollar size={20}/>
              <h2>Price optimization</h2>
            </div>

            <div className="pd-price-compare">
              <div className="pd-price-box current">
                <div className="pd-price-tag">Current</div>
                <div className="pd-price-val">${priceOpt.current_price}</div>
              </div>
              <div className="pd-price-arrow">→</div>
              <div className="pd-price-box optimal">
                <div className="pd-price-tag">Recommended</div>
                <div className="pd-price-val" style={{ color:"#10b981" }}>
                  ${priceOpt.optimal_price}
                </div>
              </div>
            </div>

            <div className="pd-action-pill">
              <IconBulb size={14}/> {priceOpt.action}
            </div>
          </div>
        )}

        {/* Time */}
        {timeOpt && (
          <div className="pd-card">
            <div className="pd-card-hdr">
              <IconCalendar size={20}/>
              <h2>Launch timing</h2>
            </div>

            <div className="pd-month-grid">
              {MONTHS.map((m, i) => {
                const mo = i + 1;
                const isCurr = mo === timeOpt.current_month;
                const isOpt = mo === timeOpt.optimal_month;
                return (
                  <div
                    key={m}
                    className={
                      "pd-month-cell" +
                      (isCurr ? " current" : "") +
                      (isOpt ? " optimal" : "")
                    }
                  >
                    {m}
                  </div>
                );
              })}
            </div>

            <div className="pd-month-legend">
              <span>
                <span className="pd-legend-dot current"></span>
                Current: Month {timeOpt.current_month}
              </span>
              <span>
                <span className="pd-legend-dot optimal"></span>
                Optimal: Month {timeOpt.optimal_month}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Benchmarks */}
      <div className="pd-card benchmarks-card">
        <div className="pd-card-hdr">
          <IconChartBar size={20}/>
          <h2>Market benchmarks</h2>
        </div>

        <div className="pd-benchmarks-grid">
          {report.median_price && (
            <div className="pd-bench-item">
              <span className="pd-bench-label">Median Price</span>
              <span className="pd-bench-val">${report.median_price.toFixed(2)}</span>
            </div>
          )}
          {report.median_weight && (
            <div className="pd-bench-item">
              <span className="pd-bench-label">Median Weight</span>
              <span className="pd-bench-val">{report.median_weight.toFixed(1)}g</span>
            </div>
          )}
          {report.competition_index && (
            <div className="pd-bench-item">
              <span className="pd-bench-label">Competition Index</span>
              <span className="pd-bench-val">{report.competition_index.toFixed(2)}</span>
            </div>
          )}
          {report.median_feature_bullets && (
            <div className="pd-bench-item">
              <span className="pd-bench-label">Median Feature Bullets</span>
              <span className="pd-bench-val">{report.median_feature_bullets}</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}