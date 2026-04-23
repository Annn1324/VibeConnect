import './styles/index.css';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navItems, sampleMatches, sampleTrends } from './Home.data';
import HomeComposer from '../../components/home/HomeComposer';
import HomeFeed from '../../components/home/HomeFeed';
import HomeRightbar from '../../components/home/HomeRightbar';
import HomeSidebar from '../../components/home/HomeSidebar';
import HomeTopbar from '../../components/home/HomeTopbar';
import { clearAuthSession, getStoredUser } from '../../services/authStorage';
import {
  createLike,
  createPost,
  deleteLike,
  deletePost,
  getPosts,
} from '../../services/postService';

const DEFAULT_ERROR_MESSAGE = 'Could not load posts right now.';

export default function Home() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [deletingPostId, setDeletingPostId] = useState('');
  const [likingPostId, setLikingPostId] = useState('');

  const handleAuthFailure = useCallback(() => {
    clearAuthSession();
    navigate('/login', { replace: true });
  }, [navigate]);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getPosts();
      setPosts(data.data || []);
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
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async (content) => {
    setIsPosting(true);

    try {
      const newPost = await createPost(content);
      setPosts((currentPosts) => [newPost, ...currentPosts]);
      return newPost;
    } catch (createError) {
      if (createError.status === 401) {
        handleAuthFailure();
        return null;
      }

      throw createError;
    } finally {
      setIsPosting(false);
    }
  };

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
    <div className="home-page">
      <div className="home-shell">
        <HomeSidebar navItems={navItems} />

        <section className="home-content">
          <HomeTopbar user={user} />

          <div className="home-main-canvas">
            <div className="home-feed-column">
              <HomeComposer user={user} isSubmitting={isPosting} onSubmit={handleCreatePost} />
              <HomeFeed
                posts={posts}
                isLoading={isLoading}
                error={error}
                onRetry={loadPosts}
                onDelete={handleDeletePost}
                onToggleLike={handleToggleLike}
                deletingPostId={deletingPostId}
                likingPostId={likingPostId}
              />
            </div>

            <HomeRightbar trends={sampleTrends} matches={sampleMatches} />
          </div>
        </section>
      </div>
    </div>
  );
}
