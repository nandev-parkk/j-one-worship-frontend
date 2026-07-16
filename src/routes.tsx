import { Routes, Route, Navigate, Outlet } from 'react-router'
import type { ReactNode } from 'react'
import { LoginPage } from '@/pages/LoginPage'
import { PerformanceListPage } from '@/pages/PerformanceListPage'
import { YouTubeVideoListPage } from '@/pages/YouTubeVideoListPage'
import { AccountPage } from '@/pages/AccountPage'
import { PerformanceDetailPage } from '@/pages/PerformanceDetailPage'
import { PerformanceCreatePage } from '@/pages/PerformanceCreatePage'
import { ScheduleListPage } from '@/pages/ScheduleListPage'
import { MainLayout } from '@/components/ui/MainLayout'
import { useAuthStore } from '@/stores'

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((state) => state.token)
  return token ? <>{children}</> : <Navigate to="/login" />
}

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((state) => state.token)
  return token ? <Navigate to="/performances" replace /> : <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route element={<PrivateRoute><MainLayout><Outlet /></MainLayout></PrivateRoute>}>
        <Route index element={<Navigate to="/performances" replace />} />
        <Route path="/performances" element={<PerformanceListPage />} />
        <Route path="/performances/create" element={<PerformanceCreatePage />} />
        <Route path="/performances/:id" element={<PerformanceDetailPage />} />
        <Route path="/youtube-videos" element={<YouTubeVideoListPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/schedules" element={<ScheduleListPage />} />
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Route>
    </Routes>
  )
}
