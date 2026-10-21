import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Terminal } from 'lucide-react';
import { NoctraLogo } from './NoctraLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/[0.08] bg-[#050608] text-[#A3A6B0] py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="mb-4 group inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500] rounded-lg">
              <NoctraLogo size="sm" showTagline={true} />
            </Link>
            <p className="text-xs text-[#A3A6B0] leading-relaxed mb-4">
              Your Universe, Your Screen. Ultra-premium cinematic movie and television discovery and streaming experience.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#A3A6B0]/70">
              <Shield className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Authorized Playback & Discovery</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-display font-bold uppercase tracking-[0.16em] text-[#F7F7F8] mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-medium tracking-wide">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
              </li>
              <li>
                <Link to="/tv" className="hover:text-white transition-colors">TV Series</Link>
              </li>
              <li>
                <Link to="/trending" className="hover:text-white transition-colors">Trending</Link>
              </li>
              <li>
                <Link to="/new-releases" className="hover:text-white transition-colors">New Releases</Link>
              </li>
            </ul>
          </div>

          {/* User Links */}
          <div>
            <h4 className="text-xs font-display font-bold uppercase tracking-[0.16em] text-[#F7F7F8] mb-3">
              Personal
            </h4>
            <ul className="space-y-2 text-xs font-medium tracking-wide">
              <li>
                <Link to="/my-list" className="hover:text-white transition-colors">My Watchlist</Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">Settings & API Key</Link>
              </li>
              <li>
                <Link to="/settings#history" className="hover:text-white transition-colors">Watch History</Link>
              </li>
              <li>
                <Link to="/settings#sources" className="hover:text-white transition-colors">Custom Video Sources</Link>
              </li>
            </ul>
          </div>

          {/* Legal & TMDB Attribution */}
          <div>
            <h4 className="text-xs font-display font-bold uppercase tracking-[0.16em] text-[#F7F7F8] mb-3">
              Data & Attribution
            </h4>
            <p className="text-xs leading-relaxed text-[#A3A6B0]/80 mb-3">
              This product uses the TMDB API but is not endorsed or certified by TMDB. Film artwork, actor profiles, and catalog metadata are provided courtesy of The Movie Database.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#A3A6B0]/60">
              <span className="font-semibold text-white/80">TMDB</span>
              <span>·</span>
              <span>Official YouTube Trailers</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A6B0]/70">
          <div>
            © {new Date().getFullYear()} NOCTRA. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/settings" className="hover:text-white transition-colors">API Diagnostics</Link>
            <span>·</span>
            <Link to="/settings" className="hover:text-white transition-colors">Playback Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
