import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AfterPage } from '../src/pages/AfterPage'

afterEach(() => cleanup())

describe('accessibility cơ bản', () => {
  it('có điều hướng hiện tại, nhãn bộ lọc và cấu trúc bảng rõ ràng', async () => {
    render(<AfterPage />)

    expect(screen.getByRole('link', { name: 'Sau tối ưu' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Trước tối ưu' })).not.toHaveAttribute('aria-current')
    expect(screen.getByLabelText('Tìm sản phẩm')).toBeInTheDocument()
    expect(screen.getByLabelText('Danh mục')).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Danh sách sản phẩm đã ảo hóa' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Sản phẩm' })).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: /^Xem Sản phẩm/ })[0])
    expect(await screen.findByRole('dialog', { name: 'Chi tiết sản phẩm' })).toBeInTheDocument()
  })
})
