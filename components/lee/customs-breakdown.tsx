// components/lee/customs-breakdown.tsx
// LEE E-Commerce Platform — Customs Breakdown Web Component (Next.js / React)
// Arabic RTL, expandable, with duty-free badge and high-tariff warning

'use client'

import { useState } from 'react'
import type { CustomsResult, TaxLineItem } from '@/lib/customs-calculator'

// Country code → emoji flag
function flagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase()
  if (code.length !== 2) return '🌍'
  const offset = 0x1f1e6 - 65
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset)
}

function formatAED(amount: number): string {
  return new Intl.NumberFormat('ar-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
  }).format(amount)
}

interface CustomsBreakdownProps {
  result: CustomsResult
  /** Show comparison with non-free-zone cost */
  showFreeZoneSavings?: boolean
  /** Called when user clicks the breakdown toggle */
  onToggle?: (expanded: boolean) => void
  className?: string
}

function LineRow({ item, isTotal }: { item: TaxLineItem; isTotal: boolean }) {
  return (
    <tr
      className={`border-b border-gray-100 last:border-0 ${
        isTotal ? 'bg-lee-gold/10 font-bold text-base' : 'text-sm'
      }`}
    >
      <td className="py-2 px-3 text-right text-gray-800" dir="rtl">
        {item.label}
        {item.rate && (
          <span className="mr-1 text-xs text-gray-500 font-normal">({item.rate})</span>
        )}
      </td>
      <td className="py-2 px-3 text-left text-gray-900 tabular-nums whitespace-nowrap">
        {item.amountFormatted}
      </td>
    </tr>
  )
}

export default function CustomsBreakdown({
  result,
  showFreeZoneSavings = true,
  onToggle,
  className = '',
}: CustomsBreakdownProps) {
  const [expanded, setExpanded] = useState(false)

  const toggle = () => {
    const next = !expanded
    setExpanded(next)
    onToggle?.(next)
  }

  const isDutyFree =
    result.importDutyRate === 0 &&
    result.dutyFreeThresholdAED !== undefined &&
    result.productValueAED < result.dutyFreeThresholdAED

  const isHighTariff = result.importDutyRate + result.vatRate > 30

  // Estimate non-free-zone savings (notional: if duty were doubled)
  const freeZoneSavingsAED =
    showFreeZoneSavings && result.isFreeZone ? result.importDutyAED * 0.5 : 0

  // Split breakdown: body rows (all except last) and total (last row)
  const bodyRows = result.breakdown.slice(0, -1)
  const totalRow = result.breakdown[result.breakdown.length - 1]

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden ${className}`}
      dir="rtl"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none" aria-hidden="true">
            {flagEmoji(result.countryCode)}
          </span>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">
              {result.countryNameAr}
            </p>
            <p className="text-xs text-gray-400 leading-tight">{result.countryName}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-1">
          {isDutyFree && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5">
              ✅ شحن معفى من الرسوم
            </span>
          )}
          {result.isFreeZone && !isDutyFree && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5">
              🏭 المنطقة الحرة — دبي
            </span>
          )}
          {isHighTariff && !isDutyFree && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5">
              ⚠️ رسوم جمركية مرتفعة
            </span>
          )}
        </div>
      </div>

      {/* ── Summary bar ── */}
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-right"
        aria-expanded={expanded}
        aria-controls="customs-breakdown-table"
      >
        <div dir="rtl">
          <p className="text-xs text-gray-500 mb-0.5">Estimated Total Cost</p>
          <p className="text-lg font-bold text-gray-900">
            {formatAED(result.totalLandedCostAED)}
          </p>
          {result.totalTaxAED > 0 && (
            <p className="text-xs text-gray-400">
              منها ضرائب ورسوم: {formatAED(result.totalTaxAED)}
            </p>
          )}
        </div>
        <span className="text-gray-400 text-lg select-none" aria-hidden="true">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {/* ── Expanded breakdown ── */}
      {expanded && (
        <div id="customs-breakdown-table" className="border-t border-gray-100">
          <table className="w-full" dir="rtl">
            <tbody>
              {bodyRows.map((item, i) => (
                <LineRow key={i} item={item} isTotal={false} />
              ))}
              {totalRow && <LineRow item={totalRow} isTotal />}
            </tbody>
          </table>

          {/* Free Zone Savings callout */}
          {freeZoneSavingsAED > 0 && (
            <div className="mx-3 mb-3 mt-1 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-xs text-blue-800 flex items-start gap-2">
              <span className="text-base leading-none mt-0.5">💡</span>
              <span dir="rtl">
                توفير تقديري من الشحن من المنطقة الحرة بدبي:{' '}
                <strong>{formatAED(freeZoneSavingsAED)}</strong>
              </span>
            </div>
          )}

          {/* Warning */}
          {result.warning && (
            <div className="mx-3 mb-3 mt-1 rounded-lg bg-orange-50 border border-orange-200 px-3 py-2 text-xs text-orange-900 flex items-start gap-2">
              <span className="text-base leading-none mt-0.5">⚠️</span>
              <span dir="rtl">{result.warning}</span>
            </div>
          )}

          {/* De minimis note */}
          {result.dutyFreeThresholdAED !== undefined && (
            <p className="text-center text-xs text-gray-400 pb-3 px-3" dir="rtl">
              حد الإعفاء الجمركي: {formatAED(result.dutyFreeThresholdAED)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
