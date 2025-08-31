import React, { useState, useEffect } from 'react';
import { AlertTriangle, Flame, CloudRain, MapPin, Send, Zap, Clock, Shield } from 'lucide-react';
import './AdminPage.css';

const AdminPage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
    const [selectedAlertType, setSelectedAlertType] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [location, setLocation] = useState({ lat: '', lng: '' });
    const [, setUseCurrentLocation] = useState<boolean>(false);
    const [alertHistory, setAlertHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulate Firebase connection status
    useEffect(() => {
        setConnectionStatus('connecting');
        setTimeout(() => setConnectionStatus('connected'), 2000);
    }, []);

    const alertTypes = [
        { id: 'earthquake', label: 'Earthquake Alert', icon: Zap, color: 'bg-purple-500', description: 'Seismic activity detected' },
        { id: 'fire', label: 'Fire Alert', icon: Flame, color: 'bg-red-500', description: 'Fire hazard warning' },
        { id: 'flood', label: 'Flood Alert', icon: AlertTriangle, color: 'bg-blue-500', description: 'Flood warning issued' },
        { id: 'weather', label: 'Weather Alert', icon: CloudRain, color: 'bg-yellow-500', description: 'Severe weather warning' }
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

        const newAlert = {
            id: Date.now(),
            type: selectedAlertType,
            message: alertMessage,
            location: {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lng)
            },
            timestamp: new Date().toISOString(),
            severity: 'high',
            status: 'active'
        };

        try {
            // Simulate sending to Firebase
            await new Promise(resolve => setTimeout(resolve, 1500));

            setAlertHistory(prev => [newAlert, ...prev]);

            // Reset form
            setSelectedAlertType('');
            setAlertMessage('');
            setLocation({ lat: '', lng: '' });
            setUseCurrentLocation(false);

            alert('Alert sent successfully!');
        } catch (error) {
            console.error('Error sending alert:', error);
            alert('Failed to send alert. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getAlertIcon = (type: string) => {
        const alertType = alertTypes.find(at => at.id === type);
        if (!alertType) return AlertTriangle;
        return alertType.icon;
    };

    const getAlertColor = (type: string) => {
        const alertType = alertTypes.find(at => at.id === type);
        return alertType?.color || 'bg-gray-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">CIVILIAN Admin</h1>
                            <p className="text-sm text-slate-400">Disaster Alert Management System</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                            connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' :
                                connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${
                                connectionStatus === 'connected' ? 'bg-green-400' :
                                    connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                                        'bg-red-400'
                            }`} />
                            <span>{connectionStatus.toUpperCase()}</span>
                        </div>

                        <div className="text-white font-mono text-sm bg-slate-700/50 px-3 py-1 rounded-lg">
                            {currentTime}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Alert Creation Panel */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Send className="w-6 h-6 mr-3 text-blue-400" />
                        Send Emergency Alert
                    </h2>

                    {/* Alert Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-3">Alert Type</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {alertTypes.map((alertType) => {
                                const Icon = alertType.icon;
                                return (
                                    <button
                                        key={alertType.id}
                                        onClick={() => handleAlertTypeSelect(alertType.id)}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                            selectedAlertType === alertType.id
                                                ? `${alertType.color} border-transparent text-white shadow-lg transform scale-105`
                                                : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'
                                        }`}
                                    >
                                        <Icon className="w-8 h-8 mx-auto mb-2" />
                                        <div className="text-sm font-medium">{alertType.label}</div>
                                        <div className="text-xs mt-1 opacity-80">{alertType.description}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Alert Message */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Alert Message</label>
                        <textarea
                            value={alertMessage}
                            onChange={(e) => setAlertMessage(e.target.value)}
                            placeholder="Enter alert message..."
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Location Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-3">Location</label>
                        <div className="space-y-4">
                            <button
                                onClick={getCurrentLocation}
                                disabled={isLoading}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <MapPin className="w-4 h-4" />
                                <span>{isLoading ? 'Getting Location...' : 'Use Current Location'}</span>
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={location.lat}
                                        onChange={(e) => setLocation(prev => ({ ...prev, lat: e.target.value }))}
                                        placeholder="14.6091"
                                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={location.lng}
                                        onChange={(e) => setLocation(prev => ({ ...prev, lng: e.target.value }))}
                                        placeholder="121.0223"
                                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={sendAlert}
                        disabled={isLoading || !selectedAlertType || !alertMessage || !location.lat || !location.lng}
                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                        <Send className="w-5 h-5" />
                        <span>{isLoading ? 'Sending Alert...' : 'Send Alert'}</span>
                    </button>
                </div>

                {/* Alert History */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Clock className="w-6 h-6 mr-3 text-green-400" />
                        Alert History
                    </h2>

                    {alertHistory.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No alerts sent yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {alertHistory.map((alert) => {
                                const Icon = getAlertIcon(alert.type);
                                return (
                                    <div key={alert.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-2 rounded-lg ${getAlertColor(alert.type)}`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-white font-medium capitalize">{alert.type} Alert</h3>
                                                    <span className="text-xs text-slate-400">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                                                </div>
                                                <p className="text-slate-300 text-sm mb-2">{alert.message}</p>
                                                <div className="text-xs text-slate-400">
                                                    Location: {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
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
    );
};

export default AdminPage;