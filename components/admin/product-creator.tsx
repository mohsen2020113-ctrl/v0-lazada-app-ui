'use client'
import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface ProductResult {
  id: string
  name: string
  category: string
  colors: Array<{ name_ar: string; name_en: string; hexCode: string; percentage: number }>
  sizes: string[]
  descriptions: {
    ar: { title: string; mainDescription: string; features: string[]; benefits: string[]; keywords: string[] }
    en: { title: string; mainDescription: string; features: string[]; benefits: string[]; keywords: string[] }
  }
}

type ProcessStatus = 'idle' | 'analyzing' | 'colors' | 'description' | 'translating' | 'done' | 'error'
type ShopifyStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ProductCreator() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<ProcessStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ProductResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [shopifyStatus, setShopifyStatus] = useState<ShopifyStatus>('idle')
  const [shopifyUrl, setShopifyUrl] = useState<string | null>(null)
  const [shopifyError, setShopifyError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = useCallback((file: File) => {
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImage(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleImage(file)
  }

  const processProduct = async () => {
    if (!imageFile || !productName) return
    setError(null)
    setStatus('analyzing')
    setProgress(10)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('productName', productName)
      formData.append('category', category)

      // Simulate progress while waiting
      const progressInterval = setInterval(() => {
        setProgress(p => {
          if (p >= 90) return p
          const steps: Record<number, ProcessStatus> = { 25: 'colors', 55: 'description', 80: 'translating' }
          const newP = p + 5
          if (steps[newP]) setStatus(steps[newP])
          return newP
        })
      }, 2000)

      const res = await fetch('/api/process-product', { method: 'POST', body: formData })
      clearInterval(progressInterval)

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Processing failed')
      }

      const data = await res.json()
      setResult(data.result)
      setStatus('done')
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  const publishToShopify = async () => {
    if (!result) return
    setShopifyStatus('loading')
    setShopifyError(null)
    setShopifyUrl(null)

    try {
      const res = await fetch('/api/shopify-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.descriptions.ar.title || result.name,
          description_ar: result.descriptions.ar.mainDescription,
          description_en: result.descriptions.en.mainDescription,
          colors: result.colors,
          sizes: result.sizes,
          category: result.category,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Shopify publish failed')

      setShopifyStatus('success')
      setShopifyUrl(data.adminUrl)
    } catch (err) {
      setShopifyStatus('error')
      setShopifyError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const reset = () => {
    setImageFile(null)
    setImagePreview(null)
    setProductName('')
    setCategory('')
    setStatus('idle')
    setProgress(0)
    setResult(null)
    setError(null)
    setShopifyStatus('idle')
    setShopifyUrl(null)
    setShopifyError(null)
  }

  const statusLabels: Record<ProcessStatus, string> = {
    idle: '',
    analyzing: '🔍 Analyzing image...',
    colors: '🎨 Extracting colors...',
    description: '📝 Writing description...',
    translating: '🌐 Translating to English...',
    done: '✅ Complete!',
    error: '❌ Error occurred'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 font-sans" dir="ltr">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">🎨 Product Page Creator</h1>
          <p className="text-gray-400">Single image → AI Analysis → Complete professional product page</p>
        </div>

        {!result ? (
          <div className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800">
            {/* Image Upload */}
            <div
              className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 transition-colors mb-6"
              onClick={() => fileRef.current?.click()}
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
            >
              {imagePreview ? (
                <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden">
                  <Image src={imagePreview} alt="preview" fill className="object-cover" />
                </div>
              ) : (
                <>
                  <div className="text-5xl mb-3">📸</div>
                  <p className="text-gray-300 font-semibold">Drag image here or click to select</p>
                  <p className="text-gray-500 text-sm mt-1">JPG, PNG, WEBP</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

            {/* Product Info */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="Example: JBL Bluetooth Headphones"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">-- Select Category --</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="home">Home & Kitchen</option>
                  <option value="sports">Sports</option>
                  <option value="beauty">Beauty & Care</option>
                  <option value="toys">Toys</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Processing Status */}
            {status !== 'idle' && status !== 'error' && (
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-orange-500 text-lg animate-spin">⚙️</div>
                  <span className="font-semibold">{statusLabels[status]}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2 text-center">{progress}%</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6 text-red-400">
                ❌ {error}
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={processProduct}
              disabled={!imageFile || !productName || (status !== 'idle' && status !== 'error')}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg transition-colors"
            >
              {status !== 'idle' && status !== 'error' ? '⏳ Processing...' : '🚀 Create Product Page'}
            </button>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-400">✅ Created Successfully!</h2>
                <button onClick={reset} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm">
                  ➕ New Product
                </button>
              </div>

              {/* Titles */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">🇬🇧 English Title</div>
                  <h3 className="font-bold text-blue-400">{result.descriptions.en.title}</h3>
                  <p className="text-gray-300 text-sm mt-2">{result.descriptions.en.mainDescription}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">🇸🇦 Arabic Title (Optional)</div>
                  <h3 className="font-bold text-orange-400">{result.descriptions.ar.title}</h3>
                  <p className="text-gray-300 text-sm mt-2">{result.descriptions.ar.mainDescription}</p>
                </div>
              </div>

              {/* Colors */}
              {result.colors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-300 mb-3">🎨 Extracted Colors</h4>
                  <div className="flex gap-3 flex-wrap">
                    {result.colors.map((color, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                        <div className="w-6 h-6 rounded-full border border-gray-600" style={{ backgroundColor: color.hexCode }} />
                        <span className="text-sm">{color.name_en}</span>
                        <span className="text-xs text-gray-500">{color.hexCode}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-bold text-gray-300 mb-3">✨ Features</h4>
                  <ul className="space-y-1">
                    {result.descriptions.en.features.map((f, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-300">
                        <span className="text-orange-500">•</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-300 mb-3">🏷️ Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.descriptions.en.keywords.map((k, i) => (
                      <span key={i} className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full">{k}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shopify success message */}
              {shopifyStatus === 'success' && shopifyUrl && (
                <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 mb-4 flex items-center justify-between">
                  <span className="text-green-400 font-semibold">✅ Published to Shopify successfully!</span>
                  <a
                    href={shopifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-700 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    View Product in Shopify ↗
                  </a>
                </div>
              )}

              {/* Shopify error message */}
              {shopifyStatus === 'error' && shopifyError && (
                <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-4 text-red-400">
                  ❌ Publish failed: {shopifyError}
                </div>
              )}

              {/* Add to Shopify Button */}
              <button
                onClick={publishToShopify}
                disabled={shopifyStatus === 'loading' || shopifyStatus === 'success'}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
              >
                {shopifyStatus === 'loading'
                  ? '⏳ Publishing to Shopify...'
                  : shopifyStatus === 'success'
                  ? '✅ Published to Shopify'
                  : '🛍️ Add to Shopify'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
