import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Plus,
  Check,
  Star,
  Clock,
  Calendar,
  Layers,
  Film,
  Tv,
  ArrowLeft,
  Share2,
  TvMinimalPlay,
} from 'lucide-react';
import { MediaDetails, SeasonInfo } from '../types/tmdb';
import { tmdbService } from '../services/tmdb';
import { getBackdropUrl, getPosterUrl, getProfileUrl } from '../data/curatedMedia';
import { isInWatchlist, toggleWatchlist, getPlaybackPosition } from '../services/storage';
import { TrailerModal } from '../components/TrailerModal';
import { MediaCard } from '../components/MediaCard';
import { ErrorState } from '../components/CommonUI';

export const MediaDetailPage: React.FC = () => {
  const { type = 'movie', id = '' } = useParams<{ type: string; id: string }>();
  const mediaType = (type === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv';
  const navigate = useNavigate();

  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [seasonData, setSeasonData] = useState<SeasonInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeasonLoading, setIsSeasonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inList, setInList] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<{ key: string; title: string } | null>(null);
  const [savedProgress, setSavedProgress] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync watchlist status
  const syncWatchlist = () => {
    if (details) {
      setInList(isInWatchlist(details.id, mediaType));
    }
  };

  useEffect(() => {
    window.addEventListener('cinemora_watchlist_changed', syncWatchlist);
    return () => window.removeEventListener('cinemora_watchlist_changed', syncWatchlist);
  }, [details, mediaType]);

  // Fetch details
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await tmdbService.getDetails(id, mediaType);
        if (!mounted) return;
        setDetails(data);
        setInList(isInWatchlist(data.id, mediaType));

        // Check saved playback progress
        const pos = getPlaybackPosition(data.id, mediaType);
        setSavedProgress(pos);

        // If TV series, load Season 1
        if (mediaType === 'tv') {
          loadSeason(data.id, 1);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message === 'MEDIA_NOT_FOUND' ? 'Title not found' : 'Unable to load media details.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [id, mediaType]);

  const loadSeason = async (tvId: number, seasonNum: number) => {
    try {
      setIsSeasonLoading(true);
      const s = await tmdbService.getSeasonDetails(tvId, seasonNum);
      setSeasonData(s);
    } catch (err) {
      console.error('Failed to load season:', err);
    } finally {
      setIsSeasonLoading(false);
    }
  };

  const handleSeasonChange = (seasonNum: number) => {
    setSelectedSeason(seasonNum);
    if (details) {
      loadSeason(details.id, seasonNum);
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090C] animate-pulse">
        <div className="w-full h-[60vh] bg-[#111318]" />
        <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-6">
          <div className="h-8 w-1/3 bg-[#17191F] rounded" />
          <div className="h-4 w-1/2 bg-[#17191F] rounded" />
          <div className="h-24 w-full bg-[#17191F] rounded" />
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-[#08090C] pt-32 px-4">
        <ErrorState
          title="Media Not Found"
          message={error || 'The requested title could not be retrieved from the catalog.'}
          onRetry={() => navigate(-1)}
        />
      </div>
    );
  }

  const title = details.title || details.name || 'Untitled';
  const releaseDate = details.release_date || details.first_air_date || '';
  const year = releaseDate ? releaseDate.split('-')[0] : '';
  const runtimeText = details.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details.number_of_seasons
    ? `${details.number_of_seasons} ${details.number_of_seasons === 1 ? 'Season' : 'Seasons'}`
    : '';

  const cast = details.credits?.cast || [];
  const director = details.credits?.crew?.find((c) => c.job === 'Director')?.name;
  const similarItems = details.similar?.results || [];

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F7F7F8] pb-24">
      {/* Hero Backdrop */}
      <div className="relative w-full h-[70vh] min-h-[520px] max-h-[750px]">
        <img
          src={getBackdropUrl(details.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[#08090C]/80 to-transparent w-full lg:w-3/4" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#08090C]/90 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-24 left-4 sm:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-[#F7F7F8] text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Hero Meta Content */}
        <div className="absolute inset-0 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-end pb-10 z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 lg:gap-10">
            {/* Poster Thumbnail */}
            <div className="hidden sm:block flex-shrink-0 w-44 md:w-56 aspect-[2/3] rounded-2xl overflow-hidden bg-[#17191F] border border-white/20 shadow-2xl shadow-black">
              <img
                src={getPosterUrl(details.poster_path, 'w500')}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details block */}
            <div className="flex-1 max-w-3xl">
              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-[#A3A6B0] mb-3 font-medium">
                <span className="text-[#FF5500] font-display uppercase tracking-[0.22em] font-bold text-xs">
                  {mediaType === 'movie' ? 'Feature Film' : 'Television Series'}
                </span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span className="font-tech font-bold text-white">{year}</span>
                {runtimeText && (
                  <>
                    <span aria-hidden="true" className="text-white/30">·</span>
                    <span className="flex items-center gap-1 font-tech">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{runtimeText}</span>
                    </span>
                  </>
                )}
                {details.vote_average > 0 && (
                  <>
                    <span aria-hidden="true" className="text-white/30">·</span>
                    <div className="flex items-center gap-1 text-[#F7F7F8] font-tech font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{details.vote_average.toFixed(1)}</span>
                      <span className="text-[#A3A6B0] font-normal text-xs font-outfit">
                        ({details.vote_count?.toLocaleString()} votes)
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Title & Tagline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-gradient-silver tracking-tight leading-tight mb-2 uppercase">
                {title}
              </h1>
              {details.tagline && (
                <p className="text-sm sm:text-base font-cinematic italic text-amber-200/90 mb-4 tracking-wide">
                  "{details.tagline}"
                </p>
              )}

              {/* Genre chips (clean unboxed text per design rules, clickable to filter) */}
              {details.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3A6B0] mb-6">
                  {details.genres.map((g, idx) => (
                    <React.Fragment key={g.id}>
                      <Link
                        to={mediaType === 'tv' ? `/tv?genre=${g.id}` : `/movies?genre=${g.id}`}
                        className="text-[#F7F7F8]/90 font-medium hover:text-[#E50914] hover:underline transition-colors"
                        title={`Browse ${g.name} ${mediaType === 'tv' ? 'shows' : 'movies'}`}
                      >
                        {g.name}
                      </Link>
                      {idx < details.genres.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Watch Now Button */}
                <Link
                  to={`/watch/${details.id}?type=${mediaType}`}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF5500] via-[#EE1520] to-[#C90712] hover:brightness-110 text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm shadow-lg shadow-[#E50914]/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <TvMinimalPlay className="w-4 h-4" />
                  <span>{savedProgress > 0 ? 'Resume Playback' : 'Watch Now'}</span>
                </Link>

                {/* Trailer Button */}
                {details.trailer_key && (
                  <button
                    onClick={() => setIsTrailerOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg bg-white/15 hover:bg-white/25 text-[#F7F7F8] font-display font-bold uppercase tracking-wider text-xs sm:text-sm backdrop-blur-md border border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Official Trailer</span>
                  </button>
                )}

                {/* Watchlist toggle */}
                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm font-display font-bold uppercase tracking-wider ${
                    inList
                      ? 'bg-white text-[#08090C] border-white'
                      : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
                  }`}
                >
                  {inList ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
                  <span>{inList ? 'In My List' : 'Add to List'}</span>
                </button>

                {/* Share Link */}
                <button
                  onClick={handleShare}
                  className="p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
                  title="Share link"
                  aria-label="Share title"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {copiedLink && (
                  <span className="text-xs text-emerald-400 font-semibold animate-in fade-in">
                    Link copied!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Synopsis, Cast, Seasons */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section>
            <h2 className="text-xl font-bold text-[#F7F7F8] mb-3">Synopsis</h2>
            <p className="text-base text-[#D0D2D9] leading-relaxed font-normal">
              {details.overview || 'No synopsis provided for this title.'}
            </p>
          </section>

          {/* Cast Carousel */}
          {cast.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-[#F7F7F8] mb-4">Top Cast</h2>
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="flex-shrink-0 w-28 sm:w-32 text-center group"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden bg-[#17191F] border border-white/10 mb-2 shadow-md group-hover:border-[#E50914] transition-colors">
                      <img
                        src={getProfileUrl(actor.profile_path)}
                        alt={actor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#F7F7F8] truncate">
                      {actor.name}
                    </h4>
                    <p className="text-[11px] text-[#A3A6B0] truncate">
                      {actor.character || 'Self'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TV Seasons and Episodes Section */}
          {mediaType === 'tv' && details.number_of_seasons && details.number_of_seasons > 0 && (
            <section className="bg-[#111318] border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-[#E50914]" />
                  <h2 className="text-xl font-bold text-[#F7F7F8]">Episodes & Seasons</h2>
                </div>

                {/* Season Select */}
                <select
                  value={selectedSeason}
                  onChange={(e) => handleSeasonChange(Number(e.target.value))}
                  className="bg-[#17191F] border border-white/15 text-sm text-[#F7F7F8] rounded-lg px-4 py-2 focus:border-[#E50914] focus:outline-none"
                >
                  {Array.from({ length: details.number_of_seasons || 1 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Season {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Episodes List */}
              {isSeasonLoading ? (
                <div className="py-12 text-center text-sm text-[#A3A6B0]">
                  Loading episodes...
                </div>
              ) : seasonData && seasonData.episodes && seasonData.episodes.length > 0 ? (
                <div className="space-y-4">
                  {seasonData.episodes.map((ep) => (
                    <div
                      key={ep.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#17191F]/70 hover:bg-[#17191F] border border-white/5 hover:border-white/15 transition-all group"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Still thumbnail */}
                        <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0">
                          <img
                            src={getBackdropUrl(ep.still_path || details.backdrop_path, 'w780')}
                            alt={ep.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                            <div className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow">
                              <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Episode details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-xs text-[#A3A6B0] mb-1">
                            <span className="font-bold text-white">Episode {ep.episode_number}</span>
                            {ep.runtime && <span>· {ep.runtime} min</span>}
                            {ep.air_date && <span>· {ep.air_date}</span>}
                          </div>
                          <h4 className="text-sm font-semibold text-[#F7F7F8] truncate mb-1">
                            {ep.name}
                          </h4>
                          <p className="text-xs text-[#A3A6B0] line-clamp-2 leading-relaxed">
                            {ep.overview || 'No episode description available.'}
                          </p>
                        </div>
                      </div>

                      {/* Play episode action */}
                      <Link
                        to={`/watch/${details.id}?type=tv&season=${selectedSeason}&episode=${ep.episode_number}`}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-[#E50914] text-xs font-semibold text-white transition-colors flex-shrink-0 self-end sm:self-center"
                      >
                        Play S{selectedSeason}:E{ep.episode_number}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-[#A3A6B0]">
                  No detailed episodes loaded for Season {selectedSeason}. You can launch playback using the player.
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Column: Metadata Sidebar & Similar Titles */}
        <div className="space-y-8">
          {/* Metadata Card */}
          <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F7F7F8]">
              About This Title
            </h3>

            {director && (
              <div>
                <span className="block text-xs font-semibold text-[#A3A6B0] uppercase">
                  Director
                </span>
                <span className="text-sm font-medium text-[#F7F7F8]">{director}</span>
              </div>
            )}

            {details.status && (
              <div>
                <span className="block text-xs font-semibold text-[#A3A6B0] uppercase">
                  Status
                </span>
                <span className="text-sm font-medium text-[#F7F7F8]">{details.status}</span>
              </div>
            )}

            {details.budget ? (
              <div>
                <span className="block text-xs font-semibold text-[#A3A6B0] uppercase">
                  Budget
                </span>
                <span className="text-sm font-medium text-[#F7F7F8]">
                  ${(details.budget / 1000000).toFixed(1)} Million
                </span>
              </div>
            ) : null}

            {details.revenue ? (
              <div>
                <span className="block text-xs font-semibold text-[#A3A6B0] uppercase">
                  Box Office Revenue
                </span>
                <span className="text-sm font-medium text-emerald-400">
                  ${(details.revenue / 1000000).toFixed(1)} Million
                </span>
              </div>
            ) : null}

            {details.production_companies && details.production_companies.length > 0 && (
              <div>
                <span className="block text-xs font-semibold text-[#A3A6B0] uppercase mb-1">
                  Production
                </span>
                <div className="space-y-1">
                  {details.production_companies.slice(0, 3).map((pc) => (
                    <span key={pc.id} className="block text-xs text-[#D0D2D9]">
                      {pc.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Similar Titles */}
          {similarItems.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-[#F7F7F8] mb-4">Similar Recommendations</h3>
              <div className="grid grid-cols-2 gap-3">
                {similarItems.slice(0, 4).map((item) => (
                  <MediaCard
                    key={`sim-${item.id}`}
                    item={item}
                    onPlayTrailer={(key, t) => setActiveTrailer({ key, title: t })}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen || Boolean(activeTrailer)}
        onClose={() => {
          setIsTrailerOpen(false);
          setActiveTrailer(null);
        }}
        trailerKey={activeTrailer ? activeTrailer.key : details.trailer_key}
        title={activeTrailer ? activeTrailer.title : title}
      />
    </div>
  );
};
