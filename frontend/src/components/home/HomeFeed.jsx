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
  const author = post.author || {};
  const stats = post.stats || { likes: 0, comments: 0, shares: 0 };
  const shareCount = stats.shares || 0;
  const authorName = author.fullname || author.username || 'Unknown user';
  const authorHandle = author.username ? `@${author.username}` : 'member';
  const isDeleting = deletingPostId === post.id;
  const isUpdatingLike = likingPostId === post.id;
  const badges = [`${stats.likes} likes`, `${stats.comments} comments`, `${shareCount} shares`];

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

      {post.media?.url ? (
        <div className="home-post-media">
          {post.media.resourceType === 'video' ? (
            <video src={post.media.url} controls preload="metadata" />
          ) : (
            <img src={post.media.url} alt="" loading="lazy" />
          )}
        </div>
      ) : null}

      <div className="home-chip-row">
        {badges.map((badge) => (
          <span key={badge} className="home-chip home-chip-static">
            {badge}
          </span>
        ))}
      </div>

      <div className="home-post-footer">
        <div className="home-post-metrics">
          <button
            type="button"
            className={`home-post-metric home-post-like${post.likedByMe ? ' is-active' : ''}`}
            onClick={() => onToggleLike(post)}
            disabled={isUpdatingLike}
          >
            <svg
              viewBox="0 0 24 24"
              className="home-metric-icon home-heart-icon"
              aria-hidden="true"
            >
              <path
                d="M12 21s-6.716-4.35-9.429-8.162C.505 9.95 1.39 5.8 5.087 4.397c2.179-.827 4.457.046 5.913 1.95 1.456-1.904 3.734-2.777 5.913-1.95 3.697 1.403 4.582 5.553 2.516 8.44C18.716 16.65 12 21 12 21z"
                fill={post.likedByMe ? '#ef4444' : 'none'}
                stroke={post.likedByMe ? '#ef4444' : 'currentColor'}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="home-post-metric">
            <img src={commentIcon} alt="" className="home-metric-icon" />
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
    return <section className="home-feed home-feed-state">Đang tải...</section>;
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
    return <section className="home-feed home-feed-state">Chưa có bài viết. Bạn hãy chia sẻ khoảng khắc của mình.</section>;
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
