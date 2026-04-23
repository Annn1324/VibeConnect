import { useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/search-icon.png';
import settingIcon from '../../assets/setting-icon.png';
import helpIcon from '../../assets/help-icon.png';
import { clearAuthSession } from '../../services/authStorage';

export default function HomeTopbar({ user }) {
  const navigate = useNavigate();
  const avatarLabel = user?.username?.[0] || user?.email?.[0] || 'U';

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <header className="home-topbar">
      <div className="home-search">
        <img src={searchIcon} alt="" className="home-search-icon" />
        <input type="text" placeholder="Search the pulse..." />
      </div>

      <div className="home-top-actions">
        <div className="home-user-summary">
          <strong>{user?.fullname || 'Welcome back'}</strong>
          <span>{user?.username ? `@${user.username}` : user?.email || 'Signed in'}</span>
        </div>
        <button type="button" className="home-icon-button" aria-label="Settings">
          <img src={settingIcon} alt="" className="home-action-icon" />
        </button>
        <button type="button" className="home-icon-button" aria-label="Help">
          <img src={helpIcon} alt="" className="home-action-icon" />
        </button>
        <button type="button" className="home-logout-button" onClick={handleLogout}>
          Log out
        </button>
        <button type="button" className="home-avatar-button" aria-label="User profile">
          {avatarLabel.toUpperCase()}
        </button>
      </div>
    </header>
  );
}
