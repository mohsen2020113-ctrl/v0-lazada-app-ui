"use client";

import { useState, useMemo } from "react";
import {
  dropshipSuppliers,
  dropshipProducts,
  calculateDropshipProfit,
  DropshipProduct,
} from "@/lib/dropshipping";

interface MarginBadgeProps {
  product: DropshipProduct;
}

function MarginBadge({ product }: MarginBadgeProps) {
  const profit = calculateDropshipProfit(product);
  const bg = profit.netMarginPercent >= 50
    ? "bg-green-100 text-green-800"
    : profit.netMarginPercent >= 30
    ? "bg-blue-100 text-blue-800"
    : profit.netMarginPercent >= 20
    ? "bg-yellow-100 text-yellow-800"
    : "bg-red-100 text-red-800";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${bg}`}>
      {profit.netMarginPercent.toFixed(0)}% ربح
    </span>
  );
}

interface ProductCardProps {
  product: DropshipProduct;
  onAdd: (product: DropshipProduct) => void;
}

function ProductCard({ product, onAdd }: ProductCardProps) {
  const profit = calculateDropshipProfit(product);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Image placeholder */}
      <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center">
        <span className="text-5xl select-none">
          {product.categoryAr === "إلكترونيات"
            ? "📱"
            : product.categoryAr === "ملابس"
            ? "👗"
            : product.categoryAr === "حقائب"
            ? "👜"
            : product.categoryAr === "جمال"
            ? "💄"
            : product.categoryAr === "عطور"
            ? "🧴"
            : product.categoryAr === "مفارش المنزل"
            ? "🛏️"
            : product.categoryAr === "هدايا"
            ? "🎁"
            : "📦"}
        </span>
        <div className="absolute top-3 right-3">
          <MarginBadge product={product} />
        </div>
        <div className="absolute top-3 left-3">
          {product.stock < 50 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              مخزون منخفض
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{product.sku}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
          {product.nameAr}
        </h3>
        <p className="text-xs text-gray-500 mb-3">{product.categoryAr}</p>

        {/* Pricing */}
        <div className="flex justify-between text-sm mb-3">
          <div>
            <p className="text-gray-400 text-xs">سعر المورد</p>
            <p className="font-bold text-gray-700">
              {product.supplierPrice} {product.currency}
            </p>
          </div>
          <div className="text-left">
            <p className="text-gray-400 text-xs">سعر البيع المقترح</p>
            <p className="font-bold text-orange-600">
              {product.suggestedRetailPrice} {product.currency}
            </p>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs">
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">صافي الربح</span>
            <span
              className={`font-bold ${
                profit.isViable ? "text-green-600" : "text-red-500"
              }`}
            >
              {profit.netProfit} {product.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">هامش الربح</span>
            <span
              className={`font-bold ${
                profit.isViable ? "text-green-600" : "text-red-500"
              }`}
            >
              {profit.netMarginPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>⭐ {product.rating}</span>
          <span>{product.soldCount.toLocaleString()} مبيعة</span>
          <span>المخزون: {product.stock}</span>
        </div>

        <button
          onClick={() => onAdd(product)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors group-hover:shadow-sm"
        >
          أضف للمتجر
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

  function handleAddProduct(product: DropshipProduct) {
    setAddedProducts((prev) => {
      const next = new Set(prev);
      next.add(product.id);
      return next;
    });
  }

  const activeSupplier =
    activeSupplierId === "all"
      ? null
      : dropshipSuppliers.find((s) => s.id === activeSupplierId);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          كتالوج الدروب شيبينج
        </h1>
        <p className="text-sm text-gray-500">
          {dropshipProducts.length} منتج من {dropshipSuppliers.length} موردين
          معتمدين
        </p>
      </div>

      <div className="px-8 py-6 max-w-7xl mx-auto">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          />
        </div>

        {/* Supplier Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveSupplierId("all")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              activeSupplierId === "all"
                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
            }`}
          >
            🌍 جميع الموردين
          </button>
          {dropshipSuppliers.map((sup) => (
            <button
              key={sup.id}
              onClick={() => setActiveSupplierId(sup.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                activeSupplierId === sup.id
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}
            >
              {sup.countryFlag} {sup.nameAr}
              {sup.verified && (
                <span className="mr-1.5 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Active supplier info */}
        {activeSupplier && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex flex-wrap gap-6 items-center">
            <div className="text-3xl">{activeSupplier.countryFlag}</div>
            <div>
              <h2 className="font-bold text-gray-900">{activeSupplier.nameAr}</h2>
              <p className="text-sm text-gray-500">{activeSupplier.countryNameAr}</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-600 flex-wrap">
              <div>
                <span className="text-gray-400 text-xs block">التقييم</span>
                <span className="font-bold">⭐ {activeSupplier.rating}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">الشحن</span>
                <span className="font-bold">{activeSupplier.shippingDays} أيام</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">المعالجة</span>
                <span className="font-bold">{activeSupplier.processingDays} يوم</span>
              </div>
              {activeSupplier.verified && (
                <div className="flex items-center gap-1 text-green-600">
                  <span className="text-lg">✅</span>
                  <span className="font-semibold text-sm">مورد موثّق</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Added count */}
        {addedProducts.size > 0 && (
          <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 w-fit">
            <span>✅</span>
            <span>تم إضافة {addedProducts.size} منتج إلى متجرك</span>
          </div>
        )}
feat: add RTL dropship catalog web component (components/lee/dropship-catalog.tsx)        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg">لا توجد منتجات تطابق البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAddProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
