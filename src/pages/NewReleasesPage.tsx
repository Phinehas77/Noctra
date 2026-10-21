import React, { useState, useEffect } from 'react';
import { Sparkles, Film, Calendar } from 'lucide-react';
import { MediaItem } from '../types/tmdb';
import { tmdbService } from '../services/tmdb';
import { MediaCard } from '../components/MediaCard';
import { TrailerModal } from '../components/TrailerModal';
import { CardSkeleton, CatalogModeBanner } from '../components/CommonUI';

export const NewReleasesPage: React.FC = () => {
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([]);
  const [upcoming, setUpcoming] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState<{ key: string; title: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadReleases() {
      setIsLoading(true);
      try {
        const [now, up] = await Promise.all([
          tmdbService.getNowPlayingMovies(1),
          tmdbService.getUpcomingMovies(1),
        ]);
        if (mounted) {
          setNowPlaying(now.results);
          setUpcoming(up.results);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadReleases();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08090C] pt-20 sm:pt-24 pb-20 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
      <CatalogModeBanner />

      <div className="my-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-lg bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-gradient-silver tracking-tight uppercase">
              New Releases & In Theaters
            </h1>
            <p className="text-xs sm:text-sm text-[#A3A6B0]">
              Current cinema blockbusters and highly anticipated upcoming titles.
            </p>
          </div>
        </div>
      </div>

      {/* Now Playing Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Film className="w-5 h-5 text-[#E50914]" />
          <h2 className="text-xl font-bold text-[#F7F7F8]">In Theaters Right Now</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {nowPlaying.map((item) => (
              <div key={`np-${item.id}`} className="flex justify-center">
                <MediaCard
                  item={item}
                  onPlayTrailer={(key, title) => setActiveTrailer({ key, title })}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-[#F7F7F8]">Coming Soon to Theaters & Streaming</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {upcoming.map((item) => (
              <div key={`up-${item.id}`} className="flex justify-center">
                <MediaCard
                  item={item}
                  onPlayTrailer={(key, title) => setActiveTrailer({ key, title })}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <TrailerModal
        isOpen={Boolean(activeTrailer)}
        onClose={() => setActiveTrailer(null)}
        trailerKey={activeTrailer?.key}
        title={activeTrailer?.title || ''}
      />
    </div>
  );
};
