import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Film,
  Bookmark,
  Settings,
  Menu,
  X,
  TrendingUp,
  Sparkles,
  Tv,
  Home,
  User,
  Sliders,
  Type,
  Check,
} from 'lucide-react';
import { SearchHeader } from './SearchHeader';
import { NoctraLogo } from './NoctraLogo';
import { getWatchlist, getAppSettings, updateAppSettings, FontTheme } from '../services/storage';

const FONT_OPTIONS = [
  { id: 'urbanist', name: 'Urbanist', desc: 'Modern Luxury & Cinema (Default)', fontFamily: "'Urbanist', sans-serif" },
  { id: 'space-grotesk', name: 'Space Grotesk', desc: 'Sci-Fi / Futuristic Angled', fontFamily: "'Space Grotesk', sans-serif" },
  { id: 'montserrat', name: 'Montserrat', desc: 'IMAX Blockbuster Presence', fontFamily: "'Montserrat', sans-serif" },
  { id: 'oswald', name: 'Oswald', desc: 'Theatrical Condensed Marquee', fontFamily: "'Oswald', sans-serif" },
  { id: 'cinzel', name: 'Cinzel', desc: 'Roman Imperial Prestige Serif', fontFamily: "'Cinzel', serif" },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [currentFont, setCurrentFont] = useState<FontTheme>(getAppSettings().fontTheme || 'urbanist');
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const syncWatchlist = () => {
    setWatchlistCount(getWatchlist().length);
  };

  useEffect(() => {
    syncWatchlist();
    window.addEventListener('cinemora_watchlist_changed', syncWatchlist);
    return () => window.removeEventListener('cinemora_watchlist_changed', syncWatchlist);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(e.target as Node)) {
        setFontMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const syncFont = (e: any) => {
      if (e.detail?.fontTheme) {
        setCurrentFont(e.detail.fontTheme);
      }
    };
    window.addEventListener('cinemora_settings_changed', syncFont);
    return () => window.removeEventListener('cinemora_settings_changed', syncFont);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Movies', path: '/movies', icon: Film },
    { label: 'TV Shows', path: '/tv', icon: Tv },
    { label: 'Trending', path: '/trending', icon: TrendingUp },
    { label: 'New Releases', path: '/new-releases', icon: Sparkles },
    { label: 'My List', path: '/my-list', icon: Bookmark, badge: watchlistCount },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 h-18 sm:h-20 ${
          isScrolled
            ? 'bg-[#08090C]/95 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/50'
            : 'bg-gradient-to-b from-[#08090C]/90 via-[#08090C]/60 to-transparent'
        }`}
      >
        <div className="max-w-[1600px] h-full mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500] rounded-lg transition-transform hover:scale-[1.02]"
              aria-label="NOCTRA Home"
            >
              <NoctraLogo size="md" showTagline={true} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-2 text-xs font-display font-bold uppercase tracking-[0.08em] rounded-md transition-all flex items-center gap-1.5 ${
                      active
                        ? 'text-[#F7F7F8] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                        : 'text-[#A3A6B0] hover:text-[#F7F7F8] hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="text-[10px] font-tech font-bold px-1.5 py-0.2 rounded-full bg-[#E50914] text-white">
                        {link.badge}
                      </span>
                    )}
                    {/* Active Route Indicator */}
                    {active && (
                      <span className="absolute bottom-0 inset-x-3.5 h-0.5 bg-gradient-to-r from-[#FF5500] via-[#E50914] to-[#FF5500] rounded-full shadow-[0_0_8px_#E50914]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="hidden sm:block">
              <SearchHeader />
            </div>

            {/* Quick Font Switcher */}
            <div className="relative" ref={fontDropdownRef}>
              <button
                onClick={() => setFontMenuOpen(!fontMenuOpen)}
                className={`p-2 rounded-full transition-colors relative cursor-pointer ${
                  fontMenuOpen
                    ? 'text-white bg-white/15 ring-2 ring-[#FF5500]/50'
                    : 'text-[#A3A6B0] hover:text-[#F7F7F8] hover:bg-white/10'
                }`}
                title="Change Website Font"
                aria-label="Change Website Font"
                aria-expanded={fontMenuOpen}
              >
                <Type className="w-5 h-5" />
              </button>

              {fontMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#111318]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#FF5500]">
                      Typography Style
                    </p>
                    <p className="text-[11px] text-[#A3A6B0]">
                      Choose website font theme
                    </p>
                  </div>
                  <div className="space-y-1">
                    {FONT_OPTIONS.map((f) => {
                      const isActive = (currentFont || 'urbanist') === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => {
                            updateAppSettings({ fontTheme: f.id as FontTheme });
                            setCurrentFont(f.id as FontTheme);
                            setFontMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-[#FF5500]/20 to-[#E50914]/15 border border-[#FF5500]/40 text-white font-bold'
                              : 'text-zinc-300 hover:text-white hover:bg-white/10 border border-transparent'
                          }`}
                        >
                          <div>
                            <div className="text-sm font-semibold tracking-tight" style={{ fontFamily: f.fontFamily }}>
                              {f.name}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              {f.desc}
                            </div>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-[#FF5500]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Settings Link */}
            <Link
              to="/settings"
              className="p-2 text-[#A3A6B0] hover:text-[#F7F7F8] hover:bg-white/10 rounded-full transition-colors relative"
              title="Settings & TMDB API Key"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Watchlist Quick Button (Tablet/Mobile) */}
            <Link
              to="/my-list"
              className="lg:hidden p-2 text-[#A3A6B0] hover:text-[#F7F7F8] hover:bg-white/10 rounded-full transition-colors relative"
              title="My List"
              aria-label="My List"
            >
              <Bookmark className="w-5 h-5" />
              {watchlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E50914] text-white text-[10px] font-bold flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </Link>

            {/* User Profile Avatar */}
            <Link
              to="/settings"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#17191F] to-[#252833] border border-white/15 flex items-center justify-center text-white/90 hover:border-[#E50914] transition-colors"
              title="Account & Preferences"
              aria-label="User Profile"
            >
              <User className="w-4 h-4 text-[#A3A6B0]" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#A3A6B0] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search below header on very narrow screens */}
        <div className="sm:hidden px-4 pb-2.5 pt-1">
          <SearchHeader />
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-black/80 backdrop-blur-md pt-24 px-6 animate-in fade-in duration-200">
          <div className="flex flex-col gap-2 max-w-sm mx-auto">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-display font-bold uppercase tracking-wider transition-colors ${
                    active
                      ? 'bg-gradient-to-r from-[#FF5500] to-[#E50914] text-white shadow-lg shadow-[#E50914]/30'
                      : 'text-[#F7F7F8] hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-tech font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="my-2 border-t border-white/10" />

            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3.5 rounded-xl text-base font-semibold text-[#A3A6B0] hover:text-white hover:bg-white/10 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings & API Key</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
