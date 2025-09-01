import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Building2, AlertTriangle, Radio, Home, BarChart3, Settings, Waves, X, MapPin } from 'lucide-react';
import './HomePage.css';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
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

    // Sample data for the chart
    const chartData = [
        { value: 45, label: 'Mon' },
        { value: 65, label: 'Tue' },
        { value: 35, label: 'Wed' },
        { value: 80, label: 'Thu' },
        { value: 55, label: 'Fri' },
        { value: 70, label: 'Sat' },
        { value: 25, label: 'Sun' }
    ];

    const maxValue = Math.max(...chartData.map(d => d.value));

    const handleNavigation = (page: string) => {
        setSidebarOpen(false);

        switch (page) {
            case 'dashboard':
                // Already on dashboard, no navigation needed
                break;
            case 'gis':
                navigate('/gis');
                break;
            case 'analytics':
                // Add route for analytics if needed
                console.log('Navigate to analytics');
                break;
            case 'settings':
                // Add route for settings if needed
                console.log('Navigate to settings');
                break;
            default:
                break;
        }
    };

    const Sidebar: React.FC = () => (
        <div className={`sidebar ${isMobile ? 'mobile' : 'desktop'} ${isMobile && sidebarOpen ? 'open' : ''}`}>
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
                    <button onClick={() => handleNavigation('dashboard')} className="nav-item active">
                        <Home size={20} />
                        <span className="nav-label">Dashboard</span>
                    </button>
                    <button onClick={() => handleNavigation('gis')} className="nav-item">
                        <MapPin size={20} />
                        <span className="nav-label">GIS Map</span>
                    </button>
                    <button onClick={() => handleNavigation('analytics')} className="nav-item">
                        <BarChart3 size={20} />
                        <span className="nav-label">Analytics</span>
                    </button>
                    <button onClick={() => handleNavigation('settings')} className="nav-item">
                        <Settings size={20} />
                        <span className="nav-label">Settings</span>
                    </button>
                </div>
            </nav>
        </div>
    );

    return (
        <div className="homepage">
            <Sidebar />

            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="main-content">
                {/* Header */}
                <header className="header">
                    {isMobile ? (
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
                    ) : (
                        <div></div>
                    )}

                    <div className="live-indicator">
                        <div className="live-dot" />
                        <span className="live-text">LIVE</span>
                    </div>

                    <div className="clock">
                        {currentTime.toLocaleTimeString()}
                    </div>
                </header>

                <div className="content">
                    {/* Alert Status */}
                    <div className="alert-status">
                        <div className="alert-header">
                            <div className="alert-icon"></div>
                            <h2>Alert Status</h2>
                        </div>
                        <p className="alert-message">All clear - Monitoring Active</p>
                        <p className="alert-time">Last Update: {currentTime.toLocaleTimeString()} GMT +8</p>
                    </div>

                    {/* Chart Section */}
                    <div className="chart-section">
                        <div className="chart-container">
                            {chartData.map((item, index) => (
                                <div key={index} className="chart-bar">
                                    <div
                                        className="bar-fill"
                                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                                    ></div>
                                    <span className="bar-label">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Cards Grid */}
                    <div className="status-grid">
                        {/* Network Status */}
                        <div className="status-card network-card">
                            <div className="card-header">
                                <Wifi size={16} className="card-icon network-icon" />
                                <span className="card-title">IoT & Nodes</span>
                            </div>
                            <div className="card-content">
                                <div className="status-item">Network Status:</div>
                                <div className="status-value success">✓ 47 Nodes Active</div>
                                <div className="status-value success">✓ Mesh Stable</div>
                            </div>
                        </div>

                        {/* Flood Monitor */}
                        <div className="status-card flood-card">
                            <div className="card-header">
                                <div className="card-icon-box flood">
                                    <Waves size={16} />
                                </div>
                                <span className="card-title">Flood Monitor</span>
                            </div>
                            <div className="card-content">
                                <div className="status-item">Water Levels:</div>
                                <div className="status-value warning">⚠ River: 2.3m</div>
                                <div className="status-value success">✓ Streets: Normal</div>
                            </div>
                        </div>

                        {/* Building Status */}
                        <div className="status-card building-card">
                            <div className="card-header">
                                <Building2 size={16} className="card-icon building-icon" />
                                <span className="card-title">Building Status</span>
                            </div>
                            <div className="card-content">
                                <div className="status-item">Health Status:</div>
                                <div className="status-value success">✓ All Stable</div>
                                <div className="status-value success">✓ No Stress</div>
                            </div>
                        </div>

                        {/* Crowd Flow */}
                        <div className="status-card crowd-card">
                            <div className="card-header">
                                <Radio size={16} className="card-icon crowd-icon" />
                                <span className="card-title">Crowd Flow</span>
                            </div>
                            <div className="card-content">
                                <div className="status-item">Density Map:</div>
                                <div className="status-value success">✓ Low Density</div>
                                <div className="status-value warning">⚠ Mall Area: Medium</div>
                            </div>
                        </div>
                    </div>

                    {/* AI Risk Forecast */}
                    <div className="ai-forecast">
                        <div className="forecast-header">
                            <AlertTriangle size={16} className="forecast-icon" />
                            <span className="forecast-title">AI Risk Forecast</span>
                        </div>
                        <div className="forecast-content">
                            <div className="forecast-item">Next 24Hr Prediction:</div>
                            <div className="forecast-value">✓ Low Risk (15% Rainfall)</div>
                        </div>
                    </div>

                    {/* Emergency Ready */}
                    <div className="emergency-section">
                        <div className="emergency-header">
                            <Radio size={16} className="emergency-icon" />
                            <span className="emergency-title">Emergency Ready</span>
                        </div>
                        <div className="emergency-buttons">
                            <button className="emergency-btn alert-btn">Alert</button>
                            <button className="emergency-btn route-btn">Route</button>
                            <button className="emergency-btn help-btn">Help</button>
                        </div>
                    </div>
                </div>

                {/* Mobile bottom navigation */}
                {isMobile && (
                    <div className="bottom-nav">
                        <button onClick={() => handleNavigation('dashboard')} className="nav-button active">
                            <Home size={20} />
                            <span>Home</span>
                        </button>
                        <button onClick={() => handleNavigation('gis')} className="nav-button">
                            <MapPin size={20} />
                            <span>Map</span>
                        </button>
                        <button onClick={() => handleNavigation('analytics')} className="nav-button">
                            <BarChart3 size={20} />
                            <span>Stats</span>
                        </button>
                        <button onClick={() => handleNavigation('settings')} className="nav-button">
                            <Settings size={20} />
                            <span>Settings</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;