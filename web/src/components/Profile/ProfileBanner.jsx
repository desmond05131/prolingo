import React from 'react';
import ProfileAvatar from './ProfileAvatar';

// Row 1: Banner with avatar, name, badges aligned right
export function ProfileBanner({ profile, badges = [] }) {
  return (
    <div className="w-full flex items-center justify-between gap-8 p-6 rounded-lg bg-secondary border border-border/50 hover:shadow-md transition-shadow">
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-4 min-w-0">
        <ProfileAvatar
          src={profile?.profile_icon}
          username={profile?.username}
          size={96}
          className="shrink-0 ring-4 ring-gray-100"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-2xl font-semibold text-white truncate">{profile.username}</span>
        </div>
      </div>

      {/* Right: Badges (circular image + label) */}
      <div className="flex items-end gap-6">
        {badges.map((b) => (
          <div key={b.id} className="flex flex-col items-center w-20 text-center">
            <div
              className="h-16 w-16 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-sm"
              style={{ borderColor: b.color || '#cccccc', backgroundColor: (b.color || '#cccccc') + '22' }}
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
