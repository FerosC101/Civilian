import {
    AlertTriangle,
    Calendar,
    ChevronDown,
    Filter,
    Heart,
    Home,
    MapPin,
    Phone,
    Search,
    Settings,
    Target,
    Users,
    X,
    Bell
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationDrive.css';

interface DonationDrive {
    id: string;
    title: string;
    organization: string;
    description: string;
    disasterType: 'flood' | 'earthquake' | 'fire' | 'typhoon' | 'landslide';
    urgency: 'low' | 'medium' | 'high' | 'critical';
    location: string;
    contactNumber: string;
    targetAmount: number;
    currentAmount: number;
    startDate: string;
    endDate: string;
    beneficiaries: number;
    status: 'active' | 'completed' | 'urgent';
}

const DonationDrives: React.FC = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedDisasterType, setSelectedDisasterType] = useState<string>('all');
    const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
    const [showFilters, setShowFilters] = useState<boolean>(false);

    // Mock donation drives data for Greater Metro Manila
    const donationDrives: DonationDrive[] = [
        {
            id: '1',
            title: 'Marikina Flood Relief Operation',
            organization: 'Red Cross Manila',
            description: 'Emergency relief for families affected by severe flooding in Marikina City',
            disasterType: 'flood',
            urgency: 'critical',
            location: 'Marikina City',
            contactNumber: '+63 917 123 4567',
            targetAmount: 2500000,
            currentAmount: 1875000,
            startDate: '2025-08-15',
            endDate: '2025-09-30',
            beneficiaries: 1500,
            status: 'active'
        },
        {
            id: '2',
            title: 'Quezon City Fire Victims Support',
            organization: 'Bayanihan Foundation',
            description: 'Housing and livelihood assistance for families displaced by residential fire',
            disasterType: 'fire',
            urgency: 'high',
            location: 'Quezon City',
            contactNumber: '+63 928 987 6543',
            targetAmount: 1800000,
            currentAmount: 1260000,
            startDate: '2025-08-20',
            endDate: '2025-10-15',
            beneficiaries: 850,
            status: 'active'
        },
        {
            id: '3',
            title: 'Earthquake Preparedness Program',
            organization: 'Metro Manila Disaster Council',
            description: 'Community preparedness training and emergency supplies distribution',
            disasterType: 'earthquake',
            urgency: 'medium',
            location: 'Metro Manila',
            contactNumber: '+63 915 246 8135',
            targetAmount: 3200000,
            currentAmount: 960000,
            startDate: '2025-07-01',
            endDate: '2025-12-31',
            beneficiaries: 5000,
            status: 'active'
        },
        {
            id: '4',
            title: 'Pasig River Communities Aid',
            organization: 'Kapit Bisig Foundation',
            description: 'Medical assistance and temporary shelter for flood-affected riverside communities',
            disasterType: 'flood',
            urgency: 'high',
            location: 'Pasig City',
            contactNumber: '+63 939 555 7788',
            targetAmount: 2100000,
            currentAmount: 1575000,
            startDate: '2025-08-10',
            endDate: '2025-09-25',
            beneficiaries: 1200,
            status: 'active'
        },
        {
            id: '5',
            title: 'Typhoon Resilience Building',
            organization: 'Save the Children Philippines',
            description: 'Child protection services and family support during typhoon season',
            disasterType: 'typhoon',
            urgency: 'medium',
            location: 'Caloocan City',
            contactNumber: '+63 908 321 9876',
            targetAmount: 2800000,
            currentAmount: 1400000,
            startDate: '2025-06-15',
            endDate: '2025-11-30',
            beneficiaries: 2200,
            status: 'active'
        },
        {
            id: '6',
            title: 'Manila Bay Landslide Response',
            organization: 'Disaster Response Network',
            description: 'Emergency evacuation and relocation assistance for landslide-prone areas',
            disasterType: 'landslide',
            urgency: 'critical',
            location: 'Manila',
            contactNumber: '+63 947 654 3210',
            targetAmount: 1500000,
            currentAmount: 1200000,
            startDate: '2025-08-25',
            endDate: '2025-10-01',
            beneficiaries: 600,
            status: 'urgent'
        },
        {
            id: '7',
            title: 'Taguig Industrial Fire Recovery',
            organization: 'United Way Metro Manila',
            description: 'Livelihood restoration for workers affected by industrial facility fire',
            disasterType: 'fire',
            urgency: 'medium',
            location: 'Taguig City',
            contactNumber: '+63 922 111 2233',
            targetAmount: 2200000,
            currentAmount: 990000,
            startDate: '2025-07-20',
            endDate: '2025-10-31',
            beneficiaries: 950,
            status: 'active'
        },
        {
            id: '8',
            title: 'Las Piñas Flash Flood Relief',
            organization: 'Community Volunteers United',
            description: 'Clean water access and hygiene kits for flash flood victims',
            disasterType: 'flood',
            urgency: 'high',
            location: 'Las Piñas City',
            contactNumber: '+63 936 777 8899',
            targetAmount: 1200000,
            currentAmount: 840000,
            startDate: '2025-08-18',
            endDate: '2025-09-20',
            beneficiaries: 750,
            status: 'active'
        },
        {
            id: '9',
            title: 'Makati Business District Fire Safety',
            organization: 'Corporate Social Alliance',
            description: 'Fire safety equipment and training for dense commercial areas',
            disasterType: 'fire',
            urgency: 'low',
            location: 'Makati City',
            contactNumber: '+63 917 445 6677',
            targetAmount: 3500000,
            currentAmount: 1750000,
            startDate: '2025-05-01',
            endDate: '2025-12-15',
            beneficiaries: 3500,
            status: 'active'
        },
        {
            id: '10',
            title: 'Rizal Province Earthquake Fund',
            organization: 'Provincial Disaster Office',
            description: 'Infrastructure repair and family assistance for earthquake damage',
            disasterType: 'earthquake',
            urgency: 'high',
            location: 'Rizal Province',
            contactNumber: '+63 929 333 4455',
            targetAmount: 4000000,
            currentAmount: 2400000,
            startDate: '2025-08-01',
            endDate: '2025-11-15',
            beneficiaries: 2800,
            status: 'active'
        },
        {
            id: '11',
            title: 'Antipolo Landslide Prevention',
            organization: 'Environmental Defense League',
            description: 'Slope stabilization and early warning systems for high-risk communities',
            disasterType: 'landslide',
            urgency: 'medium',
            location: 'Antipolo City',
            contactNumber: '+63 918 222 3344',
            targetAmount: 2600000,
            currentAmount: 1560000,
            startDate: '2025-07-10',
            endDate: '2025-10-25',
            beneficiaries: 1800,
            status: 'active'
        },
        {
            id: '12',
            title: 'Parañaque Typhoon Shelter Program',
            organization: 'Shelter Plus Foundation',
            description: 'Temporary housing and long-term shelter solutions for typhoon-affected families',
            disasterType: 'typhoon',
            urgency: 'critical',
            location: 'Parañaque City',
            contactNumber: '+63 945 888 9900',
            targetAmount: 3800000,
            currentAmount: 2660000,
            startDate: '2025-08-05',
            endDate: '2025-11-01',
            beneficiaries: 2100,
            status: 'urgent'
        }
    ];

    // Update clock every second
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

    // Filter donation drives
    const filteredDrives = useMemo(() => {
        return donationDrives.filter(drive => {
            const matchesSearch = drive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                drive.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                drive.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesDisasterType = selectedDisasterType === 'all' || drive.disasterType === selectedDisasterType;
            const matchesUrgency = selectedUrgency === 'all' || drive.urgency === selectedUrgency;

            return matchesSearch && matchesDisasterType && matchesUrgency;
        });
    }, [donationDrives, searchTerm, selectedDisasterType, selectedUrgency]);

    const handleNavigation = (page: string) => {
        setSidebarOpen(false);
        switch (page) {
            case 'home':
                navigate('/home');
                break;
            case 'gis':
                navigate('/gis');
                break;
            case 'donations':
                navigate('/donations');
                break;
            case 'settings':
                navigate('/settings');
                break;
            default:
                break;
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'low': return '#10b981';
            case 'medium': return '#f59e0b';
            case 'high': return '#f97316';
            case 'critical': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getDisasterIcon = (disasterType: string) => {
        switch (disasterType) {
            case 'flood': return '🌊';
            case 'fire': return '🔥';
            case 'earthquake': return '🏔️';
            case 'typhoon': return '🌀';
            case 'landslide': return '⛰️';
            default: return '⚠️';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const calculateProgress = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100);
    };

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
                    <button onClick={() => handleNavigation('donations')} className="nav-item active">
                        <Heart size={20} />
                        <span className="nav-label">Donations</span>
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
        <div className="donation-page">
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
                        <span className="alerts-count">{filteredDrives.length}</span>
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
                                <div>
                                    <h1 className="page-title">Donation Drives</h1>
                                    <p className="page-subtitle">
                                        Active Relief Operations
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
                                    placeholder="Search donation drives..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`filter-toggle ${showFilters ? 'active' : ''}`}
                            >
                                <Filter size={18} />
                                <span>Filter</span>
                                <ChevronDown size={16} className={`chevron ${showFilters ? 'rotated' : ''}`} />
                            </button>
                        </div>

                        {showFilters && (
                            <div className="filters-container">
                                <div className="filter-group">
                                    <label className="filter-label">Disaster Type</label>
                                    <select
                                        value={selectedDisasterType}
                                        onChange={(e) => setSelectedDisasterType(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="flood">Flood</option>
                                        <option value="fire">Fire</option>
                                        <option value="earthquake">Earthquake</option>
                                        <option value="typhoon">Typhoon</option>
                                        <option value="landslide">Landslide</option>
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label className="filter-label">Urgency Level</label>
                                    <select
                                        value={selectedUrgency}
                                        onChange={(e) => setSelectedUrgency(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">All Levels</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Statistics Cards */}
                    <section className="stats-cards-row">
                        <div className="stat-card active">
                            <div className="stat-icon">
                                <Heart size={20} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{filteredDrives.filter(d => d.status === 'active').length}</div>
                                <div className="stat-label">Active Drives</div>
                            </div>
                        </div>

                        <div className="stat-card critical">
                            <div className="stat-icon">
                                <AlertTriangle size={20} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{filteredDrives.filter(d => d.urgency === 'critical').length}</div>
                                <div className="stat-label">Critical Urgency</div>
                            </div>
                        </div>

                        <div className="stat-card beneficiaries">
                            <div className="stat-icon">
                                <Users size={20} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{filteredDrives.reduce((sum, d) => sum + d.beneficiaries, 0).toLocaleString()}</div>
                                <div className="stat-label">Beneficiaries</div>
                            </div>
                        </div>

                        <div className="stat-card funds">
                            <div className="stat-icon">
                                <Target size={20} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{formatCurrency(filteredDrives.reduce((sum, d) => sum + d.targetAmount, 0))}</div>
                                <div className="stat-label">Target Funds</div>
                            </div>
                        </div>
                    </section>

                    {/* Donation Drives Grid */}
                    <section className="drives-grid">
                        {filteredDrives.length > 0 ? (
                            filteredDrives.map((drive) => (
                                <div key={drive.id} className="drive-card">
                                    <div className="drive-header">
                                        <div className="drive-disaster-type">
                                            <span className="disaster-icon">{getDisasterIcon(drive.disasterType)}</span>
                                            <span className="disaster-text">{drive.disasterType.charAt(0).toUpperCase() + drive.disasterType.slice(1)}</span>
                                        </div>
                                        <div className={`urgency-badge ${drive.urgency}`} style={{ color: getUrgencyColor(drive.urgency) }}>
                                            {drive.urgency.toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="drive-title">{drive.title}</div>
                                    <div className="drive-organization">{drive.organization}</div>
                                    <div className="drive-description">{drive.description}</div>

                                    <div className="drive-location">
                                        <MapPin size={14} />
                                        <span>{drive.location}</span>
                                    </div>

                                    <div className="progress-section">
                                        <div className="progress-info">
                                            <span className="current-amount">{formatCurrency(drive.currentAmount)}</span>
                                            <span className="target-amount">of {formatCurrency(drive.targetAmount)}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${calculateProgress(drive.currentAmount, drive.targetAmount)}%` }}
                                            />
                                        </div>
                                        <div className="progress-percentage">
                                            {Math.round(calculateProgress(drive.currentAmount, drive.targetAmount))}% funded
                                        </div>
                                    </div>

                                    <div className="drive-details">
                                        <div className="detail-item">
                                            <Users size={14} />
                                            <span>{drive.beneficiaries} beneficiaries</span>
                                        </div>
                                        <div className="detail-item">
                                            <Calendar size={14} />
                                            <span>Until {new Date(drive.endDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="detail-item">
                                            <Phone size={14} />
                                            <span>{drive.contactNumber}</span>
                                        </div>
                                    </div>

                                    <div className="drive-actions">
                                        <button className="donate-button primary">
                                            <Heart size={16} />
                                            Donate Now
                                        </button>
                                        <button className="donate-button secondary">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <AlertTriangle size={48} />
                                <h3>No donation drives found</h3>
                                <p>Try adjusting your search terms or filters</p>
                            </div>
                        )}
                    </section>
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
                        <button onClick={() => handleNavigation('donations')} className="nav-button active">
                            <Heart size={20} />
                            <span>Donations</span>
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

export default DonationDrives;