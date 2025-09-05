// HelpCenter.tsx
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
    Play,
    ChevronRight,
    AlertTriangle,
    Smartphone,
    Navigation,
    Shield,
    Plus,
    HelpCircle
} from 'lucide-react';
import './HelpCenters.css';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    isOpen: boolean;
}

const HelpCenter: React.FC = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [faqItems, setFaqItems] = useState<FAQItem[]>([
        {
            id: 1,
            question: "How do I receive emergency alerts?",
            answer: "Emergency alerts are automatically sent to your device when you have location services enabled and are in an affected area. You can customize alert preferences in the Settings section.",
            isOpen: false
        },
        {
            id: 2,
            question: "What should I do during an evacuation alert?",
            answer: "Follow evacuation instructions immediately. Use the app's evacuation center locator to find the nearest safe facility. Keep your emergency kit ready and stay tuned for updates.",
            isOpen: false
        },
        {
            id: 3,
            question: "How accurate is the real-time monitoring data?",
            answer: "Our monitoring data comes from verified government sensors and is updated every few minutes. However, conditions can change rapidly during emergencies, so always follow official instructions.",
            isOpen: false
        },
        {
            id: 4,
            question: "Can I use the app offline?",
            answer: "Basic features like saved maps and emergency contacts work offline. However, real-time updates and alerts require an internet connection.",
            isOpen: false
        },
        {
            id: 5,
            question: "How do I report an emergency situation?",
            answer: "Use the emergency report feature on the main dashboard. For immediate life-threatening situations, always call emergency services directly first.",
            isOpen: false
        }
    ]);

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
            default:
                break;
        }
    };

    const toggleFAQ = (id: number) => {
        setFaqItems(items => 
            items.map(item => 
                item.id === id 
                    ? { ...item, isOpen: !item.isOpen }
                    : { ...item, isOpen: false }
            )
        );
    };

    const handleTutorialClick = (tutorialType: string) => {
        console.log(`Opening tutorial: ${tutorialType}`);
        // Here you would navigate to specific tutorial pages or open tutorial modals
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
        <div className="help-page">
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
                            <h1 className="page-title">Help Center</h1>
                            <p className="page-subtitle">Learn how to use CIVILIAN effectively</p>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="search-section">
                        <div className="search-container">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search help topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    {/* Quick Start Section */}
                    <div className="quick-start-section">
                        <h2 className="section-title">Quick Start</h2>
                        <div className="quick-start-card" onClick={() => handleTutorialClick('getting-started')}>
                            <div className="quick-start-content">
                                <button className="play-button">
                                    <Play size={20} />
                                </button>
                                <div className="quick-start-info">
                                    <h3 className="quick-start-title">Getting started guide</h3>
                                    <p className="quick-start-description">2 min tutorial • Basic app navigation</p>
                                </div>
                                <ChevronRight size={20} className="quick-start-arrow" />
                            </div>
                        </div>
                    </div>

                    {/* Tutorial Categories */}
                    <div className="tutorial-section">
                        <h2 className="section-title">Tutorial</h2>
                        <div className="tutorial-grid">
                            <div 
                                className="tutorial-card emergency-card" 
                                onClick={() => handleTutorialClick('emergency-response')}
                            >
                                <div className="tutorial-header">
                                    <div className="tutorial-icon">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <h3 className="tutorial-title">Emergency Response</h3>
                                </div>
                                <div className="tutorial-content">
                                    <ul className="tutorial-features">
                                        <li>Alert notifications</li>
                                        <li>Emergency contacts</li>
                                        <li>Evacuation routes</li>
                                    </ul>
                                </div>
                            </div>

                            <div 
                                className="tutorial-card monitoring-card"
                                onClick={() => handleTutorialClick('iot-monitoring')}
                            >
                                <div className="tutorial-header">
                                    <div className="tutorial-icon">
                                        <Smartphone size={24} />
                                    </div>
                                    <h3 className="tutorial-title">IoT Monitoring</h3>
                                </div>
                                <div className="tutorial-content">
                                    <ul className="tutorial-features">
                                        <li>Sensor networks</li>
                                        <li>Real-time data</li>
                                        <li>Status indicators</li>
                                    </ul>
                                </div>
                            </div>

                            <div 
                                className="tutorial-card navigation-card"
                                onClick={() => handleTutorialClick('map-navigation')}
                            >
                                <div className="tutorial-header">
                                    <div className="tutorial-icon">
                                        <Navigation size={24} />
                                    </div>
                                    <h3 className="tutorial-title">Map & Navigation</h3>
                                </div>
                                <div className="tutorial-content">
                                    <ul className="tutorial-features">
                                        <li>Safe zones</li>
                                        <li>Route planning</li>
                                        <li>Location sharing</li>
                                    </ul>
                                </div>
                            </div>

                            <div 
                                className="tutorial-card settings-card"
                                onClick={() => handleTutorialClick('settings-privacy')}
                            >
                                <div className="tutorial-header">
                                    <div className="tutorial-icon">
                                        <Settings size={24} />
                                    </div>
                                    <h3 className="tutorial-title">Settings & Privacy</h3>
                                </div>
                                <div className="tutorial-content">
                                    <ul className="tutorial-features">
                                        <li>Notifications</li>
                                        <li>Location settings</li>
                                        <li>Data privacy</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="faq-section">
                        <h2 className="section-title">FAQs</h2>
                        <div className="faq-list">
                            {faqItems.map(item => (
                                <div key={item.id} className={`faq-item ${item.isOpen ? 'open' : ''}`}>
                                    <button
                                        className="faq-question"
                                        onClick={() => toggleFAQ(item.id)}
                                    >
                                        <span>{item.question}</span>
                                        <Plus size={16} className="faq-icon" />
                                    </button>
                                    <div className="faq-answer">
                                        <div className="faq-answer-content">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        <button className="nav-button active">
                            <HelpCircle size={20} />
                            <span>Help</span>
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

export default HelpCenter;