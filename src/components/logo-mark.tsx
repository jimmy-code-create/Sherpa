import * as React from "react";

/**
 * Sherpa logo mark (v2): an indigo squircle with a white summit peak, a light
 * back ridge, an amber summit flag and a dotted trail leading up — "your
 * guide to the top". Single source of truth for the inline SVG; the same
 * artwork is exported to public/icon.svg + PNGs by scripts/render-icons.mjs.
 */
export function LogoMarkSvg({ size = 28, className }: { size?: number; className?: string }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const gid = `sherpa-bg-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-label="Sherpa logo"
      className={className}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill={`url(#${gid})`} />
      {/* back ridge */}
      <path d="M56 384 L208 184 L320 336 Z" fill="#A5B4FC" opacity="0.9" />
      {/* front summit */}
      <path d="M176 384 L320 168 L456 384 Z" fill="#FFFFFF" />
      {/* summit flag */}
      <path d="M320 168 L320 106" stroke="#312E81" strokeWidth="13" strokeLinecap="round" />
      <path d="M320 106 L392 127 L320 150 Z" fill="#F59E0B" />
      {/* dotted trail to the summit */}
      <circle cx="228" cy="322" r="11" fill="#F59E0B" />
      <circle cx="256" cy="280" r="9.5" fill="#F59E0B" opacity="0.92" />
      <circle cx="284" cy="238" r="8" fill="#F59E0B" opacity="0.84" />
      <circle cx="303" cy="205" r="7" fill="#F59E0B" opacity="0.76" />
    </svg>
  );
}
