'use client'

import { CheckCircle2, AlertCircle, Zap, Gift } from 'lucide-react'

interface ShippingInfoProps {
  method: string
  cost: number
  estimatedDays: number
  guarantee?: string
  rewards?: number
  guaranteedDate?: string
  freeReturn?: boolean
  returnDays?: number
  shippingType?: string
}

interface VoucherProps {
  discount: number
  minSpend: number
}

interface ShippingSectionProps {
  shipping: ShippingInfoProps
  vouchers: VoucherProps[]
}

export function ShippingInfo({ shipping, vouchers }: ShippingSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden space-y-4">
      {/* Shipping Policies */}
      <div className="p-4 space-y-3">
        {/* Return Policy */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
          <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-900">Change of Mind · {shipping.returnDays || 7} Days Free Return</p>
            <button className="text-xs text-pink-600 font-medium hover:underline">›</button>
          </div>
        </div>

        {/* Guaranteed Delivery */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
          <Zap className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-900">Guaranteed by {shipping.guaranteedDate || 'Tues, 20 May'}</p>
            <p className="text-xs text-gray-600 mt-1">
              {shipping.shippingType || 'Priority 48H'} to Your Location
            </p>
            <p className="text-xs text-gray-600">Shipping ฿{shipping.cost}</p>
          </div>
        </div>

        {/* Rewards Info */}
        {shipping.rewards && (
          <div className="flex items-start gap-3">
            <Gift className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-700">
                Get <span className="font-bold text-amber-600">฿{shipping.rewards}</span> 4LEEE Rewards if your package arrives late.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vouchers Section */}
      {vouchers.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <h3 className="font-bold text-base text-gray-900 mb-3">Vouchers</h3>
          <div className="grid grid-cols-2 gap-3">
            {vouchers.map((voucher, idx) => (
              <div
                key={idx}
                className="border-2 border-dashed border-teal-500 rounded-lg p-4 text-center bg-gradient-to-br from-teal-50 to-white hover:border-teal-600 transition"
              >
                <p className="text-3xl font-bold text-teal-600 mb-1">
                  ฿{voucher.discount}
                </p>
                <p className="text-xs text-gray-600 mb-3">Min. Spend ฿{voucher.minSpend}</p>
                <button className="w-full bg-teal-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-teal-700 transition">
                  Collect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

