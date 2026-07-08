import { BrowserRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '@/lib/query-client'
import { AppRoutes } from '@/routes'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
