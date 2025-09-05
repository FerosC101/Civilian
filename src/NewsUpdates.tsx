// NewsUpdates.tsx
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
    AlertTriangle,
    CheckCircle,
    Clock,
    Filter,
    ChevronDown,
    Info,
    RefreshCw,
    TrendingUp,
    Shield,
    Users,
    HelpCircle,
    Calendar,
    Zap,
    Activity,
    Siren,
    Newspaper,
    ChevronRight
} from 'lucide-react';
import './NewsUpdates.css';

interface NewsItem {
    id: number;
    type: 'alert' | 'news';
    subtype: 'flood' | 'system' | 'stats' | 'maintenance' | 'community' | 'weather' | 'infrastructure' | 'training' | 'emergency' | 'announcement';
    category: string;
    title: string;
    description: string;
    fullDescription?: string;
    timestamp: string;
    priority: 'breaking' | 'high' | 'medium' | 'low';
    isRead: boolean;
    icon?: React.ReactNode;
    source?: string;
    location?: string;
    severity?: 'critical' | 'warning' | 'info';
    imageUrl?: string;
    tags?: string[];
}

const NewsUpdates: React.FC = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    
    const [newsItems, setNewsItems] = useState<NewsItem[]>([
        // ALERTS
        {
            id: 1,
            type: 'alert',
            subtype: 'weather',
            category: 'Weather Alert',
            title: 'Heavy Rain Expected - Flood Warning',
            description: 'Flood warning issued for Districts 2-4. Residents advised to avoid low-lying areas and prepare for possible evacuation.',
            fullDescription: 'The Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA) has issued a flood warning for Districts 2-4 due to heavy rainfall expected in the next 6-12 hours. Water levels in major waterways are rising rapidly.',
            timestamp: '2 mins ago',
            priority: 'breaking',
            isRead: false,
            icon: <AlertTriangle size={20} />,
            source: 'PAGASA',
            location: 'Districts 2-4',
            severity: 'critical',
            tags: ['urgent', 'evacuation', 'safety']
        },
        {
            id: 2,
            type: 'alert',
            subtype: 'flood',
            category: 'Flood Monitoring',
            title: 'River Level Critical - Monitor Mode Active',
            description: 'Marikina River at 15.2m and rising. Monitor Mode activated for nearby areas. Stay alert for updates.',
            fullDescription: 'The Marikina River has reached a critical level of 15.2 meters and continues to rise due to upstream rainfall. All residents within 500 meters of the riverbank should remain vigilant.',
            timestamp: '45 mins ago',
            priority: 'high',
            isRead: false,
            icon: <Activity size={20} />,
            source: 'Flood Control Center',
            location: 'Marikina River Area',
            severity: 'warning',
            tags: ['monitoring', 'evacuation-ready']
        },
        {
            id: 3,
            type: 'alert',
            subtype: 'infrastructure',
            category: 'Infrastructure Alert',
            title: 'Bridge Closure - Use Alternate Routes',
            description: 'Marcos Highway bridge closed for emergency inspection. Heavy vehicles prohibited. Use alternate routes immediately.',
            fullDescription: 'Due to structural concerns identified during routine inspection, Marcos Highway bridge is temporarily closed to all traffic. DPWH engineers are conducting emergency assessments.',
            timestamp: '2 hours ago',
            priority: 'high',
            isRead: false,
            icon: <AlertTriangle size={20} />,
            source: 'DPWH',
            location: 'Marcos Highway',
            severity: 'warning',
            tags: ['traffic', 'infrastructure', 'detour']
        },

        // NEWS ARTICLES
        {
            id: 4,
            type: 'news',
            subtype: 'system',
            category: 'System Update',
            title: 'IoT Sensor Network Receives Major Upgrade',
            description: 'City-wide IoT sensor network upgraded with enhanced flood detection capabilities and improved response time.',
            fullDescription: 'The comprehensive upgrade includes 150 new sensors, AI-powered prediction algorithms, and integration with early warning systems. The enhanced network can now predict flooding events up to 3 hours in advance.',
            timestamp: '1 hour ago',
            priority: 'medium',
            isRead: false,
            icon: <CheckCircle size={20} />,
            source: 'Technology Department',
            severity: 'info',
            imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop',
            tags: ['technology', 'improvement', 'sensors']
        },
        {
            id: 5,
            type: 'news',
            subtype: 'community',
            category: 'Community Safety',
            title: 'City-Wide Emergency Drill Scheduled for March 15',
            description: 'Comprehensive emergency evacuation drill to test city preparedness and community response systems.',
            fullDescription: 'The drill will simulate a major flood scenario and test evacuation procedures, emergency communication systems, and coordination between various response teams. All residents encouraged to participate.',
            timestamp: '3 hours ago',
            priority: 'medium',
            isRead: true,
            icon: <Users size={20} />,
            source: 'Emergency Management Office',
            location: 'City-wide',
            severity: 'info',
            imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=250&fit=crop',
            tags: ['drill', 'preparedness', 'community']
        },
        {
            id: 6,
            type: 'news',
            subtype: 'stats',
            category: 'Monthly Report',
            title: 'February Safety Statistics Show Improvement',
            description: 'City achieves 87% safety score with 243 active sensors monitoring flood-prone areas continuously.',
            fullDescription: 'The monthly safety report indicates significant improvements in disaster preparedness, with reduced response times and increased sensor coverage across vulnerable areas.',
            timestamp: '6 hours ago',
            priority: 'low',
            isRead: false,
            icon: <BarChart3 size={20} />,
            source: 'Analytics Department',
            severity: 'info',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
            tags: ['statistics', 'performance', 'monitoring']
        },
        {
            id: 7,
            type: 'news',
            subtype: 'community',
            category: 'Public Service',
            title: 'Free Emergency Supply Kits Available at Barangay Halls',
            description: 'Emergency preparedness kits containing essential supplies now available for all registered residents.',
            fullDescription: 'Each kit includes first aid supplies, emergency food rations, water purification tablets, flashlight, radio, and emergency contact information. Registration required at local barangay office.',
            timestamp: '12 hours ago',
            priority: 'medium',
            isRead: true,
            icon: <Shield size={20} />,
            source: 'Local Government Unit',
            location: 'All Barangays',
            severity: 'info',
            imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop',
            tags: ['emergency-kit', 'preparedness', 'free']
        },
        {
            id: 8,
            type: 'news',
            subtype: 'weather',
            category: 'Weather Monitoring',
            title: 'Typhoon Paolo Tracking Update',
            description: 'Typhoon Paolo maintains distance from landmass, low probability of direct impact on Metro Manila region.',
            fullDescription: 'Latest meteorological data shows Typhoon Paolo moving northward, staying approximately 850km east of Luzon. Current trajectory suggests minimal impact on local weather patterns.',
            timestamp: '1 day ago',
            priority: 'low',
            isRead: true,
            icon: <RefreshCw size={20} />,
            source: 'PAGASA Weather Center',
            location: 'Metro Manila',
            severity: 'info',
            imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop',
            tags: ['typhoon', 'monitoring', 'weather']
        },
        {
            id: 9,
            type: 'news',
            subtype: 'training',
            category: 'Skills Development',
            title: 'Free First Aid Certification Program Launched',
            description: 'Weekend first aid training sessions now available at Community Center with certified instructors.',
            fullDescription: 'Comprehensive first aid certification program covering emergency response, CPR, and basic medical assistance. Sessions held every Saturday, with free certification upon completion.',
            timestamp: '2 days ago',
            priority: 'low',
            isRead: true,
            icon: <Users size={20} />,
            source: 'Philippine Red Cross',
            location: 'Community Center',
            severity: 'info',
            imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
            tags: ['training', 'first-aid', 'certification']
        }
    ]);

    const filterOptions = [
        { value: 'all', label: 'All Updates', count: newsItems.length },
        { value: 'alert', label: 'Emergency Alerts', count: newsItems.filter(item => item.type === 'alert').length },
        { value: 'news', label: 'News Articles', count: newsItems.filter(item => item.type === 'news').length },
        { value: 'breaking', label: 'Breaking', count: newsItems.filter(item => item.priority === 'breaking').length },
        { value: 'unread', label: 'Unread', count: newsItems.filter(item => !item.isRead).length }
    ];

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
            case 'help':
                navigate('/help');
                break;
            default:
                break;
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 2000);
    };

    const markAsRead = (id: number) => {
        setNewsItems(items =>
            items.map(item =>
                item.id === id ? { ...item, isRead: true } : item
            )
        );
    };

    const filteredNews = newsItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = selectedFilter === 'all' || 
                            item.type === selectedFilter || 
                            (selectedFilter === 'breaking' && item.priority === 'breaking') ||
                            (selectedFilter === 'unread' && !item.isRead);
        
        return matchesSearch && matchesFilter;
    });

    const alertItems = filteredNews.filter(item => item.type === 'alert');
    const newsArticles = filteredNews.filter(item => item.type === 'news');
    const unreadCount = newsItems.filter(item => !item.isRead).length;

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'breaking': return 'breaking';
            case 'high': return 'high';
            case 'medium': return 'medium';
            case 'low': return 'low';
            default: return 'medium';
        }
    };

    const getSeverityClass = (severity?: string) => {
        switch (severity) {
            case 'critical': return 'critical';
            case 'warning': return 'warning';
            case 'info': return 'info';
            default: return 'info';
        }
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
        <div className="news-page">
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
                        <span className="alerts-count">{unreadCount}</span>
                    </div>

                    <div className="clock">
                        {isMobile ? currentTime.toLocaleTimeString().slice(0, 5) : currentTime.toLocaleTimeString()}
                    </div>
                </header>

                <div className="content">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="page-title-section">
                            <h1 className="page-title">News & Updates</h1>
                            <p className="page-subtitle">Latest city safety and system updates</p>
                        </div>

                        <div className="header-actions">
                            <button 
                                onClick={handleRefresh}
                                className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
                            >
                                <RefreshCw size={18} />
                                {!isMobile && <span>Refresh</span>}
                            </button>
                        </div>
                    </div>

                    {/* Live Feed Indicator */}
                    <div className="live-feed-indicator">
                        <div className="live-feed-content">
                            <Activity size={16} />
                            <span>Live Feed</span>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="filter-section">
                        <div className="filter-container">
                            <button 
                                className={`filter-button ${filterOpen ? 'open' : ''}`}
                                onClick={() => setFilterOpen(!filterOpen)}
                            >
                                <Filter size={16} />
                                <span>{filterOptions.find(opt => opt.value === selectedFilter)?.label}</span>
                                <ChevronDown size={16} />
                            </button>

                            {filterOpen && (
                                <div className="filter-dropdown">
                                    {filterOptions.map(option => (
                                        <button
                                            key={option.value}
                                            className={`filter-option ${selectedFilter === option.value ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedFilter(option.value);
                                                setFilterOpen(false);
                                            }}
                                        >
                                            <span>{option.label}</span>
                                            <span className="filter-count">{option.count}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="search-container">
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search updates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    {/* Emergency Alerts Section */}
                    {(selectedFilter === 'all' || selectedFilter === 'alert') && alertItems.length > 0 && (
                        <div className="alerts-section">
                            <div className="section-header">
                                <div className="section-title">
                                    <Siren size={20} className="section-icon" />
                                    <h2>Emergency Alerts</h2>
                                    <span className="section-count">{alertItems.length}</span>
                                </div>
                            </div>
                            
                            <div className="alerts-list">
                                {alertItems.map(item => (
                                    <div 
                                        key={item.id} 
                                        className={`alert-item ${getPriorityClass(item.priority)} ${getSeverityClass(item.severity)} ${item.isRead ? 'read' : 'unread'}`}
                                        onClick={() => markAsRead(item.id)}
                                    >
                                        {item.priority === 'breaking' && (
                                            <div className="breaking-badge">
                                                <Zap size={12} />
                                                <span>BREAKING</span>
                                            </div>
                                        )}

                                        <div className="alert-header">
                                            <div className="alert-icon">
                                                {item.icon}
                                            </div>
                                            <div className="alert-meta">
                                                <span className="alert-category">{item.category}</span>
                                                <div className="alert-timestamp">
                                                    <Clock size={12} />
                                                    <span>{item.timestamp}</span>
                                                </div>
                                            </div>
                                            {!item.isRead && <div className="unread-dot" />}
                                        </div>

                                        <div className="alert-content">
                                            <h3 className="alert-title">{item.title}</h3>
                                            <p className="alert-description">{item.description}</p>
                                            {item.tags && (
                                                <div className="alert-tags">
                                                    {item.tags.map(tag => (
                                                        <span key={tag} className="tag">{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {(item.source || item.location) && (
                                            <div className="alert-footer">
                                                {item.source && (
                                                    <div className="alert-source">
                                                        <Info size={12} />
                                                        <span>{item.source}</span>
                                                    </div>
                                                )}
                                                {item.location && (
                                                    <div className="alert-location">
                                                        <MapPin size={12} />
                                                        <span>{item.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* News Articles Section */}
                    {(selectedFilter === 'all' || selectedFilter === 'news') && newsArticles.length > 0 && (
                        <div className="news-section">
                            <div className="section-header">
                                <div className="section-title">
                                    <Newspaper size={20} className="section-icon" />
                                    <h2>News Articles</h2>
                                    <span className="section-count">{newsArticles.length}</span>
                                </div>
                            </div>
                            
                            <div className="news-grid">
                                {newsArticles.map(item => (
                                    <article 
                                        key={item.id} 
                                        className={`news-article ${getPriorityClass(item.priority)} ${getSeverityClass(item.severity)} ${item.isRead ? 'read' : 'unread'}`}
                                        onClick={() => markAsRead(item.id)}
                                    >
                                        {item.imageUrl && (
                                            <div className="article-image">
                                                <img src={item.imageUrl} alt={item.title} />
                                                {!item.isRead && <div className="unread-indicator" />}
                                            </div>
                                        )}
                                        
                                        <div className="article-content">
                                            <div className="article-header">
                                                <div className="article-meta">
                                                    <span className="article-category">{item.category}</span>
                                                    <div className="article-timestamp">
                                                        <Clock size={12} />
                                                        <span>{item.timestamp}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="article-title">{item.title}</h3>
                                            <p className="article-description">{item.description}</p>

                                            {item.tags && (
                                                <div className="article-tags">
                                                    {item.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="tag">{tag}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="article-footer">
                                                <div className="article-source">
                                                    <div className="source-info">
                                                        <div className="source-icon">
                                                            {item.icon}
                                                        </div>
                                                        <span>{item.source}</span>
                                                    </div>
                                                </div>
                                                <div className="read-more">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredNews.length === 0 && (
                        <div className="empty-state">
                            <Search size={48} />
                            <h3>No updates found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    )}
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

export default NewsUpdates;