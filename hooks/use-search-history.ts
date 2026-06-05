import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'search_history'
const MAX_HISTORY = 10

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load history from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setHistory(JSON.parse(stored))
        }
      } catch (error) {
        console.error('[v0] Error loading search history:', error)
      }
      setMounted(true)
    }
  }, [])

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return

    const trimmedQuery = query.trim()
    setHistory(prev => {
      // Remove if exists (to avoid duplicates)
      const filtered = prev.filter(item => item !== trimmedQuery)
      // Add to front
      const updated = [trimmedQuery, ...filtered].slice(0, MAX_HISTORY)
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      }
      
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item !== query)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  return {
    history: mounted ? history : [],
    addToHistory,
    clearHistory,
    removeFromHistory,
    isReady: mounted,
  }
}
