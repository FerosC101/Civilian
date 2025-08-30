import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './EntryPage.css';

const EntryPage: React.FC = () => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
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

    const TermsModal: React.FC = () => {
        if (!showTerms) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowTerms(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Terms and Conditions</h2>
                        <button className="modal-close" onClick={() => setShowTerms(false)}>×</button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Last Updated: August 29, 2025</strong></p>

                        <h3>Interpretation and Definitions</h3>
                        <p>The words of which the initial letter is capitalized have meaning defined under the following conditions. The following definitions shall have the same meaning regarding whether they appear in singular or in plural.</p>

                        <h4>Definitions</h4>
                        <ul>
                            <li><strong>Application</strong> means the software program provided by the Company downloaded by You on any electronic device, named CIVILIAN</li>
                            <li><strong>Application Store</strong> means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded.</li>
                            <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party.</li>
                            <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                            <li><strong>Company</strong> refers to CIVILIAN.</li>
                            <li><strong>Country</strong> refers to the Philippines.</li>
                            <li><strong>Content</strong> refers to content such as text, images, or other information that can be posted, uploaded, linked to or otherwise made available by You.</li>
                            <li><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
                            <li><strong>Feedback</strong> means feedback, innovations or suggestions sent by You regarding the attributes, performance or features of our Service.</li>
                            <li><strong>Service</strong> refers to the Website.</li>
                            <li><strong>Terms and Conditions</strong> mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
                            <li><strong>Third-party Social Media Service</strong> means any services or content provided by a third-party that may be displayed, included or made available by the Service.</li>
                            <li><strong>Website</strong> refers to CIVILIAN, accessible from https://civilian-website-cd0fo411s-ferosc101s-projects.vercel.app/</li>
                            <li><strong>You</strong> means the individual accessing or using the Service.</li>
                        </ul>

                        <h3>Acknowledgement</h3>
                        <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between you and the Company. These Terms and Conditions set out rights and obligations of all users regarding the use of the Service.</p>

                        <p>Your access to and use of Service is conditioned upon your compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>

                        <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If you disagree with any part of these Terms and Conditions then You may not access the Service.</p>

                        <p>You represent that you are over the age of 12. The Company does not permit those under 12 to use the Service.</p>

                        <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company.</p>

                        <h3>User Accounts</h3>
                        <p>When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.</p>

                        <p>You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password.</p>

                        <p>You agree not to disclose Your password to any third party. You must notify Us immediately upon becoming aware of any breach of security or unauthorized use of Your account.</p>

                        <p>You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than You without appropriate authorization, or a name that is otherwise offensive, vulgar or obscene.</p>

                        <h3>Content</h3>
                        <h4>Your Right to Post Content</h4>
                        <p>Our Service allows you to submit and share content, including but not limited to incident reports, location updates, photos, and messages related to disaster events ("Content"). You are solely responsible for the Content that you post to the Service.</p>

                        <p>By submitting Content to CIVILIAN, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, display, distribute, and process such Content as necessary to provide disaster alerts and updates, share relevant reports with authorities, and improve our services.</p>

                        <h4>Content Restrictions</h4>
                        <p>You may not transmit any Content that is unlawful, offensive, upsetting, intended to disgust, threatening, libelous, defamatory, obscene or otherwise objectionable.</p>

                        <p>The Company reserves the right to determine whether or not any Content is appropriate and complies with these Terms, refuse or remove this Content.</p>

                        <h4>Content Backups</h4>
                        <p>Although regular backups of Content are performed, the Company does not guarantee there will be no loss or corruption of data.</p>

                        <h3>Copyright Policy</h3>
                        <p>We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on CIVILIAN infringes on the copyright or other intellectual property rights of any person or entity.</p>

                        <h3>Intellectual Property</h3>
                        <p>The Service and its original content (excluding Content provided by You or other users), features and functionality are and will remain the exclusive property of the Company and its licensors.</p>

                        <h3>Termination</h3>
                        <p>We may terminate or suspend Your Account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>

                        <h3>Limitation of Liability</h3>
                        <p>To the fullest extent permitted by law, CIVILIAN and its developers, partners, and suppliers shall not be held liable for any direct, indirect, incidental, special, or consequential damages that may arise from your use of, or inability to use, the Service.</p>

                        <h3>Governing Law</h3>
                        <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service.</p>

                        <h3>Changes to These Terms and Conditions</h3>
                        <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time.</p>

                        <p>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms.</p>

                        <h3>Contact Us</h3>
                        <p>If you have any questions about these Terms and Conditions, You can contact us by sending us an email: vincevillar02@gmail.com</p>
                    </div>
                    <div className="modal-footer">
                        <button className="modal-button" onClick={() => setShowTerms(false)}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    const PrivacyModal: React.FC = () => {
        if (!showPrivacy) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowPrivacy(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Privacy Policy</h2>
                        <button className="modal-close" onClick={() => setShowPrivacy(false)}>×</button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Last Updated: August 29, 2025</strong></p>

                        <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>

                        <h3>Interpretation and Definitions</h3>
                        <h4>Definitions</h4>
                        <ul>
                            <li><strong>Account</strong> means a unique account created for You to access our Service.</li>
                            <li><strong>Application</strong> means the software program named CIVILIAN.</li>
                            <li><strong>Company</strong> refers to CIVILIAN – City Integrated Virtual Intelligence for Life-saving AI & Network.</li>
                            <li><strong>Country</strong> refers to Philippines.</li>
                            <li><strong>Cookies</strong> are small files that are placed on Your device by a website.</li>
                            <li><strong>Device</strong> means any device that can access the Service.</li>
                            <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
                            <li><strong>Service</strong> refers to the Website.</li>
                            <li><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company.</li>
                            <li><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service.</li>
                            <li><strong>You</strong> means the individual accessing or using the Service.</li>
                        </ul>

                        <h3>Collecting and Using Your Personal Data</h3>
                        <h4>Types of Data Collected</h4>
                        <p><strong>Personal Data</strong></p>
                        <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
                        <ul>
                            <li>Email address</li>
                            <li>First name and last name</li>
                            <li>Phone number</li>
                            <li>Address, State, Province, ZIP/Postal code, City</li>
                            <li>Usage Data</li>
                            <li>Location</li>
                        </ul>

                        <p><strong>Usage Data</strong></p>
                        <p>When you use the CIVILIAN Service, certain usage data is collected automatically to help us operate, maintain, and improve the platform.</p>

                        <p><strong>Information Collected while Using the Application</strong></p>
                        <p>While using the CIVILIAN Application, and only with your prior permission, we may collect and process information about your location. This data is essential for providing certain features of the Service.</p>

                        <h3>Use of Your Personal Data</h3>
                        <p>CIVILIAN may use your Personal Data for the following purposes:</p>
                        <ul>
                            <li>To provide and maintain our Service</li>
                            <li>To manage your account</li>
                            <li>To improve public safety</li>
                            <li>To contact you</li>
                            <li>To provide information and updates</li>
                            <li>To manage your requests</li>
                            <li>For research and improvement</li>
                            <li>For business continuity</li>
                            <li>With your consent</li>
                        </ul>

                        <h3>Sharing of Personal Data</h3>
                        <p>We may share your personal information under the following circumstances:</p>
                        <ul>
                            <li>With Service Providers</li>
                            <li>With LGUs and disaster response agencies</li>
                            <li>With Affiliates and partners</li>
                            <li>With other users</li>
                            <li>With your consent</li>
                        </ul>

                        <h3>Security of Your Personal Data</h3>
                        <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.</p>

                        <h3>Children's Privacy</h3>
                        <p>Our Service does not address anyone under the age of 11. We do not knowingly collect personally identifiable information from anyone under the age of 11.</p>

                        <h3>Changes to this Privacy Policy</h3>
                        <p>We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements.</p>

                        <h3>Contact Us</h3>
                        <p>If you have any questions or concerns about this Privacy Policy or how your data is handled, you can reach us by sending an email to: vincevillar02@gmail.com</p>
                    </div>
                    <div className="modal-footer">
                        <button className="modal-button" onClick={() => setShowPrivacy(false)}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="page-container">
            {/* Gradient Overlays */}
            <div className="gradient-overlay overlay-1"></div>
            <div className="gradient-overlay overlay-2"></div>

            {/* Scrollable Content Wrapper */}
            <div className="scroll-wrapper">
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
                                <a href="#" className="terms-link" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>Terms and Conditions</a>
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
                                <a href="#" className="terms-link" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>Privacy Policy</a>
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

            {/* Modals */}
            <TermsModal />
            <PrivacyModal />
        </div>
    );
};

export default EntryPage;