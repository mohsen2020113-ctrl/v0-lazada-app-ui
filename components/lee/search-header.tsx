'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Camera, Mic, QrCode, X } from 'lucide-react'

interface SearchHeaderProps {
  placeholder?: string
}

export function SearchHeader({ placeholder = 'Search products...' }: SearchHeaderProps) {
  const [query, setQuery] = useState('')
  const [listening, setListening] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push('/search?q=' + encodeURIComponent(query.trim()))
    }
  }

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ar-AE'
    recognition.interimResults = false
    recognition.onstart = () => setListening(true)
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setQuery(transcript)
      setListening(false)
      router.push('/search?q=' + encodeURIComponent(transcript))
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognition.start()
  }

  const handleCamera = () => {
    router.push('/visual-search')
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 py-2 bg-white">
      {/* Search bar — fully rounded per 4LEEE spec */}
      <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 gap-2"
           style={{ height: '48px' }}>
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={listening ? 'Listening...' : placeholder}
          className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')}>
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        {/* Barcode/QR scan icon */}
        <button type="button" onClick={handleCamera} className="shrink-0">
          <QrCode className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      {/* Camera icon */}
      <button type="button" onClick={handleCamera}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full shrink-0">
        <Camera className="w-5 h-5 text-gray-500" />
      </button>
      {/* Mic icon */}
      <button type="button" onClick={handleVoiceSearch}
              className={'w-10 h-10 flex items-center justify-center rounded-full shrink-0 ' +
                (listening ? 'bg-orange-500' : 'bg-gray-100')}>
        <Mic className={'w-5 h-5 ' + (listening ? 'text-white' : 'text-gray-500')} />
      </button>
    </form>
  )
}
