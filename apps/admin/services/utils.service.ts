import { APIRequest } from '@/lib/api-request'
import { IDashboardStatsResponse } from '@/lib/interfaces'

export class UtilsService extends APIRequest {
  public async getDashboardStats() {
    return this.get<IDashboardStatsResponse>(`admin/`)
  }
}

export const utilsService = new UtilsService()
