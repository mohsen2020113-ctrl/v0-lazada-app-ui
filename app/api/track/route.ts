import { NextRequest, NextResponse } from "next/server";
import { generateMockTracking, TrackingInfo } from "@/lib/tracking";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || id.trim() === "") {
    return NextResponse.json(
      {
        error: "Missing tracking ID",
        errorAr: "معرف التتبع مفقود",
        code: "MISSING_ID",
      },
      { status: 400 }
    );
  }

  if (id.length < 4 || id.length > 40) {
    return NextResponse.json(
      {
        error: "Invalid tracking ID format",
        errorAr: "تنسيق معرف التتبع غير صالح",
        code: "INVALID_ID",
      },
      { status: 422 }
    );
  }

  try {
    const trackingInfo: TrackingInfo = generateMockTracking(id.trim());

    return NextResponse.json(
      {
        success: true,
        data: trackingInfo,
        meta: {
          requestedAt: new Date().toISOString(),
          trackingId: id.trim(),
          source: "LEE Express Tracking System",
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("[LEE Tracking API] Error:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        errorAr: "خطأ داخلي في الخادم",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
