'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const AuthenticateUserContext = createContext()

export function AuthenticateUserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Failed to fetch user', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const isAuthPage = pathname === '/login' || pathname === '/register'
    
    if (isAuthPage) {
      setLoading(false)
      return
    }
    
    fetchUser()
  }, [pathname])

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (response.ok) {
      setUser(data.user)
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  }

  const register = async (userData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })

    const data = await response.json()

    if (response.ok) {
      setUser(data.user)
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
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