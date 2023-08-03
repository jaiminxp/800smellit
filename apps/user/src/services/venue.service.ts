import APIRequest from '@/lib/api-request'
import { StrayVenuePayload, Suggestion, Venue } from '@/types'

class VenueService extends APIRequest {
  public async search(query?: string) {
    let url = '/venues'

    if (query) {
      url += '?' + query
    }

    return this.get<Venue[]>(url)
  }

  public async create(venue: FormData) {
    return this.post<Venue>('/venues', venue)
  }

  public getMyVenues() {
    return this.get<Venue[]>('/venues/me')
  }

  public update(id: string, venue: FormData) {
    return this.put<Venue>(`/venues/${id}`, venue)
  }

  public remove(id: string) {
    return this.del<Venue>(`/venues/${id}`)
  }

  public autocomplete(query: string) {
    return this.get<Suggestion[]>(`/venues/autocomplete?query=${query}`)
  }

  public findById(id: string) {
    return this.get<Venue>(`/venues/${id}`)
  }

  public createStray(venue: StrayVenuePayload) {
    return this.post<Venue>('/venues/strays', venue)
  }

  public strayAutocomplete(query: string) {
    return this.get<Suggestion[]>(`/venues/strays/autocomplete?query=${query}`)
  }
}

export const venueService = new VenueService()
