import React from 'react';
import ProfileAvatar from '../Profile/ProfileAvatar';

export default function ProfileCard({ username, profile_icon, currentLevel, levelProgressPercent }) {
  return (
    <div className="rounded-xl bg-primary-600/90 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-lg">
      <ProfileAvatar src={profile_icon} alt={username} size={80} />
      {/* <div className="flex-shrink-0 h-20 w-20 rounded-full bg-white border-4 border-black/30 flex items-center justify-center text-2xl font-bold text-emerald-700">
        {username?.[0] || '?'}
      </div> */}
      <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
        <span className="text-xl font-bold leading-tight">{username}</span>
        <span className="text-sm tracking-wide font-medium opacity-90">Current Level</span>
        <span className="text-2xl font-bold -mt-1">{currentLevel}</span>
      </div>
      <div className="flex flex-col gap-2 w-full sm:w-1/3">
        <div className="text-xs font-semibold tracking-wide uppercase">Progress</div>
        <div className="h-4 w-full rounded-full bg-black/40 overflow-hidden border border-black/30">
          <div className="h-full bg-primary-300" style={{ width: `${levelProgressPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
