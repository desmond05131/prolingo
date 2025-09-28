import React from 'react';

/**
 * ProfileAvatar
 * - Renders a user's profile image when available
 * - Falls back to a generated SVG (as a data URL) that shows the user's initials
 *
 * Props
 * - src?: string (image url)
 * - username?: string (used for initials + alt text)
 * - size?: number (px) - container width/height
 * - className?: string - extra classes for the outer container
 * - rounded?: boolean - circle when true, rounded square when false
 * - alt?: string - accessible alt text
 */
export default function ProfileAvatar({
  src,
  username = '',
  size = 96,
  className = '',
  rounded = true,
  alt,
}) {
  const initials = getInitials(username);
  const bg = colorFromString(username);
  const svgUrl = svgInitialsDataUrl({ initials, size, bg });

  const [failed, setFailed] = React.useState(false);
  const imgSrc = !src ? svgUrl : src;

  return (
    <div
      className={`overflow-hidden ${rounded ? 'rounded-full' : 'rounded-md'} bg-gray-200 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={imgSrc}
        alt={alt || username || 'Profile image'}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
        draggable={false}
      />
    </div>
  );
}

function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name
    .split(/\s|[_-]+/)
    .filter(Boolean)
    .slice(0, 2); // up to 2 words
  if (parts.length === 0) return '?';
  const letters = parts.map((p) => p.charAt(0)).join('');
  return letters.toUpperCase().slice(0, 2);
}

function colorFromString(str) {
  // deterministic pastel-ish background from string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const hue = Math.abs(hash) % 360;
  const saturation = 70; // 0-100
  const lightness = 45; // 0-100
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function svgInitialsDataUrl({ initials, size, bg }) {
  const fontSize = Math.round(size * 0.42);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <style>
      .text { font: ${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="${bg}" rx="${size / 2}" ry="${size / 2}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" class="text" fill="#ffffff">${escapeXml(
    initials
  )}</text>
</svg>`;
  const encoded = encodeURIComponent(svg)
    // encodeURIComponent doesn't encode single quotes which can break data URIs in some cases
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
  return `data:image/svg+xml;utf8,${encoded}`;
}

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
