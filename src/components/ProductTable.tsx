import type { Product, ProductStatus } from '../domain/product'

interface ProductTableProps {
  products: Product[]
  onSelect: (product: Product) => void
}

const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
const statusLabels: Record<ProductStatus, string> = {
  'in-stock': 'Còn hàng',
  'low-stock': 'Sắp hết',
  'out-of-stock': 'Hết hàng',
}

export function ProductTable({ products, onSelect }: ProductTableProps) {
  if (products.length === 0) return <div className="empty-state">Không tìm thấy sản phẩm phù hợp.</div>

  return (
    <div className="table-scroll before-table">
      <table>
        <thead><tr><th>Mã</th><th>Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} data-testid="product-row">
              <td className="code">{product.id}</td>
              <td><strong>{product.name}</strong></td>
              <td>{product.category}</td>
              <td>{currency.format(product.price)}</td>
              <td>{product.stock}</td>
              <td><span className={`status ${product.status}`}>{statusLabels[product.status]}</span></td>
              <td><button className="text-button" type="button" onClick={() => onSelect(product)} aria-label={`Xem ${product.name}`}>Xem</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
