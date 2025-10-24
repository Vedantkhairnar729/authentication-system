import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Dashboard from './pages/Dashboard.tsx'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  )
}

export default App
