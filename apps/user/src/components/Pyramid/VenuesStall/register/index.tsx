import { AuthContext } from '@/context/authContext'
import { venueService } from '@/services'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LngLatLike } from 'mapbox-gl'
import { useContext, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { SubmitHandler } from 'react-hook-form'
import VenueRegisterForm from './venue-register-form'
import { Venue, VenueFormValues } from '@/types'

const Register = () => {
  const [coordinates, setCoordinates] = useState<LngLatLike | null>(null)

  const user = useContext(AuthContext)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createVenueMutation = useMutation<Venue, Error, FormData>({
    mutationFn: (newVenue) => venueService.create(newVenue),
    onSuccess: (venue) => {
      // push new venue to user's list of venues
      queryClient.setQueryData<Venue[]>(['venues/me'], (oldVenues) => {
        if (oldVenues && oldVenues.length > 0) {
          return [...oldVenues, venue]
        }
        return [venue]
      })

      toast.success('Venue registered')
      navigate('/profile')
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong while creating venue')
    },
  })

  if (!user) {
    toast.info('Please login to register a venue')
    return <Navigate to="/" />
  }

  const onSubmit: SubmitHandler<VenueFormValues> = ({ gallery, ...values }) => {
    if (!coordinates) {
      toast.error('Please locate venue address on map')
      return
    }

    const venue = { ...values, coordinates }

    const payload = new FormData()
    payload.append('venue', JSON.stringify(venue))

    if (gallery && gallery?.length !== 0) {
      for (const file of gallery) {
        payload.append('gallery', file)
      }
    }

    createVenueMutation.mutate(payload)
  }

  return (
    <div className="flex-1 p-5 bg-[rgba(0,0,0,0.5)] overflow-y-scroll">
      <h1 className="text-4xl text-center font-heading">Register venue</h1>
      <div className="mt-8 flex justify-center">
        <VenueRegisterForm
          onSubmit={onSubmit}
          coordinates={coordinates}
          onLocate={setCoordinates}
        />
      </div>
    </div>
  )
}

export default Register
