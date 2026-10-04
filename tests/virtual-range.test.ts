import { describe, expect, it } from 'vitest'
import { getVirtualRange } from '../src/domain/virtual-range'

const base = { itemCount: 3000, itemHeight: 62, viewportHeight: 560, overscan: 3 }

describe('getVirtualRange', () => {
  it('giới hạn phạm vi ở đầu danh sách', () => {
    const range = getVirtualRange({ ...base, scrollTop: 0 })
    expect(range.startIndex).toBe(0)
    expect(range.endIndex).toBeLessThan(20)
    expect(range.offsetTop).toBe(0)
    expect(range.totalHeight).toBe(186000)
  })

  it('tính đúng offset khi cuộn giữa danh sách', () => {
    const range = getVirtualRange({ ...base, scrollTop: 620 })
    expect(range.startIndex).toBe(7)
    expect(range.offsetTop).toBe(range.startIndex * 62)
    expect(range.endIndex).toBeGreaterThan(range.startIndex)
  })

  it('không vượt quá cuối danh sách dù scrollTop quá lớn', () => {
    const range = getVirtualRange({ ...base, scrollTop: Number.MAX_SAFE_INTEGER })
    expect(range.startIndex).toBeGreaterThanOrEqual(0)
    expect(range.endIndex).toBe(3000)
    expect(range.startIndex).toBeLessThan(range.endIndex)
  })

  it('trả phạm vi rỗng cho danh sách rỗng', () => {
    expect(getVirtualRange({ ...base, itemCount: 0, scrollTop: 100 })).toEqual({
      startIndex: 0,
      endIndex: 0,
      offsetTop: 0,
      totalHeight: 0,
    })
  })
})
