import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  Star,
  Film,
  Tv,
  Calendar,
  Flame,
  Laugh,
  ShieldAlert,
  Rocket,
  Palette,
} from 'lucide-react';
import { MediaItem } from '../types/tmdb';
import { tmdbService } from '../services/tmdb';
import { findCuratedItem, HERO_SPOTLIGHT_ITEMS } from '../data/curatedMedia';
import { HeroBanner } from '../components/HeroBanner';
import { MediaRow } from '../components/MediaRow';
import { ContinueWatchingRow } from '../components/ContinueWatchingRow';
import { TrailerModal } from '../components/TrailerModal';
import { HeroSkeleton, RowSkeleton, CatalogModeBanner } from '../components/CommonUI';

export const HomePage: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<MediaItem[]>(HERO_SPOTLIGHT_ITEMS);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<MediaItem[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<MediaItem[]>([]);
  const [popularTV, setPopularTV] = useState<MediaItem[]>([]);
  const [airingTodayTV, setAiringTodayTV] = useState<MediaItem[]>([]);
  const [onTheAirTV, setOnTheAirTV] = useState<MediaItem[]>([]);
  const [criticallyAcclaimed, setCriticallyAcclaimed] = useState<MediaItem[]>([]);
  const [actionMedia, setActionMedia] = useState<MediaItem[]>([]);
  const [comedyMedia, setComedyMedia] = useState<MediaItem[]>([]);
  const [thrillerMedia, setThrillerMedia] = useState<MediaItem[]>([]);
  const [sciFiMedia, setSciFiMedia] = useState<MediaItem[]>([]);
  const [animationMedia, setAnimationMedia] = useState<MediaItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState<{ key: string; title: string } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadAllContent() {
      try {
        setIsLoading(true);
        const [
          trendingM,
          popM,
          topM,
          nowM,
          upM,
          popTV,
          airingTV,
          onAirTV,
        ] = await Promise.all([
          tmdbService.getTrending('movie', 'week'),
          tmdbService.getPopularMovies(1),
          tmdbService.getTopRatedMovies(1),
          tmdbService.getNowPlayingMovies(1),
          tmdbService.getUpcomingMovies(1),
          tmdbService.getPopularTV(1),
          tmdbService.getAiringTodayTV(1),
          tmdbService.getOnTheAirTV(1),
        ]);

        if (!mounted) return;

        setTrendingMovies(trendingM);
        setPopularMovies(popM.results);
        setTopRatedMovies(topM.results);
        setNowPlayingMovies(nowM.results);
        setUpcomingMovies(upM.results);
        setPopularTV(popTV.results);
        setAiringTodayTV(airingTV.results);
        setOnTheAirTV(onAirTV.results);

        setCriticallyAcclaimed(tmdbService.getCriticallyAcclaimed());
        setActionMedia(tmdbService.getActionCollection());
        setComedyMedia(tmdbService.getComedyCollection());
        setThrillerMedia(tmdbService.getThrillerCollection());
        setSciFiMedia(tmdbService.getSciFiCollection());
        setAnimationMedia(tmdbService.getAnimationCollection());

        // Keep strictly ONLY the 5 user-requested titles in hero section:
        // 1. Breaking Bad
        // 2. 2026 Obsession
        // 3. Stranger Things
        // 4. If Wishes Could Kill
        // 5. Dark
        try {
          const enrichedHeroes = await Promise.all(
            HERO_SPOTLIGHT_ITEMS.map(async (hero) => {
              try {
                const details = await tmdbService.getDetails(hero.id, hero.media_type);
                if (details) {
                  return {
                    ...hero,
                    ...details,
                    title: hero.title || hero.name,
                    name: hero.name || hero.title,
                    tagline: details.tagline || hero.tagline,
                    trailer_key: hero.trailer_key || details.trailer_key,
                  };
                }
              } catch {
                // Keep curated hero definition
              }
              return hero;
            })
          );
          if (mounted && enrichedHeroes.length > 0) {
            setFeaturedItems(enrichedHeroes);
          }
        } catch {
          if (mounted) setFeaturedItems(HERO_SPOTLIGHT_ITEMS);
        }
      } catch (err) {
        console.error('Error loading homepage media:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadAllContent();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePlayTrailer = (key: string, title: string) => {
    setActiveTrailer({ key, title });
  };

  if (isLoading && featuredItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#08090C]">
        <CatalogModeBanner />
        <HeroSkeleton />
        <RowSkeleton count={5} />
        <RowSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090C] pb-16">
      <CatalogModeBanner />

      {/* Cinematic Hero Section */}
      <HeroBanner featuredItems={featuredItems} onPlayTrailer={handlePlayTrailer} />

      {/* Continue Watching (Only when user has real playback progress) */}
      <ContinueWatchingRow />

      {/* Reusable Content Rows */}
      <MediaRow
        title="Trending Movies"
        items={trendingMovies}
        icon={TrendingUp}
        viewAllLink="/trending"
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Popular Movies"
        items={popularMovies}
        icon={Flame}
        viewAllLink="/movies"
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Top Rated Movies"
        items={topRatedMovies}
        icon={Star}
        viewAllLink="/movies?tab=top_rated"
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Now Playing in Theaters"
        items={nowPlayingMovies}
        icon={Film}
        viewAllLink="/new-releases"
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Upcoming Movies"
        items={upcomingMovies}
        icon={Calendar}
        viewAllLink="/movies?tab=upcoming"
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Popular TV Shows"
        items={popularTV}
        icon={Tv}
        viewAllLink="/tv"
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="TV Shows Airing Today"
        items={airingTodayTV}
        icon={Sparkles}
        viewAllLink="/tv?tab=airing_today"
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Currently Airing TV Shows"
        items={onTheAirTV}
        icon={TrendingUp}
        viewAllLink="/tv?tab=on_the_air"
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Critically Acclaimed Masterpieces"
        items={criticallyAcclaimed}
        icon={Star}
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Action & Adventure"
        items={actionMedia}
        icon={Flame}
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Comedy"
        items={comedyMedia}
        icon={Laugh}
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Thriller & Mystery"
        items={thrillerMedia}
        icon={ShieldAlert}
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Science Fiction & Fantasy"
        items={sciFiMedia}
        icon={Rocket}
        onPlayTrailer={handlePlayTrailer}
      />

      <MediaRow
        title="Animation"
        items={animationMedia}
        icon={Palette}
        onPlayTrailer={handlePlayTrailer}
      />

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
