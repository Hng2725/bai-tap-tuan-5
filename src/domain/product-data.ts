import { PRODUCT_CATEGORIES, type Product, type ProductStatus } from './product'

export const PRODUCT_COUNT = 3000

function getStatus(stock: number): ProductStatus {
  if (stock === 0) return 'out-of-stock'
  if (stock <= 5) return 'low-stock'
  return 'in-stock'
}

export function createProducts(count: number): Product[] {
  return Array.from({ length: Math.max(0, count) }, (_, index) => {
    const number = index + 1
    const stock = index % 31

    return {
      id: `SP-${String(number).padStart(4, '0')}`,
      name: `Sản phẩm ${number}`,
      category: PRODUCT_CATEGORIES[index % PRODUCT_CATEGORIES.length],
      price: 100_000 + (index % 50) * 25_000,
      stock,
      status: getStatus(stock),
    }
  })
}
