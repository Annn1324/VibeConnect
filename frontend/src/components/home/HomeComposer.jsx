import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import pictureIcon from '../../assets/picture-icon.png';
import videoIcon from '../../assets/video-icon.png';

const MIN_COMPOSER_HEIGHT = 32;
const MAX_COMPOSER_HEIGHT = 120;

export default function HomeComposer({ user, isSubmitting, onSubmit }) {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const avatarLabel = user?.username?.[0] || user?.fullname?.[0] || user?.email?.[0] || 'U';
  const mediaPreviews = useMemo(() => mediaFiles.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  })), [mediaFiles]);

  useEffect(() => {
    return () => {
      mediaPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [mediaPreviews]);

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
      await onSubmit(trimmedContent, mediaFiles);
      setContent('');
      setMediaFiles([]);
    } catch (submitError) {
      setError(submitError.message || 'Không thể đăng bài.');
    }
  };

  const addMediaFiles = (selectedFiles) => {
    const files = selectedFiles.slice(0, 4);

    if (!files.length) {
      return;
    }

    setError('');
    setMediaFiles((currentFiles) => {
      const availableSlots = Math.max(0, 4 - currentFiles.length);
      const nextFiles = [...currentFiles, ...files.slice(0, availableSlots)];

      if (files.length > availableSlots) {
        setError('Bạn chỉ có thể đăng tối đa 4 ảnh hoặc video.');
      }

      return nextFiles;
    });
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
            {mediaFiles.length ? (
              <span className="home-chip home-chip-static">{mediaFiles.length}/4 media</span>
            ) : null}
          </div>
          {mediaPreviews.length ? (
            <div className="home-composer-previews">
              {mediaPreviews.map(({ file, url }) => (
                <div key={`${file.name}-${file.lastModified}`} className="home-composer-preview">
                  {file.type.startsWith('video/') ? (
                    <video src={url} muted preload="metadata" />
                  ) : (
                    <img src={url} alt="" />
                  )}
                  <button
                    type="button"
                    className="home-composer-remove"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => {
                      setMediaFiles((currentFiles) => currentFiles.filter((item) => item !== file));
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <div className="home-composer-actions">
            <label
              className="home-icon-button home-composer-tool"
              aria-label="Add image"
              htmlFor="home-image-input"
            >
              <img src={pictureIcon} alt="" className="home-action-icon" />
            </label>
            <label
              className="home-icon-button home-composer-tool"
              aria-label="Add video"
              htmlFor="home-video-input"
            >
              <img src={videoIcon} alt="" className="home-action-icon" />
            </label>
            <button type="submit" className="home-primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
        {error ? <p className="home-composer-error">{error}</p> : null}
      </form>
      <input
        id="home-image-input"
        type="file"
        accept="image/*"
        multiple
        className="home-file-input"
        onChange={(event) => {
          addMediaFiles(Array.from(event.target.files || []));
          event.target.value = '';
        }}
      />
      <input
        id="home-video-input"
        type="file"
        accept="video/*"
        multiple
        className="home-file-input"
        onChange={(event) => {
          addMediaFiles(Array.from(event.target.files || []));
          event.target.value = '';
        }}
      />
    </section>
  );
}
