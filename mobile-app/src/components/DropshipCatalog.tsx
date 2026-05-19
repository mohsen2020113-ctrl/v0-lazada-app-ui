import { useState, useMemo } from "react";
import {
  dropshipSuppliers,
  dropshipProducts,
  calculateDropshipProfit,
  DropshipProduct,
} from "../../../lib/dropshipping";

function getProductEmoji(categoryAr: string): string {
  const map: Record<string, string> = {
    "إلكترونيات": "📱",
    "أجهزة ذكية": "⌚",
    "ملابس": "👗",
    "حقائب": "👜",
    "جمال": "💄",
    "عطور": "🧴",
    "مفارش المنزل": "🛏️",
    "هدايا": "🎁",
  };
  return map[categoryAr] ?? "📦";
}

interface ProductCardProps {
  product: DropshipProduct;
  onAdd: (product: DropshipProduct) => void;
  added: boolean;
}

function ProductCard({ product, onAdd, added }: ProductCardProps) {
  const profit = calculateDropshipProfit(product);
  const marginColor =
    profit.netMarginPercent >= 50
      ? "#166534"
      : profit.netMarginPercent >= 30
      ? "#1e40af"
      : profit.netMarginPercent >= 20
      ? "#854d0e"
      : "#991b1b";

  const marginBg =
    profit.netMarginPercent >= 50
      ? "#dcfce7"
      : profit.netMarginPercent >= 30
      ? "#dbeafe"
      : profit.netMarginPercent >= 20
      ? "#fef9c3"
      : "#fee2e2";

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        marginBottom: 14,
      }}
    >
      {/* Image area */}
      <div
        style={{
          height: 120,
          background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <span style={{ fontSize: 44 }}>
          {getProductEmoji(product.categoryAr)}
        </span>
        {/* Margin badge */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: marginBg,
            color: marginColor,
            fontSize: 11,
            fontWeight: "bold",
            padding: "3px 8px",
            borderRadius: 20,
          }}
        >
          {profit.netMarginPercent.toFixed(0)}% ربح
        </div>
        {/* Low stock badge */}
        {product.stock < 50 && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "#ef4444",
              color: "#fff",
              fontSize: 10,
              fontWeight: "bold",
              padding: "3px 8px",
              borderRadius: 20,
            }}
          >
            مخزون منخفض
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px" }}>
        <p
          style={{
            fontSize: 10,
            color: "#9ca3af",
            margin: "0 0 2px 0",
          }}
        >
          {product.sku}
        </p>
        <h3
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#111827",
            margin: "0 0 2px 0",
            lineHeight: 1.4,
          }}
        >
          {product.nameAr}
        </h3>
        <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 10px 0" }}>
          {product.categoryAr}
        </p>

        {/* Pricing row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
              سعر المورد
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: "#374151",
                margin: 0,
              }}
            >
              {product.supplierPrice} {product.currency}
            </p>
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
              سعر البيع
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: "#f97316",
                margin: 0,
              }}
            >
              {product.suggestedRetailPrice} {product.currency}
            </p>
          </div>
        </div>

        {/* Profit info */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: 10,
            padding: "8px 10px",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 11, color: "#9ca3af" }}>صافي الربح</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: profit.isViable ? "#16a34a" : "#dc2626",
              }}
            >
              {profit.netProfit} {product.currency}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>هامش الربح</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: profit.isViable ? "#16a34a" : "#dc2626",
              }}
            >
              {profit.netMarginPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "#9ca3af",
            marginBottom: 12,
          }}
        >
          <span>⭐ {product.rating}</span>
          <span>{product.soldCount.toLocaleString()} مبيعة</span>
          <span>مخزون: {product.stock}</span>
        </div>

        {/* Add button */}
        <button
          onClick={() => onAdd(product)}
          style={{
            width: "100%",
            backgroundColor: added ? "#10b981" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "11px 0",
            fontSize: 14,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          {added ? "✓ تمت الإضافة" : "أضف للمتجر"}
        </button>
      </div>
    </div>
  );
}

export default function DropshipCatalog() {
  const [activeSupplierId, setActiveSupplierId] = useState<string>("all");
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    let products =
      activeSupplierId === "all"
        ? dropshipProducts
        : dropshipProducts.filter((p) => p.supplierId === activeSupplierId);

    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.nameAr.includes(search) ||
          p.name.toLowerCase().includes(q) ||
          p.categoryAr.includes(search)
      );
    }

    return products;
  }, [activeSupplierId, search]);

  function handleAdd(product: DropshipProduct) {
    setAddedProducts((prev) => {
      const next = new Set(prev);
      next.add(product.id);
      return next;
    });
  }

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
          borderBottom: "1px solid #e5e7eb",
          padding: "16px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h1
          style={{ fontSize: 18, fontWeight: "bold", color: "#111827", margin: 0 }}
        >
          كتالوج الدروب شيبينج
        </h1>
        <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0 0" }}>
          {dropshipProducts.length} منتج · {dropshipSuppliers.length} موردين
        </p>
      </div>

      <div style={{ padding: "14px" }}>
        {/* Search */}
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            fontSize: 14,
            marginBottom: 14,
            backgroundColor: "#fff",
            outline: "none",
          }}
        />

        {/* Supplier Tabs — horizontal scroll */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
            marginBottom: 16,
            scrollbarWidth: "none",
          }}
        >
          <button
            onClick={() => setActiveSupplierId("all")}
            style={{
              flexShrink: 0,
              padding: "7px 14px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: activeSupplierId === "all" ? "#f97316" : "#e5e7eb",
              backgroundColor:
                activeSupplierId === "all" ? "#f97316" : "#fff",
              color: activeSupplierId === "all" ? "#fff" : "#6b7280",
              fontSize: 12,
              fontWeight: "bold",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🌍 الكل
          </button>
          {dropshipSuppliers.map((sup) => (
            <button
              key={sup.id}
              onClick={() => setActiveSupplierId(sup.id)}
              style={{
                flexShrink: 0,
                padding: "7px 14px",
                borderRadius: 20,
                border: "1px solid",
                borderColor:
                  activeSupplierId === sup.id ? "#f97316" : "#e5e7eb",
                backgroundColor:
                  activeSupplierId === sup.id ? "#f97316" : "#fff",
                color: activeSupplierId === sup.id ? "#fff" : "#6b7280",
                fontSize: 12,
                fontWeight: "bold",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {sup.countryFlag} {sup.nameAr.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Added banner */}
        {addedProducts.size > 0 && (
          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 13,
              color: "#166534",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>✅</span>
            <span>تم إضافة {addedProducts.size} منتج إلى متجرك</span>
          </div>
        )}

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
            <p style={{ fontSize: 40 }}>🔍</p>
            <p style={{ fontSize: 15 }}>لا توجد منتجات</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={handleAdd}
              added={addedProducts.has(product.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
