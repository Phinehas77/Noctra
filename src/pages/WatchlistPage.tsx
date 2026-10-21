import React, { useState, useEffect } from 'react';
import { Bookmark, Film, Tv, Trash2, ArrowUpDown, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WatchlistItem } from '../types/tmdb';
import { getWatchlist, removeFromWatchlist } from '../services/storage';
import { getPosterUrl } from '../data/curatedMedia';
import { EmptyState } from '../components/CommonUI';

export const WatchlistPage: React.FC = () => {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'title'>('recent');

  const loadList = () => {
    setItems(getWatchlist());
  };

  useEffect(() => {
    loadList();
    window.addEventListener('cinemora_watchlist_changed', loadList);
    return () => window.removeEventListener('cinemora_watchlist_changed', loadList);
  }, []);

  const handleRemove = (e: React.MouseEvent, id: number, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWatchlist(id, type);
    loadList();
  };

  const filteredItems = items
    .filter((item) => (filterType === 'all' ? true : item.media_type === filterType))
    .sort((a, b) => {
      if (sortBy === 'recent') return b.added_at - a.added_at;
      if (sortBy === 'rating') return b.vote_average - a.vote_average;
      return a.title.localeCompare(b.title);
    });

  const movieCount = items.filter((i) => i.media_type === 'movie').length;
  const tvCount = items.filter((i) => i.media_type === 'tv').length;

  return (
    <div className="min-h-screen bg-[#08090C] pt-20 sm:pt-24 pb-20 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/20">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-gradient-silver tracking-tight uppercase">
              My Watchlist
            </h1>
            <p className="text-xs sm:text-sm text-[#A3A6B0]">
              <span className="font-tech font-bold text-white">{items.length}</span> {items.length === 1 ? 'saved title' : 'saved titles'} ready to watch.
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex bg-[#111318] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#E50914] text-white shadow-md shadow-[#E50914]/25'
                    : 'text-[#A3A6B0] hover:text-white'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilterType('movie')}
                className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  filterType === 'movie'
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#E50914] text-white shadow-md shadow-[#E50914]/25'
                    : 'text-[#A3A6B0] hover:text-white'
                }`}
              >
                Movies ({movieCount})
              </button>
              <button
                onClick={() => setFilterType('tv')}
                className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  filterType === 'tv'
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#E50914] text-white shadow-md shadow-[#E50914]/25'
                    : 'text-[#A3A6B0] hover:text-white'
                }`}
              >
                TV Series ({tvCount})
              </button>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-[#111318] px-3 py-1.5 rounded-lg border border-white/10 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#A3A6B0]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#F7F7F8] focus:outline-none cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your watchlist is empty"
          description="Explore our trending movies, new releases, and TV series, and tap the '+' button on any poster to save it here."
          actionText="Explore Trending Titles"
          actionLink="/trending"
          icon={<Bookmark className="w-8 h-8 text-[#E50914]" />}
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No titles match this filter"
          description={`You have no ${filterType === 'movie' ? 'movies' : 'television shows'} in your list.`}
          actionText="Show All Items"
          onAction={() => setFilterType('all')}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const detailUrl = `/title/${item.media_type}/${item.id}`;
            const watchUrl = `/watch/${item.id}?type=${item.media_type}`;

            return (
              <div
                key={`${item.media_type}-${item.id}`}
                className="group relative flex-shrink-0 focus-within:ring-2 focus-within:ring-[#E50914] rounded-xl transition-all"
              >
                {/* Poster container (div wrapper, NOT a Link tag) */}
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-[#17191F] border border-white/5 shadow-md transition-all group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-black/70 group-hover:border-white/20">
                  <Link
                    to={detailUrl}
                    className="absolute inset-0 z-0 block focus:outline-none"
                    aria-label={`View details for ${item.title}`}
                  >
                    <img
                      src={getPosterUrl(item.poster_path, 'w500')}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#08090C] via-[#08090C]/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="flex items-center gap-2 mb-2 pointer-events-auto">
                      <Link
                        to={watchUrl}
                        className="p-2 rounded-full bg-[#E50914] text-white hover:scale-110 active:scale-95 transition-transform shadow flex items-center justify-center cursor-pointer"
                        title="Watch Now"
                        aria-label={`Watch ${item.title} now`}
                      >
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleRemove(e, item.id, item.media_type)}
                        className="p-2 rounded-full bg-red-600/30 hover:bg-red-600 text-white transition-colors cursor-pointer"
                        title="Remove from My List"
                        aria-label={`Remove ${item.title} from list`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-[#F7F7F8] line-clamp-2">
                      {item.overview}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 px-1">
                  <div className="flex items-center justify-between text-xs text-[#A3A6B0] mb-0.5">
                    <span>{item.release_year}</span>
                    <span className="uppercase text-[10px] font-semibold text-[#A3A6B0]/80">
                      {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                    </span>
                  </div>
                  <Link
                    to={detailUrl}
                    className="block text-sm font-semibold text-[#F7F7F8] hover:text-[#E50914] truncate transition-colors"
                  >
                    {item.title}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
