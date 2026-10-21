import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { Genre } from '../types/tmdb';

interface GenreFilterBarProps {
  genres: Genre[];
  selectedGenre: number | null;
  onSelectGenre: (genreId: number | null) => void;
  className?: string;
}

export const GenreFilterBar: React.FC<GenreFilterBarProps> = ({
  genres,
  selectedGenre,
  onSelectGenre,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className={`relative group/genre-bar my-4 ${className}`}>
      {/* Scroll Left Button on Desktop */}
      <button
        onClick={() => handleScroll('left')}
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-[#111318]/90 text-white border border-white/10 shadow-lg backdrop-blur-md hover:bg-[#E50914] transition-all opacity-0 group-hover/genre-bar:opacity-100 focus:opacity-100"
        aria-label="Scroll genres left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Horizontally scrollable genre tags */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-0.5 scroll-smooth"
        role="group"
        aria-label="Filter by genre"
      >
        {/* 'All' tag */}
        <button
          onClick={() => onSelectGenre(null)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-display font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500] ${
            selectedGenre === null
              ? 'bg-gradient-to-r from-[#FF5500] to-[#E50914] text-white shadow-md shadow-[#E50914]/30 scale-[1.02]'
              : 'bg-[#17191F] text-[#A3A6B0] hover:text-[#F7F7F8] hover:bg-[#222630] border border-white/5 hover:border-white/15'
          }`}
          aria-pressed={selectedGenre === null}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Genres</span>
        </button>

        {/* Individual genre tags */}
        {genres.map((g) => {
          const isSelected = selectedGenre === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onSelectGenre(isSelected ? null : g.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-display font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500] ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FF5500] to-[#E50914] text-white shadow-md shadow-[#E50914]/30 scale-[1.02]'
                  : 'bg-[#17191F] text-[#A3A6B0] hover:text-[#F7F7F8] hover:bg-[#222630] border border-white/5 hover:border-white/15'
              }`}
              aria-pressed={isSelected}
            >
              <span>{g.name}</span>
              {isSelected && <X className="w-3 h-3 text-white/80" />}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button on Desktop */}
      <button
        onClick={() => handleScroll('right')}
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-[#111318]/90 text-white border border-white/10 shadow-lg backdrop-blur-md hover:bg-[#E50914] transition-all opacity-0 group-hover/genre-bar:opacity-100 focus:opacity-100"
        aria-label="Scroll genres right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
