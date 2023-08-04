import { APIRequest } from '@/lib/api-request'
import { IArtist } from '@/lib/interfaces'

export class ArtistService extends APIRequest {
  public async getById(id: string) {
    return this.get<IArtist>(`admin/artist/${id}`)
  }

  public async search(query?: string) {
    let url = 'admin/artists'

    if (query) {
      url += '?' + query
    }

    return await this.get<[IArtist]>(url)
  }
}

export const artistService = new ArtistService()
