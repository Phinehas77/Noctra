import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08090C] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#17191F] border border-white/10 flex items-center justify-center text-[#E50914] mb-6 shadow-2xl">
        <Film className="w-10 h-10" />
      </div>
      <span className="text-[#E50914] font-mono text-sm tracking-widest uppercase font-bold mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F7F7F8] tracking-tight mb-3">
        Scene Not Found
      </h1>
      <p className="text-sm text-[#A3A6B0] max-w-md mb-8 leading-relaxed">
        The title, episode, or page you were looking for doesn't exist or has moved. Return to our homepage to continue exploring.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-sm transition-all shadow-lg shadow-[#E50914]/25 hover:scale-105 active:scale-95"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
