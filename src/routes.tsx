import { Routes, Route, Navigate, useLocation } from 'react-router'
import { LoginPage } from '@/pages/LoginPage'
import { PerformanceListPage } from '@/pages/PerformanceListPage'
import { YouTubeVideoListPage } from '@/pages/YouTubeVideoListPage'
import { PerformanceDetailPage } from '@/pages/PerformanceDetailPage'
import { PerformanceCreatePage } from '@/pages/PerformanceCreatePage'
import { useAuthStore } from '@/stores'

export function AppRoutes() {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  // 미인증 시 로그인 페이지 외 접근 차단
  if (!token && !isLogin) {
    return <Navigate to="/login" replace />
  }

  // 인증 시 로그인 페이지 접근 차단
  if (token && isLogin) {
    return <Navigate to="/" replace />
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/performances" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/performances" element={<PerformanceListPage />} />
      <Route path="/performances/create" element={<PerformanceCreatePage />} />
      <Route path="/youtube-videos" element={<YouTubeVideoListPage />} />
      <Route path="/performances/:id" element={<PerformanceDetailPage />} />
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  )
}
