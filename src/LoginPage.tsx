import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Built-in accounts
    const ADMIN_CREDENTIALS = {
        email: 'admin@civilian.gov',
        password: 'CivilianAdmin2024!'
    };

    const USER_CREDENTIALS = {
        email: 'user@civilian.gov',
        password: 'CivilianUser2024!'
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Check credentials
            if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                // Admin login successful
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('loginTime', new Date().toISOString());

                console.log('Admin login successful');
                navigate('/admin');

            } else if (email === USER_CREDENTIALS.email && password === USER_CREDENTIALS.password) {
                // Regular user login successful
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('loginTime', new Date().toISOString());

                console.log('User login successful');
                navigate('/gis');

            } else {
                // Invalid credentials
                alert('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`${provider} login clicked`);
        // Handle social login logic
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
        // Handle forgot password logic
    };

    const handleSignUp = () => {
        navigate('/signup'); // Navigate to signup page
    };

    return (
        <div className="login-page-container">
            {/* Gradient Overlays */}
            <div className="gradient-overlay overlay-1"></div>
            <div className="gradient-overlay overlay-2"></div>

            {/* Scrollable Content Wrapper */}
            <div className="scroll-wrapper">
                {/* Login Container */}
                <div className="login-container">
                    {/* Header Section */}
                    <div className="login-header">
                        <img
                            src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                            alt="CIVILIAN Logo"
                            className="login-logo"
                        />
                        <h1 className="login-title">Welcome to</h1>
                        <h2 className="brand-name">CIVILIAN</h2>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="login-form">
                        <h3 className="form-title">Login to your account</h3>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? (
                                        <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="forgot-password-link"
                        >
                            Forgot Password?
                        </button>

                        <div className="divider-container">
                            <div className="divider-line"></div>
                            <span className="divider-text">Or Login using</span>
                            <div className="divider-line"></div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="social-login-container">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('Apple')}
                                className="social-login-button"
                            >
                                <svg className="social-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSocialLogin('Google')}
                                className="social-login-button"
                            >
                                <svg className="social-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSocialLogin('Facebook')}
                                className="social-login-button"
                            >
                                <svg className="social-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </button>
                        </div>

                        <div className="signup-link-container">
                            <span className="signup-text">Don't have an account? </span>
                            <button
                                type="button"
                                onClick={handleSignUp}
                                className="signup-link"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    {/* Footer Status */}
                    <div className="login-footer">
                        <div className="status-dot"></div>
                        <span className="status-text">System Online</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;