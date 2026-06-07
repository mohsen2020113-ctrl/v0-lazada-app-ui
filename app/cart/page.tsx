"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 299.99,
      image: '/products/headphones.jpg',
      quantity: 1,
      colors: ['Black', 'Blue'],
      sizes: ['One Size'],
      description: 'High-quality wireless headphones with noise cancellation'
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      price: 399.99,
      image: '/products/smartwatch.jpg',
      quantity: 1,
      colors: ['Silver', 'Gold'],
      sizes: ['One Size'],
      description: 'Advanced fitness tracking and notifications'
    }
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4">
        <h1 className="text-2xl font-bold">My Cart</h1>
        <p className="text-sm opacity-90">سلة التسوق</p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Image</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <div className="flex justify-between items-end">
                          <div className="flex gap-4">
                            <div>
                              <label className="text-xs text-gray-500">Quantity</label>
                              <input type="number" defaultValue={item.quantity} className="border rounded px-2 py-1 w-16"/>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 line-through text-sm">AED {(item.price * 1.2).toFixed(2)}</p>
                            <p className="text-2xl font-bold text-pink-600">AED {item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700 text-2xl h-fit">×</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link href="/products" className="text-pink-600 font-semibold hover:underline">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-gray-50 rounded-lg p-6 border">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>AED 699.98</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>AED 52.49</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-pink-600">AED 752.47</span>
                </div>
              </div>
              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg mb-3 transition">
                Checkout
              </button>
              <button className="w-full border border-pink-600 text-pink-600 hover:bg-pink-50 font-semibold py-3 rounded-lg transition">
                Continue Shopping
              </button>
              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t space-y-2 text-xs text-gray-600">
                <p>✓ Free Returns 30 Days</p>
                <p>✓ Secure Payment</p>
                <p>✓ Fast Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
