import { Link, useLocation, useNavigate } from 'react-router'
import { useAuthStore, useSidebarStore } from '@/stores'
import { Music, Video, LogOut, ChevronLeft, User, Calendar } from 'lucide-react'

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
)

/* ──────────────────────────── Menu Types ──────────────────────────── */

interface MenuItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string; size?: number }>
}

export const menuItems: MenuItem[] = [
  { label: 'Performances', path: '/performances', icon: Music },
  { label: 'Youtube Videos', path: '/youtube-videos', icon: Video },
  { label: 'Schedule', path: '/schedules', icon: Calendar },
  { label: 'Account', path: '/account', icon: User },
]

/* ──────────────────────────── Sidebar Item ──────────────────────────── */

export const SidebarItem: React.FC<{ item: MenuItem; isActive: boolean; collapsed?: boolean }> = ({
  item,
  isActive,
  collapsed = false,
}) => {
  const { icon: Icon, label, path } = item
  const close = useSidebarStore((state) => state.close)

  return (
    <Link
      to={path}
      onClick={close}
      className={`flex items-center gap-3 rounded-full py-2.5 text-sm font-medium transition-all lg:hover:bg-[#E8F2FD] ${
        isActive ? 'bg-[#E8F2FD] text-[#2977DC] font-semibold' : 'text-[#5A5A5A]'
      } ${collapsed ? 'justify-center px-2.5' : 'px-3'}`}
    >
      <Icon size={16} className={isActive ? 'text-[#2977DC]' : 'text-[#A9A9A9]'} />
      <span className={collapsed ? 'hidden' : ''}>{label}</span>
    </Link>
  )
}

/* ──────────────────────────── Sidebar ──────────────────────────── */

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const sidebarCollapsed = useSidebarStore((state) => state.sidebarCollapsed)
  const toggleSidebarCollapse = useSidebarStore.getState().toggleSidebarCollapse

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={`hidden flex-col border-r bg-white min-h-screen lg:flex transition-[width] duration-200 ${
        sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
      } border-[#E8E8E8] relative`}
    >
      {/* Brand */}
      <div className={`flex flex-col items-center gap-1.5 px-6 pt-8 pb-8 ${sidebarCollapsed ? 'hidden' : ''}`}>
        <img src="/logo.png" alt="logo" className="w-[80px]" />
        {/*<h1 className="text-xl font-bold tracking-tight text-[#222]">*/}
        {/*  J-One Worship*/}
        {/*</h1>*/}
        {/*<SemicolonCross size={20} />*/}
      </div>

      {/* Menu */}
      <nav className={`flex-1 px-4 space-y-1 ${sidebarCollapsed ? 'pt-12' : ''}`}>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isActive={
              location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            }
            collapsed={sidebarCollapsed}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className={`pb-6 ${sidebarCollapsed ? 'px-1' : 'px-4'}`}>
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-full py-2.5 text-sm font-medium transition-all lg:hover:bg-[#E8F2FD] ${
            sidebarCollapsed ? 'justify-center px-2.5' : 'px-3'
          } text-[#5A5A5A]`}
        >
          <LogOut size={16} className="text-[#A9A9A9]" />
          <span className={sidebarCollapsed ? 'hidden' : ''}>Logout</span>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebarCollapse}
        className={`absolute top-3 -right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-[#E8E8E8] bg-white shadow-md transition-transform duration-200 hover:bg-gray-50 ${
          sidebarCollapsed ? 'rotate-180' : ''
        }`}
        aria-label={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 축소'}
      >
        <ChevronLeft size={14} className="text-[#5A5A5A]" />
      </button>
    </aside>
  )
}
