'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, FolderOpen, Package } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

type Collection = {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
  };
};

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch('/api/collections');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCollections(data);
      } catch (err) {
        setError('Failed to load collections');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCollections();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="sticky top-0 z-40 bg-gradient-to-r from-[#f85c98] to-[#e91e8c] text-white">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse" />
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        
        <div className="p-4 grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        
        <BottomNav />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="sticky top-0 z-40 bg-gradient-to-r from-[#f85c98] to-[#e91e8c] text-white">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => router.back()} className="p-1">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">All Categories</h1>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#f85c98] text-white rounded-full font-medium"
          >
            Try Again
          </button>
        </div>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#f85c98] to-[#e91e8c] text-white">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold">All Categories</h1>
            <p className="text-xs text-white/80">{collections.length} collections</p>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-semibold mb-1">No collections found</h3>
          <p className="text-gray-500 text-sm text-center">
            Check back later for new categories.
          </p>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 gap-4">
          {collections.map(({ node: collection }) => (
            <Link
              key={collection.id}
              href={`/category/${collection.handle}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video bg-gradient-to-br from-[#f85c98]/20 to-[#e91e8c]/20">
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 200px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-[#f85c98]/40" />
                  </div>
                )}
                

              </div>
              
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                  {collection.title}
                </h3>
                {collection.description && (
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
