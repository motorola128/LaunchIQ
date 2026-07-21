// src/components/dashboard/StatsCard.jsx

export default function StatsCard({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        minWidth: "220px"
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}