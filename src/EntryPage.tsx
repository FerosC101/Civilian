import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './EntryPage.css';

const EntryPage: React.FC = () => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!acceptedTerms || !acceptedPrivacy) {
            alert('Please accept Terms and Conditions and Privacy Policy to continue.');
            return;
        }
        console.log('Login clicked');
        navigate('/login'); // Navigate to login page
    };

    const handleSignup = () => {
        if (!acceptedTerms || !acceptedPrivacy) {
            alert('Please accept Terms and Conditions and Privacy Policy to continue.');
            return;
        }
        console.log('Sign up clicked');
        navigate('/signup'); // Navigate to signup page
    };

    const handleGuestLogin = () => {
        console.log('Guest login clicked');
        navigate('/gis');
    };

    return (
        <div className="page-container">
            {/* Gradient Overlays */}
            <div className="gradient-overlay overlay-1"></div>
            <div className="gradient-overlay overlay-2"></div>

            {/* Single Centered Container */}
            <div className="main-container">
                {/* Logo */}
                <img
                    src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                    alt="CIVILIAN Logo"
                    className="brand-logo"
                />

                {/* Brand Identity */}
                <h1 className="company-name">CIVILIAN</h1>
                <p className="company-tagline">
                    Advanced AI-powered intelligence platform for modern decision making
                </p>

                {/* Divider */}
                <div className="divider"></div>

                {/* Auth Header */}
                <h2 className="auth-title">Get Started</h2>
                <p className="auth-subtitle">Choose your access method</p>

                {/* Auth Buttons */}
                <div className="auth-buttons">
                    <button
                        onClick={handleLogin}
                        className="auth-button primary"
                        disabled={!acceptedTerms || !acceptedPrivacy}
                    >
                        Login
                    </button>

                    <button
                        onClick={handleSignup}
                        className="auth-button secondary"
                        disabled={!acceptedTerms || !acceptedPrivacy}
                    >
                        Sign Up
                    </button>

                    <button
                        onClick={handleGuestLogin}
                        className="auth-button accent"
                    >
                        Continue as Guest
                    </button>
                </div>

                {/* Terms Agreement */}
                <div className="terms-section">
                    <div className="terms-item">
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="checkbox-input"
                            />
                            <label htmlFor="terms" className="checkbox-custom">
                                <svg className="check-icon" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                            </label>
                        </div>
                        <span className="terms-text">
                            I agree to the{' '}
                            <a href="#" className="terms-link">Terms and Conditions</a>
                        </span>
                    </div>

                    <div className="terms-item">
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="privacy"
                                checked={acceptedPrivacy}
                                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                                className="checkbox-input"
                            />
                            <label htmlFor="privacy" className="checkbox-custom">
                                <svg className="check-icon" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                            </label>
                        </div>
                        <span className="terms-text">
                            I agree to the{' '}
                            <a href="#" className="terms-link">Privacy Policy</a>
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="auth-footer">
                    <div className="status-dot"></div>
                    <span className="status-text">System Online</span>
                </div>
            </div>
        </div>
    );
};

export default EntryPage;