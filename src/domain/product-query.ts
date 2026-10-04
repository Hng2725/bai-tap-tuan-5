import { PRODUCT_CATEGORIES, type Product } from './product'

export interface ProductStats {
  total: number
  inStock: number
  lowStock: number
  inventoryValue: number
}

export function filterProducts(products: Product[], search: string, category: string): Product[] {
  const normalizedSearch = search.trim().toLocaleLowerCase('vi')
  const validCategory = PRODUCT_CATEGORIES.includes(category as (typeof PRODUCT_CATEGORIES)[number])

  return products.filter((product) => {
    const matchesSearch = product.name.toLocaleLowerCase('vi').includes(normalizedSearch)
    const matchesCategory = !validCategory || product.category === category
    return matchesSearch && matchesCategory
  })
}

export function calculateStats(products: Product[]): ProductStats {
  return products.reduce<ProductStats>(
    (stats, product) => ({
      total: stats.total + 1,
      inStock: stats.inStock + (product.stock > 0 ? 1 : 0),
      lowStock: stats.lowStock + (product.status === 'low-stock' ? 1 : 0),
      inventoryValue: stats.inventoryValue + product.price * product.stock,
    }),
    { total: 0, inStock: 0, lowStock: 0, inventoryValue: 0 },
  )
}
