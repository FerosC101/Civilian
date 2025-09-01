import { useState, useEffect } from 'react';
import { AlertService, Alert } from './alertService';

export const useAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);

        try {
            const unsubscribe = AlertService.subscribeToAlerts((newAlerts) => {
                setAlerts(newAlerts);
                setIsLoading(false);
                setError(null);
            });

            // Return cleanup function
            return () => {
                AlertService.unsubscribeFromAlerts(unsubscribe);
            };
        } catch (err) {
            setError('Failed to connect to alerts');
            setIsLoading(false);
            console.error('Error subscribing to alerts:', err);
        }
    }, []);

    return { alerts, isLoading, error };
};

export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
};

export const showNotification = (alert: Alert) => {
    if (Notification.permission === 'granted') {
        try {
            const notification = new Notification(`🚨 ${alert.type.toUpperCase()} ALERT`, {
                body: alert.message,
                icon: '/favicon.ico', // Use your app icon
                badge: '/favicon.ico',
                tag: alert.id, // Prevents duplicate notifications
                requireInteraction: alert.severity === 'critical', // Critical alerts require interaction
                silent: false,
            });

            notification.onclick = () => {
                window.focus();
                notification.close();

                // Optional: Focus on the alert location on map
                console.log('Alert clicked:', alert);
            };

            // Auto close after time based on severity
            const autoCloseTime = alert.severity === 'critical' ? 30000 :
                alert.severity === 'high' ? 15000 : 10000;

            setTimeout(() => {
                notification.close();
            }, autoCloseTime);

        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }
};

// Additional utility functions for alert management
export const getAlertPriority = (alert: Alert): number => {
    const severityWeight = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1
    };

    const typeWeight = {
        earthquake: 4,
        fire: 3,
        flood: 2,
        weather: 1
    };

    return (severityWeight[alert.severity] || 1) * (typeWeight[alert.type] || 1);
};

export const sortAlertsByPriority = (alerts: Alert[]): Alert[] => {
    return [...alerts].sort((a, b) => {
        const priorityDiff = getAlertPriority(b) - getAlertPriority(a);
        if (priorityDiff !== 0) return priorityDiff;

        // If same priority, sort by timestamp (newest first)
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
};

export const isAlertExpired = (alert: Alert): boolean => {
    if (!alert.expiresAt) return false;
    return new Date(alert.expiresAt).getTime() < Date.now();
};

export const getAlertAge = (alert: Alert): string => {
    const now = Date.now();
    const alertTime = new Date(alert.timestamp).getTime();
    const diffMinutes = Math.floor((now - alertTime) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
};