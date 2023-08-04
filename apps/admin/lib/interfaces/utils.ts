export interface IAddress {
  address: string
  state: string
  city: string
}

export interface ICloudAsset {
  _id: string
  url: string
  filepath?: string
}

export interface IGeometry {
  type: 'Point'
  coordinates: [number, number]
}

export interface IDashboardStatsResponse {
  users: number
  musicians: number
  artists: number
  pendingRequests: number
}

export type TProfileStatus = 'approved' | 'pending'
