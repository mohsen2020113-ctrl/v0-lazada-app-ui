'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MapPin, CreditCard, Wallet, Banknote, QrCode, Building2, Check, Plus, Tag, ChevronDown, ChevronUp, Truck, Shield, Gift } from 'lucide-react';
import { useCart } from '@/app/contexts/cart-context';
import { BottomNav } from '@/components/lee/bottom-nav-new';

const steps = ['Address', 'Payment', 'Review'];

const savedAddresses = [
  { id: 1, name: 'Mohsen Alattas', phone: '+66 98 765 4321', address: '123 Sukhumvit Road, Watthana, Bangkok 10110', isDefault: true, label: 'Home' },
  { id: 2, name: 'Mohsen Alattas', phone: '+66 98 765 4322', address: '456 Silom Road, Bang Rak, Bangkok 10500', isDefault: false, label: 'Office' },
];

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, JCB', color: 'text-blue-600' },
  { id: 'wallet', name: 'LEE Wallet', icon: Wallet, description: 'Balance: AED 2,450.00', color: 'text-green-600' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, description: 'All major banks', color: 'text-purple-600' },
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive', color: 'text-orange-600' },
  { id: 'qr', name: 'QR Pay', icon: QrCode, description: 'PromptPay, TrueMoney', color: 'text-pink-600' },
];

const vouchers = [
  { id: 1, code: 'LEE100', discount: 'AED 100 OFF', minSpend: 'AED 500', expiry: '31 May 2026' },
  { id: 2, code: 'FREESHIP', discount: 'Free Shipping', minSpend: 'AED 0', expiry: '15 Jun 2026' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [orderExpanded, setOrderExpanded] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<typeof vouchers[0] | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = 30;
  const discount = appliedVoucher ? 100 : 0;
  const finalTotal = total + shipping - discount;

  const handleApplyVoucher = () => {
    const found = vouchers.find(v => v.code === voucherCode.toUpperCase());
    if (found) {
      setAppliedVoucher(found);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOrderId(`LEE${Date.now().toString().slice(-10)}`);
    setOrderSuccess(true);
    clearCart();
    setIsProcessing(false);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-600 text-center mb-4">Thank you for your purchase</p>
          <div className="bg-white rounded-xl p-4 w-full max-w-sm shadow-sm mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Total Paid</span>
              <span className="font-bold text-[#E31C79]">AED {finalTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Est. Delivery</span>
              <span className="font-medium text-gray-900">May 8-10, 2026</span>
            </div>
          </div>
          <button
            onClick={() => router.push(`/orders/${orderId}/track`)}
            className="w-full max-w-sm bg-[#E31C79] text-white py-3 rounded-full font-bold mb-3"
          >
            Track Order
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full max-w-sm border border-[#E31C79] text-[#E31C79] py-3 rounded-full font-bold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.back()}>
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="flex-1 text-center font-bold text-lg">Checkout</h1>
          <div className="w-6" />
        </div>
        
        {/* Step Progress */}
        <div className="flex items-center justify-center px-6 pb-4 gap-2">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index <= currentStep ? 'bg-[#E31C79] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`ml-2 text-sm ${index <= currentStep ? 'text-[#E31C79] font-medium' : 'text-gray-400'}`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${index < currentStep ? 'bg-[#E31C79]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4">
        {/* Step 1: Address */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#E31C79]" />
              Delivery Address
            </h2>
            {savedAddresses.map(addr => (
              <button
                key={addr.id}
                onClick={() => setSelectedAddress(addr)}
                className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                  selectedAddress.id === addr.id ? 'border-[#E31C79] bg-pink-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{addr.name}</span>
                      {addr.isDefault && (
                        <span className="text-xs bg-[#E31C79] text-white px-2 py-0.5 rounded">Default</span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{addr.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{addr.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAddress.id === addr.id ? 'border-[#E31C79] bg-[#E31C79]' : 'border-gray-300'
                  }`}>
                    {selectedAddress.id === addr.id && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </button>
            ))}
            <button className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 flex items-center justify-center gap-2 hover:border-[#E31C79] hover:text-[#E31C79] transition-colors">
              <Plus className="w-5 h-5" />
              Add New Address
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#E31C79]" />
              Payment Method
            </h2>
            {paymentMethods.map(method => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full p-4 rounded-xl text-left border-2 transition-all flex items-center gap-4 ${
                    selectedPayment === method.id ? 'border-[#E31C79] bg-pink-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center ${method.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === method.id ? 'border-[#E31C79] bg-[#E31C79]' : 'border-gray-300'
                  }`}>
                    {selectedPayment === method.id && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Delivery Info */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E31C79]" />
                  Delivery Address
                </span>
                <button onClick={() => setCurrentStep(0)} className="text-[#E31C79] text-sm">Change</button>
              </div>
              <p className="text-sm font-medium">{selectedAddress.name}</p>
              <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
              <p className="text-sm text-gray-600">{selectedAddress.address}</p>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl p-4">
              <button
                onClick={() => setOrderExpanded(!orderExpanded)}
                className="w-full flex items-center justify-between"
              >
                <span className="font-bold">Order Items ({items.length})</span>
                {orderExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {orderExpanded && (
                <div className="mt-4 space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg relative overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#E31C79]">AED {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Voucher */}
            <div className="bg-white rounded-xl p-4">
              <p className="font-bold flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-[#E31C79]" />
                Voucher / Promo Code
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="bg-[#E31C79] text-white px-4 py-2 rounded-lg font-medium text-sm"
                >
                  Apply
                </button>
              </div>
              {appliedVoucher && (
                <div className="mt-2 p-2 bg-green-50 rounded-lg text-green-700 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {appliedVoucher.code}: {appliedVoucher.discount} applied!
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>AED {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>AED {shipping.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-AED {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#E31C79]">AED {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="flex gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Buyer Protection</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                <span>Free Returns</span>
              </div>
              <div className="flex items-center gap-1">
                <Gift className="w-4 h-4" />
                <span>Earn Coins</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        {currentStep < 2 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="w-full bg-[#E31C79] text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full bg-[#E31C79] text-white py-4 rounded-full font-bold text-lg disabled:opacity-70"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span>Place Order • AED {finalTotal.toFixed(2)}</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
