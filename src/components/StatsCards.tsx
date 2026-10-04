import type { ProductStats } from '../domain/product-query'

interface StatsCardsProps {
  stats: ProductStats
}

const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <section className="stats-grid" aria-label="Thống kê sản phẩm">
      <article className="stat-card"><span>Tổng sản phẩm</span><strong data-testid="stat-total">{stats.total.toLocaleString('vi-VN')}</strong></article>
      <article className="stat-card"><span>Còn hàng</span><strong>{stats.inStock.toLocaleString('vi-VN')}</strong></article>
      <article className="stat-card"><span>Sắp hết</span><strong>{stats.lowStock.toLocaleString('vi-VN')}</strong></article>
      <article className="stat-card wide-value"><span>Giá trị kho</span><strong>{currency.format(stats.inventoryValue)}</strong></article>
    </section>
  )
}
