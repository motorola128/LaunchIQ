// // src/pages/Predict.jsx

// import PredictionForm from "../components/prediction/PredictionForm";

// export default function Predict() {
//   return (
//     <div style={{ padding: "40px" }}>
//       <h1>Product Success Prediction</h1>
//       <PredictionForm />
//     </div>
//   );
// }
import PredictionForm from "../components/prediction/PredictionForm";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import "./Predict.css";

export default function Predict() {
  const navigate = useNavigate();

  return (
    <div className="predict-container">
      <button className="predict-back-btn" onClick={() => navigate("/dashboard")}>
        <IconArrowLeft size={20} />
      </button>
      <div className="predict-header">
        <h1><IconPlus size={28} />New Prediction</h1>
      </div>
      <PredictionForm />
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { 
//   IconWand, 
//   IconAdjustmentsHorizontal, 
//   IconPercentage,
//   IconArrowLeft
// } from "@tabler/icons-react";
// import "./Predict.css";

// export default function Predict() {
//   // State for the interactive sliders
//   const [formData, setFormData] = useState({
//     price: 50,
//     marketing_budget: 5000,
//     sentiment_score: 7.5,
//     competitor_strength: 5
//   });

//   // Real-time prediction state
//   const [predictionScore, setPredictionScore] = useState(0);

//   // Handle slider changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: parseFloat(value)
//     }));
//   };

//   // Mock real-time prediction effect (Replace this logic with your AI model API later if needed, 
//   // or keep it fast for instant UI feedback and only hit the API on final submit)
//   useEffect(() => {
//     // Simple weighted mock calculation for the UI
//     const score = (
//       (100 - formData.price) * 0.2 + 
//       (formData.marketing_budget / 100) * 0.3 + 
//       (formData.sentiment_score * 10) * 0.3 + 
//       (10 - formData.competitor_strength) * 5
//     );
    
//     // Clamp between 0 and 100
//     const finalScore = Math.min(Math.max(score, 0), 100);
//     setPredictionScore(finalScore.toFixed(1));
//   }, [formData]);

//   const getScoreColor = () => {
//     if (predictionScore >= 75) return "#10b981"; // Success Green
//     if (predictionScore >= 40) return "#f59e0b"; // Warning Orange
//     return "#ef4444"; // Danger Red
//   };

//   return (
//     <div className="predict-container">
      
//       {/* Header */}
//       <div className="predict-header">
//         <div>
//           <Link to="/dashboard" className="back-link">
//             <IconArrowLeft size={20} /> Back to Dashboard
//           </Link>
//           <h1>
//             <IconWand size={32} />
//             Prediction Engine
//           </h1>
//           <p>Adjust parameters in real-time to forecast product success probability.</p>
//         </div>
//       </div>

//       <div className="predict-layout">
        
//         {/* Left Column: Sliders */}
//         <div className="glass-card controls-card">
//           <div className="card-title">
//             <IconAdjustmentsHorizontal size={24} />
//             <h2>Adjust Parameters</h2>
//           </div>

//           <form className="slider-form">
            
//             {/* Price Slider */}
//             <div className="form-group">
//               <label>Product Price ($) <span className="val-display">{formData.price}</span></label>
//               <input 
//                 type="range" name="price" 
//                 min="5" max="200" step="1" 
//                 value={formData.price} onChange={handleChange} 
//               />
//             </div>

//             {/* Marketing Budget Slider */}
//             <div className="form-group">
//               <label>Marketing Budget ($) <span className="val-display">{formData.marketing_budget}</span></label>
//               <input 
//                 type="range" name="marketing_budget" 
//                 min="500" max="20000" step="100" 
//                 value={formData.marketing_budget} onChange={handleChange} 
//               />
//             </div>

//             {/* Sentiment Score Slider */}
//             <div className="form-group">
//               <label>Market Sentiment (1-10) <span className="val-display">{formData.sentiment_score}</span></label>
//               <input 
//                 type="range" name="sentiment_score" 
//                 min="1" max="10" step="0.1" 
//                 value={formData.sentiment_score} onChange={handleChange} 
//               />
//             </div>

//             {/* Competitor Strength Slider */}
//             <div className="form-group">
//               <label>Competitor Strength (1-10) <span className="val-display">{formData.competitor_strength}</span></label>
//               <input 
//                 type="range" name="competitor_strength" 
//                 min="1" max="10" step="1" 
//                 value={formData.competitor_strength} onChange={handleChange} 
//               />
//             </div>

//           </form>
//         </div>

//         {/* Right Column: Real-Time Results */}
//         <div className="glass-card results-card">
//           <h2>Live Forecast</h2>
          
//           <div className="score-display" style={{ borderColor: getScoreColor() }}>
//             <h1 style={{ color: getScoreColor() }}>
//               {predictionScore}%
//             </h1>
//             <p>Predicted Success Probability</p>
//           </div>

//           <div className="result-details">
//             <div className="detail-item">
//               <span>Risk Level:</span>
//               <strong style={{ color: getScoreColor() }}>
//                 {predictionScore >= 75 ? "Low Risk" : predictionScore >= 40 ? "Moderate" : "High Risk"}
//               </strong>
//             </div>
//           </div>

//           <button className="save-btn">
//             Save Prediction to History
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }