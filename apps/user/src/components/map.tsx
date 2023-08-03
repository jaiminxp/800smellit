import { DEFAULT_COORDINATES } from '@/constants'
import mapboxgl, { LngLatLike, Marker, Map as MapboxMap } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef } from 'react'

const mbxToken = import.meta.env.VITE_MAPBOX_TOKEN

type Props = {
  location?: LngLatLike
  containerStyle?: string
}

const Map = ({
  location = DEFAULT_COORDINATES,
  containerStyle = '',
}: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<MapboxMap | null>(null)
  const marker = useRef<Marker | null>(null)

  mapboxgl.accessToken = mbxToken as string

  useEffect(() => {
    if (map.current) return

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: location,
        zoom: 10,
      })

      marker.current = new mapboxgl.Marker({})
        .setLngLat(location)
        .addTo(map.current)
    }
  })

  useEffect(() => {
    if (map.current) {
      map.current.setCenter(location).setZoom(10)

      if (marker.current) {
        marker.current.setLngLat(location)
      }
    }
  }, [location])

  return <div className={containerStyle} ref={mapContainer}></div>
}

export default Map
