import APIRequest from '@/lib/api-request'
import { ProductFormValues } from '@/types'

class ProductService extends APIRequest {
  public async search(query?: string) {
    let url = '/products'

    if (query) {
      url += '?' + query
    }

    return this.get<Product[]>(url)
  }

  public async create(product: ProductFormValues) {
    return this.post<string>('/products', product)
  }
}

export const productService = new ProductService()
