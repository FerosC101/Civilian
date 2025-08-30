import React, { useState, useEffect, useRef } from 'react';
import { Filter, MapPin, AlertTriangle, Flame, Wind, Home, BarChart3, Settings, Menu, X } from 'lucide-react';
import './GIS_Page.css'

// Leaflet interfaces
interface LeafletMap {
    setView: (center: [number, number], zoom: number) => LeafletMap;
    on: (event: string, handler: (e: any) => void) => void;
    addLayer: (layer: any) => void;
    removeLayer: (layer: any) => void;
    eachLayer: (fn: (layer: any) => void) => void;
    invalidateSize: () => void;
}

interface MarkerData {
    id: string;
    position: { lat: number; lng: number };
    type: 'flood' | 'fire' | 'airPollution';
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low' | 'Info';
}

// Global variables
let globalMap: LeafletMap | null = null;
let markersLayer: any = null;
let currentMarkers: any[] = [];

const GISPage: React.FC = () => {
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

    // Sample marker data - Batangas area coordinates
    const markersData: MarkerData[] = [
        {
            id: '1',
            position: { lat: 14.2556, lng: 121.0509 },
            type: 'flood',
            title: 'Flood Warning - Bauan',
            description: 'High risk flood zone - River overflow expected',
            severity: 'High'
        },
        {
            id: '2',
            position: { lat: 14.2356, lng: 121.0309 },
            type: 'fire',
            title: 'Fire Alert - San Pascual',
            description: 'Forest fire risk - Dry conditions detected',
            severity: 'Medium'
        },
        {
            id: '3',
            position: { lat: 14.2656, lng: 121.0609 },
            type: 'airPollution',
            title: 'Air Quality Monitor - Batangas City',
            description: 'PM2.5 levels elevated - Air quality moderate',
            severity: 'Low'
        },
        {
            id: '4',
            position: { lat: 14.2156, lng: 121.0209 },
            type: 'flood',
            title: 'Water Level Monitor - Taal',
            description: 'Lake water level rising - Monitor conditions',
            severity: 'Medium'
        },
        {
            id: '5',
            position: { lat: 14.2756, lng: 121.0409 },
            type: 'fire',
            title: 'Fire Station - Lipa',
            description: 'Emergency response unit - Fully operational',
            severity: 'Info'
        }
    ];

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
            if (globalMap) {
                setTimeout(() => {
                    // @ts-ignore
                    globalMap.invalidateSize();
                }, 100);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize Leaflet map
    useEffect(() => {
        const initMap = async () => {
            if (mapRef.current && !globalMap) {
                try {
                    // Load Leaflet CSS
                    const leafletCSS = document.createElement('link');
                    leafletCSS.rel = 'stylesheet';
                    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                    leafletCSS.crossOrigin = '';
                    document.head.appendChild(leafletCSS);

                    // Load Leaflet JS
                    const leafletScript = document.createElement('script');
                    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    leafletScript.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                    leafletScript.crossOrigin = '';

                    leafletScript.onload = () => {
                        const L = (window as any).L;
                        if (!L) {
                            console.error('Leaflet not loaded properly');
                            return;
                        }

                        // Initialize map
                        globalMap = L.map(mapRef.current).setView([14.2456, 121.0409], 12);

                        // Add tile layer
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '© OpenStreetMap contributors',
                            maxZoom: 19,
                        }).addTo(globalMap);

                        // Create marker layer group
                        markersLayer = L.layerGroup().addTo(globalMap);

                        // Add markers
                        addMarkersToMap();

                        setMapLoaded(true);
                    };

                    leafletScript.onerror = () => {
                        console.error('Failed to load Leaflet');
                        setMapLoaded(true);
                    };

                    document.head.appendChild(leafletScript);
                } catch (error) {
                    console.error('Error initializing map:', error);
                    setMapLoaded(true);
                }
            }
        };

        initMap();

        // Cleanup
        return () => {
            if (globalMap) {
                globalMap = null;
                markersLayer = null;
                currentMarkers = [];
            }
        };
    }, []);

    const addMarkersToMap = () => {
        if (!markersLayer) return;

        const L = (window as any).L;
        if (!L) return;

        // Clear existing markers
        currentMarkers.forEach(marker => {
            markersLayer.removeLayer(marker);
        });
        currentMarkers = [];

        // Color mapping for markers
        const colors = {
            flood: '#f97316',
            fire: '#ef4444',
            airPollution: '#eab308'
        };

        // Size mapping based on severity
        const sizes = {
            High: 15,
            Medium: 12,
            Low: 9,
            Info: 11
        };

        markersData.forEach(markerData => {
            if (!activeFilters[markerData.type]) return;

            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `
          <div style="
            width: ${sizes[markerData.severity] * 2}px;
            height: ${sizes[markerData.severity] * 2}px;
            background: ${colors[markerData.type]};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            position: relative;
            ${markerData.severity === 'High' ? 'animation: pulse 2s infinite;' : ''}
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 30%;
              height: 30%;
              background: white;
              border-radius: 50%;
              opacity: 0.8;
            "></div>
          </div>
        `,
                iconSize: [sizes[markerData.severity] * 2, sizes[markerData.severity] * 2],
                iconAnchor: [sizes[markerData.severity], sizes[markerData.severity]]
            });

            const marker = L.marker([markerData.position.lat, markerData.position.lng], {
                icon: customIcon
            });

            // Create popup content
            const severityColors = {
                'High': '#ef4444',
                'Medium': '#f59e0b',
                'Low': '#10b981',
                'Info': '#3b82f6'
            };

            const popupContent = `
        <div style="
          background: rgba(31, 41, 55, 0.95);
          color: white;
          font-family: Inter, sans-serif;
          padding: 16px;
          border-radius: 12px;
          min-width: 250px;
          max-width: 300px;
        ">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: 600; flex: 1;">${markerData.title}</h3>
            <span style="
              background: ${severityColors[markerData.severity]}; 
              color: white; 
              padding: 4px 8px; 
              border-radius: 12px; 
              font-size: 12px; 
              font-weight: 500;
            ">${markerData.severity}</span>
          </div>
          <p style="margin: 0; font-size: 14px; color: #d1d5db; line-height: 1.5;">${markerData.description}</p>
          <div style="
            margin-top: 12px; 
            padding-top: 8px; 
            border-top: 1px solid rgba(107, 114, 128, 0.3); 
            font-size: 12px; 
            color: #9ca3af;
          ">
            📍 Lat: ${markerData.position.lat.toFixed(4)}, Lng: ${markerData.position.lng.toFixed(4)}<br>
            ⏰ Last updated: ${new Date().toLocaleString()}
          </div>
        </div>
      `;

            marker.bindPopup(popupContent, {
                className: 'custom-popup',
                closeButton: true,
                maxWidth: 350
            });

            marker.addTo(markersLayer);
            currentMarkers.push(marker);
        });
    };

    // Update markers when filters change
    useEffect(() => {
        if (mapLoaded && markersLayer) {
            addMarkersToMap();
        }
    }, [activeFilters, mapLoaded]);

    const toggleFilter = (filterType: keyof typeof activeFilters) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterType]: !prev[filterType]
        }));
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

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
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
                            className="menu-button"
                        >
                            <Menu size={20} />
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

                {/* Filter controls */}
                <div className="filters-container">
                    <div className="filters-wrapper">
                        <div className="filters-label">
                            <Filter size={16} />
                            <span>Filters:</span>
                        </div>

                        <FilterButton
                            type="flood"
                            //@ts-ignore
                            icon={AlertTriangle}
                            label="Flood Warning"
                            color="flood"
                            active={activeFilters.flood}
                        />

                        <FilterButton
                            type="fire"
                            //@ts-ignore
                            icon={Flame}
                            label="Fire Warning"
                            color="fire"
                            active={activeFilters.fire}
                        />

                        <FilterButton
                            type="airPollution"
                            //@ts-ignore
                            icon={Wind}
                            label="Air Pollution"
                            color="pollution"
                            active={activeFilters.airPollution}
                        />
                    </div>
                </div>

                {/* Alert banner */}
                <div className="alert-banner">
                    <div className="alert-content">
                        <AlertTriangle size={16} />
                        <span>Weather Alert: Heavy rain expected in 2hrs - Monitor flood zones</span>
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
                                <div style={{marginBottom: '10px'}}>🗺️ Loading interactive map...</div>
                                <div style={{fontSize: '12px', color: '#9ca3af'}}>Initializing Leaflet mapping system</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile bottom navigation */}
                {isMobile && (
                    <div className="bottom-nav">
                        <button className="nav-button">
                            <Home size={20} />
                            <span>Home</span>
                        </button>
                        <button className="nav-button active">
                            <MapPin size={20} />
                            <span>Map</span>
                        </button>
                        <button className="nav-button">
                            <BarChart3 size={20} />
                            <span>Stats</span>
                        </button>
                        <button className="nav-button">
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