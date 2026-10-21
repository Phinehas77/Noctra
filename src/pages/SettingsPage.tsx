import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Sliders,
  Shield,
  ExternalLink,
  Volume2,
  RefreshCw,
  Video,
  Type,
} from 'lucide-react';
import {
  getAppSettings,
  updateAppSettings,
  clearWatchHistory,
  getCustomSources,
  deleteCustomSource,
  getWatchlist,
  FontTheme,
} from '../services/storage';
import { testTmdbApiKey, hasActiveApiKey } from '../services/tmdb';
import { PlaybackSourceConfig } from '../types/tmdb';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState(getAppSettings());
  const [apiKeyInput, setApiKeyInput] = useState(settings.tmdbApiKey);
  const [testStatus, setTestStatus] = useState<{
    tested: boolean;
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({
    tested: false,
    loading: false,
  });

  const [customSources, setCustomSources] = useState<PlaybackSourceConfig[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setCustomSources(getCustomSources());
  }, []);

  const handleTestKey = async () => {
    if (!apiKeyInput.trim()) {
      setTestStatus({
        tested: true,
        loading: false,
        success: false,
        message: 'Please enter a TMDB API key or Bearer token first.',
      });
      return;
    }

    setTestStatus({ tested: false, loading: true });
    const res = await testTmdbApiKey(apiKeyInput.trim());
    setTestStatus({
      tested: true,
      loading: false,
      success: res.success,
      message: res.message,
    });

    if (res.success) {
      updateAppSettings({ tmdbApiKey: apiKeyInput.trim() });
      setSettings(getAppSettings());
      showToast('TMDB API Key verified and saved successfully!');
    }
  };

  const handleSaveKey = () => {
    updateAppSettings({ tmdbApiKey: apiKeyInput.trim() });
    setSettings(getAppSettings());
    showToast('API Key saved.');
  };

  const handleClearKey = () => {
    setApiKeyInput('');
    updateAppSettings({ tmdbApiKey: '' });
    setSettings(getAppSettings());
    setTestStatus({ tested: false, loading: false });
    showToast('Reset to Curated Catalog Mode.');
  };

  const handleToggleReducedMotion = () => {
    const updated = updateAppSettings({ reducedMotion: !settings.reducedMotion });
    setSettings(updated);
  };

  const handleToggleAutoplay = () => {
    const updated = updateAppSettings({ autoplayTrailers: !settings.autoplayTrailers });
    setSettings(updated);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all playback progress and viewing history?')) {
      clearWatchHistory();
      showToast('Watch history has been cleared.');
    }
  };

  const handleDeleteSource = (id: number, type: string) => {
    deleteCustomSource(id, type);
    setCustomSources(getCustomSources());
    showToast('Custom playback source removed.');
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const isLive = hasActiveApiKey();

  return (
    <div className="min-h-screen bg-[#08090C] pt-20 sm:pt-24 pb-20 px-4 sm:px-8 lg:px-12 max-w-4xl mx-auto">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17191F] text-white border border-[#E50914] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="my-6 pb-6 border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-black font-display text-gradient-silver tracking-tight mb-2 uppercase">
          Settings & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-[#A3A6B0]">
          Manage API connectivity, viewing preferences, and custom playback sources.
        </p>
      </div>

      <div className="space-y-8">
        {/* TMDB API Integration Panel */}
        <section className="bg-[#111318] border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/20">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display tracking-tight text-[#F7F7F8]">The Movie Database (TMDB) API</h2>
                <p className="text-xs text-[#A3A6B0]">
                  Configure your credentials to query live multi-search and global catalogs.
                </p>
              </div>
            </div>

            {/* Current Status Pill */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                isLive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>{isLive ? 'Live TMDB Connected' : 'Curated Catalog Active'}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A3A6B0] uppercase mb-1.5">
                API Key (v3 auth) or API Read Access Token (v4 Bearer)
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="e.g. 8f9a2b... or eyJhbGciOi..."
                  className="flex-1 bg-[#17191F] border border-white/10 text-sm text-[#F7F7F8] rounded-xl px-4 py-2.5 focus:border-[#E50914] focus:outline-none"
                />
                <button
                  onClick={handleTestKey}
                  disabled={testStatus.loading}
                  className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {testStatus.loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <span>Test & Save</span>
                  )}
                </button>
                {apiKeyInput && (
                  <button
                    onClick={handleClearKey}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-[#A3A6B0] hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Test result status message */}
            {testStatus.tested && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border ${
                  testStatus.success
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
              >
                {testStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}

            {/* Help callout */}
            <div className="bg-[#17191F]/80 rounded-xl p-4 border border-white/5 text-xs text-[#A3A6B0] space-y-1.5">
              <p className="font-semibold text-[#F7F7F8]">How to get a free TMDB API Key:</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>Create a free account on <a href="https://www.themoviedb.org/signup" target="_blank" rel="noreferrer" className="text-[#E50914] hover:underline inline-flex items-center gap-0.5">themoviedb.org <ExternalLink className="w-3 h-3" /></a></li>
                <li>Go to Account Settings &gt; API and click "Create API Key" (choose "Developer")</li>
                <li>Paste your API Key or Read Access Token into the box above and click "Test & Save"</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Typography & Aesthetic Panel */}
        <section className="bg-[#111318] border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/20">
              <Type className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display tracking-tight text-[#F7F7F8]">
                Typography & Visual Aesthetic
              </h2>
              <p className="text-xs text-[#A3A6B0]">
                Choose the font styling that defines NOCTRA across all banners, cards, and titles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {[
              {
                id: 'urbanist',
                name: 'Urbanist',
                tag: 'Active Default',
                desc: 'Modern luxury cinema & razor-sharp geometry (Apple TV+ / A24 style)',
                preview: 'NOCTRA 2026',
                fontStyle: { fontFamily: "'Urbanist', sans-serif" },
              },
              {
                id: 'space-grotesk',
                name: 'Space Grotesk',
                tag: 'Sci-Fi / Tech',
                desc: 'Futuristic angled cuts with high-tech cinematic swagger',
                preview: 'NOCTRA 2026',
                fontStyle: { fontFamily: "'Space Grotesk', sans-serif" },
              },
              {
                id: 'montserrat',
                name: 'Montserrat',
                tag: 'IMAX Blockbuster',
                desc: 'Bold, wide, high-impact theatrical presence',
                preview: 'NOCTRA 2026',
                fontStyle: { fontFamily: "'Montserrat', sans-serif" },
              },
              {
                id: 'oswald',
                name: 'Oswald',
                tag: 'Theatrical Marquee',
                desc: 'Tall, condensed poster display style',
                preview: 'NOCTRA 2026',
                fontStyle: { fontFamily: "'Oswald', sans-serif" },
              },
              {
                id: 'cinzel',
                name: 'Cinzel',
                tag: 'Roman Imperial',
                desc: 'Prestige classical cinematic serif with majestic weight',
                preview: 'NOCTRA 2026',
                fontStyle: { fontFamily: "'Cinzel', serif" },
              },
            ].map((font) => {
              const isCurrent = (settings.fontTheme || 'urbanist') === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => {
                    const updated = updateAppSettings({ fontTheme: font.id as FontTheme });
                    setSettings(updated);
                    showToast(`Font changed to ${font.name}`);
                  }}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-gradient-to-br from-[#FF5500]/15 to-[#E50914]/10 border-[#FF5500] ring-1 ring-[#FF5500]/50 shadow-lg shadow-black/40'
                      : 'bg-[#17191F]/70 border-white/5 hover:border-white/20 hover:bg-[#17191F]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      {font.name}
                    </span>
                    {isCurrent ? (
                      <span className="text-[10px] font-tech font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF5500] text-white">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-tech text-[#A3A6B0]">
                        {font.tag}
                      </span>
                    )}
                  </div>
                  <div
                    className="text-lg font-bold tracking-tight text-white mb-2"
                    style={font.fontStyle}
                  >
                    {font.preview}
                  </div>
                  <p className="text-[11px] text-[#A3A6B0] leading-snug">
                    {font.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Playback & Interface Preferences */}
        <section className="bg-[#111318] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#F7F7F8] mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#E50914]" />
            <span>Viewing & Player Experience</span>
          </h2>

          <div className="divide-y divide-white/5">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-[#F7F7F8]">Reduced Motion</h4>
                <p className="text-xs text-[#A3A6B0]">
                  Disable smooth carousel transitions and hero zoom animations.
                </p>
              </div>
              <button
                onClick={handleToggleReducedMotion}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  settings.reducedMotion ? 'bg-[#E50914]' : 'bg-white/20'
                }`}
                aria-label="Toggle reduced motion"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-[#F7F7F8]">Autoplay Trailers</h4>
                <p className="text-xs text-[#A3A6B0]">
                  Automatically start trailer playback when opening modal preview.
                </p>
              </div>
              <button
                onClick={handleToggleAutoplay}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  settings.autoplayTrailers ? 'bg-[#E50914]' : 'bg-white/20'
                }`}
                aria-label="Toggle autoplay trailers"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.autoplayTrailers ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Configured Playback Sources */}
        <section className="bg-[#111318] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#F7F7F8] mb-2 flex items-center gap-2">
            <Video className="w-5 h-5 text-[#E50914]" />
            <span>Custom Authorized Playback Sources</span>
          </h2>
          <p className="text-xs text-[#A3A6B0] mb-4">
            Manage authorized stream URLs associated with titles in your personal installation.
          </p>

          {customSources.length === 0 ? (
            <p className="text-xs text-[#A3A6B0]/70 italic py-2">
              No custom playback sources configured yet. When watching a title, you can associate a direct MP4 or WebM stream URL.
            </p>
          ) : (
            <div className="space-y-3">
              {customSources.map((s) => (
                <div
                  key={`${s.media_type}-${s.id}`}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#17191F] border border-white/5 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-white block truncate">{s.title}</span>
                    <span className="text-[#A3A6B0] truncate block font-mono text-[11px]">
                      {s.sourceUrl}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSource(s.id, s.media_type)}
                    className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-white/5 transition-colors"
                    title="Remove source"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Data & History Management */}
        <section className="bg-[#111318] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#F7F7F8] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#E50914]" />
            <span>Privacy & Storage</span>
          </h2>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleClearHistory}
              className="px-4 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Watch History & Progress</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
