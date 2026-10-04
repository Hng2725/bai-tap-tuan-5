import { useEffect, useMemo, useRef, useState } from 'react'
import type { Product } from '../domain/product'
import { getVirtualRange } from '../domain/virtual-range'
import { ProductRow } from './ProductRow'

interface Props { products: Product[]; onSelect: (product: Product) => void }
const ITEM_HEIGHT = 62
const VIEWPORT_HEIGHT = 560

export function VirtualProductTable({ products, onSelect }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const range = useMemo(() => getVirtualRange({ itemCount: products.length, itemHeight: ITEM_HEIGHT, viewportHeight: VIEWPORT_HEIGHT, scrollTop, overscan: 3 }), [products.length, scrollTop])

  useEffect(() => { setScrollTop(0); if (viewportRef.current) viewportRef.current.scrollTop = 0 }, [products])
  if (products.length === 0) return <div className="empty-state">Không tìm thấy sản phẩm phù hợp.</div>

  return (
    <div className="virtual-table" role="table" aria-label="Danh sách sản phẩm đã ảo hóa">
      <div className="product-grid virtual-header" role="row">
        {['Mã', 'Sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Trạng thái', ''].map((label, index) => <span role="columnheader" key={`${label}-${index}`}>{label}</span>)}
      </div>
      <div className="virtual-scroll" ref={viewportRef} onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}>
        <div className="virtual-spacer" style={{ height: range.totalHeight }}>
          <div className="virtual-items" style={{ transform: `translateY(${range.offsetTop}px)` }}>
            {products.slice(range.startIndex, range.endIndex).map((product) => <ProductRow key={product.id} product={product} onSelect={onSelect} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
