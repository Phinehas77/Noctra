import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tv, SlidersHorizontal, X, Loader2, Tag } from 'lucide-react';
import { MediaItem } from '../types/tmdb';
import { tmdbService } from '../services/tmdb';
import { TV_GENRES, getGenreName } from '../data/genres';
import { MediaCard } from '../components/MediaCard';
import { GenreFilterBar } from '../components/GenreFilterBar';
import { TrailerModal } from '../components/TrailerModal';
import { CardSkeleton, EmptyState, CatalogModeBanner } from '../components/CommonUI';

type TVTab = 'popular' | 'trending' | 'top_rated' | 'airing_today' | 'on_the_air';

export const TVShowsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TVTab) || 'popular';

  // Helper to parse genre from URL (handles ID or name)
  const parseGenreParam = (param: string | null): number | null => {
    if (!param) return null;
    const num = Number(param);
    if (!isNaN(num) && num > 0) return num;
    const match = TV_GENRES.find((g) => g.name.toLowerCase() === param.toLowerCase());
    return match ? match.id : null;
  };

  const [activeTab, setActiveTab] = useState<TVTab>(initialTab);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(parseGenreParam(searchParams.get('genre')));
  const [selectedYear, setSelectedYear] = useState<string>(searchParams.get('year') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'popularity.desc');
  const [minRating, setMinRating] = useState<number>(Number(searchParams.get('min_rating')) || 0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [shows, setShows] = useState<MediaItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [activeTrailer, setActiveTrailer] = useState<{ key: string; title: string } | null>(null);

  const tabs: { id: TVTab; label: string }[] = [
    { id: 'popular', label: 'Popular TV' },
    { id: 'trending', label: 'Trending TV' },
    { id: 'top_rated', label: 'Top Rated' },
    { id: 'airing_today', label: 'Airing Today' },
    { id: 'on_the_air', label: 'On The Air' },
  ];

  // Sync tab & genre from URL if query params change
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TVTab;
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }

    const genreParam = parseGenreParam(searchParams.get('genre'));
    if (genreParam !== selectedGenre) {
      setSelectedGenre(genreParam);
    }
  }, [searchParams]);

  const updateQueryParams = (updates: Record<string, string | number | null>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 0) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(val));
      }
    });
    setSearchParams(nextParams, { replace: true });
  };

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    updateQueryParams({ genre: genreId });
  };

  useEffect(() => {
    let mounted = true;

    async function fetchShows(pageNum: number, isMore: boolean) {
      if (isMore) setIsLoadingMore(true);
      else setIsLoading(true);

      try {
        let result: { results: MediaItem[]; total_pages: number } = { results: [], total_pages: 1 };

        if (activeTab === 'popular') {
          result = await tmdbService.getPopularTV(pageNum);
        } else if (activeTab === 'trending') {
          const trending = await tmdbService.getTrending('tv', 'week');
          result = { results: trending, total_pages: 1 };
        } else if (activeTab === 'top_rated') {
          result = await tmdbService.getTopRatedTV(pageNum);
        } else if (activeTab === 'airing_today') {
          result = await tmdbService.getAiringTodayTV(pageNum);
        } else if (activeTab === 'on_the_air') {
          result = await tmdbService.getOnTheAirTV(pageNum);
        }

        if (!mounted) return;

        let filtered = result.results;

        // Apply selected genre filter
        if (selectedGenre) {
          filtered = filtered.filter(
            (s) => s.genre_ids?.includes(selectedGenre) || s.genres?.some((g) => g.id === selectedGenre)
          );
        }

        if (selectedYear) {
          filtered = filtered.filter((s) => (s.first_air_date || '').startsWith(selectedYear));
        }

        if (minRating > 0) {
          filtered = filtered.filter((s) => s.vote_average >= minRating);
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter((s) => (s.name || s.title || '').toLowerCase().includes(q));
        }

        if (isMore) {
          setShows((prev) => [...prev, ...filtered]);
        } else {
          setShows(filtered);
        }
        setTotalPages(result.total_pages);
      } catch (err) {
        console.error('Failed to fetch TV shows:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    }

    setPage(1);
    fetchShows(1, false);

    return () => {
      mounted = false;
    };
  }, [activeTab, selectedGenre, selectedYear, sortBy, minRating, searchQuery]);

  const handleTabChange = (tab: TVTab) => {
    setActiveTab(tab);
    updateQueryParams({ tab: tab === 'popular' ? null : tab });
  };

  const clearFilters = () => {
    setSelectedGenre(null);
    setSelectedYear('');
    setMinRating(0);
    setSearchQuery('');
    setSearchParams(activeTab === 'popular' ? {} : { tab: activeTab });
  };

  const activeGenreName = selectedGenre ? getGenreName(selectedGenre, 'tv') : null;

  const hasActiveFilters = Boolean(selectedGenre !== null || selectedYear || minRating > 0 || searchQuery);

  return (
    <div className="min-h-screen bg-[#08090C] pt-20 sm:pt-24 pb-20 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
      <CatalogModeBanner />

      {/* Header */}
      <div className="my-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-lg bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/20">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-gradient-silver tracking-tight uppercase">
              Television Series
            </h1>
            <p className="text-xs sm:text-sm text-[#A3A6B0]">
              Bingeworthy dramas, animated sagas, and critically acclaimed weekly releases.
            </p>
          </div>
        </div>
      </div>

      {/* Browse Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 text-xs sm:text-[13px] font-display font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500] cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#FF5500] to-[#E50914] text-white shadow-md shadow-[#E50914]/25'
                : 'text-[#A3A6B0] hover:text-[#F7F7F8] hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Clickable Genre Tags Filter Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1 text-xs text-[#A3A6B0] font-medium">
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#E50914]" />
            <strong className="text-white">Filter by Genre:</strong>
            {activeGenreName && (
              <span className="text-[#E50914] font-semibold">Active: {activeGenreName}</span>
            )}
          </span>
          {selectedGenre !== null && (
            <button
              onClick={() => handleGenreSelect(null)}
              className="text-[#E50914] hover:underline font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Clear Genre Filter</span>
            </button>
          )}
        </div>

        <GenreFilterBar
          genres={TV_GENRES}
          selectedGenre={selectedGenre}
          onSelectGenre={handleGenreSelect}
        />
      </div>

      {/* Secondary Filter Bar */}
      <div className="bg-[#111318] border border-white/10 rounded-2xl p-4 sm:p-5 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F7F7F8]">
            <SlidersHorizontal className="w-4 h-4 text-[#E50914]" />
            <span>Additional TV Filters</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#E50914] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#A3A6B0] uppercase mb-1">
              First Air Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                updateQueryParams({ year: e.target.value || null });
              }}
              className="w-full bg-[#17191F] border border-white/10 text-xs sm:text-sm text-[#F7F7F8] rounded-lg px-3 py-2 focus:border-[#E50914] focus:outline-none"
            >
              <option value="">Any Year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#A3A6B0] uppercase mb-1">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMinRating(val);
                updateQueryParams({ min_rating: val || null });
              }}
              className="w-full bg-[#17191F] border border-white/10 text-xs sm:text-sm text-[#F7F7F8] rounded-lg px-3 py-2 focus:border-[#E50914] focus:outline-none"
            >
              <option value="0">All Ratings</option>
              <option value="8">8.0+ Acclaimed</option>
              <option value="7">7.0+ High Quality</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#A3A6B0] uppercase mb-1">
              Filter Title
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Shōgun, Arcane..."
              className="w-full bg-[#17191F] border border-white/10 text-xs sm:text-sm text-[#F7F7F8] rounded-lg px-3 py-2 focus:border-[#E50914] focus:outline-none placeholder-[#A3A6B0]"
            />
          </div>
        </div>
      </div>

      {/* Active Genre Notification Bar if selected */}
      {activeGenreName && (
        <div className="flex items-center justify-between bg-[#17191F] border border-white/10 rounded-xl px-4 py-2.5 mb-6 text-xs text-[#A3A6B0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E50914]" />
            <span>
              Showing <strong className="text-white">{activeGenreName}</strong> television shows{' '}
              {!isLoading && `(${shows.length} ${shows.length === 1 ? 'title' : 'titles'} found)`}
            </span>
          </div>
          <button
            onClick={() => handleGenreSelect(null)}
            className="text-xs text-[#E50914] hover:underline font-semibold cursor-pointer"
          >
            Show All Genres
          </button>
        </div>
      )}

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : shows.length === 0 ? (
        <EmptyState
          title={activeGenreName ? `No ${activeGenreName} series found` : 'No television series found'}
          description={
            activeGenreName
              ? `There are no TV shows matching the ${activeGenreName} genre in this category. Try selecting another genre or resetting your filters.`
              : 'Try selecting a different genre or clearing your active filters.'
          }
          actionText={activeGenreName ? `Clear "${activeGenreName}" Filter` : 'Clear All Filters'}
          onAction={activeGenreName ? () => handleGenreSelect(null) : clearFilters}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {shows.map((show) => (
            <div key={`tv-${show.id}`} className="flex justify-center">
              <MediaCard
                item={{ ...show, media_type: 'tv' }}
                onPlayTrailer={(key, title) => setActiveTrailer({ key, title })}
              />
            </div>
          ))}
        </div>
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
