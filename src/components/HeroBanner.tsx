import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Info,
  Plus,
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  Flame,
  Film,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MediaItem } from '../types/tmdb';
import { getBackdropUrl } from '../data/curatedMedia';
import { getGenreName } from '../data/genres';
import { isInWatchlist, toggleWatchlist } from '../services/storage';

interface HeroBannerProps {
  featuredItems: MediaItem[];
  onPlayTrailer?: (key: string, title: string) => void;
}

// 20 seconds per spotlight title as requested
const ROTATION_INTERVAL = 20000;

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredItems, onPlayTrailer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inList, setInList] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Background Video Trailer Autoplay States
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedElapsedRef = useRef<number>(0);

  const currentItem = featuredItems[currentIndex] || featuredItems[0];

  const title = currentItem?.title || currentItem?.name || 'Featured Title';
  const type = currentItem?.media_type || (currentItem?.title ? 'movie' : 'tv');
  const date = currentItem?.release_date || currentItem?.first_air_date || '';
  const year = date ? date.split('-')[0] : '2024';
  const detailUrl = currentItem ? `/title/${type}/${currentItem.id}` : '#';

  // Watchlist state sync
  useEffect(() => {
    if (!currentItem) return;
    const sync = () => setInList(isInWatchlist(currentItem.id, type));
    sync();
    window.addEventListener('cinemora_watchlist_changed', sync);
    return () => window.removeEventListener('cinemora_watchlist_changed', sync);
  }, [currentItem, type]);

  // Background trailer autoplay trigger: smoothly switch when slide changes
  useEffect(() => {
    setIsVideoActive(false);
    setVideoLoaded(false);

    if (!currentItem?.trailer_key || !isPlayingVideo) return;

    // Small 400ms delay ensures snappy trailer start while preventing rapid slide lag
    const timer = setTimeout(() => {
      setIsVideoActive(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentIndex, currentItem?.id, currentItem?.trailer_key, isPlayingVideo]);

  // Robust 20-second Auto-rotation timer with progress bar
  // Continues uninterrupted when cursor is on hero; stops only when a user clicks on the hero banner
  useEffect(() => {
    if (featuredItems.length <= 1) return;

    if (isPaused) return;

    const intervalStart = Date.now() - (pausedElapsedRef.current || 0);
    startTimeRef.current = intervalStart;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / ROTATION_INTERVAL) * 100);
      setProgress(pct);

      if (elapsed >= ROTATION_INTERVAL) {
        setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
        startTimeRef.current = Date.now();
        pausedElapsedRef.current = 0;
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [featuredItems.length, currentIndex, isPaused]);

  if (!currentItem) return null;

  // Toggle/Stop auto-next when user clicks anywhere on the hero banner
  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Don't toggle if clicking on links or buttons that handle their own interactions
    if (target.closest('a') || target.closest('button')) {
      return;
    }

    setIsPaused((prev) => {
      const nextState = !prev;
      if (nextState) {
        pausedElapsedRef.current = Date.now() - startTimeRef.current;
      } else {
        startTimeRef.current = Date.now() - pausedElapsedRef.current;
      }
      return nextState;
    });
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = toggleWatchlist({
      id: currentItem.id,
      media_type: type,
      title,
      poster_path: currentItem.poster_path,
      backdrop_path: currentItem.backdrop_path,
      vote_average: currentItem.vote_average,
      release_year: year,
      overview: currentItem.overview,
    });
    setInList(newState);
  };

  const handleTrailerModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(true);
    pausedElapsedRef.current = Date.now() - startTimeRef.current;
    if (onPlayTrailer && currentItem.trailer_key) {
      onPlayTrailer(currentItem.trailer_key, title);
    }
  };

  const handlePrevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
    setProgress(0);
    pausedElapsedRef.current = 0;
    startTimeRef.current = Date.now();
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    setProgress(0);
    pausedElapsedRef.current = 0;
    startTimeRef.current = Date.now();
  };

  // Toggle Mute on background trailer via postMessage and state
  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextMuted ? 'mute' : 'unMute',
          args: [],
        }),
        '*'
      );
      if (!nextMuted) {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [100],
          }),
          '*'
        );
      }
    } catch {
      // Fallback handled by state change
    }
  };

  // Toggle Video Play/Pause in background
  const toggleVideoPlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextPlay = !isPlayingVideo;
    setIsPlayingVideo(nextPlay);
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextPlay ? 'playVideo' : 'pauseVideo',
          args: [],
        }),
        '*'
      );
    } catch {
      // Handled by state
    }
  };

  const genreObjects = (currentItem.genre_ids || [])
    .slice(0, 3)
    .map((gid) => ({ id: gid, name: getGenreName(gid, type) }))
    .filter((g) => Boolean(g.name));

  const trailerUrl = currentItem.trailer_key
    ? `https://www.youtube-nocookie.com/embed/${currentItem.trailer_key}?autoplay=1&mute=${
        isMuted ? 1 : 0
      }&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${
        currentItem.trailer_key
      }&enablejsapi=1`
    : null;

  return (
    <div
      className="relative w-full h-[80vh] min-h-[580px] max-h-[880px] bg-[#08090C] overflow-hidden select-none group/hero font-display cursor-default"
      onClick={handleBannerClick}
    >
      {/* High-Impact Cinematic Backdrop & Autoplaying Video Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* High-Resolution Poster Backdrop (visible while video loads or if video paused) */}
        <img
          key={`bg-img-${currentItem.id}`}
          src={getBackdropUrl(currentItem.backdrop_path, 'original')}
          alt={title}
          className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-out ${
            videoLoaded && isPlayingVideo ? 'opacity-30' : 'opacity-100'
          }`}
        />

        {/* Dynamic Autoplaying Background Video Trailer - Bright, Vivid, and Fully Visible */}
        {isVideoActive && currentItem.trailer_key && isPlayingVideo && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              ref={iframeRef}
              key={`hero-trailer-${currentItem.id}-${currentItem.trailer_key}`}
              src={trailerUrl || ''}
              title={`${title} Background Trailer`}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full object-cover scale-110 pointer-events-none transition-opacity duration-700 ease-in-out ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => setVideoLoaded(true)}
            />
          </div>
        )}

        {/* Tailored, Non-Obtrusive Gradients:
            We keep the video bright and crystal-clear while providing subtle text backdrop on the left and a smooth blend into page at bottom */}
        {/* Bottom smooth bleed into page */}
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-[#08090C] via-[#08090C]/65 to-transparent pointer-events-none" />
        
        {/* Left text shadow scrim - soft & localized, leaving center/right video bright and clear */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[58%] md:w-[48%] bg-gradient-to-r from-[#08090C]/85 via-[#08090C]/40 to-transparent pointer-events-none" />
        
        {/* Top subtle nav fade */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#08090C]/50 to-transparent pointer-events-none" />
        
        {/* Subtle accent color wash */}
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Floating Left / Right Arrow Controls on Desktop */}
      {featuredItems.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-[#E50914] text-white border border-white/10 backdrop-blur-md opacity-0 group-hover/hero:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
            aria-label="Previous spotlight title"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextSlide}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-[#E50914] text-white border border-white/10 backdrop-blur-md opacity-0 group-hover/hero:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
            aria-label="Next spotlight title"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Main Hero Content & Foreground Elements */}
      <div className="relative h-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-end pb-10 sm:pb-14 z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8">
          {/* Left Column: Titles, Synopsis, Badges, Premium Small Buttons */}
          <div className="max-w-xl lg:max-w-2xl">
            {/* Top Trending & Prestige Eyebrow */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E50914] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-md shadow-[#E50914]/30">
                <Flame className="w-3 h-3 fill-white" />
                <span>#1 Spotlight</span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 text-shadow-subtle">
                {type === 'movie' ? 'Cinematic Premiere' : 'Original Series'}
              </span>

              {isPaused ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] sm:text-[11px] font-bold tracking-wide">
                  <Pause className="w-2.5 h-2.5" />
                  <span>Auto-Next Paused</span>
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15 text-[10px] font-medium tracking-wide">
                  <span>20s Auto-Next</span>
                </span>
              )}

              {/* Mobile Trailer Audio Quick Toggle */}
              {currentItem.trailer_key && (
                <button
                  onClick={toggleMute}
                  className={`md:hidden ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border backdrop-blur-md transition-all cursor-pointer ${
                    !isMuted
                      ? 'bg-[#E50914] text-white border-[#E50914]'
                      : 'bg-black/60 text-white/90 border-white/20'
                  }`}
                  aria-label={isMuted ? 'Unmute trailer' : 'Mute trailer'}
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 animate-pulse" />}
                  <span>{isMuted ? 'Unmute' : 'Sound On'}</span>
                </button>
              )}
            </div>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-[#D2D5DF] mb-2.5 font-medium text-shadow-subtle">
              <span className="font-tech font-bold text-white tracking-wide">{year}</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <div className="flex items-center gap-1 text-white font-tech font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{currentItem.vote_average.toFixed(1)}</span>
                <span className="text-[#A3A6B0] font-normal text-[11px]">/ 10</span>
              </div>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span className="text-white/95 font-tech font-bold text-[10px] px-2 py-0.5 rounded bg-white/10 border border-white/15 tracking-widest uppercase">
                4K UHD
              </span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span className="text-white/95 font-tech font-bold text-[10px] px-2 py-0.5 rounded bg-white/10 border border-white/15 tracking-widest uppercase">
                DOLBY ATMOS
              </span>

              {genreObjects.length > 0 && (
                <>
                  <span aria-hidden="true" className="text-white/40">·</span>
                  <span className="flex items-center gap-1.5 text-xs font-display font-medium uppercase tracking-wider">
                    {genreObjects.map((g, idx) => (
                      <React.Fragment key={g.id}>
                        <Link
                          to={type === 'tv' ? `/tv?genre=${g.id}` : `/movies?genre=${g.id}`}
                          className="text-zinc-300 hover:text-[#FF5500] hover:underline transition-colors cursor-pointer"
                        >
                          {g.name}
                        </Link>
                        {idx < genreObjects.length - 1 && (
                          <span aria-hidden="true" className="text-white/30">
                            /
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </span>
                </>
              )}
            </div>

            {/* Title with Professional Stylized Typography */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display text-gradient-silver tracking-tight leading-[1.08] mb-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] text-shadow-hero uppercase">
              {title}
            </h1>

            {/* Tagline */}
            {currentItem.tagline && (
              <p className="text-xs sm:text-sm font-cinematic italic text-amber-300/95 tracking-wide mb-2.5 drop-shadow-md">
                "{currentItem.tagline}"
              </p>
            )}

            {/* Synopsis Overview */}
            <p className="text-xs sm:text-sm text-[#E2E4EB] font-normal line-clamp-2 sm:line-clamp-3 mb-5 max-w-xl leading-relaxed text-shadow-subtle">
              {currentItem.overview || 'Immerse yourself in this award-winning cinematic masterpiece.'}
            </p>

            {/* Action Buttons: Small, Sleek & Premium */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Watch Now Button - Small & Premium */}
              <Link
                to={`/watch/${currentItem.id}?type=${type}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#FF5500] via-[#EE1520] to-[#C90712] hover:brightness-110 text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm shadow-md shadow-[#E50914]/25 hover:shadow-lg hover:shadow-[#E50914]/40 border border-red-300/25 active:scale-95 transition-all duration-200"
              >
                <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-white" />
                <span>Watch Now</span>
              </Link>

              {/* Trailer Modal Button - Small & Premium Glass */}
              {currentItem.trailer_key && (
                <button
                  onClick={handleTrailerModal}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-[#F7F7F8] font-display font-bold uppercase tracking-wider text-xs sm:text-sm backdrop-blur-md border border-white/20 hover:border-white/40 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
                  title="Open full trailer modal"
                >
                  <Film className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-zinc-200" />
                  <span>Trailer</span>
                </button>
              )}

              {/* Details Info Button - Small & Premium Glass */}
              <Link
                to={detailUrl}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] text-zinc-200 hover:text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm backdrop-blur-md border border-white/15 hover:border-white/30 active:scale-95 transition-all duration-200"
              >
                <Info className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-zinc-200" />
                <span>Details</span>
              </Link>

              {/* Watchlist Toggle - Small & Premium */}
              <button
                onClick={handleWatchlistToggle}
                className={`inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg border backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
                  inList
                    ? 'bg-white text-[#08090C] border-white shadow-md'
                    : 'bg-black/40 hover:bg-black/60 text-zinc-300 hover:text-white border-white/20 hover:border-white/40'
                }`}
                title={inList ? 'In My List' : 'Add to My List'}
                aria-label={inList ? 'Remove from My List' : 'Add to My List'}
              >
                {inList ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Right Column: Background Trailer Controls & Interactive Showcase Thumbnails */}
          {featuredItems.length > 1 && (
            <div className="hidden md:flex flex-col gap-2 max-w-xs lg:max-w-sm">
              {/* Autoplay Trailer Live Indicator & Controls */}
              {currentItem.trailer_key && (
                <div className="flex items-center justify-between gap-3 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {videoLoaded && isPlayingVideo ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E50914]"></span>
                        </>
                      ) : (
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
                      )}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                      {videoLoaded && isPlayingVideo ? 'Trailer Playing' : 'Trailer Loading...'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Pause / Play background trailer */}
                    <button
                      onClick={toggleVideoPlay}
                      className="flex items-center justify-center w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title={isPlayingVideo ? 'Pause background trailer' : 'Play background trailer'}
                      aria-label={isPlayingVideo ? 'Pause background trailer' : 'Play background trailer'}
                    >
                      {isPlayingVideo ? (
                        <Pause className="w-3 h-3 fill-white" />
                      ) : (
                        <Play className="w-3 h-3 fill-white ml-0.5" />
                      )}
                    </button>

                    {/* Mute / Unmute background trailer audio */}
                    <button
                      onClick={toggleMute}
                      className={`flex items-center justify-center w-6 h-6 rounded-md border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                        !isMuted
                          ? 'bg-[#E50914] text-white border-[#E50914] shadow-sm shadow-[#E50914]/40'
                          : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
                      }`}
                      title={isMuted ? 'Unmute trailer audio' : 'Mute trailer audio'}
                      aria-label={isMuted ? 'Unmute trailer audio' : 'Mute trailer audio'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-3 h-3 text-white/80" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-white animate-pulse" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Showcase title & 20-second progress indicator with click-to-stop/resume */}
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-[#E50914]'}`} />
                  <span>Spotlight {currentIndex + 1} of {featuredItems.length}</span>
                </span>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPaused((prev) => {
                      const nextState = !prev;
                      if (nextState) {
                        pausedElapsedRef.current = Date.now() - startTimeRef.current;
                      } else {
                        startTimeRef.current = Date.now() - pausedElapsedRef.current;
                      }
                      return nextState;
                    });
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-tech font-bold tracking-tight border transition-all cursor-pointer ${
                    isPaused
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-white/10 text-white/90 border-white/15 hover:bg-white/20'
                  }`}
                  title={isPaused ? 'Auto-next stopped. Click to resume' : 'Auto-next running (20s). Click banner or here to stop'}
                >
                  {isPaused ? (
                    <>
                      <Play className="w-2.5 h-2.5 fill-amber-300" />
                      <span>Stopped · Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-2.5 h-2.5 fill-white/80" />
                      <span>{Math.max(1, Math.round(((100 - progress) / 100) * (ROTATION_INTERVAL / 1000)))}s · Stop</span>
                    </>
                  )}
                </button>
              </div>

              {/* 20-second Auto-rotation Progress Timeline Bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ease-linear shadow-sm ${
                    isPaused
                      ? 'bg-amber-400 shadow-amber-400/50'
                      : 'bg-gradient-to-r from-[#FF5500] to-[#E50914] shadow-[#E50914]'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Interactive Thumbnail Carousel Strip */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {featuredItems.map((item, idx) => {
                  const isActive = idx === currentIndex;
                  const itemTitle = item.title || item.name || '';
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                        setProgress(0);
                        pausedElapsedRef.current = 0;
                        startTimeRef.current = Date.now();
                        setIsPaused(true); // Stop auto-next when user clicks this banner
                      }}
                      className={`relative flex-shrink-0 w-16 sm:w-20 aspect-[16/10] rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'border-[#E50914] ring-2 ring-[#FF5500]/70 scale-105 shadow-lg shadow-black'
                          : 'border-white/10 opacity-50 hover:opacity-100 hover:scale-102'
                      }`}
                      title={`Switch to ${itemTitle} (stops auto-advance)`}
                      aria-label={`Switch to ${itemTitle}`}
                    >
                      <img
                        src={getBackdropUrl(item.backdrop_path || item.poster_path, 'w780')}
                        alt={itemTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex items-end p-1">
                        <span className="text-[9px] font-display font-bold uppercase tracking-wider text-white truncate w-full leading-none">
                          {itemTitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Compact Mobile Slide Indicators with Active 20s Progress */}
        {featuredItems.length > 1 && (
          <div className="md:hidden mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {featuredItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                    setProgress(0);
                    pausedElapsedRef.current = 0;
                    startTimeRef.current = Date.now();
                    setIsPaused(true); // Stop auto-next when user taps this banner
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? isPaused ? 'w-6 bg-amber-400' : 'w-6 bg-[#E50914]'
                      : 'w-2 bg-white/30'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused((prev) => {
                  const nextState = !prev;
                  if (nextState) {
                    pausedElapsedRef.current = Date.now() - startTimeRef.current;
                  } else {
                    startTimeRef.current = Date.now() - pausedElapsedRef.current;
                  }
                  return nextState;
                });
              }}
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-colors ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-white/10 text-zinc-300 border-white/15'
              }`}
            >
              {isPaused ? 'Stopped · Resume' : `${Math.max(1, Math.round(((100 - progress) / 100) * (ROTATION_INTERVAL / 1000)))}s`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
