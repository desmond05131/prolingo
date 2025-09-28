import React from 'react';

export function LeaderboardHeader({ title = 'Leaderboards', subtitle = 'Top 50 highest level globally' }) {
  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{title}</h1>
      <p className="mt-2 text-base md:text-lg text-gray-300">{subtitle}</p>
    </header>
  );
}
