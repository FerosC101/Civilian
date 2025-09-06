//MenuPage.tsx
import {
  AlertCircle,
  BarChart3,
  Bell,
  DollarSign,
  Globe,
  HelpCircle,
  Home,
  Info,
  MapPin,
  Newspaper,
  Phone,
  Route,
  Settings,
  X,
  ChevronDown
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
        navigate('/dashboard');
        break;
      case 'settings':
        navigate('/admin');
        break;
      case 'cityoverview':
        navigate('/evacuation');
        break;
      case 'donations':
        navigate('/donations');
        break;
      case 'contacts':
        navigate('/contacts');
        break;
      case 'about':
        navigate('/about');
        break;
      default:
        break;
    }
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'alert':
        // Handle alert action
        console.log('Alert triggered');
        break;
      case 'route':
        // Handle route action
        console.log('Route triggered');
        break;
      case 'help':
        // Handle help action
        console.log('Help triggered');
        break;
      default:
        break;
    }
  };

  const handleLogoClick = () => {
    // Already on menu page, could show a dropdown or just stay
    console.log('Already on menu page');
  };

  const menuItems = [
    {
      id: 'about',
      title: 'About CIVILIAN',
      subtitle: 'App info, mission & support',
      icon: Info,
      color: 'blue',
      action: () => handleNavigation('about')
    },
    {
      id: 'emergency',
      title: 'Emergency Contacts',
      subtitle: 'Quick dial safety services',
      icon: Phone,
      color: 'red',
      action: () => handleNavigation('contacts')
    },
    {
      id: 'help',
      title: 'Helps & Tutorials',
      subtitle: 'Guides & troubleshooting',
      icon: HelpCircle,
      color: 'purple',
      action: () => console.log('Help clicked')
    },
    {
      id: 'news',
      title: 'News & Updates',
      subtitle: 'City alerts & announcements',
      icon: Newspaper,
      color: 'orange',
      action: () => console.log('News clicked')
    },
    {
      id: 'cityoverview',
      title: 'City Overview',
      subtitle: 'Citywide safety metrics',
      icon: Globe,
      color: 'green',
      action: () => handleNavigation('cityoverview')
    },
    {
      id: 'donations',
      title: 'Donations',
      subtitle: 'Donation Organizations',
      icon: DollarSign,
      color: 'blue',
      action: () => handleNavigation('donations')
    }
  ];

  const quickActions = [
    {
      id: 'alert',
      label: 'Alert',
      icon: AlertCircle,
      color: 'red',
      action: () => handleMenuAction('alert')
    },
    {
      id: 'route',
      label: 'Route',
      icon: Route,
      color: 'blue',
      action: () => handleMenuAction('route')
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      color: 'green',
      action: () => handleMenuAction('help')
    }
  ];

  const Sidebar: React.FC = () => (
      <div className={`menu-sidebar ${isMobile ? 'mobile' : 'desktop'} ${isMobile && sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button onClick={handleLogoClick} className="logo-container clickable-logo">
            <img
                src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                alt="CIVILIAN"
                className="logo"
            />
            <span className="logo-text">CIVILIAN</span>
            <ChevronDown size={16} className="logo-arrow" />
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
              <Home size={18} />
              <span className="nav-label">Dashboard</span>
            </button>
            <button onClick={() => handleNavigation('gis')} className="nav-item">
              <MapPin size={18} />
              <span className="nav-label">Map</span>
            </button>
            <button onClick={() => handleNavigation('analytics')} className="nav-item">
              <BarChart3 size={18} />
              <span className="nav-label">Analytics</span>
            </button>
            <button onClick={() => handleNavigation('settings')} className="nav-item">
              <Settings size={18} />
              <span className="nav-label">Settings</span>
            </button>
          </div>
        </nav>
      </div>
  );

  return (
      <div className="menu-page">
        <Sidebar />

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
            <div
                className="mobile-overlay"
                onClick={() => setSidebarOpen(false)}
            />
        )}

        <main className="menu-main">
          <header className="menu-topbar">
            <div className="top-left">
              {isMobile && (
                  <button
                      onClick={() => setSidebarOpen(true)}
                      className="mobile-logo-button clickable-mobile-logo"
                  >
                    <img
                        src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                        alt="CIVILIAN"
                        className="mobile-logo"
                    />
                    <span className="mobile-logo-text">CIVILIAN</span>
                    <ChevronDown size={12} className="mobile-logo-arrow" />
                  </button>
              )}
              <div className="live-indicator">
                <span className="live-dot" />
                <span className="live-text">LIVE</span>
              </div>
            </div>

            <div className="top-right">
              <div className="header-alerts">
                <Bell size={14} />
                <span className="alerts-count">0</span>
              </div>
              <div className="clock">
                {isMobile ? currentTime.slice(0, 5) : currentTime}
              </div>
            </div>
          </header>

          <div className="menu-content">
            {/* Menu Items Grid */}
            <section className="menu-items-section">
              <div className="menu-items-grid">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                      <button
                          key={item.id}
                          onClick={item.action}
                          className={`menu-item ${item.color}`}
                      >
                        <div className="menu-item-icon">
                          <IconComponent size={24} />
                        </div>
                        <div className="menu-item-content">
                          <div className="menu-item-title">{item.title}</div>
                          <div className="menu-item-subtitle">{item.subtitle}</div>
                        </div>
                      </button>
                  );
                })}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions-section">
              <div className="quick-actions-header">
                <AlertCircle size={18} />
                <span>Quick Actions</span>
              </div>
              <div className="quick-actions-grid">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                      <button
                          key={action.id}
                          onClick={action.action}
                          className={`quick-action-btn ${action.color}`}
                      >
                        <IconComponent size={20} />
                        <span>{action.label}</span>
                      </button>
                  );
                })}
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
                  <span>Stats</span>
                </button>
                <button onClick={() => handleNavigation('settings')} className="nav-button">
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </div>
          )}
        </main>
      </div>
  );
};

export default Menu;