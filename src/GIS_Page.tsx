import React, { useState, useEffect } from 'react';
import { MapPin, Wifi, Battery, Signal } from 'lucide-react';

const WeatherMapDashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const warningTypes = [
        { type: 'Flood Warning', color: 'bg-orange-500', active: true },
        { type: 'Fire Warning', color: 'bg-red-500', active: false },
        { type: 'Air Pollution', color: 'bg-yellow-500', active: false }
    ];

    const mapMarkers = [
        { id: 1, name: 'SM Hypermarket Batangas', lat: 13.7565, lng: 121.0583, type: 'location' },
        { id: 2, name: 'Butch Seafood & Grill Restaurant', lat: 13.7445, lng: 121.0521, type: 'restaurant' },
        { id: 3, name: 'JJSF - SECOND HOUSE Home of The Famous', lat: 13.7398, lng: 121.0645, type: 'restaurant' },
        { id: 4, name: 'Bay City Mall', lat: 13.7234, lng: 121.0456, type: 'mall' },
        { id: 5, name: 'SM City Batangas', lat: 13.7198, lng: 121.0587, type: 'mall' },
        { id: 6, name: 'Portofino Estates Batangas City', lat: 13.7156, lng: 121.0734, type: 'residential' }
    ];

    const weatherZones = [
        { id: 1, intensity: 'high', color: 'rgba(239, 68, 68, 0.6)', center: { lat: 13.7234, lng: 121.0456 }, size: 80 },
        { id: 2, intensity: 'medium', color: 'rgba(251, 146, 60, 0.6)', center: { lat: 13.7565, lng: 121.0583 }, size: 60 }
    ];

    return (
        <div className="h-screen w-full bg-gray-900 text-white relative overflow-hidden">
            {/* Mobile Status Bar */}
            <div className="md:hidden flex justify-between items-center px-4 py-2 bg-white text-black text-sm font-semibold">
                <span>{formatTime(currentTime)}</span>
                <div className="flex items-center space-x-1">
                    <Signal size={16} />
                    <Wifi size={16} />
                    <Battery size={16} />
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <MapPin className="text-white" size={20} />
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-bold">Weather Monitor</h1>
                    </div>
                </div>

                {/* Live Indicator */}
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live</span>
                </div>
            </div>

            {/* Warning Types */}
            <div className="px-4 md:px-6 mb-4">
                <div className="flex space-x-3 md:space-x-4">
                    {warningTypes.map((warning, index) => (
                        <div
                            key={index}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-full border-2 transition-all duration-200 ${
                                warning.active
                                    ? `${warning.color} border-white`
                                    : 'bg-gray-700 border-gray-600'
                            }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${warning.active ? 'bg-white' : 'bg-gray-400'}`}></div>
                            <span className={`text-xs md:text-sm font-medium ${warning.active ? 'text-white' : 'text-gray-300'}`}>
                {warning.type}
              </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 px-4 md:px-6 pb-20 md:pb-6">
                <div className="relative w-full h-full bg-gray-100 rounded-xl overflow-hidden">
                    {/* Simulated Google Maps */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                        {/* Map Grid Lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-20">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>

                        {/* Roads */}
                        <svg className="absolute inset-0 w-full h-full">
                            <path d="M50 100 Q200 80 350 120 T600 140" stroke="#6b7280" strokeWidth="3" fill="none" />
                            <path d="M100 50 Q250 200 400 180 T650 200" stroke="#6b7280" strokeWidth="2" fill="none" />
                            <path d="M0 180 Q150 160 300 170 T500 180" stroke="#6b7280" strokeWidth="2" fill="none" />
                        </svg>

                        {/* Weather Zones */}
                        {weatherZones.map((zone) => (
                            <div
                                key={zone.id}
                                className="absolute rounded-full"
                                style={{
                                    backgroundColor: zone.color,
                                    width: `${zone.size}px`,
                                    height: `${zone.size}px`,
                                    left: `${Math.random() * 60 + 20}%`,
                                    top: `${Math.random() * 60 + 20}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            ></div>
                        ))}

                        {/* Location Markers */}
                        {mapMarkers.map((marker, index) => {
                            const positions = [
                                { left: '25%', top: '30%' },
                                { left: '45%', top: '65%' },
                                { left: '70%', top: '45%' },
                                { left: '30%', top: '80%' },
                                { left: '60%', top: '85%' },
                                { left: '80%', top: '70%' }
                            ];

                            return (
                                <div
                                    key={marker.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                    style={positions[index]}
                                >
                                    <div className="w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-red-500"></div>
                                    </div>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                        <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                                            {marker.name}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Location Labels */}
                        <div className="absolute bottom-4 left-4 text-gray-700 text-sm md:text-base font-semibold">
                            Batangas City
                        </div>
                        <div className="absolute top-1/3 left-1/4 text-gray-600 text-xs md:text-sm">
                            ALANGILAN
                        </div>
                        <div className="absolute top-1/2 right-1/4 text-gray-600 text-xs md:text-sm">
                            TINGGA LABAC
                        </div>

                        {/* Google Maps Attribution */}
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                            Google
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation - Mobile Only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 px-4 py-3">
                <div className="flex justify-around items-center">
                    <button className="p-2 rounded-full bg-blue-600">
                        <MapPin size={20} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <div className="w-5 h-5 border-2 border-white rounded"></div>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <div className="w-5 h-5">
                            <div className="flex space-x-1">
                                <div className="w-1 h-5 bg-white"></div>
                                <div className="w-1 h-3 bg-white mt-2"></div>
                                <div className="w-1 h-4 bg-white mt-1"></div>
                            </div>
                        </div>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <div className="w-5 h-5 border-2 border-white rounded-full"></div>
                    </button>
                </div>
            </div>

            {/* Desktop Sidebar - Desktop Only */}
            <div className="hidden md:block fixed right-6 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-xl p-4 space-y-4">
                <button className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                    <MapPin size={20} />
                </button>
                <button className="p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="w-5 h-5 border-2 border-white rounded"></div>
                </button>
                <button className="p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="w-5 h-5">
                        <div className="flex space-x-1">
                            <div className="w-1 h-5 bg-white"></div>
                            <div className="w-1 h-3 bg-white mt-2"></div>
                            <div className="w-1 h-4 bg-white mt-1"></div>
                        </div>
                    </div>
                </button>
                <button className="p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="w-5 h-5 border-2 border-white rounded-full"></div>
                </button>
            </div>
        </div>
    );
};

export default WeatherMapDashboard;