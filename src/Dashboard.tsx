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
  Wifi,
  X
} from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cityHealth] = useState(87);
  const [sensorsOnline] = useState(243);
  const [riskLevel] = useState<'LOW' | 'MED' | 'HIGH'>('LOW');
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const water = [30, 32, 31, 33, 35, 34, 36];
  const air = [60, 58, 61, 62, 64, 63, 65];
  const temp = [26, 27, 27, 28, 29, 28, 30];
  const labels = ['1h', '2h', '3h', '4h', '5h', '6h', 'Now'];

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<Set<'water' | 'air' | 'temp'>>(new Set(['water']));
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const iot = { active: 247, weak: 3, offline: 2 };
  const incidents = { resolved: 25, active: 3, critical: 1, daily: [3, 4, 5, 2, 6, 3, 2] };
  const perf = { response: '2.4s', accuracy: '99.8%', battery: '78%' };

  // Mock alerts for demonstration
  const mockAlerts = [
    {
      id: 'alert-1',
      type: 'warning',
      title: 'High Sensor Activity',
      message: 'Multiple sensors reporting elevated readings in Zone 3',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'alert-2',
      type: 'info',
      title: 'System Update',
      message: 'Scheduled maintenance completed successfully',
      timestamp: new Date(Date.now() - 300000).toISOString(),
    }
  ];

  const activeAlerts = mockAlerts.filter(alert => !dismissedAlerts.has(alert.id));

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      case 'info': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const toggleMetric = (metric: 'water' | 'air' | 'temp') => {
    setSelectedMetrics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(metric)) {
        if (newSet.size > 1) { // Don't allow removing all metrics
          newSet.delete(metric);
        }
      } else {
        newSet.add(metric);
      }
      return newSet;
    });
  };

  const handleNavigation = (page: string) => {
    setSidebarOpen(false);
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'gis':
        navigate('/gis');
        break;
      case 'analytics':
        // Already on dashboard/analytics
        break;
      case 'settings':
        navigate('/admin');
        break;
      default:
        break;
    }
  };

  const getMetricColor = (metric: 'water' | 'air' | 'temp') => {
    switch (metric) {
      case 'water': return '#3b82f6';
      case 'air': return '#10b981';
      case 'temp': return '#fb923c';
    }
  };

  const Sidebar: React.FC = () => (
      <div className={`dashboard-sidebar ${isMobile ? 'mobile' : 'desktop'} ${isMobile && sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img
                src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                alt="CIVILIAN"
                className="logo"
            />
            <span className="logo-text">CIVILIAN</span>
          </div>
          {isMobile && (
              <button
                  onClick={() => setSidebarOpen(false)}
                  className="close-button"
              >
                <X size={20} />
              </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => handleNavigation('home')} className="nav-item">
            <Home size={18} />
            <span className="nav-label">Dashboard</span>
          </button>
          <button onClick={() => handleNavigation('gis')} className="nav-item">
            <MapPin size={18} />
            <span className="nav-label">Map</span>
          </button>
          <button onClick={() => handleNavigation('analytics')} className="nav-item active">
            <BarChart3 size={18} />
            <span className="nav-label">Analytics</span>
          </button>
          <button onClick={() => handleNavigation('settings')} className="nav-item">
            <Settings size={18} />
            <span className="nav-label">Admin</span>
          </button>
        </nav>
      </div>
  );

  return (
      <div className="dashboard-page">
        <Sidebar />

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
            <div
                className="mobile-overlay"
                onClick={() => setSidebarOpen(false)}
            />
        )}

        <main className="dashboard-main">
          <header className="dashboard-topbar">
            <div className="top-left">
              {isMobile && (
                  <button
                      onClick={() => setSidebarOpen(true)}
                      className="mobile-logo-button"
                  >
                    <img
                        src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                        alt="CIVILIAN"
                        className="mobile-logo"
                    />
                    <span className="mobile-logo-text">CIVILIAN</span>
                  </button>
              )}
              <div className="live-indicator">
                <span className="live-dot" />
                <span className="live-text">LIVE</span>
              </div>
              {!isMobile && <div className="page-title">Analytics Dashboard</div>}
            </div>

            <div className="top-right">
              <div className="header-alerts">
                <Bell size={14} />
                <span className="alerts-count">{activeAlerts.length}</span>
              </div>
              <div className="clock">
                {isMobile ? currentTime.slice(0, 5) : currentTime}
              </div>
            </div>
          </header>

          {/* Alert Messages */}
          {activeAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
                <div key={alert.id} className={`alert-message ${alert.type}`}>
                  <div className="alert-message-content">
                    <div className="alert-message-icon">
                      <Icon size={16} />
                    </div>
                    <div className="alert-message-text">
                      <span className="alert-message-title">{alert.title}</span>
                      <span className="alert-message-description">{alert.message}</span>
                    </div>
                  </div>
                  <button
                      onClick={() => dismissAlert(alert.id)}
                      className="alert-message-close"
                  >
                    <X size={16} />
                  </button>
                </div>
            );
          })}

          <div className="dashboard-content">
            {!isMobile && (
                <section className="cards-row">
                  <div className="metric-card health">
                    <div className="metric-header">
                      <div className="metric-icon">
                        <CheckCircle size={20} />
                      </div>
                      <div className="metric-info">
                        <div className="metric-title">CITY HEALTH</div>
                        <div className="metric-value">{cityHealth}%</div>
                        <div className="metric-sub">All Systems</div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card sensors">
                    <div className="metric-header">
                      <div className="metric-icon">
                        <Wifi size={20} />
                      </div>
                      <div className="metric-info">
                        <div className="metric-title">SENSORS</div>
                        <div className="metric-value">{sensorsOnline}</div>
                        <div className="metric-sub">Online</div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card risk">
                    <div className="metric-header">
                      <div className="metric-icon">
                        <AlertCircle size={20} />
                      </div>
                      <div className="metric-info">
                        <div className="metric-title">RISK LEVEL</div>
                        <div className="metric-value">{riskLevel}</div>
                        <div className="metric-sub">Current Status</div>
                      </div>
                    </div>
                  </div>
                </section>
            )}

            <section className="chart-row">
              <div className="card chart-card">
                <div className="card-header">
                  <div className="card-title-with-icon">
                    <Activity size={18} />
                    <span>Real-time Sensor Data</span>
                  </div>
                  <div className="metric-selector">
                    <button
                        className={`metric-btn ${selectedMetrics.has('water') ? 'active' : ''}`}
                        onClick={() => toggleMetric('water')}
                    >
                      Water Level
                    </button>
                    <button
                        className={`metric-btn ${selectedMetrics.has('air') ? 'active' : ''}`}
                        onClick={() => toggleMetric('air')}
                    >
                      Air Quality
                    </button>
                    <button
                        className={`metric-btn ${selectedMetrics.has('temp') ? 'active' : ''}`}
                        onClick={() => toggleMetric('temp')}
                    >
                      Temperature
                    </button>
                  </div>
                </div>

                <div className="chart-container">
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
                    <div className="chart-svg-container">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                        {/* Area fills and lines for each selected metric */}
                        <defs>
                          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                          </linearGradient>
                          <linearGradient id="airGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                          </linearGradient>
                          <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#fb923c" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>

                        {/* Render all selected metrics */}
                        {Array.from(selectedMetrics).map((metric) => (
                            <g key={metric}>
                              <polygon
                                  className={`area ${metric}`}
                                  points={`0,100 ${seriesPoints[metric].map(p => `${p.x},${p.y}`).join(' ')} 100,100`}
                                  fill={`url(#${metric}Gradient)`}
                              />
                              <polyline
                                  className={`line ${metric}`}
                                  points={seriesPoints[metric].map(p => `${p.x},${p.y}`).join(' ')}
                                  fill="none"
                                  stroke={getMetricColor(metric)}
                                  strokeWidth={2.5}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                              />
                            </g>
                        ))}

                        {/* Hover indicator line */}
                        {hoverIndex !== null && (
                            <line
                                x1={seriesPoints.water[hoverIndex].x}
                                y1="0"
                                x2={seriesPoints.water[hoverIndex].x}
                                y2="100"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="1"
                                strokeDasharray="2,2"
                            />
                        )}

                        {/* Hover dots for all selected metrics */}
                        {hoverIndex !== null && Array.from(selectedMetrics).map((metric) => (
                            <circle
                                key={metric}
                                cx={seriesPoints[metric][hoverIndex].x}
                                cy={seriesPoints[metric][hoverIndex].y}
                                r={4}
                                fill={getMetricColor(metric)}
                                stroke="#fff"
                                strokeWidth="2"
                            />
                        ))}

                        {/* Invisible hit areas for hover */}
                        {seriesPoints.water.map((p, idx) => (
                            <rect
                                key={idx}
                                x={p.x - 7}
                                y={0}
                                width="14"
                                height={100}
                                fill="transparent"
                                onMouseEnter={() => setHoverIndex(idx)}
                                style={{ cursor: 'crosshair' }}
                            />
                        ))}
                      </svg>
                    </div>

                    <div className="chart-x-axis">
                      {labels.map((label, i) => (
                          <span key={i}>{label}</span>
                      ))}
                    </div>

                    {hoverIndex !== null && (
                        <div
                            className="chart-tooltip"
                            style={{
                              left: `${25 + (seriesPoints.water[hoverIndex].x * 0.75)}%`,
                              top: '20px'
                            }}
                        >
                          <div className="tooltip-time">{labels[hoverIndex] ?? labels[labels.length - 1]}</div>
                          {Array.from(selectedMetrics).map((metric) => (
                              <div key={metric} className="tooltip-value">
                          <span className="value-label" style={{ color: getMetricColor(metric) }}>
                            {metric === 'water' ? 'Water' : metric === 'air' ? 'Air' : 'Temp'}:
                          </span>
                                <span className="value-number">
                            {seriesPoints[metric][hoverIndex].value}
                                  {metric === 'temp' ? '°C' : ''}
                          </span>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
                </div>
              </div>

              {!isMobile && (
                  <div className="card small-card network-card">
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
              )}
            </section>

            {/* Mobile Status Cards */}
            {isMobile && (
                <section className="mobile-status-grid">
                  <div className="status-card network-card">
                    <div className="card-header">
                      <Wifi size={20} className="card-icon network-icon" />
                      <span className="card-title">IoT & Nodes</span>
                    </div>
                    <div className="card-content">
                      <div className="status-item">Network Status:</div>
                      <div className="status-value success">
                        <div className="status-indicator"></div>
                        {iot.active} Nodes Active
                      </div>
                      <div className="status-value success">
                        <div className="status-indicator"></div>
                        Mesh Stable
                      </div>
                    </div>
                  </div>

                  <div className="status-card health-card">
                    <div className="card-header">
                      <CheckCircle size={20} className="card-icon health-icon" />
                      <span className="card-title">City Health</span>
                    </div>
                    <div className="card-content">
                      <div className="status-item">Overall Health:</div>
                      <div className="status-value success">
                        <div className="status-indicator"></div>
                        {cityHealth}% Healthy
                      </div>
                      <div className="status-value success">
                        <div className="status-indicator"></div>
                        All Systems OK
                      </div>
                    </div>
                  </div>
                </section>
            )}

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

          {/* Mobile bottom navigation */}
          {isMobile && (
              <div className="bottom-nav">
                <button onClick={() => handleNavigation('home')} className="nav-button">
                  <Home size={20} />
                  <span>Home</span>
                </button>
                <button onClick={() => handleNavigation('gis')} className="nav-button">
                  <MapPin size={20} />
                  <span>Map</span>
                </button>
                <button onClick={() => handleNavigation('analytics')} className="nav-button active">
                  <BarChart3 size={20} />
                  <span>Stats</span>
                </button>
                <button onClick={() => handleNavigation('settings')} className="nav-button">
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </div>
          )}
        </main>
      </div>
  );
};

export default Dashboard;