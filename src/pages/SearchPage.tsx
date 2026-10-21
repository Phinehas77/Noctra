import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Film,
  Tv,
  Calendar,
  SlidersHorizontal,
  Loader2,
  Star,
  Sparkles,
  History,
  X,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { MediaItem } from '../types/tmdb';
import { tmdbService } from '../services/tmdb';
import { MOVIE_GENRES } from '../data/genres';
import { MediaCard } from '../components/MediaCard';
import { TrailerModal } from '../components/TrailerModal';
import { CardSkeleton, EmptyState, CatalogModeBanner } from '../components/CommonUI';

type EraFilter =
  | 'all'
  | '2024-2026'
  | '2020-2023'
  | '2010s'
  | '2000s'
  | '1990s'
  | '1980s'
  | 'classic';

const ERA_OPTIONS: { id: EraFilter; label: string; sub: string }[] = [
  { id: 'all', label: 'All Time', sub: 'Origins – 2026' },
  { id: '2024-2026', label: '2024 – 2026', sub: 'Upcoming & Premieres' },
  { id: '2020-2023', label: '2020 – 2023', sub: 'Recent Era' },
  { id: '2010s', label: '2010s', sub: '2010 – 2019' },
  { id: '2000s', label: '2000s', sub: '2000 – 2009' },
  { id: '1990s', label: '1990s', sub: '1990 – 1999' },
  { id: '1980s', label: '1980s', sub: '1980 – 1989' },
  { id: 'classic', label: 'Golden Age', sub: '1920 – 1979 Classics' },
];

const HISTORICAL_SUGGESTIONS = [
  { label: 'Avengers: Secret Wars (2026)', query: 'Avengers Secret Wars' },
  { label: 'Dune: Part Two (2024)', query: 'Dune Part Two' },
  { label: 'Oppenheimer (2023)', query: 'Oppenheimer' },
  { label: 'The Dark Knight (2008)', query: 'The Dark Knight' },
  { label: 'The Matrix (1999)', query: 'The Matrix' },
  { label: 'Pulp Fiction (1994)', query: 'Pulp Fiction' },
  { label: 'The Godfather (1972)', query: 'The Godfather' },
  { label: '2001: A Space Odyssey (1968)', query: '2001 A Space Odyssey' },
  { label: 'Casablanca (1942)', query: 'Casablanca' },
  { label: 'Metropolis (1927)', query: 'Metropolis' },
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialEra = (searchParams.get('era') as EraFilter) || 'all';
  const initialType = (searchParams.get('type') as 'all' | 'movie' | 'tv') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'tv'>(initialType);
  const [eraFilter, setEraFilter] = useState<EraFilter>(initialEra);
  const [exactYear, setExactYear] = useState<string>(searchParams.get('year') || '');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(
    searchParams.get('genre') ? Number(searchParams.get('genre')) : null
  );

  const [results, setResults] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<{ key: string; title: string } | null>(null);

  // Sync state if URL query param changes
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    if (qParam !== query) {
      setQuery(qParam);
    }
  }, [searchParams]);

  // Execute real-time search with 250ms debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      setPage(1);
      setTotalPages(1);
      return;
    }

    let mounted = true;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await tmdbService.searchMulti(query.trim(), {
          page: 1,
          type: typeFilter,
          year: exactYear.trim() || undefined,
          decade: eraFilter,
          genreId: selectedGenre,
        });

        if (mounted) {
          setResults(data.results);
          setTotalPages(data.total_pages);
          setPage(1);
        }
      } catch (err) {
        console.error('Real-time search error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      mounted = false;
    };
  }, [query, typeFilter, eraFilter, exactYear, selectedGenre]);

  const updateSearchQuery = (val: string) => {
    setQuery(val);
    const nextParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      nextParams.set('q', val.trim());
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleEraSelect = (era: EraFilter) => {
    setEraFilter(era);
    const nextParams = new URLSearchParams(searchParams);
    if (era !== 'all') {
      nextParams.set('era', era);
    } else {
      nextParams.delete('era');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleTypeSelect = (type: 'all' | 'movie' | 'tv') => {
    setTypeFilter(type);
    const nextParams = new URLSearchParams(searchParams);
    if (type !== 'all') {
      nextParams.set('type', type);
    } else {
      nextParams.delete('type');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleLoadMore = async () => {
    if (page >= totalPages || isLoadingMore) return;
    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const data = await tmdbService.searchMulti(query.trim(), {
        page: nextPage,
        type: typeFilter,
        year: exactYear.trim() || undefined,
        decade: eraFilter,
        genreId: selectedGenre,
      });

      setResults((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleClearFilters = () => {
    setQuery('');
    setTypeFilter('all');
    setEraFilter('all');
    setExactYear('');
    setSelectedGenre(null);
    setSearchParams({});
  };

  const movieCount = results.filter(
    (i) => (i.media_type || (i.title ? 'movie' : 'tv')) === 'movie'
  ).length;
  const tvCount = results.filter(
    (i) => (i.media_type || (i.title ? 'movie' : 'tv')) === 'tv'
  ).length;

  return (
    <div className="min-h-screen bg-[#08090C] pt-20 sm:pt-24 pb-20 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
      <CatalogModeBanner />

      {/* Main Search Hero Header */}
      <div className="max-w-4xl mx-auto my-6 sm:my-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5500]/15 border border-[#FF5500]/30 text-[#FF5500] text-xs font-tech font-bold uppercase tracking-widest mb-3">
          <History className="w-3.5 h-3.5" />
          <span>Real-Time Global Database · Origins to 2026</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display text-gradient-silver tracking-tight mb-3 uppercase">
          Search Every Movie in History
        </h1>
        <p className="text-xs sm:text-sm text-[#A3A6B0] mb-6 max-w-xl mx-auto">
          Explore over 900,000 films and series from early silent cinema (1920s) through upcoming 2026 blockbusters.
        </p>

        {/* Real-time search input bar */}
        <div className="relative flex items-center shadow-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => updateSearchQuery(e.target.value)}
            placeholder="Type any movie or show (e.g. Dune 2, Avengers 2026, Godfather 1972, Metropolis 1927)..."
            autoFocus
            className="w-full bg-[#111318] text-sm sm:text-base text-[#F7F7F8] placeholder-[#A3A6B0] pl-12 pr-12 py-4 rounded-2xl border border-white/15 focus:border-[#E50914] focus:outline-none focus:ring-2 focus:ring-[#E50914]/40 transition-all"
            aria-label="Real-time movie search"
          />
          <Search className="absolute left-4 w-5 h-5 text-[#A3A6B0]" />
          {isLoading ? (
            <Loader2 className="absolute right-4 w-5 h-5 text-[#E50914] animate-spin" />
          ) : query ? (
            <button
              onClick={() => updateSearchQuery('')}
              className="absolute right-4 p-1 rounded-full text-[#A3A6B0] hover:text-white hover:bg-white/10"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Quick Era Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-[#A3A6B0]">
          <span className="text-white/60 font-semibold mr-1">Try searching:</span>
          {HISTORICAL_SUGGESTIONS.slice(0, 5).map((item) => (
            <button
              key={item.label}
              onClick={() => updateSearchQuery(item.query)}
              className="px-2.5 py-1 rounded-md bg-[#17191F] hover:bg-[#232733] text-white/80 hover:text-white border border-white/5 transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Era / Decade Filter Bar (Covering cinema history from start to 2026) */}
      <div className="bg-[#111318] border border-white/10 rounded-2xl p-4 sm:p-5 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E50914]" />
              <span>Browse by Era (Start of Cinema to 2026)</span>
            </h3>
            <p className="text-xs text-[#A3A6B0]">
              Filter films by release epoch or specify an exact release year.
            </p>
          </div>

          {/* Exact Year input */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#A3A6B0]">Exact Year:</label>
            <input
              type="number"
              min="1900"
              max="2026"
              value={exactYear}
              onChange={(e) => setExactYear(e.target.value)}
              placeholder="e.g. 2026"
              className="w-24 bg-[#17191F] border border-white/10 text-xs text-white rounded-lg px-2.5 py-1.5 focus:border-[#E50914] focus:outline-none"
            />
            {exactYear && (
              <button
                onClick={() => setExactYear('')}
                className="text-xs text-[#A3A6B0] hover:text-white"
                title="Clear year"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Era Segmented Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-4">
          {ERA_OPTIONS.map((era) => {
            const isSelected = eraFilter === era.id && !exactYear;
            return (
              <button
                key={era.id}
                onClick={() => {
                  setExactYear('');
                  handleEraSelect(era.id);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/25 scale-[1.02]'
                    : 'bg-[#17191F] text-[#A3A6B0] hover:text-[#F7F7F8] hover:bg-[#20232B] border border-white/5 hover:border-white/15'
                }`}
              >
                <span className="text-xs font-bold leading-tight">{era.label}</span>
                <span className="text-[10px] text-white/60 leading-tight mt-0.5">{era.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Media Type & Genre Subfilters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-4 border-t border-white/5">
          {/* Media Type Buttons */}
          <div className="flex bg-[#17191F] p-1 rounded-lg border border-white/10">
            <button
              onClick={() => handleTypeSelect('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-[#E50914] text-white shadow'
                  : 'text-[#A3A6B0] hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => handleTypeSelect('movie')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                typeFilter === 'movie'
                  ? 'bg-[#E50914] text-white shadow'
                  : 'text-[#A3A6B0] hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies Only</span>
            </button>
            <button
              onClick={() => handleTypeSelect('tv')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                typeFilter === 'tv'
                  ? 'bg-[#E50914] text-white shadow'
                  : 'text-[#A3A6B0] hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>TV Series</span>
            </button>
          </div>

          {/* Quick Genre Selector */}
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#E50914]" />
            <select
              value={selectedGenre || ''}
              onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
              className="bg-[#17191F] border border-white/10 text-xs text-[#F7F7F8] rounded-lg px-3 py-1.5 focus:border-[#E50914] focus:outline-none"
            >
              <option value="">All Genres</option>
              {MOVIE_GENRES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Query Results Count Bar */}
      {query.trim() && (
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-3 border-b border-white/10 text-xs text-[#A3A6B0]">
          <div>
            Showing <strong className="text-white">{results.length}</strong> matching titles for{' '}
            <span className="text-[#E50914] font-semibold">"{query}"</span>
            {eraFilter !== 'all' && (
              <span> · Era: <strong className="text-white">{eraFilter}</strong></span>
            )}
            {exactYear && (
              <span> · Year: <strong className="text-white">{exactYear}</strong></span>
            )}
            {movieCount > 0 && tvCount > 0 && (
              <span> ({movieCount} movies, {tvCount} TV series)</span>
            )}
          </div>

          <button
            onClick={handleClearFilters}
            className="text-[#E50914] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      )}

      {/* Results View */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !query.trim() ? (
        /* Empty State with Discovery Suggestions */
        <div className="py-12 max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#17191F] border border-white/10 flex items-center justify-center text-[#E50914] mx-auto shadow-xl">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Ready to explore cinematic history
            </h3>
            <p className="text-xs sm:text-sm text-[#A3A6B0] leading-relaxed">
              Start typing any title above. NOCTRA searches the entire database in real time, from 1920s masterpieces to 2026 future releases.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-3">
              Explore Popular Historic Landmarks & 2026 Premieres:
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {HISTORICAL_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => updateSearchQuery(s.query)}
                  className="px-3 py-1.5 rounded-lg bg-[#111318] hover:bg-[#E50914] text-xs font-semibold text-[#A3A6B0] hover:text-white border border-white/10 transition-all cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          title={`No results for "${query}"`}
          description={
            eraFilter !== 'all' || exactYear
              ? `We couldn't find any titles matching "${query}" within the selected era (${exactYear || eraFilter}). Try expanding the era to "All Time".`
              : `We couldn't find matches for "${query}". Check for spelling errors or try a different keyword.`
          }
          actionText="Clear Filters & Search All Time"
          onAction={() => {
            setEraFilter('all');
            setExactYear('');
            setSelectedGenre(null);
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {results.map((item) => (
              <div key={`${item.media_type || 'm'}-${item.id}`} className="flex justify-center">
                <MediaCard
                  item={item}
                  onPlayTrailer={(key, title) => setActiveTrailer({ key, title })}
                />
              </div>
            ))}
          </div>

          {/* Load More Results */}
          {page < totalPages && (
            <div className="mt-12 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-3 rounded-lg bg-[#17191F] hover:bg-[#20232B] border border-white/10 text-sm font-semibold text-[#F7F7F8] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 text-[#E50914] animate-spin" />
                    <span>Loading more titles...</span>
                  </>
                ) : (
                  <span>Load More Results</span>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={Boolean(activeTrailer)}
        onClose={() => setActiveTrailer(null)}
        trailerKey={activeTrailer?.key}
        title={activeTrailer?.title || ''}
      />
    </div>
  );
};
