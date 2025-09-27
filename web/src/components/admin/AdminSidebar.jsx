import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useBoundStore } from '@/stores/stores';
// import { MOCK_ADMIN_NAV } from '@/constants'; // Removed unused import

// Simple icon placeholder mapping (swap with real icons later)
const Icon = ({ name, className = '' }) => {
  const base = 'inline-block w-4 h-4 rounded-sm bg-neutral-600 text-[10px] leading-4 text-center font-semibold';
  return <span className={`${base} ${className}`}>{name.substring(0,1).toUpperCase()}</span>;
};

export default function AdminSidebar() {
  const navigate = useNavigate();
  const username = useBoundStore(s => s.username);
  const role = useBoundStore(s => s.role);
  const isAdminRole = typeof role === 'string' && role.toLowerCase().includes('admin');

  const navbarItems = [
    { id: 'nav_users', label: 'Users', to: '/admin/users', icon: 'users', isAdmin: true },
    { id: 'nav_course', label: 'Course', to: '/admin/course', icon: 'course' },
    { id: 'nav_achievement', label: 'Achievement', to: '/admin/achievement', icon: 'trophy' },
    { id: 'nav_feedback', label: 'Feedback', to: '/admin/feedback', icon: 'feedback' },
    { id: 'nav_subscriptions', label: 'Subscriptions', to: '/admin/subscriptions', icon: 'credit-card', isAdmin: true },
    { id: 'nav_daily_streaks', label: 'Daily Streaks', to: '/admin/daily-streaks', icon: 'fire', isAdmin: true },
    { id: 'nav_user_gameinfos', label: 'User Game Infos', to: '/admin/user-gameinfos', icon: 'game', isAdmin: true },
    { id: 'nav_user_claimed_achievements', label: 'User Claimed Achievements', to: '/admin/user-claimed-achievements', icon: 'badge', isAdmin: true },
    { id: 'nav_user_courses', label: 'User Courses', to: '/admin/user-courses', icon: 'book' },
    { id: 'nav_user_tests', label: 'User Tests', to: '/admin/user-tests', icon: 'test' },
  ];
  const visibleNavbarItems = navbarItems.filter(item => !item.isAdmin || isAdminRole);

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
        <p className="text-[11px] capitalize text-neutral-500">{role}</p>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {visibleNavbarItems.map(item => (
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