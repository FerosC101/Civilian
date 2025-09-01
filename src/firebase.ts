import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, off } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDY5EJY9_WP1gdfd5QJP5GmB1cmN3fOQOU",
    authDomain: "civilian-10f21.firebaseapp.com",
    databaseURL: "https://civilian-10f21-default-rtdb.firebaseio.com",
    projectId: "civilian-10f21",
    storageBucket: "civilian-10f21.firebasestorage.app",
    messagingSenderId: "446363289180",
    appId: "1:446363289180:web:8f2fad3c0739314a61c899"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getDatabase(app);
export const auth = getAuth(app);

// Helper functions for alerts
export const sendAlert = async (alertData: any) => {
    try {
        const alertsRef = ref(db, 'alerts');
        const newAlertRef = push(alertsRef);
        await set(newAlertRef, {
            ...alertData,
            id: newAlertRef.key,
            timestamp: new Date().toISOString()
        });
        return newAlertRef.key;
    } catch (error) {
        console.error('Error sending alert:', error);
        throw error;
    }
};

export const subscribeToAlerts = (callback: (alerts: any[]) => void) => {
    const alertsRef = ref(db, 'alerts');
    const unsubscribe = onValue(alertsRef, (snapshot) => {
        if (snapshot.exists()) {
            const alertsData = snapshot.val();
            const alertsArray = Object.values(alertsData);
            callback(alertsArray);
        } else {
            callback([]);
        }
    });
    return unsubscribe;
};

export const unsubscribeFromAlerts = (alertsRef: any) => {
    off(alertsRef);
};