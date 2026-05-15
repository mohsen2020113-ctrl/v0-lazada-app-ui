'use client'

import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { onAuthChange, signInWithGoogle, signOut } from '@/lib/firebase/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async () => {
    try {
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed')
      throw err
    }
  }

  return { user, loading, error, login, logout }
}
