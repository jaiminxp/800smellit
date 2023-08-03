import APIRequest from '@/lib/api-request'
import { Event, EventPayload } from '@/types'

class EventService extends APIRequest {
  public async search(query?: string) {
    let url = '/events'

    if (query) {
      url += '?' + query
    }

    return this.get<Event[]>(url)
  }

  public async create(event: EventPayload) {
    return this.post<Event>('/events', event)
  }

  public async update(id: string, event: EventPayload) {
    return this.put<Event>(`/events/${id}`, event)
  }

  public async delete(id: string) {
    return this.del<Event>(`/events/${id}`)
  }
}

export const eventService = new EventService()
