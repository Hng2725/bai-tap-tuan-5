import { memo } from 'react'
import type { Product, ProductStatus } from '../domain/product'

interface ProductRowProps { product: Product; onSelect: (product: Product) => void }
const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
const labels: Record<ProductStatus, string> = { 'in-stock': 'Còn hàng', 'low-stock': 'Sắp hết', 'out-of-stock': 'Hết hàng' }

export const ProductRow = memo(function ProductRow({ product, onSelect }: ProductRowProps) {
  return (
    <div className="product-grid product-row" role="row" data-testid="product-row">
      <span className="code" role="cell">{product.id}</span><strong role="cell">{product.name}</strong>
      <span role="cell">{product.category}</span><span role="cell">{currency.format(product.price)}</span>
      <span role="cell">{product.stock}</span><span role="cell"><span className={`status ${product.status}`}>{labels[product.status]}</span></span>
      <span role="cell"><button className="text-button" type="button" onClick={() => onSelect(product)} aria-label={`Xem ${product.name}`}>Xem</button></span>
    </div>
  )
})
