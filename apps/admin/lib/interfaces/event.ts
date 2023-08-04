import { IAddress, IGeometry } from './utils'

export interface IEvent {
  _id: string
  organizerInfo: {
    organizer: string
    name: string
  }
  organizerType: 'Musician' | 'Artist'
  name: string
  address: IAddress
  fullAddress: string
  genre: string
  date: string
  geometry: IGeometry
}
