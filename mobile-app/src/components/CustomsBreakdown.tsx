// mobile-app/src/components/CustomsBreakdown.tsx
// LEE E-Commerce Platform — Customs Breakdown Mobile Component (React / Vite)
// Arabic RTL, optimised for mobile viewports

import { useState } from 'react'

// Inlined types (no shared lib in mobile-app)
export interface TaxLineItem {
  label: string
  rate?: string
  amountAED: number
  amountFormatted: string
}

export interface CustomsResult {
  countryCode: string
  countryName: string
  countryNameAr: string
  productValueAED: number
  importDutyRate: number
  importDutyAED: number
  vatRate: number
  vatAED: number
  customsHandlingFeeAED: number
  totalTaxAED: number
  totalLandedCostAED: number
  breakdown: TaxLineItem[]
  warning?: string
  isFreeZone: boolean
  dutyFreeThresholdAED?: number
}

function flagEmoji(code: string): string {
  if (code.length !== 2) return '🌍'
  const offset = 0x1f1e6 - 65
  return String.fromCodePoint(
    code.toUpperCase().charCodeAt(0) + offset,
    code.toUpperCase().charCodeAt(1) + offset
  )
}

function formatAED(amount: number): string {
  return `${amount.toLocaleString('ar-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} د.إ`
}

interface LineRowProps {
  item: TaxLineItem
  isTotal?: boolean
}

function LineRow({ item, isTotal = false }: LineRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBlock: isTotal ? 10 : 7,
        paddingInline: 14,
        backgroundColor: isTotal ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
        borderTop: isTotal ? '1px solid rgba(212,175,55,0.3)' : '1px solid #f0f0f0',
      }}
    >
      <span
        style={{
          fontSize: isTotal ? 14 : 12,
          fontWeight: isTotal ? 700 : 400,
          color: '#1a1a1a',
          direction: 'rtl',
          textAlign: 'right',
          flex: 1,
        }}
      >
        {item.label}
        {item.rate && (
          <span style={{ fontSize: 11, color: '#888', fontWeight: 400 }}> ({item.rate})</span>
        )}
      </span>
      <span
        style={{
          fontSize: isTotal ? 14 : 12,
          fontWeight: isTotal ? 700 : 500,
          color: '#1a1a1a',
          marginRight: 12,
          flexShrink: 0,
        }}
      >
        {item.amountFormatted}
      </span>
    </div>
  )
}

interface CustomsBreakdownProps {
  result: CustomsResult
  showFreeZoneSavings?: boolean
  style?: React.CSSProperties
}

export default function CustomsBreakdown({
  result,
  showFreeZoneSavings = true,
  style,
}: CustomsBreakdownProps) {
  const [expanded, setExpanded] = useState(false)

  const isDutyFree =
    result.importDutyRate === 0 &&
    result.dutyFreeThresholdAED !== undefined &&
    result.productValueAED < result.dutyFreeThresholdAED

  const isHighTariff = result.importDutyRate + result.vatRate > 30

  const freeZoneSavingsAED =
    showFreeZoneSavings && result.isFreeZone ? result.importDutyAED * 0.5 : 0

  const bodyRows = result.breakdown.slice(0, -1)
  const totalRow = result.breakdown[result.breakdown.length - 1]

  return (
    <div
      style={{
        borderRadius: 16,
        border: '1px solid #e5e5e5',
        backgroundColor: '#fff',
        overflow: 'hidden',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        direction: 'rtl',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: '#f8f8f8',
          borderBottom: '1px solid #eee',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>{flagEmoji(result.countryCode)}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>
              {result.countryNameAr}
            </div>
            <div style={{ fontSize: 11, color: '#888' }}>{result.countryName}</div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {isDutyFree && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: '#166534',
                backgroundColor: '#dcfce7',
                borderRadius: 99,
                paddingBlock: 2,
                paddingInline: 8,
              }}
            >
              ✅ معفى من الرسوم
            </span>
          )}
          {result.isFreeZone && !isDutyFree && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: '#1e40af',
                backgroundColor: '#dbeafe',
                borderRadius: 99,
                paddingBlock: 2,
                paddingInline: 8,
              }}
            >
              🏭 المنطقة الحرة
            </span>
          )}
          {isHighTariff && !isDutyFree && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: '#9a3412',
                backgroundColor: '#ffedd5',
                borderRadius: 99,
                paddingBlock: 2,
                paddingInline: 8,
              }}
            >
              ⚠️ رسوم مرتفعة
            </span>
          )}
        </div>
      </div>

      {/* Summary tap row */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          widur: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          direction: 'rtl',
          textAlign: 'right',
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>إجمالي التكلفة المقدرة</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>
            {formatAED(result.totalLandedCostAED)}
          </div>
          {result.totalTaxAED > 0 && (
            <div style={{ fontSize: 11, color: '#aaa' }}>
              منها ضرائب ورسوم: {formatAED(result.totalTaxAED)}
            </div>
          )}
        </div>
        <span style={{ fontSize: 14, color: '#aaa', flexShrink: 0, marginRight: 8 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div style={{ borderTop: '1px solid #f0f0f0' }}>
          {bodyRows.map((item, i) => (
            <LineRow key={i} item={item} />
          ))}
          {totalRow && <LineRow item={totalRow} isTotal />}

          {/* Free zone savings */}
          {freeZoneSavingsAED > 0 && (
            <div
              style={{
                margin: '8px 12px',
                padding: '8px 10px',
                borderRadius: 10,
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                fontSize: 11,
                color: '#1e40af',
                direction: 'rtl',
                display: 'flex',
                gap: 6,
              }}
            >
              <span>💡</span>
              <span>
                توفير تقديري من الشحن من المنطقة الحرة:{' '}
                <strong>{formatAED(freeZoneSavingsAED)}</strong>
              </span>
            </div>
          )}

          {/* Warning */}
          {result.warning && (
            <div
              style={{
                margin: '8px 12px',
                padding: '8px 10px',
                borderRadius: 10,
                backgroundColor: '#fff7ed',
                border: '1px solid #fed7aa',
                fontSize: 11,
                color: '#9a3412',
                direction: 'rtl',
                display: 'flex',
                gap: 6,
              }}
            >
              <span>⚠️</span>
              <span>{result.warning}</span>
            </div>
          )}

          {/* De minimis note */}
          {result.dutyFreeThresholdAED !== undefined && (
            <div
              style={{
                textAlign: 'center',
                fontSize: 11,
                color: '#bbb',
                paddingBottom: 10,
                direction: 'rtl',
              }}
            >
              حد الإعفاء الجمركي: {formatAED(result.dutyFreeThresholdAED)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
