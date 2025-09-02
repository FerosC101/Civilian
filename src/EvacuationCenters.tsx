//EvacuationCenters.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    CheckCircle
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
    distance: number; // in km
    type: 'school' | 'gym' | 'community_center' | 'church' | 'government';
    lastUpdated: string;
}

const EvacuationCenters: React.FC = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('all');

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

    const evacuationCenters: EvacuationCenter[] = [
        {
            id: 1,
            name: "University of the Philippines Diliman",
            address: "Quezon Ave, Diliman",
            city: "Quezon City",
            latitude: 14.6537,
            longitude: 121.0685,
            capacity: 2500,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Kitchen', 'Restrooms', 'Sleeping Area', 'Communications'],
            contact: "+63 2 8981 8500",
            distance: 3.2,
            type: 'school',
            lastUpdated: "2025-01-15 14:30"
        },
        {
            id: 2,
            name: "Smart Araneta Coliseum",
            address: "Araneta Coliseum, Cubao",
            city: "Quezon City",
            latitude: 14.6211,
            longitude: 121.0530,
            capacity: 15000,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Kitchen', 'Restrooms', 'Security', 'Parking'],
            contact: "+63 2 8911 5555",
            distance: 5.8,
            type: 'gym',
            lastUpdated: "2025-01-15 14:25"
        },
        {
            id: 3,
            name: "Manila City Hall",
            address: "Arroceros St, Ermita",
            city: "Manila",
            latitude: 14.5907,
            longitude: 120.9794,
            capacity: 800,
            currentOccupancy: 45,
            status: 'available',
            facilities: ['Medical Station', 'Communications', 'Security', 'Restrooms'],
            contact: "+63 2 8527 4152",
            distance: 8.1,
            type: 'government',
            lastUpdated: "2025-01-15 14:20"
        },
        {
            id: 4,
            name: "De La Salle University Manila",
            address: "2401 Taft Ave, Malate",
            city: "Manila",
            latitude: 14.5648,
            longitude: 120.9931,
            capacity: 1800,
            currentOccupancy: 120,
            status: 'available',
            facilities: ['Medical Station', 'Kitchen', 'Restrooms', 'Sleeping Area', 'Library'],
            contact: "+63 2 8524 4611",
            distance: 9.3,
            type: 'school',
            lastUpdated: "2025-01-15 14:15"
        },
        {
            id: 5,
            name: "Makati Sports Club",
            address: "Salcedo St, Legaspi Village",
            city: "Makati",
            latitude: 14.5547,
            longitude: 121.0244,
            capacity: 1200,
            currentOccupancy: 800,
            status: 'limited',
            facilities: ['Medical Station', 'Kitchen', 'Restrooms', 'Gym', 'Pool Area'],
            contact: "+63 2 8817 9951",
            distance: 12.7,
            type: 'gym',
            lastUpdated: "2025-01-15 14:10"
        },
        {
            id: 6,
            name: "Bonifacio Global City Amphitheater",
            address: "5th Ave, Bonifacio Global City",
            city: "Taguig",
            latitude: 14.5515,
            longitude: 121.0470,
            capacity: 3000,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Sound System', 'Restrooms', 'Parking', 'Security'],
            contact: "+63 2 8789 1000",
            distance: 15.2,
            type: 'community_center',
            lastUpdated: "2025-01-15 14:05"
        },
        {
            id: 7,
            name: "Pasig City Sports Center",
            address: "F. Legaspi St, San Nicolas",
            city: "Pasig",
            latitude: 14.5764,
            longitude: 121.0851,
            capacity: 2200,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Kitchen', 'Restrooms', 'Gym', 'Parking'],
            contact: "+63 2 8641 5000",
            distance: 7.9,
            type: 'gym',
            lastUpdated: "2025-01-15 14:00"
        },
        {
            id: 8,
            name: "San Juan City National High School",
            address: "N. Domingo St, San Juan City",
            city: "San Juan",
            latitude: 14.6019,
            longitude: 121.0355,
            capacity: 1500,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Kitchen', 'Restrooms', 'Classrooms', 'Playground'],
            contact: "+63 2 8724 1234",
            distance: 6.4,
            type: 'school',
            lastUpdated: "2025-01-15 13:55"
        },
        {
            id: 9,
            name: "Marikina Sports Park",
            address: "Shoe Ave, Marikina Heights",
            city: "Marikina",
            latitude: 14.6417,
            longitude: 121.1114,
            capacity: 5000,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Kitchen', 'Restrooms', 'Sports Facilities', 'Parking'],
            contact: "+63 2 8646 2436",
            distance: 11.8,
            type: 'gym',
            lastUpdated: "2025-01-15 13:50"
        },
        {
            id: 10,
            name: "Parañaque City Hall",
            address: "Ninoy Aquino Ave, Parañaque",
            city: "Parañaque",
            latitude: 14.4793,
            longitude: 121.0198,
            capacity: 1000,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Communications', 'Security', 'Restrooms', 'Meeting Rooms'],
            contact: "+63 2 8820 7814",
            distance: 18.5,
            type: 'government',
            lastUpdated: "2025-01-15 13:45"
        },
        {
            id: 11,
            name: "Muntinlupa Sports Complex",
            address: "National Rd, Tunasan",
            city: "Muntinlupa",
            latitude: 14.3754,
            longitude: 121.0453,
            capacity: 3500,
            currentOccupancy: 0,
            status: 'available',
            facilities: ['Medical Station', 'Kitchen', 'Restrooms', 'Sports Facilities', 'Parking'],
            contact: "+63 2 8850 3900",
            distance: 22.1,
            type: 'gym',
            lastUpdated: "2025-01-15 13:40"
        },
        {
            id: 12,
            name: "Las Piñas Community Center",
            address: "Real St, Las Piñas",
            city: "Las Piñas",
            latitude: 14.4166,
            longitude: 120.9936,
            capacity: 1800,
            currentOccupancy: 200,
            status: 'available',
            facilities: ['Medical Station', 'Kitchen', 'Restrooms', 'Meeting Rooms', 'WiFi'],
            contact: "+63 2 8800 1234",
            distance: 20.3,
            type: 'community_center',
            lastUpdated: "2025-01-15 13:35"
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
                            <h1 className="page-title">Evacuation Centers</h1>
                            <p className="page-subtitle">Metro Manila Emergency Facilities</p>
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
                        {filteredCenters.map(center => (
                            <div key={center.id} className="center-card">
                                <div className="center-header">
                                    <div className="center-info">
                                        <div className="center-type-icon">
                                            {getTypeIcon(center.type)}
                                        </div>
                                        <div>
                                            <h3 className="center-name">{center.name}</h3>
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
                                    <button className="action-btn directions-btn">
                                        <Navigation size={16} />
                                        Get Directions
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