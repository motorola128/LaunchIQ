import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="lp-wrapper">
      {/* Main Header */}
      <header className="lp-header" data-purpose="main-header">
        <h1 className="lp-logo">LAUNCH IQ</h1>
      </header>

      {/* Hero Section */}
      <main className="lp-hero" data-purpose="hero-section">
        
        {/* Left Column: Typography & Action */}
        <div className="lp-content" data-purpose="hero-content">
          <div className="lp-badge" data-purpose="hero-badge">
            Decision Intelligence Platform
          </div>
          
          <h2 className="lp-headline" data-purpose="hero-headline">
            Bridge the gap between <br />
            <span className="lp-accent-text">Insight</span> and <span className="lp-accent-text">Impact</span>.
          </h2>
          
          <p className="lp-description" data-purpose="hero-description">
            Business Intelligence Dashboard unifies pre-launch predictive forecasting with real-time post-launch performance monitoring. Decisions grounded in data, verified by execution.
          </p>
          
          <div className="lp-cta-container">
            <Link to= "/signup">
              <button className="lp-button" data-purpose="cta-button">
                Get Started
              </button>
            </Link>
            
          </div>
        </div>
        
        {/* Right Column: Premium, Flat Interface Mockup */}
        <div className="lp-visual" data-purpose="hero-visual">
          <div className="ui-card-mockup">
            
            {/* Mockup Header */}
            <div className="ui-header">
              <span className="ui-nav-title">Overview / Diagnostics</span>
              <div className="ui-dots">
                <span className="dot dot-r"></span>
                <span className="dot dot-y"></span>
                <span className="dot dot-g"></span>
              </div>
            </div>
            
            {/* Mockup Body */}
            <div className="ui-body">
              <div className="ui-metric-label">Q3 REVENUE</div>
              
              <div className="ui-stats-grid">
                {/* Circular progress indicators */}
                <div className="ui-circles">
                  <div className="ui-circle circle-cyan">
                    <span className="circle-text">82%</span>
                  </div>
                  <div className="ui-circle circle-slate">
                    <span className="circle-text">41%</span>
                  </div>
                </div>
                
                {/* Progress bars */}
                <div className="ui-bars">
                  <div className="ui-bar-row">
                    <span className="bar-label">Forecast Model</span>
                    <div className="bar-track"><div className="bar-fill fill-1"></div></div>
                  </div>
                  <div className="ui-bar-row">
                    <span className="bar-label">Baseline</span>
                    <div className="bar-track"><div className="bar-fill fill-2"></div></div>
                  </div>
                  <div className="ui-bar-row">
                    <span className="bar-label">Variance</span>
                    <div className="bar-track"><div className="bar-fill fill-3"></div></div>
                  </div>
                </div>
              </div>
              
              {/* Mockup Footer Sparklines */}
              <div className="ui-footer-chart">
                <div className="chart-bar b1"></div>
                <div className="chart-bar b2"></div>
                <div className="chart-bar b3"></div>
                <div className="chart-bar b4"></div>
                <div className="chart-bar b5"></div>
              </div>
              
            </div>
          </div>
        </div>
        
      </main>
      
      <footer className="lp-footer"></footer>
    </div>
  );
};

export default Landing;