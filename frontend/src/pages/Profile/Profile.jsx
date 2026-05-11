import './Profile.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeFeed from '../../components/home/HomeFeed';
import HomeSidebar from '../../components/home/HomeSidebar';
import HomeTopbar from '../../components/home/HomeTopbar';
import { navItems } from '../Home/Home.data';
import { clearAuthSession, getStoredUser } from '../../services/authStorage';
import { getCurrentUser } from '../../services/authService';
import { createLike, deleteLike, deletePost, getMyPosts } from '../../services/postService';
import { connectSocket } from '../../services/socketService';

const DEFAULT_ERROR_MESSAGE = 'Could not load your profile right now.';

const getInitial = (user) =>
  (user?.fullname?.[0] || user?.username?.[0] || user?.email?.[0] || 'U').toUpperCase();

const formatJoinDate = (value) => {
  if (!value) {
    return 'New member';
  }

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 'New member';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(timestamp));
};

export default function Profile() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const [user, setUser] = useState(storedUser);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingPostId, setDeletingPostId] = useState('');
  const [likingPostId, setLikingPostId] = useState('');

  // Nếu token hết hạn hoặc không hợp lệ, xoá phiên đăng nhập và đưa user về login.
  const handleAuthFailure = useCallback(() => {
    clearAuthSession();
    navigate('/login', { replace: true });
  }, [navigate]);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      // Lấy thông tin user và bài viết cá nhân cùng lúc để trang tải nhanh hơn.
      const [currentUser, myPosts] = await Promise.all([
        getCurrentUser(),
        getMyPosts(1, 50),
      ]);

      setUser(currentUser);
      setPosts(myPosts.data || []);
    } catch (loadError) {
      if (loadError.status === 401) {
        handleAuthFailure();
        return;
      }

      setError(loadError.message || DEFAULT_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthFailure]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    const socket = connectSocket();

    // Khi người khác like/unlike bài của mình, cập nhật số like ngay trên profile.
    const handleLikeChanged = ({ postId, delta, actorId }) => {
      if (!postId || actorId === user?.id) {
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === postId
            ? {
                ...currentPost,
                stats: {
                  ...currentPost.stats,
                  likes: Math.max(0, (currentPost.stats?.likes || 0) + delta),
                },
              }
            : currentPost,
        ),
      );
    };

    socket.on('post:like-changed', handleLikeChanged);

    return () => {
      socket.off('post:like-changed', handleLikeChanged);
    };
  }, [user?.id]);

  // Tính thống kê hiển thị trên header từ danh sách bài viết đã tải.
  const profileStats = useMemo(() => {
    const totals = posts.reduce(
      (acc, post) => {
        acc.likes += post.stats?.likes || 0;
        acc.comments += post.stats?.comments || 0;
        acc.media += Array.isArray(post.media) ? post.media.length : 0;
        return acc;
      },
      { likes: 0, comments: 0, media: 0 },
    );

    return [
      { label: 'Posts', value: posts.length },
      { label: 'Likes', value: totals.likes },
      { label: 'Comments', value: totals.comments },
      { label: 'Media', value: totals.media },
    ];
  }, [posts]);

  // Xoá bài thành công thì cập nhật lại UI ngay, không cần gọi lại toàn bộ danh sách.
  const handleDeletePost = async (postId) => {
    setDeletingPostId(postId);

    try {
      await deletePost(postId);
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    } catch (deleteError) {
      if (deleteError.status === 401) {
        handleAuthFailure();
      }
    } finally {
      setDeletingPostId('');
    }
  };

  // Like/unlike được cập nhật optimistic nhẹ để người dùng thấy phản hồi ngay.
  const handleToggleLike = async (post) => {
    setLikingPostId(post.id);

    try {
      if (post.likedByMe && post.viewerLikeId) {
        await deleteLike(post.viewerLikeId);
        setPosts((currentPosts) =>
          currentPosts.map((currentPost) =>
            currentPost.id === post.id
              ? {
                  ...currentPost,
                  likedByMe: false,
                  viewerLikeId: null,
                  stats: {
                    ...currentPost.stats,
                    likes: Math.max(0, currentPost.stats.likes - 1),
                  },
                }
              : currentPost,
          ),
        );
        return;
      }

      const like = await createLike(post.id);
      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? {
                ...currentPost,
                likedByMe: true,
                viewerLikeId: like._id,
                stats: {
                  ...currentPost.stats,
                  likes: currentPost.stats.likes + 1,
                },
              }
            : currentPost,
        ),
      );
    } catch (likeError) {
      if (likeError.status === 401) {
        handleAuthFailure();
      }
    } finally {
      setLikingPostId('');
    }
  };

  return (
    <div className="home-page profile-page">
      <div className="home-shell">
        <HomeSidebar navItems={navItems} />

        <section className="home-content">
          <HomeTopbar user={user} />

          <main className="profile-canvas">
            <section className="profile-column">
              <header className="profile-hero">
                <div className="profile-cover" />
                <div className="profile-summary">
                  <div className="profile-avatar">{getInitial(user)}</div>
                  <div className="profile-identity">
                    <h2>{user?.fullname || 'Your profile'}</h2>
                    <p>{user?.username ? `@${user.username}` : user?.email || 'Signed in'}</p>
                  </div>
                </div>
                <p className="profile-bio">
                  Share your thoughts, collect your best posts, and let people catch the vibe you
                  are building.
                </p>
                <div className="profile-meta">
                  <span>{user?.email || 'No email'}</span>
                  <span>Joined {formatJoinDate(user?.createdAt)}</span>
                </div>
              </header>

              <section className="profile-stats" aria-label="Profile stats">
                {profileStats.map((item) => (
                  <div key={item.label} className="profile-stat">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </section>

              <div className="profile-section-heading">
                <h2>Your posts</h2>
                <button type="button" className="home-primary-button" onClick={loadProfile}>
                  Refresh
                </button>
              </div>

              <HomeFeed
                posts={posts}
                isLoading={isLoading}
                error={error}
                onRetry={loadProfile}
                onDelete={handleDeletePost}
                onToggleLike={handleToggleLike}
                deletingPostId={deletingPostId}
                likingPostId={likingPostId}
              />
            </section>
          </main>
        </section>
      </div>
    </div>
  );
}
