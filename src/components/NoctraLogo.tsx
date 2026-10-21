import React from 'react';

interface NoctraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  iconOnly?: boolean;
}

/**
 * NoctraEmblem:
 * The signature stylized horned "N" with chiseled metallic facets,
 * sharp blade/claw tips, and an incandescent fiery crimson fissure core.
 * (Circle on the left side removed per user request).
 */
export const NoctraEmblem: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 38,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Ambient fiery red-orange back glow */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-70 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 34, 0, 0.8) 0%, rgba(220, 20, 10, 0.4) 50%, transparent 80%)',
          transform: 'scale(1.2)',
        }}
      />

      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full drop-shadow-[0_2px_12px_rgba(255,30,0,0.65)]"
      >
        <defs>
          {/* Metallic Steel Gradient */}
          <linearGradient id="emblem-steel-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#D8DCE3" />
            <stop offset="70%" stopColor="#8A909D" />
            <stop offset="100%" stopColor="#4A4F5C" />
          </linearGradient>

          <linearGradient id="emblem-steel-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7A808C" />
            <stop offset="50%" stopColor="#3F434D" />
            <stop offset="100%" stopColor="#1E2026" />
          </linearGradient>

          {/* Fiery Core Gradient */}
          <linearGradient id="emblem-fire-core" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="25%" stopColor="#FF7A00" />
            <stop offset="60%" stopColor="#FF1E00" />
            <stop offset="100%" stopColor="#B30000" />
          </linearGradient>

          <filter id="emblem-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Fiery Molten Backplate Glow for the Diagonal Crevasse */}
        <path
          d="M 32 30 L 88 95 L 76 98 L 24 38 Z"
          fill="url(#emblem-fire-core)"
          filter="url(#emblem-glow)"
          opacity="0.9"
        />

        {/* Stylized N - Left Stem with Upper Horn & Lower Spur */}
        <path
          d="M 12 18 C 18 25, 24 34, 28 48 L 28 98 C 24 104, 18 108, 14 110 L 38 106 L 38 48 L 44 38 C 36 28, 24 20, 12 18 Z"
          fill="url(#emblem-steel-dark)"
        />
        {/* Left Stem Light Bevel Face */}
        <path
          d="M 12 18 C 20 27, 26 38, 28 48 L 28 100 L 36 94 L 36 44 C 32 34, 24 24, 12 18 Z"
          fill="url(#emblem-steel-light)"
        />

        {/* Stylized N - Right Stem with Upper Bevel & Bottom Sweeping Claw */}
        <path
          d="M 80 16 L 96 16 L 96 82 C 100 90, 107 98, 116 102 C 104 103, 92 98, 86 92 L 80 86 Z"
          fill="url(#emblem-steel-light)"
        />
        <path
          d="M 84 20 L 94 20 L 94 84 C 98 92, 106 98, 114 101 C 102 101, 92 95, 86 88 L 84 84 Z"
          fill="url(#emblem-steel-dark)"
        />

        {/* Stylized N - Powerful Diagonal with Fiery Chasm */}
        {/* Upper Facet */}
        <polygon
          points="28,32 50,22 92,86 74,94"
          fill="url(#emblem-steel-dark)"
        />
        {/* Lower Facet */}
        <polygon
          points="32,44 48,34 94,94 82,102"
          fill="url(#emblem-steel-light)"
        />

        {/* Blazing Red/Orange Center Split Laser Line */}
        <path
          d="M 28 26 L 96 102"
          stroke="#FF2A00"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#emblem-glow)"
        />
        <path
          d="M 28 26 L 96 102"
          stroke="#FFF2CC"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Specular Edge Highlights */}
        <path
          d="M 12 18 C 22 26, 28 36, 30 46 M 80 16 L 96 16 M 96 82 C 102 91, 108 97, 116 102"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};

/**
 * NoctraLogo:
 * Exact vector recreation matching the uploaded art:
 * - Stylized horned metallic N (without the circle on the left) with glowing crimson core.
 * - Stylized O with split glowing thin red lines and fiery crimson edge.
 * - Chiseled futuristic C, T (dagger stem with red tip), R (split leg), and A (red right edge bevel).
 * - Tagline: "YOUR UNIVERSE. YOUR SCREEN."
 */
export const NoctraLogo: React.FC<NoctraLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  iconOnly = false,
}) => {
  const heights = {
    sm: 32,
    md: 40,
    lg: 52,
    xl: 68,
  };

  const currentHeight = heights[size];

  if (iconOnly) {
    return (
      <div className={`inline-flex items-center group select-none ${className}`}>
        <NoctraEmblem size={currentHeight} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center group select-none ${className}`}>
      <svg
        viewBox="0 0 760 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: currentHeight, width: 'auto' }}
        className="overflow-visible"
        role="img"
        aria-label="NOCTRA — YOUR UNIVERSE. YOUR SCREEN."
      >
        <defs>
          {/* Metallic Silver-Light Linear Gradient */}
          <linearGradient id="n-metal-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#E2E6EC" />
            <stop offset="70%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#5B6270" />
          </linearGradient>

          {/* Metallic Silver-Dark Linear Gradient */}
          <linearGradient id="n-metal-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7E8594" />
            <stop offset="50%" stopColor="#434854" />
            <stop offset="100%" stopColor="#1E2129" />
          </linearGradient>

          {/* Glowing Red Gradient */}
          <linearGradient id="n-red-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA67A" />
            <stop offset="30%" stopColor="#FF3700" />
            <stop offset="70%" stopColor="#E50914" />
            <stop offset="100%" stopColor="#7A0000" />
          </linearGradient>

          {/* Thin Red Laser Line Gradient */}
          <linearGradient id="n-laser-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7755" />
            <stop offset="50%" stopColor="#FF1100" />
            <stop offset="100%" stopColor="#CC0000" />
          </linearGradient>

          {/* Intense Glow Filter for Split Lines */}
          <filter id="n-glow-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft Red Ambient Filter */}
          <filter id="n-soft-red" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* =========================================================================
            1. LETTER N: Stylized metallic horned blade (No circle on left!)
            ========================================================================= */}
        <g id="letter-N">
          {/* Ambient red glow behind N diagonal chasm */}
          <path
            d="M 38 28 L 126 112 L 108 116 L 24 38 Z"
            fill="url(#n-red-glow)"
            filter="url(#n-soft-red)"
            opacity="0.8"
          />

          {/* Left Stem: Curved top horn curving up & left, flared bottom spur */}
          <path
            d="M 8 14 C 18 24, 26 36, 32 50 L 32 108 C 26 114, 18 118, 12 120 L 46 116 L 46 52 C 40 40, 26 24, 8 14 Z"
            fill="url(#n-metal-dark)"
          />
          <path
            d="M 8 14 C 18 24, 26 36, 32 50 L 32 110 L 42 104 L 42 46 C 36 34, 24 22, 8 14 Z"
            fill="url(#n-metal-light)"
          />

          {/* Right Stem: Top beveled head, sweeping bottom claw curving down-right */}
          <path
            d="M 106 14 L 128 14 L 128 88 C 134 98, 144 108, 156 112 C 142 113, 126 106, 118 98 L 106 90 Z"
            fill="url(#n-metal-light)"
          />
          <path
            d="M 112 18 L 124 18 L 124 88 C 130 96, 140 104, 150 108 C 138 108, 126 102, 118 94 L 112 88 Z"
            fill="url(#n-metal-dark)"
          />

          {/* Powerful Center Diagonal */}
          <polygon
            points="32,32 58,18 122,96 100,108"
            fill="url(#n-metal-dark)"
          />
          <polygon
            points="38,48 56,36 126,104 110,116"
            fill="url(#n-metal-light)"
          />

          {/* Glowing Red Molten Fissure down diagonal */}
          <path
            d="M 32 24 L 128 114"
            stroke="url(#n-laser-red)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#n-glow-blur)"
          />
          <path
            d="M 32 24 L 128 114"
            stroke="#FFF5D6"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Specular Edge Highlights on N tips */}
          <path
            d="M 8 14 C 20 25, 28 38, 32 50 M 106 14 L 128 14 M 128 88 C 136 98, 146 107, 156 112"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* =========================================================================
            2. LETTER O: Stylized with split glowing thin red lines!
            ========================================================================= */}
        <g id="letter-O">
          {/* Ambient red backlight behind the right split */}
          <path
            d="M 235 22 C 265 35, 275 75, 255 105 C 275 80, 275 40, 235 22 Z"
            fill="url(#n-red-glow)"
            filter="url(#n-soft-red)"
            opacity="0.9"
          />

          {/* Upper Left Segment Arc */}
          <path
            d="M 180 62 C 180 38, 200 20, 226 20 C 235 20, 244 23, 252 28 L 244 38 C 239 34, 233 32, 226 32 C 208 32, 194 46, 194 62 C 194 66, 195 70, 197 74 L 183 80 C 181 74, 180 68, 180 62 Z"
            fill="url(#n-metal-light)"
          />

          {/* Lower Left Segment Arc */}
          <path
            d="M 183 86 L 197 80 C 200 87, 206 93, 214 97 C 223 101, 233 100, 242 96 L 248 107 C 236 113, 222 113, 210 108 C 198 102, 189 94, 183 86 Z"
            fill="url(#n-metal-dark)"
          />

          {/* Right Segment Arc with Radiant Red Bevel Edge */}
          <path
            d="M 258 34 C 268 44, 274 58, 274 72 C 274 86, 268 98, 258 106 L 250 96 C 257 90, 261 82, 261 72 C 261 62, 257 52, 250 45 L 258 34 Z"
            fill="url(#n-metal-light)"
          />

          {/* --- THE SPLIT GLOWING THIN RED LINES --- */}
          {/* Top-Right Split Gap: thin red laser lines cutting through */}
          <line
            x1="240"
            y1="22"
            x2="256"
            y2="42"
            stroke="#FF2200"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#n-glow-blur)"
          />
          <line
            x1="240"
            y1="22"
            x2="256"
            y2="42"
            stroke="#FFF0E0"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Bottom-Right Split Gap: thin red laser lines cutting through */}
          <line
            x1="244"
            y1="112"
            x2="256"
            y2="92"
            stroke="#FF2200"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#n-glow-blur)"
          />
          <line
            x1="244"
            y1="112"
            x2="256"
            y2="92"
            stroke="#FFF0E0"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Left Horizontal Accent Slit line */}
          <line
            x1="178"
            y1="75"
            x2="198"
            y2="75"
            stroke="#FF2200"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#n-glow-blur)"
          />

          {/* Fiery Corona Edge Glow tracing along the outer right curve of O */}
          <path
            d="M 252 28 C 266 40, 275 55, 275 72 C 275 88, 267 102, 254 112"
            stroke="url(#n-laser-red)"
            strokeWidth="2.8"
            strokeLinecap="round"
            filter="url(#n-glow-blur)"
          />
          <path
            d="M 254 32 C 265 43, 272 56, 272 72 C 272 86, 265 98, 255 108"
            stroke="#FFD5B8"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>

        {/* =========================================================================
            3. LETTER C: Chiseled metallic crescent with thin red base glow
            ========================================================================= */}
        <g id="letter-C">
          <path
            d="M 374 38 L 362 47 C 356 38, 345 32, 332 32 C 312 32, 297 47, 297 68 C 297 88, 312 103, 332 103 C 345 103, 356 97, 363 88 L 375 97 C 365 110, 350 118, 332 118 C 304 118, 282 96, 282 68 C 282 39, 304 18, 332 18 C 350 18, 364 26, 374 38 Z"
            fill="url(#n-metal-light)"
          />
          {/* Inner shade facet */}
          <path
            d="M 332 32 C 312 32, 297 47, 297 68 C 297 88, 312 103, 332 103 C 345 103, 356 97, 363 88 L 368 93 C 358 103, 346 109, 332 109 C 310 109, 292 91, 292 68 C 292 45, 310 27, 332 27 Z"
            fill="url(#n-metal-dark)"
          />
          {/* Subtle thin red glow on bottom lip */}
          <path
            d="M 345 116 C 358 114, 368 108, 375 97"
            stroke="url(#n-laser-red)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#n-glow-blur)"
          />
        </g>

        {/* =========================================================================
            4. LETTER T: Wide top bar, tapering dagger-like center stem with red tip!
            ========================================================================= */}
        <g id="letter-T">
          {/* Ambient red flare behind the pointed blade bottom */}
          <circle
            cx="444"
            cy="118"
            r="12"
            fill="url(#n-red-glow)"
            filter="url(#n-soft-red)"
            opacity="0.9"
          />

          {/* Top Bar with Chiseled Bevels */}
          <polygon
            points="398,22 490,22 484,34 404,34"
            fill="url(#n-metal-light)"
          />
          <polygon
            points="404,34 484,34 480,38 408,38"
            fill="url(#n-metal-dark)"
          />

          {/* Dagger-like tapering stem descending to a point */}
          <polygon
            points="437,34 451,34 447,112 444,124 441,112"
            fill="url(#n-metal-dark)"
          />
          <polygon
            points="441,34 451,34 445,118 444,124"
            fill="url(#n-metal-light)"
          />

          {/* Fiery Red Glowing Blade Tip of T */}
          <path
            d="M 440 96 L 444 126 L 448 96"
            stroke="url(#n-laser-red)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#n-glow-blur)"
          />
          <path
            d="M 442 108 L 444 125 L 446 108"
            stroke="#FFF2CC"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>

        {/* =========================================================================
            5. LETTER R: Chiseled loop with separated angular leg & red inner bevel
            ========================================================================= */}
        <g id="letter-R">
          {/* Ambient red glow inside leg crevice */}
          <path
            d="M 548 70 L 590 114 L 576 116 L 540 76 Z"
            fill="url(#n-red-glow)"
            filter="url(#n-soft-red)"
            opacity="0.8"
          />

          {/* Left Vertical Spine */}
          <polygon
            points="514,22 528,22 528,114 514,114"
            fill="url(#n-metal-light)"
          />
          <polygon
            points="522,22 528,22 528,114 522,114"
            fill="url(#n-metal-dark)"
          />

          {/* Curved Upper Loop */}
          <path
            d="M 528 22 L 562 22 C 578 22, 590 32, 590 47 C 590 62, 578 71, 562 71 L 528 71 Z"
            fill="url(#n-metal-light)"
          />
          <path
            d="M 528 34 L 558 34 C 567 34, 574 39, 574 47 C 574 55, 567 59, 558 59 L 528 59 Z"
            fill="#0D0E12"
          />

          {/* Angled Kick Leg */}
          <polygon
            points="546,68 560,68 598,114 580,114"
            fill="url(#n-metal-light)"
          />

          {/* Glowing Red Inner Edge of Leg */}
          <path
            d="M 548 70 L 586 114"
            stroke="url(#n-laser-red)"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#n-glow-blur)"
          />
          <path
            d="M 548 70 L 586 114"
            stroke="#FFF2E0"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>

        {/* =========================================================================
            6. LETTER A: Futuristic delta/chevron with glowing red right bevel edge!
            ========================================================================= */}
        <g id="letter-A">
          {/* Ambient red glow along the right leg */}
          <path
            d="M 672 18 L 728 116 L 712 118 L 666 24 Z"
            fill="url(#n-red-glow)"
            filter="url(#n-soft-red)"
            opacity="0.8"
          />

          {/* Left Diagonal Leg */}
          <polygon
            points="670,18 680,24 640,114 624,114"
            fill="url(#n-metal-light)"
          />
          <polygon
            points="670,18 676,22 636,114 630,114"
            fill="url(#n-metal-dark)"
          />

          {/* Right Diagonal Leg */}
          <polygon
            points="670,18 682,18 726,114 712,114"
            fill="url(#n-metal-dark)"
          />
          <polygon
            points="678,22 682,18 722,114 716,114"
            fill="url(#n-metal-light)"
          />

          {/* Glowing Red Laser Edge Bevel on Right Leg */}
          <path
            d="M 676 18 L 724 114"
            stroke="url(#n-laser-red)"
            strokeWidth="3.4"
            strokeLinecap="round"
            filter="url(#n-glow-blur)"
          />
          <path
            d="M 676 18 L 724 114"
            stroke="#FFF6E5"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>

        {/* =========================================================================
            7. TAGLINE: "YOUR UNIVERSE. YOUR SCREEN."
            ========================================================================= */}
        {showTagline && (
          <text
            x="485"
            y="144"
            textAnchor="middle"
            fill="#9CA3AF"
            letterSpacing="0.32em"
            fontSize="15"
            fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
            fontWeight="600"
            className="uppercase select-none opacity-90"
          >
            YOUR UNIVERSE. YOUR SCREEN.
          </text>
        )}
      </svg>
    </div>
  );
};
