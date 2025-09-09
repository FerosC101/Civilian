import React, {useEffect, useRef, useState} from 'react';
import {
    AlertTriangle,
    BarChart3,
    Bell,
    ChevronDown,
    ChevronUp,
    CloudRain,
    Filter,
    Flame,
    Home,
    MapPin,
    Navigation,
    Settings,
    X,
    Zap,
    Building2
} from 'lucide-react';
import {requestNotificationPermission, showNotification, useAlerts} from './services/alerts/userAlerts';
import './GIS_Page.css';
import {useNavigate} from "react-router-dom";

const GISPage: React.FC = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
    const [alertsExpanded, setAlertsExpanded] = useState<boolean>(false);
    const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

    // Unified evacuation state to prevent modal flashing
    const [evacuationState, setEvacuationState] = useState({
        isModalOpen: false,
        isProcessing: false,
        isEvacuationMode: false,
        evacuationDetails: null
    });

    const [activeFilters, setActiveFilters] = useState({
        earthquake: true,
        flood: true,
        fire: true,
        weather: true
    });
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    // @ts-ignore
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
    // @ts-ignore
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    // @ts-ignore
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    // @ts-ignore
    const [alertMarkers, setAlertMarkers] = useState<google.maps.Marker[]>([]);
    // @ts-ignore
    const [evacuationMarkers, setEvacuationMarkers] = useState<google.maps.Marker[]>([]);
    const mapRef = useRef<HTMLDivElement>(null);

    // Mock evacuation centers data for Batangas City
    const evacuationCenters = [
        {
            id: 'ec1',
            name: 'Batangas City Sports Complex',
            address: 'P. Burgos Street, Batangas City',
            capacity: 800,
            lat: 13.7565,
            lng: 121.0583,
            facilities: ['Medical Station', 'Food Distribution', 'Restrooms', 'Security'],
            contact: '(043) 723-6300'
        },
        {
            id: 'ec2',
            name: 'Batangas State University Gymnasium',
            address: 'Rizal Avenue Extension, Batangas City',
            capacity: 1000,
            lat: 13.7542,
            lng: 121.0584,
            facilities: ['Medical Station', 'Food Distribution', 'Sleeping Area', 'Restrooms'],
            contact: '(043) 425-0139'
        },
        {
            id: 'ec3',
            name: 'Batangas City Hall Covered Court',
            address: 'Barangay 3, Batangas City',
            capacity: 600,
            lat: 13.7567,
            lng: 121.0601,
            facilities: ['Medical Station', 'Food Distribution', 'Restrooms'],
            contact: '(043) 723-2004'
        },
        {
            id: 'ec4',
            name: 'Santa Clara Elementary School',
            address: 'Barangay Santa Clara, Batangas City',
            capacity: 400,
            lat: 13.7445,
            lng: 121.0421,
            facilities: ['Medical Station', 'Food Distribution', 'Restrooms', 'Classrooms'],
            contact: '(043) 723-1234'
        },
        {
            id: 'ec5',
            name: 'Batangas Port Terminal Covered Area',
            address: 'Batangas Port, Barangay Santa Clara',
            capacity: 1200,
            lat: 13.7398,
            lng: 121.0334,
            facilities: ['Medical Station', 'Food Distribution', 'Restrooms', 'Large Covered Area'],
            contact: '(043) 723-8888'
        },
        {
            id: 'ec6',
            name: 'Pallocan West Elementary School',
            address: 'Barangay Pallocan West, Batangas City',
            capacity: 350,
            lat: 13.7623,
            lng: 121.0712,
            facilities: ['Medical Station', 'Food Distribution', 'Restrooms'],
            contact: '(043) 723-5567'
        }
    ];

    // Get real-time alerts
    const { alerts, isLoading: alertsLoading, error: alertsError } = useAlerts();

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
            if (!newIsMobile) {
                setFiltersExpanded(false);
                setAlertsExpanded(false);
            }
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
                    setUserLocation({ lat: 13.7565, lng: 121.0583 });
                }
            );
        } else {
            setUserLocation({ lat: 13.7565, lng: 121.0583 });
        }
    }, []);

    // Request notification permission on mount
    useEffect(() => {
        const setupNotifications = async () => {
            const permission = await requestNotificationPermission();
            setNotificationsEnabled(permission);
        };
        setupNotifications();
    }, []);

    // Show notifications for new alerts (without coordinates)
    useEffect(() => {
        if (alerts.length > 0 && notificationsEnabled) {
            const latestAlert = alerts[0];
            const alertTime = new Date(latestAlert.timestamp).getTime();
            const now = Date.now();

            if (now - alertTime < 30000) {
                const privacySafeAlert = {
                    ...latestAlert,
                    message: latestAlert.message.replace(/\d+\.\d+,\s*\d+\.\d+/g, '[Location]')
                };
                showNotification(privacySafeAlert);
            }
        }
    }, [alerts, notificationsEnabled]);

    // Initialize Google Maps
    useEffect(() => {
        const initMap = () => {
            if (mapRef.current && !mapInstance && userLocation) {
                // @ts-ignore
                const map = new google.maps.Map(mapRef.current, {
                    center: userLocation,
                    zoom: 13,
                    mapTypeId: 'terrain',
                    styles: [
                        {
                            "elementType": "geometry",
                            "stylers": [{ "color": "#1f2937" }]
                        },
                        {
                            "elementType": "labels.text.stroke",
                            "stylers": [{ "color": "#1f2937" }]
                        },
                        {
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#8ec3b9" }]
                        },
                        {
                            "featureType": "administrative.locality",
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#d59563" }]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#d59563" }]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#263c3f" }]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#6b9a76" }]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#38414e" }]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry.stroke",
                            "stylers": [{ "color": "#212a37" }]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#9ca5b3" }]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#746855" }]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.stroke",
                            "stylers": [{ "color": "#1f2937" }]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#f3d19c" }]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#2f3948" }]
                        },
                        {
                            "featureType": "transit.station",
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#d59563" }]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#17263c" }]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#515c6d" }]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels.text.stroke",
                            "stylers": [{ "color": "#17263c" }]
                        }
                    ]
                });

                // @ts-ignore
                const directionsServiceInstance = new google.maps.DirectionsService();
                // @ts-ignore
                const directionsRendererInstance = new google.maps.DirectionsRenderer({
                    suppressMarkers: false,
                    polylineOptions: {
                        strokeColor: '#3b82f6',
                        strokeWeight: 4,
                        strokeOpacity: 0.8
                    }
                });

                directionsRendererInstance.setMap(map);
                setDirectionsService(directionsServiceInstance);
                setDirectionsRenderer(directionsRendererInstance);
                setMapInstance(map);
                setMapLoaded(true);

                // Add user location marker
                // @ts-ignore
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Your Location',
                    icon: {
                        // @ts-ignore
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#3b82f6',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3,
                        scale: 8,
                    }
                });
            }
        };

        // @ts-ignore
        if (window.google && window.google.maps && userLocation) {
            initMap();
        } else if (userLocation) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBMoAvZUPltUYaThhyQSmpFnufPrWpE7kg&callback=initMap`;
            script.async = true;
            script.defer = true;
            // @ts-ignore
            window.initMap = initMap;
            document.head.appendChild(script);
        }
    }, [mapInstance, userLocation]);

    // Add evacuation center markers only when in evacuation mode
    useEffect(() => {
        if (!mapInstance) return;

        // Clear existing evacuation markers
        evacuationMarkers.forEach(marker => marker.setMap(null));

        if (!evacuationState.isEvacuationMode) {
            setEvacuationMarkers([]);
            return;
        }

        // Create evacuation center markers
        const newEvacuationMarkers = evacuationCenters.map(center => {
            const position = { lat: center.lat, lng: center.lng };

            // @ts-ignore
            const marker = new google.maps.Marker({
                position,
                map: mapInstance,
                icon: {
                    // @ts-ignore
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    fillColor: '#10b981',
                    fillOpacity: 0.9,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 8,
                    rotation: 0,
                    // @ts-ignore
                    anchor: new google.maps.Point(0, 5)
                },
                title: `Evacuation Center: ${center.name}`,
            });

            const infoContent = `
                <div style="color: #1f2937; font-family: 'Inter', sans-serif; min-width: 280px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
                        <div style="width: 16px; height: 16px; border-radius: 4px; background: #10b981;"></div>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                            ${center.name}
                        </h3>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="background: #10b98120; color: #10b981; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            CAPACITY: ${center.capacity}
                        </span>
                    </div>
                    <p style="margin: 8px 0; font-size: 14px; line-height: 1.4; color: #374151;">
                        ${center.address}
                    </p>
                    <div style="margin: 8px 0; font-size: 13px; color: #374151;">
                        <strong>Facilities:</strong> ${center.facilities.join(', ')}
                    </div>
                    <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                        <div><strong>Contact:</strong> ${center.contact}</div>
                    </div>
                </div>
            `;

            // @ts-ignore
            const infoWindow = new google.maps.InfoWindow({
                content: infoContent,
                maxWidth: 350
            });

            marker.addListener('click', () => {
                infoWindow.open(mapInstance, marker);
            });

            return marker;
        });

        setEvacuationMarkers(newEvacuationMarkers);
    }, [mapInstance, evacuationState.isEvacuationMode]);

    // Update alert markers when alerts change
    useEffect(() => {
        if (!mapInstance) return;

        // Clear existing markers
        alertMarkers.forEach(marker => marker.setMap(null));

        // Filter active alerts
        const activeAlerts = alerts.filter(alert =>
            activeFilters[alert.type as keyof typeof activeFilters] &&
            !dismissedAlerts.has(alert.id as string)
        );

        // Create new markers
        const newMarkers = activeAlerts.map(alert => {
            const position = { lat: alert.location.lat, lng: alert.location.lng };

            // Create custom marker icon based on alert type and severity
            const markerIcon = {
                // @ts-ignore
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: getSeverityColor(alert.severity),
                fillOpacity: 0.8,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: alert.severity === 'critical' ? 12 : alert.severity === 'high' ? 10 : 8,
            };
            // @ts-ignore
            const marker = new google.maps.Marker({
                position,
                map: mapInstance,
                icon: markerIcon,
                title: `${alert.type.toUpperCase()} - ${alert.severity.toUpperCase()}`,
                // @ts-ignore
                animation: alert.severity === 'critical' ? google.maps.Animation.BOUNCE : undefined,
            });

            // Create info window (without coordinates for privacy)
            // language=HTML
            const infoContent = `
                <div style="color: #1f2937; font-family: 'Inter', sans-serif; min-width: 250px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
                        <div style="width: 16px; height: 16px; border-radius: 50%; background: ${getSeverityColor(alert.severity)};"></div>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                            ${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                        </h3>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="background: ${getSeverityColor(alert.severity)}20; color: ${getSeverityColor(alert.severity)}; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            ${alert.severity.toUpperCase()}
                        </span>
                    </div>
                    <p style="margin: 8px 0; font-size: 14px; line-height: 1.4; color: #374151;">
                        ${alert.message}
                    </p>
                    <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                        <div><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</div>
                        ${alert.affectedAreas ? `<div><strong>Areas:</strong> ${alert.affectedAreas.join(', ')}</div>` : ''}
                    </div>
                </div>
            `;
            // @ts-ignore
            const infoWindow = new google.maps.InfoWindow({
                content: infoContent,
                maxWidth: 300
            });

            marker.addListener('click', () => {
                infoWindow.open(mapInstance, marker);
            });

            return marker;
        });

        setAlertMarkers(newMarkers);
    }, [alerts, activeFilters, dismissedAlerts, mapInstance]);

    const toggleFilter = (filterType: keyof typeof activeFilters) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterType]: !prev[filterType]
        }));
    };

    const dismissAlert = (alertId: string | undefined) => {
        // @ts-ignore
        setDismissedAlerts(prev => new Set([...prev, alertId]));
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'earthquake': return Zap;
            case 'fire': return Flame;
            case 'flood': return AlertTriangle;
            case 'weather': return CloudRain;
            default: return AlertTriangle;
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'earthquake': return '#8B5CF6';
            case 'fire': return '#EF4444';
            case 'flood': return '#3B82F6';
            case 'weather': return '#10B981';
            default: return '#6B7280';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return '#DC2626';
            case 'high': return '#EA580C';
            case 'medium': return '#D97706';
            case 'low': return '#65A30D';
            default: return '#6B7280';
        }
    };

    const findNearestEvacuationCenter = (userLat: number, userLng: number) => {
        let nearestCenter = evacuationCenters[0];
        let shortestDistance = calculateDistance(userLat, userLng, nearestCenter.lat, nearestCenter.lng);

        evacuationCenters.forEach(center => {
            const distance = calculateDistance(userLat, userLng, center.lat, center.lng);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestCenter = center;
            }
        });

        return nearestCenter;
    };

    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Updated evacuation handler with unified state management
    const handleEvacuation = () => {
        if (evacuationState.isProcessing || evacuationState.isModalOpen) {
            return;
        }

        if (!userLocation || !directionsService || !directionsRenderer) {
            alert('Location services are not available. Please enable location access.');
            return;
        }

        setEvacuationState(prev => ({
            ...prev,
            isProcessing: true,
            isEvacuationMode: true
        }));

        const nearestCenter = findNearestEvacuationCenter(userLocation.lat, userLocation.lng);

        const request = {
            origin: userLocation,
            destination: { lat: nearestCenter.lat, lng: nearestCenter.lng },
            // @ts-ignore
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, (result: any, status: any) => {
            // @ts-ignore
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);

                // @ts-ignore
                setEvacuationState(prev => ({
                    ...prev,
                    isProcessing: false,
                    isModalOpen: true,
                    evacuationDetails: {
                        center: nearestCenter,
                        route: result
                    }
                }));
            } else {
                alert('Could not calculate evacuation route. Please try again or contact emergency services.');
                setEvacuationState(prev => ({
                    ...prev,
                    isProcessing: false,
                    isModalOpen: false,
                    isEvacuationMode: false,
                    evacuationDetails: null
                }));
            }
        });
    };

    const closeEvacuationModal = () => {
        setEvacuationState(prev => ({
            ...prev,
            isModalOpen: false
        }));
    };

    const handleExitEvacuation = () => {
        if (directionsRenderer) {
            directionsRenderer.setDirections({routes: []});
        }
        setEvacuationState({
            isModalOpen: false,
            isProcessing: false,
            isEvacuationMode: false,
            evacuationDetails: null
        });
    };

    const handleNavigation = (page: string) => {
        setSidebarOpen(false);
        switch (page) {
            case 'home':
                navigate('/home');
                break;
            case 'dashboard':
                navigate('/dashboard');
                break;
            case 'settings':
                console.log('Navigate to settings');
                break;
            case 'menu':
                navigate('/menu');
                break;
            default:
                break;
        }
    };

    const handleLogoClick = () => {
        navigate('/menu');
    };

    const filteredAlerts = alerts.filter(alert =>
        activeFilters[alert.type as keyof typeof activeFilters] &&
        !dismissedAlerts.has(alert.id as string)
    );

    const hasActiveAlerts = filteredAlerts.length > 0;

    const FilterButton: React.FC<{
        type: keyof typeof activeFilters;
        icon: React.ComponentType<{ size: number }>;
        label: string;
        color: string;
        active: boolean;
        count: number;
    }> = ({ type, icon: Icon, label, color, active, count }) => {
        const getResponsiveLabel = () => {
            if (window.innerWidth < 360) {
                return label.slice(0, 4);
            } else if (window.innerWidth < 480) {
                return label.includes(' ') ? label.split(' ')[0] : label.slice(0, 6);
            } else if (isMobile) {
                return label.split(' ')[0];
            }
            return label;
        };

        return (
            <button
                onClick={() => toggleFilter(type)}
                className={`filter-button ${active ? `active ${color}` : 'inactive'}`}
            >
                <Icon size={14} />
                <span className="filter-label">{getResponsiveLabel()}</span>
                {count > 0 && <span className="filter-count">{count}</span>}
            </button>
        );
    };

    const Sidebar: React.FC = () => (
        <div className={`sidebar ${isMobile ? 'mobile' : 'desktop'} ${isMobile && sidebarOpen ? 'open' : ''}`}>
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
                    <a onClick={() => navigate("/home")} className="nav-item">
                        <Home size={20} />
                        <span className="nav-label">Dashboard</span>
                    </a>
                    <a onClick={() => navigate("/gis")} className="nav-item active">
                        <MapPin size={20} />
                        <span className="nav-label">Map</span>
                    </a>
                    <a onClick={() => navigate("/dashboard")} className="nav-item">
                        <BarChart3 size={20} />
                        <span className="nav-label">Analytics</span>
                    </a>
                    <a onClick={() => navigate("/settings")} className="nav-item">
                        <Settings size={20} />
                        <span className="nav-label">Settings</span>
                    </a>
                </div>
            </nav>
        </div>
    );

    // Fixed Evacuation Modal with proper scrolling
    const EvacuationModal: React.FC = () => {
        // Body scroll control effect
        useEffect(() => {
            if (evacuationState.isModalOpen && evacuationState.evacuationDetails) {
                const originalStyle = window.getComputedStyle(document.body);
                const originalOverflow = originalStyle.overflow;
                const originalPosition = originalStyle.position;
                const originalWidth = originalStyle.width;
                const originalHeight = originalStyle.height;

                document.body.classList.add('modal-open');
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.height = '100%';
                document.documentElement.style.overflow = 'hidden';

                const gisPage = document.querySelector('.gis-page') as HTMLElement;
                if (gisPage) {
                    gisPage.style.overflow = 'hidden';
                }

                return () => {
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = originalOverflow;
                    document.body.style.position = originalPosition;
                    document.body.style.width = originalWidth;
                    document.body.style.height = originalHeight;
                    document.documentElement.style.overflow = 'auto';

                    if (gisPage) {
                        gisPage.style.overflow = '';
                    }
                };
            }
        }, [evacuationState.isModalOpen, evacuationState.evacuationDetails]);

        if (!evacuationState.isModalOpen || !evacuationState.evacuationDetails) {
            return null;
        }

        const handleOverlayClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.target === e.currentTarget) {
                closeEvacuationModal();
            }
        };

        const handleContentClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleTouchMove = (e: React.TouchEvent) => {
            e.stopPropagation();
        };

        const handleTouchStart = (e: React.TouchEvent) => {
            e.stopPropagation();
        };

        const handleWheel = (e: React.WheelEvent) => {
            e.stopPropagation();
        };

        // @ts-ignore
        const { capacity, name, contact, facilities, address } = evacuationState.evacuationDetails.center;

        return (
            <div
                className="evacuation-modal-overlay"
                onClick={handleOverlayClick}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStart}
                onWheel={handleWheel}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10000,
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    display: 'block',
                    height: '100vh',
                    overflowAnchor: 'none'
                }}
            >
                <div
                    className="evacuation-modal-wrapper"
                    style={{
                        minHeight: 'calc(100vh + 100px)',
                        paddingTop: '40px',
                        paddingBottom: '40px'
                    }}
                >
                    <div
                        className="evacuation-modal"
                        onClick={handleContentClick}
                        style={{
                            height: 'auto',
                            maxHeight: 'none',
                            overflow: 'visible'
                        }}
                    >
                        <div className="evacuation-modal-header">
                            <div className="evacuation-modal-icon">
                                <Building2 size={24} />
                            </div>
                            <h2>Evacuation Route Calculated</h2>
                            <button
                                onClick={closeEvacuationModal}
                                className="evacuation-modal-close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="evacuation-modal-content">
                            <div className="evacuation-center-info">
                                <h3>Nearest Evacuation Center</h3>
                                <div className="center-details">
                                    <h4>{name}</h4>
                                    <p><strong>Address:</strong> {address}</p>
                                    <p><strong>Capacity:</strong> {capacity} people</p>
                                    <p><strong>Contact:</strong> {contact}</p>
                                    <div className="facilities">
                                        <strong>Facilities:</strong>
                                        <div className="facility-tags">
                                            {facilities.map((facility: string, index: number) => (
                                                <span key={index} className="facility-tag">{facility}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="evacuation-modal-actions">
                            <button
                                onClick={closeEvacuationModal}
                                className="evacuation-modal-button understand"
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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

            {/* Evacuation Modal */}
            <EvacuationModal />

            {/* Main content */}
            <div className="main-content">
                {/* Header */}
                <header className="header">
                    {isMobile && (
                        <button
                            onClick={handleLogoClick}
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
                        <div className="live-dot" />
                        <span className="live-text">LIVE</span>
                    </div>

                    <div className="header-alerts">
                        <Bell size={14} />
                        <span className="alerts-count">{filteredAlerts.length}</span>
                        {!notificationsEnabled && !isMobile && (
                            <button
                                onClick={async () => {
                                    const permission = await requestNotificationPermission();
                                    setNotificationsEnabled(permission);
                                }}
                                className="enable-notifications-btn"
                            >
                                Enable Notifications
                            </button>
                        )}
                    </div>

                    <div className="clock">
                        {isMobile ? currentTime.slice(0, 5) : currentTime}
                    </div>
                </header>

                {/* Alert Status Messages */}
                {alertsError && !dismissedAlerts.has('error-alert') && (
                    <div className="alert-message error">
                        <div className="alert-message-content">
                            <div className="alert-message-icon">
                                <AlertTriangle size={16} />
                            </div>
                            <div className="alert-message-text">
                                <span className="alert-message-title">Connection Error</span>
                                <span className="alert-message-description">Unable to load real-time alerts. Please check your connection.</span>
                            </div>
                        </div>
                        <button
                            onClick={() => dismissAlert('error-alert')}
                            className="alert-message-close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {alertsLoading && !dismissedAlerts.has('loading-alert') && (
                    <div className="alert-message loading">
                        <div className="alert-message-content">
                            <div className="alert-message-icon">
                                <div className="loading-spinner-small"></div>
                            </div>
                            <div className="alert-message-text">
                                <span className="alert-message-title">Loading Alerts</span>
                                <span className="alert-message-description">Fetching real-time disaster alerts...</span>
                            </div>
                        </div>
                        <button
                            onClick={() => dismissAlert('loading-alert')}
                            className="alert-message-close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Evacuation Banner */}
                {(hasActiveAlerts || evacuationState.isEvacuationMode) && (
                    <div className="evacuation-banner">
                        <div className="evacuation-content">
                            <div className="evacuation-icon">
                                <Navigation size={20} />
                            </div>
                            <div className="evacuation-text">
                                <span className="evacuation-title">
                                    {evacuationState.isEvacuationMode ? 'Evacuation Mode Active' : 'Emergency Evacuation Available'}
                                </span>
                                <span className="evacuation-description">
                                    {evacuationState.isEvacuationMode
                                        ? 'Evacuation centers visible on map'
                                        : 'Get directions to the nearest evacuation center'
                                    }
                                </span>
                            </div>
                        </div>
                        {evacuationState.isEvacuationMode ? (
                            <button
                                onClick={handleExitEvacuation}
                                className="evacuation-button exit"
                                disabled={evacuationState.isProcessing}
                            >
                                <X size={16} />
                                <span>Exit Evacuation</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleEvacuation}
                                className="evacuation-button"
                                disabled={evacuationState.isProcessing || evacuationState.isModalOpen}
                            >
                                <Navigation size={16} />
                                <span>
                                    {evacuationState.isProcessing ? 'Calculating...' : 'Evacuate Now'}
                                </span>
                            </button>
                        )}
                    </div>
                )}

                {/* Mobile Alerts Toggle */}
                {isMobile && filteredAlerts.length > 0 && (
                    <div className="alerts-mobile-toggle">
                        <button
                            onClick={() => setAlertsExpanded(!alertsExpanded)}
                            className="alerts-toggle-button"
                        >
                            <span>
                                <AlertTriangle size={16} />
                                Active Alerts ({filteredAlerts.length})
                            </span>
                            {alertsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                )}

                {/* Mobile Active Alerts - Expandable */}
                {isMobile && alertsExpanded && filteredAlerts.length > 0 && (
                    <div className="alerts-mobile-expanded">
                        <div className="alerts-mobile-content">
                            {filteredAlerts.slice(0, 3).map((alert) => {
                                const Icon = getAlertIcon(alert.type);
                                return (
                                    <div
                                        key={alert.id}
                                        className="alert-card-mobile"
                                        style={{ borderLeftColor: getSeverityColor(alert.severity) }}
                                    >
                                        <div className="alert-card-mobile-header">
                                            <div className="alert-card-mobile-icon" style={{ color: getAlertColor(alert.type) }}>
                                                <Icon size={20} />
                                            </div>
                                            <div className="alert-card-mobile-info">
                                                <h4 className="alert-card-mobile-title">
                                                    {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert - {alert.severity.toUpperCase()}
                                                </h4>
                                                <span className="alert-card-mobile-time">
                                                    {new Date(alert.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => dismissAlert(alert.id)}
                                                className="alert-card-mobile-close"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <p className="alert-card-mobile-message">{alert.message}</p>
                                        {alert.affectedAreas && (
                                            <div className="alert-card-mobile-areas">
                                                <strong>Affected Areas:</strong> {alert.affectedAreas.slice(0, 2).join(', ')}{alert.affectedAreas.length > 2 && '...'}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {filteredAlerts.length > 3 && (
                                <div className="alerts-mobile-more">
                                    +{filteredAlerts.length - 3} more alerts
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Collapsible Filters for Mobile */}
                {isMobile && (
                    <div className="filters-mobile-toggle">
                        <button
                            onClick={() => setFiltersExpanded(!filtersExpanded)}
                            className="filters-toggle-button"
                        >
                            <span>
                                <Filter size={16} />
                                Filters ({Object.values(activeFilters).filter(Boolean).length}/4)
                            </span>
                            {filtersExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                )}

                {/* Filter controls and Map legend */}
                {(!isMobile || filtersExpanded) && (
                    <div className="filters-container">
                        <div className="filters-wrapper">
                            <div className="filters-section">
                                {!isMobile && (
                                    <div className="filters-label">
                                        <Filter size={16} />
                                        <span>Filters:</span>
                                    </div>
                                )}

                                <div className="filter-buttons">
                                    <FilterButton
                                        type="earthquake"
                                        // @ts-ignore
                                        icon={Zap}
                                        label="Earthquake"
                                        color="earthquake"
                                        active={activeFilters.earthquake}
                                        count={alerts.filter(a => a.type === 'earthquake' && !dismissedAlerts.has(a.id as string)).length}
                                    />

                                    <FilterButton
                                        type="flood"
                                        // @ts-ignore
                                        icon={AlertTriangle}
                                        label="Flood Warning"
                                        color="flood"
                                        active={activeFilters.flood}
                                        count={alerts.filter(a => a.type === 'flood' && !dismissedAlerts.has(a.id as string)).length}
                                    />

                                    <FilterButton
                                        type="fire"
                                        // @ts-ignore
                                        icon={Flame}
                                        label="Fire Warning"
                                        color="fire"
                                        active={activeFilters.fire}
                                        count={alerts.filter(a => a.type === 'fire' && !dismissedAlerts.has(a.id as string)).length}
                                    />

                                    <FilterButton
                                        type="weather"
                                        // @ts-ignore
                                        icon={CloudRain}
                                        label="Weather Alert"
                                        color="weather"
                                        active={activeFilters.weather}
                                        count={alerts.filter(a => a.type === 'weather' && !dismissedAlerts.has(a.id as string)).length}
                                    />
                                </div>
                            </div>

                            {/* Compact Legend - Desktop Only */}
                            {!isMobile && (
                                <div className="legend-section">
                                    <span className="legend-title">Legend:</span>
                                    <div className="legend-items">
                                        <div className="legend-item-compact">
                                            <Zap className="legend-icon earthquake" size={12} />
                                            <span>Earthquake</span>
                                        </div>
                                        <div className="legend-item-compact">
                                            <AlertTriangle className="legend-icon flood" size={12} />
                                            <span>Flood</span>
                                        </div>
                                        <div className="legend-item-compact">
                                            <Flame className="legend-icon fire" size={12} />
                                            <span>Fire</span>
                                        </div>
                                        <div className="legend-item-compact">
                                            <CloudRain className="legend-icon weather" size={12} />
                                            <span>Weather</span>
                                        </div>
                                        {evacuationState.isEvacuationMode && (
                                            <div className="legend-item-compact">
                                                <Building2 className="legend-icon evacuation" size={12} />
                                                <span>Evacuation Center</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Active Alerts Sidebar - Desktop Only */}
                {!isMobile && filteredAlerts.length > 0 && (
                    <div className="alerts-sidebar-desktop">
                        <div className="alerts-sidebar-header">
                            <div className="alerts-sidebar-title">
                                <AlertTriangle size={16} />
                                <span>Active Alerts ({filteredAlerts.length})</span>
                            </div>
                        </div>
                        <div className="alerts-sidebar-content">
                            {filteredAlerts.slice(0, 2).map((alert) => {
                                const Icon = getAlertIcon(alert.type);
                                return (
                                    <div
                                        key={alert.id}
                                        className="alert-card-desktop"
                                        style={{ borderLeftColor: getSeverityColor(alert.severity) }}
                                    >
                                        <div className="alert-card-desktop-header">
                                            <div className="alert-card-desktop-icon" style={{ color: getAlertColor(alert.type) }}>
                                                <Icon size={16} />
                                            </div>
                                            <div className="alert-card-desktop-info">
                                                <h4 className="alert-card-desktop-title">
                                                    {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} - {alert.severity.toUpperCase()}
                                                </h4>
                                                <span className="alert-card-desktop-time">
                                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => dismissAlert(alert.id)}
                                                className="alert-card-desktop-close"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <p className="alert-card-desktop-message">{alert.message}</p>
                                    </div>
                                );
                            })}
                            {filteredAlerts.length > 2 && (
                                <div className="alerts-desktop-more">
                                    +{filteredAlerts.length - 2} more alerts
                                </div>
                            )}
                        </div>
                    </div>
                )}

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
                                <div style={{marginBottom: '10px'}}>Loading map...</div>
                                <div style={{fontSize: '12px', color: '#9ca3af'}}>Batangas City</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile bottom navigation */}
                {isMobile && (
                    <div className="bottom-nav">
                        <button onClick={() => navigate('/home')} className="nav-button">
                            <Home size={18} />
                            <span className="nav-label">Dashboard</span>
                        </button>
                        <button onClick={() => navigate('/gis')} className="nav-button active">
                            <MapPin size={18} />
                            <span className="nav-label">Map</span>
                        </button>
                        <button onClick={() => navigate('/dashboard')} className="nav-button">
                            <BarChart3 size={18} />
                            <span className="nav-label">Analytics</span>
                        </button>
                        <button onClick={() => handleNavigation('settings')} className="nav-button">
                            <Settings size={18} />
                            <span className="nav-label">Settings</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GISPage;