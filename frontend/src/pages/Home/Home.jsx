import './styles/index.css';
import { navItems, sampleMatches, samplePosts, sampleTrends } from './Home.data';
import HomeComposer from '../../components/home/HomeComposer';
import HomeFeed from '../../components/home/HomeFeed';
import HomeRightbar from '../../components/home/HomeRightbar';
import HomeSidebar from '../../components/home/HomeSidebar';
import HomeTopbar from '../../components/home/HomeTopbar';

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-shell">
        <HomeSidebar navItems={navItems} />

        <section className="home-content">
          <HomeTopbar />

          <div className="home-main-canvas">
            <div className="home-feed-column">
              <HomeComposer />
              <HomeFeed posts={samplePosts} />
            </div>

            <HomeRightbar trends={sampleTrends} matches={sampleMatches} />
          </div>
        </section>
      </div>
    </div>
  );
}
