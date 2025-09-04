// Enhanced EvacuationCenters.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    MapPin,
    Home,
    BarChart3,
    Settings,
    X,
    Bell,
    Search,
    Navigation,
    Users,
    Building2,
    Phone,
    Clock,
    Shield,
    AlertTriangle,
    CheckCircle,
    ArrowLeft,
    ExternalLink
} from 'lucide-react';
import './EvacuationCenters.css';

interface EvacuationCenter {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    capacity: number;
    currentOccupancy: number;
    status: 'available' | 'full' | 'limited' | 'maintenance';
    facilities: string[];
    contact: string;
    distance: number;
    type: 'school' | 'gym' | 'community_center' | 'church' | 'government';
    lastUpdated: string;
}

const EvacuationCenters: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('all');
    const [, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

    // Check if we came from the GIS page with a selected center
    const selectedCenterId = location.state?.selectedCenterId;
    const fromGIS = location.state?.fromGIS || false;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 768;
            setIsMobile(newIsMobile);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get user location (default to Batangas City)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Location access denied or unavailable:', error);
                    // Default to Batangas City center if location is not available
                    setUserLocation({ lat: 13.7565, lng: 121.0583 });
                }
            );
        } else {
            setUserLocation({ lat: 13.7565, lng: 121.0583 });
        }
    }, []);

    // Updated evacuation centers data to match GIS page locations
    const evacuationCenters: EvacuationCenter[] = [
        {
            id: 1,
            name: "Batangas City Sports Complex",
            address: "P. Burgos Street",
            city: "Batangas City",
            latitude: 13.7565,
            longitude: 121.0583,
            capacity: 800,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Food Distribution', 'Restrooms', 'Security'],
            contact: "(043) 723-6300",
            distance: 0.5,
            type: 'gym',
            lastUpdated: "2025-01-15 14:30"
        },
        {
            id: 2,
            name: "Batangas State University Gymnasium",
            address: "Rizal Avenue Extension",
            city: "Batangas City",
            latitude: 13.7542,
            longitude: 121.0584,
            capacity: 1000,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Food Distribution', 'Sleeping Area', 'Restrooms'],
            contact: "(043) 425-0139",
            distance: 0.8,
            type: 'school',
            lastUpdated: "2025-01-15 14:25"
        },
        {
            id: 3,
            name: "Batangas City Hall Covered Court",
            address: "Barangay 3",
            city: "Batangas City",
            latitude: 13.7567,
            longitude: 121.0601,
            capacity: 600,
            currentOccupancy: 45,
            status: 'available',
            facilities: ['Medical Station', 'Food Distribution', 'Restrooms'],
            contact: "(043) 723-2004",
            distance: 0.3,
            type: 'government',
            lastUpdated: "2025-01-15 14:20"
        },
        {
            id: 4,
            name: "Santa Clara Elementary School",
            address: "Barangay Santa Clara",
            city: "Batangas City",
            latitude: 13.7445,
            longitude: 121.0421,
            capacity: 400,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Food Distribution', 'Restrooms', 'Classrooms'],
            contact: "(043) 723-1234",
            distance: 2.1,
            type: 'school',
            lastUpdated: "2025-01-15 14:15"
        },
        {
            id: 5,
            name: "Batangas Port Terminal Covered Area",
            address: "Batangas Port, Barangay Santa Clara",
            city: "Batangas City",
            latitude: 13.7398,
            longitude: 121.0334,
            capacity: 1200,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Food Distribution', 'Restrooms', 'Large Covered Area'],
            contact: "(043) 723-8888",
            distance: 3.2,
            type: 'community_center',
            lastUpdated: "2025-01-15 14:10"
        },
        {
            id: 6,
            name: "Pallocan West Elementary School",
            address: "Barangay Pallocan West",
            city: "Batangas City",
            latitude: 13.7623,
            longitude: 121.0712,
            capacity: 350,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Food Distribution', 'Restrooms'],
            contact: "(043) 723-5567",
            distance: 1.8,
            type: 'school',
            lastUpdated: "2025-01-15 14:00"
        }
    ];

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
                console.log('analytics');
                break;
            case 'settings':
                console.log('Navigate to settings');
                break;
            default:
                break;
        }
    };

    const handleGetDirections = (center: EvacuationCenter) => {
        // Navigate to GIS page with the selected center
        navigate('/gis', {
            state: {
                selectedCenterId: center.id,
                fromEvacuationCenters: true,
                centerData: {
                    id: `ec${center.id}`,
                    name: center.name,
                    address: center.address,
                    capacity: center.capacity,
                    lat: center.latitude,
                    lng: center.longitude,
                    facilities: center.facilities,
                    contact: center.contact
                }
            }
        });
    };

    const handleViewOnMap = (center: EvacuationCenter) => {
        // Navigate to GIS page and focus on this center
        navigate('/gis', {
            state: {
                focusCenterId: center.id,
                centerLocation: { lat: center.latitude, lng: center.longitude },
                fromEvacuationCenters: true
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return '#10b981';
            case 'limited': return '#f59e0b';
            case 'full': return '#ef4444';
            case 'maintenance': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'available': return <CheckCircle size={16} />;
            case 'limited': return <AlertTriangle size={16} />;
            case 'full': return <X size={16} />;
            case 'maintenance': return <Shield size={16} />;
            default: return <Shield size={16} />;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'school': return <Building2 size={20} />;
            case 'gym': return <Users size={20} />;
            case 'community_center': return <Home size={20} />;
            case 'church': return <Building2 size={20} />;
            case 'government': return <Shield size={20} />;
            default: return <Building2 size={20} />;
        }
    };

    const filteredCenters = evacuationCenters.filter(center => {
        const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            center.city.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCity = selectedCity === 'all' || center.city === selectedCity;

        return matchesSearch && matchesCity;
    });

    // Sort centers to show selected one first if coming from GIS
    const sortedCenters = [...filteredCenters].sort((a, b) => {
        if (selectedCenterId && a.id === selectedCenterId) return -1;
        if (selectedCenterId && b.id === selectedCenterId) return 1;
        return a.distance - b.distance; // Sort by distance otherwise
    });

    const cities = [...new Set(evacuationCenters.map(center => center.city))];

    const Sidebar: React.FC = () => (
        <div className={`sidebar ${isMobile ? 'mobile' : 'desktop'} ${isMobile && sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <button
                    onClick={() => navigate('/menu')}
                    className="logo-container-button">
                    <img
                        src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                        alt="CIVILIAN"
                        className="logo"
                    />
                    <span className="logo-text">CIVILIAN</span>
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
                    <button onClick={() => handleNavigation('home')} className="nav-item">
                        <Home size={20} />
                        <span className="nav-label">Dashboard</span>
                    </button>
                    <button onClick={() => handleNavigation('gis')} className="nav-item">
                        <MapPin size={20} />
                        <span className="nav-label">Map</span>
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
        <div className="evacuation-page">
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
                        <span className="alerts-count">0</span>
                    </div>

                    <div className="clock">
                        {isMobile ? currentTime.toLocaleTimeString().slice(0, 5) : currentTime.toLocaleTimeString()}
                    </div>
                </header>

                <div className="content">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="page-title-section">
                            <div className="page-title-row">
                                {fromGIS && (
                                    <button
                                        onClick={() => navigate('/gis')}
                                        className="back-button"
                                        title="Back to Map"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                )}
                                <div>
                                    <h1 className="page-title">Evacuation Centers</h1>
                                    <p className="page-subtitle">
                                        Batangas City Emergency Facilities
                                        {selectedCenterId && (
                                            <span className="highlight-text"> - Center #{selectedCenterId} Highlighted</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="search-filter-section">
                            <div className="search-container">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search centers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="city-filter"
                            >
                                <option value="all">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="summary-grid">
                        <div className="summary-card total-card">
                            <div className="summary-icon">
                                <Building2 size={24} />
                            </div>
                            <div className="summary-content">
                                <div className="summary-value">{filteredCenters.length}</div>
                                <div className="summary-label">Total Centers</div>
                            </div>
                        </div>

                        <div className="summary-card available-card">
                            <div className="summary-icon">
                                <CheckCircle size={24} />
                            </div>
                            <div className="summary-content">
                                <div className="summary-value">{filteredCenters.filter(c => c.status === 'available').length}</div>
                                <div className="summary-label">Available</div>
                            </div>
                        </div>

                        <div className="summary-card capacity-card">
                            <div className="summary-icon">
                                <Users size={24} />
                            </div>
                            <div className="summary-content">
                                <div className="summary-value">{filteredCenters.reduce((sum, c) => sum + c.capacity, 0).toLocaleString()}</div>
                                <div className="summary-label">Total Capacity</div>
                            </div>
                        </div>

                        <div className="summary-card occupied-card">
                            <div className="summary-icon">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="summary-content">
                                <div className="summary-value">{filteredCenters.reduce((sum, c) => sum + c.currentOccupancy, 0).toLocaleString()}</div>
                                <div className="summary-label">Currently Occupied</div>
                            </div>
                        </div>
                    </div>

                    {/* Centers List */}
                    <div className="centers-grid">
                        {sortedCenters.map(center => (
                            <div
                                key={center.id}
                                className={`center-card ${selectedCenterId === center.id ? 'highlighted' : ''}`}
                            >
                                <div className="center-header">
                                    <div className="center-info">
                                        <div className="center-type-icon">
                                            {getTypeIcon(center.type)}
                                        </div>
                                        <div>
                                            <h3 className="center-name">
                                                {center.name}
                                                {selectedCenterId === center.id && (
                                                    <span className="selected-badge">SELECTED</span>
                                                )}
                                            </h3>
                                            <p className="center-address">{center.address}, {center.city}</p>
                                        </div>
                                    </div>
                                    <div className="center-status" style={{ color: getStatusColor(center.status) }}>
                                        {getStatusIcon(center.status)}
                                        <span className="status-text">{center.status.charAt(0).toUpperCase() + center.status.slice(1)}</span>
                                    </div>
                                </div>

                                <div className="center-details">
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <Users size={16} />
                                            <span>Capacity: {center.capacity.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-item">
                                            <AlertTriangle size={16} />
                                            <span>Occupied: {center.currentOccupancy.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <Navigation size={16} />
                                            <span>{center.distance} km away</span>
                                        </div>
                                        <div className="detail-item">
                                            <Phone size={16} />
                                            <span>{center.contact}</span>
                                        </div>
                                    </div>

                                    <div className="detail-row">
                                        <div className="detail-item coordinates">
                                            <MapPin size={16} />
                                            <span>{center.latitude.toFixed(4)}, {center.longitude.toFixed(4)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <Clock size={16} />
                                            <span>Updated: {new Date(center.lastUpdated).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="facilities-section">
                                    <div className="facilities-title">Available Facilities:</div>
                                    <div className="facilities-list">
                                        {center.facilities.map((facility, index) => (
                                            <span key={index} className="facility-tag">{facility}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="occupancy-bar">
                                    <div className="occupancy-label">
                                        <span>Occupancy</span>
                                        <span>{Math.round((center.currentOccupancy / center.capacity) * 100)}%</span>
                                    </div>
                                    <div className="occupancy-progress">
                                        <div
                                            className="occupancy-fill"
                                            style={{
                                                width: `${(center.currentOccupancy / center.capacity) * 100}%`,
                                                backgroundColor: center.currentOccupancy / center.capacity > 0.8 ? '#ef4444' :
                                                    center.currentOccupancy / center.capacity > 0.6 ? '#f59e0b' : '#10b981'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="center-actions">
                                    <button
                                        className="action-btn directions-btn"
                                        onClick={() => handleGetDirections(center)}
                                    >
                                        <Navigation size={16} />
                                        Get Directions
                                    </button>
                                    <button
                                        className="action-btn view-map-btn"
                                        onClick={() => handleViewOnMap(center)}
                                    >
                                        <ExternalLink size={16} />
                                        View on Map
                                    </button>
                                    <button className="action-btn contact-btn">
                                        <Phone size={16} />
                                        Contact
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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

export default EvacuationCenters;