"use client"

import Link from "next/link"
import { Camera, Mic } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n-context"
import { LocaleSelector } from "./locale-selector"

interface SearchSuggestion {
  id: string
  title: string
  price: string
  image?: string
  reason: string
}

export function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { t, isRTL, formatPrice } = useI18n()

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/search/universal?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data.products?.slice(0, 5) || [])
      }
    } catch (error) {
      console.error('[v0] Search suggestions error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (searchQuery.trim()) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(searchQuery)
      }, 400)
    } else {
      setSuggestions([])
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [searchQuery, fetchSuggestions])

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.title)
    setSuggestions([])
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/visual-search', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/search?q=${encodeURIComponent(data.query)}&imageSearch=true`)
      } else {
        console.error('[v0] Image search failed:', response.statusText)
      }
    } catch (error) {
      console.error('[v0] Image upload error:', error)
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleVoiceSearch = () => {
    if (typeof window === 'undefined') return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) { alert('المتصفح لا يدعم البحث الصوتي. استخدم Chrome أو Safari.'); return }
    const recognition = new SpeechRecognition()
    recognition.lang = 'ar-AE'; recognition.continuous = false; recognition.interimResults = false
    recognition.onresult = (event: any) => { window.location.href = `/search?q=${encodeURIComponent(event.results[0][0].transcript)}` }
    recognition.onerror = () => { alert('لم يتم التعرف على الصوت. حاول مرة أخرى.') }
    recognition.start()
  }


  return (
    <div className="bg-transparent px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 pt-4 sm:pt-5">
      <div className={`max-w-4xl mx-auto flex items-center gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Locale Selector */}
        <LocaleSelector />

        <div className="flex-1 relative">
          <div className={`flex items-center bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 gap-2 sm:gap-3 transition-all ${isFocused ? 'ring-2 ring-white/50' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* LEE Logo Icon */}
            <div className="text-[#f85c98] flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`flex-1 text-[#f85c98] font-medium text-sm sm:text-base outline-none bg-transparent placeholder:text-gray-400 min-w-0 ${isRTL ? 'text-right' : ''}`}
              placeholder={t('search.placeholder')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0 disabled:opacity-50"
            >
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
            </button>
            <button
              onClick={handleVoiceSearch}
              className={`text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0 ${isListening ? 'text-red-500' : ''}`}
            >
              <Mic className={`w-5 h-5 sm:w-6 sm:h-6 ${isListening ? 'animate-pulse' : ''}`} strokeWidth={1.5} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploadingImage}
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isFocused && searchQuery.trim() && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion.id}
                  href={`/product/${suggestion.id}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {suggestion.image && (
                    <img
                      src={suggestion.image}
                      alt={suggestion.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-xs font-medium text-gray-900 line-clamp-1">{suggestion.title}</p>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{suggestion.reason}</p>
                    <p className="text-sm font-bold text-[#f85c98] mt-0.5">{formatPrice(parseFloat(suggestion.price))}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search'}
          className="bg-[#f57224] hover:bg-[#e56318] active:scale-95 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all shadow-sm flex-shrink-0"
        >
          {t('action.search')}
        </Link>
      </div>
    </div>
  )
}
