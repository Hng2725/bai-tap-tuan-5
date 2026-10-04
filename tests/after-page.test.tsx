import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AfterPage } from '../src/pages/AfterPage'

afterEach(() => cleanup())

describe('AfterPage', () => {
  it('chỉ render một phần nhỏ trong 3.000 sản phẩm', () => {
    render(<AfterPage />)
    expect(screen.getByText('Đã tối ưu')).toBeInTheDocument()
    expect(screen.getByTestId('stat-total')).toHaveTextContent('3.000')
    const renderedRows = screen.getAllByTestId('product-row').length
    expect(renderedRows).toBeGreaterThan(0)
    expect(renderedRows).toBeLessThan(30)
  })

  it('giữ nguyên tìm kiếm, trạng thái rỗng và chi tiết sản phẩm', async () => {
    render(<AfterPage />)
    const search = screen.getByLabelText('Tìm sản phẩm')

    fireEvent.change(search, { target: { value: 'Sản phẩm 2999' } })
    expect(screen.getAllByTestId('product-row')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Xem Sản phẩm 2999' }))
    expect(await screen.findByRole('dialog', { name: 'Chi tiết sản phẩm' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Đóng' }))
    fireEvent.change(search, { target: { value: 'không tồn tại' } })
    expect(screen.getByText('Không tìm thấy sản phẩm phù hợp.')).toBeInTheDocument()
  })
})
