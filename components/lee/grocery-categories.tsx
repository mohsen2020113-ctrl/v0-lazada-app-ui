"use client"

import Link from "next/link"

const groceryCategories = [
  { id: 1, name: "Groceries", emoji: "🛒", color: "#4CAF50", href: "/category/food" },
  { id: 2, name: "Vegetables", emoji: "🥦", color: "#66BB6A", href: "/category/food" },
  { id: 3, name: "Beverages", emoji: "🥤", color: "#42A5F5", href: "/category/food" },
  { id: 4, name: "Snacks", emoji: "🍿", color: "#FF7043", href: "/category/food" },
  { id: 5, name: "Dairy", emoji: "🥛", color: "#90CAF9", href: "/category/food" },
  { id: 6, name: "Bakery", emoji: "🍞", color: "#FFCA28", href: "/category/food" },
  { id: 7, name: "Meat", emoji: "🥩", color: "#EF5350", href: "/category/food" },
  { id: 8, name: "Seafood", emoji: "🦐", color: "#29B6F6", href: "/category/food" },
  { id: 9, name: "Frozen", emoji: "❄️", color: "#80DEEA", href: "/category/food" },
]

export function GroceryCategories() {
  return (
    <div className="bg-white px-3 py-3 border-t border-gray-100">
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
        {groceryCategories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 w-[60px] transition-transform active:scale-95"
          >
            <div
              className="w-[54px] h-[54px] rounded-full flex items-center justify-center text-2xl shadow-sm"
              style={{ backgroundColor: cat.color }}
            >
              <span>{cat.emoji}</span>
            </div>
            <span className="text-[10px] text-gray-600 font-medium text-center leading-tight line-clamp-1">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
