import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Building2, AlertTriangle, Radio, Home, BarChart3, Settings, Droplet, X, MapPin, Bell, ChevronDown } from 'lucide-react';
import * as Chart from 'chart.js';
import './HomePage.css';
import {BarController, BarElement, CategoryScale, LinearScale} from "chart.js";

Chart.Chart.register(
    Chart.CategoryScale,
    Chart.LinearScale,
    Chart.BarElement,
    Chart.Title,
    Chart.Tooltip,
    Chart.Legend
);

// @ts-ignore
Chart.Chart.register(BarController, BarElement, CategoryScale, LinearScale);


const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart.Chart | null>(null);

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

    // Sample data for the daily incident alert chart
    const chartData = [
        { value: 2, label: 'Mon', type: 'flood' },
        { value: 5, label: 'Tue', type: 'fire' },
        { value: 1, label: 'Wed', type: 'earthquake' },
        { value: 8, label: 'Thu', type: 'weather' },
        { value: 3, label: 'Fri', type: 'flood' },
        { value: 6, label: 'Sat', type: 'fire' },
        { value: 2, label: 'Sun', type: 'weather' }
    ];

    // Initialize Chart.js
    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                // Destroy existing chart if it exists
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                chartInstance.current = new Chart.Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: chartData.map(d => d.label),
                        datasets: [{
                            label: 'Incident Alerts',
                            data: chartData.map(d => d.value),
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                backgroundColor: 'rgba(15, 20, 25, 0.95)',
                                titleColor: '#ffffff',
                                bodyColor: '#d1d5db',
                                borderColor: 'rgba(59, 130, 246, 0.5)',
                                borderWidth: 1,
                                cornerRadius: 8,
                                displayColors: false,
                                titleFont: {
                                    size: 14,
                                    weight: 600
                                },
                                bodyFont: {
                                    size: 13
                                },
                                callbacks: {
                                    title: function(context) {
                                        return context[0].label;
                                    },
                                    label: function(context) {
                                        return `${context.parsed.y} incidents`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(107, 114, 128, 0.2)',
                                    // @ts-ignore
                                    drawBorder: false
                                },
                                ticks: {
                                    color: '#9ca3af',
                                    font: {
                                        size: 11,
                                        weight: 500
                                    },
                                    stepSize: 2,
                                    callback: function(value) {
                                        return Number.isInteger(value as number) ? value : '';
                                    }
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    color: '#9ca3af',
                                    font: {
                                        size: 11,
                                        weight: 600
                                    }
                                }
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        },
                        animation: {
                            duration: 1000,
                            easing: 'easeInOutCubic'
                        }
                    }
                });
            }
        }

        // Cleanup function
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [isMobile]); // Re-render chart when mobile state changes

    const handleNavigation = (page: string) => {
        setSidebarOpen(false);

        switch (page) {
            case 'home':
                break;
            case 'gis':
                navigate('/gis');
                break;
            case 'dashboard':
                navigate('/dashboard');
                break;
            case 'settings':
                console.log('Navigate to settings');
                break;
            case 'menu':
                navigate('/menu');
                break;
            default:
                break;
        }
    };

    const handleLogoClick = () => {
        navigate('/menu');
    };

    const Sidebar: React.FC = () => (
        <div className={`sidebar ${isMobile ? 'mobile' : 'desktop'} ${isMobile && sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <button onClick={handleLogoClick} className="logo-container clickable-logo">
                    <img
                        src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                        alt="CIVILIAN"
                        className="logo"
                    />
                    <span className="logo-text">CIVILIAN</span>
                    <ChevronDown size={16} className="logo-arrow" />
                </button>
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
                    <a onClick={() => navigate("/home")} className="nav-item active">
                        <Home size={20} />
                        <span className="nav-label">Dashboard</span>
                    </a>
                    <a onClick={() => navigate("/gis")} className="nav-item ">
                        <MapPin size={20} />
                        <span className="nav-label">Map</span>
                    </a>
                    <a onClick={() => navigate("/dashboard")} className="nav-item">
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
                    {isMobile && (
                        <button
                            onClick={handleLogoClick}
                            className="mobile-logo-button clickable-mobile-logo"
                        >
                            <img
                                src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                                alt="CIVILIAN"
                                className="mobile-logo"
                            />
                            <span className="mobile-logo-text">CIVILIAN</span>
                            <ChevronDown size={12} className="mobile-logo-arrow" />
                        </button>
                    )}

                    <div className="live-indicator">
                        <div className="live-dot" />
                        <span className="live-text">LIVE</span>
                    </div>

                    <div className="header-alerts">
                        <Bell size={14} />
                        <span className="alerts-count">0</span>
                    </div>

                    <div className="clock">
                        {isMobile ? currentTime.toLocaleTimeString().slice(0, 5) : currentTime.toLocaleTimeString()}
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

                    {/* Daily Incident Chart Section */}
                    <div className="chart-section">
                        <div className="chart-header">
                            <h3>Daily Incident Alerts</h3>
                            <span className="chart-subtitle">This Week's Activity</span>
                        </div>
                        <div className="chart-wrapper">
                            <canvas ref={chartRef} className="chart-canvas"></canvas>
                        </div>
                    </div>

                    {/* Status Cards Grid */}
                    <div className="status-grid">
                        {/* Network Status */}
                        <div className="status-card network-card">
                            <div className="card-header">
                                <Wifi size={20} className="card-icon network-icon" />
                                <span className="card-title">IoT & Nodes</span>
                            </div>
                            <div className="card-content">
                                <div className="status-item">Network Status:</div>
                                <div className="status-value success">
                                    <div className="status-indicator"></div>
                                    47 Nodes Active
                                </div>
                                <div className="status-value success">
                                    <div className="status-indicator"></div>
                                    Mesh Stable
                                </div>
                            </div>
                        </div>

                        {/* Flood Monitor */}
                        <div className="status-card flood-card">
                            <div className="card-header">
                                <Droplet size={20} className="card-icon flood-icon" />
                                <span className="card-title">Flood Monitor</span>
                            </div>
                            <div className="card-content">
                                <div className="status-item">Water Levels:</div>
                                <div className="status-value warning">
                                    <div className="status-indicator warning"></div>
                                    River: 2.3m
                                </div>
                                <div className="status-value success">
                                    <div className="status-indicator"></div>
                                    Streets: Normal
                                </div>
                            </div>
                        </div>

                        {/* Building Status */}
                        <div className="status-card building-card">
                            <div className="card-header">
                                <Building2 size={20} className="card-icon building-icon" />
                                <span className="card-title">Building Status</span>
                            </div>
                            <div className="card-content">
                                <div className="status-item">Health Status:</div>
                                <div className="status-value success">
                                    <div className="status-indicator"></div>
                                    All Stable
                                </div>
                                <div className="status-value success">
                                    <div className="status-indicator"></div>
                                    No Stress
                                </div>
                            </div>
                        </div>

                        {/* Crowd Flow */}
                        <div className="status-card crowd-card">
                            <div className="card-header">
                                <Radio size={20} className="card-icon crowd-icon" />
                                <span className="card-title">Crowd Flow</span>
                            </div>
                            <div className="card-content">
                                <div className="status-item">Density Map:</div>
                                <div className="status-value success">
                                    <div className="status-indicator"></div>
                                    Low Density
                                </div>
                                <div className="status-value warning">
                                    <div className="status-indicator warning"></div>
                                    Mall Area: Medium
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Risk Forecast */}
                    <div className="ai-forecast">
                        <div className="forecast-header">
                            <AlertTriangle size={20} className="forecast-icon" />
                            <span className="forecast-title">AI Risk Forecast</span>
                        </div>
                        <div className="forecast-content">
                            <div className="forecast-item">Next 24Hr Prediction:</div>
                            <div className="forecast-value">
                                <div className="status-indicator"></div>
                                Low Risk (15% Rainfall)
                            </div>
                        </div>
                    </div>

                    {/* Emergency Ready */}
                    <div className="emergency-section">
                        <div className="emergency-header">
                            <Radio size={20} className="emergency-icon" />
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
                        <button onClick={() => handleNavigation('home')} className="nav-button active">
                            <Home size={20} />
                            <span>Home</span>
                        </button>
                        <button onClick={() => handleNavigation('gis')} className="nav-button">
                            <MapPin size={20} />
                            <span>Map</span>
                        </button>
                        <button onClick={() => handleNavigation('dashboard')} className="nav-button">
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