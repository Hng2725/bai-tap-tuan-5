import type { Product } from '../domain/product'

interface Props { product: Product; onClose: () => void }

export default function ProductDetailsLazy({ product, onClose }: Props) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-label="Chi tiết sản phẩm" aria-modal="true">
        <p className="eyebrow">Tải động · {product.id}</p><h2>{product.name}</h2>
        <dl><div><dt>Danh mục</dt><dd>{product.category}</dd></div><div><dt>Tồn kho</dt><dd>{product.stock} sản phẩm</dd></div></dl>
        <button type="button" onClick={onClose}>Đóng</button>
      </section>
    </div>
  )
}
