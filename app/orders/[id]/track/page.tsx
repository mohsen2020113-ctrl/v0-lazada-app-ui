'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Phone, MessageCircle, Package, MapPin, Clock, CheckCircle2, Truck, Home, Copy, Star } from 'lucide-react';

const trackingSteps = [
  { id: 1, title: 'Order Placed', description: 'Your order has been confirmed', time: 'Mar 15, 10:30 AM', completed: true },
  { id: 2, title: 'Processing', description: 'Seller is preparing your package', time: 'Mar 15, 2:45 PM', completed: true },
  { id: 3, title: 'Shipped', description: 'Package picked up by courier', time: 'Mar 16, 9:15 AM', completed: true },
  { id: 4, title: 'Out for Delivery', description: 'Your package is on the way', time: 'Mar 17, 8:00 AM', completed: false, active: true },
  { id: 5, title: 'Delivered', description: 'Package delivered successfully', time: 'Expected today', completed: false },
];

const courier = {
  name: 'Somchai Prasert',
  phone: '+66 98 765 4321',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  vehicle: 'Honda PCX 160',
  plate: 'กท 1234',
  rating: 4.9,
  deliveries: 2847,
};

const packageInfo = {
  trackingNumber: 'TH2024031500012345',
  weight: '0.5 kg',
  dimensions: '25 x 15 x 10 cm',
  items: 2,
};

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const [pulseActive, setPulseActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(packageInfo.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Track Order</h1>
      </div>

      {/* Stylized Map */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 overflow-hidden">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9CA3AF" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Delivery Route Line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#E31C79" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          {/* Route path */}
          <path 
            d="M 50 150 Q 100 100 150 120 T 250 80 T 350 100" 
            fill="none" 
            stroke="url(#routeGradient)" 
            strokeWidth="4" 
            strokeLinecap="round"
            strokeDasharray="8 4"
          />
          {/* Origin marker */}
          <circle cx="50" cy="150" r="8" fill="#10B981" />
          <circle cx="50" cy="150" r="12" fill="#10B981" fillOpacity="0.3" />
          {/* Current location marker (animated) */}
          <circle cx="280" cy="85" r="10" fill="#E31C79" className={pulseActive ? 'animate-ping' : ''} fillOpacity="0.5" />
          <circle cx="280" cy="85" r="8" fill="#E31C79" />
          {/* Destination marker */}
          <circle cx="350" cy="100" r="8" fill="#3B82F6" />
          <circle cx="350" cy="100" r="12" fill="#3B82F6" fillOpacity="0.3" />
        </svg>

        {/* Map Labels */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Warehouse</span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Your Location</span>
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Delivery Status</h2>
        <div className="relative">
          {trackingSteps.map((step, index) => (
            <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
              {/* Timeline Line & Dot */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500' 
                    : step.active 
                    ? 'bg-[#E31C79]' 
                    : 'bg-gray-200'
                } ${step.active ? 'ring-4 ring-pink-100 animate-pulse' : ''}`}>
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : step.active ? (
                    <Truck className="w-4 h-4 text-white" />
                  ) : step.id === 5 ? (
                    <Home className="w-4 h-4 text-gray-400" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                  )}
                </div>
                {index < trackingSteps.length - 1 && (
                  <div className={`w-0.5 flex-1 mt-2 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-1">
                <h3 className={`font-semibold ${
                  step.active ? 'text-[#E31C79]' : step.completed ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${step.completed || step.active ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.description}
                </p>
                <p className={`text-xs mt-1 ${step.completed || step.active ? 'text-gray-500' : 'text-gray-300'}`}>
                  {step.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courier Info */}
      <div className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Your Delivery Rider</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#E31C79]">
            <Image
              src={courier.photo}
              alt={courier.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{courier.name}</h3>
            <p className="text-sm text-gray-600">{courier.vehicle} • {courier.plate}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{courier.rating}</span>
              <span className="text-xs text-gray-400">• {courier.deliveries.toLocaleString()} deliveries</span>
            </div>
          </div>
        </div>
        
        {/* Contact Buttons */}
        <div className="flex gap-3 mt-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
            <Phone className="w-5 h-5" />
            Call Rider
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#E31C79] text-white py-3 rounded-xl font-semibold hover:bg-[#C91568] transition-colors">
            <MessageCircle className="w-5 h-5" />
            Chat
          </button>
        </div>
      </div>

      {/* Package Details */}
      <div className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Package Details</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tracking Number</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-900">{packageInfo.trackingNumber}</span>
              <button 
                onClick={copyTrackingNumber}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Weight</span>
            <span className="text-gray-900">{packageInfo.weight}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Dimensions</span>
            <span className="text-gray-900">{packageInfo.dimensions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Items</span>
            <span className="text-gray-900">{packageInfo.items} items</span>
          </div>
        </div>
      </div>
    </div>
  );
}
