// // src/pages/Result.jsx

// import { useLocation } from "react-router-dom";

// export default function Result() {

//   const location = useLocation();
//   const result = location.state;

//   if (!result) {
//     return <h2>No prediction data found</h2>;
//   }

//   const report = result.results.report;

//   // STEP 6
//   const opt =
//     result.results.stratergy_reports.optimizations;

//   return (
//     <div style={{ padding: "40px" }}>

//       <h1>Prediction Result</h1>

//       <h2>{report.prediction_label}</h2>

//       <p>
//         Success Percentage:
//         {report.success_percentage}%
//       </p>

//       <p>
//         Risk Level:
//         {report.risk_level}
//       </p>

//       {/* STEP 5 */}

//       <h3>Top Drivers</h3>

//       <ul>
//         {
//           result.results.stratergy_reports.key_success_drivers.map(
//             (driver, index) => (
//               <li key={index}>
//                 {driver.feature}
//                 {" : "}
//                 {driver.impact.toFixed(3)}
//               </li>
//             )
//           )
//         }
//       </ul>

//       {/* STEP 6 */}

//       <h3>Price Optimization</h3>

//       <p>
//         Current Price:
//         {opt.price_optimization.current_price}
//       </p>

//       <p>
//         Recommended Price:
//         {opt.price_optimization.optimal_price}
//       </p>

//       <p>
//         Action:
//         {opt.price_optimization.action}
//       </p>

//       <h3>Launch Month Optimization</h3>

//       <p>
//         Current Month:
//         {opt.time_optimization.current_month}
//       </p>

//       <p>
//         Optimal Month:
//         {opt.time_optimization.optimal_month}
//       </p>

//     </div>
//   );
// }


import { useLocation, useNavigate } from "react-router-dom";
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ReferenceLine, CartesianGrid
} from "recharts";
import {
  IconArrowLeft, IconTrendingUp, IconTrendingDown,
  IconAlertTriangle, IconBulb, IconCalendar,
  IconCurrencyDollar, IconChartBar
} from "@tabler/icons-react";
import "./Result.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Result() {
  const location = useLocation();
  const navigate  = useNavigate();
  const result    = location.state;

  if (!result) {
    return (
      <div className="r-empty">
        <h2>No prediction data found</h2>
        <button onClick={() => navigate("/predict")}>Go back</button>
      </div>
    );
  }

  const report = result.results.report;
  const strat  = result.results.stratergy_reports;
  const opt    = strat.optimizations;
  const drivers= strat.key_success_drivers ?? [];

  const prob    = report.success_percentage;
  const risk    = report.risk_level;

  const riskMeta = {
    "LOW RISK":      { color: "#10b981", bg: "rgba(16,185,129,0.15)", icon: <IconTrendingUp  size={18}/> },
    "MODERATE RISK": { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: <IconAlertTriangle size={18}/> },
    "HIGH RISK":     { color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: <IconTrendingDown size={18}/> },
  };
  const rm = riskMeta[risk] ?? riskMeta["MODERATE RISK"];

  // Radial gauge data
  const gaugeData = [{ value: prob, fill: rm.color }];

  // Drivers chart — split positive / negative
  const driverData = drivers.slice(0, 8).map(d => ({
    name: d.feature.replace(/_/g," "),
    value: parseFloat(d.impact.toFixed(4)),
    color: d.impact >= 0 ? "#6366f1" : "#ef4444",
  }));

  const priceOpt  = opt?.price_optimization;
  const timeOpt   = opt?.time_optimization;

  return (
    <div className="r-page">

      {/* Back */}
      <button className="r-back" onClick={() => navigate("/predict")}>
        <IconArrowLeft size={16}/> New prediction
      </button>

      {/* ── Hero ── */}
      <div className="r-hero">

        {/* Gauge */}
        <div className="r-gauge-wrap">
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
          <div className="r-gauge-center">
            <div className="r-prob-num" style={{ color: rm.color }}>
              {prob.toFixed(1)}%
            </div>
            <div className="r-prob-label">success probability</div>
          </div>
        </div>

        {/* Summary */}
        <div className="r-summary">
          <div className="r-product-name">{report.product_name}</div>

          <div className="r-label" style={{ color: rm.color }}>
            {report.prediction_label}
          </div>

          <div className="r-risk-badge" style={{ background: rm.bg, color: rm.color }}>
            {rm.icon} {risk}
          </div>

          <div className="r-meta-row">
            <div className="r-meta-item">
              <span className="r-meta-label">Category</span>
              <span className="r-meta-val">{report.atomic_category}</span>
            </div>
            <div className="r-meta-item">
              <span className="r-meta-label">Store</span>
              <span className="r-meta-val">{report.store}</span>
            </div>
            <div className="r-meta-item">
              <span className="r-meta-label">Broad</span>
              <span className="r-meta-val">{report.broad_category}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Feature drivers chart ── */}
      {driverData.length > 0 && (
        <div className="r-card">
          <div className="r-card-hdr">
            <IconChartBar size={20}/>
            <h2>Key success drivers</h2>
          </div>
          <p className="r-card-sub">
            Positive bars push toward success · Negative bars pull toward failure
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={driverData}
              layout="vertical"
              margin={{ left: 20, right: 30, top: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false}/>
              <XAxis type="number" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" width={160}
                     tick={{ fill:"#94a3b8", fontSize:11 }} axisLine={false} tickLine={false}/>
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

      {/* ── Optimizations ── */}
      <div className="r-opt-grid">

        {/* Price */}
        {priceOpt && (
          <div className="r-card">
            <div className="r-card-hdr">
              <IconCurrencyDollar size={20}/>
              <h2>Price optimization</h2>
            </div>

            <div className="r-price-compare">
              <div className="r-price-box current">
                <div className="r-price-tag">Current</div>
                <div className="r-price-val">${priceOpt.current_price}</div>
              </div>
              <div className="r-price-arrow">→</div>
              <div className="r-price-box optimal">
                <div className="r-price-tag">Recommended</div>
                <div className="r-price-val" style={{ color:"#10b981" }}>
                  ${priceOpt.optimal_price}
                </div>
              </div>
            </div>

            <div className="r-action-pill">
              <IconBulb size={14}/> {priceOpt.action}
            </div>
          </div>
        )}

        {/* Time */}
        {timeOpt && (
          <div className="r-card">
            <div className="r-card-hdr">
              <IconCalendar size={20}/>
              <h2>Launch timing</h2>
            </div>

            <div className="r-month-grid">
              {MONTHS.map((m, i) => {
                const mo      = i + 1;
                const isCurr  = mo === timeOpt.current_month;
                const isOpt   = mo === timeOpt.optimal_month;
                return (
                  <div
                    key={m}
                    className={
                      "r-month-cell" +
                      (isCurr ? " current" : "") +
                      (isOpt  ? " optimal" : "")
                    }
                  >
                    {m}
                  </div>
                );
              })}
            </div>

            <div className="r-month-legend">
              <span className="r-legend-dot current"/>Current month
              <span className="r-legend-dot optimal"/>Optimal month
            </div>
          </div>
        )}

      </div>

      {/* ── Actions ── */}
      <div className="r-actions">
        <button className="r-btn-primary" onClick={() => navigate("/predict")}>
          New prediction
        </button>
        <button className="r-btn-secondary" onClick={() => navigate("/history")}>
          View history
        </button>
      </div>

    </div>
  );
}