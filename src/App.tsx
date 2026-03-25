import { useEffect, useRef, useState } from "react";

import {
  createInitialRouteState,
  goBack,
  navigate,
  type AppPage,
  type RouteParams
} from "./core/app-state";
import {
  addToHistory,
  categories,
  createInitialMediaState,
  dramas,
  getDramaById,
  getDramasByCategory,
  getHistoryWithDetails,
  getLatestDramas,
  getPopularDramas,
  isFavorite,
  toggleFavorite,
  type Category,
  type Drama,
  type Episode,
  type MediaState,
  type WatchHistoryDetails
} from "./data/media-library";

const FALLBACK_IMAGE = "assets/CodeBubbyAssets/3052_654/2.png";
const APP_LOGO = "assets/CodeBubbyAssets/3052_414/1.svg";
const HERO_MOSAIC_IMAGES = [
  "assets/CodeBubbyAssets/3099_737/2.png",
  "assets/CodeBubbyAssets/3099_737/3.png",
  "assets/CodeBubbyAssets/3099_737/4.png",
  "assets/CodeBubbyAssets/3099_737/5.png",
  "assets/CodeBubbyAssets/3099_737/6.png"
];

const CATEGORY_ICONS: Record<string, string> = {
  romance: "R",
  drama: "D",
  comedy: "C",
  action: "A",
  thriller: "T",
  "sci-fi": "SF",
  fantasy: "F"
};

const KEY_CODES = {
  enter: 13,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  escape: 27,
  back: 10009,
  exit: 10182,
  play: 415,
  pause: 19,
  fastForward: 417,
  rewind: 412
} as const;

interface RemoteKeyEventDetail {
  keyCode: number;
}

export default function App() {
  useAppScale();

  const [routeState, setRouteState] = useState(createInitialRouteState);
  const [mediaState, setMediaState] = useState(createInitialMediaState);
  const [isLoading, setIsLoading] = useState(true);

  const showHeader = routeState.currentPage === "detail" || routeState.currentPage === "player";
  const showMainNav = !showHeader;
  const currentDrama = routeState.currentParams.dramaId
    ? getDramaById(routeState.currentParams.dramaId)
    : undefined;
  const currentEpisode =
    currentDrama && routeState.currentParams.episodeId
      ? currentDrama.episodesList.find(
          (episode) => episode.id === routeState.currentParams.episodeId
        )
      : undefined;
  const historyItems = getHistoryWithDetails(mediaState);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (routeState.currentPage !== "player" || !currentDrama || !currentEpisode) {
      return;
    }

    setMediaState((currentState) =>
      addToHistory(currentState, currentDrama.id, currentEpisode.id)
    );
  }, [routeState.currentPage, currentDrama?.id, currentEpisode?.id]);

  const navigateTo = (page: AppPage, params: RouteParams = {}) => {
    setRouteState((currentState) => navigate(currentState, page, params));
  };

  const handleGoBack = () => {
    setRouteState((currentState) => goBack(currentState));
  };

  const handleToggleFavorite = (dramaId: number) => {
    setMediaState((currentState) => toggleFavorite(currentState, dramaId));
  };

  useRemoteControl(routeState.currentPage, handleGoBack);

  return (
    <>
      {isLoading ? <LoadingPage /> : null}

      <div id="app" className="app-container">
        {showMainNav ? (
          <MainNav activePage={routeState.currentPage} onNavigate={navigateTo} />
        ) : null}

        {showHeader ? (
          <PageHeader
            currentDrama={currentDrama}
            currentEpisode={currentEpisode}
            currentPage={routeState.currentPage}
            onBack={handleGoBack}
          />
        ) : null}

        <main id="page-container" className="page-container">
          <div
            id="home-page"
            className={getPageClassName(routeState.currentPage === "home")}
          >
            {routeState.currentPage === "home" ? (
              <HomePage
                mediaState={mediaState}
                onOpenDetail={(dramaId) => navigateTo("detail", { dramaId })}
                onOpenDiscover={() => navigateTo("discover")}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : null}
          </div>

          <div
            id="discover-page"
            className={getPageClassName(routeState.currentPage === "discover")}
          >
            {routeState.currentPage === "discover" ? (
              <DiscoverPage
                onNavigateHome={() => navigateTo("home")}
                onOpenDetail={(dramaId) => navigateTo("detail", { dramaId })}
              />
            ) : null}
          </div>

          <div
            id="detail-page"
            className={getPageClassName(routeState.currentPage === "detail")}
          >
            {routeState.currentPage === "detail" ? (
              <DetailPage
                currentDrama={currentDrama}
                isFavoriteDrama={
                  currentDrama ? isFavorite(mediaState, currentDrama.id) : false
                }
                onOpenDetail={(dramaId) => navigateTo("detail", { dramaId })}
                onPlayEpisode={(dramaId, episodeId) =>
                  navigateTo("player", { dramaId, episodeId })
                }
                onToggleFavorite={handleToggleFavorite}
              />
            ) : null}
          </div>

          <div
            id="player-page"
            className={getPageClassName(routeState.currentPage === "player")}
          >
            {routeState.currentPage === "player" ? (
              <PlayerPage
                currentDrama={currentDrama}
                currentEpisode={currentEpisode}
                onSelectEpisode={(dramaId, episodeId) =>
                  navigateTo("player", { dramaId, episodeId })
                }
              />
            ) : null}
          </div>

          <div
            id="history-page"
            className={getPageClassName(routeState.currentPage === "history")}
          >
            {routeState.currentPage === "history" ? (
              <HistoryPage
                historyItems={historyItems}
                onOpenDetail={(dramaId) => navigateTo("detail", { dramaId })}
              />
            ) : null}
          </div>

          <div
            id="settings-page"
            className={getPageClassName(routeState.currentPage === "settings")}
          >
            {routeState.currentPage === "settings" ? <SettingsPage /> : null}
          </div>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>GoMax Short - Free Short Drama Series, Anytime, Anywhere!</p>
            <p>Use arrow keys to navigate and OK/Enter to select</p>
          </div>
        </footer>
      </div>
    </>
  );
}

function LoadingPage() {
  return (
    <div id="loading-page" aria-hidden="true">
      <div className="loading-content">
        <div className="logo-container">
          <div className="logo-icon">
            <img src={APP_LOGO} alt="GoMax Short logo" />
          </div>
        </div>
        <h1 className="app-title">GoMax Short</h1>
      </div>
    </div>
  );
}

interface MainNavProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
}

function MainNav({ activePage, onNavigate }: MainNavProps) {
  return (
    <nav id="main-nav" className="main-nav">
      <div className="nav-logo">
        <img src={APP_LOGO} alt="GoMax" style={{ width: 40, height: 40 }} />
        <span className="logo-text">GoMax Short</span>
      </div>

      <ul className="nav-menu">
        <NavItem
          isActive={activePage === "home"}
          label="Home"
          onClick={() => onNavigate("home")}
        />
        <NavItem
          isActive={activePage === "discover"}
          label="Discover"
          onClick={() => onNavigate("discover")}
        />
        <NavItem
          isActive={activePage === "history"}
          label="My List"
          onClick={() => onNavigate("history")}
        />
        <NavItem
          isActive={activePage === "settings"}
          label="Categories"
          onClick={() => onNavigate("settings")}
        />
      </ul>
    </nav>
  );
}

interface NavItemProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

function NavItem({ isActive, label, onClick }: NavItemProps) {
  return (
    <li
      className={`nav-item${isActive ? " active" : ""}`}
      data-focusable="true"
      onClick={onClick}
    >
      <span className="nav-text">{label}</span>
    </li>
  );
}

interface PageHeaderProps {
  currentPage: AppPage;
  currentDrama?: Drama;
  currentEpisode?: Episode;
  onBack: () => void;
}

function PageHeader({
  currentDrama,
  currentEpisode,
  currentPage,
  onBack
}: PageHeaderProps) {
  return (
    <header id="page-header" className="page-header">
      <div className="page-header-left">
        <button
          className="back-button"
          data-focusable="true"
          id="page-header-back-btn"
          onClick={onBack}
          type="button"
        >
          <span id="page-header-back-text">&lt; Back</span>
        </button>
      </div>

      <div className="page-header-center">
        {currentPage === "detail" ? (
          <div className="nav-logo" id="page-header-logo">
            <img src={APP_LOGO} alt="GoMax" style={{ width: 40, height: 40 }} />
            <span className="logo-text">GoMax Short</span>
          </div>
        ) : (
          <div className="player-header-info" id="page-header-player-info">
            <h2 id="player-header-title">{currentDrama?.title ?? ""}</h2>
            <p id="player-header-episode-info">
              {currentEpisode ? `Episode ${currentEpisode.number}` : ""}
            </p>
          </div>
        )}
      </div>

      <div className="page-header-right" />
    </header>
  );
}

interface HomePageProps {
  mediaState: MediaState;
  onOpenDetail: (dramaId: number) => void;
  onOpenDiscover: () => void;
  onToggleFavorite: (dramaId: number) => void;
}

function HomePage({
  mediaState,
  onOpenDetail,
  onOpenDiscover,
  onToggleFavorite
}: HomePageProps) {
  const featuredDramas = getPopularDramas().slice(0, 4);

  return (
    <>
      <section className="home-hero">
        <div className="hero-mosaic" id="hero-mosaic">
          {HERO_MOSAIC_IMAGES.map((image) => (
            <img key={image} src={image} alt="" className="mosaic-img" />
          ))}
        </div>
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1 className="hero-title">Free Short Drama Series, Anytime, Anywhere!</h1>
          <p className="hero-desc">
            Watch quick, addictive, and easy-to-watch short drama episodes
            <br />
            completely free
          </p>

          <div className="hero-tags">
            <span className="hero-tag">Daily Updated</span>
            <span className="hero-tag">Mini-Series</span>
            <span className="hero-tag">Free Short Drama Series</span>
          </div>

          <div className="hero-cards">
            <HeroCard
              description="Browse through thousands of short drama episodes"
              icon="EP"
              title="Episodes"
              onClick={onOpenDiscover}
            />
            <HeroCard
              description="Watch previews before diving into full series"
              icon="TR"
              title="Trailers"
              onClick={() => undefined}
            />
            <HeroCard
              description="Discover similar shows based on your preferences"
              icon="ML"
              title="More Like This"
              onClick={onOpenDiscover}
            />
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title-orange">Featured Series</h2>
          <div className="section-divider" />
        </div>

        <div className="featured-grid" id="popular-dramas">
          {featuredDramas.map((drama) => (
            <div
              key={drama.id}
              className="home-drama-card"
              data-focusable="true"
              onClick={() => onOpenDetail(drama.id)}
            >
              <div className="card-poster">
                <img
                  className="card-image"
                  src={drama.image}
                  alt={drama.title}
                  onError={handleImageError}
                />
                {drama.badge ? <span className="card-badge">{drama.badge}</span> : null}
              </div>

              <div className="card-content">
                <h3 className="card-title">{drama.title}</h3>
                <div className="card-meta">
                  <span>{drama.seasons ? `${drama.seasons} Seasons` : `${drama.episodes} Episodes`}</span>
                  <span>{resolveCategoryName(drama.category)}</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="action-btn primary"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenDetail(drama.id);
                  }}
                  type="button"
                >
                  Watch Now
                </button>
                <button
                  aria-label={
                    isFavorite(mediaState, drama.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  className="action-btn secondary"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(drama.id);
                  }}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

interface HeroCardProps {
  description: string;
  icon: string;
  title: string;
  onClick: () => void;
}

function HeroCard({ description, icon, title, onClick }: HeroCardProps) {
  return (
    <div className="hero-card" data-focusable="true" onClick={onClick}>
      <div className="hero-card-icon">{icon}</div>
      <div className="hero-card-title">{title}</div>
      <div className="hero-card-desc">{description}</div>
    </div>
  );
}

interface DiscoverPageProps {
  onNavigateHome: () => void;
  onOpenDetail: (dramaId: number) => void;
}

function DiscoverPage({ onNavigateHome, onOpenDetail }: DiscoverPageProps) {
  const featuredCategories = categories
    .map((category) => ({
      ...category,
      count: getDramasByCategory(category.id).length
    }))
    .filter((category) => category.count > 0)
    .slice(0, 4);
  const trendingDramas = getPopularDramas().slice(0, 6);
  const quickWatchDramas = dramas.filter((drama) => drama.episodes <= 20).slice(0, 8);
  const newReleaseDramas = getLatestDramas().slice(0, 6);

  return (
    <>
      <section className="discover-header">
        <h1 className="discover-title">Discover Short Dramas</h1>
        <p className="discover-subtitle">
          <span className="highlight">Daily Updated</span> · Mini-Series · Quick,
          Addictive, and Easy to Watch
        </p>
      </section>

      <section className="daily-update-banner">
        <div className="daily-update-content">
          <div className="daily-icon">UP</div>
          <h3 className="daily-title">Daily Updated Content</h3>
          <p className="daily-desc">
            New short drama episodes added every day! Our mini-series are perfect
            for quick viewing sessions, with each episode lasting only 5-10
            minutes. Watch anytime, anywhere, completely free.
          </p>
        </div>
      </section>

      <section className="browse-category">
        <div className="category-header">
          <h2 className="section-title-orange">Browse by Category</h2>
          <div className="section-divider" />
        </div>

        <div className="category-grid" id="discover-categories">
          {featuredCategories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              data-focusable="true"
              onClick={() => undefined}
            >
              <div className="category-icon">{resolveCategoryIcon(category)}</div>
              <div className="category-name">{category.name}</div>
              <div className="category-count">{category.count} Series</div>
            </div>
          ))}
        </div>
      </section>

      <section className="free-banner">
        <div className="free-banner-content">
          <h2 className="free-banner-title">Watch Everything For Free!</h2>
          <p className="free-banner-desc">
            No subscriptions, no payments, no hidden fees. Enjoy all our short
            drama series completely free. Perfect for quick breaks, commutes, or
            relaxing evenings.
          </p>
          <button
            className="free-banner-btn"
            data-focusable="true"
            onClick={onNavigateHome}
            type="button"
          >
            Start Watching Now
          </button>
        </div>
      </section>

      <DramaSection
        dramasList={trendingDramas}
        gridClassName="trending-grid"
        itemClassName="trending-card"
        onOpenDetail={onOpenDetail}
        sectionClassName="trending-section"
        title="Trending Now"
      />

      <section className="quick-watch-section">
        <div className="section-header">
          <h2 className="section-title-orange">Quick Watch (Under 10 min)</h2>
          <button className="view-all-btn" data-focusable="true" type="button">
            View All Quick Series
          </button>
        </div>

        <div className="quick-watch-grid" id="quick-watch-dramas">
          {quickWatchDramas.map((drama, index) => (
            <div
              key={drama.id}
              className="quick-watch-card"
              data-focusable="true"
              onClick={() => onOpenDetail(drama.id)}
            >
              <div className="quick-time-badge">{getQuickDuration(index)} min</div>
              <div className="quick-thumbnail">
                <img src={drama.image} alt={drama.title} onError={handleImageError} />
              </div>
              <h3 className="quick-title">{drama.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <DramaSection
        dramasList={newReleaseDramas}
        gridClassName="new-releases-grid"
        itemClassName="new-release-card"
        onOpenDetail={onOpenDetail}
        sectionClassName="new-releases-section"
        title="New Releases"
      />
    </>
  );
}

interface DramaSectionProps {
  dramasList: readonly Drama[];
  gridClassName: string;
  itemClassName: string;
  onOpenDetail: (dramaId: number) => void;
  sectionClassName: string;
  title: string;
}

function DramaSection({
  dramasList,
  gridClassName,
  itemClassName,
  onOpenDetail,
  sectionClassName,
  title
}: DramaSectionProps) {
  return (
    <section className={sectionClassName}>
      <div className="section-header">
        <h2 className="section-title-orange">{title}</h2>
        <button className="view-all-btn" data-focusable="true" type="button">
          View All
        </button>
      </div>

      <div className={gridClassName}>
        {dramasList.map((drama) => (
          <div
            key={drama.id}
            className={itemClassName}
            data-focusable="true"
            onClick={() => onOpenDetail(drama.id)}
          >
            <div className="card-poster">
              <img src={drama.image} alt={drama.title} onError={handleImageError} />
              <span className="card-badge">{drama.badge ?? "NEW"}</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">{drama.title}</h3>
              <p className="card-meta">
                {resolveCategoryName(drama.category)} ·{" "}
                {drama.seasons ? `${drama.seasons} Seasons` : `${drama.episodes} Eps`}
              </p>
              <button className="card-watch-btn" type="button">
                Watch
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function getPageClassName(isActive: boolean): string {
  return isActive ? "page active" : "page";
}

function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const target = event.currentTarget;
  target.onerror = null;
  target.src = FALLBACK_IMAGE;
}
