'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Search } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
    onSearch?: () => void;
}

export function Header({ title, showBack = false, showSearch = false, onSearchChange, onSearch }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-[#f85c98] to-[#ec407a] text-white sticky top-0 z-40 safe-area-top">
      <div className="flex items-center gap-3 px-3 py-3 sm:px-4 sm:py-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {showSearch ? (
          <div className="flex-1 bg-white/90 rounded-full px-3 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSearch?.() }}
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm sm:text-base"
            />
          </div>
        ) : (
          <h1 className="flex-1 text-base sm:text-lg font-bold truncate">{title || 'LEE'}</h1>
        )}
      </div>
    </div>
  );
}
