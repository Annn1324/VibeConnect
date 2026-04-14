import brandIcon from '../../assets/icon.svg';

export default function AuthBrand() {
  return (
    <div className="login-brand">
      <img src={brandIcon} alt="logo" className="login-brand-icon" />
      <h1 className="login-brand-title">
        <span className="login-brand-vibe">Vibe</span>
        <span className="login-brand-connect">Connect</span>
      </h1>
    </div>
  );
}