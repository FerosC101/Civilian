import {
    AlertTriangle,
    Bell,
    Clock,
    Heart,
    Home,
    Info,
    Mail,
    MapPin,
    Phone,
    Search,
    Settings,
    Shield,
    X,
    Truck,
    Users,
    Zap,
    Activity, Globe, BarChart3
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmergencyContacts.css';

interface EmergencyContact {
    id: string;
    name: string;
    department: string;
    description: string;
    category: 'emergency' | 'medical' | 'fire' | 'police' | 'rescue' | 'utility' | 'government' | 'disaster';
    priority: 'critical' | 'high' | 'medium' | 'low';
    phoneNumber: string;
    alternateNumber?: string;
    email?: string;
    address: string;
    hours: string;
    region: string;
    services: string[];
    isActive: boolean;
}

const EmergencyContacts: React.FC = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Mock emergency contacts data for Greater Metro Manila
    const emergencyContacts: EmergencyContact[] = [
        {
            id: '1',
            name: 'Philippine National Police (PNP)',
            department: 'National Capital Region Police Office',
            description: 'National police force for crime prevention, law enforcement, and public safety',
            category: 'police',
            priority: 'critical',
            phoneNumber: '117',
            alternateNumber: '+63 2 8722 0650',
            email: 'ncr@pnp.gov.ph',
            address: 'Camp Crame, Quezon City',
            hours: '24/7',
            region: 'Metro Manila',
            services: ['Crime reporting', 'Emergency response', 'Traffic enforcement', 'Public safety'],
            isActive: true
        },
        {
            id: '2',
            name: 'Bureau of Fire Protection (BFP)',
            department: 'National Capital Region',
            description: 'Fire prevention, suppression, and rescue operations nationwide',
            category: 'fire',
            priority: 'critical',
            phoneNumber: '116',
            alternateNumber: '+63 2 8426 0219',
            email: 'bfp.ncr@bfp.gov.ph',
            address: 'BFP National Headquarters, Quezon City',
            hours: '24/7',
            region: 'Metro Manila',
            services: ['Fire suppression', 'Rescue operations', 'Fire prevention', 'Emergency medical'],
            isActive: true
        },
        {
            id: '3',
            name: 'Philippine Red Cross',
            department: 'National Capital Region Chapter',
            description: 'Humanitarian services, disaster response, and emergency medical assistance',
            category: 'medical',
            priority: 'critical',
            phoneNumber: '143',
            alternateNumber: '+63 2 8527 0864',
            email: 'ncr@redcross.org.ph',
            address: 'Port Area, Manila',
            hours: '24/7',
            region: 'Metro Manila',
            services: ['Emergency medical', 'Disaster response', 'Blood services', 'Rescue operations'],
            isActive: true
        },
        {
            id: '4',
            name: 'Metropolitan Manila Development Authority',
            department: 'Traffic & Emergency Response',
            description: 'Traffic management and emergency response coordination for Metro Manila',
            category: 'emergency',
            priority: 'high',
            phoneNumber: '136',
            alternateNumber: '+63 2 8882 4150',
            email: 'info@mmda.gov.ph',
            address: 'EDSA Central, Makati City',
            hours: '24/7',
            region: 'Metro Manila',
            services: ['Traffic management', 'Emergency response', 'Flood control', 'Disaster coordination'],
            isActive: true
        },
        {
            id: '5',
            name: 'Department of Health (DOH)',
            department: 'National Capital Region',
            description: 'Public health services and medical emergency coordination',
            category: 'medical',
            priority: 'high',
            phoneNumber: '135',
            alternateNumber: '+63 2 8651 7800',
            email: 'dohncr@doh.gov.ph',
            address: 'San Lazaro Compound, Manila',
            hours: '24/7',
            region: 'Metro Manila',
            services: ['Health emergency', 'Disease surveillance', 'Medical coordination', 'Public health'],
            isActive: true
        },
        {
            id: '6',
            name: 'Philippine Coast Guard',
            department: 'National Capital Region',
            description: 'Maritime safety, search and rescue, and marine environmental protection',
            category: 'rescue',
            priority: 'high',
            phoneNumber: '143',
            alternateNumber: '+63 2 8527 3877',
            email: 'pcgncr@coastguard.gov.ph',
            address: 'Port Area, Manila',
            hours: '24/7',
            region: 'Metro Manila',
            services: ['Maritime rescue', 'Water emergency', 'Marine safety', 'Environmental protection'],
            isActive: true
        },
        {
            id: '7',
            name: 'Manila Electric Company (MERALCO)',
            department: 'Emergency Services',
            description: 'Electrical emergency response and power restoration services',
            category: 'utility',
            priority: 'medium',
            phoneNumber: '16211',
            alternateNumber: '+63 2 8631 2222',
            email: 'emergency@meralco.com.ph',
            address: 'Ortigas Center, Pasig City',
            hours: '24/7',
            region: 'Metro Manila',
            services: ['Power outage', 'Electrical emergency', 'Line repairs', 'Safety hazards'],
            isActive: true
        },
        {
            id: '8',
            name: 'Manila Water Company',
            department: 'Customer Care & Emergency',
            description: 'Water service emergency response and pipe repair services',
            category: 'utility',
            priority: 'medium',
            phoneNumber: '1627',
            alternateNumber: '+63 2 8917 7878',
            email: 'customercare@manilawater.com.ph',
            address: 'Quezon City',
            hours: '24/7',
            region: 'East Metro Manila',
            services: ['Water emergency', 'Pipe repairs', 'Service restoration', 'Water quality'],
            isActive: true
        },
        {
            id: '9',
            name: 'National Disaster Risk Reduction Council',
            department: 'Operations Center',
            description: 'National disaster coordination and emergency response management',
            category: 'disaster',
            priority: 'critical',
            phoneNumber: '911',
            alternateNumber: '+63 2 8911 1406',
            email: 'ndrrmc@ndrrmc.gov.ph',
            address: 'Camp Aguinaldo, Quezon City',
            hours: '24/7',
            region: 'National',
            services: ['Disaster coordination', 'Emergency management', 'Resource mobilization', 'Alert systems'],
            isActive: true
        },
        {
            id: '10',
            name: 'Quezon City Disaster Risk Reduction Office',
            department: 'Emergency Response Unit',
            description: 'Local disaster response and emergency management for Quezon City',
            category: 'disaster',
            priority: 'high',
            phoneNumber: '+63 2 8988 4242',
            alternateNumber: '+63 2 8426 1448',
            email: 'qcdrrmo@quezoncity.gov.ph',
            address: 'Quezon City Hall, Quezon City',
            hours: '24/7',
            region: 'Quezon City',
            services: ['Local emergency response', 'Evacuation coordination', 'Disaster preparedness', 'Community safety'],
            isActive: true
        },
        {
            id: '11',
            name: 'Manila City Disaster Risk Reduction Office',
            department: 'Emergency Operations',
            description: 'Emergency response and disaster management for Manila City',
            category: 'disaster',
            priority: 'high',
            phoneNumber: '+63 2 8527 3000',
            alternateNumber: '+63 2 8527 4444',
            email: 'disaster@manila.gov.ph',
            address: 'Manila City Hall, Manila',
            hours: '24/7',
            region: 'Manila City',
            services: ['Emergency coordination', 'Disaster response', 'Public safety', 'Resource management'],
            isActive: true
        },
        {
            id: '12',
            name: 'Makati Emergency Services',
            department: 'Makati Rescue Unit',
            description: 'Emergency medical services and rescue operations for Makati City',
            category: 'emergency',
            priority: 'high',
            phoneNumber: '+63 2 8899 1000',
            alternateNumber: '+63 2 8899 1001',
            email: 'emergency@makati.gov.ph',
            address: 'Makati City Hall, Makati',
            hours: '24/7',
            region: 'Makati City',
            services: ['Emergency medical', 'Rescue operations', 'Ambulance service', 'Crisis response'],
            isActive: true
        },
        {
            id: '13',
            name: 'Philippine Atmospheric Geophysical Services',
            department: 'Weather Monitoring Division',
            description: 'Weather monitoring, forecasting, and severe weather warnings',
            category: 'disaster',
            priority: 'medium',
            phoneNumber: '+63 2 8927 2877',
            alternateNumber: '+63 2 8434 2696',
            email: 'info@pagasa.dost.gov.ph',
            address: 'Quezon City',
            hours: '24/7',
            region: 'National',
            services: ['Weather monitoring', 'Storm warnings', 'Climate information', 'Disaster alerts'],
            isActive: true
        },
        {
            id: '14',
            name: 'Pasig City Emergency Response',
            department: 'Public Safety Office',
            description: 'Emergency response services and public safety for Pasig City',
            category: 'emergency',
            priority: 'high',
            phoneNumber: '+63 2 8641 5000',
            alternateNumber: '+63 2 8697 1111',
            email: 'emergency@pasigcity.gov.ph',
            address: 'Pasig City Hall, Pasig',
            hours: '24/7',
            region: 'Pasig City',
            services: ['Emergency response', 'Public safety', 'Disaster coordination', 'Medical assistance'],
            isActive: true
        },
        {
            id: '15',
            name: 'Antipolo Emergency Services',
            department: 'Disaster Risk Reduction Office',
            description: 'Emergency response and disaster management for Antipolo City',
            category: 'disaster',
            priority: 'medium',
            phoneNumber: '+63 2 8697 2186',
            alternateNumber: '+63 2 8697 3344',
            email: 'emergency@antipolo.gov.ph',
            address: 'Antipolo City Hall, Antipolo',
            hours: '24/7',
            region: 'Antipolo City',
            services: ['Emergency coordination', 'Landslide monitoring', 'Evacuation services', 'Community preparedness'],
            isActive: true
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

    // Filter emergency contacts
    const filteredContacts = useMemo(() => {
        return emergencyContacts.filter(contact => {
            const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory;

            return matchesSearch && matchesCategory && contact.isActive;
        });
    }, [emergencyContacts, searchTerm, selectedCategory]);

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
            case 'menu':
                navigate('/menu');
                break;
            default:
                break;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'emergency': return '🚨';
            case 'medical': return '🏥';
            case 'fire': return '🚒';
            case 'police': return '👮';
            case 'rescue': return '⛑️';
            case 'utility': return '⚡';
            case 'government': return '🏛️';
            case 'disaster': return '🌪️';
            default: return '📞';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return '#ef4444';
            case 'high': return '#f97316';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };

    const handleCall = (phoneNumber: string) => {
        window.location.href = `tel:${phoneNumber}`;
    };

    const handleEmail = (email?: string) => {
        if (email) {
            window.location.href = `mailto:${email}`;
        }
    };

    const Sidebar: React.FC = () => (
        <div className={`sidebar ${isMobile ? 'mobile' : 'desktop'} ${isMobile && sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <button
                    onClick={() => handleNavigation('menu')}
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
                    <button onClick={() => handleNavigation('donations')} className="nav-item">
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
        <div className="emergency-page">
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
                        <span className="alerts-count">{filteredContacts.length}</span>
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
                                    <h1 className="page-title">Emergency Contacts</h1>
                                    <p className="page-subtitle">
                                        Quick access to emergency services
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Warning */}
                        <div className="emergency-warning">
                            <AlertTriangle size={20} className="emergency-warning-icon" />
                            <div className="emergency-warning-content">
                                <h3>Emergency Alert</h3>
                                <p>For life-threatening emergencies, dial 911 immediately. These contacts are for additional support and coordination.</p>
                            </div>
                        </div>

                        {/* Search Section */}
                        <div className="search-section">
                            <div className="search-container">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search emergency services..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="category-filter"
                            >
                                <option value="all">All Categories</option>
                                <option value="emergency">Emergency</option>
                                <option value="medical">Medical</option>
                                <option value="fire">Fire Department</option>
                                <option value="police">Police</option>
                                <option value="rescue">Rescue Services</option>
                                <option value="utility">Utilities</option>
                                <option value="disaster">Disaster Management</option>
                            </select>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <section className="stats-cards-row">
                        <div className="stat-card total">
                            <div className="stat-icon">
                                <Phone size={20} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{filteredContacts.length}</div>
                                <div className="stat-label">Total Contacts</div>
                            </div>
                        </div>

                        <div className="stat-card emergency">
                            <div className="stat-icon">
                                <AlertTriangle size={20} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{filteredContacts.filter(c => c.priority === 'critical').length}</div>
                                <div className="stat-label">Critical Priority</div>
                            </div>
                        </div>

                        <div className="stat-card medical">
                            <div className="stat-icon">
                                <Activity size={20} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{filteredContacts.filter(c => c.category === 'medical' || c.category === 'emergency').length}</div>
                                <div className="stat-label">Medical/Emergency</div>
                            </div>
                        </div>

                        <div className="stat-card safety">
                            <div className="stat-icon">
                                <Shield size={20} />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{filteredContacts.filter(c => c.category === 'police' || c.category === 'fire').length}</div>
                                <div className="stat-label">Safety Services</div>
                            </div>
                        </div>
                    </section>

                    {/* Emergency Contacts Grid */}
                    <section className="contacts-grid">
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map((contact) => (
                                <div key={contact.id} className="contact-card">
                                    <div className="contact-header">
                                        <div className="contact-category">
                                            <div className="category-icon-wrapper">
                                                {getCategoryIcon(contact.category)}
                                            </div>
                                            <span className="category-text">{contact.category.charAt(0).toUpperCase() + contact.category.slice(1)}</span>
                                        </div>
                                        <div
                                            className={`priority-badge ${contact.priority}`}
                                            style={{ color: getPriorityColor(contact.priority) }}
                                        >
                                            {contact.priority.toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="contact-main-info">
                                        <div className="contact-title">{contact.name}</div>
                                        <div className="contact-department">{contact.department}</div>
                                        <div className="contact-description">{contact.description}</div>
                                    </div>

                                    <div className="contact-primary-info">
                                        <div className="primary-phone">
                                            <Phone size={16} className="primary-phone-icon" />
                                            <span className="primary-phone-number">{contact.phoneNumber}</span>
                                        </div>
                                        <div className="availability">
                                            <Clock size={14} />
                                            <span>{contact.hours}</span>
                                        </div>
                                    </div>

                                    <div className="contact-secondary-details">
                                        {contact.alternateNumber && (
                                            <div className="detail-item alternate-phone">
                                                <Phone size={12} />
                                                <span>{contact.alternateNumber}</span>
                                            </div>
                                        )}

                                        {contact.email && (
                                            <div className="detail-item email">
                                                <Mail size={12} />
                                                <span>{contact.email}</span>
                                            </div>
                                        )}

                                        <div className="detail-item location">
                                            <MapPin size={12} />
                                            <span>{contact.address}</span>
                                        </div>

                                        <div className="detail-item region">
                                            <Globe size={12} />
                                            <span>{contact.region}</span>
                                        </div>
                                    </div>

                                    <div className="contact-services">
                                        <div className="services-label">Services:</div>
                                        <div className="services-list">
                                            {contact.services.slice(0, 3).map((service, index) => (
                                                <span key={index} className="service-tag">{service}</span>
                                            ))}
                                            {contact.services.length > 3 && (
                                                <span className="service-tag more">+{contact.services.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="contact-actions">
                                        <button
                                            className="contact-button call"
                                            onClick={() => handleCall(contact.phoneNumber)}
                                        >
                                            <Phone size={16} />
                                            Call Now
                                        </button>
                                        <button
                                            className="contact-button info"
                                            onClick={() => contact.email && handleEmail(contact.email)}
                                        >
                                            <Info size={16} />
                                            Info
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <AlertTriangle size={48} />
                                <h3>No emergency contacts found</h3>
                                <p>Try adjusting your search terms or category filter</p>
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
                        <button onClick={() => handleNavigation('donations')} className="nav-button">
                            <BarChart3 size={20} />
                            <span>Analytics</span>
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

export default EmergencyContacts;