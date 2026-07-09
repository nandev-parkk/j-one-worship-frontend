import { Link, useLocation } from 'react-router';
import { useAuthStore, useSidebarStore } from '@/stores';
import {
  Music,
  Video,
  Users,
  User,
  LogOut,
} from 'lucide-react';

/* ──────────────────────────── Semicolon Cross Mark ──────────────────────────── */

export const SemicolonCross: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line
      x1="40"
      y1="12"
      x2="40"
      y2="52"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <line
      x1="24"
      y1="32"
      x2="56"
      y2="32"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <circle cx="40" cy="62" r="4" fill="currentColor" />
  </svg>
);

/* ──────────────────────────── Menu Types ──────────────────────────── */

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export const menuItems: MenuItem[] = [
  { label: 'Performances', path: '/performances', icon: Music },
  { label: 'Youtube Videos', path: '/youtube-videos', icon: Video },
  { label: 'Members', path: '/members', icon: Users },
  { label: 'Account', path: '/account', icon: User },
];

/* ──────────────────────────── Sidebar Item ──────────────────────────── */

export const SidebarItem: React.FC<{ item: MenuItem; isActive: boolean }> = ({
  item,
  isActive,
}) => {
  const { icon: Icon, label, path } = item;
  const close = useSidebarStore((state) => state.close);

  return (
    <Link
      to={path}
      onClick={close}
      className="flex items-center gap-3 rounded-full py-2.5 px-3 text-sm font-medium transition-all lg:hover:bg-[#E8F2FD]"
      style={{
        backgroundColor: isActive ? '#E8F2FD' : undefined,
        color: isActive ? '#2977DC' : '#5A5A5A',
        fontWeight: isActive ? 600 : undefined,
      }}
    >
      <Icon size={16} style={{ color: isActive ? '#2977DC' : '#A9A9A9' }} />
      <span>{label}</span>
    </Link>
  );
};

/* ──────────────────────────── Sidebar ──────────────────────────── */

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <aside
      className="hidden flex-col border-r lg:flex"
      style={{
        width: 260,
        minHeight: '100dvh',
        background: '#FFFFFF',
        borderColor: '#E8E8E8',
      }}
    >
      {/* Brand */}
      <div className="flex flex-col items-center gap-1.5 px-6 pt-8 pb-8">
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: '#2977DC' }}
        >
          J-One Worship
        </h1>
        <SemicolonCross size={20} />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          className="flex w-full items-center gap-3 rounded-full py-2.5 px-3 text-sm font-medium transition-all lg:hover:bg-[#E8F2FD]"
          style={{ color: '#5A5A5A' }}
        >
          <LogOut size={16} style={{ color: '#A9A9A9' }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
