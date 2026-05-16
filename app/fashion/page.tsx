'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, ShoppingCart, Heart, Star, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';
import { useCart } from '@/app/contexts/cart-context';

const categories = [
  { id: 'women', label: 'Women', icon: '👗' },
  { id: 'men', label: 'Men', icon: '👔' },
  { id: 'kids', label: 'Kids', icon: '🧒' },
  { id: 'shoes', label: 'Shoes', icon: '👟' },
  { id: 'bags', label: 'Bags', icon: '👜' },
  { id: 'accessories', label: 'Accessories', icon: '💎' },
  { id: 'beauty', label: 'Beauty', icon: '💄' },
];

const brands = [
  { id: '1', name: 'Nike', color: 'bg-black', textColor: 'text-white' },
  { id: '2', name: 'Adidas', color: 'bg-blue-600', textColor: 'text-white' },
  { id: '3', name: 'Zara', color: 'bg-gray-900', textColor: 'text-white' },
  { id: '4', name: 'H&M', color: 'bg-red-600', textColor: 'text-white' },
  { id: '5', name: 'Uniqlo', color: 'bg-red-500', textColor: 'text-white' },
  { id: '6', name: 'Gucci', color: 'bg-emerald-700', textColor: 'text-white' },
  { id: '7', name: 'Prada', color: 'bg-black', textColor: 'text-white' },
];

const trendingItems = [
  { id: '1', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop', title: 'Summer Collection', subtitle: 'New Arrivals' },
  { id: '2', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop', title: 'Street Style', subtitle: 'Urban Vibes' },
  { id: '3', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop', title: 'Elegant Wear', subtitle: 'For Special Occasions' },
  { id: '4', image: 'https://images.unsplash.com/photo-1558171813-7f8b0e1e8a2b?w=400&h=500&fit=crop', title: 'Casual Chic', subtitle: 'Everyday Essentials' },
];

const styleGuides = [
  { id: '1', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop', title: 'Office Look', items: 5 },
  { id: '2', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop', title: 'Weekend Casual', items: 4 },
  { id: '3', image: 'https://images.unsplash.com/photo-1485968579169-a6f313525679?w=400&h=300&fit=crop', title: 'Date Night', items: 6 },
];

const newArrivals = [
  { id: '1', name: 'Oversized Cotton Shirt', price: 599, originalPrice: 1199, discount: 50, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop', rating: 4.8, sold: '2.1k' },
  { id: '2', name: 'High Waist Denim Jeans', price: 899, originalPrice: 1599, discount: 44, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop', rating: 4.9, sold: '3.5k' },
  { id: '3', name: 'Floral Print Maxi Dress', price: 1299, originalPrice: 2499, discount: 48, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=300&fit=crop', rating: 4.7, sold: '1.8k' },
  { id: '4', name: 'Leather Sneakers White', price: 1599, originalPrice: 2999, discount: 47, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop', rating: 4.9, sold: '4.2k' },
  { id: '5', name: 'Crossbody Mini Bag', price: 799, originalPrice: 1499, discount: 47, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop', rating: 4.6, sold: '1.2k' },
  { id: '6', name: 'Aviator Sunglasses', price: 499, originalPrice: 999, discount: 50, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop', rating: 4.8, sold: '5.1k' },
];

export default function FashionPage() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [activeCategory, setActiveCategory] = useState('women');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Banner */}
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop"
          alt="Fashion Hero"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Search Header */}
        <div className="absolute top-0 left-0 right-0 px-4 py-3 pt-6 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search fashion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <button onClick={() => router.push('/cart')} className="relative p-2 bg-white/90 backdrop-blur-sm rounded-full">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E31C79] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Hero Text */}
        <div className="absolute bottom-8 left-4 right-4">
          <span className="inline-block bg-[#E31C79] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            NEW SEASON
          </span>
          <h1 className="text-3xl font-bold text-white mb-2">
            New Season Arrivals
          </h1>
          <p className="text-white/80 text-sm mb-4">
            Discover the latest trends in fashion
          </p>
          <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white py-4 px-3 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#E31C79] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Brands */}
      <div className="bg-white mt-2 py-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="font-bold text-gray-900">Featured Brands</h2>
          <button className="text-[#E31C79] text-sm font-medium flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-4">
            {brands.map((brand) => (
              <button
                key={brand.id}
                className={`flex flex-col items-center gap-2 flex-shrink-0`}
              >
                <div className={`w-16 h-16 rounded-full ${brand.color} flex items-center justify-center shadow-md`}>
                  <span className={`text-xs font-bold ${brand.textColor}`}>{brand.name.slice(0, 2)}</span>
                </div>
                <span className="text-xs text-gray-700 font-medium">{brand.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Now */}
      <div className="bg-white mt-2 py-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="font-bold text-gray-900">Trending Now</h2>
          <button className="text-[#E31C79] text-sm font-medium flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 grid grid-cols-2 gap-3">
          {trendingItems.map((item, index) => (
            <div
              key={item.id}
              className={`relative rounded-xl overflow-hidden cursor-pointer ${
                index === 0 ? 'row-span-2' : ''
              }`}
              onClick={() => router.push('/search')}
            >
              <div className={`relative ${index === 0 ? 'h-[280px]' : 'h-[135px]'}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-sm">{item.title}</h3>
                  <p className="text-white/80 text-xs">{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Style Guide */}
      <div className="bg-white mt-2 py-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="font-bold text-gray-900">Style Guide</h2>
          <button className="text-[#E31C79] text-sm font-medium flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-3">
            {styleGuides.map((guide) => (
              <div
                key={guide.id}
                className="flex-shrink-0 w-[200px] rounded-xl overflow-hidden cursor-pointer"
              >
                <div className="relative h-[140px]">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-sm">{guide.title}</h3>
                    <p className="text-white/80 text-xs">{guide.items} items</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="bg-white mt-2 py-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="font-bold text-gray-900">New Arrivals</h2>
          <button className="text-[#E31C79] text-sm font-medium flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="px-3 grid grid-cols-2 gap-3">
          {newArrivals.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
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
      </div>

      <BottomNav />
    </div>
  );
}
