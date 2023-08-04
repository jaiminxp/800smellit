// service for all items that are under review by the admin

import { APIRequest } from '@/lib/api-request'
import {
  IPendingArtistsResponse,
  IPendingMusiciansResponse,
  IPendingStatisticsResponse,
  TStatusAction,
} from '@/lib/interfaces'

export class ReviewService extends APIRequest {
  public async getPendingStatistics() {
    return await this.get<IPendingStatisticsResponse>(
      'admin/pending/statistics'
    )
  }

  public async getPendingMusicians() {
    return await this.get<IPendingMusiciansResponse>('admin/pending/musicians')
  }

  public async getPendingArtists() {
    return await this.get<IPendingArtistsResponse>('admin/pending/artists')
  }

  public async updateMusicianStatus(id: string, action: TStatusAction) {
    return await this.put<{ message: string }>(
      `admin/musician/${id}/update-status`,
      { action }
    )
  }

  public async updateArtistStatus(id: string, action: TStatusAction) {
    return await this.put<{ message: string }>(
      `admin/artist/${id}/update-status`,
      { action }
    )
  }
}

export const reviewService = new ReviewService()
