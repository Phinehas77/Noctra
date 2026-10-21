import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { TVShowsPage } from './pages/TVShowsPage';
import { TrendingPage } from './pages/TrendingPage';
import { NewReleasesPage } from './pages/NewReleasesPage';
import { SearchPage } from './pages/SearchPage';
import { MediaDetailPage } from './pages/MediaDetailPage';
import { WatchPage } from './pages/WatchPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { getAppSettings, applyFontTheme } from './services/storage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Don't show standard navbar and footer on full screen watch route
  const isWatchRoute = location.pathname.startsWith('/watch');

  return (
    <div className="flex flex-col min-h-screen bg-[#08090C] text-[#F7F7F8]">
      {!isWatchRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isWatchRoute && <Footer />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const s = getAppSettings();
    applyFontTheme(s.fontTheme || 'urbanist');

    const handleSettingsChange = (e: any) => {
      if (e.detail?.fontTheme) {
        applyFontTheme(e.detail.fontTheme);
      }
    };

    window.addEventListener('cinemora_settings_changed', handleSettingsChange);
    return () => window.removeEventListener('cinemora_settings_changed', handleSettingsChange);
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TVShowsPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/new-releases" element={<NewReleasesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/title/:type/:id" element={<MediaDetailPage />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/my-list" element={<WatchlistPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
