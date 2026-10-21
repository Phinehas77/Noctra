import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Play,
  ArrowLeft,
  RotateCcw,
  Maximize,
  Minimize,
  Tv,
  Film,
  Server,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Info,
  Clock,
  Star,
  Plus,
  Check,
  Share2,
  ExternalLink,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { MediaDetails, SeasonInfo } from '../types/tmdb';
import { tmdbService } from '../services/tmdb';
import {
  getPlaybackPosition,
  updateContinueWatching,
  getCustomSourceForMedia,
  saveCustomSource,
  isInWatchlist,
  toggleWatchlist,
} from '../services/storage';
import { getBackdropUrl } from '../data/curatedMedia';

interface PlayerSource {
  id: string;
  num: number;
  name: string;
  badge: string;
  type: 'embed' | 'html5' | 'trailer';
  getUrl: (id: string | number, type: 'movie' | 'tv', season: number, episode: number) => string;
}

export const PLAYER_SOURCES: PlayerSource[] = [
  {
    id: 'player3',
    num: 3,
    name: 'Player 3 (VidSrc PM)',
    badge: 'Mirror HD',
    type: 'embed',
    getUrl: (id, type, season, episode) =>
      type === 'movie'
        ? `https://vidsrc.pm/embed/movie/${id}`
        : `https://vidsrc.pm/embed/tv/${id}/${season}/${episode}`,
  },
  {
    id: 'vidzee',
    num: 6,
    name: 'Vidzee (Player 6)',
    badge: 'Cloud HD',
    type: 'embed',
    getUrl: (id, type, season, episode) =>
      type === 'movie'
        ? `https://player.vidzee.wtf/embed/movie/${id}`
        : `https://player.vidzee.wtf/embed/tv/${id}/${season}/${episode}`,
  },
  {
    id: 'cinesrc',
    num: 11,
    name: 'Cinesrc (Player 11)',
    badge: 'Pro HD',
    type: 'embed',
    getUrl: (id, type, season, episode) =>
      type === 'movie'
        ? `https://cinesrc.st/embed/movie/${id}`
        : `https://cinesrc.st/embed/tv/${id}?s=${season}&e=${episode}`,
  },
  {
    id: 'nontongo',
    num: 12,
    name: 'Nontongo (Player 12)',
    badge: 'Fast Mirror',
    type: 'embed',
    getUrl: (id, type, season, episode) =>
      type === 'movie'
        ? `https://www.nontongo.win/embed/movie/${id}`
        : `https://www.nontongo.win/embed/tv/${id}/${season}/${episode}`,
  },
];

const EXTRA_SOURCES: PlayerSource[] = [
  {
    id: 'trailer',
    num: 13,
    name: 'Official HD Trailer',
    badge: 'YouTube HD',
    type: 'trailer',
    getUrl: () => '',
  },
  {
    id: 'direct',
    num: 14,
    name: 'Custom Direct Stream',
    badge: 'HTML5 Video',
    type: 'html5',
    getUrl: () => '',
  },
];

const ALL_SOURCES = [...PLAYER_SOURCES, ...EXTRA_SOURCES];

export const WatchPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const mediaType = (searchParams.get('type') || 'movie') as 'movie' | 'tv';
  const initialSeason = Number(searchParams.get('season')) || 1;
  const initialEpisode = Number(searchParams.get('episode')) || 1;

  const navigate = useNavigate();
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [seasonData, setSeasonData] = useState<SeasonInfo | null>(null);
  const [currentSeason, setCurrentSeason] = useState<number>(initialSeason);
  const [currentEpisode, setCurrentEpisode] = useState<number>(initialEpisode);
  const [activePlayerId, setActivePlayerId] = useState<string>('player3');

  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showEpisodeSidebar, setShowEpisodeSidebar] = useState<boolean>(mediaType === 'tv');
  const [inList, setInList] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  // Auto-dismiss loading overlay after 3.5s so user is never stuck
  useEffect(() => {
    if (isIframeLoading) {
      const timer = setTimeout(() => {
        setIsIframeLoading(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isIframeLoading, activePlayerId, reloadKey, currentSeason, currentEpisode]);

  // Quick switch to next server
  const handleNextServer = () => {
    const currentIndex = PLAYER_SOURCES.findIndex((s) => s.id === activePlayerId);
    const nextIndex = (currentIndex + 1) % PLAYER_SOURCES.length;
    setActivePlayerId(PLAYER_SOURCES[nextIndex].id);
    setIsIframeLoading(true);
  };

  // Custom Source for Player (HTML5 Direct)
  const [customStreamUrl, setCustomStreamUrl] = useState<string>('');
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  // Sync route query parameters when season/episode changes
  const updateSeasonEpisode = (s: number, e: number) => {
    setCurrentSeason(s);
    setCurrentEpisode(e);
    setSearchParams(
      {
        type: mediaType,
        season: String(s),
        episode: String(e),
      },
      { replace: true }
    );
    setIsIframeLoading(true);
  };

  // Fetch media details and season data
  useEffect(() => {
    let mounted = true;

    async function loadMedia() {
      try {
        const d = await tmdbService.getDetails(id, mediaType);
        if (!mounted) return;
        setDetails(d);
        setInList(isInWatchlist(d.id, mediaType));

        // Check custom stream URL
        const savedUrl = getCustomSourceForMedia(d.id, mediaType) || d.legitimate_stream_url || '';
        setCustomStreamUrl(savedUrl);

        // Record entry to Continue Watching
        updateContinueWatching({
          id: d.id,
          media_type: mediaType,
          title: d.title || d.name || '',
          poster_path: d.poster_path,
          backdrop_path: d.backdrop_path,
          progressSeconds: 60,
          durationSeconds: d.runtime ? d.runtime * 60 : 3600,
          season: mediaType === 'tv' ? currentSeason : undefined,
          episode: mediaType === 'tv' ? currentEpisode : undefined,
          episodeTitle: undefined,
          streamUrl: undefined,
        });

        // If TV series, fetch season episodes
        if (mediaType === 'tv') {
          const s = await tmdbService.getSeasonDetails(d.id, currentSeason);
          if (mounted) setSeasonData(s);
        }
      } catch (err) {
        console.error('Failed to load media details for watch:', err);
      }
    }

    loadMedia();

    return () => {
      mounted = false;
    };
  }, [id, mediaType, currentSeason]);

  // Handle season changes
  const handleSeasonChange = async (seasonNum: number) => {
    setCurrentSeason(seasonNum);
    updateSeasonEpisode(seasonNum, 1);
    if (details) {
      try {
        const s = await tmdbService.getSeasonDetails(details.id, seasonNum);
        setSeasonData(s);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleNextEpisode = () => {
    if (!seasonData || !seasonData.episodes) return;
    const nextEp = currentEpisode + 1;
    const exists = seasonData.episodes.some((ep) => ep.episode_number === nextEp);
    const seasonCount = details?.number_of_seasons || details?.seasons?.length || 1;
    if (exists) {
      updateSeasonEpisode(currentSeason, nextEp);
    } else if (currentSeason < seasonCount) {
      handleSeasonChange(currentSeason + 1);
    }
  };

  const handlePrevEpisode = () => {
    if (currentEpisode > 1) {
      updateSeasonEpisode(currentSeason, currentEpisode - 1);
    }
  };

  const handleWatchlistToggle = () => {
    if (!details) return;
    const title = details.title || details.name || 'Untitled';
    const date = details.release_date || details.first_air_date || '';
    const year = date ? date.split('-')[0] : '';
    const newState = toggleWatchlist({
      id: details.id,
      media_type: mediaType,
      title,
      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,
      vote_average: details.vote_average,
      release_year: year,
      overview: details.overview,
    });
    setInList(newState);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSaveCustomSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim() || !details) return;
    saveCustomSource({
      id: details.id,
      media_type: mediaType,
      sourceUrl: customInputUrl.trim(),
      sourceType: 'mp4',
      title: details.title || details.name || '',
    });
    setCustomStreamUrl(customInputUrl.trim());
    setActivePlayerId('direct');
    setShowCustomModal(false);
  };

  const title = details?.title || details?.name || 'Now Playing';
  const activeSource = ALL_SOURCES.find((p) => p.id === activePlayerId) || PLAYER_SOURCES[0];

  // Resolve active stream URL based on player
  let activeEmbedUrl = '';
  if (activeSource.type === 'embed') {
    activeEmbedUrl = activeSource.getUrl(id, mediaType, currentSeason, currentEpisode);
  } else if (activeSource.type === 'trailer') {
    const key = details?.trailer_key || 'Way9Dexny3w';
    activeEmbedUrl = `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&rel=0&modestbranding=1`;
  }

  const currentEpInfo = seasonData?.episodes?.find((ep) => ep.episode_number === currentEpisode);

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F7F7F8] flex flex-col">
      {/* Top Cinema Player Header Bar */}
      <header className="sticky top-0 z-40 bg-[#08090C]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17191F] hover:bg-[#222632] text-white text-xs sm:text-sm font-semibold border border-white/10 transition-colors cursor-pointer"
            aria-label="Back to details"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base font-display font-bold text-white truncate max-w-xs sm:max-w-md lg:max-w-lg tracking-tight">
              {title}
            </h1>
            {mediaType === 'tv' && (
              <span className="text-xs font-tech text-[#A3A6B0] truncate">
                <span className="text-[#FF5500] font-bold">S{currentSeason}:E{currentEpisode}</span>
                {currentEpInfo ? ` · ${currentEpInfo.name}` : ''}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {mediaType === 'tv' && (
            <button
              onClick={() => setShowEpisodeSidebar(!showEpisodeSidebar)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                showEpisodeSidebar
                  ? 'bg-[#E50914] text-white border-[#E50914]'
                  : 'bg-[#17191F] text-[#A3A6B0] border-white/10 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Episodes</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#17191F] hover:bg-[#222632] text-[#A3A6B0] hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Streaming Sources Bar */}
      <div className="bg-[#0B0D12] border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-[1600px] mx-auto space-y-2.5">
          {/* Header Row: Title, Server Count, and Tools */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>Streaming Servers (HD · Ultra Fast):</span>
              </span>
              <span className="hidden md:inline text-[11px] text-[#A3A6B0] font-tech">
                4 Dedicated Verified Players (3, 6, 11, 12)
              </span>
            </div>

            {/* Quick Stream Tools: Open in Tab, Reload, Trailer, Custom URL */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {activeEmbedUrl && activeSource.type === 'embed' && (
                <a
                  href={activeEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all font-semibold text-xs"
                  title="Open stream in a direct new tab"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in Tab</span>
                </a>
              )}

              <button
                onClick={() => {
                  setIsIframeLoading(true);
                  setReloadKey((prev) => prev + 1);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#17191F] hover:bg-[#222632] text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer font-medium text-xs"
                title="Reload current stream"
              >
                <RotateCcw className="w-3 h-3 text-[#FF5500]" />
                <span>Reload</span>
              </button>

              <button
                onClick={() => {
                  setActivePlayerId('trailer');
                  setIsIframeLoading(true);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer text-xs ${
                  activePlayerId === 'trailer'
                    ? 'bg-[#FF5500] text-white border-[#FF5500] font-bold shadow-sm'
                    : 'bg-[#17191F] hover:bg-[#222632] text-zinc-300 hover:text-white border-white/10'
                }`}
                title="Play official HD trailer"
              >
                <Film className="w-3 h-3" />
                <span>Trailer</span>
              </button>

              <button
                onClick={() => {
                  if (customStreamUrl) {
                    setActivePlayerId('direct');
                  } else {
                    setShowCustomModal(true);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer text-xs ${
                  activePlayerId === 'direct'
                    ? 'bg-[#FF5500] text-white border-[#FF5500] font-bold shadow-sm'
                    : 'bg-[#17191F] hover:bg-[#222632] text-zinc-300 hover:text-white border-white/10'
                }`}
                title="Play custom stream URL (m3u8/mp4)"
              >
                <Sparkles className="w-3 h-3" />
                <span>Custom Stream</span>
              </button>
            </div>
          </div>

          {/* 4 Dedicated Streaming Sources (3, 6, 11, 12) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PLAYER_SOURCES.map((source) => {
              const isActive = activePlayerId === source.id;
              return (
                <button
                  key={source.id}
                  onClick={() => {
                    setActivePlayerId(source.id);
                    setIsIframeLoading(true);
                  }}
                  className={`group relative flex items-center justify-between p-2 sm:px-3 sm:py-2 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5500] via-[#EE1520] to-[#C90712] text-white border-transparent shadow-lg shadow-[#E50914]/30 scale-[1.01]'
                      : 'bg-[#17191F]/90 text-zinc-300 hover:text-white hover:bg-[#20242E] border-white/10 hover:border-white/20'
                  }`}
                  title={`${source.name} - ${source.badge}`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-tech font-bold flex-shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white text-black shadow-sm'
                          : 'bg-white/10 text-white group-hover:bg-[#FF5500] group-hover:text-white'
                      }`}
                    >
                      {source.num}
                    </span>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="font-display font-bold text-[11px] sm:text-xs truncate">
                        {source.name}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[8px] sm:text-[9px] font-tech font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ml-1 ${
                      isActive
                        ? 'bg-black/35 text-white'
                        : 'bg-white/5 text-zinc-400 border border-white/5 hidden xs:inline'
                    }`}
                  >
                    {source.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Player & Interactive Sidebar Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Player Container (Col 1-3) */}
        <div className={showEpisodeSidebar && mediaType === 'tv' ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <div
            ref={playerContainerRef}
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 flex items-center justify-center group"
          >
            {/* Loading Spinner for Embed with Instant Recovery */}
            {isIframeLoading && activeSource.type !== 'html5' && (
              <div className="absolute inset-0 bg-[#08090C]/95 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-4 text-center">
                <div className="w-12 h-12 rounded-full border-3 border-white/10 border-t-[#FF5500] animate-spin mb-3" />
                <p className="text-sm font-semibold text-white">Connecting to {activeSource.name}...</p>
                <p className="text-xs text-[#A3A6B0] mt-1 font-tech">Initializing high-definition stream</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleNextServer}
                    className="px-3 py-1 rounded-lg bg-[#FF5500]/20 hover:bg-[#FF5500]/30 text-xs font-semibold text-[#FF7733] border border-[#FF5500]/40 cursor-pointer transition-all flex items-center gap-1"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>Try Next Server</span>
                  </button>
                  <button
                    onClick={() => setIsIframeLoading(false)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white cursor-pointer"
                  >
                    Show Player
                  </button>
                </div>
              </div>
            )}

            {/* Direct HTML5 Player Mode */}
            {activeSource.type === 'html5' ? (
              customStreamUrl ? (
                <video
                  src={customStreamUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  playsInline
                />
              ) : (
                <div className="text-center p-6 max-w-md">
                  <div className="w-14 h-14 rounded-2xl bg-[#17191F] border border-white/10 flex items-center justify-center text-[#E50914] mx-auto mb-4">
                    <Film className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No Direct Stream Configured</h3>
                  <p className="text-xs text-[#A3A6B0] mb-4">
                    Switch to any of the 4 dedicated streaming servers above to watch immediately, or configure a custom MP4/HLS URL.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setActivePlayerId('player3')}
                      className="px-4 py-2 rounded-lg bg-[#FF5500] hover:bg-[#E50914] text-white text-xs font-semibold cursor-pointer"
                    >
                      Switch to Player 3 (VidSrc PM)
                    </button>
                    <button
                      onClick={() => setShowCustomModal(true)}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                    >
                      Set Custom URL
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* Embedded Iframe Player */
              <iframe
                key={`${activeEmbedUrl}-${reloadKey}`}
                src={activeEmbedUrl}
                title={`${title} Stream Player`}
                onLoad={() => setIsIframeLoading(false)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>

          {/* Episode Navigation Buttons below video for TV */}
          {mediaType === 'tv' && (
            <div className="mt-4 flex items-center justify-between gap-4 bg-[#111318] border border-white/10 rounded-xl p-3">
              <button
                onClick={handlePrevEpisode}
                disabled={currentEpisode <= 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17191F] hover:bg-[#222632] text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Episode</span>
              </button>

              <span className="text-xs font-semibold text-[#A3A6B0]">
                Season {currentSeason} · Episode {currentEpisode}
              </span>

              <button
                onClick={handleNextEpisode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#B20710] text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <span>Next Episode</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Media Info & Overview Card */}
          <div className="mt-6 bg-[#111318] border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#A3A6B0] mb-1">
                  <span className="text-[#E50914] font-bold uppercase tracking-wider">
                    {mediaType === 'movie' ? 'Movie' : 'TV Series'}
                  </span>
                  <span>·</span>
                  <span>{details?.release_date?.split('-')[0] || details?.first_air_date?.split('-')[0]}</span>
                  {details?.runtime && (
                    <>
                      <span>·</span>
                      <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                    </>
                  )}
                  {details?.vote_average ? (
                    <>
                      <span>·</span>
                      <div className="flex items-center gap-1 text-white font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{details.vote_average.toFixed(1)}</span>
                      </div>
                    </>
                  ) : null}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    inList
                      ? 'bg-white text-black border-white'
                      : 'bg-[#17191F] text-white border-white/10 hover:bg-[#222632]'
                  }`}
                >
                  {inList ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{inList ? 'In My List' : 'Add to List'}</span>
                </button>

                <Link
                  to={`/title/${mediaType}/${id}`}
                  className="px-4 py-2 rounded-lg bg-[#17191F] hover:bg-[#222632] text-xs font-semibold text-[#A3A6B0] hover:text-white border border-white/10 transition-colors"
                >
                  Full Details
                </Link>
              </div>
            </div>

            <p className="text-sm text-[#D0D2D9] leading-relaxed">
              {details?.overview || 'Enjoy streaming this title.'}
            </p>
          </div>
        </div>

        {/* TV Series Episode Sidebar (Col 4) */}
        {mediaType === 'tv' && showEpisodeSidebar && (
          <aside className="lg:col-span-1 bg-[#111318] border border-white/10 rounded-2xl p-4 flex flex-col h-[650px]">
            {/* Sidebar Header with Season Selector */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#E50914]" />
                <span>Episodes</span>
              </span>

              {(() => {
                const seasonCount = details?.number_of_seasons || details?.seasons?.length || 1;
                return seasonCount > 1 ? (
                  <select
                    value={currentSeason}
                    onChange={(e) => handleSeasonChange(Number(e.target.value))}
                    className="bg-[#17191F] border border-white/15 text-xs text-white rounded-lg px-2.5 py-1 focus:border-[#FF5500] focus:outline-none cursor-pointer"
                  >
                    {Array.from({ length: seasonCount }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Season {i + 1}
                      </option>
                    ))}
                  </select>
                ) : null;
              })()}
            </div>

            {/* Scrollable Episodes List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {seasonData?.episodes && seasonData.episodes.length > 0 ? (
                seasonData.episodes.map((ep) => {
                  const isCurrent = ep.episode_number === currentEpisode;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => updateSeasonEpisode(currentSeason, ep.episode_number)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#E50914] text-white shadow-md'
                          : 'bg-[#17191F] hover:bg-[#222632] text-[#A3A6B0] hover:text-white border border-white/5'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {isCurrent ? <Play className="w-3.5 h-3.5 fill-white" /> : ep.episode_number}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold truncate leading-tight">
                          {ep.name || `Episode ${ep.episode_number}`}
                        </h4>
                        {ep.runtime && (
                          <span className={`text-[10px] block mt-0.5 ${isCurrent ? 'text-white/80' : 'text-[#A3A6B0]/70'}`}>
                            {ep.runtime} min
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-[#A3A6B0]">
                  Loading episodes for Season {currentSeason}...
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Custom URL Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#111318] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Set Custom Video URL</h3>
            <p className="text-xs text-[#A3A6B0] mb-4">
              Enter a direct MP4, WebM, or HLS stream URL to play with the native HTML5 player.
            </p>
            <form onSubmit={handleSaveCustomSource} className="space-y-4">
              <input
                type="url"
                required
                value={customInputUrl}
                onChange={(e) => setCustomInputUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
                className="w-full bg-[#17191F] border border-white/10 text-xs text-white rounded-lg p-2.5 focus:border-[#E50914] focus:outline-none"
              />
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#A3A6B0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#B20710] text-white text-xs font-semibold"
                >
                  Save & Play
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
