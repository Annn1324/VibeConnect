import { useState } from 'react';
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

  return (
    <div className="login-page">
      <div className="bg-glow bg-glow-left" />
      <div className="bg-glow bg-glow-right" />

      <div className="login-container">
        <div className="brand">
          <img src={brandIcon} alt="VibeConnect Logo" className="logo" />
          <div>
            <h1 className="logo">
              <span className="vibe">Vibe</span>
              <span className="connect">Connect</span>
            </h1>
          </div>
        </div>

        <div className="login-card">
          <div className="form-group">
            <div className="email-field">
              <label>Email Address</label>

              <div className="input-wrapper">
                <img src={emailIcon} alt="email-icon" className="input-icon-img" />
                <input type="email" placeholder="name@gmail.com" />
              </div>
            </div>

            <div className="password-field">
              <div className="password-header">
                <label>Password</label>
                <div className="fogot-pass">
                  <span>Fogot password?</span>
                </div>
              </div>

              <div className="input-wrapper">
                <img src={passIcon} alt="pass-icon" className="input-icon-img" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <img
                    src={showPassword ? hidePasswordIcon : showPasswordIcon}
                    alt={showPassword ? 'hide-pass-icon' : 'show-pass-icon'}
                    className="toggle-icon"
                  />
                </button>
              </div>
            </div>

            <div className="remember-me">
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Remember Me</span>
              </label>
            </div>

            <button className="primary-btn">Sign In</button>
          </div>
          <div className="divider">
            <p className="divider">OR CONTINUE WITH</p>
          </div>
          <div className="social-login">
            <button className="social-btn">
              <img src={googleIcon} alt="Google logo" className="social-icon" />
              <span>Sign in with Google</span>
            </button>
            <button className="social-btn">
              <img src={appleIcon} alt="Apple logo" className="social-icon" />
              <span>Sign in with Apple</span>
            </button>
          </div>
          <div className="sign-up-footer">
            <p className="auth-switch">
              Don't have an account? <a href="/register">Sign Up</a>
            </p>
          </div>
        </div>

        <div className="login-footer">
          <span>PRIVACY</span>
          <span>TERMS</span>
          <span>HELP</span>
        </div>
      </div>
    </div>
  );
}
