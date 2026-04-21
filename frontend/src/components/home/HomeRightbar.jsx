import trendingIcon from '../../assets/trending-icon.png';
import connectActionIcon from '../../assets/addfr-icon.png';

export default function HomeRightbar({ trends, matches }) {
  return (
    <aside className="home-rightbar">
      <section className="home-panel">
        <div className="home-panel-header">
          <h2>Trending Now</h2>
          <button type="button" className="home-panel-icon-button" aria-label="Open trending">
            <img src={trendingIcon} alt="" className="home-panel-icon" />
          </button>
        </div>

        <div className="home-trends">
          {trends.map((trend) => (
            <div key={trend.tag} className="home-trend-item">
              <span>{trend.category}</span>
              <strong>{trend.tag}</strong>
              <p>{trend.meta}</p>
            </div>
          ))}
        </div>

        <button type="button" className="home-panel-link">
          Explore Trends
        </button>
      </section>

      <section className="home-panel home-panel-soft">
        <div className="home-panel-header">
          <h2>Pulse Matches</h2>
        </div>

        <div className="home-match-list">
          {matches.map((match) => (
            <div key={match.name} className="home-match-item">
              <div className="home-match-avatar">{match.initial}</div>
              <div className="home-match-copy">
                <strong>{match.name}</strong>
                <p>{match.meta}</p>
              </div>
              <button
                type="button"
                className="home-match-action"
                aria-label="Connect with this profile"
              >
                <img src={connectActionIcon} alt="" className="home-match-icon" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <button type="button" className="home-fab">
        +
      </button>
    </aside>
  );
}
