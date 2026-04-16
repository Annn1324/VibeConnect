import brandIcon from '../../assets/icon.svg';

export default function AuthBrand({ className = '' }) {
  const classNames = ['auth-brand', className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <img src={brandIcon} alt="VibeConnect logo" className="auth-brand-icon" />
      <h1 className="auth-brand-title">
        <span className="auth-brand-vibe">Vibe</span>
        <span className="auth-brand-connect">Connect</span>
      </h1>
    </div>
  );
}
