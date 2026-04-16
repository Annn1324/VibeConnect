import { useState } from 'react';
import { login } from '../../services/authService';
import './Login.css';

import AuthLayout from '../../layouts/AuthLayout';
import AuthBrand from '../../components/auth/AuthBrand';
import AuthInput from '../../components/auth/AuthInput';
import PasswordField from '../../components/auth/PasswordField';
import AuthStatus from '../../components/auth/AuthStatus';
import AuthSocial from '../../components/auth/AuthSocial';
import AuthSwitch from '../../components/auth/AuthSwitch';
import AuthLegal from '../../components/auth/AuthLegal';
import AuthRemember from '../../components/auth/AuthRemember';

import emailIcon from '../../assets/email-icon.png';
import passIcon from '../../assets/pass-icon.png';
import showIcon from '../../assets/hide-icon.png';
import hideIcon from '../../assets/hide-icon2.png';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const data = await login(formData.email, formData.password);
      const storage = formData.rememberMe ? localStorage : sessionStorage;

      storage.setItem('token', data.token);
      storage.setItem('user', JSON.stringify(data.user));

      setSuccess(data.message || 'Login successful');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout pageClassName="login-page" shellClassName="login-shell">
      <AuthBrand />

      <div className="auth-card login-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthInput
            label="Email Address"
            id="login-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={emailIcon}
            iconAlt="Email icon"
            autoComplete="email"
          />

          <PasswordField
            id="login-password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            onToggle={() => setShowPassword((visible) => !visible)}
            icon={passIcon}
            showIcon={showIcon}
            hideIcon={hideIcon}
            placeholder="Enter your password"
            autoComplete="current-password"
            minLength={6}
            forgotText="Forgot password?"
          />

          <AuthStatus error={error} success={success} />
          <AuthRemember checked={formData.rememberMe} onChange={handleChange} />
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <AuthSocial />

        <AuthSwitch prompt="Don't have an account?" linkText="Sign Up" to="/register" />
      </div>

      <AuthLegal />
    </AuthLayout>
  );
}
