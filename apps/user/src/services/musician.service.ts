import APIRequest from '@/lib/api-request'
import {
  CreateMusicianResponse,
  Musician,
  StrayArtist,
  Suggestion,
} from '@/types'

class MusicianService extends APIRequest {
  public async search(query?: string) {
    let url = '/musicians'

    if (query) {
      url += '?' + query
    }

    return this.get<Musician[]>(url)
  }

  public async create(musician: FormData) {
    return this.post<CreateMusicianResponse>('/musicians', musician)
  }

  public async me() {
    return this.get<Musician>('/musicians/me')
  }

  public async update(id: string, musician: FormData) {
    return this.put<{ success: true }>(`/musicians/${id}`, musician)
  }

  public async findById(id: string) {
    return this.get<Musician>(`/musicians/${id}`)
  }

  public autocomplete(query: string) {
    return this.get<Suggestion[]>(`/musicians/autocomplete?query=${query}`)
  }

  public createStray(musician: { name: string }) {
    return this.post<StrayArtist>('/musicians/strays', musician)
  }

  public strayAutocomplete(query: string) {
    return this.get<Suggestion[]>(
      `/musicians/strays/autocomplete?query=${query}`
    )
  }
}

export const musicianService = new MusicianService()
