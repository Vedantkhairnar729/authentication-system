import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

interface User {
  id: string
  email: string
  username: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await axios.get('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data.user)
        } catch (error) {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password })
    setUser(response.data.user)
    localStorage.setItem('token', response.data.token)
  }

  const register = async (email: string, username: string, password: string) => {
    const response = await axios.post('/api/auth/register', { email, username, password })
    setUser(response.data.user)
    localStorage.setItem('token', response.data.token)
  }

  const logout = () => {
    axios.post('/api/auth/logout')
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
