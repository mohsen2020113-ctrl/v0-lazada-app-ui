import { NextRequest, NextResponse } from "next/server";
import {
  dropshipSuppliers,
  dropshipProducts,
  DropshipSupplier,
  DropshipProduct,
} from "@/lib/dropshipping";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplier");
  const category = searchParams.get("category");
  const search = searchParams.get("q");

  // Return all suppliers if no supplierId provided
  if (!supplierId) {
    const suppliersWithStats: (DropshipSupplier & {
      productCount: number;
    })[] = dropshipSuppliers.map((sup) => ({
      ...sup,
      productCount: dropshipProducts.filter((p) => p.supplierId === sup.id)
        .length,
    }));

    return NextResponse.json(
      {
        success: true,
        data: suppliersWithStats,
        total: suppliersWithStats.length,
        meta: {
          requestedAt: new Date().toISOString(),
          type: "suppliers",
        },
      },
      { status: 200 }
    );
  }

  // Validate supplier exists
  const supplier = dropshipSuppliers.find((s) => s.id === supplierId);
  if (!supplier) {
    return NextResponse.json(
      {
        error: "Supplier not found",
        errorAr: "المورد غير موجود",
        code: "SUPPLIER_NOT_FOUND",
        supplierId,
      },
      { status: 404 }
    );
  }

  // Filter products by supplier
  let products: DropshipProduct[] = dropshipProducts.filter(
    (p) => p.supplierId === supplierId
  );

  // Optional: filter by category
  if (category) {
    products = products.filter(
      (p) =>
        p.category.toLowerCase() === category.toLowerCase() ||
        p.categoryAr === category
    );
  }

  // Optional: search by name
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameAr.includes(search) ||
        p.sku.toLowerCase().includes(q)
);
  }
  return NextResponse.json(
    {
      success: true,
      supplier,
      data: products,
      total: products.length,
      filters: {
        supplierId,
        category: category ?? null,
        search: search ?? null,
      },
      meta: {
        requestedAt: new Date().toISOString(),
        type: "products",
      },
    },
    { status: 200 }
  );
}
