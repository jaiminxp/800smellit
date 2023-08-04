import { APIRequest } from '@/lib/api-request'
import { IMusician } from '@/lib/interfaces/musician'

export class MusicianService extends APIRequest {
  public async getById(id: string) {
    return this.get<IMusician>(`admin/musician/${id}`)
  }

  public async search(query?: string) {
    let url = 'admin/musicians'

    if (query) {
      url += '?' + query
    }

    return await this.get<[IMusician]>(url)
  }
}

export const musicianService = new MusicianService()
