import APIRequest from '@/lib/api-request'
import { CreateArtistResponse, Artist, Suggestion, StrayArtist } from '@/types'

class ArtistService extends APIRequest {
  public async search(query?: string) {
    let url = '/artists'

    if (query) {
      url += '?' + query
    }

    return this.get<Artist[]>(url)
  }

  public async create(artist: FormData) {
    return this.post<CreateArtistResponse>('/artists', artist)
  }

  public async me() {
    return this.get<Artist>('/artists/me')
  }

  public async update(id: string, artist: FormData) {
    return this.put<{ success: true }>(`/artists/${id}`, artist)
  }

  public async findById(id: string) {
    return this.get<Artist>(`/artists/${id}`)
  }

  public autocomplete(query: string) {
    return this.get<Suggestion[]>(`/artists/autocomplete?query=${query}`)
  }

  public createStray(artist: { name: string }) {
    return this.post<StrayArtist>('/artists/strays', artist)
  }

  public strayAutocomplete(query: string) {
    return this.get<Suggestion[]>(`/artists/strays/autocomplete?query=${query}`)
  }
}

export const artistService = new ArtistService()
