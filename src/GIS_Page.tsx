import React, { useState, useEffect, useRef } from 'react';
import { Filter, MapPin, AlertTriangle, Flame, Home, BarChart3, Settings, X, Zap, CloudRain, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { useAlerts, requestNotificationPermission, showNotification } from './services/alerts/userAlerts';
import './GIS_Page.css';

const GISPage: React.FC = () => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
    const [alertsExpanded, setAlertsExpanded] = useState<boolean>(false);
    const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
    const [activeFilters, setActiveFilters] = useState({
        earthquake: true,
        flood: true,
        fire: true,
        weather: true
    });
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
    const mapRef = useRef<HTMLDivElement>(null);

    // Get real-time alerts
    const { alerts, isLoading: alertsLoading, error: alertsError } = useAlerts();

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
            if (!newIsMobile) {
                setFiltersExpanded(false);
                setAlertsExpanded(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Request notification permission on mount
    useEffect(() => {
        const setupNotifications = async () => {
            const permission = await requestNotificationPermission();
            setNotificationsEnabled(permission);
        };
        setupNotifications();
    }, []);

    // Show notifications for new alerts
    useEffect(() => {
        if (alerts.length > 0 && notificationsEnabled) {
            // Get the most recent alert
            const latestAlert = alerts[0];
            const alertTime = new Date(latestAlert.timestamp).getTime();
            const now = Date.now();

            // Only show notification if the alert is less than 30 seconds old
            if (now - alertTime < 30000) {
                showNotification(latestAlert);
            }
        }
    }, [alerts, notificationsEnabled]);

    // Initialize map with alert markers
    useEffect(() => {
        if (mapRef.current && !mapLoaded) {
            // Create iframe for Google Maps embed (Metro Manila)
            const iframe = document.createElement('iframe');
            iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247794.72467128634!2d120.8194!3d14.6091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90aac89c11f%3A0x393171db35dd5d80!2sMetro%20Manila!5e0!3m2!1sen!2sph!4v1647890123456!5m2!1sen!2sph&maptype=terrain";
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.style.border = "0";
            iframe.style.borderRadius = "0";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";
            iframe.referrerPolicy = "no-referrer-when-downgrade";
            iframe.title = "Metro Manila Disaster Monitoring Map";

            mapRef.current.appendChild(iframe);
            setMapLoaded(true);
        }
    }, []);

    const toggleFilter = (filterType: keyof typeof activeFilters) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterType]: !prev[filterType]
        }));
    };

    const dismissAlert = (alertId: string | undefined) => {
        // @ts-ignore
        setDismissedAlerts(prev => new Set([...prev, alertId]));
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'earthquake': return Zap;
            case 'fire': return Flame;
            case 'flood': return AlertTriangle;
            case 'weather': return CloudRain;
            default: return AlertTriangle;
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'earthquake': return '#8B5CF6'; // Purple
            case 'fire': return '#EF4444'; // Red
            case 'flood': return '#3B82F6'; // Blue
            case 'weather': return '#10B981'; // Green
            default: return '#6B7280'; // Gray
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return '#DC2626'; // Red
            case 'high': return '#EA580C'; // Orange
            case 'medium': return '#D97706'; // Amber
            case 'low': return '#65A30D'; // Lime
            default: return '#6B7280'; // Gray
        }
    };

    const filteredAlerts = alerts.filter(alert =>
        activeFilters[alert.type as keyof typeof activeFilters] &&
        !dismissedAlerts.has(alert.id as string)
    );

    const FilterButton: React.FC<{
        type: keyof typeof activeFilters;
        icon: React.ComponentType<{ size: number }>;
        label: string;
        color: string;
        active: boolean;
        count: number;
    }> = ({ type, icon: Icon, label, color, active, count }) => (
        <button
            onClick={() => toggleFilter(type)}
            className={`filter-button ${active ? `active ${color}` : 'inactive'}`}
        >
            <Icon size={14} />
            <span className="filter-label">{isMobile ? label.split(' ')[0] : label}</span>
            {count > 0 && <span className="filter-count">{count}</span>}
        </button>
    );

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
                    <a href="#" className="nav-item">
                        <Home size={20} />
                        <span className="nav-label">Dashboard</span>
                    </a>
                    <a href="#" className="nav-item active">
                        <MapPin size={20} />
                        <span className="nav-label">GIS Map</span>
                    </a>
                    <a href="#" className="nav-item">
                        <BarChart3 size={20} />
                        <span className="nav-label">Analytics</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Settings size={20} />
                        <span className="nav-label">Settings</span>
                    </a>
                </div>
            </nav>
        </div>
    );

    return (
        <div className="gis-page">
            <Sidebar />

            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="main-content">
                {/* Header */}
                <header className="header">
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
                        <div className="live-dot" />
                        <span className="live-text">LIVE</span>
                    </div>

                    <div className="header-alerts">
                        <Bell size={14} />
                        <span className="alerts-count">{filteredAlerts.length}</span>
                        {!notificationsEnabled && !isMobile && (
                            <button
                                onClick={async () => {
                                    const permission = await requestNotificationPermission();
                                    setNotificationsEnabled(permission);
                                }}
                                className="enable-notifications-btn"
                            >
                                Enable Notifications
                            </button>
                        )}
                    </div>

                    <div className="clock">
                        {isMobile ? currentTime.slice(0, 5) : currentTime}
                    </div>
                </header>

                {/* Alert Status Messages */}
                {alertsError && !dismissedAlerts.has('error-alert') && (
                    <div className="alert-message error">
                        <div className="alert-message-content">
                            <div className="alert-message-icon">
                                <AlertTriangle size={16} />
                            </div>
                            <div className="alert-message-text">
                                <span className="alert-message-title">Connection Error</span>
                                <span className="alert-message-description">Unable to load real-time alerts. Please check your connection.</span>
                            </div>
                        </div>
                        <button
                            onClick={() => dismissAlert('error-alert')}
                            className="alert-message-close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {alertsLoading && !dismissedAlerts.has('loading-alert') && (
                    <div className="alert-message loading">
                        <div className="alert-message-content">
                            <div className="alert-message-icon">
                                <div className="loading-spinner-small"></div>
                            </div>
                            <div className="alert-message-text">
                                <span className="alert-message-title">Loading Alerts</span>
                                <span className="alert-message-description">Fetching real-time disaster alerts...</span>
                            </div>
                        </div>
                        <button
                            onClick={() => dismissAlert('loading-alert')}
                            className="alert-message-close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Mobile Alerts Toggle */}
                {isMobile && filteredAlerts.length > 0 && (
                    <div className="alerts-mobile-toggle">
                        <button
                            onClick={() => setAlertsExpanded(!alertsExpanded)}
                            className="alerts-toggle-button"
                        >
                            <span>
                                <AlertTriangle size={16} />
                                Active Alerts ({filteredAlerts.length})
                            </span>
                            {alertsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                )}

                {/* Mobile Active Alerts - Expandable */}
                {isMobile && alertsExpanded && filteredAlerts.length > 0 && (
                    <div className="alerts-mobile-expanded">
                        <div className="alerts-mobile-content">
                            {filteredAlerts.slice(0, 3).map((alert) => {
                                const Icon = getAlertIcon(alert.type);
                                return (
                                    <div
                                        key={alert.id}
                                        className="alert-card-mobile"
                                        style={{ borderLeftColor: getSeverityColor(alert.severity) }}
                                    >
                                        <div className="alert-card-mobile-header">
                                            <div className="alert-card-mobile-icon" style={{ color: getAlertColor(alert.type) }}>
                                                <Icon size={16} />
                                            </div>
                                            <div className="alert-card-mobile-info">
                                                <h4 className="alert-card-mobile-title">
                                                    {alert.type.toUpperCase()} - {alert.severity.toUpperCase()}
                                                </h4>
                                                <span className="alert-card-mobile-time">
                                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => dismissAlert(alert.id)}
                                                className="alert-card-mobile-close"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <p className="alert-card-mobile-message">{alert.message}</p>
                                        {alert.affectedAreas && (
                                            <div className="alert-card-mobile-areas">
                                                <strong>Areas:</strong> {alert.affectedAreas.slice(0, 2).join(', ')}{alert.affectedAreas.length > 2 && '...'}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {filteredAlerts.length > 3 && (
                                <div className="alerts-mobile-more">
                                    +{filteredAlerts.length - 3} more alerts
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Collapsible Filters for Mobile */}
                {isMobile && (
                    <div className="filters-mobile-toggle">
                        <button
                            onClick={() => setFiltersExpanded(!filtersExpanded)}
                            className="filters-toggle-button"
                        >
                            <span>
                                <Filter size={16} />
                                Filters ({Object.values(activeFilters).filter(Boolean).length}/4)
                            </span>
                            {filtersExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                )}

                {/* Filter controls and Map legend - Desktop or Expanded Mobile */}
                {(!isMobile || filtersExpanded) && (
                    <div className="filters-container">
                        <div className="filters-wrapper">
                            <div className="filters-section">
                                {!isMobile && (
                                    <div className="filters-label">
                                        <Filter size={16} />
                                        <span>Filters:</span>
                                    </div>
                                )}

                                <div className="filter-buttons">
                                    <FilterButton
                                        type="earthquake"
                                        // @ts-ignore
                                        icon={Zap}
                                        label="Earthquake"
                                        color="earthquake"
                                        active={activeFilters.earthquake}
                                        count={alerts.filter(a => a.type === 'earthquake' && !dismissedAlerts.has(a.id as string)).length}
                                    />

                                    <FilterButton
                                        type="flood"
                                        // @ts-ignore
                                        icon={AlertTriangle}
                                        label="Flood Warning"
                                        color="flood"
                                        active={activeFilters.flood}
                                        count={alerts.filter(a => a.type === 'flood' && !dismissedAlerts.has(a.id as string)).length}
                                    />

                                    <FilterButton
                                        type="fire"
                                        // @ts-ignore
                                        icon={Flame}
                                        label="Fire Warning"
                                        color="fire"
                                        active={activeFilters.fire}
                                        count={alerts.filter(a => a.type === 'fire' && !dismissedAlerts.has(a.id as string)).length}
                                    />

                                    <FilterButton
                                        type="weather"
                                        // @ts-ignore
                                        icon={CloudRain}
                                        label="Weather Alert"
                                        color="weather"
                                        active={activeFilters.weather}
                                        count={alerts.filter(a => a.type === 'weather' && !dismissedAlerts.has(a.id as string)).length}
                                    />
                                </div>
                            </div>

                            {/* Compact Legend - Desktop Only */}
                            {!isMobile && (
                                <div className="legend-section">
                                    <span className="legend-title">Legend:</span>
                                    <div className="legend-items">
                                        <div className="legend-item-compact">
                                            <Zap className="legend-icon earthquake" size={12} />
                                            <span>Earthquake</span>
                                        </div>
                                        <div className="legend-item-compact">
                                            <AlertTriangle className="legend-icon flood" size={12} />
                                            <span>Flood</span>
                                        </div>
                                        <div className="legend-item-compact">
                                            <Flame className="legend-icon fire" size={12} />
                                            <span>Fire</span>
                                        </div>
                                        <div className="legend-item-compact">
                                            <CloudRain className="legend-icon weather" size={12} />
                                            <span>Weather</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Active Alerts Sidebar - Desktop Only */}
                {!isMobile && filteredAlerts.length > 0 && (
                    <div className="alerts-sidebar">
                        <div className="alerts-sidebar-header">
                            <h3>Active Alerts ({filteredAlerts.length})</h3>
                        </div>
                        <div className="alerts-sidebar-content">
                            {filteredAlerts.map((alert) => {
                                const Icon = getAlertIcon(alert.type);
                                return (
                                    <div
                                        key={alert.id}
                                        className="alert-card"
                                        style={{ borderLeftColor: getSeverityColor(alert.severity) }}
                                    >
                                        <div className="alert-card-header">
                                            <div className="alert-card-icon" style={{ color: getAlertColor(alert.type) }}>
                                                <Icon size={20} />
                                            </div>
                                            <div className="alert-card-info">
                                                <h4 className="alert-card-title">
                                                    {alert.type.toUpperCase()} - {alert.severity.toUpperCase()}
                                                </h4>
                                                <span className="alert-card-time">
                                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => dismissAlert(alert.id)}
                                                className="alert-card-close"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <p className="alert-card-message">{alert.message}</p>
                                        <div className="alert-card-location">
                                            <MapPin size={14} />
                                            <span>
                                                {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                                            </span>
                                        </div>
                                        {alert.affectedAreas && (
                                            <div className="alert-card-areas">
                                                <strong>Affected Areas:</strong> {alert.affectedAreas.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Map container */}
                <div className="map-container">
                    <div
                        ref={mapRef}
                        className="map"
                        id="map"
                    />

                    {/* Alert markers overlay */}
                    <div className="map-overlay">
                        {filteredAlerts.map((alert) => {
                            const Icon = getAlertIcon(alert.type);
                            return (
                                <div
                                    key={alert.id}
                                    className="alert-marker"
                                    style={{
                                        position: 'absolute',
                                        // This is a simplified positioning - in a real app you'd convert lat/lng to screen coordinates
                                        left: `${50 + (alert.location.lng - 121) * 500}%`,
                                        top: `${50 - (alert.location.lat - 14.6) * 500}%`,
                                        backgroundColor: getSeverityColor(alert.severity),
                                        color: 'white'
                                    }}
                                    title={`${alert.type} - ${alert.severity}: ${alert.message}`}
                                >
                                    <Icon size={isMobile ? 14 : 16} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Loading state */}
                    {!mapLoaded && (
                        <div className="map-loading">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">
                                <div style={{marginBottom: '10px'}}>Loading map...</div>
                                <div style={{fontSize: '12px', color: '#9ca3af'}}>Metro Manila</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile bottom navigation */}
                {isMobile && (
                    <div className="bottom-nav">
                        <button className="nav-button">
                            <Home size={18} />
                            <span>Home</span>
                        </button>
                        <button className="nav-button active">
                            <MapPin size={18} />
                            <span>Map</span>
                        </button>
                        <button className="nav-button">
                            <BarChart3 size={18} />
                            <span>Stats</span>
                        </button>
                        <button className="nav-button">
                            <Settings size={18} />
                            <span>Settings</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GISPage;