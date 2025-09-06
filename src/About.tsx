import React, { useEffect, useState } from 'react';
import {
    Home,
    MapPin,
    BarChart3,
    Settings,
    Bell,
    X,
    Users,
    Target,
    Award,
    Shield,
    Globe,
    Brain,
    Network,
    AlertTriangle
} from 'lucide-react';
import './About.css';

const About: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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

    const handleNavigation = (page: string) => {
        setSidebarOpen(false);
        console.log(`Navigating to ${page}`);
        // Navigation would be handled by parent component or router
    };

    const teamMembers = [
        {
            name: 'Vince Anjo Villar',
            role: 'Project Lead',
            specialty: 'System Architecture & Team Leadership',
            icon: <Users size={20} />
        },
        {
            name: 'Noel Zyrence Saludo',
            role: 'IoT Engineer',
            specialty: 'Hardware Integration & Sensor Networks',
            icon: <Network size={20} />
        },
        {
            name: 'Albert Soriano Jr',
            role: 'Mobile Developer',
            specialty: 'iOS & Android App Development',
            icon: <Shield size={20} />
        },
        {
            name: 'Aila Roshiele Donayre',
            role: 'AI Specialist',
            specialty: 'Machine Learning & Risk Prediction',
            icon: <Brain size={20} />
        },
        {
            name: 'Jan Mayen Mallen',
            role: 'UX Designer',
            specialty: 'User Experience & Interface Design',
            icon: <Target size={20} />
        },
        {
            name: 'Edricka Mae Paulos',
            role: 'Graphics & Ads Specialist',
            specialty: 'Visual Design & Marketing Campaigns',
            icon: <Award size={20} />
        }
    ];

    const Sidebar: React.FC = () => (
        <div className={`about-sidebar ${isMobile ? 'mobile' : 'desktop'} ${isMobile && sidebarOpen ? 'open' : ''}`}>
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
        <div className="about-page">
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
                                <div>
                                    <h1 className="page-title">About CIVILIAN</h1>
                                    <p className="page-subtitle">
                                        Smart Urban Disaster Resilience Platform
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <section className="hero-section">
                        <div className="hero-content">
                            <div className="hero-visual">
                                <img
                                    src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756217560/CivilianIoT_lsauwh.png"
                                    alt="CIVILIAN IoT Device"
                                    className="hero-image"
                                />
                            </div>
                            <div className="hero-text">
                                <h2 className="hero-title">About The Platform</h2>
                                <p className="hero-description">
                                    CIVILIAN is a comprehensive smart urban disaster resilience platform that acts as
                                    a virtual brain for cities. Our system collects environmental, structural, and
                                    behavioral data through IoT sensors, analyzes risks with AI, and provides real-time
                                    guidance through mobile apps and dashboards.
                                </p>
                                <p className="hero-description">
                                    The platform supports both governments and citizens before, during, and after
                                    disasters using a self-adaptive mesh network that works even during blackouts
                                    or network failures.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Mission & Vision Section */}
                    <section className="mission-vision-section">
                        <div className="mission-vision-grid">
                            <div className="mission-card">
                                <div className="card-icon">
                                    <Target size={32} />
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">Our Mission</h3>
                                    <p className="card-description">
                                        To democratize disaster resilience technology and empower cities to become smarter,
                                        safer, and more self-reliant in crisis events through innovative IoT solutions.
                                    </p>
                                </div>
                            </div>

                            <div className="vision-card">
                                <div className="card-icon">
                                    <Globe size={32} />
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">Impact Goals</h3>
                                    <p className="card-description">
                                        Prevent loss of life and infrastructure damage • Accelerate disaster recovery
                                        • Enable real-time emergency coordination • Build resilient smart communities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Core Features Section */}
                    <section className="features-section">
                        <div className="section-header">
                            <h2 className="section-title">Core Platform Features</h2>
                            <p className="section-subtitle">Advanced technology for comprehensive disaster resilience</p>
                        </div>

                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <Network size={40} />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">IoT Mesh Disaster Grid</h3>
                                    <p className="feature-description">
                                        Self-adaptive mesh network with structural health monitoring, flood detection,
                                        and emergency resource routing that works during network failures.
                                    </p>
                                </div>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <Brain size={40} />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">AI Risk Forecasting</h3>
                                    <p className="feature-description">
                                        Advanced artificial intelligence analyzes environmental data to predict disasters,
                                        generate evacuation routes, and coordinate emergency responses.
                                    </p>
                                </div>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <AlertTriangle size={40} />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">Real-time Emergency Alerts</h3>
                                    <p className="feature-description">
                                        Decentralized alert system delivers critical information, evacuation plans,
                                        and safety updates directly to citizens and emergency responders.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Team Section */}
                    <section className="team-section">
                        <div className="section-header">
                            <h2 className="section-title">Meet the Team</h2>
                            <p className="section-subtitle">NEXT CS Innovation Team</p>
                        </div>

                        <div className="team-intro">
                            <div className="team-photo">
                                <img
                                    src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756346552/IMG_4708_ksg7sb.jpg"
                                    alt="CIVILIAN Development Team"
                                    className="team-image"
                                />
                            </div>
                            <div className="team-description">
                                <p>
                                    Our multidisciplinary team combines expertise in IoT development, artificial intelligence,
                                    mobile app development, and disaster management. We're committed to building innovative
                                    solutions that protect communities and save lives through smart technology.
                                </p>
                            </div>
                        </div>

                        <div className="team-members-grid">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="member-card">
                                    <div className="member-icon">
                                        {member.icon}
                                    </div>
                                    <div className="member-info">
                                        <h4 className="member-name">{member.name}</h4>
                                        <p className="member-role">{member.role}</p>
                                        <span className="member-specialty">{member.specialty}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Research Foundation Section */}
                    <section className="research-section">
                        <div className="section-header">
                            <h2 className="section-title">Research Foundation</h2>
                            <p className="section-subtitle">Scientific evidence supporting smart city disaster resilience initiatives</p>
                        </div>

                        <div className="featured-research">
                            <div className="research-badge">FEATURED RESEARCH</div>
                            <h3 className="research-title">Smart cities and disaster risk reduction in South Korea by 2022: The case of Daegu</h3>
                            <p className="research-summary">
                                This comprehensive study examines how Daegu Metropolitan City implements smart city technologies
                                for disaster risk reduction, achieving up to 20% reduction in property damage and casualties.
                                The research demonstrates the effectiveness of integrated IoT sensor networks, data hubs,
                                and AI-driven platforms in managing flood, earthquake, and fire disasters.
                            </p>
                            <div className="research-source">
                                <span>Source: ScienceDirect - Heliyon Journal</span>
                                <a
                                    href="https://www.sciencedirect.com/science/article/pii/S2405844023060024"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="research-link"
                                >
                                    Read Full Study →
                                </a>
                            </div>
                        </div>
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

export default About;