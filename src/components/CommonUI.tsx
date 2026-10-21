import React from 'react';
import { Link } from 'react-router-dom';
import { Film, AlertCircle, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { hasActiveApiKey } from '../services/tmdb';

export const CardSkeleton: React.FC = () => (
  <div className="flex-shrink-0 w-36 sm:w-44 md:w-52 lg:w-56 animate-pulse">
    <div className="aspect-[2/3] w-full rounded-xl bg-[#17191F] border border-white/5" />
    <div className="mt-2.5 px-1 space-y-2">
      <div className="h-3 w-1/2 bg-[#17191F] rounded" />
      <div className="h-4 w-3/4 bg-[#17191F] rounded" />
    </div>
  </div>
);

export const RowSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="my-8 sm:my-10 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto animate-pulse">
    <div className="h-6 w-48 bg-[#17191F] rounded mb-4" />
    <div className="flex gap-4 sm:gap-5 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const HeroSkeleton: React.FC = () => (
  <div className="w-full h-[65vh] min-h-[480px] bg-[#111318] animate-pulse relative flex items-end p-8 sm:p-12">
    <div className="max-w-2xl space-y-4">
      <div className="h-4 w-32 bg-[#17191F] rounded" />
      <div className="h-10 w-96 bg-[#17191F] rounded" />
      <div className="h-16 w-full bg-[#17191F] rounded" />
      <div className="flex gap-3 pt-2">
        <div className="h-11 w-36 bg-[#17191F] rounded-lg" />
        <div className="h-11 w-32 bg-[#17191F] rounded-lg" />
      </div>
    </div>
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({
  title,
  description,
  actionText = 'Browse Movies',
  actionLink = '/movies',
  onAction,
  icon,
}) => (
  <div className="py-20 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
    <div className="w-16 h-16 rounded-2xl bg-[#17191F] border border-white/10 flex items-center justify-center text-[#A3A6B0] mb-5">
      {icon || <Film className="w-8 h-8 text-[#E50914]" />}
    </div>
    <h3 className="text-xl font-bold text-[#F7F7F8] mb-2">{title}</h3>
    <p className="text-sm text-[#A3A6B0] leading-relaxed mb-6">{description}</p>
    {actionText && (
      onAction ? (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-sm transition-all shadow-lg shadow-[#E50914]/20 hover:scale-105 active:scale-95"
        >
          {actionText}
        </button>
      ) : (
        <Link
          to={actionLink}
          className="px-5 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-sm transition-all shadow-lg shadow-[#E50914]/20 hover:scale-105 active:scale-95"
        >
          {actionText}
        </Link>
      )
    )}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Something went wrong',
  message = 'We encountered an issue fetching this content from the media database.',
  onRetry,
}) => (
  <div className="py-16 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#E50914] mb-4">
      <AlertCircle className="w-7 h-7" />
    </div>
    <h3 className="text-lg font-bold text-[#F7F7F8] mb-2">{title}</h3>
    <p className="text-sm text-[#A3A6B0] mb-5">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#17191F] hover:bg-[#20232B] border border-white/10 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    )}
  </div>
);

export const CatalogModeBanner: React.FC = () => {
  const isLive = hasActiveApiKey();

  if (isLive) return null;

  return (
    <div className="bg-[#111318]/90 border-b border-white/10 text-xs text-[#A3A6B0] px-4 py-2 flex items-center justify-between gap-3 max-w-[1600px] mx-auto mt-18 sm:mt-20">
      <div className="flex items-center gap-2 truncate">
        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
        <span className="truncate">
          <strong className="text-[#F7F7F8]">Curated Catalog Active:</strong> Exploring curated blockbusters & trailers. Add your TMDB API key in Settings for global live search.
        </span>
      </div>
      <Link
        to="/settings"
        className="flex-shrink-0 text-[#E50914] hover:underline font-semibold flex items-center gap-1"
      >
        <KeyRound className="w-3.5 h-3.5" />
        <span>Configure Key</span>
      </Link>
    </div>
  );
};
