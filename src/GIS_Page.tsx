import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, MapPin, AlertTriangle, Flame, Wind, Home, BarChart3, Settings, X } from 'lucide-react';
import './GIS_Page.css'

const GISPage: React.FC = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [activeFilters, setActiveFilters] = useState({
        flood: true,
        fire: true,
        airPollution: true
    });
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const mapRef = useRef<HTMLDivElement>(null);

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

    // Initialize Google Maps embed for Metro Manila
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

    const handleNavigation = (page: string) => {
        setSidebarOpen(false);
        
        switch (page) {
            case 'dashboard':
                navigate('/dashboard');
                break;
            case 'gis':
                // Already on GIS page, no navigation needed
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

    const FilterButton: React.FC<{
        type: keyof typeof activeFilters;
        icon: React.ComponentType<{ size: number }>;
        label: string;
        color: string;
        active: boolean;
    }> = ({ type, icon: Icon, label, color, active }) => (
        <button
            onClick={() => toggleFilter(type)}
            className={`filter-button ${active ? `active ${color}` : 'inactive'}`}
        >
            <Icon size={16} />
            <span className="filter-label">{label}</span>
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
                    <button onClick={() => handleNavigation('dashboard')} className="nav-item">
                        <Home size={20} />
                        <span className="nav-label">Dashboard</span>
                    </button>
                    <button onClick={() => handleNavigation('gis')} className="nav-item active">
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

                    <div className="clock">
                        {currentTime}
                    </div>
                </header>

                {/* Filter controls and Map legend combined */}
                <div className="filters-container">
                    <div className="filters-wrapper">
                        <div className="filters-section">
                            <div className="filters-label">
                                <Filter size={16} />
                                <span>Filters:</span>
                            </div>

                            <div className="filter-buttons">
                                <FilterButton
                                    type="flood"
                                    // @ts-ignore
                                    icon={AlertTriangle}
                                    label="Flood Warning"
                                    color="flood"
                                    active={activeFilters.flood}
                                />

                                <FilterButton
                                    type="fire"
                                    // @ts-ignore
                                    icon={Flame}
                                    label="Fire Warning"
                                    color="fire"
                                    active={activeFilters.fire}
                                />

                                <FilterButton
                                    type="airPollution"
                                    // @ts-ignore
                                    icon={Wind}
                                    label="Air Pollution"
                                    color="pollution"
                                    active={activeFilters.airPollution}
                                />
                            </div>
                        </div>

                        {/* Compact Legend */}
                        <div className="legend-section">
                            <span className="legend-title">Legend:</span>
                            <div className="legend-items">
                                <div className="legend-item-compact">
                                    <AlertTriangle className="legend-icon flood" size={14} />
                                    <span>Flood Zones</span>
                                </div>
                                <div className="legend-item-compact">
                                    <Flame className="legend-icon fire" size={14} />
                                    <span>Fire Hazards</span>
                                </div>
                                <div className="legend-item-compact">
                                    <Wind className="legend-icon pollution" size={14} />
                                    <span>Air Quality</span>
                                </div>
                                <div className="legend-item-compact">
                                    <Home className="legend-icon evacuation" size={14} />
                                    <span>Evacuation Centers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map container */}
                <div className="map-container">
                    <div
                        ref={mapRef}
                        className="map"
                        id="map"
                    />

                    {/* Loading state */}
                    {!mapLoaded && (
                        <div className="map-loading">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">
                                <div style={{marginBottom: '10px'}}>Loading disaster monitoring map...</div>
                                <div style={{fontSize: '12px', color: '#9ca3af'}}>Initializing Google Maps for Metro Manila</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile bottom navigation */}
                {isMobile && (
                    <div className="bottom-nav">
                        <button onClick={() => handleNavigation('dashboard')} className="nav-button">
                            <Home size={20} />
                            <span>Home</span>
                        </button>
                        <button onClick={() => handleNavigation('gis')} className="nav-button active">
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

export default GISPage;