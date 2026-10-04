export interface VirtualRangeInput {
  itemCount: number
  itemHeight: number
  viewportHeight: number
  scrollTop: number
  overscan: number
}

export interface VirtualRange {
  startIndex: number
  endIndex: number
  offsetTop: number
  totalHeight: number
}

export function getVirtualRange({
  itemCount,
  itemHeight,
  viewportHeight,
  scrollTop,
  overscan,
}: VirtualRangeInput): VirtualRange {
  if (itemCount <= 0) return { startIndex: 0, endIndex: 0, offsetTop: 0, totalHeight: 0 }

  const totalHeight = itemCount * itemHeight
  const safeScrollTop = Math.min(Math.max(0, scrollTop), Math.max(0, totalHeight - viewportHeight))
  const startIndex = Math.max(0, Math.floor(safeScrollTop / itemHeight) - overscan)
  const endIndex = Math.min(itemCount, Math.ceil((safeScrollTop + viewportHeight) / itemHeight) + overscan)

  return { startIndex, endIndex, offsetTop: startIndex * itemHeight, totalHeight }
}
