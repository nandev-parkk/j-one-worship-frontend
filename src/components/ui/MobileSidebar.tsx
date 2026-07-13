import * as React from 'react'
import { Dialog, DialogClose } from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, LogOut } from 'lucide-react'
import { useSidebarStore, useAuthStore } from '@/stores'
import { menuItems, SidebarItem } from '@/components/ui/Sidebar'
import { useLocation, useNavigate } from 'react-router'

export const MobileSidebar: React.FC = () => {
  const { open, close } = useSidebarStore()
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    close()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) close()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="z-20 fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 rounded-none border-none p-0 h-full outline-none data-[state=open]:animate-in data-[state=closed]:animate-out bg-white">
          {/* 닫기 버튼 */}
          <div className="absolute top-4 right-4">
            <DialogClose asChild>
              <button
                aria-label="메뉴 닫기"
                className="flex items-center justify-center rounded-full w-8 h-8"
              >
                <X size={20} className="text-[#8F8F8F]" />
              </button>
            </DialogClose>
          </div>

          {/* Brand */}
          <div className="flex flex-col items-center gap-1.5 px-6 pt-8 pb-8">
            <img src="/logo.png" alt="logo" className="w-[80px]" />
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path || location.pathname.startsWith(item.path + '/')} />
            ))}
          </nav>

          {/* Logout */}
          <div className="px-4 pb-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-full py-2.5 px-3 text-sm font-medium text-[#5A5A5A]"
            >
              <LogOut size={16} className="text-[#A9A9A9]" />
              <span>Logout</span>
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
