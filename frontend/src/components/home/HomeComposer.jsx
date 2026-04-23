import { useState } from 'react';

const MAX_POST_LENGTH = 500;

export default function HomeComposer({ user, isSubmitting, onSubmit }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const avatarLabel = user?.username?.[0] || user?.fullname?.[0] || user?.email?.[0] || 'U';

  const handlePublish = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError('Write something before posting.');
      return;
    }

    try {
      setError('');
      await onSubmit(trimmedContent);
      setContent('');
    } catch (submitError) {
      setError(submitError.message || 'Could not publish post.');
    }
  };

  return (
    <section className="home-composer">
      <div className="home-avatar">{avatarLabel.toUpperCase()}</div>
      <form className="home-composer-body" onSubmit={handlePublish}>
        <textarea
          placeholder="Share your kinetic pulse..."
          rows="3"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (error) {
              setError('');
            }
          }}
          maxLength={MAX_POST_LENGTH}
        />
        <div className="home-composer-footer">
          <div className="home-chip-row">
            <span className="home-chip home-chip-static">@{user?.username || 'guest'}</span>
            <span className="home-chip home-chip-vibe">{content.trim().length}/{MAX_POST_LENGTH}</span>
          </div>
          <button type="submit" className="home-primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
        {error ? <p className="home-composer-error">{error}</p> : null}
      </form>
    </section>
  );
}
