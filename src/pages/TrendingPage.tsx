import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, Calendar, Star } from 'lucide-react';
import { MediaItem } from '../types/tmdb';
import { tmdbService } from '../services/tmdb';
import { MediaCard } from '../components/MediaCard';
import { TrailerModal } from '../components/TrailerModal';
import { CardSkeleton, CatalogModeBanner } from '../components/CommonUI';

export const TrendingPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState<{ key: string; title: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadTrending() {
      setIsLoading(true);
      try {
        const results = await tmdbService.getTrending(filterType, timeWindow);
        if (mounted) setItems(results);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadTrending();
    return () => {
      mounted = false;
    };
  }, [filterType, timeWindow]);

  return (
    <div className="min-h-screen bg-[#08090C] pt-20 sm:pt-24 pb-20 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
      <CatalogModeBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-gradient-silver tracking-tight uppercase">
              Trending Now
            </h1>
            <p className="text-xs sm:text-sm text-[#A3A6B0]">
              The most watched and talked-about entertainment across the globe.
            </p>
          </div>
        </div>

        {/* Switchers */}
        <div className="flex items-center gap-3">
          {/* All / Movies / TV */}
          <div className="flex bg-[#111318] p-1 rounded-lg border border-white/10">
            {(['all', 'movie', 'tv'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  filterType === t
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#E50914] text-white shadow-md shadow-[#E50914]/25'
                    : 'text-[#A3A6B0] hover:text-white'
                }`}
              >
                {t === 'all' ? 'All' : t === 'movie' ? 'Movies' : 'TV Shows'}
              </button>
            ))}
          </div>

          {/* This Week / Today */}
          <div className="flex bg-[#111318] p-1 rounded-lg border border-white/10">
            {(['week', 'day'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setTimeWindow(w)}
                className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  timeWindow === w
                    ? 'bg-white/20 text-white shadow'
                    : 'text-[#A3A6B0] hover:text-white'
                }`}
              >
                {w === 'week' ? 'This Week' : 'Today'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {items.map((item) => (
            <div key={`${item.media_type || 'm'}-${item.id}`} className="flex justify-center">
              <MediaCard
                item={item}
                onPlayTrailer={(key, title) => setActiveTrailer({ key, title })}
              />
            </div>
          ))}
        </div>
      )}

      <TrailerModal
        isOpen={Boolean(activeTrailer)}
        onClose={() => setActiveTrailer(null)}
        trailerKey={activeTrailer?.key}
        title={activeTrailer?.title || ''}
      />
    </div>
  );
};
