import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { connectSocket, disconnectSocket } from '../services/socket'

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('neighbourUser')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`
        // Reconnect socket on page refresh
        connectSocket(parsed._id)
      } catch {
        sessionStorage.removeItem('neighbourUser')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    sessionStorage.setItem('neighbourUser', JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    connectSocket(userData._id)
  }

  const logout = () => {
    disconnectSocket()
    setUser(null)
    sessionStorage.removeItem('neighbourUser')
    delete axios.defaults.headers.common['Authorization']
    // Force redirect to landing page
    window.location.href = '/'
  }

  const updateUser = (userData) => {
    const updated = { ...user, ...userData }
    setUser(updated)
    sessionStorage.setItem('neighbourUser', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)
export { AuthProvider, useAuth }
