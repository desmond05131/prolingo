import React from 'react';

/**
 * rankStyle is derived from rank unless explicitly provided
 */
export function LeaderboardRow({ rank, name, level, avatarUrl, rankStyle }) {
  let style = rankStyle;
  if (!style) {
    if (rank === 1 || rank === '1') style = 'first';
    else if (rank === 2 || rank === '2') style = 'second';
    else if (rank === 3 || rank === '3') style = 'third';
    else style = 'default';
  }

  const rankColorMap = {
    first: 'text-green-400',
    second: 'text-blue-400',
    third: 'text-orange-400',
    default: 'text-white'
  };

  return (
    <div className="flex items-center gap-4 py-3">
      <div className={`w-10 text-right pr-2 font-bold tabular-nums ${rankColorMap[style]}`}>#{rank}</div>
      <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-600">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs">NO AVATAR</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">{name}</p>
      </div>
      <div className="ml-auto pl-4 font-bold text-indigo-300 text-sm md:text-base whitespace-nowrap">Lv {level}</div>
    </div>
  );
}
