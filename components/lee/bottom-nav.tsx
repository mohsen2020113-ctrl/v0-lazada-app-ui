"use client"

import { useState } from "react"

const navItems = [
  {
    id: "foryou",
    label: "For You",
    isActive: true,
  },
  {
    id: "fashion",
    label: "Fashion",
  },
  {
    id: "message",
    label: "Message",
    badge: "99+",
  },
  {
    id: "cart",
    label: "Cart",
    badge: "3",
  },
  {
    id: "account",
    label: "Account",
  },
]

function NavIcon({ id, isActive }: { id: string; isActive: boolean }) {
  const color = isActive ? "#f85c98" : "#6b7280"
  
  switch (id) {
    case "foryou":
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill={isActive ? color : "none"} stroke={color} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    case "fashion":
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L8 6H4v4l4 4-4 4v4h4l4 4 4-4h4v-4l-4-4 4-4V6h-4l-4-4z" />
          <circle cx="12" cy="12" r="3" fill={isActive ? color : "none"} />
        </svg>
      )
    case "message":
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill={isActive ? color : "none"} stroke={color} strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      )
    case "cart":
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" fill={color} />
          <circle cx="20" cy="21" r="1" fill={color} />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      )
    case "account":
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" fill={isActive ? color : "none"} />
        </svg>
      )
    default:
      return null
  }
}

export function BottomNav() {
  const [active, setActive] = useState("foryou")

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-1 sm:px-2 py-1.5 sm:py-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom">
      <div className="max-w-4xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = active === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="flex flex-col items-center py-1 px-2 sm:px-4 relative transition-transform active:scale-90"
            >
              <div className="relative">
                <NavIcon id={item.id} isActive={isActive} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 sm:-right-4 bg-[#f85c98] text-white text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full min-w-[16px] sm:min-w-[18px] text-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 font-medium transition-colors ${isActive ? "text-[#f85c98]" : "text-gray-500"}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
