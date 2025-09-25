import React from 'react';
import { MOCK_PROFILE } from '../../constants';

// Row 1: Banner with avatar, name, badges aligned right
export function ProfileBanner({ profile = MOCK_PROFILE }) {
  const displayBadges = profile.badges.slice(0, 3);
  return (
    <div className="w-full flex items-center justify-between gap-8 p-6 rounded-lg bg-secondary border border-border/50 hover:shadow-md transition-shadow">
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-24 w-24 shrink-0 rounded-full bg-gray-200 overflow-hidden ring-4 ring-gray-100 flex items-center justify-center">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/public/assets/Logo.png';
            }}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-2xl font-semibold text-white truncate">{profile.name}</span>
        </div>
      </div>

      {/* Right: Badges (circular image + label) */}
      <div className="flex items-end gap-6">
        {displayBadges.map((b) => (
          <div key={b.id} className="flex flex-col items-center w-20 text-center">
            <div
              className="h-16 w-16 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-sm"
              style={{ borderColor: b.color, backgroundColor: b.color + '22' }}
            >
              {b.imageUrl ? (
                <img
                  src={b.imageUrl}
                  alt={b.label}
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-white text-xs font-medium">{b.label[0]}</span>
              )}
            </div>
            <span className="mt-2 text-[11px] leading-tight font-medium text-white/90 truncate w-full">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
