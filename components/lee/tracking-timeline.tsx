"use client";

import { TrackingInfo, TrackingEvent } from "@/lib/tracking";

interface TrackingTimelineProps {
  trackingInfo: TrackingInfo;
}

const statusColors: Record<string, string> = {
  "تم التسليم": "#10b981",
  "التخليص الجمركي": "#8b5cf6",
  "وصل إلى مستودع دبي": "#3b82f6",
  "غادر مطار المنشأ": "#f59e0b",
  "تم الاستلام": "#f97316",
  "تم تأكيد الطلب": "#6366f1",
  default: "#9ca3af",
};

function getStatusColor(statusAr: string): string {
  return statusColors[statusAr] ?? statusColors.default;
}

function EventRow({ event, isLast }: { event: TrackingEvent; isLast: boolean }) {
  const color = event.completed ? getStatusColor(event.statusAr) : "#d1d5db";
  const isActive = event.isCurrent;

  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <div
          className="absolute right-5 top-10 bottom-0 w-0.5"
          style={{ backgroundColor: event.completed ? "#e5e7eb" : "#f3f4f6" }}
        />
      )}
      <div className="relative z-10 flex-shrink-0 mt-1">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isActive ? "ring-4 ring-orange-100" : ""
          }`}
          style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        </div>
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-semibold text-base" style={{ color: event.completed ? "#111827" : "#9ca3af" }}>
              {event.statusAr}
            </p>
            <p className="text-sm mt-0.5" style={{ color: event.completed ? "#374151" : "#d1d5db" }}>
              📍 {event.locationAr}
            </p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: event.completed ? "#6b7280" : "#e5e7eb" }}>
              {event.descriptionAr}
            </p>
          </div>
          {event.timestamp && (
            <div className="text-left shrink-0">
              <p className="text-xs text-gray-400">
                {new Date(event.timestamp).toLocaleDateString("ar-AE", { monur: "short", day: "numeric" })}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(event.timestamp).toLocaleTimeString("ar-AE", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          )}
        </div>
        {isActive && (
          <div className="mt-2 inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs text-orange-700 font-medium">الموقع الحالي</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackingTimeline({ trackingInfo }: TrackingTimelineProps) {
  const { progressPercent, events, currentStatusAr, originAr, destinationAr } = trackingInfo;
  return (
    <div dir="rtl" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-l from-orange-500 to-orange-600 px-6 py-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm opacity-80">رقم التتبع</p>
            <p className="font-mono font-bold text-lg tracking-wide">{trackingInfo.trackingId}</p>
          </div>
          <div className="text-left">
            <p className="text-sm opacity-80">رقم الطلب</p>
            <p className="font-semibold">{trackingInfo.orderId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <span>{originAr}</span>
          <span className="flex-1 border-t border-white/40 border-dashed" />
          <span>✈️</span>
          <span className="flex-1 border-t border-white/40 border-dashed" />
          <span>{destinationAr}</span>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>{currentStatusAr}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              widur: `${progressPercent}%`,
              background: progressPercent === 100
                ? "linear-gradient(to left, #10b981, #059669)"
                : "linear-gradient(to left, #f97316, #fb923c)",
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>التسليم المتوقع: {trackingInfo.estimatedDelivery}</span>
          <span>{trackingInfo.carrierAr}</span>
        </div>
      </div>
      <div className="px-6 py-6">
        <h3 className="font-bold text-gray-900 mb-6 text-base">مسار الشحنة</h3>
        <div className="relative">
          {events.map((event, index) => (
            <EventRow key={`${event.statusAr}-${index}`} event={event} isLast={index === events.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
