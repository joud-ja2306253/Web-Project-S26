// app/auth/AuthenticateUser.jsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthenticateUserContext = createContext()

export function AuthenticateUserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On page load, get user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await fetch('/server/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (response.ok) {
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  }

  const register = async (userData) => {
    const response = await fetch('/server/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })

    const data = await response.json()

    if (response.ok) {
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  }

  const logout = async () => {
    await fetch('/server/api/auth/logout', { method: 'POST' })
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthenticateUserContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthenticateUserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(AuthenticateUserContext)
  if (!context) {
    throw new Error('useUser must be used within an AuthenticateUserProvider')
  }
  return context
}