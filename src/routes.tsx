import { Routes, Route } from 'react-router'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>J-One Worship</div>} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/performances" element={<div>Performances</div>} />
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
}
