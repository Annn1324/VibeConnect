import { useState } from 'react';
import { login } from '../../services/authService';
import { Link } from 'react-router-dom';
import './Login.css';
import brandIcon from '../../assets/icon.svg';
import emailIcon from '../../assets/email-icon.png';
import passIcon from '../../assets/pass-icon.png';
import showPasswordIcon from '../../assets/hide-icon.png';
import hidePasswordIcon from '../../assets/hide-icon2.png';
import googleIcon from '../../assets/google-icon.png';
import appleIcon from '../../assets/apple-logo.png';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const data = await login(formData.email, formData.password);
      const storage = formData.rememberMe ? localStorage : sessionStorage;

      storage.setItem('token', data.token);
      storage.setItem('user', JSON.stringify(data.user));

      setSuccessMessage(data.message || 'Login successful');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow login-glow-left" />
      <div className="login-glow login-glow-right" />

      <div className="login-shell">
        <div className="login-brand">
          <img src={brandIcon} alt="VibeConnect Logo" className="login-brand-icon" />
          <h1 className="login-brand-title">
            <span className="login-brand-vibe">Vibe</span>
            <span className="login-brand-connect">Connect</span>
          </h1>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label" htmlFor="login-email">
                Email Address
              </label>

              <div className="login-input">
                <img src={emailIcon} alt="email icon" className="login-input-icon" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-field-header">
                <label className="login-label" htmlFor="login-password">
                  Password
                </label>
                <button type="button" className="login-forgot">
                  Forgot password?
                </button>
              </div>

              <div className="login-input">
                <img src={passIcon} alt="password icon" className="login-input-icon" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <img
                    src={showPassword ? hidePasswordIcon : showPasswordIcon}
                    alt={showPassword ? 'hide password' : 'show password'}
                    className="login-toggle-icon"
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="login-checkbox">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember Me</span>
              </label>
            </div>

            {errorMessage ? <p className="login-status login-status-error">{errorMessage}</p> : null}
            {successMessage ? <p className="login-status login-status-success">{successMessage}</p> : null}

            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className="login-divider">
            <p>OR CONTINUE WITH</p>
          </div>
          <div className="login-social">
            <button className="login-social-button">
              <img src={googleIcon} alt="Google logo" className="login-social-icon" />
              <span>Sign in with Google</span>
            </button>
            <button className="login-social-button">
              <img src={appleIcon} alt="Apple logo" className="login-social-icon" />
              <span>Sign in with Apple</span>
            </button>
          </div>
          <div>
            <p className="login-switch">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </div>

        <div className="login-legal">
          <span>PRIVACY</span>
          <span>TERMS</span>
          <span>HELP</span>
        </div>
      </div>
    </div>
  );
}
