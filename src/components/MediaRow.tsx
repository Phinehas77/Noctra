import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../types/tmdb';
import { MediaCard } from './MediaCard';

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  icon?: LucideIcon;
  viewAllLink?: string;
  onPlayTrailer?: (key: string, title: string) => void;
}

export const MediaRow: React.FC<MediaRowProps> = ({
  title,
  items,
  icon: Icon,
  viewAllLink,
  onPlayTrailer,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = rowRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [items]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { clientWidth } = rowRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative my-8 sm:my-10 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-5 h-5 text-[#FF5500]" />}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-display tracking-tight text-[#F7F7F8]">
            {title}
          </h2>
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-[11px] sm:text-xs font-display font-bold uppercase tracking-[0.14em] text-[#A3A6B0] hover:text-[#F7F7F8] hover:translate-x-0.5 transition-all flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#FF5500] transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Carousel container */}
      <div className="relative group/carousel">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-11 h-11 items-center justify-center rounded-full bg-[#111318]/90 text-white border border-white/10 shadow-xl backdrop-blur-md hover:bg-[#E50914] hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable track */}
        <div
          ref={rowRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((item) => (
            <div key={`${item.media_type || 'm'}-${item.id}`} style={{ scrollSnapAlign: 'start' }}>
              <MediaCard item={item} onPlayTrailer={onPlayTrailer} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-11 h-11 items-center justify-center rounded-full bg-[#111318]/90 text-white border border-white/10 shadow-xl backdrop-blur-md hover:bg-[#E50914] hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </section>
  );
};
