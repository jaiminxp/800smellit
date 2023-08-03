import APIRequest from '@/lib/api-request'
import { FeedBackFormValues, FeedBackResponse } from '@/types'

class UtilsService extends APIRequest {
  async sendFeedback(payload: FeedBackFormValues) {
    return this.post<FeedBackResponse>('/feedback', payload)
  }
}

export const utilsService = new UtilsService()
