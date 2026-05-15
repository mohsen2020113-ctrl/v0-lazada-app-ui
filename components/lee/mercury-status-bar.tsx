'use client'

import { useEffect, useState } from 'react'

interface ServiceStatus {
  name: string
  endpoint: string
  status: 'checking' | 'online' | 'error'
}

const services: ServiceStatus[] = [
  { name: 'Universal Search', endpoint: '/api/search/universal', status: 'checking' },
  { name: 'Image Analyzer', endpoint: '/api/image/analyze', status: 'checking' },
  { name: 'Behavior Tracker', endpoint: '/api/behavior/track', status: 'checking' },
  { name: 'Price Intelligence', endpoint: '/api/price/intelligence', status: 'checking' },
  { name: 'Recommender V2', endpoint: '/api/recommend/v2', status: 'checking' },
]

export function MercuryStatusBar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [statuses, setStatuses] = useState<Record<string, 'checking' | 'online' | 'error'>>(
    Object.fromEntries(services.map(s => [s.name, 'checking']))
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsAdmin(localStorage.getItem('lee_admin') === 'true')
  }, [])

  useEffect(() => {
    if (!isAdmin) return

    const checkServices = async () => {
      const newStatuses: Record<string, 'checking' | 'online' | 'error'> = {}

      for (const service of services) {
        try {
          const response = await fetch(service.endpoint, { method: 'HEAD' })
          newStatuses[service.name] = response.ok ? 'online' : 'error'
        } catch {
          newStatuses[service.name] = 'error'
        }
      }

      setStatuses(newStatuses)
    }

    checkServices()
    const interval = setInterval(checkServices, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [isAdmin])

  if (!isAdmin) return null

  return (
    <div className="bg-gray-900 text-white text-xs px-3 py-2 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-4 min-w-max">
        <span className="font-semibold whitespace-nowrap">Mercury AI:</span>
        {services.map(service => (
          <div key={service.name} className="flex items-center gap-1.5 whitespace-nowrap">
            <div
              className={`w-2 h-2 rounded-full ${
                statuses[service.name] === 'online'
                  ? 'bg-green-500'
                  : statuses[service.name] === 'error'
                  ? 'bg-red-500'
                  : 'bg-yellow-500 animate-pulse'
              }`}
            />
            <span className="text-[10px]">{service.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
