import { ContinueWatchingItem, PlaybackSourceConfig, WatchlistItem } from '../types/tmdb';

const STORAGE_KEYS = {
  WATCHLIST: 'cinemora_watchlist_v1',
  CONTINUE_WATCHING: 'cinemora_continue_watching_v1',
  HISTORY: 'cinemora_watch_history_v1',
  CUSTOM_SOURCES: 'cinemora_custom_sources_v1',
  SETTINGS: 'cinemora_settings_v1',
};

export type FontTheme = 'urbanist' | 'space-grotesk' | 'montserrat' | 'oswald' | 'cinzel';

export interface AppSettings {
  tmdbApiKey: string;
  reducedMotion: boolean;
  autoplayTrailers: boolean;
  defaultAudioVolume: number;
  fontTheme: FontTheme;
}

const DEFAULT_SETTINGS: AppSettings = {
  tmdbApiKey: '',
  reducedMotion: false,
  autoplayTrailers: false,
  defaultAudioVolume: 0.8,
  fontTheme: 'urbanist',
};

export function applyFontTheme(theme: FontTheme = 'urbanist'): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-font-theme', theme);
  }
}

// Safe JSON parser
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Watchlist operations
export function getWatchlist(): WatchlistItem[] {
  return safeGet<WatchlistItem[]>(STORAGE_KEYS.WATCHLIST, []);
}

export function isInWatchlist(id: number, media_type: string): boolean {
  const list = getWatchlist();
  return list.some((item) => item.id === id && item.media_type === media_type);
}

export function addToWatchlist(item: Omit<WatchlistItem, 'added_at'>): void {
  const list = getWatchlist();
  const exists = list.some((i) => i.id === item.id && i.media_type === item.media_type);
  if (!exists) {
    const updated = [{ ...item, added_at: Date.now() }, ...list];
    safeSet(STORAGE_KEYS.WATCHLIST, updated);
    window.dispatchEvent(new CustomEvent('cinemora_watchlist_changed'));
  }
}

export function removeFromWatchlist(id: number, media_type: string): void {
  const list = getWatchlist();
  const filtered = list.filter((i) => !(i.id === id && i.media_type === media_type));
  safeSet(STORAGE_KEYS.WATCHLIST, filtered);
  window.dispatchEvent(new CustomEvent('cinemora_watchlist_changed'));
}

export function toggleWatchlist(item: Omit<WatchlistItem, 'added_at'>): boolean {
  if (isInWatchlist(item.id, item.media_type)) {
    removeFromWatchlist(item.id, item.media_type);
    return false;
  } else {
    addToWatchlist(item);
    return true;
  }
}

// Continue Watching operations
export function getContinueWatching(): ContinueWatchingItem[] {
  return safeGet<ContinueWatchingItem[]>(STORAGE_KEYS.CONTINUE_WATCHING, []).sort(
    (a, b) => b.lastWatched - a.lastWatched
  );
}

export function updateContinueWatching(progress: Omit<ContinueWatchingItem, 'lastWatched' | 'percent'>): void {
  if (!progress.durationSeconds || progress.durationSeconds <= 0) return;
  const percent = Math.min(100, Math.round((progress.progressSeconds / progress.durationSeconds) * 100));

  // If completed (more than 95%), remove from continue watching
  if (percent >= 95) {
    removeContinueWatching(progress.id, progress.media_type);
    return;
  }

  // Only record if watched at least 10 seconds
  if (progress.progressSeconds < 10) return;

  const list = getContinueWatching().filter(
    (item) => !(item.id === progress.id && item.media_type === progress.media_type)
  );

  const updated: ContinueWatchingItem = {
    ...progress,
    percent,
    lastWatched: Date.now(),
  };

  safeSet(STORAGE_KEYS.CONTINUE_WATCHING, [updated, ...list].slice(0, 20));
  window.dispatchEvent(new CustomEvent('cinemora_progress_changed'));
}

export function removeContinueWatching(id: number, media_type: string): void {
  const list = getContinueWatching();
  const filtered = list.filter((item) => !(item.id === id && item.media_type === media_type));
  safeSet(STORAGE_KEYS.CONTINUE_WATCHING, filtered);
  window.dispatchEvent(new CustomEvent('cinemora_progress_changed'));
}

export function getPlaybackPosition(id: number, media_type: string): number {
  const list = getContinueWatching();
  const found = list.find((item) => item.id === id && item.media_type === media_type);
  return found ? found.progressSeconds : 0;
}

// Custom Authorized Playback Sources
export function getCustomSources(): PlaybackSourceConfig[] {
  return safeGet<PlaybackSourceConfig[]>(STORAGE_KEYS.CUSTOM_SOURCES, []);
}

export function getCustomSourceForMedia(id: number, media_type: string): string | null {
  const sources = getCustomSources();
  const match = sources.find((s) => s.id === id && s.media_type === media_type);
  return match ? match.sourceUrl : null;
}

export function saveCustomSource(config: Omit<PlaybackSourceConfig, 'addedAt'>): void {
  const sources = getCustomSources().filter(
    (s) => !(s.id === config.id && s.media_type === config.media_type)
  );
  sources.unshift({ ...config, addedAt: Date.now() });
  safeSet(STORAGE_KEYS.CUSTOM_SOURCES, sources);
}

export function deleteCustomSource(id: number, media_type: string): void {
  const sources = getCustomSources().filter(
    (s) => !(s.id === id && s.media_type === media_type)
  );
  safeSet(STORAGE_KEYS.CUSTOM_SOURCES, sources);
}

// Settings
export function getAppSettings(): AppSettings {
  const stored = safeGet<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function updateAppSettings(partial: Partial<AppSettings>): AppSettings {
  const current = getAppSettings();
  const updated = { ...current, ...partial };
  safeSet(STORAGE_KEYS.SETTINGS, updated);
  if (updated.fontTheme) {
    applyFontTheme(updated.fontTheme);
  }
  window.dispatchEvent(new CustomEvent('cinemora_settings_changed', { detail: updated }));
  return updated;
}

export function clearWatchHistory(): void {
  safeSet(STORAGE_KEYS.CONTINUE_WATCHING, []);
  safeSet(STORAGE_KEYS.HISTORY, []);
  window.dispatchEvent(new CustomEvent('cinemora_progress_changed'));
}
