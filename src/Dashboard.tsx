import {
    Activity,
    AlertCircle,
    BarChart3,
    Battery,
    Bell,
    CheckCircle,
    Cpu,
    Gauge,
    Home,
    MapPin,
    Settings,
    TrendingUp,
    Wifi
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [cityHealth] = useState(87);
  const [sensorsOnline] = useState(243);
  const [riskLevel] = useState<'LOW' | 'MED' | 'HIGH'>('LOW');

  const water = [30, 32, 31, 33, 35, 34, 36];
  const air = [60, 58, 61, 62, 64, 63, 65];
  const temp = [26, 27, 27, 28, 29, 28, 30];
  const labels = ['1h', '2h', '3h', '4h', '5h', '6h', 'Now'];

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'water' | 'air' | 'temp'>('water');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const iot = { active: 247, weak: 3, offline: 2 };
  const incidents = { resolved: 25, active: 3, critical: 1, daily: [3, 4, 5, 2, 6, 3, 2] };
  const perf = { response: '2.4s', accuracy: '99.8%', battery: '78%' };

  // Risk prediction data for the next 48 hours
  const riskPredictions = [
    { time: 'Now', risk: 'LOW' },
    { time: '6h', risk: 'LOW' },
    { time: '12h', risk: 'MED' },
    { time: '18h', risk: 'MED' },
    { time: '24h', risk: 'HIGH' },
    { time: '30h', risk: 'HIGH' },
    { time: '36h', risk: 'MED' },
    { time: '42h', risk: 'LOW' },
    { time: '48h', risk: 'LOW' },
  ];

  const seriesPoints = useMemo(() => {
    const all = water.concat(air).concat(temp);
    const min = Math.min(...all);
    const max = Math.max(...all);
    const toPoints = (arr: number[]) =>
      arr.map((v, i) => {
        const x = (i / (arr.length - 1)) * 100;
        const y = 100 - ((v - min) / (max - min || 1)) * 100;
        return { x, y, value: v };
      });
    return { water: toPoints(water), air: toPoints(air), temp: toPoints(temp) };
  }, [water, air, temp]);

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img
              src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
              alt="CIVILIAN"
              className="logo"
            />
            <span className="logo-text">CIVILIAN</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="/home" className="nav-item active">
            <Home size={18} />
            <span className="nav-label">Dashboard</span>
          </a>
          <a href="/gis" className="nav-item">
            <MapPin size={18} />
            <span className="nav-label">Map</span>
          </a>
          <a href="/dashboard" className="nav-item">
            <BarChart3 size={18} />
            <span className="nav-label">Analytics</span>
          </a>
          <a href="/admin" className="nav-item">
            <Settings size={18} />
            <span className="nav-label">Admin</span>
          </a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="top-left">
            <div className="live-indicator">
              <span className="live-dot" />
              <span className="live-text">LIVE</span>
            </div>
            <div className="page-title">City Dashboard</div>
          </div>

          <div className="top-right">
            <div className="header-alerts">
              <Bell size={14} />
              <span className="alerts-count">0</span>
            </div>
            <div className="clock"> {new Date().toLocaleTimeString()} </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="cards-row">
            <div className="metric-card health">
              <div className="metric-title">CITY HEALTH</div>
              <div className="metric-value">{cityHealth}%</div>
              <div className="metric-sub">All Systems</div>
            </div>

            <div className="metric-card sensors">
              <div className="metric-title">SENSORS</div>
              <div className="metric-value">{sensorsOnline}</div>
              <div className="metric-sub">Online</div>
            </div>

            <div className="metric-card risk">
              <div className="metric-title">RISK LEVEL</div>
              <div className="metric-value">{riskLevel}</div>
              <div className="metric-sub">Current Status</div>
            </div>
          </section>

          <section className="chart-row">
            <div className="card chart-card">
              <div className="card-header">
                <div className="card-title-with-icon">
                  <Activity size={18} />
                  <span>Real-time Sensor Data</span>
                </div>
                <div className="metric-selector">
                  <button 
                    className={`metric-btn ${selectedMetric === 'water' ? 'active' : ''}`}
                    onClick={() => setSelectedMetric('water')}
                  >
                    Water Level
                  </button>
                  <button 
                    className={`metric-btn ${selectedMetric === 'air' ? 'active' : ''}`}
                    onClick={() => setSelectedMetric('air')}
                  >
                    Air Quality
                  </button>
                  <button 
                    className={`metric-btn ${selectedMetric === 'temp' ? 'active' : ''}`}
                    onClick={() => setSelectedMetric('temp')}
                  >
                    Temperature
                  </button>
                </div>
              </div>

              <div
                className="sensor-chart"
                onMouseLeave={() => setHoverIndex(null)}
                role="img"
                aria-label="sensor chart"
              >
                <div className="chart-y-axis">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  
                  {/* Active metric line */}
                  <polyline
                    className={`line ${selectedMetric}`}
                    points={seriesPoints[selectedMetric].map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    strokeWidth={2.5}
                  />
                  
                  {/* Area fill under line */}
                  <polygon
                    className={`area ${selectedMetric}`}
                    points={`0,100 ${seriesPoints[selectedMetric].map(p => `${p.x},${p.y}`).join(' ')} 100,100`}
                  />

                  {/* Hover indicator line */}
                  {hoverIndex !== null && (
                    <line
                      x1={seriesPoints[selectedMetric][hoverIndex].x}
                      y1="0"
                      x2={seriesPoints[selectedMetric][hoverIndex].x}
                      y2="100"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  )}

                  {/* Hover dots */}
                  {hoverIndex !== null && (
                    <circle
                      cx={seriesPoints[selectedMetric][hoverIndex].x}
                      cy={seriesPoints[selectedMetric][hoverIndex].y}
                      r={3}
                      className={`hover-dot ${selectedMetric}`}
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Invisible hit areas for hover */}
                  {seriesPoints.water.map((p, idx) => (
                    <rect
                      key={idx}
                      x={p.x - 5}
                      y={0}
                      width="10"
                      height={100}
                      fill="transparent"
                      onMouseEnter={() => setHoverIndex(idx)}
                      style={{ cursor: 'crosshair' }}
                    />
                  ))}
                </svg>

                <div className="chart-x-axis">
                  {labels.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>

                {hoverIndex !== null && (
                  <div className="chart-tooltip">
                    <div className="tooltip-time">{labels[hoverIndex] ?? labels[labels.length - 1]}</div>
                    <div className="tooltip-value">
                      <span className="value-label">{selectedMetric === 'water' ? 'Water' : selectedMetric === 'air' ? 'Air' : 'Temp'}:</span>
                      <span className="value-number">
                        {seriesPoints[selectedMetric][hoverIndex].value}
                        {selectedMetric === 'temp' ? '°C' : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card small-card">
              <div className="card-header">
                <div className="card-title-with-icon">
                  <Wifi size={18} />
                  <span>IoT Network Health</span>
                </div>
              </div>

              <div className="network-visual">
                <div className="network-status">
                  <div className="status-item">
                    <div className="status-indicator online"></div>
                    <div className="status-info">
                      <div className="status-value">{iot.active}</div>
                      <div className="status-label">Active Nodes</div>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-indicator weak"></div>
                    <div className="status-info">
                      <div className="status-value">{iot.weak}</div>
                      <div className="status-label">Weak Signal</div>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-indicator offline"></div>
                    <div className="status-info">
                      <div className="status-value">{iot.offline}</div>
                      <div className="status-label">Offline</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mid-row">
            <div className="card incidents-card">
              <div className="card-header">
                <div className="card-title-with-icon">
                  <AlertCircle size={18} />
                  <span>Weekly Incident Report</span>
                </div>
              </div>

              <div className="incidents-chart">
                <div className="bar-chart-container">
                  {incidents.daily.map((v, i) => (
                    <div 
                      key={i} 
                      className="bar-item"
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div className="bar-wrapper">
                        <div 
                          className={`bar ${hoveredBar === i ? 'hovered' : ''}`} 
                          style={{ height: `${Math.min(100, v * 15)}%` }}
                        >
                          <div className="bar-value">{v}</div>
                        </div>
                      </div>
                      <div className="bar-label">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="incident-stats-centered">
                <div className="stat resolved">
                  <CheckCircle size={14} />
                  <span>{incidents.resolved} Resolved</span>
                </div>
                <div className="stat active">
                  <AlertCircle size={14} />
                  <span>{incidents.active} Active</span>
                </div>
                <div className="stat critical">
                  <AlertCircle size={14} />
                  <span>{incidents.critical} Critical</span>
                </div>
              </div>
            </div>

            <div className="card prediction-card">
              <div className="card-header">
                <div className="card-title-with-icon">
                  <TrendingUp size={18} />
                  <span>AI Risk Prediction</span>
                </div>
              </div>

              <div className="prediction-visual-centered">
                <div className="timeline-horizontal">
                  <div className="timeline-line"></div>
                  <div className="timeline-points">
                    {riskPredictions.map((prediction, i) => (
                      <div key={i} className="timeline-point-container">
                        <div className={`timeline-point ${prediction.risk.toLowerCase()}`}></div>
                        <div className="timeline-label">{prediction.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="risk-legend">
                  <div className="legend-item">
                    <div className="legend-dot low"></div>
                    <span>Low Risk</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot med"></div>
                    <span>Medium Risk</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot high"></div>
                    <span>High Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bottom-row">
            <div className="card perf-card full-width">
              <div className="card-header">
                <div className="card-title-with-icon">
                  <Cpu size={18} />
                  <span>System Performance</span>
                </div>
              </div>

              <div className="perf-grid">
                <div className="perf-chip response">
                  <div className="chip-icon">
                    <Gauge size={20} />
                  </div>
                  <div className="chip-details">
                    <div className="chip-title">Response Time</div>
                    <div className="chip-value">{perf.response}</div>
                  </div>
                </div>
                <div className="perf-chip accuracy">
                  <div className="chip-icon">
                    <Activity size={20} />
                  </div>
                  <div className="chip-details">
                    <div className="chip-title">Data Accuracy</div>
                    <div className="chip-value">{perf.accuracy}</div>
                  </div>
                </div>
                <div className="perf-chip battery">
                  <div className="chip-icon">
                    <Battery size={20} />
                  </div>
                  <div className="chip-details">
                    <div className="chip-title">Avg Battery</div>
                    <div className="chip-value">{perf.battery}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;