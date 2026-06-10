'use client'

interface ShippingInfoProps {
  method: string
  cost: number
  estimatedDays: number
  guarantee?: string
  rewards?: number
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
    <div className="bg-white">
      {/* Shipping Info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="space-y-3">
          {/* Return Policy */}
          <div className="flex items-start gap-3">
            <div className="text-xl">🛡️</div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">Change of Mind · 7 Days Free Return</p>
              <button className="text-xs text-gray-600 hover:text-gray-900">›</button>
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-start gap-3">
            <div className="text-xl">📦</div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">{shipping.guarantee}</p>
              <p className="text-xs text-gray-600 mt-0.5">
                <span className="text-teal-600">✈️ {shipping.method}</span> To VadChana/Vadhana
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Shipping ฿{shipping.cost.toFixed(2)}
              </p>
            </div>
            <p className="text-sm font-bold text-gray-900">›</p>
          </div>

          {/* Rewards */}
          {shipping.rewards && (
            <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs text-blue-700">
              Get ฿{shipping.rewards} 4LEEERewards if your package arrives late.
            </div>
          )}
        </div>
      </div>

      {/* Vouchers */}
      {vouchers.length > 0 && (
        <div className="px-4 py-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-3">Vouchers</h3>
          <div className="grid grid-cols-2 gap-3">
            {vouchers.map((voucher, idx) => (
              <div
                key={idx}
                className="border-2 border-teal-500 rounded-lg p-3 text-center bg-gradient-to-br from-teal-50 to-white"
              >
                <p className="text-2xl font-bold text-teal-600 mb-1">
                  ฿{voucher.discount}
                </p>
                <p className="text-xs text-gray-600">Min. Spend ฿{voucher.minSpend}</p>
                <button className="mt-2 w-full bg-teal-600 text-white text-xs font-bold py-1 rounded hover:bg-teal-700 transition">
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
