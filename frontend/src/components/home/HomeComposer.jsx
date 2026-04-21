export default function HomeComposer() {
  return (
    <section className="home-composer">
      <div className="home-avatar">A</div>
      <div className="home-composer-body">
        <textarea placeholder="Share your kinetic pulse..." rows="3" />
        <div className="home-composer-footer">
          <div className="home-chip-row">
            <button type="button" className="home-chip home-chip-media">
              Media
            </button>
            <button type="button" className="home-chip home-chip-vibe">
              Vibe
            </button>
          </div>
          <button type="button" className="home-primary-button">
            Post
          </button>
        </div>
      </div>
    </section>
  );
}
