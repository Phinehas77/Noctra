import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Plus, Check, Info, Film } from 'lucide-react';
import { MediaItem } from '../types/tmdb';
import { getPosterUrl } from '../data/curatedMedia';
import { isInWatchlist, toggleWatchlist, getPlaybackPosition } from '../services/storage';

interface MediaCardProps {
  item: MediaItem;
  onPlayTrailer?: (key: string, title: string) => void;
  priority?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPlayTrailer }) => {
  const [inList, setInList] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState<number | null>(null);

  const title = item.title || item.name || 'Untitled';
  const type = item.media_type || (item.title ? 'movie' : 'tv');
  const date = item.release_date || item.first_air_date || '';
  const year = date ? date.split('-')[0] : '';
  const detailUrl = `/title/${type}/${item.id}`;

  const syncWatchlist = () => {
    setInList(isInWatchlist(item.id, type));
  };

  useEffect(() => {
    syncWatchlist();
    window.addEventListener('cinemora_watchlist_changed', syncWatchlist);

    // Check playback progress
    const pos = getPlaybackPosition(item.id, type);
    if (pos > 0 && item.runtime) {
      const dur = item.runtime * 60;
      setPlaybackProgress(Math.min(100, Math.round((pos / dur) * 100)));
    }

    return () => {
      window.removeEventListener('cinemora_watchlist_changed', syncWatchlist);
    };
  }, [item.id, type]);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleWatchlist({
      id: item.id,
      media_type: type,
      title,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      release_year: year,
      overview: item.overview,
    });
    setInList(newState);
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlayTrailer) {
      onPlayTrailer(item.trailer_key || '', title);
    }
  };

  const posterUrl = imgError
    ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'
    : getPosterUrl(item.poster_path, 'w500');

  return (
    <div className="group relative flex-shrink-0 w-36 sm:w-44 md:w-52 lg:w-56 focus-within:ring-2 focus-within:ring-[#E50914] rounded-xl transition-all duration-300">
      {/* Poster Container (div wrapper, NOT an <a> tag) */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-[#17191F] border border-white/5 shadow-md transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-black/70 group-hover:border-white/20">
        <Link
          to={detailUrl}
          className="absolute inset-0 z-0 block focus:outline-none"
          tabIndex={0}
          aria-label={`View details for ${title}`}
        >
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Hover Gradient Overlay (pointer-events-none on backdrop, auto on buttons) */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#08090C] via-[#08090C]/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5">
          {/* Action buttons on hover */}
          <div className="flex items-center gap-2 mb-2 pointer-events-auto">
            <Link
              to={`/watch/${item.id}?type=${type}`}
              className="p-2 rounded-full bg-[#E50914] text-white hover:bg-[#b20710] hover:scale-110 active:scale-95 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center cursor-pointer"
              title="Watch Now"
              aria-label={`Watch ${title} now`}
            >
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </Link>

            {onPlayTrailer && (
              <button
                type="button"
                onClick={handleTrailerClick}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="Watch Trailer"
                aria-label={`Watch trailer for ${title}`}
              >
                <Film className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleWatchlistToggle}
              className={`p-2 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer ${
                inList
                  ? 'bg-white text-[#08090C]'
                  : 'bg-white/20 text-white hover:bg-white/40'
              }`}
              title={inList ? 'Remove from My List' : 'Add to My List'}
              aria-label={inList ? `Remove ${title} from My List` : `Add ${title} to My List`}
            >
              {inList ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
            </button>

            <Link
              to={detailUrl}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
              title="View Details"
              aria-label={`View details for ${title}`}
            >
              <Info className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-[#F7F7F8] font-medium line-clamp-2 leading-tight">
            {item.overview || 'Explore details, cast, and playback options.'}
          </p>
        </div>

        {/* Genuine Playback progress bar */}
        {playbackProgress !== null && playbackProgress > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/60 z-20">
            <div
              className="h-full bg-[#E50914]"
              style={{ width: `${playbackProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Info Below Poster */}
      <div className="mt-2.5 px-1">
        <div className="flex items-center justify-between gap-1 text-xs text-[#A3A6B0] mb-0.5">
          <div className="flex items-center gap-1.5 font-tech text-[11px] tabular-nums">
            <span className="text-zinc-400 font-medium">{year || '2024'}</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="uppercase text-[9px] tracking-widest font-bold text-[#A3A6B0]/90">
              {type === 'movie' ? 'Movie' : 'Series'}
            </span>
          </div>

          {item.vote_average > 0 && (
            <div className="flex items-center gap-1 text-[#F7F7F8] font-tech font-bold text-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>

        <Link
          to={detailUrl}
          className="block text-[13px] sm:text-sm font-display font-bold tracking-tight text-[#F7F7F8] hover:text-[#FF5500] truncate transition-colors"
          title={title}
        >
          {title}
        </Link>
      </div>
    </div>
  );
};
