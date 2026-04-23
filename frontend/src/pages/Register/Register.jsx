import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import './Register.css';

import AuthLayout from '../../layouts/AuthLayout';
import AuthBrand from '../../components/auth/AuthBrand';
import AuthInput from '../../components/auth/AuthInput';
import PasswordField from '../../components/auth/PasswordField';
import AuthStatus from '../../components/auth/AuthStatus';
import AuthSwitch from '../../components/auth/AuthSwitch';

import emailIcon from '../../assets/email-icon.png';
import fullNameIcon from '../../assets/fullname.png';
import passIcon from '../../assets/pass-icon.png';
import showPasswordIcon from '../../assets/hide-icon.png';
import hidePasswordIcon from '../../assets/hide-icon2.png';
import userIcon from '../../assets/user.png';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
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

      navigate('/login', {
        replace: true,
        state: {
          successMessage: data.message || 'Register successful. Please sign in.',
          email: formData.email.trim(),
        },
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout shellClassName="register-shell">
      <section className="register-showcase">
        <AuthBrand className="register-brand" />

        <div className="showcase-copy">
          <h2>
            Tham gia vào <span>không gian</span> kết nối với mọi người.
          </h2>
          <p>Tạo hồ sơ, khám phá và chia sẻ những khoảnh khắc của bạn.</p>
        </div>

        <div className="showcase-points">
          <div className="showcase-point">
            <div className="point-icon">01</div>
            <span>Bảng tin đa dạng</span>
          </div>
          <div className="showcase-point">
            <div className="point-icon">02</div>
            <span>Kết nối với mọi người</span>
          </div>
        </div>
      </section>

      <section className="register-form-panel">
        <div className="auth-heading register-heading">
          <h2>Sign Up</h2>
          <p>Create your account to start connecting.</p>
        </div>

        <div className="auth-card register-card">
          <form className="auth-form register-form" onSubmit={handleSubmit}>
            <AuthInput
              id="register-name"
              label="Full Name"
              name="fullname"
              type="text"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              icon={fullNameIcon}
              iconAlt="Full name icon"
              autoComplete="name"
            />

            <AuthInput
              id="register-email"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              icon={emailIcon}
              iconAlt="Email icon"
              autoComplete="email"
            />

            <AuthInput
              id="register-username"
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="@an_1324"
              icon={userIcon}
              iconAlt="Username icon"
              autoComplete="username"
            />

            <PasswordField
              id="register-password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              onToggle={() => setShowPassword((visible) => !visible)}
              icon={passIcon}
              showIcon={showPasswordIcon}
              hideIcon={hidePasswordIcon}
              placeholder="Enter your password"
              autoComplete="new-password"
              minLength={6}
            />

            <PasswordField
              id="register-confirm-password"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              showPassword={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((visible) => !visible)}
              icon={passIcon}
              showIcon={showPasswordIcon}
              hideIcon={hidePasswordIcon}
              placeholder="Confirm your password"
              autoComplete="new-password"
              minLength={6}
            />

            <label className="register-consent">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <span>
                I agree to the <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>.
              </span>
            </label>

            <AuthStatus error={errorMessage} success={successMessage} />

            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="register-footer">
            <AuthSwitch prompt="Already have an account?" linkText="Log In" to="/login" />
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}
