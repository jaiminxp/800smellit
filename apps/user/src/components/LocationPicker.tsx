import mapboxgl, { LngLatLike, Map, Marker } from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef } from 'react'

const mbxToken = import.meta.env.VITE_MAPBOX_TOKEN

type Props = {
  coordinates?: LngLatLike | null
  onLocate: (coordinates: LngLatLike) => void
  containerStyle?: string
  getAddress: () => string
}

const LocationPicker = ({
  coordinates,
  onLocate,
  containerStyle = '',
  getAddress,
}: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<Map | null>(null)
  const marker = useRef<Marker | null>(null)
  const geocoder = useRef<MapboxGeocoder | null>(null)

  const defaultLocation = { lng: -118.242766, lat: 34.053691 }

  mapboxgl.accessToken = mbxToken as string

  useEffect(() => {
    if (map.current) {
      if (coordinates) {
        map.current.setCenter(coordinates)
        if (marker.current) {
          marker.current.setLngLat(coordinates)
        } else {
          marker.current = new mapboxgl.Marker({ draggable: true }).setLngLat(
            coordinates
          )
          marker.current.addTo(map.current)
        }
      }

      return
    }

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates || defaultLocation,
        zoom: 10,
      })

      map.current.on('load', () => {
        if (map.current) {
          if (geocoder.current) {
            return
          }

          geocoder.current = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false,
          })

          geocoder.current.on('result', ({ result }) => {
            const { coordinates: resultCoordinates } = result.geometry

            if (marker.current) {
              marker.current.setLngLat(resultCoordinates)
              onLocate(resultCoordinates)
              return
            }

            marker.current = new mapboxgl.Marker({ draggable: true }).setLngLat(
              resultCoordinates
            )

            marker.current.on('dragend', () => {
              const coordinates = marker.current?.getLngLat()
              if (coordinates) {
                onLocate([coordinates.lng, coordinates.lat])
              }
            })

            map.current && marker.current.addTo(map.current)

            onLocate(resultCoordinates)
          })

          geocoder.current.addTo(map.current)
        }
      })
    }
  })

  return (
    <div className={containerStyle}>
      <div className="h-[380px]" ref={mapContainer}></div>
      <button
        onClick={() => {
          const address = getAddress()
          if (address && geocoder.current) {
            geocoder.current.query(address)
          }
        }}
        type="button"
        className="btn-secondary mx-auto mt-2"
      >
        Locate Address
      </button>
    </div>
  )
}

export default LocationPicker
