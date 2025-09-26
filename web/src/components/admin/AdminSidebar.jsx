import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MOCK_ADMIN_NAV } from '@/constants';

// Simple icon placeholder mapping (swap with real icons later)
const Icon = ({ name, className = '' }) => {
  const base = 'inline-block w-4 h-4 rounded-sm bg-neutral-600 text-[10px] leading-4 text-center font-semibold';
  return <span className={`${base} ${className}`}>{name.substring(0,1).toUpperCase()}</span>;
};

export default function AdminSidebar() {
  const navigate = useNavigate();
  const username = 'Admin User'; // TODO: replace with real auth user

  return (
    <aside className="w-60 shrink-0 border-r border-neutral-800 bg-neutral-950/80 backdrop-blur-sm flex flex-col">
      {/* Logo area */}
      <div className="px-4 pt-5 pb-4">
        <span className="block text-xl font-bold tracking-wide">Prolingo</span>
      </div>
      <div className="h-px bg-neutral-800 mx-4" />
      {/* Username */}
      <div className="px-4 py-3 border-b border-neutral-800">
        <p className="text-sm font-medium text-neutral-200 truncate">{username}</p>
        <p className="text-[11px] text-neutral-500">Administrator</p>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {MOCK_ADMIN_NAV.map(item => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-1 focus-visible:ring-neutral-500 ${
                isActive
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-300 hover:bg-neutral-800/70'
              }`
            }
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout button at bottom */}
      <div className="px-3 pb-4 pt-2 border-t border-neutral-800">
        <button
          onClick={() => navigate('/logout')}
          className="w-full flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800/70 transition-colors"
        >
          <Icon name="logout" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}