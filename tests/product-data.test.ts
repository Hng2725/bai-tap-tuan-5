import { describe, expect, it } from 'vitest'
import { createProducts, PRODUCT_COUNT } from '../src/domain/product-data'

describe('createProducts', () => {
  it('tạo đúng 3.000 sản phẩm có dữ liệu ổn định và hợp lệ', () => {
    const products = createProducts(PRODUCT_COUNT)

    expect(products).toHaveLength(3000)
    expect(new Set(products.map((product) => product.id)).size).toBe(3000)
    expect(products[0]).toMatchObject({ id: 'SP-0001', name: 'Sản phẩm 1' })
    expect(products[2999]).toMatchObject({ id: 'SP-3000', name: 'Sản phẩm 3000' })
    expect(products.every((product) => product.price >= 0 && product.stock >= 0)).toBe(true)
  })
})
