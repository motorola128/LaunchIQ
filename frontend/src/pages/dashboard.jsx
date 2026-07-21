import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import { useAuth } from "../hooks/useAuth";

import {
  IconChartBar,
  IconTarget,
  IconTrendingUp,
  IconTrendingDown,
  IconPercentage,
  IconBulb,
  IconPlus,
  IconFileAnalytics,
  IconLogout,
} from "@tabler/icons-react";

import "./dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await apiClient.predict.getDashboard();
        setStats(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-loading">
        <h2>Unable to load dashboard</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* Header */}

      <div className="dashboard-header">
        <div>
          <h1>
            <IconChartBar size={32} />
            LAUNCH IQ
          </h1>

          <p>
             Pre-Launch Product Success Prediction Platform
          </p>
        </div>

        <div className="header-actions">
          <button className="primary-btn" onClick={() => navigate("/predict") }>
            <IconPlus size={18} />
            New Prediction
          </button>

          <button className="secondary-btn" onClick={() => navigate("/history") }>
            History
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            <IconLogout size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Welcome Banner */}

      <div className="welcome-banner">
        <h2>Welcome Back 👋</h2>
        <p>
          Monitor product launch predictions and business insights.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="stats-grid">

        <div className="stats-card">
          <IconTarget size={40} />
          <h3>Total Predictions</h3>
          <h2>{stats.total_predictions}</h2>
        </div>

        <div className="stats-card success">
          <IconTrendingUp size={40} />
          <h3>Success Predictions</h3>
          <h2>{stats.success_predictions}</h2>
        </div>

        <div className="stats-card danger">
          <IconTrendingDown size={40} />
          <h3>Failure Predictions</h3>
          <h2>{stats.failure_predictions}</h2>
        </div>

        <div className="stats-card score">
          <IconPercentage size={40} />
          <h3>Average Score</h3>
          <h2>{stats.avg_success_score}%</h2>
        </div>

      </div>

      {/* AI Insights */}

      <div className="insight-card">
        <div className="section-title">
          <IconBulb size={24} />
          <h2>AI Insights</h2>
        </div>

        <ul>
          <li>
            Products with higher sentiment scores show better success rates.
          </li>

          <li>
            Lower competition products generally perform better.
          </li>

          <li>
            Product pricing significantly affects launch success.
          </li>

          <li>
            Marketing and customer engagement improve predictions.
          </li>
        </ul>
      </div>

      {/* Charts */}

      <div className="chart-card">
        <h2>Analytics Overview</h2>
        <DashboardCharts stats={stats} />
      </div>

      {/* Quick Actions (removed Reports as requested) */}

    </div>
  );
}