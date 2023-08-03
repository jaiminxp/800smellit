import APIRequest from '@/lib/api-request'
import { ServiceFormValues, Service } from '@/types'

class ServiceService extends APIRequest {
  public async search(query?: string) {
    let url = '/services'

    if (query) {
      url += '?' + query
    }

    return this.get<Service[]>(url)
  }

  public async create(service: ServiceFormValues) {
    return this.post<string>('/services', service)
  }
}

export const serviceService = new ServiceService()
