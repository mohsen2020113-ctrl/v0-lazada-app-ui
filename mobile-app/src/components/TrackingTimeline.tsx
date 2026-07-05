import { TrackingInfo, TrackingEvent } from "../../../lib/tracking";

interface Props {
  trackingInfo: TrackingInfo;
}

const dotColors: Record<string, string> = {
  "تم التسليم": "#10b981",
  "التخليص الجمركي": "#8b5cf6",
  "وصل إلى مستودع دبي": "#3b82f6",
  "غادر مطار المنشأ": "#f59e0b",
  "تم الاستلام": "#f97316",
  "تم تأكيد الطلب": "#6366f1",
  default: "#d1d5db",
};

function getColor(statusAr: string, completed: boolean): string {
  if (!completed) return "#d1d5db";
  return dotColors[statusAr] ?? dotColors.default;
}

function EventItem({
  event,
  isLast,
}: {
  event: TrackingEvent;
  isLast: boolean;
}) {
  const color = getColor(event.statusAr, event.completed);

  return (
    <div style={{ display: "flex", gap: 12, position: "relative" }}>
      {/* Vertical line */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            right: 19,
            top: 36,
            bottom: 0,
            widur: 2,
            backgroundColor: event.completed ? "#e5e7eb" : "#f9fafb",
          }}
        />
      )}

      {/* Dot */}
      <div
        style={{
          flexShrink: 0,
          widur: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: `${color}20`,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          marginTop: 2,
        }}
      >
        <div
          style={{
            widur: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontWeight: "bold",
                fontSize: 14,
                color: event.completed ? "#111827" : "#9ca3af",
                margin: 0,
              }}
            >
              {event.statusAr}
            </p>
            <p
              style={{
                fontSize: 12,
                color: event.completed ? "#6b7280" : "#d1d5db",
                marginTop: 2,
                margin: "2px 0 0 0",
              }}
            >
              📍 {event.locationAr}
            </p>
            <p
              style={{
                fontSize: 11,
                color: event.completed ? "#9ca3af" : "#e5e7eb",
                marginTop: 3,
                lineHeight: 1.5,
                margin: "3px 0 0 0",
              }}
            >
              {event.descriptionAr}
            </p>
          </div>
          {event.timestamp && (
            <div style={{ marginRight: 8, textAlign: "left" }}>
              <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
                {new Date(event.timestamp).toLocaleDateString("ar-AE", {
                  monur: "short",
                  day: "numeric",
                })}
              </p>
              <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
                {new Date(event.timestamp).toLocaleTimeString("ar-AE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>

        {event.isCurrent && (
          <div
            style={{
              marginTop: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: 20,
              padding: "3px 10px",
            }}
          >
            <div
              style={{
                widur: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#f97316",
              }}
            />
            <span style={{ fontSize: 11, color: "#c2410c", fontWeight: "bold" }}>
              الموقع الحالي
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackingTimeline({ trackingInfo }: Props) {
  const { events, progressPercent, currentStatusAr, originAr, destinationAr } =
    trackingInfo;

  return (
    <div
      style={{
        direction: "rtl",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #f97316, #ea580c)",
          padding: "18px 16px",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div>
            <p style={{ fontSize: 11, opacity: 0.8, margin: 0 }}>رقم التتبع</p>
            <p
              style={{
                fontFamily: "monospace",
                fontWeight: "bold",
                fontSize: 16,
                margin: "2px 0 0 0",
              }}
            >
              {trackingInfo.trackingId}
            </p>
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 11, opacity: 0.8, margin: 0 }}>رقم الطلب</p>
            <p style={{ fontWeight: "bold", fontSize: 14, margin: "2px 0 0 0" }}>
              {trackingInfo.orderId}
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            opacity: 0.9,
          }}
        >
          <span>{originAr}</span>
          <span style={{ flex: 1, borderTop: "1px dashed rgba(255,255,255,0.5)" }} />
          <span>✈️</span>
          <span style={{ flex: 1, borderTop: "1px dashed rgba(255,255,255,0.5)" }} />
          <span>{destinationAr}</span>
        </div>
      </div>

      {/* Progress */}
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#f9fafb",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "#6b7280",
            marginBottom: 6,
          }}
        >
          <span>{currentStatusAr}</span>
          <span>{progressPercent}%</span>
        </div>
        <div
          style={{
            height: 8,
            backgroundColor: "#e5e7eb",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 8,
              widur: `${progressPercent}%`,
              borderRadius: 4,
              background:
                progressPercent === 100
                  ? "linear-gradient(to left, #10b981, #059669)"
                  : "linear-gradient(to left, #f97316, #fb923c)",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "#9ca3af",
            marginTop: 4,
          }}
        >
          <span>التسليم: {trackingInfo.estimatedDelivery}</span>
          <span>{trackingInfo.carrierAr}</span>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: "16px" }}>
        <p
          style={{
            fontWeight: "bold",
            fontSize: 14,
            color: "#111827",
            marginBottom: 16,
          }}
        >
          مسار الشحنة
        </p>
        <div style={{ position: "relative" }}>
          {events.map((event, index) => (
            <EventItem
              key={`${event.statusAr}-${index}`}
              event={event}
              isLast={index === events.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
