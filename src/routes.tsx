import { Routes, Route, Navigate, useLocation } from 'react-router'
import { LoginPage } from '@/pages/LoginPage'
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
      <Route path="/" element={<div>J-One Worship</div>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/performances" element={<div>Performances</div>} />
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  )
}
