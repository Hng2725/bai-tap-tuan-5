import { describe, expect, it } from 'vitest'
import { extractMetrics, median, summarizeRuns } from '../scripts/lighthouse-summary.mjs'

const lhr = {
  categories: { performance: { score: 0.87 } },
  audits: {
    'first-contentful-paint': { numericValue: 1234.4 },
    'largest-contentful-paint': { numericValue: 2450.6 },
    'total-blocking-time': { numericValue: 98.7 },
    'cumulative-layout-shift': { numericValue: 0.0123 },
  },
}

describe('lighthouse summary', () => {
  it('tính trung vị mà không thay đổi mảng ban đầu', () => {
    const values = [3, 1, 2]
    expect(median(values)).toBe(2)
    expect(values).toEqual([3, 1, 2])
  })

  it('trích các chỉ số bắt buộc từ Lighthouse result', () => {
    expect(extractMetrics(lhr)).toEqual({ performance: 87, fcp: 1234.4, lcp: 2450.6, tbt: 98.7, cls: 0.0123 })
  })

  it('tính trung vị cho ba lần chạy', () => {
    const run = extractMetrics(lhr)
    expect(summarizeRuns([run, { ...run, performance: 90 }, { ...run, performance: 80 }]).performance).toBe(87)
  })

  it('báo lỗi rõ ràng khi dữ liệu Lighthouse thiếu', () => {
    expect(() => extractMetrics({ categories: {}, audits: {} })).toThrow('Thiếu chỉ số Lighthouse')
    expect(() => median([])).toThrow('Không có dữ liệu')
  })
})
