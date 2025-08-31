import {db} from '../../firebase.ts';
import {limitToLast, onValue, orderByChild, push, query, ref, set} from 'firebase/database';

export interface Alert {
    id?: string;
    type: 'earthquake' | 'fire' | 'flood' | 'weather';
    message: string;
    location: {
        lat: number;
        lng: number;
        address?: string;
    };
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'resolved' | 'expired';
    timestamp: string;
    createdBy?: string;
    affectedAreas?: string[];
    expiresAt?: string;
}

export class AlertService {
    static async sendAlert(alertData: Omit<Alert, 'id' | 'timestamp'>): Promise<string> {
        try {
            const alertsRef = ref(db, 'alerts');
            const newAlertRef = push(alertsRef);

            const alert: Alert = {
                ...alertData,
                id: newAlertRef.key!,
                timestamp: new Date().toISOString(),
                status: 'active'
            };

            await set(newAlertRef, alert);
            return newAlertRef.key!;
        } catch (error) {
            console.error('Error sending alert:', error);
            throw error;
        }
    }

    static subscribeToAlerts(callback: (alerts: Alert[]) => void) {
        const alertsRef = query(
            ref(db, 'alerts'),
            orderByChild('timestamp'),
            limitToLast(50)
        );

        return onValue(alertsRef, (snapshot) => {
            if (snapshot.exists()) {
                const alertsData = snapshot.val();
                const alertsArray = Object.values(alertsData) as Alert[];

                // Filter only active alerts and sort by timestamp
                const activeAlerts = alertsArray
                    .filter(alert => alert.status === 'active')
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                callback(activeAlerts);
            } else {
                callback([]);
            }
        });
    }

    static async updateAlertStatus(alertId: string, status: Alert['status']) {
        try {
            const alertRef = ref(db, `alerts/${alertId}/status`);
            await set(alertRef, status);
        } catch (error) {
            console.error('Error updating alert status:', error);
            throw error;
        }
    }

    static unsubscribeFromAlerts(unsubscribe: () => void) {
        unsubscribe();
    }
}