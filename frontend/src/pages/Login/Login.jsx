import { useState } from "react";
import { login } from "../../services/authService";
import "./Login.css";

import AuthLayout from "../../layouts/AuthLayout";
import AuthBrand from "../../components/auth/AuthBrand";
import AuthInput from "../../components/auth/AuthInput";
import PasswordField from "../../components/auth/PasswordField";
import AuthStatus from "../../components/auth/AuthStatus";
import AuthSocial from "../../components/auth/AuthSocial";
import AuthSwitch from "../../components/auth/AuthSwitch";
import AuthLegal from "../../components/auth/AuthLegal";
import AuthRemember from "../../components/auth/AuthRemember";

import emailIcon from "../../assets/email-icon.png";
import passIcon from "../../assets/pass-icon.png";
import showIcon from "../../assets/hide-icon.png";
import hideIcon from "../../assets/hide-icon2.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const data = await login(formData.email, formData.password);

      localStorage.setItem("token", data.token);

      setSuccess("Login successful");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <AuthBrand />

      <div className="login-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <AuthInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={emailIcon}
          />

          <PasswordField
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            passIcon={passIcon}
            showIcon={showIcon}
            hideIcon={hideIcon}
          />

          <AuthStatus error={error} success={success} />
          <AuthRemember
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <button className="login-submit" type="submit">
            Sign In
          </button>
        </form>

        <AuthSocial />

        <AuthSwitch />
      </div>

      <AuthLegal />
    </AuthLayout>
  );
}