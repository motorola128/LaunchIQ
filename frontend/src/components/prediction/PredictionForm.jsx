// // src/components/prediction/PredictionForm.jsx

// import { useForm } from "react-hook-form";
// import apiClient from "../../api/client";
// import { useNavigate } from "react-router-dom";
// export default function PredictionForm() {

//   const { register, handleSubmit } = useForm();
//   const navigate = useNavigate();

//   const onSubmit = async (data) => {

//     try {

//       const response = await apiClient.predict.run({
//         ...data,

//         price: Number(data.price),
//         weight: Number(data.weight),
//         feature_word_count: Number(data.feature_word_count),
//         features_bullet_count: Number(data.features_bullet_count),
//         description_word_count: Number(data.description_word_count),
//         has_warranty: Number(data.has_warranty),
//         has_compatability: Number(data.has_compatability),
//         launch_month: Number(data.launch_month),
//         atomic_category: String(data.atomic_category),
//         broad_category: String(data.broad_category),
//         store:String(data.store)
//       });

//       navigate("/result", {
//         state: response.data
//       });

      

//     } catch (error) {
//       console.error(error);
//       alert("Prediction failed");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>

//       <input
//         placeholder="Product Name"
//         {...register("product_name")}
//       />

//       <br /><br />

//       <input
//         placeholder="Price"
//         {...register("price")}
//       />

//       <br /><br />

//       <input
//         placeholder="Weight"
//         {...register("weight")}
//       />

//       <br /><br />

//       <input
//         placeholder="Feature Word Count"
//         {...register("feature_word_count")}
//       />

//       <br /><br />

//       <input
//         placeholder="Features Bullet Count"
//         {...register("features_bullet_count")}
//       />

//       <br /><br />

//       <input
//         placeholder="Description Word Count"
//         {...register("description_word_count")}
//       />

//       <br /><br />

//       <input
//         placeholder="Warranty (0 or 1)"
//         {...register("has_warranty")}
//       />

//       <br /><br />

//       <input
//         placeholder="Compatibility (0 or 1)"
//         {...register("has_compatability")}
//       />

//       <br /><br />

//       <input
//         placeholder="Launch Month"
//         {...register("launch_month")}
//       />

//       <br /><br />

//       <input
//         placeholder="Atomic Category"
//         {...register("atomic_category")}
//       />

//       <br /><br />

//       <input
//         placeholder="Broad Category"
//         {...register("broad_category")}
//       />

//       <br /><br />

//       <input
//         placeholder="Store"
//         {...register("store")}
//       />

//       <br /><br />

//       <button type="submit">
//         Predict
//       </button>

//     </form>
//   );
// }


import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import "./PredictionForm.css";
import CreatableSelect from 'react-select/creatable';
import atomicCats from '../../data/atomic_categories.json';
import stores from '../../data/stores.json';
import broadCats from '../../data/broad_categories.json';

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun",
                 "Jul","Aug","Sep","Oct","Nov","Dec"];

export default function PredictionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [liveProb, setLiveProb] = useState(null);
  const [liveRisk, setLiveRisk] = useState(null);

  const [form, setForm] = useState({
    product_name:           "",
    store:                  "",
    atomic_category:        "",
    broad_category:         "",
    price:                  15,
    weight:                 100,
    launch_month:           6,
    feature_word_count:     50,
    features_bullet_count:  5,
    description_word_count: 100,
    has_warranty:           0,
    has_compatability:      0,
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const buildPayload = () => ({
    ...form,
    price:                  Number(form.price),
    weight:                 Number(form.weight),
    launch_month:           Number(form.launch_month),
    feature_word_count:     Number(form.feature_word_count),
    features_bullet_count:  Number(form.features_bullet_count),
    description_word_count: Number(form.description_word_count),
    has_warranty:           Number(form.has_warranty),
    has_compatability:      Number(form.has_compatability),
  });

  // Debounced live prediction on numeric changes
  // DISABLED: This was saving predictions to DB on every change
  // useEffect(() => {
  //   if (!form.atomic_category || !form.store || !form.broad_category) return;
  //   const timer = setTimeout(async () => {
  //     try {
  //       const res = await apiClient.predict.run(buildPayload());
  //       setLiveProb(res.data.analysis.report.success_percentage);
  //       setLiveRisk(res.data.analysis.report.risk_level);
  //     } catch (_) {}
  //   }, 600);
  //   return () => clearTimeout(timer);
  // }, [form.price, form.weight, form.launch_month,
  //     form.feature_word_count, form.features_bullet_count,
  //     form.description_word_count, form.has_warranty,
  //     form.has_compatability]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.product_name || !form.store || !form.atomic_category) {
      alert("Fill in product name, store, and category first");
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.predict.run(buildPayload());
      navigate("/result", { state: res.data });
    } catch (err) {
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const riskColor = {
    "LOW RISK":      "#10b981",
    "MODERATE RISK": "#f59e0b",
    "HIGH RISK":     "#ef4444",
  };

  return (
    <form onSubmit={onSubmit} className="pf-container">

      {/* Live result banner */}
      {liveProb !== null && (
        <div className="pf-live-banner">
          <div>
            <div className="pf-live-label">Success probability</div>
            <div className="pf-live-prob">{liveProb.toFixed(1)}%</div>
            <div className="pf-live-sub">
              {form.atomic_category} · {form.store}
            </div>
          </div>
          <div className="pf-live-right">
            <span
              className="pf-badge"
              style={{ color: riskColor[liveRisk] || "#94a3b8" }}
            >
              {liveRisk}
            </span>
            <div className="pf-live-note">Updates as you adjust</div>
          </div>
        </div>
      )}

      <div className="pf-grid">

        {/* Product info */}
        <div className="pf-card">
          <h3 className="pf-card-title">Product info</h3>

          <div className="pf-field">
            <label>Product name</label>
            <input
              type="text"
              placeholder="e.g. USB-C Cable 3ft"
              value={form.product_name}
              onChange={e => set("product_name", e.target.value)}
            />
          </div>

          <div className="pf-field">
            <label>Store / brand</label>
            <CreatableSelect
              isClearable
              placeholder="e.g. Anker"
              options={stores.map(s => ({ value: s, label: s }))}
              value={form.store ? { value: form.store, label: form.store } : null}
              onChange={opt => set('store', opt ? opt.value : '')}
            />
          </div>

          <div className="pf-field">
            <label>Atomic category</label>
            <CreatableSelect
              isClearable
              placeholder="e.g. USB Cables"
              options={atomicCats.map(a => ({ value: a, label: a }))}
              value={form.atomic_category ? { value: form.atomic_category, label: form.atomic_category } : null}
              onChange={opt => set('atomic_category', opt ? opt.value : '')}
            />
          </div>

          <div className="pf-field">
            <label>Broad category</label>
            <CreatableSelect
              isClearable
              placeholder="e.g. Cables"
              options={broadCats.map(b => ({ value: b, label: b }))}
              value={form.broad_category ? { value: form.broad_category, label: form.broad_category } : null}
              onChange={opt => set('broad_category', opt ? opt.value : '')}
            />
          </div>
        </div>

        {/* Pricing & physical */}
        <div className="pf-card">
          <h3 className="pf-card-title">Pricing & physical</h3>

          <SliderField
            label="Price ($)"
            value={form.price}
            min={1} max={500} step={1}
            display={`$${form.price}`}
            onChange={v => set("price", v)}
          />
          <SliderField
            label="Weight (g)"
            value={form.weight}
            min={1} max={5000} step={1}
            display={`${form.weight}g`}
            onChange={v => set("weight", v)}
          />
          <SliderField
            label="Launch month"
            value={form.launch_month}
            min={1} max={12} step={1}
            display={MONTHS[form.launch_month - 1]}
            onChange={v => set("launch_month", v)}
          />
        </div>

        {/* Listing quality */}
        <div className="pf-card">
          <h3 className="pf-card-title">Listing quality</h3>

          <SliderField
            label="Feature bullet count"
            value={form.features_bullet_count}
            min={0} max={20} step={1}
            display={form.features_bullet_count}
            onChange={v => set("features_bullet_count", v)}
          />
          <SliderField
            label="Feature word count"
            value={form.feature_word_count}
            min={0} max={500} step={1}
            display={form.feature_word_count}
            onChange={v => set("feature_word_count", v)}
          />
          <SliderField
            label="Description word count"
            value={form.description_word_count}
            min={0} max={1000} step={1}
            display={form.description_word_count}
            onChange={v => set("description_word_count", v)}
          />
        </div>

        {/* Product attributes */}
        <div className="pf-card">
          <h3 className="pf-card-title">Product attributes</h3>

          <SliderField
            label="Has warranty"
            value={form.has_warranty}
            min={0} max={1} step={1}
            display={form.has_warranty === 1 ? "Yes" : "No"}
            onChange={v => set("has_warranty", v)}
          />
          <SliderField
            label="Has compatibility info"
            value={form.has_compatability}
            min={0} max={1} step={1}
            display={form.has_compatability === 1 ? "Yes" : "No"}
            onChange={v => set("has_compatability", v)}
          />
        </div>

      </div>

      <button type="submit" className="pf-submit" disabled={loading}>
        {loading ? "Predicting..." : "Run full prediction & save"}
      </button>

    </form>
  );
}

function SliderField({ label, value, min, max, step, display, onChange }) {
  return (
    <div className="pf-field">
      <label>{label}</label>
      <div className="pf-slider-row">
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
        <div className="pf-val">{display}</div>
      </div>
    </div>
  );
}