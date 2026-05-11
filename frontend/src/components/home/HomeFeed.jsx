import { useEffect, useState } from 'react';
import commentIcon from '../../assets/comment-icon.png';
import shareIcon from '../../assets/share-icon.png';
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from '../../services/commentService';

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

function HomePostCard({
  post,
  onDelete,
  onToggleLike,
  onToggleComments,
  deletingPostId,
  likingPostId,
}) {
  const author = post.author || {};
  const stats = post.stats || { likes: 0, comments: 0, shares: 0 };
  const mediaItems = Array.isArray(post.media) ? post.media : (post.media?.url ? [post.media] : []);
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

      {mediaItems.length ? (
        <div className={`home-post-media-grid home-post-media-count-${Math.min(mediaItems.length, 4)}`}>
          {mediaItems.map((mediaItem) => (
            <div key={mediaItem.publicId || mediaItem.url} className="home-post-media">
              {mediaItem.resourceType === 'video' ? (
                <video src={mediaItem.url} controls preload="metadata" />
              ) : (
                <img src={mediaItem.url} alt="" loading="lazy" />
              )}
            </div>
          ))}
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
          <button
            type="button"
            className="home-post-metric home-comment-toggle"
            onClick={() => onToggleComments(post)}
          >
            <img src={commentIcon} alt="" className="home-metric-icon" />
          </button>
          <button type="button" className="home-post-share">
            <img src={shareIcon} alt="" className="home-metric-icon" />
          </button>
        </div>
      </div>

    </article>
  );
}

function CommentDialog({ post, onClose, onCommentCountChange }) {
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState('');
  const [likedCommentIds, setLikedCommentIds] = useState([]);
  const author = post?.author || {};
  const authorName = author.fullname || author.username || 'Unknown user';
  const authorHandle = author.username ? `@${author.username}` : 'member';
  const mediaItems = Array.isArray(post.media) ? post.media : (post.media?.url ? [post.media] : []);

  useEffect(() => {
    let isMounted = true;

    const loadComments = async () => {
      setIsLoadingComments(true);
      setCommentError('');

      try {
        const data = await getCommentsByPostId(post.id);

        if (isMounted) {
          setComments(data.data || []);
        }
      } catch (loadError) {
        if (isMounted) {
          setCommentError(loadError.message || 'Could not load comments.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingComments(false);
        }
      }
    };

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [post.id]);

  const handleCreateComment = async (event) => {
    event.preventDefault();
    const trimmedContent = commentContent.trim();

    if (!trimmedContent) {
      setCommentError('Please write a comment first.');
      return;
    }

    setIsSubmittingComment(true);
    setCommentError('');

    try {
      const newComment = await createComment(post.id, trimmedContent);
      setComments((currentComments) => [newComment, ...currentComments]);
      setCommentContent('');
      onCommentCountChange(post.id, 1);
    } catch (createError) {
      setCommentError(createError.message || 'Could not publish comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeletingCommentId(commentId);
    setCommentError('');

    try {
      await deleteComment(commentId);
      setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId));
      onCommentCountChange(post.id, -1);
    } catch (deleteError) {
      setCommentError(deleteError.message || 'Could not delete comment.');
    } finally {
      setDeletingCommentId('');
    }
  };

  const handleToggleCommentLike = (commentId) => {
    setLikedCommentIds((currentIds) =>
      currentIds.includes(commentId)
        ? currentIds.filter((currentId) => currentId !== commentId)
        : [...currentIds, commentId],
    );
  };

  return (
    <div className="home-comment-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="home-comment-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Post comments"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="home-comment-dialog-header">
          <div>
            <h2>{authorName}</h2>
            <p>
              {authorHandle} | {formatTimeAgo(post.createdAt)}
            </p>
          </div>
          <button type="button" className="home-comment-close" onClick={onClose} aria-label="Close comments">
            x
          </button>
        </header>

        <p className="home-post-copy home-comment-dialog-copy">{post.content}</p>

        {mediaItems.length ? (
          <div className={`home-post-media-grid home-comment-dialog-media home-post-media-count-${Math.min(mediaItems.length, 4)}`}>
            {mediaItems.map((mediaItem) => (
              <div key={mediaItem.publicId || mediaItem.url} className="home-post-media">
                {mediaItem.resourceType === 'video' ? (
                  <video src={mediaItem.url} controls preload="metadata" />
                ) : (
                  <img src={mediaItem.url} alt="" loading="lazy" />
                )}
              </div>
            ))}
          </div>
        ) : null}

        <div className="home-chip-row home-comment-dialog-stats">
          <span className="home-chip home-chip-static">{post.stats?.likes || 0} likes</span>
          <span className="home-chip home-chip-static">{post.stats?.comments || 0} comments</span>
        </div>

        <form className="home-comment-form" onSubmit={handleCreateComment}>
          <input
            type="text"
            value={commentContent}
            maxLength="300"
            placeholder="Write a comment..."
            onChange={(event) => {
              setCommentContent(event.target.value);
              if (commentError) {
                setCommentError('');
              }
            }}
          />
          <button type="submit" className="home-primary-button" disabled={isSubmittingComment}>
            {isSubmittingComment ? 'Sending...' : 'Send'}
          </button>
        </form>

        {commentError ? <p className="home-comment-error">{commentError}</p> : null}

        <div className="home-comment-list home-comment-dialog-list">
          {isLoadingComments ? (
            <p className="home-comment-state">Loading comments...</p>
          ) : comments.length ? (
            comments.map((comment) => {
              const commentAuthor = comment.author || {};
              const commentAuthorName =
                commentAuthor.fullname || commentAuthor.username || 'Unknown user';

              return (
                <article key={comment.id} className="home-comment">
                  <div className="home-comment-avatar">
                    {commentAuthorName[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="home-comment-body">
                    <div className="home-comment-header">
                      <strong>{commentAuthorName}</strong>
                      <span>{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                    <div className="home-comment-actions">
                      <button
                        type="button"
                        className={`home-comment-like${likedCommentIds.includes(comment.id) ? ' is-active' : ''}`}
                        onClick={() => handleToggleCommentLike(comment.id)}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="home-comment-like-icon"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 21s-6.716-4.35-9.429-8.162C.505 9.95 1.39 5.8 5.087 4.397c2.179-.827 4.457.046 5.913 1.95 1.456-1.904 3.734-2.777 5.913-1.95 3.697 1.403 4.582 5.553 2.516 8.44C18.716 16.65 12 21 12 21z"
                            fill={likedCommentIds.includes(comment.id) ? '#ef4444' : 'none'}
                            stroke={likedCommentIds.includes(comment.id) ? '#ef4444' : 'currentColor'}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{likedCommentIds.includes(comment.id) ? 1 : 0}</span>
                      </button>
                      {comment.isOwner ? (
                        <button
                          type="button"
                          className="home-comment-delete"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deletingCommentId === comment.id}
                        >
                          {deletingCommentId === comment.id ? '...' : 'Delete'}
                        </button>
                      ) : null}
                    </div>
                  </article>
                );
            })
          ) : (
            <p className="home-comment-state">No comments yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default function HomeFeed({
  posts,
  isLoading,
  error,
  onRetry,
  onDelete,
  onToggleLike,
  onCommentCountChange,
  deletingPostId,
  likingPostId,
}) {
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  const handleOpenComments = (post) => {
    setActiveCommentPost(post);
  };

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
    <>
      <section className="home-feed">
        {posts.map((post) => (
          <HomePostCard
            key={post.id}
            post={post}
            onDelete={onDelete}
            onToggleLike={onToggleLike}
            onToggleComments={handleOpenComments}
            deletingPostId={deletingPostId}
            likingPostId={likingPostId}
          />
        ))}
      </section>

      {activeCommentPost ? (
        <CommentDialog
          post={activeCommentPost}
          onClose={() => setActiveCommentPost(null)}
          onCommentCountChange={onCommentCountChange}
        />
      ) : null}
    </>
  );
}
