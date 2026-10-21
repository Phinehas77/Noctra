import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Star, Film, Tv } from 'lucide-react';
import { MediaItem } from '../types/tmdb';
import { tmdbService } from '../services/tmdb';
import { getPosterUrl } from '../data/curatedMedia';

export const SearchHeader: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const data = await tmdbService.searchMulti(query.trim(), 1);
        setResults(data.results.slice(0, 10));
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        const item = results[selectedIndex];
        const type = item.media_type || (item.title ? 'movie' : 'tv');
        navigate(`/title/${type}/${item.id}`);
        setIsOpen(false);
        setQuery('');
      } else if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    }
  };

  const handleSelectResult = (item: MediaItem) => {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    navigate(`/title/${type}/${item.id}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs md:max-w-sm">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen && e.target.value) setIsOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search 1900–2026 movies & TV..."
          className="w-full bg-[#111318]/90 text-xs sm:text-sm font-outfit text-[#F7F7F8] placeholder-[#A3A6B0]/80 pl-10 pr-9 py-2 rounded-full border border-white/10 focus:border-[#FF5500] focus:outline-none focus:ring-1 focus:ring-[#FF5500] transition-all backdrop-blur-md"
          aria-label="Search movies from 1900 to 2026 and television shows"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        <Search className="absolute left-3.5 w-4 h-4 text-[#A3A6B0] pointer-events-none" />

        <div className="absolute right-3 flex items-center gap-1.5">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-[#FF5500] animate-spin" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="p-0.5 text-[#A3A6B0] hover:text-white rounded-full hover:bg-white/10"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Instant Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 inset-x-0 bg-[#111318] border border-white/10 rounded-xl shadow-2xl shadow-black/80 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 divide-y divide-white/5 max-h-96 overflow-y-auto">
            {results.map((item, idx) => {
              const type = item.media_type || (item.title ? 'movie' : 'tv');
              const itemTitle = item.title || item.name || 'Untitled';
              const date = item.release_date || item.first_air_date || '';
              const year = date ? date.split('-')[0] : '';
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={`${type}-${item.id}`}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <img
                    src={getPosterUrl(item.poster_path, 'w185')}
                    alt={itemTitle}
                    className="w-10 h-14 object-cover rounded-md flex-shrink-0 bg-[#17191F]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#A3A6B0] mb-0.5 font-tech">
                      {type === 'movie' ? (
                        <Film className="w-3 h-3 text-[#FF5500]" />
                      ) : (
                        <Tv className="w-3 h-3 text-cyan-400" />
                      )}
                      <span className="uppercase tracking-widest font-bold text-[9px]">
                        {type === 'movie' ? 'Movie' : 'TV Show'}
                      </span>
                      {year && (
                        <>
                          <span>·</span>
                          <span className="text-zinc-400">{year}</span>
                        </>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-display font-bold text-[#F7F7F8] truncate">{itemTitle}</h4>
                  </div>
                  {item.vote_average > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-tech font-bold flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[#08090C] p-2.5 px-4 border-t border-white/5 flex items-center justify-between text-xs text-[#A3A6B0] font-tech text-[11px]">
            <span>Press Enter for full results</span>
            <button
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                setIsOpen(false);
              }}
              className="text-[#E50914] font-semibold hover:underline"
            >
              View all results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
