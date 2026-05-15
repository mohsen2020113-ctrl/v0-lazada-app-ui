'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Check, Camera, Plus, X, Package, Truck, Wallet, CreditCard, AlertCircle, Clock } from 'lucide-react';

const orderItems = [
  { id: 1, name: 'Wireless Bluetooth Earbuds Pro Max', variant: 'White', price: 1299, qty: 1, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80' },
  { id: 2, name: 'Premium Phone Case with MagSafe', variant: 'Black', price: 599, qty: 2, image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&q=80' },
];

const returnReasons = [
  'Wrong item received',
  'Item is damaged',
  'Item not as described',
  'Changed my mind',
  'Item is defective',
  'Missing parts/accessories',
  'Other',
];

const returnMethods = [
  { id: 'pickup', name: 'Schedule Pickup', description: 'We will pick up from your address', icon: Truck, eta: '2-3 business days' },
  { id: 'dropoff', name: 'Drop-off Point', description: 'Drop at nearest LEE Point', icon: Package, eta: '1-2 business days' },
];

const refundMethods = [
  { id: 'wallet', name: 'LEE Wallet', description: 'Instant refund to your wallet', icon: Wallet, time: 'Instant' },
  { id: 'original', name: 'Original Payment', description: 'Refund to card ending ****4521', icon: CreditCard, time: '3-5 business days' },
];

export default function ReturnPage() {
  const router = useRouter();
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [returnMethod, setReturnMethod] = useState('');
  const [refundMethod, setRefundMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const steps = ['Select Items', 'Reason', 'Upload Photo', 'Confirm'];

  const toggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    if (photos.length < 9) {
      setPhotos(prev => [...prev, `https://images.unsplash.com/photo-${Date.now()}?w=200&q=80`]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedItems.length > 0;
      case 2: return selectedReason && (selectedReason !== 'Other' || otherReason);
      case 3: return photos.length > 0;
      case 4: return returnMethod && refundMethod;
      default: return false;
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
    }, 2000);
  };

  const selectedTotal = orderItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Return Request Submitted</h2>
          <p className="text-gray-500 mb-6">Your return request has been submitted successfully.</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Return ID</span>
              <span className="font-mono font-bold text-gray-900">RTN{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Refund Amount</span>
              <span className="font-bold text-[#E31C79]">AED {selectedTotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Estimated Refund</span>
              <span className="font-medium text-gray-900">3-5 business days</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl mb-6">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-700 text-left">
              We will notify you once your return is approved and refund is processed.
            </p>
          </div>

          <button
            onClick={() => router.push('/orders')}
            className="w-full bg-[#E31C79] text-white py-4 rounded-xl font-semibold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <button onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}>
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Return / Refund</h1>
      </div>

      {/* Progress Steps */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index + 1 
                    ? 'bg-[#E31C79] text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-[10px] mt-1 ${
                  currentStep >= index + 1 ? 'text-gray-900 font-medium' : 'text-gray-400'
                }`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-12 h-0.5 mx-1 ${
                  currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Step 1: Select Items */}
        {currentStep === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Select items you want to return:</p>
            {orderItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full bg-white rounded-xl p-4 flex gap-3 border-2 transition-all ${
                  selectedItems.includes(item.id) ? 'border-[#E31C79]' : 'border-transparent'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedItems.includes(item.id) ? 'bg-[#E31C79] border-[#E31C79]' : 'border-gray-300'
                }`}>
                  {selectedItems.includes(item.id) && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                  <Image src={item.image} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.variant} x{item.qty}</p>
                  <p className="text-[#E31C79] font-bold">AED {item.price.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Reason */}
        {currentStep === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Why are you returning this item?</p>
            {returnReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`w-full bg-white rounded-xl p-4 flex items-center justify-between border-2 transition-all ${
                  selectedReason === reason ? 'border-[#E31C79]' : 'border-transparent'
                }`}
              >
                <span className="font-medium text-gray-900">{reason}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedReason === reason ? 'bg-[#E31C79] border-[#E31C79]' : 'border-gray-300'
                }`}>
                  {selectedReason === reason && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
            {selectedReason === 'Other' && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Please describe the issue..."
                className="w-full bg-white rounded-xl p-4 border-2 border-gray-200 focus:border-[#E31C79] outline-none resize-none h-24"
              />
            )}
          </div>
        )}

        {/* Step 3: Upload Photo */}
        {currentStep === 3 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">Upload photos of the item (required):</p>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-200">
                  <Image src={photo} alt="" fill className="object-cover" />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              {photos.length < 9 && (
                <button
                  onClick={handlePhotoUpload}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-all"
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Add Photo</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Clear photos help us process your return faster
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {currentStep === 4 && (
          <div className="space-y-4">
            {/* Return Method */}
            <div>
              <p className="text-sm text-gray-500 mb-3">Select return method:</p>
              <div className="space-y-2">
                {returnMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setReturnMethod(method.id)}
                    className={`w-full bg-white rounded-xl p-4 flex items-center gap-3 border-2 transition-all ${
                      returnMethod === method.id ? 'border-[#E31C79]' : 'border-transparent'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      returnMethod === method.id ? 'bg-[#E31C79]/10' : 'bg-gray-100'
                    }`}>
                      <method.icon className={`w-6 h-6 ${
                        returnMethod === method.id ? 'text-[#E31C79]' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                      <p className="text-xs text-[#E31C79]">ETA: {method.eta}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      returnMethod === method.id ? 'bg-[#E31C79] border-[#E31C79]' : 'border-gray-300'
                    }`}>
                      {returnMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Refund Method */}
            <div>
              <p className="text-sm text-gray-500 mb-3">Select refund method:</p>
              <div className="space-y-2">
                {refundMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setRefundMethod(method.id)}
                    className={`w-full bg-white rounded-xl p-4 flex items-center gap-3 border-2 transition-all ${
                      refundMethod === method.id ? 'border-[#E31C79]' : 'border-transparent'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      refundMethod === method.id ? 'bg-[#E31C79]/10' : 'bg-gray-100'
                    }`}>
                      <method.icon className={`w-6 h-6 ${
                        refundMethod === method.id ? 'text-[#E31C79]' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                      <p className="text-xs text-green-600">{method.time}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      refundMethod === method.id ? 'bg-[#E31C79] border-[#E31C79]' : 'border-gray-300'
                    }`}>
                      {refundMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-3">Refund Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items ({selectedItems.length})</span>
                  <span className="text-gray-900">AED {selectedTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Return Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total Refund</span>
                  <span className="font-bold text-[#E31C79]">AED {selectedTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed()}
            className="w-full bg-[#E31C79] text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="w-full bg-[#E31C79] text-white py-4 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              'Submit Return Request'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
