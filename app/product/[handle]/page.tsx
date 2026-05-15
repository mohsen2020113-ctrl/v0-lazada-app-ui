'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Heart, Share2, Star, Truck, RotateCcw, ShoppingCart } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'

interface ProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: {
    amount: string
    currencyCode: string
  }
  selectedOptions: Array<{ name: string; value: string }>
}

interface ProductImage {
  url: string
  altText: string
}

interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
    maxVariantPrice: { amount: string; currencyCode: string }
  }
  images: { edges: Array<{ node: ProductImage }> }
  variants: { edges: Array<{ node: ProductVariant }> }
}

export default function ProductPage() {
  const router = useRouter()
  const cartStore = useCartStore()
  const routeParams = useParams()
  const handle = decodeURIComponent((routeParams?.handle as string) || '')
  const [product, setProduct] = useState<ShopifyProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const storeUrl = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'f61e20-88.myshopify.com'
        const token = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || '54710e221c946a7f98e4ec4ca2df3029'

        const response = await fetch(`https://${storeUrl}/api/2024-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token,
          },
          body: JSON.stringify({
            query: `{ product(handle: "${handle}") { id handle title description descriptionHtml vendor productType priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } } images(first: 10) { edges { node { url altText } } } variants(first: 10) { edges { node { id title availableForSale price { amount currencyCode } selectedOptions { name value } } } } } }`,
          }),
        })

        const data = await response.json()
        const fetchedProduct = data?.data?.product

        if (!fetchedProduct) {
          notFound()
        }

        setProduct(fetchedProduct)
        if (fetchedProduct.variants.edges.length > 0) {
          setSelectedVariant(fetchedProduct.variants.edges[0].node)
        }
      } catch (error) {
        console.error('[v0] Product fetch error:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-xl">Ø¬Ø§Ø±Ù Ø§ÙØªØ­ÙÙÙ...</p>
        </div>
      </div>
    )
  }

  if (!loading && !product) {
    notFound()
  }

  const images = product.images.edges.map((e) => e.node)
  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount)
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount)

  const handleAddToCart = () => {
    if (!selectedVariant) return

    cartStore.addItem({
      productId: product.id,
      name: product.title,
      price: parseFloat(selectedVariant.price.amount),
      image: images[0]?.url || '',
      quantity,
      color: selectedVariant.selectedOptions.find((o) => o.name === 'Color')?.value || '',
      size: selectedVariant.selectedOptions.find((o) => o.name === 'Size')?.value || '',
      sellerName: product.vendor,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-800 rounded-lg">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">ØªÙØ§ØµÙÙ Ø§ÙÙÙØªØ¬</h1>
        <button className="p-2 hover:bg-gray-800 rounded-lg">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mb-6">
            <div className="bg-gray-800 aspect-square rounded-lg overflow-hidden mb-4 flex items-center justify-center">
              <img
                src={images[selectedImage]?.url}
                alt={images[selectedImage]?.altText || product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-orange-500' : 'border-gray-700'
                  }`}
                >
                  <img src={img.url} alt={`ØµÙØ±Ø© ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-orange-500">
              {minPrice === maxPrice ? `${minPrice.toFixed(2)}` : `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`}{' '}
              {product.priceRange.minVariantPrice.currencyCode}
            </span>
          </div>

          {/* Vendor Info */}
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{product.vendor}</span>
            </div>
            <p className="text-sm text-gray-400">{product.productType}</p>
          </div>

          {/* Shipping */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-800 p-3 rounded-lg flex items-start gap-2">
              <Truck className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">Ø´Ø­Ù</p>
                <p className="text-gray-400">ÙØµÙ ÙØ±ÙØ¨Ø§Ù</p>
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg flex items-start gap-2">
              <RotateCcw className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">Ø¥Ø±Ø¬Ø§Ø¹ 15 ÙÙÙ</p>
                <p className="text-gray-400">ÙØ¶ÙÙÙ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Variant Selection */}
        {product.variants.edges.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-bold mb-3">Ø§Ø®ØªØ± Ø§ÙÙÙØ¹:</label>
            <div className="flex gap-3 flex-wrap">
              {product.variants.edges.map((edge) => {
                const variant = edge.node
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.availableForSale}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedVariant?.id === variant.id
                        ? 'border-orange-500 bg-gray-800'
                        : 'border-gray-700 bg-gray-900'
                    } ${!variant.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {variant.title}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-3">Ø§ÙÙÙÙØ©:</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              -
            </button>
            <span className="text-lg font-bold min-w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6 sticky bottom-0 bg-gray-950 py-4">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition ${
              isFavorite
                ? 'border-red-500 bg-red-500 text-white'
                : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-red-500'
            }`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'ÙØ¶Ø§Ù' : 'Ø¥Ø¶Ø§ÙØ©'}
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant?.availableForSale}
            className="py-3 rounded-lg bg-orange-500 hover:bg-orange-600 font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <ShoppingCart className="w-5 h-5" />
            {addedToCart ? 'â ØªÙØª Ø§ÙØ¥Ø¶Ø§ÙØ©' : 'Ø£Ø¶Ù ÙÙØ³ÙØ©'}
          </button>
        </div>

        {/* Description & Specs */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h2 className="text-lg font-bold mb-3">Ø§ÙÙØµÙ</h2>
            <p className="text-gray-400">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
