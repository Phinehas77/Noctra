import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, X, Clock } from 'lucide-react';
import { ContinueWatchingItem } from '../types/tmdb';
import { getContinueWatching, removeContinueWatching } from '../services/storage';
import { getBackdropUrl } from '../data/curatedMedia';

export const ContinueWatchingRow: React.FC = () => {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);

  const loadItems = () => {
    setItems(getContinueWatching());
  };

  useEffect(() => {
    loadItems();
    window.addEventListener('cinemora_progress_changed', loadItems);
    return () => window.removeEventListener('cinemora_progress_changed', loadItems);
  }, []);

  if (items.length === 0) return null;

  const handleRemove = (e: React.MouseEvent, id: number, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeContinueWatching(id, type);
    loadItems();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) return `${hrs}h ${remMins}m left`;
    return `${remMins}m left`;
  };

  return (
    <section className="relative my-8 sm:my-10 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-2.5 mb-4">
        <Clock className="w-5 h-5 text-[#E50914]" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#F7F7F8]">
          Continue Watching
        </h2>
      </div>

      <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1">
        {items.map((item) => {
          const watchUrl = `/watch/${item.id}?type=${item.media_type}${
            item.season ? `&season=${item.season}&episode=${item.episode}` : ''
          }`;
          const remainingSecs = Math.max(0, item.durationSeconds - item.progressSeconds);

          return (
            <div
              key={`${item.media_type}-${item.id}`}
              className="group relative flex-shrink-0 w-64 sm:w-72 md:w-80 rounded-xl overflow-hidden bg-[#17191F] border border-white/10 shadow-lg hover:border-white/25 transition-all duration-300"
            >
              {/* Media preview container */}
              <div className="relative aspect-video w-full overflow-hidden">
                <Link
                  to={watchUrl}
                  className="block w-full h-full"
                  aria-label={`Resume watching ${item.title}`}
                >
                  <img
                    src={getBackdropUrl(item.backdrop_path || item.poster_path, 'w780')}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/70 pointer-events-none">
                    <div
                      className="h-full bg-[#E50914]"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </Link>

                {/* Remove button positioned on top, outside Link */}
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, item.id, item.media_type)}
                  className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-full bg-black/60 hover:bg-black text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Remove from Continue Watching"
                  aria-label={`Remove ${item.title} from continue watching`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Text Info */}
              <div className="p-3">
                <div className="flex items-center justify-between text-xs text-[#A3A6B0] mb-1">
                  <span>{formatTime(remainingSecs)}</span>
                  <span>{item.percent}% watched</span>
                </div>
                <Link
                  to={watchUrl}
                  className="block font-semibold text-sm text-[#F7F7F8] hover:text-[#E50914] truncate transition-colors"
                >
                  {item.title}
                </Link>
                {item.episodeTitle && (
                  <p className="text-xs text-[#A3A6B0] truncate mt-0.5">
                    S{item.season} E{item.episode} · {item.episodeTitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
