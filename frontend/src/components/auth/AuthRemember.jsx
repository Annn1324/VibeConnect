export default function AuthRemember({ checked, onChange }) {
  return (
    <div className="login-checkbox">
      <label className="login-checkbox">
        <input
          type="checkbox"
          name="rememberMe"
          checked={checked}
          onChange={onChange}
        />
        <span>Remember me</span>
      </label>
    </div>
  );
}