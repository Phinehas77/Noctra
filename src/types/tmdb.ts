export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path?: string | null;
}

export interface VideoItem {
  id: string;
  key: string; // YouTube video ID
  name: string;
  site: string;
  size: number;
  type: string; // 'Trailer' | 'Teaser' | 'Clip' | 'Featurette'
  official: boolean;
  published_at?: string;
}

export interface EpisodeInfo {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  runtime?: number;
  video_url?: string; // Optional configured legitimate playback URL
}

export interface SeasonInfo {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  episode_count: number;
  air_date?: string;
  episodes?: EpisodeInfo[];
}

export interface MediaItem {
  id: number;
  title?: string;
  name?: string; // TV shows use 'name'
  original_title?: string;
  original_name?: string;
  media_type: MediaType;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count?: number;
  release_date?: string; // Movies
  first_air_date?: string; // TV
  genre_ids?: number[];
  genres?: Genre[];
  popularity?: number;
  adult?: boolean;
  // Extra convenience fields
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
  trailer_key?: string;
  legitimate_stream_url?: string;
  imdb_id?: string;
}

export interface MediaDetails extends MediaItem {
  tagline: string;
  runtime?: number; // for movies
  episode_run_time?: number[]; // for TV
  number_of_seasons?: number;
  number_of_episodes?: number;
  status: string;
  budget?: number;
  revenue?: number;
  genres: Genre[];
  homepage?: string;
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: VideoItem[];
  };
  similar?: {
    results: MediaItem[];
  };
  recommendations?: {
    results: MediaItem[];
  };
  seasons?: SeasonInfo[];
}

export interface WatchlistItem {
  id: number;
  media_type: MediaType;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_year: string;
  added_at: number;
  overview: string;
}

export interface ContinueWatchingItem {
  id: number;
  media_type: MediaType;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  progressSeconds: number;
  durationSeconds: number;
  percent: number;
  lastWatched: number;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  streamUrl?: string;
}

export interface PlaybackSourceConfig {
  id: number;
  media_type: MediaType;
  sourceUrl: string;
  sourceType: 'mp4' | 'webm' | 'hls' | 'custom';
  title: string;
  notes?: string;
  addedAt: number;
}
