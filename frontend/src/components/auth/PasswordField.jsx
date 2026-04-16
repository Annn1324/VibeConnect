export default function PasswordField({
  id,
  label = 'Password',
  name = 'password',
  value,
  onChange,
  showPassword,
  onToggle,
  icon,
  showIcon,
  hideIcon,
  placeholder = 'Enter your password',
  autoComplete,
  minLength,
  forgotText,
  onForgotClick,
  required = true,
}) {
  return (
    <div className="auth-field">
      <div className="auth-field-header">
        <label className="auth-label" htmlFor={id}>
          {label}
        </label>
        {forgotText ? (
          <button type="button" className="auth-link-button" onClick={onForgotClick}>
            {forgotText}
          </button>
        ) : null}
      </div>

      <div className="auth-input">
        <img src={icon} alt={`${label} icon`} className="auth-input-icon" />

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required={required}
        />

        <button
          type="button"
          className="auth-password-toggle"
          onClick={onToggle}
          aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          <img
            src={showPassword ? hideIcon : showIcon}
            alt={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            className="auth-toggle-icon"
          />
        </button>
      </div>
    </div>
  );
}
