import { Sidebar, SemicolonCross } from '@/components/ui/Sidebar'
import { MobileSidebar } from '@/components/ui/MobileSidebar'
import { Footer } from '@/components/ui/Footer'
import { useSidebarStore } from '@/stores'
import { Menu } from 'lucide-react'

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

      <main className="flex flex-1 flex-col overflow-hidden" style={{ background: '#F7F7F7' }}>
        {/* Mobile Header — lg 미만만 표시 */}
        <header
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ background: '#FFFFFF', borderColor: '#E8E8E8' }}
        >
          <button
            onClick={toggle}
            aria-label="메뉴 열기"
            className="flex items-center justify-center rounded-full"
            style={{ width: 40, height: 40 }}
          >
            <Menu size={24} style={{ color: '#222' }} />
          </button>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold" style={{ color: '#222' }}>
              J-One Worship
            </h1>
            <SemicolonCross size={16} />
          </div>
          <div style={{ width: 40 }} />
        </header>

        <div className="flex flex-1 overflow-y-auto">{children}</div>
        <Footer />
      </main>
    </div>
  )
}
