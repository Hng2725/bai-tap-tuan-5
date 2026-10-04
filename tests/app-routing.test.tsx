import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from '../src/App'

afterEach(() => cleanup())

describe('App routing', () => {
  it('hiển thị trang chưa tối ưu tại /before', () => {
    window.history.replaceState({}, '', '/before')
    render(<App />)
    expect(screen.getByText('Chưa tối ưu')).toBeInTheDocument()
  })

  it('đưa đường dẫn không hợp lệ về /before', () => {
    window.history.replaceState({}, '', '/duong-dan-la')
    render(<App />)
    expect(window.location.pathname).toBe('/before')
    expect(screen.getByText('Chưa tối ưu')).toBeInTheDocument()
  })
})
