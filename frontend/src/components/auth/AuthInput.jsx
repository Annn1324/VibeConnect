export default function AuthInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon,
}) {
  return (
    <div className="login-field">
      <label className="login-label">{label}</label>

      <div className="login-input">
        <img src={icon} className="login-input-icon" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}