import './Home.css';
import brandIcon from '../../assets/icon.svg';
import searchIcon from '../../assets/search-icon.png';
import homeIcon from '../../assets/home-icon.png';
import exploreIcon from '../../assets/explore-icon.png';
import messagesIcon from '../../assets/messages-icon.png';
import notificationsIcon from '../../assets/notifications-icon.png';
import profileIcon from '../../assets/profile-icon.png';

const navItems = [
  { label: 'Home', active: true, icon: homeIcon },
  { label: 'Explore', active: false, icon: exploreIcon },
  { label: 'Messages', active: false, icon: messagesIcon },
  { label: 'Notifications', active: false, icon: notificationsIcon },
  { label: 'Profile', active: false, icon: profileIcon },
];

const trends = [
  { category: 'ARCHITECTURE', tag: '#CyberBrutalism2024', meta: '12.4k vibes this hour' },
  { category: 'WELLNESS', tag: '#MindfulKinetic', meta: '8.2k vibes this hour' },
];

const matches = [
  { name: 'Sarah Jenkins', meta: 'Vibing with Interface Systems', initial: 'S' },
  { name: 'David Chen', meta: 'Vibing with Neural Arts', initial: 'D' },
];

const posts = [
  {
    author: 'Elena Valerius',
    role: 'Digital Architect',
    time: '2h ago',
    text:
      'Exploring the intersection of kinetic light and brutalist rhythm. The pulse of the city feels sharper tonight.',
    image: true,
    badges: ['Media', 'Vibe'],
    stats: { pulses: '842', likes: '24', comments: '12' },
  },
  {
    author: 'Marcus Chen',
    role: 'Community Pulse',
    time: '5h ago',
    text:
      "Connectivity is not about the technology we use, it's about the energy we transfer.",
    image: false,
    badges: ['Insight', 'Philosophy'],
    stats: { pulses: '318', likes: '11', comments: '4' },
  },
];

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-app">
        <aside className="home-sidebar">
          <div className="home-brand">
            <img src={brandIcon} alt="VibeConnect logo" className="home-brand-icon" />
            <div>
              <h1 className="home-brand-title">
                <span className="home-brand-vibe">Vibe</span>
                <span className="home-brand-connect">Connect</span>
              </h1>
              <p>Pulse your people</p>
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

          <div className="home-sidebar-card">
            <p className="home-sidebar-label">Quick Mood</p>
            <h2>Today feels focused.</h2>
            <p className="home-sidebar-copy">
              Keep your corner of the network calm, sharp, and a little experimental.
            </p>
          </div>
        </aside>

        <main className="home-main">
          <header className="home-topbar">
            <div className="home-search">
              <img src={searchIcon} alt="" className="home-search-icon" />
              <input type="text" placeholder="Search the pulse..." />
            </div>

            <div className="home-top-actions">
              <button type="button" className="home-icon-button">
                O
              </button>
              <button type="button" className="home-icon-button">
                ?
              </button>
              <button type="button" className="home-avatar-button">
                J
              </button>
            </div>
          </header>

          <section className="home-composer">
            <div className="home-avatar">A</div>
            <div className="home-composer-body">
              <textarea placeholder="Share your kinetic pulse..." rows="3" />
              <div className="home-composer-footer">
                <div className="home-chip-row">
                  <button type="button" className="home-chip">
                    Media
                  </button>
                  <button type="button" className="home-chip">
                    Vibe
                  </button>
                </div>
                <button type="button" className="home-primary-button">
                  Post
                </button>
              </div>
            </div>
          </section>

          <section className="home-feed">
            {posts.map((post) => (
              <article key={`${post.author}-${post.time}`} className="home-post">
                <div className="home-post-header">
                  <div className="home-post-author">
                    <div className="home-post-avatar">{post.author[0]}</div>
                    <div>
                      <h3>{post.author}</h3>
                      <p>{post.role} - {post.time}</p>
                    </div>
                  </div>
                  <button type="button" className="home-post-menu">
                    ...
                  </button>
                </div>

                <p className="home-post-copy">{post.text}</p>

                {post.image ? <div className="home-post-media" /> : null}

                <div className="home-chip-row">
                  {post.badges.map((badge) => (
                    <span key={badge} className="home-chip home-chip-static">
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="home-post-footer">
                  <span>{post.stats.pulses} Pulses</span>
                  <div className="home-post-metrics">
                    <span>{post.stats.likes} Likes</span>
                    <span>{post.stats.comments} Comments</span>
                    <button type="button">Share</button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>

        <aside className="home-rightbar">
          <section className="home-panel">
            <div className="home-panel-header">
              <h2>Trending Now</h2>
              <button type="button">View</button>
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
          </section>

          <section className="home-panel home-panel-soft">
            <div className="home-panel-header">
              <h2>Pulse Matches</h2>
              <button type="button">Add</button>
            </div>

            <div className="home-match-list">
              {matches.map((match) => (
                <div key={match.name} className="home-match-item">
                  <div className="home-match-avatar">{match.initial}</div>
                  <div className="home-match-copy">
                    <strong>{match.name}</strong>
                    <p>{match.meta}</p>
                  </div>
                  <button type="button" className="home-match-action">
                    +
                  </button>
                </div>
              ))}
            </div>
          </section>

          <button type="button" className="home-fab">
            +
          </button>
        </aside>
      </div>
    </div>
  );
}
