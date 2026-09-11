import { useState, useMemo } from 'react';

const API_URL = 'https://www.4leee.com/api/shipping-estimate';

type Preference = 'fastest' | 'cheapest' | 'balanced';

interface CountryConfig {
  code: string;
  name: string;
  nameAr: string;
}

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

const PREFERENCE_LABELS: Record<Preference, { ar: string; icon: string }> = {
  fastest: { ar: 'الأسرع', icon: '⚡' },
  cheapest: { ar: 'الأرخص', icon: '💰' },
  balanced: { ar: 'متوازن', icon: '⚖️' },
};

// Inline country list (subset used for mobile – full list mirrors lib/warehouse-routing.ts)
const COUNTRIES: CountryConfig[] = [
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة' },
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين' },
  { code: 'OM', name: 'Oman', nameAr: 'عُمان' },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن' },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان' },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق' },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا' },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب' },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر' },
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا' },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان' },
  { code: 'SO', name: 'Somalia', nameAr: 'الصومال' },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا' },
  { code: 'IR', name: 'Iran', nameAr: 'إيران' },
  { code: 'PK', name: 'Pakistan', nameAr: 'باكستان' },
  { code: 'IN', name: 'India', nameAr: 'الهند' },
  { code: 'CN', name: 'China', nameAr: 'الصين' },
  { code: 'US', name: 'United States', nameAr: 'الولايات المتحدة الأمريكية' },
  { code: 'GB', name: 'United Kingdom', nameAr: 'المملكة المتحدة' },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا' },
  { code: 'FR', name: 'France', nameAr: 'فرنسا' },
  { code: 'IT', name: 'Italy', nameAr: 'إيطاليا' },
  { code: 'ES', name: 'Spain', nameAr: 'إسبانيا' },
  { code: 'NL', name: 'Netherlands', nameAr: 'هولندا' },
  { code: 'AU', name: 'Australia', nameAr: 'أستراليا' },
  { code: 'CA', name: 'Canada', nameAr: 'كندا' },
  { code: 'SG', name: 'Singapore', nameAr: 'سنغافورة' },
  { code: 'MY', name: 'Malaysia', nameAr: 'ماليزيا' },
  { code: 'ID', name: 'Indonesia', nameAr: 'إندونيسيا' },
  { code: 'JP', name: 'Japan', nameAr: 'اليابان' },
  { code: 'KR', name: 'South Korea', nameAr: 'كوريا الجنوبية' },
  { code: 'NG', name: 'Nigeria', nameAr: 'نيجيريا' },
  { code: 'KE', name: 'Kenya', nameAr: 'كينيا' },
  { code: 'ZA', name: 'South Africa', nameAr: 'جنوب أفريقيا' },
  { code: 'ET', name: 'Ethiopia', nameAr: 'إثيوبيا' },
  { code: 'GH', name: 'Ghana', nameAr: 'غانا' },
  { code: 'BR', name: 'Brazil', nameAr: 'البرازيل' },
  { code: 'MX', name: 'Mexico', nameAr: 'المكسيك' },
  { code: 'AR', name: 'Argentina', nameAr: 'الأرجنتين' },
];

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

      const res = await fetch(`${API_URL}?${params.toString()}`);
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
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', padding: '1rem', fontFamily: 'sans-serif' }}
    >
      <div style={{ maxWidur: '640px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', borderRadius: '1rem', padding: '0.75rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #dbeafe', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🚚</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>حاسبة الشحن الذكية</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            احسب تكاليف الشحن من مستودعاتنا في الصين ودبي إلى أي دولة في العالم
          </p>
        </div>

        {/* Form Card */}
        <div style={{ background: 'white', borderRadius: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Country Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
              🌍 الدولة الوجهة
            </label>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                style={{ widur: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.75rem 1rem', textAlign: 'right', background: '#f8fafc', cursor: 'pointer', fontSize: '1rem' }}
              >
                <span style={{ color: '#1e293b', fontWeight: '500' }}>
                  {selectedCountry ? `${selectedCountry.nameAr} (${selectedCountry.code})` : 'اختر الدولة'}
                </span>
                <span style={{ color: '#94a3b8' }}>{dropdownOpen ? '▲' : '▼'}</span>
              </button>

              {dropdownOpen && (
                <div style={{ position: 'absolute', zIndex: 50, marginTop: '0.25rem', widur: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', maxHeight: '16rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    <input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="ابحث عن الدولة..."
                      style={{ widur: '100%', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {filteredCountries.length === 0 ? (
                      <div style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#94a3b8', textAlign: 'center' }}>
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
                          style={{ widur: '100%', textAlign: 'right', padding: '0.625rem 1rem', fontSize: '0.875rem', background: c.code === countryCode ? '#eff6ff' : 'transparent', color: c.code === countryCode ? '#1d4ed8' : '#334155', fontWeight: c.code === countryCode ? '600' : '400', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'monospace' }}>{c.code}</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                ⚖️ الوزن (كيلوغرام)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{ widur: '100%', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.75rem 1rem', textAlign: 'right', background: '#f8fafc', fontSize: '1rem', boxSizing: 'border-box' }}
                placeholder="1"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                💎 قيمة المنتج (درهم)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{ widur: '100%', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.75rem 1rem', textAlign: 'right', background: '#f8fafc', fontSize: '1rem', boxSizing: 'border-box' }}
                placeholder="200"
              />
            </div>
          </div>

          {/* Preference Toggle */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
              ��� تفضيل الشحن
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.75rem' }}>
              {(Object.keys(PREFERENCE_LABELS) as Preference[]).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setPreference(pref)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.625rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', border: 'none', cursor: 'pointer', background: preference === pref ? 'white' : 'transparent', color: preference === pref ? '#1d4ed8' : '#64748b', boxShadow: preference === pref ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
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
            style={{ widur: '100%', background: loading ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 'bold', padding: '1rem', borderRadius: '0.75rem', border: 'none', fontSize: '1.125rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', widur: '1.25rem', height: '1.25rem', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
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
          <div style={{ marginTop: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ color: '#ef4444', fontSize: '1.25rem' }}>⚠️</span>
            <p style={{ color: '#b91c1c', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Recommended */}
            <div style={{ background: 'white', borderRadius: '1.5rem', border: '2px solid #3b82f6', overflow: 'hidden' }}>
              <div style={{ background: '#2563eb', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{WAREHOUSE_FLAGS[result.recommendedWarehouse]}</span>
                <div>
                  <span style={{ background: '#facc15', color: '#713f12', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                    ⭐ موصى به
                  </span>
                  <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem', margin: '0.25rem 0 0 0' }}>
                    {result.recommended.warehouse.nameAr}
                  </p>
                </div>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>إجمالي التكلفة</p>
                  <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1d4ed8', margin: 0 }}>
                    {fmt(result.recommended.totalCostAED)}
                    <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#64748b', marginRight: '0.25rem' }}>درهم</span>
                  </p>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <CostRow icon="🚢" label="تكلفة الشحن" value={result.recommended.shippingCostAED} fmt={fmt} />
                  <CostRow icon="🏛️" label="رسوم الجمارك" value={result.recommended.customsDutyAED} fmt={fmt} />
                  <CostRow icon="📋" label="الضريبة (VAT)" value={result.recommended.vatAED} fmt={fmt} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: result.recommended.savingsVsAlternativeAED > 0 ? '1fr 1fr' : '1fr', gap: '0.75rem' }}>
                  <div style={{ background: '#f0fdf4', borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center' }}>
                    <p style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>⏱️ وقت التسليم</p>
                    <p style={{ color: '#166534', fontWeight: '900', fontSize: '1.25rem', margin: 0 }}>
                      {result.recommended.estimatedDays}
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', marginRight: '0.25rem' }}>يوم</span>
                    </p>
                  </div>
                  {result.recommended.savingsVsAlternativeAED > 0 && (
                    <div style={{ background: '#fff7ed', borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center' }}>
                      <p style={{ color: '#ea580c', fontSize: '0.75rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>💸 توفير</p>
                      <p style={{ color: '#9a3412', fontWeight: '900', fontSize: '1.25rem', margin: 0 }}>
                        {fmt(result.recommended.savingsVsAlternativeAED)}
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', marginRight: '0.25rem' }}>درهم</span>
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ background: '#eff6ff', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #dbeafe' }}>
                  <p style={{ color: '#1e40af', fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>{result.reasoning}</p>
                </div>
              </div>
            </div>

            {/* Alternative */}
            <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ background: '#f1f5f9', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{WAREHOUSE_FLAGS[result.alternativeWarehouse]}</span>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 0.125rem 0' }}>البديل</p>
                  <p style={{ color: '#334155', fontWeight: 'bold', margin: 0 }}>{result.alternative.warehouse.nameAr}</p>
                </div>
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#475569', margin: 0 }}>
                    {fmt(result.alternative.totalCostAED)}
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8', marginRight: '0.25rem' }}>درهم</span>
                  </p>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 0.125rem 0' }}>وقت التسليم</p>
                    <p style={{ color: '#475569', fontWeight: 'bold', margin: 0 }}>{result.alternative.estimatedDays} يوم</p>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <CostRow icon="🚢" label="شحن" value={result.alternative.shippingCostAED} fmt={fmt} small />
                  <CostRow icon="🏛️" label="جمارك" value={result.alternative.customsDutyAED} fmt={fmt} small />
                  <CostRow icon="📋" label="ضريبة" value={result.alternative.vatAED} fmt={fmt} small />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        button:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}

function CostRow({
  icon,
  label,
  value,
  fmt,
  small = false,
}: {
  icon: string;
  label: string;
  value: number;
  fmt: (n: number) => string;
  small?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: small ? '0.75rem' : '0.875rem' }}>
      <span style={{ fontWeight: 'bold', color: '#334155' }}>
        {fmt(value)} <span style={{ fontWeight: 'normal', color: '#94a3b8' }}>درهم</span>
      </span>
      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {label} <span>{icon}</span>
      </span>
    </div>
  );
}
