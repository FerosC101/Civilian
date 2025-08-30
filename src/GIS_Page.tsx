import React, { useState, useEffect, useRef } from 'react';
import { Filter, MapPin, AlertTriangle, Flame, Wind, Home, BarChart3, Settings, Menu, X } from 'lucide-react';
import './GIS_Page.css';

// Global map variable
let globalMap: any = null;
let globalView: any = null;
let globalMarkers: any[] = [];

interface MarkerData {
    id: string;
    position: { lat: number; lng: number };
    type: 'flood' | 'fire' | 'airPollution';
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low' | 'Info';
}

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

    // Sample marker data
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
            setIsMobile(window.innerWidth <= 768);
            if (globalMap) {
                setTimeout(() => {
                    globalMap.getViewport().dispatchEvent('resize');
                }, 100);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize OpenLayers map
    useEffect(() => {
        const initMap = async () => {
            if (mapRef.current && !globalMap) {
                try {
                    // Load OpenLayers dynamically
                    const olScript = document.createElement('script');
                    olScript.src = 'https://cdn.jsdelivr.net/npm/ol@7.5.2/dist/ol.js';
                    olScript.onload = () => {
                        // Load OpenLayers CSS
                        const olCSS = document.createElement('link');
                        olCSS.rel = 'stylesheet';
                        olCSS.href = 'https://cdn.jsdelivr.net/npm/ol@7.5.2/ol.css';
                        document.head.appendChild(olCSS);

                        // Initialize map after script loads
                        setTimeout(() => {
                            const ol = (window as any).ol;

                            if (!ol) {
                                console.error('OpenLayers not loaded');
                                return;
                            }

                            // Create view
                            globalView = new ol.View({
                                center: ol.proj.fromLonLat([121.0409, 14.2456]), // Batangas coordinates
                                zoom: 12
                            });

                            // Create map
                            globalMap = new ol.Map({
                                target: mapRef.current,
                                layers: [
                                    new ol.layer.Tile({
                                        source: new ol.source.OSM()
                                    })
                                ],
                                view: globalView,
                                controls: ol.control.defaults({
                                    zoom: true,
                                    rotate: false,
                                    attribution: false
                                })
                            });

                            // Create vector source for markers
                            const vectorSource = new ol.source.Vector();
                            const vectorLayer = new ol.layer.Vector({
                                source: vectorSource
                            });
                            globalMap.addLayer(vectorLayer);

                            // Add markers
                            markersData.forEach(marker => {
                                const feature = new ol.Feature({
                                    geometry: new ol.geom.Point(ol.proj.fromLonLat([marker.position.lng, marker.position.lat])),
                                    markerData: marker
                                });

                                // Style based on marker type and severity
                                const colors = {
                                    flood: '#f97316',
                                    fire: '#ef4444',
                                    airPollution: '#eab308'
                                };

                                const sizes = {
                                    High: 25,
                                    Medium: 20,
                                    Low: 15,
                                    Info: 18
                                };

                                const style = new ol.style.Style({
                                    image: new ol.style.Circle({
                                        radius: sizes[marker.severity],
                                        fill: new ol.style.Fill({
                                            color: colors[marker.type]
                                        }),
                                        stroke: new ol.style.Stroke({
                                            color: '#ffffff',
                                            width: 3
                                        })
                                    })
                                });

                                feature.setStyle(style);
                                feature.set('type', marker.type);
                                vectorSource.addFeature(feature);
                                globalMarkers.push(feature);
                            });

                            // Add click handler
                            globalMap.on('click', (event: any) => {
                                globalMap.forEachFeatureAtPixel(event.pixel, (feature: any) => {
                                    const markerData = feature.get('markerData');
                                    if (markerData) {
                                        showMarkerPopup(markerData, event.pixel);
                                    }
                                });
                            });

                            // Add pointer cursor on hover
                            globalMap.on('pointermove', (event: any) => {
                                const hit = globalMap.hasFeatureAtPixel(event.pixel);
                                globalMap.getTarget().style.cursor = hit ? 'pointer' : '';
                            });

                            setMapLoaded(true);
                        }, 500);
                    };
                    document.head.appendChild(olScript);

                } catch (error) {
                    console.error('Error loading OpenLayers:', error);
                    // Fallback to simple map implementation
                    initSimpleMap();
                }
            }
        };

        // Simple fallback map
        const initSimpleMap = () => {
            if (mapRef.current) {
                mapRef.current.innerHTML = `
                    <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        overflow: hidden;
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-image: 
                                linear-gradient(rgba(107, 114, 128, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(107, 114, 128, 0.1) 1px, transparent 1px);
                            background-size: 50px 50px;
                        "></div>
                        
                        <!-- Simulated geographic features -->
                        <div style="
                            position: absolute;
                            top: 40%;
                            left: 0;
                            right: 0;
                            height: 8px;
                            background: #374151;
                            transform: rotate(-10deg);
                            transform-origin: left;
                        "></div>
                        
                        <div style="
                            position: absolute;
                            top: 20%;
                            left: 20%;
                            width: 12px;
                            height: 60%;
                            background: #1e293b;
                            border-radius: 6px;
                            transform: rotate(15deg);
                        "></div>
                        
                        <!-- Markers -->
                        ${markersData.map((marker, index) => {
                    const colors = {
                        flood: '#f97316',
                        fire: '#ef4444',
                        airPollution: '#eab308'
                    };
                    const sizes = {
                        High: '25px',
                        Medium: '20px',
                        Low: '15px',
                        Info: '18px'
                    };

                    const x = 20 + (index % 3) * 30 + Math.random() * 20;
                    const y = 30 + Math.floor(index / 3) * 25 + Math.random() * 20;

                    return `
                                <div 
                                    class="simple-marker" 
                                    data-marker='${JSON.stringify(marker)}'
                                    style="
                                        position: absolute;
                                        left: ${x}%;
                                        top: ${y}%;
                                        width: ${sizes[marker.severity]};
                                        height: ${sizes[marker.severity]};
                                        background: ${colors[marker.type]};
                                        border: 3px solid white;
                                        border-radius: 50%;
                                        cursor: pointer;
                                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                                        animation: ${marker.severity === 'High' ? 'pulse 2s infinite' : 'none'};
                                        transition: all 0.2s ease;
                                        z-index: 10;
                                        display: ${activeFilters[marker.type] ? 'block' : 'none'};
                                    "
                                    onmouseover="this.style.transform='scale(1.2)'"
                                    onmouseout="this.style.transform='scale(1)'"
                                    onclick="window.showSimplePopup(this)"
                                >
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
                            `;
                }).join('')}
                        
                        <!-- Map Legend -->
                        <div style="
                            position: absolute;
                            bottom: 20px;
                            left: 20px;
                            background: rgba(31, 41, 55, 0.9);
                            backdrop-filter: blur(10px);
                            border: 1px solid rgba(107, 114, 128, 0.2);
                            border-radius: 12px;
                            padding: 16px;
                            color: white;
                            font-family: Inter, sans-serif;
                            font-size: 14px;
                            min-width: 180px;
                        ">
                            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Map Legend</h3>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 12px; height: 12px; background: #f97316; border: 2px solid white; border-radius: 50%;"></div>
                                    <span style="color: #d1d5db; font-size: 12px;">Flood Warning</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 12px; height: 12px; background: #ef4444; border: 2px solid white; border-radius: 50%;"></div>
                                    <span style="color: #d1d5db; font-size: 12px;">Fire Alert</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 12px; height: 12px; background: #eab308; border: 2px solid white; border-radius: 50%;"></div>
                                    <span style="color: #d1d5db; font-size: 12px;">Air Quality</span>
                                </div>
                            </div>
                        </div>
                        
                        <style>
                            @keyframes pulse {
                                0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 0 rgba(249, 115, 22, 0.4); }
                                50% { box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 10px rgba(249, 115, 22, 0); }
                            }
                        </style>
                    </div>
                `;

                // Add global function for simple popup
                (window as any).showSimplePopup = (element: HTMLElement) => {
                    const markerData = JSON.parse(element.getAttribute('data-marker') || '{}');
                    showMarkerPopup(markerData, { x: 0, y: 0 });
                };

                setMapLoaded(true);
            }
        };

        // Try to initialize map
        if (mapRef.current) {
            initMap();
        }
    }, []);

    // Update marker visibility based on filters
    useEffect(() => {
        if (globalMarkers.length > 0) {
            globalMarkers.forEach(marker => {
                const markerType = marker.get('type');
                marker.setStyle(activeFilters[markerType] ? marker.getStyle() : null);
            });
        } else {
            // Update simple markers
            const simpleMarkers = document.querySelectorAll('.simple-marker');
            simpleMarkers.forEach((marker) => {
                const markerData = JSON.parse(marker.getAttribute('data-marker') || '{}');
                (marker as HTMLElement).style.display = activeFilters[markerData.type] ? 'block' : 'none';
            });
        }
    }, [activeFilters]);

    const showMarkerPopup = (marker: MarkerData, pixel: { x: number; y: number }) => {
        // Remove existing popups
        const existingPopups = document.querySelectorAll('.marker-popup');
        existingPopups.forEach(popup => popup.remove());

        // Create popup element
        const popup = document.createElement('div');
        popup.className = 'marker-popup';
        popup.style.position = 'fixed';
        popup.style.left = `${pixel.x + 10}px`;
        popup.style.top = `${pixel.y - 10}px`;
        popup.style.background = 'rgba(31, 41, 55, 0.95)';
        popup.style.backdropFilter = 'blur(10px)';
        popup.style.border = '1px solid rgba(107, 114, 128, 0.2)';
        popup.style.borderRadius = '12px';
        popup.style.padding = '16px';
        popup.style.color = '#ffffff';
        popup.style.fontFamily = 'Inter, sans-serif';
        popup.style.fontSize = '14px';
        popup.style.maxWidth = '280px';
        popup.style.zIndex = '1000';
        popup.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
        popup.style.animation = 'fadeIn 0.3s ease-out';

        const severityColors = {
            'High': '#ef4444',
            'Medium': '#f59e0b',
            'Low': '#10b981',
            'Info': '#3b82f6'
        };

        popup.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; flex: 1;">${marker.title}</h3>
                <span style="background: ${severityColors[marker.severity]}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${marker.severity}</span>
            </div>
            <p style="margin: 0; font-size: 14px; color: #d1d5db; line-height: 1.5;">${marker.description}</p>
            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(107, 114, 128, 0.3); font-size: 12px; color: #9ca3af;">
                📍 Lat: ${marker.position.lat.toFixed(4)}, Lng: ${marker.position.lng.toFixed(4)}<br>
                ⏰ Last updated: ${new Date().toLocaleString()}
            </div>
            <button style="
                position: absolute; 
                top: 8px; 
                right: 8px; 
                background: none; 
                border: none; 
                color: #9ca3af; 
                cursor: pointer; 
                font-size: 20px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s;
            " onmouseover="this.style.background='rgba(107, 114, 128, 0.2)'; this.style.color='#ffffff';" onmouseout="this.style.background='none'; this.style.color='#9ca3af';">×</button>
        `;

        // Add close button functionality
        const closeBtn = popup.querySelector('button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => popup.remove());
        }

        // Add to body instead of map container
        document.body.appendChild(popup);

        // Auto close after 8 seconds
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
        }, 8000);

        // Close on outside click
        const closeOnOutside = (e: MouseEvent) => {
            if (!popup.contains(e.target as Node)) {
                popup.remove();
                document.removeEventListener('click', closeOnOutside);
            }
        };
        setTimeout(() => document.addEventListener('click', closeOnOutside), 100);
    };

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
                            icon={AlertTriangle}
                            label="Flood Warning"
                            color="flood"
                            active={activeFilters.flood}
                        />

                        <FilterButton
                            type="fire"
                            icon={Flame}
                            label="Fire Warning"
                            color="fire"
                            active={activeFilters.fire}
                        />

                        <FilterButton
                            type="airPollution"
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
                            <div className="loading-text">
                                <div style={{marginBottom: '10px'}}>🗺️ Loading interactive map...</div>
                                <div style={{fontSize: '12px', color: '#9ca3af'}}>Initializing OpenLayers mapping system</div>
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

            {/* Custom styles for animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .ol-zoom {
                    background: rgba(31, 41, 55, 0.9) !important;
                    border-radius: 8px !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
                }

                .ol-zoom button {
                    background: transparent !important;
                    color: #ffffff !important;
                    border: none !important;
                    font-size: 18px !important;
                    transition: all 0.2s !important;
                }

                .ol-zoom button:hover {
                    background: rgba(59, 130, 246, 0.8) !important;
                }
            `}</style>
        </div>
    );
};

export default GISPage;