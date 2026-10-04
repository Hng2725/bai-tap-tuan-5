const metricKeys = ['performance', 'fcp', 'lcp', 'tbt', 'cls']

export function median(values) {
  if (!Array.isArray(values) || values.length === 0) throw new Error('Không có dữ liệu để tính trung vị')
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

export function extractMetrics(lhr) {
  const score = lhr?.categories?.performance?.score
  const fcp = lhr?.audits?.['first-contentful-paint']?.numericValue
  const lcp = lhr?.audits?.['largest-contentful-paint']?.numericValue
  const tbt = lhr?.audits?.['total-blocking-time']?.numericValue
  const cls = lhr?.audits?.['cumulative-layout-shift']?.numericValue
  if ([score, fcp, lcp, tbt, cls].some((value) => typeof value !== 'number')) throw new Error('Thiếu chỉ số Lighthouse bắt buộc')
  return { performance: Math.round(score * 100), fcp, lcp, tbt, cls }
}

export function summarizeRuns(runs) {
  if (!Array.isArray(runs) || runs.length === 0) throw new Error('Không có dữ liệu Lighthouse')
  return Object.fromEntries(metricKeys.map((key) => [key, median(runs.map((run) => run[key]))]))
}
