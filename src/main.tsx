import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EntryPage from './EntryPage.tsx';
import LoginPage from './LoginPage.tsx';
import SignUpPage from './SignUpPage.tsx';
import GIS_Page from './GIS_Page.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<EntryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/gis" element={<GIS_Page />} />
            </Routes>
        </Router>
    </StrictMode>,
);