'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Share2, Star, MessageCircle, Heart, ShoppingCart, MapPin, Clock, Shield, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

const store = {
  id: '1',
  name: 'TechZone Official Store',
  banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop',
  logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
  verified: true,
  rating: 4.9,
  followers: '125.6K',
  products: 2847,
  responseRate: 98,
  responseTime: '< 1 hour',
  joined: 'Jan 2020',
  location: 'Bangkok, Thailand',
  description: 'Official authorized retailer for premium electronics and gadgets. We guarantee 100% authentic products with full warranty support. Free shipping on orders over AED 500.',
  operatingHours: 'Mon-Sat: 9AM - 9PM, Sun: 10AM - 6PM',
};

const storeProducts = [
  { id: '1', name: 'Wireless Earbuds Pro Max', price: 899, originalPrice: 1999, discount: 55, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop', rating: 4.8, sold: '2.5k' },
  { id: '2', name: 'Smart Watch Series 8', price: 1299, originalPrice: 2499, discount: 48, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', rating: 4.9, sold: '5.2k' },
  { id: '3', name: 'Bluetooth Speaker Portable', price: 599, originalPrice: 1199, discount: 50, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop', rating: 4.7, sold: '3.1k' },
  { id: '4', name: 'USB-C Fast Charging Cable', price: 199, originalPrice: 399, discount: 50, image: 'https://images.unsplash.com/photo-1609042237318-7beb42dc2138?w=300&h=300&fit=crop', rating: 4.6, sold: '12.4k' },
  { id: '5', name: 'Laptop Stand Aluminum', price: 799, originalPrice: 1499, discount: 47, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop', rating: 4.8, sold: '1.8k' },
  { id: '6', name: 'Wireless Mouse Ergonomic', price: 499, originalPrice: 899, discount: 44, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop', rating: 4.7, sold: '4.2k' },
];

const reviews = [
  { id: '1', user: 'John D.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', rating: 5, comment: 'Excellent store! Fast shipping and genuine products. Highly recommended!', date: '2 days ago', product: 'Wireless Earbuds Pro' },
  { id: '2', user: 'Sarah M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face', rating: 5, comment: 'Great customer service. They responded quickly to my questions.', date: '1 week ago', product: 'Smart Watch Series 8' },
  { id: '3', user: 'Mike L.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face', rating: 4, comment: 'Good products, reasonable prices. Packaging was also very secure.', date: '2 weeks ago', product: 'Bluetooth Speaker' },
];

type TabType = 'products' | 'reviews' | 'about';

export default function StorePage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [isFollowing, setIsFollowing] = useState(false);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'products', label: 'Products' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'about', label: 'About' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Store</h1>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Store Banner */}
      <div className="relative h-32">
        <Image
          src={store.banner}
          alt={store.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Store Info Card */}
      <div className="relative bg-white -mt-10 mx-3 rounded-xl shadow-sm p-4">
        {/* Logo */}
        <div className="absolute -top-8 left-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border-4 border-white shadow-md">
            <Image src={store.logo} alt={store.name} fill className="object-cover" />
          </div>
          {store.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Store Name & Actions */}
        <div className="ml-20 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{store.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{store.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">{store.followers} Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-around py-3 border-y border-gray-100">
          <div className="text-center">
            <p className="font-bold text-gray-900">{store.products.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Products</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">{store.followers}</p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">{store.rating}</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">{store.responseRate}%</p>
            <p className="text-xs text-gray-500">Response</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-colors ${
              isFollowing
                ? 'bg-gray-100 text-gray-700 border border-gray-200'
                : 'bg-[#E31C79] text-white'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button className="flex-1 py-2.5 rounded-lg font-semibold border border-[#E31C79] text-[#E31C79] flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors">
            <MessageCircle className="w-5 h-5" />
            Chat
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white mt-2 sticky top-14 z-40">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium relative transition-colors ${
                activeTab === tab.id ? 'text-[#E31C79]' : 'text-gray-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#E31C79]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-2">
        {activeTab === 'products' && (
          <div className="p-3 grid grid-cols-2 gap-3">
            {storeProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.handle}`)}
                className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
              >
                <div className="relative aspect-square">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-[#E31C79] text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm text-gray-800 line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[#E31C79] font-bold">AED {product.price.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs line-through">AED {product.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    <span>•</span>
                    <span>{product.sold} sold</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="p-4 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src={review.avatar} alt={review.user} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{review.user}</h4>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">Product: {review.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">About This Store</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{store.description}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Store Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{store.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{store.operatingHours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Response time: {store.responseTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Member since {store.joined}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
