import heartIcon from '../../assets/heart-icon.png';
import commentIcon from '../../assets/comment-icon.png';
import shareIcon from '../../assets/share-icon.png';

function HomePostCard({ post }) {
  return (
    <article className="home-post">
      <div className="home-post-header">
        <div className="home-post-author">
          <div className="home-post-avatar">{post.author[0]}</div>
          <div>
            <h3>{post.author}</h3>
            <p>
              {post.role} | {post.time}
            </p>
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
        <div className="home-post-pulse">
          <span className="home-pulse-dot home-pulse-dot-primary" />
          <span className="home-pulse-dot home-pulse-dot-secondary" />
          <span>{post.stats.pulses} Pulses</span>
        </div>

        <div className="home-post-metrics">
          <span className="home-post-metric">
            <img src={heartIcon} alt="" className="home-metric-icon" />
            <span>{post.stats.likes}</span>
          </span>
          <span className="home-post-metric">
            <img src={commentIcon} alt="" className="home-metric-icon" />
            <span>{post.stats.comments}</span>
          </span>
          <button type="button" className="home-post-share">
            <img src={shareIcon} alt="" className="home-metric-icon" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function HomeFeed({ posts }) {
  return (
    <section className="home-feed">
      {posts.map((post) => (
        <HomePostCard key={`${post.author}-${post.time}`} post={post} />
      ))}
    </section>
  );
}
