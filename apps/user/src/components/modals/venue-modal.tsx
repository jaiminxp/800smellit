import closeIcon from '@/assets/close-icon.svg'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Option, Select } from '../form'
import { StrayVenue, StrayVenueFormValues, StrayVenuePayload } from '@/types'
import { strayVenueFormSchema } from '@/lib/schemas'
import LocationPicker from '../LocationPicker'
import { useState } from 'react'
import { LngLatLike } from 'mapbox-gl'
import { toast } from 'react-toastify'
import { states } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { venueService } from '@/services'
import Spinner from '../spinner'

interface VenueModalProps {
  toggle: boolean
  onToggle: () => void
}

const defaultValues: StrayVenueFormValues = {
  name: '',
  address: '',
  state: '',
  city: '',
}

const VenueModal = ({ toggle, onToggle }: VenueModalProps) => {
  const [coordinates, setCoordinates] = useState<LngLatLike | null>()

  const { mutate: createVenue, isLoading } = useMutation<
    StrayVenue,
    Error,
    StrayVenuePayload
  >({
    mutationFn: (venue) => venueService.createStray(venue),
    onSuccess: () => {
      toast.success('Venue created')
      onToggle()
    },
    onError: () => {
      toast.error('There was a problem in creating your venue')
    },
    onSettled: () => {
      reset(defaultValues)
      onToggle()
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<StrayVenueFormValues>({
    resolver: zodResolver(strayVenueFormSchema),
    defaultValues: defaultValues,
    values: defaultValues,
  })

  const address = watch('address')
  const state = watch('state')
  const city = watch('city')

  const handleFormSubmit: SubmitHandler<StrayVenueFormValues> = (values) => {
    if (!coordinates) {
      toast.error('Please locate venue address on map')
      return
    }

    createVenue({ ...values, coordinates })
  }

  if (!toggle) {
    return null
  }

  return (
    <div className="z-10 absolute top-0 left-0 w-full h-full flex justify-center items-center text-white bg-[rgba(0,0,0,0.5)]">
      <div className="bg-orange-800 p-5 w-2/3 max-w-5xl rounded-lg relative">
        <h2 className="text-2xl text-center border-b-2 pb-5 mt-5 mb-3">
          Create new venue
        </h2>
        <button
          type="button"
          className="absolute top-5 right-5 hover:bg-orange-900 rounded-lg p-1.5"
          onClick={() => {
            onToggle()
            reset(defaultValues)
          }}
        >
          <img
            className="w-5 h-5 fill-white"
            src={closeIcon}
            alt="Close icon"
          />
          <span className="sr-only">Close modal</span>
        </button>

        <div className="w-full flex gap-3">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex-1 h-min"
          >
            <div>
              <label className="inline" htmlFor="venue">
                Name
              </label>
              <Input
                {...register('name')}
                placeholder="Venue name"
                id="name"
                className="w-full mt-2"
              />
              <p className="err-msg mt-2">{errors.name?.message}</p>
            </div>

            <div className="mt-3">
              <label className="inline" htmlFor="address">
                Address:
              </label>
              <Input
                {...register('address')}
                placeholder="Address"
                id="address"
                className="w-full mt-2"
              />
              <p className="err-msg mt-2">{errors.address?.message}</p>
            </div>

            <div className="mt-3">
              <div className="flex justify-between items-center gap-4">
                <label className="inline" htmlFor="state">
                  State:
                </label>
                <Select {...register('state')} id="state" className="w-8/12">
                  <Option value="" key={-1}>
                    Select State
                  </Option>
                  {Object.keys(states)
                    .sort()
                    .map((value) => (
                      <Option value={value} key={value}>
                        {value}
                      </Option>
                    ))}
                </Select>
              </div>
              <p className="err-msg mt-2">{errors.state?.message}</p>
            </div>

            <div className="mt-3">
              <div className="flex justify-between items-center gap-4">
                <label className="inline" htmlFor="city">
                  City:
                </label>
                <Input
                  {...register('city')}
                  placeholder="City"
                  id="city"
                  className="w-8/12 mt-2"
                />
              </div>
              <p className="err-msg mt-2">{errors.city?.message}</p>
            </div>

            <div className="flex justify-center mt-5">
              {isLoading ? (
                <Spinner />
              ) : (
                <button className="btn-primary">Create venue</button>
              )}
            </div>
          </form>

          <div className="flex-1">
            <LocationPicker
              coordinates={coordinates}
              containerStyle="w-full"
              getAddress={() =>
                [address, city, state].reduce(
                  (p, c) => (c !== '' ? p + c + ' ' : p),
                  ''
                )
              }
              onLocate={setCoordinates}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VenueModal
