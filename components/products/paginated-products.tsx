'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { ProductsGrid } from './products-grid'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
  id: string
  handle: string
  title: string
  priceRange: {
    minVariantPrice: { amount: string }
    maxVariantPrice?: { amount: string }
  }
  compareAtPriceRange?: {
    minVariantPrice: { amount: string }
  }
  featuredImage?: { url: string }
  images: { edges: { node: { url: string } }[] }
}

interface PaginatedProductsProps {
  products: Product[]
  itemsPerPage?: number
}

export function PaginatedProducts({
  products,
  itemsPerPage = 50,
}: PaginatedProductsProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination
  const pagination = useMemo(() => {
    const totalPages = Math.ceil(products.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProducts = products.slice(startIndex, endIndex)

    return {
      currentProducts,
      totalPages,
      currentPage,
      totalItems: products.length,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    }
  }, [products, currentPage, itemsPerPage])

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, pagination.totalPages))
    setCurrentPage(validPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pagination.totalPages])

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <ProductsGrid products={pagination.currentProducts} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-4 py-6">
        {/* Info */}
        <div className="text-sm text-gray-600">
          عرض{' '}
          <span className="font-semibold">
            {(pagination.currentPage - 1) * itemsPerPage + 1}
          </span>{' '}
          إلى{' '}
          <span className="font-semibold">
            {Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)}
          </span>{' '}
          من <span className="font-semibold">{pagination.totalItems}</span> منتج
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="الصفحة السابقة"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    page === pagination.currentPage
                      ? 'bg-pink-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            {pagination.totalPages > 5 && (
              <>
                <span className="px-2">...</span>
                <button
                  onClick={() => goToPage(pagination.totalPages)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    pagination.totalPages === pagination.currentPage
                      ? 'bg-pink-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {pagination.totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="الصفحة التالية"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
