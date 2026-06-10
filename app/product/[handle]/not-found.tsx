export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-600 mb-6">Product not found</p>
      <a href="/category" className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
        Continue Shopping
      </a>
    </div>
  )
}
