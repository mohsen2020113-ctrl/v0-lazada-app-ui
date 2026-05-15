'use client';

export function PaymentMethods() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 mt-2 mb-1" dir="rtl">
      <p className="text-xs font-semibold text-gray-500 mb-3 text-center">طرق الدفع المتاحة</p>

      {/* Standard Payment Icons Row */}
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {/* Visa */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded-md px-2 py-1 h-8 min-w-[48px]">
          <span className="text-blue-800 font-extrabold text-xs italic tracking-tight">VISA</span>
        </div>
        {/* Mastercard */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded-md px-2 py-1 h-8 min-w-[48px]">
          <span className="relative flex">
            <span className="w-4 h-4 rounded-full bg-red-500 opacity-90 block" />
            <span className="w-4 h-4 rounded-full bg-yellow-400 opacity-90 block -ml-2" />
          </span>
        </div>
        {/* Apple Pay */}
        <div className="flex items-center justify-center bg-black rounded-md px-2 py-1 h-8 min-w-[52px]">
          <span className="text-white font-semibold text-[10px] tracking-tight">Apple Pay</span>
        </div>
        {/* Google Pay */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded-md px-2 py-1 h-8 min-w-[52px]">
          <span className="text-gray-700 font-semibold text-[10px]">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">le</span>
            <span className="text-gray-600"> Pay</span>
          </span>
        </div>
        {/* PayPal */}
        <div className="flex items-center justify-center bg-[#003087] rounded-md px-2 py-1 h-8 min-w-[48px]">
          <span className="text-white font-bold text-[10px]">
            <span className="text-[#009cde]">Pay</span>Pal
          </span>
        </div>
        {/* Cash on Delivery */}
        <div className="flex items-center justify-center bg-green-50 border border-green-200 rounded-md px-2 py-1 h-8">
          <span className="text-green-700 text-[9px] font-medium">💵 الدفع عند الاستلام</span>
        </div>
      </div>

      {/* Tabby BNPL Card */}
      <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 mb-2">
        <div className="flex-shrink-0 w-10 h-6 bg-teal-500 rounded flex items-center justify-center">
          <span className="text-white font-bold text-[10px]">tabby</span>
        </div>
        <div className="flex-1 text-right">
          <p className="text-teal-800 text-[11px] font-semibold leading-tight">اشتر الآن وادفع بعد 30 يوم</p>
          <p className="text-teal-600 text-[10px]">بدون فوائد • تابي</p>
        </div>
      </div>

      {/* Tamara BNPL Card */}
      <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
        <div className="flex-shrink-0 w-10 h-6 bg-purple-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-[10px]">tmr</span>
        </div>
        <div className="flex-1 text-right">
          <p className="text-purple-800 text-[11px] font-semibold leading-tight">قسّم المبلغ على 3 دفعات</p>
          <p className="text-purple-600 text-[10px]">بدون فوائد • تمارة</p>
        </div>
      </div>
    </div>
  );
}

export function BnplBadge() {
  return (
    <div className="flex items-center justify-center gap-2 mt-2 py-1.5 px-3 bg-gray-50 border border-gray-100 rounded-lg" dir="rtl">
      <span className="text-[10px] text-gray-500">متوفر على</span>
      <div className="flex items-center gap-1.5">
        <span className="px-1.5 py-0.5 bg-teal-500 text-white text-[9px] font-bold rounded">tabby</span>
        <span className="text-gray-300 text-xs">•</span>
        <span className="px-1.5 py-0.5 bg-purple-600 text-white text-[9px] font-bold rounded">tmr</span>
      </div>
      <span className="text-[10px] text-gray-500">تابي وتمارة</span>
    </div>
  );
}
