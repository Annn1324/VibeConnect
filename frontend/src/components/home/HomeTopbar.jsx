import searchIcon from '../../assets/search-icon.png';
import settingIcon from '../../assets/setting-icon.png';
import helpIcon from '../../assets/help-icon.png';

export default function HomeTopbar() {
  return (
    <header className="home-topbar">
      <div className="home-search">
        <img src={searchIcon} alt="" className="home-search-icon" />
        <input type="text" placeholder="Search the pulse..." />
      </div>

      <div className="home-top-actions">
        <button type="button" className="home-icon-button" aria-label="Settings">
          <img src={settingIcon} alt="" className="home-action-icon" />
        </button>
        <button type="button" className="home-icon-button" aria-label="Help">
          <img src={helpIcon} alt="" className="home-action-icon" />
        </button>
        <button type="button" className="home-avatar-button">
          J
        </button>
      </div>
    </header>
  );
}
