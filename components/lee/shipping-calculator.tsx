'use client';

import { useState, useMemo } from 'react';
import { COUNTRIES } from '@/lib/warehouse-routing';

type Preference = 'fastest' | 'cheapest' | 'balanced';

interface WarehouseDetail {
  warehouse: { id: string; name: string; nameAr: string };
  totalCostAED: number;
  shippingCostAED: number;
  customsDutyAED: number;
  vatAED: number;
  estimatedDays: number;
  savingsVsAlternativeAED: number;
}

interface RecommendationResult {
  recommendedWarehouse: string;
  alternativeWarehouse: string;
  recommended: WarehouseDetail;
  alternative: WarehouseDetail;
  reasoning: string;
}

const WAREHOUSE_FLAGS: Record<string, string> = {
  china: '🇨🇳',
  dubai: '🇦🇪',
};

const PREFERENCE_LABELS: Record<Preference, { label: string; icon: string }> = {
  fastest: { label: 'Fastest', icon: '⚡' },
  cheapest: { label: 'Cheapest', icon: '💰' },
  balanced: { label: 'Balanced', icon: '⚖️' },
};

// Pre-sort countries alphabetically by Arabic name for the dropdown
const SORTED_COUNTRIES = [...COUNTRIES].sort((a, b) =>
  a.nameAr.localeCompare(b.nameAr, 'ar')
);

export default function ShippingCalculator() {
  const [countryCode, setCountryCode] = useState('AE');
  const [search, setSearch] = useState('');
  const [weight, setWeight] = useState('1');
  const [value, setValue] = useState('200');
  const [preference, setPreference] = useState<Preference>('balanced');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return SORTED_COUNTRIES;
    const q = search.toLowerCase();
    return SORTED_COUNTRIES.filter(
      (c) =>
        c.nameAr.includes(search) ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === countryCode),
    [countryCode]
  );

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        country: countryCode,
        weight: weight || '1',
        value: value || '0',
        preference,
      });

      const res = await fetch(`/api/shipping-estimate?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ غير متوقع');
      }

      setResult(data.recommendation);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) =>
    n.toLocaleString('ar-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 font-sans"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white rounded-2xl px-5 py-3 shadow-sm border border-blue-100 mb-4">
            <span className="text-2xl">🚚</span>
            <span className="text-xl font-bold text-slate-800">حاسبة الشحن الذكية</span>
          </div>
          <p className="text-slate-500 text-sm">
            احسب تكاليف الشحن من مستودعاتنا في الصين ودبي إلى أي دولة في العالم
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">

          {/* Country Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              🌍 الدولة الوجهة
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-2 border border-slate-200 rounded-xl px-4 py-3 text-right bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span className="text-slate-800 font-medium">
                  {selectedCountry ? `${selectedCountry.nameAr} (${selectedCountry.code})` : 'اختر الدولة'}
                </span>
                <span className="text-slate-400 text-lg">{dropdownOpen ? '▲' : '▼'}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-hidden flex flex-col">
                  <div className="p-2 border-b border-slate-100">
                    <input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="ابحث عن الدولة..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {filteredCountries.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-400 text-center">
                        لا توجد نتائج
                      </div>
                    ) : (
                      filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setCountryCode(c.code);
                            setSearch('');
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-right px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${
                            c.code === countryCode ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <span className="text-slate-400 text-xs font-mono">{c.code}</span>
                          <span>{c.nameAr}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Weight & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                ⚖️ الوزن (كيلوغرام)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-right bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-colors"
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                💎 قيمة المنتج (درهم)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-right bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-colors"
                placeholder="200"
              />
            </div>
          </div>

          {/* Preference Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              🎯 تفضيل الشحن
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
              {(Object.keys(PREFERENCE_LABELS) as Preference[]).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setPreference(pref)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    preference === pref
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span>{PREFERENCE_LABELS[pref].icon}</span>
                  <span>{PREFERENCE_LABELS[pref].ar}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            type="button"
            onClick={handleCalculate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جارٍ الحساب...
              </>
            ) : (
              <>
                <span>🧮</span>
                احسب تكلفة الشحن
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-red-500 text-xl mt-0.5">⚠️</span>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4">
            {/* Recommended */}
            <div className="bg-white rounded-3xl border-2 border-blue-500 shadow-sm overflow-hidden">
              <div className="bg-blue-600 px-6 py-4 flex items-center gap-3">
                <span className="text-2xl">
                  {WAREHOUSE_FLAGS[result.recommendedWarehouse]}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      ⭐ موصى به
                    </span>
                  </div>
                  <p className="text-white font-bold text-lg">
                    {result.recommended.warehouse.nameAr}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Total Cost — big display */}
                <div className="text-center py-2">
                  <p className="text-slate-400 text-xs mb-1">إجمالي التكلفة</p>
                  <p className="text-4xl font-black text-blue-700">
                    {fmt(result.recommended.totalCostAED)}
                    <span className="text-lg font-semibold text-slate-500 mr-1">درهم</span>
                  </p>
                </div>

                {/* Cost breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                  <CostRow icon="🚢" label="تكلفة الشحن" value={result.recommended.shippingCostAED} />
                  <CostRow icon="🏛️" label="رسوم الجمارك" value={result.recommended.customsDutyAED} />
                  <CostRow icon="📋" label="الضريبة (VAT)" value={result.recommended.vatAED} />
                </div>

                {/* Delivery & Savings */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-green-600 text-xs font-semibold mb-1">⏱️ وقت التسليم</p>
                    <p className="text-green-800 font-black text-xl">
                      {result.recommended.estimatedDays}
                      <span className="text-sm font-semibold mr-1">يوم</span>
                    </p>
                  </div>
                  {result.recommended.savingsVsAlternativeAED > 0 && (
                    <div className="bg-orange-50 rounded-xl p-3 text-center">
                      <p className="text-orange-600 text-xs font-semibold mb-1">💸 توفير</p>
                      <p className="text-orange-800 font-black text-xl">
                        {fmt(result.recommended.savingsVsAlternativeAED)}
                        <span className="text-sm font-semibold mr-1">درهم</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Reasoning */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-blue-800 text-sm leading-relaxed">{result.reasoning}</p>
                </div>
              </div>
            </div>

            {/* Alternative */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-100 px-6 py-4 flex items-center gap-3">
                <span className="text-xl">
                  {WAREHOUSE_FLAGS[result.alternativeWarehouse]}
                </span>
                <div>
                  <p className="text-slate-400 text-xs">البديل</p>
                  <p className="text-slate-700 font-bold">
                    {result.alternative.warehouse.nameAr}
                  </p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-slate-600">
                    {fmt(result.alternative.totalCostAED)}
                    <span className="text-base font-semibold text-slate-400 mr-1">درهم</span>
                  </p>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">وقت التسليم</p>
                    <p className="text-slate-600 font-bold">{result.alternative.estimatedDays} يوم</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                  <CostRow icon="🚢" label="شحن" value={result.alternative.shippingCostAED} small />
                  <CostRow icon="🏛️" label="جمارك" value={result.alternative.customsDutyAED} small />
                  <CostRow icon="📋" label="ضريبة" value={result.alternative.vatAED} small />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CostRow({
  icon,
  label,
  value,
  small = false,
}: {
  icon: string;
  label: string;
  value: number;
  small?: boolean;
}) {
  const fmt = (n: number) =>
    n.toLocaleString('ar-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className={`flex items-center justify-between ${small ? 'text-xs' : 'text-sm'}`}>
      <span className={`font-bold text-slate-700 ${small ? '' : 'text-base'}`}>
        {fmt(value)} <span className="font-normal text-slate-400">درهم</span>
      </span>
      <span className="text-slate-500 flex items-center gap-1">
        {label} <span>{icon}</span>
      </span>
    </div>
  );
}
