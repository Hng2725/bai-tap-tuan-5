interface AppHeaderProps { mode: 'before' | 'after' }

export function AppHeader({ mode }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Bài tập tối ưu hiệu năng ReactJS</p>
        <h1>Quản lý 3.000 sản phẩm</h1>
        <p className="subtitle">So sánh trực tiếp phiên bản trước và sau tối ưu</p>
      </div>
      <nav className="mode-nav" aria-label="Chọn phiên bản">
        <a className={mode === 'before' ? 'active' : ''} href="/before" aria-current={mode === 'before' ? 'page' : undefined}>Trước tối ưu</a>
        <a className={mode === 'after' ? 'active' : ''} href="/after" aria-current={mode === 'after' ? 'page' : undefined}>Sau tối ưu</a>
      </nav>
    </header>
  )
}
