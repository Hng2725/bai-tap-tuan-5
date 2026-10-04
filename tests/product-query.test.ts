import { describe, expect, it } from 'vitest'
import type { Product } from '../src/domain/product'
import { calculateStats, filterProducts } from '../src/domain/product-query'

const products: Product[] = [
  { id: 'SP-0001', name: 'Áo sơ mi', category: 'Thời trang', price: 200_000, stock: 10, status: 'in-stock' },
  { id: 'SP-0002', name: 'Nồi cơm điện', category: 'Gia dụng', price: 800_000, stock: 3, status: 'low-stock' },
  { id: 'SP-0003', name: 'Sách React', category: 'Sách', price: 150_000, stock: 0, status: 'out-of-stock' },
]

describe('filterProducts', () => {
  it('tìm kiếm không phân biệt hoa thường và bỏ khoảng trắng', () => {
    expect(filterProducts(products, '  ÁO SƠ  ', 'all').map((product) => product.id)).toEqual(['SP-0001'])
  })

  it('từ khóa trống và danh mục lạ được xem như chọn tất cả', () => {
    expect(filterProducts(products, '   ', 'không-tồn-tại')).toEqual(products)
  })

  it('kết hợp từ khóa và danh mục', () => {
    expect(filterProducts(products, 'điện', 'Gia dụng').map((product) => product.id)).toEqual(['SP-0002'])
    expect(filterProducts(products, 'điện', 'Sách')).toEqual([])
  })

  it('không thay đổi mảng đầu vào', () => {
    const snapshot = structuredClone(products)
    filterProducts(products, 'sách', 'all')
    expect(products).toEqual(snapshot)
  })
})

describe('calculateStats', () => {
  it('tính số lượng và tổng giá trị kho', () => {
    expect(calculateStats(products)).toEqual({
      total: 3,
      inStock: 2,
      lowStock: 1,
      inventoryValue: 4_400_000,
    })
  })

  it('trả về số 0 với danh sách rỗng', () => {
    expect(calculateStats([])).toEqual({ total: 0, inStock: 0, lowStock: 0, inventoryValue: 0 })
  })
})
