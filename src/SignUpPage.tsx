import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './SignUpPage.css';

type AccountType = 'government' | 'company';

const SignUpPage: React.FC = () => {
    const [accountType, setAccountType] = useState<AccountType>('government');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        nodeSerial: '',
        // Government specific fields
        department: '',
        position: '',
        governmentId: '',
        // Company specific fields
        companyName: '',
        industry: '',
        companySize: '',
        jobTitle: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();

        if (!acceptedTerms || !acceptedPrivacy) {
            alert('Please accept Terms and Conditions and Privacy Policy to continue.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (formData.password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        console.log('Sign up attempt:', { accountType, ...formData });
        // Handle sign up logic here
        navigate('/login'); // Navigate to login after successful signup
    };

    const handleSocialSignUp = (provider: string) => {
        console.log(`${provider} signup clicked`);
        // Handle social signup logic
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const companySizes = [
        { value: '1-10', label: '1-10 employees' },
        { value: '11-50', label: '11-50 employees' },
        { value: '51-200', label: '51-200 employees' },
        { value: '201-500', label: '201-500 employees' },
        { value: '500+', label: '500+ employees' }
    ];

    const industries = [
        { value: 'technology', label: 'Technology' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'finance', label: 'Finance' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'retail', label: 'Retail' },
        { value: 'education', label: 'Education' },
        { value: 'consulting', label: 'Consulting' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <div className="signup-page-container">
            {/* Gradient Overlays */}
            <div className="gradient-overlay overlay-1"></div>
            <div className="gradient-overlay overlay-2"></div>

            {/* SignUp Container */}
            <div className="signup-container">
                {/* Header Section */}
                <div className="signup-header">
                    <img
                        src="https://res.cloudinary.com/drrzinr9v/image/upload/v1756178197/CIVILIAN_LOGO_wwg5cm.png"
                        alt="CIVILIAN Logo"
                        className="signup-logo"
                    />
                    <h1 className="signup-title">Welcome to</h1>
                    <h2 className="brand-name">CIVILIAN</h2>
                </div>

                {/* Account Type Selection */}
                <div className="account-type-section">
                    <h3 className="form-title">Create an account</h3>
                    <p className="form-subtitle">Choose your account type</p>

                    <div className="account-type-buttons">
                        <button
                            type="button"
                            onClick={() => setAccountType('government')}
                            className={`account-type-button ${accountType === 'government' ? 'active' : ''}`}
                        >
                            <div className="account-type-icon government-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 3L2 9v12h20V9L12 3zm0 2.5L19.5 10v9h-15v-9L12 5.5zm0 1.5L6.5 11v8h11v-8L12 7z"/>
                                    <path d="M10 13h4v2h-4v-2zm-2 4h8v1H8v-1z"/>
                                </svg>
                            </div>
                            <div>
                                <div className="account-type-title">Government</div>
                                <div className="account-type-desc">For government agencies and officials</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setAccountType('company')}
                            className={`account-type-button ${accountType === 'company' ? 'active' : ''}`}
                        >
                            <div className="account-type-icon company-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                                </svg>
                            </div>
                            <div>
                                <div className="account-type-title">Company</div>
                                <div className="account-type-desc">For businesses and organizations</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* SignUp Form */}
                <form onSubmit={handleSignUp} className="signup-form">
                    {/* Personal Information */}
                    <div className="form-section">
                        <h4 className="section-title">Personal Information</h4>
                        <div className="form-row">
                            <div className="form-group half">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>
                            <div className="form-group half">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter your password"
                                        required
                                        minLength={8}
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
                            <div className="form-group half">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="password-toggle"
                                    >
                                        {showConfirmPassword ? (
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
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                            <div className="form-group half">
                                <label htmlFor="nodeSerial" className="form-label">Node Serial Number</label>
                                <input
                                    type="text"
                                    id="nodeSerial"
                                    name="nodeSerial"
                                    value={formData.nodeSerial}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Enter node serial number"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Account Type Specific Fields */}
                    {accountType === 'government' ? (
                        <div className="form-section">
                            <h4 className="section-title">Government Information</h4>
                            <div className="form-group">
                                <label htmlFor="department" className="form-label">Department/Agency</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Enter your department or agency"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group half">
                                    <label htmlFor="position" className="form-label">Position</label>
                                    <input
                                        type="text"
                                        id="position"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Your position/title"
                                        required
                                    />
                                </div>
                                <div className="form-group half">
                                    <label htmlFor="governmentId" className="form-label">Government ID</label>
                                    <input
                                        type="text"
                                        id="governmentId"
                                        name="governmentId"
                                        value={formData.governmentId}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Employee/Badge ID"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="form-section">
                            <h4 className="section-title">Company Information</h4>
                            <div className="form-group">
                                <label htmlFor="companyName" className="form-label">Company Name</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Enter your company name"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group half">
                                    <label htmlFor="industry" className="form-label">Industry</label>
                                    <select
                                        id="industry"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Select industry</option>
                                        {industries.map(industry => (
                                            <option key={industry.value} value={industry.value}>
                                                {industry.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group half">
                                    <label htmlFor="companySize" className="form-label">Company Size</label>
                                    <select
                                        id="companySize"
                                        name="companySize"
                                        value={formData.companySize}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Select size</option>
                                        {companySizes.map(size => (
                                            <option key={size.value} value={size.value}>
                                                {size.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="jobTitle" className="form-label">Job Title</label>
                                <input
                                    type="text"
                                    id="jobTitle"
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Enter your job title"
                                    required
                                />
                            </div>
                        </div>
                    )}

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

                    <button
                        type="submit"
                        className="signup-button"
                        disabled={!acceptedTerms || !acceptedPrivacy}
                    >
                        Create Account
                    </button>

                    <div className="divider-container">
                        <div className="divider-line"></div>
                        <span className="divider-text">Or Sign up using</span>
                        <div className="divider-line"></div>
                    </div>

                    {/* Social SignUp Buttons */}
                    <div className="social-signup-container">
                        <button
                            type="button"
                            onClick={() => handleSocialSignUp('Apple')}
                            className="social-signup-button"
                        >
                            <svg className="social-icon" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialSignUp('Google')}
                            className="social-signup-button"
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
                            onClick={() => handleSocialSignUp('Facebook')}
                            className="social-signup-button"
                        >
                            <svg className="social-icon" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </button>
                    </div>

                    <div className="login-link-container">
                        <span className="login-text">Already have an account? </span>
                        <button
                            type="button"
                            onClick={handleLogin}
                            className="login-link"
                        >
                            Login
                        </button>
                    </div>
                </form>

                {/* Footer Status */}
                <div className="signup-footer">
                    <div className="status-dot"></div>
                    <span className="status-text">System Online</span>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;