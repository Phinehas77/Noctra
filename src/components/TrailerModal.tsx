import React, { useEffect } from 'react';
import { X, Play, AlertCircle } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerKey?: string | null;
  title: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  trailerKey,
  title,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} Official Trailer`}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-[#111318] border border-white/10 shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#08090C]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E50914] animate-pulse" />
            <h3 className="text-base sm:text-lg font-semibold text-[#F7F7F8] truncate max-w-md">
              {title} <span className="text-sm font-normal text-[#A3A6B0]">· Official Trailer</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A3A6B0] hover:text-white rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]"
            aria-label="Close trailer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video w-full bg-black">
          {trailerKey ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#A3A6B0]">
                <AlertCircle className="w-8 h-8 text-[#E50914]" />
              </div>
              <h4 className="text-lg font-medium text-[#F7F7F8] mb-2">
                Official Trailer Unavailable
              </h4>
              <p className="text-sm text-[#A3A6B0] max-w-md">
                No YouTube trailer metadata was found for this specific title in TMDB. You can explore the full details page or browse related titles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
