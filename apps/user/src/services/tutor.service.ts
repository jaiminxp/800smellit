import APIRequest from '@/lib/api-request'
import { TutorFormValues, Tutor } from '@/types'

class TutorService extends APIRequest {
  public async search(query?: string) {
    let url = '/tutors'

    if (query) {
      url += '?' + query
    }

    return this.get<Tutor[]>(url)
  }

  public async create(tutor: TutorFormValues) {
    return this.post<string>('/tutors', tutor)
  }
}

export const tutorService = new TutorService()
