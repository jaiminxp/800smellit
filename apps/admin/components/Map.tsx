'use client'

import { Box, BoxProps } from '@chakra-ui/react'
import mapboxgl, {
  LngLatLike,
  Map as MapboxMap,
  Marker,
  Popup,
} from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef } from 'react'

const mbxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const getPopupContent = (text: string) =>
  `<h3 style="font-weight: bold; font-size: 1rem;">${text}</h3>`

interface IProps extends BoxProps {
  location?: LngLatLike
  popupText?: string
}

export default function Map({
  location = { lng: -118.242766, lat: 34.053691 },
  popupText,
  ...boxProps
}: IProps) {
  const mapContainer = useRef<HTMLElement>(null)
  const map = useRef<MapboxMap | null>(null)
  const marker = useRef<Marker | null>(null)
  const popup = useRef<Popup | null>(null)

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

      if (popup.current) {
        popup.current.setLngLat(location)
      }
    }
  }, [location])

  useEffect(() => {
    if (popupText && map.current) {
      if (popup.current) {
        popup.current.setHTML(getPopupContent(popupText))
        return
      }

      popup.current = new mapboxgl.Popup({
        offset: 25,
        closeOnClick: false,
        closeButton: false,
      })
        .setLngLat(location)
        .addTo(map.current)
        .setHTML(getPopupContent(popupText))
    }
  }, [popupText, location])

  return <Box ref={mapContainer} {...boxProps}></Box>
}
