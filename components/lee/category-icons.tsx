"use client"

import Link from "next/link"
import { 
  ShoppingBag, 
  MapPin, 
  Store, 
  PlayCircle, 
  Zap, 
  Shirt, 
  Laptop, 
  Smartphone, 
  Home, 
  Gamepad2, 
  Dumbbell, 
  Sparkles, 
  UtensilsCrossed, 
  Gift, 
  LayoutGrid 
} from "lucide-react"

const categories = [
  {
    id: 1,
    name: "LEEMall",
    icon: ShoppingBag,
    gradient: "from-[#f85c98] to-[#e91e63]",
    href: "/category/home-kitchen",
  },
  {
    id: 2,
    name: "LEELand",
    icon: MapPin,
    gradient: "from-[#4caf50] to-[#2e7d32]",
    href: "/category/best-sellers",
  },
  {
    id: 3,
    name: "LEEMart",
    icon: Store,
    gradient: "from-[#66bb6a] to-[#43a047]",
    href: "/category/clothes",
  },
  {
    id: 4,
    name: "LEELive",
    icon: PlayCircle,
    gradient: "from-[#7c4dff] to-[#536dfe]",
    href: "/live",
  },
  {
    id: 5,
    name: "Flash Sale",
    icon: Zap,
    gradient: "from-[#ff5722] to-[#f44336]",
    href: "/category/best-sellers",
  },
  {
    id: 6,
    name: "Fashion",
    icon: Shirt,
    gradient: "from-[#9c27b0] to-[#7b1fa2]",
    href: "/category/women",
  },
  {
    id: 7,
    name: "Electronics",
    icon: Laptop,
    gradient: "from-[#2196f3] to-[#1976d2]",
    href: "/category/electronics",
  },
  {
    id: 8,
    name: "Mobiles",
    icon: Smartphone,
    gradient: "from-[#00bcd4] to-[#0097a7]",
    href: "/category/electronics",
  },
  {
    id: 9,
    name: "Home",
    icon: Home,
    gradient: "from-[#8bc34a] to-[#689f38]",
    href: "/category/home-appliances",
  },
  {
    id: 10,
    name: "Gaming",
    icon: Gamepad2,
    gradient: "from-[#3f51b5] to-[#303f9f]",
    href: "/category/electronics",
  },
  {
    id: 11,
    name: "Sports",
    icon: Dumbbell,
    gradient: "from-[#ff9800] to-[#f57c00]",
    href: "/category/beauty-health",
  },
  {
    id: 12,
    name: "Beauty",
    icon: Sparkles,
    gradient: "from-[#e91e63] to-[#c2185b]",
    href: "/category/beauty-health",
  },
  {
    id: 13,
    name: "Food",
    icon: UtensilsCrossed,
    gradient: "from-[#ffb300] to-[#ff8f00]",
    href: "/category/kitchen",
  },
  {
    id: 14,
    name: "Vouchers",
    icon: Gift,
    gradient: "from-[#f85c98] to-[#e91e8c]",
    href: "/vouchers",
  },
  {
    id: 15,
    name: "More",
    icon: LayoutGrid,
    gradient: "from-[#607d8b] to-[#455a64]",
    href: "/category/home-kitchen",
  },
]

export function CategoryIcons() {
  return (
    <div className="bg-white px-3 py-3">
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 w-[56px] transition-transform active:scale-95"
            >
              {/* Gradient Square Icon */}
              <div className={`w-[52px] h-[52px] rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-md`}>
                <Icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              {/* Label */}
              <span className="text-[10px] text-gray-600 font-medium text-center leading-tight line-clamp-1">
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
