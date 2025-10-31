import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await authAPI.getMe()
      setUser(res.data.data.user)
    } catch (error) {
      localStorage.removeItem('token')
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    const res = await authAPI.login(email, password)
    const { token, user } = res.data.data
    
    localStorage.setItem('token', token)
    setUser(user)
    
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}