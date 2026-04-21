import brandIcon from '../../assets/icon.svg';

export default function HomeSidebar({ navItems }) {
  return (
    <aside className="home-sidebar">
      <div className="home-brand">
        <img src={brandIcon} alt="VibeConnect logo" className="home-brand-icon" />
        <div>
          <h1 className="home-brand-title">
            <span className="home-brand-vibe">Vibe</span>
            <span className="home-brand-connect">Connect</span>
          </h1>
        </div>
      </div>

      <nav className="home-nav">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`home-nav-item${item.active ? ' is-active' : ''}`}
          >
            <img src={item.icon} alt="" className="home-nav-icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
