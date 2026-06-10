"use client";

import { useState } from "react";

const KPICard = ({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) => (
  <div
    className={`rounded-2xl p-6 text-white shadow-lg flex flex-col gap-1 ${color}`}
  >
    <span className="text-sm font-medium opacity-80">{label}</span>
    <span className="text-3xl font-bold">{value}</span>
    {sub && <span className="text-xs opacity-70">{sub}</span>}
  </div>
);

const orders = [
  {
    id: "#LEE-10821",
    customer: "أحمد الفهد",
    country: "🇸🇦",
    countryName: "السعودية",
    amount: "AED 620",
    status: "مُسلَّم",
    statusColor: "bg-green-100 text-green-800",
    warehouse: "🏭",
    date: "2024-01-15",
  },
  {
    id: "#LEE-10822",
    customer: "فاطمة المرزوقي",
    country: "🇦🇪",
    countryName: "الإمارات",
    amount: "AED 940",
    status: "قيد الشحن",
    statusColor: "bg-blue-100 text-blue-800",
    warehouse: "🏭",
    date: "2024-01-15",
  },
  {
    id: "#LEE-10823",
    customer: "محمد الرشيد",
    country: "🇰🇼",
    countryName: "الكويت",
    amount: "AED 1200",
    status: "في المستودع",
    statusColor: "bg-yellow-100 text-yellow-800",
    warehouse: "🏭",
    date: "2024-01-14",
  },
  {
    id: "#LEE-10824",
    customer: "نورة السلطان",
    country: "🇶🇦",
    countryName: "قطر",
    amount: "AED 430",
    status: "مُسلَّم",
    statusColor: "bg-green-100 text-green-800",
    warehouse: "🏭",
    date: "2024-01-14",
  },
  {
    id: "#LEE-10825",
    customer: "عبدالله الشمري",
    country: "🇧🇭",
    countryName: "البحرين",
    amount: "AED 780",
    status: "قيد المعالجة",
    statusColor: "bg-orange-100 text-orange-800",
    warehouse: "🏭",
    date: "2024-01-13",
  },
  {
    id: "#LEE-10826",
    customer: "مريم الزهراني",
    country: "🇴🇲",
    countryName: "عُمان",
    amount: "AED 310",
    status: "مُسلَّم",
    statusColor: "bg-green-100 text-green-800",
    warehouse: "🏭",
    date: "2024-01-13",
  },
  {
    id: "#LEE-10827",
    customer: "خالد المطيري",
    country: "🇯🇴",
    countryName: "الأردن",
    amount: "AED 560",
    status: "قيد الشحن",
    statusColor: "bg-blue-100 text-blue-800",
    warehouse: "🏭",
    date: "2024-01-12",
  },
  {
    id: "#LEE-10828",
    customer: "سارة العتيبي",
    country: "🇪🇬",
    countryName: "مصر",
    amount: "AED 890",
    status: "في الجمارك",
    statusColor: "bg-purple-100 text-purple-800",
    warehouse: "🏭",
    date: "2024-01-12",
  },
];

const topCountries = [
  { flag: "🇸🇦", name: "المملكة العربية السعودية", orders: 542, percent: 88 },
  { flag: "🇦🇪", name: "الإمارات العربية المتحدة", orders: 398, percent: 65 },
  { flag: "🇰🇼", name: "الكويت", orders: 287, percent: 47 },
  { flag: "🇶🇦", name: "قطر", orders: 201, percent: 33 },
  { flag: "🇧🇭", name: "البحرين", orders: 164, percent: 27 },
];

const lowStockItems = [
  { name: "سماعات بلوتوث لاسلكية", sku: "BT-001", stock: 3, threshold: 10 },
  { name: "حافظة هاتف جلدية", sku: "PH-034", stock: 5, threshold: 15 },
  { name: "شاحن لاسلكي سريع", sku: "CH-012", stock: 2, threshold: 8 },
];

export default function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "countries" | "stock">(
    "orders"
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">منصة LEE</h1>
            <p className="text-xs text-gray-500">لوحة تحكم التاجر</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcomeً، Store الإبداع</span>
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
            م
          </div>
        </div>
      </header>

      <main className="px-8 py-8 max-w-7xl mx-auto">
        {/* Page title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">لوحة المعلومات</h2>
          <p className="text-gray-500 text-sm mt-1">
            آخر تحديث: {new Date().toLocaleDateString("ar-AE")}
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <KPICard
            label="إجمالي المبيعات"
            value="AED 284,500"
            sub="↑ 18% مقارنة بالشهر الماضي"
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
          <KPICard
            label="إجمالي الOrderات"
            value="1,847"
            sub="↑ 124 Order هذا الأسبوع"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <KPICard
            label="دول التوصيل"
            value="43 دولة"
            sub="تغطية عالمية"
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <KPICard
            label="متوسط قيمة الOrder"
            value="AED 154"
            sub="↑ 6% هذا الشهر"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { key: "orders", label: "آخر الOrderات" },
            { key: "countries", label: "أفضل الدول" },
            { key: "stock", label: "تنبيهات المخزون" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key as "orders" | "countries" | "stock")
              }
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.key
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-4 text-right font-semibold text-gray-700">
                    رقم الOrder
                  </th>
                  <th className="px-5 py-4 text-right font-semibold text-gray-700">
                    العميل
                  </th>
                  <th className="px-5 py-4 text-right font-semibold text-gray-700">
                    الدولة
                  </th>
                  <th className="px-5 py-4 text-right font-semibold text-gray-700">
                    المبلغ
                  </th>
                  <th className="px-5 py-4 text-right font-semibold text-gray-700">
                    الحالة
                  </th>
                  <th className="px-5 py-4 text-right font-semibold text-gray-700">
                    المستودع
                  </th>
                  <th className="px-5 py-4 text-right font-semibold text-gray-700">
                    التاريخ
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`border-b border-gray-50 hover:bg-orange-50 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-5 py-4 font-mono text-orange-600 font-semibold">
                      {order.id}
                    </td>
                    <td className="px-5 py-4 text-gray-800 font-medium">
                      {order.customer}
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {order.country} {order.countryName}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {order.amount}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center text-xl">
                      {order.warehouse}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Top Countries */}
        {activeTab === "countries" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">
              أفضل 5 دول من حيث الOrderات
            </h3>
            <div className="space-y-5">
              {topCountries.map((country) => (
                <div key={country.name} className="flex items-center gap-4">
                  <span className="text-2xl w-8">{country.flag}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-800">
                        {country.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {country.orders} Order
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-l from-orange-400 to-orange-600 rounded-full transition-all"
                        style={{ widur: `${country.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Stock Alerts */}
        {activeTab === "stock" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-bold text-gray-900 text-lg">
                تنبيهات انخفاض المخزون
              </h3>
            </div>
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      SKU: {item.sku}
                    </p>
                  </div>
                  <div className="text-left">
                    <span className="text-red-600 font-bold text-lg">
                      {item.stock}
                    </span>
                    <p className="text-xs text-gray-500">
                      / حد التنبيه: {item.aereshold}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
