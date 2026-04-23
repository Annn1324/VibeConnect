import heartIcon from '../../assets/heart-icon.png';
import commentIcon from '../../assets/comment-icon.png';
import shareIcon from '../../assets/share-icon.png';

const formatTimeAgo = (value) => {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 'Just now';
  }

  const diffInMinutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
};

function HomePostCard({ post, onDelete, onToggleLike, deletingPostId, likingPostId }) {
  const authorName = post.author.fullname || post.author.username || 'Unknown user';
  const authorHandle = post.author.username ? `@${post.author.username}` : 'member';
  const isDeleting = deletingPostId === post.id;
  const isUpdatingLike = likingPostId === post.id;
  const badges = [post.likedByMe ? 'Liked' : 'Fresh', `${post.stats.comments} comments`];

  return (
    <article className="home-post">
      <div className="home-post-header">
        <div className="home-post-author">
          <div className="home-post-avatar">{authorName[0]?.toUpperCase() || 'U'}</div>
          <div>
            <h3>{authorName}</h3>
            <p>
              {authorHandle} | {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        {post.isOwner ? (
          <button
            type="button"
            className="home-post-menu"
            onClick={() => onDelete(post.id)}
            disabled={isDeleting}
          >
            {isDeleting ? '...' : 'Delete'}
          </button>
        ) : null}
      </div>

      <p className="home-post-copy">{post.content}</p>

      <div className="home-chip-row">
        {badges.map((badge) => (
          <span key={badge} className="home-chip home-chip-static">
            {badge}
          </span>
        ))}
      </div>

      <div className="home-post-footer">
        <div className="home-post-pulse">
          <span className="home-pulse-dot home-pulse-dot-primary" />
          <span className="home-pulse-dot home-pulse-dot-secondary" />
          <span>{post.likedByMe ? 'You liked this post' : 'Fresh in the feed'}</span>
        </div>

        <div className="home-post-metrics">
          <button
            type="button"
            className={`home-post-metric home-post-like${post.likedByMe ? ' is-active' : ''}`}
            onClick={() => onToggleLike(post)}
            disabled={isUpdatingLike}
          >
            <img src={heartIcon} alt="" className="home-metric-icon" />
            <span>{post.stats.likes}</span>
          </button>
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

export default function HomeFeed({
  posts,
  isLoading,
  error,
  onRetry,
  onDelete,
  onToggleLike,
  deletingPostId,
  likingPostId,
}) {
  if (isLoading) {
    return <section className="home-feed home-feed-state">Loading posts...</section>;
  }

  if (error) {
    return (
      <section className="home-feed home-feed-state">
        <p>{error}</p>
        <button type="button" className="home-primary-button" onClick={onRetry}>
          Retry
        </button>
      </section>
    );
  }

  if (!posts.length) {
    return <section className="home-feed home-feed-state">No posts yet. Be the first to share.</section>;
  }

  return (
    <section className="home-feed">
      {posts.map((post) => (
        <HomePostCard
          key={post.id}
          post={post}
          onDelete={onDelete}
          onToggleLike={onToggleLike}
          deletingPostId={deletingPostId}
          likingPostId={likingPostId}
        />
      ))}
    </section>
  );
}
