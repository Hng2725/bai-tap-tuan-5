import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { ProductToolbar } from '../components/ProductToolbar'
import { StatsCards } from '../components/StatsCards'
import { VirtualProductTable } from '../components/VirtualProductTable'
import type { Product } from '../domain/product'
import { createProducts, PRODUCT_COUNT } from '../domain/product-data'
import { calculateStats, filterProducts } from '../domain/product-query'

const ProductDetailsLazy = lazy(() => import('../components/ProductDetailsLazy'))
const products = createProducts(PRODUCT_COUNT)

export function AfterPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const filteredProducts = useMemo(() => filterProducts(products, search, category), [search, category])
  const stats = useMemo(() => calculateStats(filteredProducts), [filteredProducts])
  const handleSelect = useCallback((product: Product) => setSelectedProduct(product), [])
  const handleClose = useCallback(() => setSelectedProduct(null), [])

  return (
    <main className="page-shell">
      <AppHeader mode="after" />
      <div className="page-heading"><div><span className="mode-badge after">Đã tối ưu</span><h2>Danh sách ảo hóa</h2></div><p>Chỉ những hàng đang nhìn thấy mới được tạo trong DOM.</p></div>
      <StatsCards stats={stats} />
      <ProductToolbar search={search} category={category} resultCount={filteredProducts.length} onSearchChange={setSearch} onCategoryChange={setCategory} />
      <VirtualProductTable products={filteredProducts} onSelect={handleSelect} />
      {selectedProduct && <Suspense fallback={<div className="loading-dialog" role="status">Đang tải chi tiết...</div>}><ProductDetailsLazy product={selectedProduct} onClose={handleClose} /></Suspense>}
    </main>
  )
}
