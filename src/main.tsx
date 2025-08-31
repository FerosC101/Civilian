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

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<EntryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/gis" element={<GIS_Page />} />
                <Route path="/admin" element={<AdminPage/>} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    </StrictMode>,
);