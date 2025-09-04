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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cityHealth] = useState(87);
  const [sensorsOnline] = useState(243);
  const [riskLevel] = useState<'LOW' | 'MED' | 'HIGH'>('LOW');
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Real-time sensor data with more realistic values
  const sensorData = [
    {
      time: '6h ago',
      timeLabel: '6h',
      waterLevel: 28.5,
      airQuality: 72.3,
      temperature: 24.2
    },
    {
      time: '5h ago',
      timeLabel: '5h',
      waterLevel: 29.8,
      airQuality: 68.7,
      temperature: 25.1
    },
    {
      time: '4h ago',
      timeLabel: '4h',
      waterLevel: 31.2,
      airQuality: 74.1,
      temperature: 26.3
    },
    {
      time: '3h ago',
      timeLabel: '3h',
      waterLevel: 33.6,
      airQuality: 69.5,
      temperature: 27.8
    },
    {
      time: '2h ago',
      timeLabel: '2h',
      waterLevel: 35.4,
      airQuality: 71.9,
      temperature: 28.4
    },
    {
      time: '1h ago',
      timeLabel: '1h',
      waterLevel: 34.7,
      airQuality: 76.2,
      temperature: 29.1
    },
    {
      time: 'Now',
      timeLabel: 'Now',
      waterLevel: 36.8,
      airQuality: 78.6,
      temperature: 29.7
    }
  ];

  const [selectedMetrics, setSelectedMetrics] = useState<Set<'waterLevel' | 'airQuality' | 'temperature'>>(
      new Set(['waterLevel', 'airQuality', 'temperature'])
  );
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const iot = { active: 247, weak: 3, offline: 2 };
  const incidents = { resolved: 25, active: 3, critical: 1, daily: [3, 4, 5, 2, 6, 3, 2] };
  const perf = { response: '2.4s', accuracy: '99.8%', battery: '78%' };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(107, 114, 128, 0.2)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' ' + getMetricUnit(context.dataset.label as 'waterLevel' | 'airQuality' | 'temperature');
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.8)',
          font: {
            size: isMobile ? 9 : 11,
            family: 'Inter, system-ui, -apple-system, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.8)',
          font: {
            size: isMobile ? 9 : 11,
            family: 'Inter, system-ui, -apple-system, sans-serif'
          }
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  // Chart data
  const chartData = {
    labels: sensorData.map(data => data.timeLabel),
    datasets: [
      {
        label: 'Water Level',
        data: selectedMetrics.has('waterLevel') ? sensorData.map(data => data.waterLevel) : [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: isMobile ? 3 : 4,
        pointHoverRadius: isMobile ? 5 : 6,
      },
      {
        label: 'Air Quality',
        data: selectedMetrics.has('airQuality') ? sensorData.map(data => data.airQuality) : [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: isMobile ? 3 : 4,
        pointHoverRadius: isMobile ? 5 : 6,
      },
      {
        label: 'Temperature',
        data: selectedMetrics.has('temperature') ? sensorData.map(data => data.temperature) : [],
        borderColor: '#fb923c',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fb923c',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: isMobile ? 3 : 4,
        pointHoverRadius: isMobile ? 5 : 6,
      },
    ],
  };

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

  const toggleMetric = (metric: 'waterLevel' | 'airQuality' | 'temperature') => {
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
        navigate('/home');
        break;
      case 'gis':
        navigate('/gis');
        break;
      case 'analytics':
        break;
      case 'settings':
        navigate('/admin');
        break;
      default:
        break;
    }
  };
  const getMetricUnit = (metric: 'waterLevel' | 'airQuality' | 'temperature') => {
    switch (metric) {
      case 'waterLevel': return 'cm';
      case 'airQuality': return 'AQI';
      case 'temperature': return '°C';
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
          <div className="nav-items">
            <a onClick={() => navigate("/home")} className="nav-item">
              <Home size={20} />
              <span className="nav-label">Dashboard</span>
            </a>
            <a onClick={() => navigate("/gis")} className="nav-item">
              <MapPin size={20} />
              <span className="nav-label">Map</span>
            </a>
            <a onClick={() => navigate("/dashboard")} className="nav-item active">
              <BarChart3 size={20} />
              <span className="nav-label">Analytics</span>
            </a>
            <a onClick={() => navigate("/settings")} className="nav-item">
              <Settings size={20} />
              <span className="nav-label">Settings</span>
            </a>
          </div>
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
                <span className="alerts-count">0</span>
              </div>
              <div className="clock">
                {isMobile ? currentTime.slice(0, 5) : currentTime}
              </div>
            </div>
          </header>

          <div className="dashboard-content">
            {/* Summary Cards */}
            <section className="cards-section">
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

            {/* Charts Row */}
            <section className="charts-section">
              <div className="card chart-card">
                <div className="card-header">
                  <div className="card-title-with-icon">
                    <Activity size={18} />
                    <span>Real-time Sensor Data</span>
                  </div>
                  <div className="metric-selector">
                    <button
                        className={`metric-btn ${selectedMetrics.has('waterLevel') ? 'active' : ''}`}
                        onClick={() => toggleMetric('waterLevel')}
                    >
                      Water Level
                    </button>
                    <button
                        className={`metric-btn ${selectedMetrics.has('airQuality') ? 'active' : ''}`}
                        onClick={() => toggleMetric('airQuality')}
                    >
                      Air Quality
                    </button>
                    <button
                        className={`metric-btn ${selectedMetrics.has('temperature') ? 'active' : ''}`}
                        onClick={() => toggleMetric('temperature')}
                    >
                      Temperature
                    </button>
                  </div>
                </div>

                <div className="chart-container">
                  <Line options={chartOptions} data={chartData} />
                </div>
              </div>

              <div className="card small-card network-card">
                <div className="card-header">
                  <div className="card-title-with-icon">
                    <Wifi size={18} />
                    <span>IoT Network Health</span>
                  </div>
                </div>

                <div className="network-visual">
                  <div className="network-grid">
                    <div className="network-status-card active">
                      <div className="network-header">
                        <div className="status-indicator online"></div>
                        <span className="network-label">Active</span>
                      </div>
                      <div className="network-value">{iot.active}</div>
                      <div className="network-sub">Nodes Online</div>
                    </div>

                    <div className="network-status-card weak">
                      <div className="network-header">
                        <div className="status-indicator weak"></div>
                        <span className="network-label">Weak</span>
                      </div>
                      <div className="network-value">{iot.weak}</div>
                      <div className="network-sub">Signal Issues</div>
                    </div>

                    <div className="network-status-card offline">
                      <div className="network-header">
                        <div className="status-indicator offline"></div>
                        <span className="network-label">Offline</span>
                      </div>
                      <div className="network-value">{iot.offline}</div>
                      <div className="network-sub">Not Responding</div>
                    </div>
                  </div>

                  <div className="network-summary">
                    <div className="summary-stat">
                      <span className="summary-label">Total Coverage</span>
                      <span className="summary-value">98.2%</span>
                    </div>
                    <div className="summary-stat">
                      <span className="summary-label">Avg Signal</span>
                      <span className="summary-value">Strong</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Analytics Row */}
            <section className="analytics-section">
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

            {/* Performance Section */}
            <section className="performance-section">
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