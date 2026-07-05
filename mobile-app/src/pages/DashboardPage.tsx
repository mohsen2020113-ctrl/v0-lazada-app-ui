import { useState } from "react";

interface KPIItem {
  label: string;
  value: string;
  sub: string;
  bg: string;
}

const kpis: KPIItem[] = [
  {
    label: "إجمالي المبيعات",
    value: "AED 284,500",
    sub: "↑ 18% هذا الشهر",
    bg: "#f97316",
  },
  {
    label: "إجمالي الطلبات",
    value: "1,847",
    sub: "↑ 124 هذا الأسبوع",
    bg: "#3b82f6",
  },
  { label: "دول التوصيل", value: "43 دولة", sub: "تغطية عالمية", bg: "#10b981" },
  {
    label: "متوسط الطلب",
    value: "AED 154",
    sub: "↑ 6% هذا الشهر",
    bg: "#8b5cf6",
  },
];

const orders = [
  {
    id: "#LEE-10821",
    customer: "أحمد الفهد",
    flag: "🇸🇦",
    amount: "AED 620",
    status: "مُسلَّم",
    statusBg: "#dcfce7",
    statusColor: "#166534",
  },
  {
    id: "#LEE-10822",
    customer: "فاطمة المرزوقي",
    flag: "🇦🇪",
    amount: "AED 940",
    status: "قيد الشحن",
    statusBg: "#dbeafe",
    statusColor: "#1e40af",
  },
  {
    id: "#LEE-10823",
    customer: "محمد الرشيد",
    flag: "🇰🇼",
    amount: "AED 1200",
    status: "في المستودع",
    statusBg: "#fef9c3",
    statusColor: "#854d0e",
  },
  {
    id: "#LEE-10824",
    customer: "نورة السلطان",
    flag: "🇶🇦",
    amount: "AED 430",
    status: "مُسلَّم",
    statusBg: "#dcfce7",
    statusColor: "#166534",
  },
  {
    id: "#LEE-10825",
    customer: "عبدالله الشمري",
    flag: "🇧🇭",
    amount: "AED 780",
    status: "قيد المعالجة",
    statusBg: "#ffedd5",
    statusColor: "#9a3412",
  },
  {
    id: "#LEE-10826",
    customer: "مريم الزهراني",
    flag: "🇴🇲",
    amount: "AED 310",
    status: "مُسلَّم",
    statusBg: "#dcfce7",
    statusColor: "#166534",
  },
  {
    id: "#LEE-10827",
    customer: "خالد المطيري",
    flag: "🇯🇴",
    amount: "AED 560",
    status: "قيد الشحن",
    statusBg: "#dbeafe",
    statusColor: "#1e40af",
  },
  {
    id: "#LEE-10828",
    customer: "سارة العتيبي",
    flag: "🇪🇬",
    amount: "AED 890",
    status: "في الجمارك",
    statusBg: "#f3e8ff",
    statusColor: "#6b21a8",
  },
];

const topCountries = [
  { flag: "🇸🇦", name: "السعودية", orders: 542, percent: 88 },
  { flag: "🇦🇪", name: "الإمارات", orders: 398, percent: 65 },
  { flag: "🇰🇼", name: "الكويت", orders: 287, percent: 47 },
  { flag: "🇶🇦", name: "قطر", orders: 201, percent: 33 },
  { flag: "🇧🇭", name: "البحرين", orders: 164, percent: 27 },
];

const lowStock = [
  { name: "سماعات بلوتوث", sku: "BT-001", stock: 3 },
  { name: "حافظة هاتف جلدية", sku: "PH-034", stock: 5 },
  { name: "شاحن لاسلكي سريع", sku: "CH-012", stock: 2 },
];

type Tab = "orders" | "countries" | "stock";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("orders");

  return (
    <div
      style={{
        direction: "rtl",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            widur: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: "#f97316",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          L
        </div>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 16, color: "#111827" }}>
            منصة LEE
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>لوحة التاجر</div>
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Page title */}
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{ fontSize: 22, fontWeight: "bold", color: "#111827", margin: 0 }}
          >
            لوحة المعلومات
          </h2>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
            آخر تحديث: {new Date().toLocaleDateString("ar-AE")}
          </p>
        </div>

        {/* KPI Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              style={{
                backgroundColor: kpi.bg,
                borderRadius: 16,
                padding: "14px 16px",
                color: "#fff",
              }}
            >
              <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 4 }}>
                {kpi.label}
              </div>
              <div
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 4 }}
              >
                {kpi.value}
              </div>
              <div style={{ fontSize: 10, opacity: 0.75 }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 0,
          }}
        >
          {(
            [
              { key: "orders", label: "الطلبات" },
              { key: "countries", label: "الدول" },
              { key: "stock", label: "المخزون" },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: "medium",
                borderRadius: "8px 8px 0 0",
                border: "none",
                cursor: "pointer",
                backgroundColor: tab === t.key ? "#f97316" : "transparent",
                color: tab === t.key ? "#fff" : "#6b7280",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {tab === "orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {orders.map((o) => (
              <div
                key={o.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 14,
                  padding: "14px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#f97316",
                      fontWeight: "bold",
                    }}
                  >
                    {o.id}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "3px 10px",
                      borderRadius: 20,
                      backgroundColor: o.statusBg,
                      color: o.statusColor,
                      fontWeight: "bold",
                    }}
                  >
                    {o.status}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#374151" }}>
                    {o.flag} {o.customer}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {o.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Countries */}
        {tab === "countries" && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 18,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 16,
              }}
            >
              أفضل 5 دول
            </h3>
            {topCountries.map((c) => (
              <div
                key={c.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 20 }}>{c.flag}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#374151" }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                      {c.orders} طلب
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      backgroundColor: "#f3f4f6",
                      borderRadius: 4,
                    }}
                  >
                    <div
                      style={{
                        height: 8,
                        widur: `${c.percent}%`,
                        backgroundColor: "#f97316",
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stock */}
        {tab === "stock" && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 18,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 16,
              }}
            >
              ⚠️ تنبيهات المخزون المنخفض
            </h3>
            {lowStock.map((item) => (
              <div
                key={item.sku}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fef2f2",
                  borderRadius: 12,
                  padding: "12px 14px",
                  marginBottom: 10,
                  border: "1px solid #fecaca",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: "bold", color: "#111827" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                    {item.sku}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ fontSize: 20, fontWeight: "bold", color: "#dc2626" }}
                  >
                    {item.stock}
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>قطعة</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
