'use client'

import { useState, useEffect } from 'react'
import { Radio, Play, Heart } from 'lucide-react'

interface Stream {
  id: string
  title: string
  vendor: string
  viewers: number
  thumbnail: string
  is_live: boolean
  products_count: number
}

interface Video {
  id: string
  title: string
  vendor: string
  thumbnail: string
  views: number
  likes: number
  products: number
  duration: string
}

interface Exhibition {
  id: string
  name: string
  location: string
  image: string
  dates: string
}

const formatNum = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
  return n.toString()
}

const exhibitions: Exhibition[] = [
  {
    id: '1',
    name: 'Canton Fair',
    location: 'Guangzhou, China',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    dates: 'Oct 15-19, 2024',
  },
  {
    id: '2',
    name: 'Yiwu Fair',
    location: 'Yiwu, China',
    image: 'https://images.unsplash.com/photo-1540575467063-178f50002cbc?w=400&h=300&fit=crop',
    dates: 'Oct 22-26, 2024',
  },
  {
    id: '3',
    name: 'Shanghai Expo',
    location: 'Shanghai, China',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    dates: 'Nov 5-9, 2024',
  },
]

export default function LivePage() {
  const [activeTab, setActiveTab] = useState<'live' | 'videos' | 'exhibitions'>('live')
  const [streams, setStreams] = useState<Stream[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [streamsRes, videosRes] = await Promise.all([
          fetch('/api/live/streams'),
          fetch('/api/live/videos'),
        ])
        const streamsData = await streamsRes.json()
        const videosData = await videosRes.json()
        setStreams(Array.isArray(streamsData) ? streamsData : [])
        setVideos(Array.isArray(videosData) ? videosData : [])
      } catch (error) {
        console.error('[v0] Error fetching live data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleLike = (videoId: string) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Radio className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold">LEE Live</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex gap-6">
          <button
            onClick={() => setActiveTab('live')}
            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'live'
                ? 'border-red-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Live
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'videos'
                ? 'border-red-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('exhibitions')}
            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'exhibitions'
                ? 'border-red-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Exhibitions
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Live Streams Tab */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : streams.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                No live streams available
              </div>
            ) : (
              streams.map(stream => (
                <div key={stream.id} className="group cursor-pointer">
                  <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-3">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {/* Red LIVE badge */}
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                    {/* Viewer count overlay */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm font-semibold px-2 py-1 rounded">
                      {formatNum(stream.viewers)} viewers
                    </div>
                  </div>
                  <h3 className="font-semibold text-white line-clamp-2">{stream.title}</h3>
                  <p className="text-sm text-gray-400">{stream.vendor}</p>
                  <p className="text-xs text-gray-500 mt-1">{stream.products_count} products</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No videos available</div>
            ) : (
              videos.map(video => (
                <div key={video.id} className="flex gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="relative w-32 h-24 bg-gray-800 rounded flex-shrink-0 overflow-hidden group">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <Play className="absolute inset-0 m-auto w-8 h-8 text-white/80 group-hover:text-white transition-colors" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-white line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-gray-400">{video.vendor}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{formatNum(video.views)} views</span>
                      <span>{video.products} products</span>
                      <button
                        onClick={() => toggleLike(video.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          likedVideos.has(video.id)
                            ? 'text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={likedVideos.has(video.id) ? 'currentColor' : 'none'} />
                        {formatNum(video.likes + (likedVideos.has(video.id) ? 1 : 0))}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Exhibitions Tab */}
        {activeTab === 'exhibitions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitions.map(exhibition => (
              <div key={exhibition.id} className="group cursor-pointer">
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-3">
                  <img
                    src={exhibition.image}
                    alt={exhibition.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-white">{exhibition.name}</h3>
                <p className="text-sm text-gray-400">{exhibition.location}</p>
                <p className="text-xs text-gray-500 mt-1">{exhibition.dates}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
