import { Sidebar } from '@/components/ui/Sidebar'
import { MobileSidebar } from '@/components/ui/MobileSidebar'
import { Footer } from '@/components/ui/Footer'
import { useSidebarStore } from '@/stores'
import { Menu } from 'lucide-react'
import logo from '/public/logo.png'
import * as React from 'react'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const toggle = useSidebarStore((state) => state.toggle)

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {/* Desktop Sidebar — lg 이상만 표시 */}
      <Sidebar />

      {/* Mobile Sidebar — Dialog 오버레이 */}
      <MobileSidebar />

      <main className="flex flex-1 flex-col overflow-hidden bg-[#F7F7F7]">
        {/* Mobile Header — lg 미만만 표시 */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-white border-[#E8E8E8]">
          <button
            onClick={toggle}
            aria-label="메뉴 열기"
            className="flex items-center justify-center rounded-full w-10 h-10"
          >
            <Menu size={24} className="text-[#222]" />
          </button>
          <div className="flex items-center gap-1.5">
            <img src={logo} alt="logo" className="w-[80px]" />
          </div>
          <div className="w-10" />
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto">
          {children}
          <Footer className="mt-auto" />
        </div>
      </main>
    </div>
  )
}
