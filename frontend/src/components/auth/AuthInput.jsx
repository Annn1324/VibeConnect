export default function AuthInput({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  icon,
  iconAlt,
  autoComplete,
  required = true,
}) {
  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>
        {label}
      </label>

      <div className="auth-input">
        <img src={icon} alt={iconAlt} className="auth-input-icon" />
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
        />
      </div>
    </div>
  );
}
