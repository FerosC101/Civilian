import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminPage from './AdminPage.tsx';
import Dashboard from './Dashboard.tsx';
import EntryPage from './EntryPage.tsx';
import GIS_Page from './GIS_Page.tsx';
import './index.css';
import LoginPage from './LoginPage.tsx';
import SignUpPage from './SignUpPage.tsx';
import HomePage from "./HomePage.tsx";
import EvacuationCenters from "./EvacuationCenters.tsx";
import MenuPage from "./MenuPage.tsx";
import DonationDrive from "./DonationDrive.tsx";
import EmergencyContacts from "./EmergencyContacts.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<EntryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/gis" element={<GIS_Page />} />
                <Route path="/admin" element={<AdminPage/>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/evacuation" element={<EvacuationCenters />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/donations" element={<DonationDrive />} />
                <Route path="/contacts" element={<EmergencyContacts/>} />
            </Routes>
        </Router>
    </StrictMode>,
);