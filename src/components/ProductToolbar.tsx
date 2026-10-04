import { PRODUCT_CATEGORIES } from '../domain/product'

interface ProductToolbarProps {
  search: string
  category: string
  resultCount: number
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

export function ProductToolbar({
  search,
  category,
  resultCount,
  onSearchChange,
  onCategoryChange,
}: ProductToolbarProps) {
  return (
    <section className="toolbar" aria-label="Bộ lọc sản phẩm">
      <label>
        <span>Tìm sản phẩm</span>
        <input
          type="search"
          value={search}
          placeholder="Ví dụ: Sản phẩm 120"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
      <label>
        <span>Danh mục</span>
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="all">Tất cả danh mục</option>
          {PRODUCT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <p className="result-count"><strong>{resultCount.toLocaleString('vi-VN')}</strong> kết quả</p>
    </section>
  )
}
