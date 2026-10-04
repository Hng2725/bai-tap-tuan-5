import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { BeforePage } from '../src/pages/BeforePage'

afterEach(() => cleanup())

describe('BeforePage', () => {
  it('render toàn bộ 3.000 sản phẩm', () => {
    render(<BeforePage />)
    expect(screen.getByTestId('stat-total')).toHaveTextContent('3.000')
    expect(screen.getAllByTestId('product-row')).toHaveLength(3000)
  })

  it('tìm kiếm, lọc rỗng và mở chi tiết sản phẩm', () => {
    render(<BeforePage />)
    const search = screen.getByLabelText('Tìm sản phẩm')

    fireEvent.change(search, { target: { value: 'Sản phẩm 2999' } })
    expect(screen.getAllByTestId('product-row')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Xem Sản phẩm 2999' }))
    expect(screen.getByRole('dialog', { name: 'Chi tiết sản phẩm' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Đóng' }))

    fireEvent.change(search, { target: { value: 'không tồn tại' } })
    expect(screen.getByText('Không tìm thấy sản phẩm phù hợp.')).toBeInTheDocument()
  })
})
