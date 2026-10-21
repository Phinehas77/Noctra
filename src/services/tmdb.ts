import {
  ACTION_COLLECTION,
  AIRING_TODAY_TV,
  ALL_CURATED_MEDIA,
  ANIMATION_COLLECTION,
  COMEDY_COLLECTION,
  CRITICALLY_ACCLAIMED,
  CURATED_MOVIES,
  CURATED_TV,
  findCuratedItem,
  NOW_PLAYING_MOVIES,
  ON_THE_AIR_TV,
  POPULAR_MOVIES,
  POPULAR_TV,
  SCIFI_COLLECTION,
  THRILLER_COLLECTION,
  TOP_RATED_MOVIES,
  TRENDING_MOVIES,
  UPCOMING_MOVIES,
} from '../data/curatedMedia';
import { MediaDetails, MediaItem, SeasonInfo } from '../types/tmdb';
import { getAppSettings } from './storage';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Cache for API responses to optimize performance and prevent rate limiting
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const DEFAULT_TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';

export interface SearchQueryOptions {
  page?: number;
  type?: 'all' | 'movie' | 'tv';
  year?: string;
  decade?: string;
  genreId?: number | null;
}

export function getEffectiveApiKey(): string {
  const userKey = getAppSettings().tmdbApiKey;
  if (userKey && userKey.trim().length > 0) {
    return userKey.trim();
  }
  const envKey = (import.meta.env.VITE_TMDB_API_KEY as string) || '';
  if (envKey && envKey.trim().length > 0) {
    return envKey.trim();
  }
  return DEFAULT_TMDB_API_KEY;
}

export function hasActiveApiKey(): boolean {
  return getEffectiveApiKey().length > 0;
}

async function fetchFromTmdb<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const apiKey = getEffectiveApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const query = new URLSearchParams();
  // Support both Read Access Token (Bearer JWT) and v3 API Key
  const isBearerToken = apiKey.length > 50;
  if (!isBearerToken) {
    query.set('api_key', apiKey);
  }

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.set(key, String(val));
    }
  });

  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}${query.toString()}`;

  // Check cache
  const cached = apiCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const headers: HeadersInit = {
    'Accept': 'application/json',
  };
  if (isBearerToken) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.status === 401 || res.status === 403) {
      throw new Error('INVALID_API_KEY');
    }
    if (res.status === 429) {
      throw new Error('RATE_LIMITED');
    }
    if (!res.ok) {
      throw new Error(`HTTP_ERROR_${res.status}`);
    }

    const data = await res.json();
    apiCache.set(url, { data, timestamp: Date.now() });
    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('REQUEST_TIMEOUT');
    }
    throw err;
  }
}

// Test TMDB API key validity
export async function testTmdbApiKey(key: string): Promise<{ success: boolean; message: string }> {
  if (!key || key.trim().length === 0) {
    return { success: false, message: 'API key is empty.' };
  }
  const isBearerToken = key.trim().length > 50;
  const url = isBearerToken
    ? `${TMDB_BASE_URL}/authentication`
    : `${TMDB_BASE_URL}/authentication?api_key=${encodeURIComponent(key.trim())}`;

  const headers: HeadersInit = { Accept: 'application/json' };
  if (isBearerToken) {
    headers['Authorization'] = `Bearer ${key.trim()}`;
  }

  try {
    const res = await fetch(url, { headers });
    const json = await res.json();
    if (res.ok && (json.success || json.status_code === 1)) {
      return { success: true, message: 'Valid TMDB key! Live catalog is now fully unlocked.' };
    }
    return { success: false, message: json.status_message || 'Authentication failed. Please verify your token.' };
  } catch (e: any) {
    return { success: false, message: `Connection error: ${e.message || 'Unable to reach TMDB API'}` };
  }
}

// Format TMDB API response item to MediaItem
function formatMediaItem(item: any, defaultType: 'movie' | 'tv' = 'movie'): MediaItem {
  const media_type = item.media_type || (item.title ? 'movie' : 'tv') || defaultType;
  return {
    id: item.id,
    media_type,
    title: item.title || item.name || '',
    name: item.name || item.title || '',
    original_title: item.original_title,
    original_name: item.original_name,
    overview: item.overview || '',
    poster_path: item.poster_path || null,
    backdrop_path: item.backdrop_path || null,
    vote_average: Number(item.vote_average ? Number(item.vote_average).toFixed(1) : 0),
    vote_count: item.vote_count || 0,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    genre_ids: item.genre_ids || [],
    genres: item.genres,
    popularity: item.popularity || 0,
  };
}

// TMDB Service Methods with Graceful Fallbacks to Curated Catalog
export const tmdbService = {
  async getTrending(type: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<MediaItem[]> {
    if (hasActiveApiKey()) {
      try {
        const endpoint = `/trending/${type}/${timeWindow}`;
        const res = await fetchFromTmdb<{ results: any[] }>(endpoint);
        return res.results.map((i) => formatMediaItem(i, type === 'tv' ? 'tv' : 'movie'));
      } catch (err) {
        console.warn('TMDB Trending fetch failed, falling back to curated:', err);
      }
    }
    if (type === 'tv') return POPULAR_TV;
    if (type === 'movie') return TRENDING_MOVIES;
    return [...TRENDING_MOVIES.slice(0, 4), ...POPULAR_TV.slice(0, 4)];
  },

  async getPopularMovies(page: number = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
    if (hasActiveApiKey()) {
      try {
        const res = await fetchFromTmdb<{ results: any[]; total_pages: number }>('/movie/popular', { page });
        return {
          results: res.results.map((i) => formatMediaItem(i, 'movie')),
          total_pages: Math.min(res.total_pages || 1, 50),
        };
      } catch (err) {
        console.warn('TMDB Popular Movies fetch failed, falling back:', err);
      }
    }
    return { results: POPULAR_MOVIES, total_pages: 1 };
  },

  async getTopRatedMovies(page: number = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
    if (hasActiveApiKey()) {
      try {
        const res = await fetchFromTmdb<{ results: any[]; total_pages: number }>('/movie/top_rated', { page });
        return {
          results: res.results.map((i) => formatMediaItem(i, 'movie')),
          total_pages: Math.min(res.total_pages || 1, 50),
        };
      } catch (err) {
        console.warn('TMDB Top Rated Movies fetch failed, falling back:', err);
      }
    }
    return { results: TOP_RATED_MOVIES, total_pages: 1 };
  },

  async getNowPlayingMovies(page: number = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
    if (hasActiveApiKey()) {
      try {
        const res = await fetchFromTmdb<{ results: any[]; total_pages: number }>('/movie/now_playing', { page });
        return {
          results: res.results.map((i) => formatMediaItem(i, 'movie')),
          total_pages: Math.min(res.total_pages || 1, 50),
        };
      } catch (err) {
        console.warn('TMDB Now Playing Movies fetch failed, falling back:', err);
      }
    }
    return { results: NOW_PLAYING_MOVIES, total_pages: 1 };
  },

  async getUpcomingMovies(page: number = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
    if (hasActiveApiKey()) {
      try {
        const res = await fetchFromTmdb<{ results: any[]; total_pages: number }>('/movie/upcoming', { page });
        return {
          results: res.results.map((i) => formatMediaItem(i, 'movie')),
          total_pages: Math.min(res.total_pages || 1, 50),
        };
      } catch (err) {
        console.warn('TMDB Upcoming Movies fetch failed, falling back:', err);
      }
    }
    return { results: UPCOMING_MOVIES, total_pages: 1 };
  },

  async getPopularTV(page: number = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
    if (hasActiveApiKey()) {
      try {
        const res = await fetchFromTmdb<{ results: any[]; total_pages: number }>('/tv/popular', { page });
        return {
          results: res.results.map((i) => formatMediaItem(i, 'tv')),
          total_pages: Math.min(res.total_pages || 1, 50),
        };
      } catch (err) {
        console.warn('TMDB Popular TV fetch failed, falling back:', err);
      }
    }
    return { results: POPULAR_TV, total_pages: 1 };
  },

  async getTopRatedTV(page: number = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
    if (hasActiveApiKey()) {
      try {
        const res = await fetchFromTmdb<{ results: any[]; total_pages: number }>('/tv/top_rated', { page });
        return {
          results: res.results.map((i) => formatMediaItem(i, 'tv')),
          total_pages: Math.min(res.total_pages || 1, 50),
        };
      } catch (err) {
        console.warn('TMDB Top Rated TV fetch failed, falling back:', err);
      }
    }
    return { results: POPULAR_TV.slice().reverse(), total_pages: 1 };
  },

  async getAiringTodayTV(page: number = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
    if (hasActiveApiKey()) {
      try {
        const res = await fetchFromTmdb<{ results: any[]; total_pages: number }>('/tv/airing_today', { page });
        return {
          results: res.results.map((i) => formatMediaItem(i, 'tv')),
          total_pages: Math.min(res.total_pages || 1, 50),
        };
      } catch (err) {
        console.warn('TMDB Airing Today fetch failed, falling back:', err);
      }
    }
    return { results: AIRING_TODAY_TV, total_pages: 1 };
  },

  async getOnTheAirTV(page: number = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
    if (hasActiveApiKey()) {
      try {
        const res = await fetchFromTmdb<{ results: any[]; total_pages: number }>('/tv/on_the_air', { page });
        return {
          results: res.results.map((i) => formatMediaItem(i, 'tv')),
          total_pages: Math.min(res.total_pages || 1, 50),
        };
      } catch (err) {
        console.warn('TMDB On The Air fetch failed, falling back:', err);
      }
    }
    return { results: ON_THE_AIR_TV, total_pages: 1 };
  },

  async discoverMedia(options: {
    type: 'movie' | 'tv';
    genreId?: number | null;
    year?: string;
    sortBy?: string;
    minRating?: number;
    page?: number;
  }): Promise<{ results: MediaItem[]; total_pages: number }> {
    const { type, genreId, year, sortBy = 'popularity.desc', minRating, page = 1 } = options;

    if (hasActiveApiKey()) {
      try {
        const params: Record<string, string | number> = {
          page,
          sort_by: sortBy,
        };
        if (genreId) params.with_genres = genreId;
        if (year) {
          if (type === 'movie') params.primary_release_year = year;
          else params.first_air_date_year = year;
        }
        if (minRating && minRating > 0) {
          params['vote_average.gte'] = minRating;
        }

        const endpoint = `/discover/${type}`;
        const res = await fetchFromTmdb<{ results: any[]; total_pages: number }>(endpoint, params);
        return {
          results: res.results.map((i) => formatMediaItem(i, type)),
          total_pages: Math.min(res.total_pages || 1, 50),
        };
      } catch (err) {
        console.warn('TMDB Discover fetch failed, falling back:', err);
      }
    }

    // Fallback: filter curated items
    const source = type === 'movie' ? CURATED_MOVIES : CURATED_TV;
    let filtered = source.filter((item) => {
      if (genreId && !item.genres.some((g) => g.id === genreId)) return false;
      if (year) {
        const date = item.release_date || item.first_air_date || '';
        if (!date.startsWith(year)) return false;
      }
      if (minRating && item.vote_average < minRating) return false;
      return true;
    });

    if (sortBy === 'vote_average.desc') {
      filtered.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === 'primary_release_date.desc' || sortBy === 'first_air_date.desc') {
      filtered.sort((a, b) => {
        const dateA = a.release_date || a.first_air_date || '';
        const dateB = b.release_date || b.first_air_date || '';
        return dateB.localeCompare(dateA);
      });
    }

    return { results: filtered, total_pages: 1 };
  },

  async searchMulti(
    query: string,
    options: number | SearchQueryOptions = 1
  ): Promise<{ results: MediaItem[]; total_pages: number }> {
    const trimmed = query.trim();
    if (!trimmed) {
      return { results: [], total_pages: 0 };
    }

    const page = typeof options === 'number' ? options : options.page || 1;
    const opts: SearchQueryOptions = typeof options === 'number' ? { page } : options;
    const { type = 'all', year, decade, genreId } = opts;

    if (hasActiveApiKey()) {
      try {
        let endpoint = '/search/multi';
        const params: Record<string, string | number> = {
          query: trimmed,
          page,
          include_adult: 'false',
        };

        if (type === 'movie') {
          endpoint = '/search/movie';
          if (year) params.primary_release_year = year;
        } else if (type === 'tv') {
          endpoint = '/search/tv';
          if (year) params.first_air_date_year = year;
        }

        const res = await fetchFromTmdb<{ results: any[]; total_pages: number }>(endpoint, params);

        let valid = res.results.filter(
          (i) =>
            (i.media_type === 'movie' ||
              i.media_type === 'tv' ||
              (!i.media_type && (type === 'movie' || type === 'tv'))) &&
            (i.poster_path || i.backdrop_path)
        );

        // Filter by exact year if specified (and multi-search was used)
        if (year && type === 'all') {
          valid = valid.filter((item) => {
            const date = item.release_date || item.first_air_date || '';
            return date.startsWith(year);
          });
        }

        // Filter by decade range
        if (decade && decade !== 'all') {
          valid = valid.filter((item) => {
            const date = item.release_date || item.first_air_date || '';
            if (!date) return false;
            const y = parseInt(date.substring(0, 4), 10);
            if (isNaN(y)) return false;
            if (decade === '2024-2026') return y >= 2024 && y <= 2026;
            if (decade === '2020-2023') return y >= 2020 && y <= 2023;
            if (decade === '2010s') return y >= 2010 && y <= 2019;
            if (decade === '2000s') return y >= 2000 && y <= 2009;
            if (decade === '1990s') return y >= 1990 && y <= 1999;
            if (decade === '1980s') return y >= 1980 && y <= 1989;
            if (decade === 'classic') return y < 1980;
            return true;
          });
        }

        // Filter by genre
        if (genreId) {
          valid = valid.filter(
            (item) =>
              item.genre_ids?.includes(genreId) ||
              item.genres?.some((g: any) => g.id === genreId)
          );
        }

        return {
          results: valid.map((i) => formatMediaItem(i, type === 'tv' ? 'tv' : 'movie')),
          total_pages: Math.min(res.total_pages || 1, 30),
        };
      } catch (err) {
        console.warn('TMDB Search failed, falling back to curated:', err);
      }
    }

    // Fallback search across curated
    const qLower = trimmed.toLowerCase();
    let matches = ALL_CURATED_MEDIA.filter((item) => {
      const itemTitle = (item.title || item.name || '').toLowerCase();
      const overview = (item.overview || '').toLowerCase();
      return itemTitle.includes(qLower) || overview.includes(qLower);
    });

    if (type !== 'all') {
      matches = matches.filter((item) => (item.media_type || (item.title ? 'movie' : 'tv')) === type);
    }
    if (year) {
      matches = matches.filter((item) => (item.release_date || item.first_air_date || '').startsWith(year));
    }
    if (genreId) {
      matches = matches.filter((item) => item.genre_ids?.includes(genreId) || item.genres?.some((g) => g.id === genreId));
    }

    return { results: matches, total_pages: 1 };
  },

  async getDetails(id: number | string, type: 'movie' | 'tv'): Promise<MediaDetails> {
    const numId = Number(id);

    if (hasActiveApiKey()) {
      try {
        const res = await fetchFromTmdb<any>(`/${type}/${numId}`, {
          append_to_response: 'videos,credits,similar,recommendations,external_ids',
        });

        // Pick official trailer or first YouTube video
        const videos = res.videos?.results || [];
        const trailer =
          videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
          videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') ||
          videos.find((v: any) => v.site === 'YouTube');

        // Check if there is a known legitimate stream for sample testing
        const curatedMatch = findCuratedItem(numId, type);
        const resolvedImdbId = res.external_ids?.imdb_id || res.imdb_id || curatedMatch?.imdb_id;

        return {
          id: res.id,
          media_type: type,
          title: res.title || res.name || '',
          name: res.name || res.title || '',
          original_title: res.original_title,
          original_name: res.original_name,
          tagline: res.tagline || '',
          overview: res.overview || '',
          poster_path: res.poster_path,
          backdrop_path: res.backdrop_path,
          vote_average: Number(res.vote_average ? Number(res.vote_average).toFixed(1) : 0),
          vote_count: res.vote_count,
          release_date: res.release_date,
          first_air_date: res.first_air_date,
          runtime: res.runtime,
          episode_run_time: res.episode_run_time,
          number_of_seasons: res.number_of_seasons,
          number_of_episodes: res.number_of_episodes,
          status: res.status,
          budget: res.budget,
          revenue: res.revenue,
          genres: res.genres || [],
          homepage: res.homepage,
          production_companies: res.production_companies || [],
          trailer_key: trailer ? trailer.key : curatedMatch?.trailer_key,
          legitimate_stream_url: curatedMatch?.legitimate_stream_url,
          imdb_id: resolvedImdbId,
          credits: {
            cast: (res.credits?.cast || []).slice(0, 16).map((c: any) => ({
              id: c.id,
              name: c.name,
              character: c.character || '',
              profile_path: c.profile_path,
              order: c.order,
            })),
            crew: (res.credits?.crew || []).slice(0, 10).map((c: any) => ({
              id: c.id,
              name: c.name,
              job: c.job,
              department: c.department,
            })),
          },
          videos: {
            results: videos.map((v: any) => ({
              id: v.id,
              key: v.key,
              name: v.name,
              site: v.site,
              size: v.size,
              type: v.type,
              official: Boolean(v.official),
            })),
          },
          similar: {
            results: (res.similar?.results || []).slice(0, 12).map((i: any) => formatMediaItem(i, type)),
          },
          recommendations: {
            results: (res.recommendations?.results || []).slice(0, 12).map((i: any) => formatMediaItem(i, type)),
          },
          seasons: res.seasons,
        };
      } catch (err) {
        console.warn(`TMDB details fetch failed for ${type} ${numId}:`, err);
      }
    }

    // Curated fallback
    const match = findCuratedItem(numId, type);
    if (match) {
      return match;
    }

    // Generic fallback if not in curated
    throw new Error('MEDIA_NOT_FOUND');
  },

  async getSeasonDetails(tvId: number | string, seasonNumber: number): Promise<SeasonInfo> {
    const numId = Number(tvId);

    if (hasActiveApiKey()) {
      try {
        const res = await fetchFromTmdb<any>(`/tv/${numId}/season/${seasonNumber}`);
        return {
          id: res.id,
          season_number: res.season_number,
          name: res.name || `Season ${seasonNumber}`,
          overview: res.overview || '',
          poster_path: res.poster_path,
          episode_count: res.episodes?.length || 0,
          air_date: res.air_date,
          episodes: (res.episodes || []).map((ep: any) => ({
            id: ep.id,
            episode_number: ep.episode_number,
            season_number: ep.season_number,
            name: ep.name,
            overview: ep.overview,
            air_date: ep.air_date,
            still_path: ep.still_path,
            vote_average: ep.vote_average,
            runtime: ep.runtime,
          })),
        };
      } catch (err) {
        console.warn(`TMDB Season fetch failed for tv ${tvId} s${seasonNumber}:`, err);
      }
    }

    // Curated fallback
    const show = findCuratedItem(numId, 'tv');
    if (show && show.seasons) {
      const season = show.seasons.find((s) => s.season_number === seasonNumber) || show.seasons[0];
      if (season && season.episodes && season.episodes.length > 0) return season;
    }

    // Dynamic fallback generation so every TV series ALWAYS has selectable episodes
    const fallbackCount =
      (show?.number_of_episodes &&
        show.number_of_seasons &&
        Math.ceil(show.number_of_episodes / show.number_of_seasons)) ||
      10;
    const count = Math.min(Math.max(fallbackCount, 6), 24);

    const fallbackEpisodes = Array.from({ length: count }, (_, idx) => {
      const epNum = idx + 1;
      return {
        id: numId * 1000 + seasonNumber * 50 + epNum,
        episode_number: epNum,
        season_number: seasonNumber,
        name: `Episode ${epNum}`,
        overview: `Season ${seasonNumber}, Episode ${epNum}`,
        air_date: '',
        still_path: null,
        vote_average: 8.0,
        runtime: 45,
      };
    });

    return {
      id: 9999 + seasonNumber,
      season_number: seasonNumber,
      name: `Season ${seasonNumber}`,
      overview: `Episodes for Season ${seasonNumber}`,
      poster_path: null,
      episode_count: fallbackEpisodes.length,
      episodes: fallbackEpisodes,
    };
  },

  // Homepage Collections
  getCriticallyAcclaimed(): MediaItem[] {
    return CRITICALLY_ACCLAIMED;
  },
  getActionCollection(): MediaItem[] {
    return ACTION_COLLECTION;
  },
  getComedyCollection(): MediaItem[] {
    return COMEDY_COLLECTION;
  },
  getThrillerCollection(): MediaItem[] {
    return THRILLER_COLLECTION;
  },
  getSciFiCollection(): MediaItem[] {
    return SCIFI_COLLECTION;
  },
  getAnimationCollection(): MediaItem[] {
    return ANIMATION_COLLECTION;
  },
};
