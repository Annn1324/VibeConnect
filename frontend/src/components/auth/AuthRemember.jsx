export default function AuthRemember({ checked, onChange }) {
  return (
    <div>
      <label className="auth-checkbox">
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
