import { useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { ProductDetailsStatic } from '../components/ProductDetailsStatic'
import { ProductTable } from '../components/ProductTable'
import { ProductToolbar } from '../components/ProductToolbar'
import { StatsCards } from '../components/StatsCards'
import { createProducts, PRODUCT_COUNT } from '../domain/product-data'
import { calculateStats, filterProducts } from '../domain/product-query'
import type { Product } from '../domain/product'

const products = createProducts(PRODUCT_COUNT)

export function BeforePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const filteredProducts = filterProducts(products, search, category)
  const stats = calculateStats(filteredProducts)

  return (
    <main className="page-shell">
      <AppHeader mode="before" />
      <div className="page-heading">
        <div><span className="mode-badge before">Chưa tối ưu</span><h2>Danh sách render toàn bộ</h2></div>
        <p>Trang này tạo DOM cho tất cả sản phẩm để làm số liệu trước tối ưu.</p>
      </div>
      <StatsCards stats={stats} />
      <ProductToolbar search={search} category={category} resultCount={filteredProducts.length} onSearchChange={setSearch} onCategoryChange={setCategory} />
      <ProductTable products={filteredProducts} onSelect={setSelectedProduct} />
      {selectedProduct && <ProductDetailsStatic product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </main>
  )
}
