import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import { Login, Signup } from './pages/AuthPages.jsx'
import { Explore, Home, Reels } from './pages/DiscoveryPages.jsx'
import { Create, Messages, Notifications, Profile, Settings } from './pages/SocialPages.jsx'
import { AppProvider, useApp } from './context/AppContext.jsx'

function AppRoutes() {
  const { isAuthenticated } = useApp()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
      <Route element={isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="reels" element={<Reels />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="create" element={<Create />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AppProvider><AppRoutes /></AppProvider>
}
