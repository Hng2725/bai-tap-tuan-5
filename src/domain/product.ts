export const PRODUCT_CATEGORIES = ['Điện tử', 'Thời trang', 'Gia dụng', 'Sách'] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]
export type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number
  stock: number
  status: ProductStatus
}
