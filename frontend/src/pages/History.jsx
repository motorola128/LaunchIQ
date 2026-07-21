// import { useEffect, useState } from "react";
// import apiClient from "../api/client";
// import { useNavigate } from "react-router-dom";

// export default function History() {

//   const [predictions, setPredictions] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {

//     loadHistory();

//   }, []);

//   const loadHistory = async () => {

//     try {

//       const response =
//         await apiClient.predict.getHistory();

//       setPredictions(response.data);

//     } catch (error) {

//       console.error(error);

//     }

//   };

//   return (
//     <div style={{ padding: "40px" }}>

//       <h1>Prediction History</h1>

//       {predictions.map((item) => (

//         <div
//           key={item.id}
//           style={{
//             border: "1px solid #ccc",
//             padding: "20px",
//             marginBottom: "10px",
//             cursor: "pointer"
//           }}
//           onClick={() =>
//             navigate(`/history/${item.id}`)
//           }
//         >
//           <h3>{item.product_name}</h3>

//           <p>
//             Success Score:
//             {item.success_percentage}%
//           </p>

//           <p>
//             Risk:
//             {item.risk_level}
//           </p>

//         </div>

//       ))}

//     </div>
//   );
// }


import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { useNavigate } from "react-router-dom";
import {
  IconHistory, IconTrendingUp, IconTrendingDown,
  IconAlertTriangle, IconSearch, IconFilter,
  IconChartBar, IconArrowRight, IconCalendar,
  IconPackage, IconArrowLeft
} from "@tabler/icons-react";
import "./History.css";

const RISK_META = {
  "LOW RISK":      { color: "#10b981", bg: "rgba(16,185,129,0.15)", icon: <IconTrendingUp  size={14}/> },
  "MODERATE RISK": { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: <IconAlertTriangle size={14}/> },
  "HIGH RISK":     { color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: <IconTrendingDown size={14}/> },
};

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [riskFilter,  setRiskFilter]  = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => { loadHistory(); }, []);

  useEffect(() => {
    let list = [...predictions];
    if (search)
      list = list.filter(p =>
        p.product_name.toLowerCase().includes(search.toLowerCase()) ||
        p.atomic_category?.toLowerCase().includes(search.toLowerCase())
      );
    if (riskFilter !== "ALL")
      list = list.filter(p => p.risk_level === riskFilter);
    setFiltered(list);
  }, [search, riskFilter, predictions]);

  const loadHistory = async () => {
    try {
      const res = await apiClient.predict.getHistory();
      setPredictions(res.data);
      setFiltered(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Summary stats
  const total    = predictions.length;
  const success  = predictions.filter(p => p.prediction_label === "SUCCESS").length;
  const avgScore = total
    ? (predictions.reduce((a, p) => a + (p.success_percentage ?? 0), 0) / total).toFixed(1)
    : 0;

  if (loading) return (
    <div className="h-loading">
      <div className="h-spinner"/>
      <p>Loading history...</p>
    </div>
  );

  return (
    <div className="h-page">

      {/* Header */}
      <div className="h-header">
        <div>
          <button className="h-back-btn" onClick={() => navigate("/dashboard")}>
            <IconArrowLeft size={20} />
          </button>
          <div className="h-title-row">
            <IconHistory size={28}/>
            <h1>Prediction history</h1>
          </div>
          <p className="h-subtitle">
            All your product launch predictions in one place
          </p>
        </div>
        <button className="h-new-btn" onClick={() => navigate("/predict")}>
          New prediction
        </button>
      </div>

      {/* Stats row */}
      <div className="h-stats-row">
        <div className="h-stat">
          <IconPackage size={20} className="h-stat-icon"/>
          <div>
            <div className="h-stat-val">{total}</div>
            <div className="h-stat-label">Total predictions</div>
          </div>
        </div>
        <div className="h-stat">
          <IconTrendingUp size={20} className="h-stat-icon success"/>
          <div>
            <div className="h-stat-val">{success}</div>
            <div className="h-stat-label">Predicted success</div>
          </div>
        </div>
        <div className="h-stat">
          <IconChartBar size={20} className="h-stat-icon score"/>
          <div>
            <div className="h-stat-val">{avgScore}%</div>
            <div className="h-stat-label">Average score</div>
          </div>
        </div>
        <div className="h-stat">
          <IconTrendingDown size={20} className="h-stat-icon danger"/>
          <div>
            <div className="h-stat-val">{total - success}</div>
            <div className="h-stat-label">Predicted failure</div>
          </div>
        </div>
      </div>

      {/* Search & filter */}
      <div className="h-controls">
        <div className="h-search-wrap">
          <IconSearch size={16} className="h-search-icon"/>
          <input
            className="h-search"
            placeholder="Search by product or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="h-filters">
          <IconFilter size={15} style={{ color:"#64748b" }}/>
          {["ALL","LOW RISK","MODERATE RISK","HIGH RISK"].map(r => (
            <button
              key={r}
              className={"h-filter-btn" + (riskFilter === r ? " active" : "")}
              onClick={() => setRiskFilter(r)}
            >
              {r === "ALL" ? "All" : r.replace(" RISK","")}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="h-empty">
          <IconHistory size={40} style={{ color:"#334155" }}/>
          <p>No predictions found</p>
        </div>
      ) : (
        <div className="h-list">
          {filtered.map((item, idx) => {
            const rm  = RISK_META[item.risk_level] ?? RISK_META["MODERATE RISK"];
            const pct = item.success_percentage ?? 0;
            const isSuccess = item.prediction_label === "SUCCESS";
            return (
              <div
                key={item.id}
                className="h-card"
                onClick={() => navigate(`/history/${item.id}`)}
              >
                {/* Left: index + product info */}
                <div className="h-card-left">
                  <div className="h-index">#{idx + 1}</div>
                  <div>
                    <div className="h-product-name">{item.product_name}</div>
                    <div className="h-product-meta">
                      {item.atomic_category &&
                        <span>{item.atomic_category}</span>}
                      {item.store &&
                        <span className="h-dot">·</span>}
                      {item.store &&
                        <span>{item.store}</span>}
                    </div>
                  </div>
                </div>

                {/* Middle: progress bar */}
                <div className="h-bar-col">
                  <div className="h-bar-label">
                    <span>Success score</span>
                    <span style={{ color: rm.color }}>{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-bar-track">
                    <div
                      className="h-bar-fill"
                      style={{ width:`${pct}%`, background: rm.color }}
                    />
                  </div>
                </div>

                {/* Right: badges + arrow */}
                <div className="h-card-right">
                  <span
                    className="h-label-badge"
                    style={{
                      color: isSuccess ? "#10b981" : "#ef4444",
                      background: isSuccess
                        ? "rgba(16,185,129,0.12)"
                        : "rgba(239,68,68,0.12)"
                    }}
                  >
                    {isSuccess
                      ? <IconTrendingUp  size={12}/>
                      : <IconTrendingDown size={12}/>
                    }
                    {item.prediction_label}
                  </span>
                  <span
                    className="h-risk-badge"
                    style={{ background: rm.bg, color: rm.color }}
                  >
                    {rm.icon} {item.risk_level}
                  </span>
                  {item.created_at && (
                    <span className="h-date">
                      <IconCalendar size={11}/>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  )}
                  <IconArrowRight size={16} style={{ color:"#475569" }}/>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}