import { useLayoutEffect, useRef, useState } from 'react';
import pictureIcon from '../../assets/picture-icon.png';
import videoIcon from '../../assets/video-icon.png';

const MIN_COMPOSER_HEIGHT = 32;
const MAX_COMPOSER_HEIGHT = 120;

export default function HomeComposer({ user, isSubmitting, onSubmit }) {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const avatarLabel = user?.username?.[0] || user?.fullname?.[0] || user?.email?.[0] || 'U';

  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    if (!content) {
      textarea.style.height = `${MIN_COMPOSER_HEIGHT}px`;
      textarea.style.overflowY = 'hidden';
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(
      Math.max(textarea.scrollHeight, MIN_COMPOSER_HEIGHT),
      MAX_COMPOSER_HEIGHT,
    )}px`;
    textarea.style.overflowY = textarea.scrollHeight > MAX_COMPOSER_HEIGHT ? 'auto' : 'hidden';
  }, [content]);

  const handlePublish = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError('Hãy chia sẻ suy nghĩ của bạn');
      return;
    }

    try {
      setError('');
      await onSubmit(trimmedContent, mediaFile);
      setContent('');
      setMediaFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    } catch (submitError) {
      setError(submitError.message || 'Không thể đăng bài.');
    }
  };

  const handleMediaChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError('');
    setMediaFile(file);
  };

  return (
    <section className="home-composer">
      <div className="home-avatar">{avatarLabel.toUpperCase()}</div>
      <form className="home-composer-body" onSubmit={handlePublish}>
        <textarea
          ref={textareaRef}
          placeholder="Chia sẻ suy nghĩ của bạn..."
          rows="1"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (error) {
              setError('');
            }
          }}
        />
        <div className="home-composer-footer">
          <div className="home-chip-row">
            <span className="home-chip home-chip-static">@{user?.username || 'guest'}</span>
            {mediaFile ? (
              <button
                type="button"
                className="home-chip home-chip-media"
                onClick={() => {
                  setMediaFile(null);
                  if (imageInputRef.current) {
                    imageInputRef.current.value = '';
                  }
                  if (videoInputRef.current) {
                    videoInputRef.current.value = '';
                  }
                }}
              >
                {mediaFile.name}
              </button>
            ) : null}
          </div>
          <div className="home-composer-actions">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="home-file-input"
              onChange={handleMediaChange}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="home-file-input"
              onChange={handleMediaChange}
            />
            <button
              type="button"
              className="home-icon-button home-composer-tool"
              aria-label="Add image"
              onClick={() => imageInputRef.current?.click()}
            >
              <img src={pictureIcon} alt="" className="home-action-icon" />
            </button>
            <button
              type="button"
              className="home-icon-button home-composer-tool"
              aria-label="Add video"
              onClick={() => videoInputRef.current?.click()}
            >
              <img src={videoIcon} alt="" className="home-action-icon" />
            </button>
            <button type="submit" className="home-primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
        {error ? <p className="home-composer-error">{error}</p> : null}
      </form>
    </section>
  );
}
