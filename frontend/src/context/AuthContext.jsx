import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { connectSocket, disconnectSocket } from '../services/socket'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('neighbourUser')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`
        // Reconnect socket on page refresh
        connectSocket(parsed._id)
      } catch {
        localStorage.removeItem('neighbourUser')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('neighbourUser', JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    connectSocket(userData._id)
  }

  const logout = () => {
    disconnectSocket()
    setUser(null)
    localStorage.removeItem('neighbourUser')
    delete axios.defaults.headers.common['Authorization']
    // Force redirect to landing page
    window.location.href = '/'
  }

  const updateUser = (userData) => {
    const updated = { ...user, ...userData }
    setUser(updated)
    localStorage.setItem('neighbourUser', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
