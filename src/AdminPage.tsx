import React, { useState, useEffect } from 'react';
import { AlertTriangle, Flame, CloudRain, MapPin, Send, Zap, Users, Clock, Settings, Shield, X } from 'lucide-react';
import { AlertService, Alert } from './services/alerts/alertService';
import { useAlerts } from './services/alerts/userAlerts';
import './AdminPage.css';

const AdminPage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
    const [selectedAlertType, setSelectedAlertType] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [location, setLocation] = useState({ lat: '', lng: '' });
    const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
    const [affectedAreas, setAffectedAreas] = useState<string>('');
    const [, setUseCurrentLocation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

    // Use the alerts hook to get real-time alerts
    const { alerts: alertHistory, isLoading: alertsLoading, error: alertsError } = useAlerts();

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

    // Simulate Firebase connection status
    useEffect(() => {
        setConnectionStatus('connecting');
        setTimeout(() => setConnectionStatus('connected'), 2000);
    }, []);

    const alertTypes = [
        { id: 'earthquake', label: 'Earthquake Alert', icon: Zap, color: 'earthquake', description: 'Seismic activity detected' },
        { id: 'fire', label: 'Fire Alert', icon: Flame, color: 'fire', description: 'Fire hazard warning' },
        { id: 'flood', label: 'Flood Alert', icon: AlertTriangle, color: 'flood', description: 'Flood warning issued' },
        { id: 'weather', label: 'Weather Alert', icon: CloudRain, color: 'weather', description: 'Severe weather warning' }
    ];

    const predefinedMessages = {
        earthquake: 'Magnitude 5.2 earthquake detected. Take cover immediately and prepare for aftershocks.',
        fire: 'Fire incident reported in your area. Evacuate immediately if you receive evacuation orders.',
        flood: 'Flash flood warning in effect. Move to higher ground and avoid flooded roadways.',
        weather: 'Severe weather alert: Heavy rainfall and strong winds expected. Stay indoors.'
    };

    const getCurrentLocation = () => {
        setIsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude.toFixed(6),
                        lng: position.coords.longitude.toFixed(6)
                    });
                    setUseCurrentLocation(true);
                    setIsLoading(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsLoading(false);
                    alert('Unable to get current location. Please enter coordinates manually.');
                }
            );
        } else {
            setIsLoading(false);
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleAlertTypeSelect = (alertType: string) => {
        setSelectedAlertType(alertType);
        setAlertMessage(predefinedMessages[alertType as keyof typeof predefinedMessages] || '');
    };

    const sendAlert = async () => {
        if (!selectedAlertType || !alertMessage || !location.lat || !location.lng) {
            alert('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            // Prepare alert data
            const alertData: Omit<Alert, 'id' | 'timestamp'> = {
                type: selectedAlertType as Alert['type'],
                message: alertMessage,
                location: {
                    lat: parseFloat(location.lat),
                    lng: parseFloat(location.lng)
                },
                severity,
                status: 'active',
                affectedAreas: affectedAreas ? affectedAreas.split(',').map(area => area.trim()) : undefined,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Expire after 24 hours
            };

            // Send to Firebase using AlertService
            const alertId = await AlertService.sendAlert(alertData);
            console.log('Alert sent successfully with ID:', alertId);

            // Reset form
            setSelectedAlertType('');
            setAlertMessage('');
            setLocation({ lat: '', lng: '' });
            setSeverity('medium');
            setAffectedAreas('');
            setUseCurrentLocation(false);

            alert('Alert sent successfully!');
        } catch (error) {
            console.error('Error sending alert:', error);
            alert('Failed to send alert. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resolveAlert = async (alertId: string) => {
        try {
            await AlertService.updateAlertStatus(alertId, 'resolved');
            alert('Alert marked as resolved');
        } catch (error) {
            console.error('Error resolving alert:', error);
            alert('Failed to resolve alert');
        }
    };

    const getAlertIcon = (type: string) => {
        const alertType = alertTypes.find(at => at.id === type);
        if (!alertType) return AlertTriangle;
        return alertType.icon;
    };

    const getAlertColor = (type: string) => {
        const alertType = alertTypes.find(at => at.id === type);
        return alertType?.color || 'default';
    };

    return (
        <div className="admin-page">
            {/* Sidebar */}
            <div className={`admin-sidebar ${isMobile ? 'mobile' : 'desktop'} ${isMobile && sidebarOpen ? 'open' : ''}`}>
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
                        <a href="#" className="nav-item active">
                            <Shield size={20} />
                            <span className="nav-label">Alert Management</span>
                        </a>
                        <a href="#" className="nav-item">
                            <Users size={20} />
                            <span className="nav-label">User Management</span>
                        </a>
                        <a href="#" className="nav-item">
                            <MapPin size={20} />
                            <span className="nav-label">Location Monitor</span>
                        </a>
                        <a href="#" className="nav-item">
                            <Settings size={20} />
                            <span className="nav-label">Settings</span>
                        </a>
                    </div>
                </nav>
            </div>

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
                <header className="admin-header">
                    {isMobile && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="mobile-menu-button"
                        >
                            <img
                                src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                                alt="CIVILIAN"
                                className="mobile-logo"
                            />
                            <span className="mobile-logo-text">CIVILIAN Admin</span>
                        </button>
                    )}

                    <div className="header-center">
                        <div className="admin-title">
                            <Shield className="title-icon" size={24} />
                            <span>Disaster Alert Management System</span>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className={`connection-status ${connectionStatus}`}>
                            <div className="status-dot"></div>
                            <span className="status-text">{connectionStatus.toUpperCase()}</span>
                        </div>

                        <div className="current-time">
                            {currentTime}
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    {/* Alert Creation Panel */}
                    <div className="alert-creation-panel">
                        <h2 className="panel-title">
                            <Send className="panel-icon" size={24} />
                            Send Emergency Alert
                        </h2>

                        {/* Alert Type Selection */}
                        <div className="form-section">
                            <label className="form-label">Alert Type</label>
                            <div className="alert-type-grid">
                                {alertTypes.map((alertType) => {
                                    const Icon = alertType.icon;
                                    return (
                                        <button
                                            key={alertType.id}
                                            onClick={() => handleAlertTypeSelect(alertType.id)}
                                            className={`alert-type-button ${selectedAlertType === alertType.id ? `active ${alertType.color}` : ''}`}
                                        >
                                            <Icon className="alert-icon" size={32} />
                                            <div className="alert-label">{alertType.label}</div>
                                            <div className="alert-description">{alertType.description}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Alert Message */}
                        <div className="form-section">
                            <label className="form-label">Alert Message</label>
                            <textarea
                                value={alertMessage}
                                onChange={(e) => setAlertMessage(e.target.value)}
                                placeholder="Enter alert message..."
                                rows={3}
                                className="message-textarea"
                            />
                        </div>

                        {/* Severity Selection */}
                        <div className="form-section">
                            <label className="form-label">Severity Level</label>
                            <select
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value as Alert['severity'])}
                                className="severity-select"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        {/* Affected Areas */}
                        <div className="form-section">
                            <label className="form-label">Affected Areas (comma-separated)</label>
                            <input
                                type="text"
                                value={affectedAreas}
                                onChange={(e) => setAffectedAreas(e.target.value)}
                                placeholder="Manila, Quezon City, Makati..."
                                className="affected-areas-input"
                            />
                        </div>

                        {/* Location Input */}
                        <div className="form-section">
                            <label className="form-label">Location</label>
                            <div className="location-section">
                                <button
                                    onClick={getCurrentLocation}
                                    disabled={isLoading}
                                    className="location-button"
                                >
                                    <MapPin className="location-icon" size={16} />
                                    <span>{isLoading ? 'Getting Location...' : 'Use Current Location'}</span>
                                </button>

                                <div className="coordinates-grid">
                                    <div className="coordinate-input">
                                        <label className="coordinate-label">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={location.lat}
                                            onChange={(e) => setLocation(prev => ({ ...prev, lat: e.target.value }))}
                                            placeholder="14.6091"
                                            className="coordinate-field"
                                        />
                                    </div>
                                    <div className="coordinate-input">
                                        <label className="coordinate-label">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={location.lng}
                                            onChange={(e) => setLocation(prev => ({ ...prev, lng: e.target.value }))}
                                            placeholder="121.0223"
                                            className="coordinate-field"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Send Button */}
                        <button
                            onClick={sendAlert}
                            disabled={isLoading || !selectedAlertType || !alertMessage || !location.lat || !location.lng}
                            className="send-alert-button"
                        >
                            <Send className="send-icon" size={20} />
                            <span>{isLoading ? 'Sending Alert...' : 'Send Alert'}</span>
                        </button>
                    </div>

                    {/* Alert History */}
                    <div className="alert-history-panel">
                        <h2 className="panel-title">
                            <Clock className="panel-icon" size={24} />
                            Active Alerts ({alertHistory.length})
                        </h2>

                        {alertsError && (
                            <div className="error-message">
                                Error loading alerts: {alertsError}
                            </div>
                        )}

                        {alertsLoading ? (
                            <div className="loading-message">
                                Loading alerts...
                            </div>
                        ) : alertHistory.length === 0 ? (
                            <div className="no-alerts">
                                <AlertTriangle className="no-alerts-icon" size={48} />
                                <p>No active alerts</p>
                            </div>
                        ) : (
                            <div className="alerts-list">
                                {alertHistory.map((alert) => {
                                    const Icon = getAlertIcon(alert.type);
                                    return (
                                        <div key={alert.id} className="alert-item">
                                            <div className={`alert-item-icon ${getAlertColor(alert.type)}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div className="alert-item-content">
                                                <div className="alert-item-header">
                                                    <h3 className="alert-item-title">
                                                        {alert.type.toUpperCase()} Alert - {alert.severity.toUpperCase()}
                                                    </h3>
                                                    <span className="alert-item-time">
                                                        {new Date(alert.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="alert-item-message">{alert.message}</p>
                                                <div className="alert-item-details">
                                                    <div className="alert-item-location">
                                                        Location: {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                                                    </div>
                                                    {alert.affectedAreas && (
                                                        <div className="alert-item-areas">
                                                            Areas: {alert.affectedAreas.join(', ')}
                                                        </div>
                                                    )}
                                                    <div className="alert-item-actions">
                                                        <button
                                                            onClick={() => resolveAlert(alert.id!)}
                                                            className="resolve-button"
                                                        >
                                                            Mark as Resolved
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;