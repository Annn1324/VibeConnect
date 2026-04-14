export default function PasswordField({
  value,
  onChange,
  showPassword,
  setShowPassword,
  passIcon,
  showIcon,
  hideIcon,
}) {
  return (
    <div className="login-field">
      <div className="login-field-header">
        <label className="login-label">Password</label>
        <button type="button" className="login-forgot">
          Forgot password?
        </button>
      </div>

      <div className="login-input">
        <img src={passIcon} className="login-input-icon" />

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={value}
          onChange={onChange}
          placeholder="Enter your password"
          required
        />

        <button
          type="button"
          className="login-password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          <img
            src={showPassword ? hideIcon : showIcon}
            className="login-toggle-icon"
          />
        </button>
      </div>
    </div>
  );
}