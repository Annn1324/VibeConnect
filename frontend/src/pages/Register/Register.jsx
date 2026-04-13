import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../../services/authService';
import './Register.css';
import brandIcon from '../../assets/icon.svg';
import emailIcon from '../../assets/email-icon.png';
import fullNameIcon from '../../assets/fullname.png';
import passIcon from '../../assets/pass-icon.png';
import showPasswordIcon from '../../assets/hide-icon.png';
import hidePasswordIcon from '../../assets/hide-icon2.png';
import userIcon from '../../assets/user.png';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await register({
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
      });

      setSuccessMessage(data.message || 'Register successful');
      setFormData({
        fullname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="bg-glow bg-glow-left" />
      <div className="bg-glow bg-glow-right" />

      <div className="register-shell">
        <section className="register-showcase">
          <div className="register-brand">
            <img src={brandIcon} alt="VibeConnect Logo" className="register-brand-icon" />
            <h1>
              <span className="vibe">Vibe</span>
              <span className="connect">Connect</span>
            </h1>
          </div>

          <div className="showcase-copy">
            <h2>
              Tham gia vào <span>Không Gian</span> kết nối với mọi người.
            </h2>
            <p>Tạo hồ sơ, khám phá và chia sẻ những khoảnh khắc của bạn.</p>
          </div>

          <div className="showcase-points">
            <div className="showcase-point">
              <div className="point-icon">01</div>
              <span>Bảng tin đơn giản</span>
            </div>
            <div className="showcase-point">
              <div className="point-icon">02</div>
              <span>Kết nối với mọi người</span>
            </div>
          </div>
        </section>

        <section className="register-form-panel">
          <div className="register-heading">
            <h2>Sign Up</h2>
            <p>Create your account to start connecting.</p>
          </div>

          <div className="register-card">
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="register-field">
                <label className="register-label" htmlFor="register-name">
                  Full Name
                </label>
                <div className="register-input">
                  <img src={fullNameIcon} alt="full name icon" />
                  <input
                    id="register-name"
                    name="fullname"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="register-field">
                <label className="register-label" htmlFor="register-email">
                  Email
                </label>
                <div className="register-input">
                  <img src={emailIcon} alt="email icon" />
                  <input
                    id="register-email"
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

              <div className="register-field">
                <label className="register-label" htmlFor="register-username">
                  Username
                </label>
                <div className="register-input">
                  <img src={userIcon} alt="username icon" />
                  <input
                    id="register-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="@an_1324"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="register-field">
                <label className="register-label" htmlFor="register-password">
                  Password
                </label>
                <div className="register-input">
                  <img src={passIcon} alt="password icon" />
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <img
                      src={showPassword ? hidePasswordIcon : showPasswordIcon}
                      alt={showPassword ? 'hide password' : 'show password'}
                    />
                  </button>
                </div>
              </div>

              <div className="register-field">
                <label className="register-label" htmlFor="register-confirm-password">
                  Confirm Password
                </label>
                <div className="register-input">
                  <img src={passIcon} alt="confirm password icon" />
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <img
                      src={showConfirmPassword ? hidePasswordIcon : showPasswordIcon}
                      alt={showConfirmPassword ? 'hide password' : 'show password'}
                    />
                  </button>
                </div>
              </div>

              <label className="register-consent">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to the <a href="/">Terms of Service</a> and{' '}
                  <a href="/">Privacy Policy</a>.
                </span>
              </label>

              {errorMessage ? <p className="register-status register-status-error">{errorMessage}</p> : null}
              {successMessage ? <p className="register-status register-status-success">{successMessage}</p> : null}

              <button className="register-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="register-footer">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
