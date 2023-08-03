import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, TextArea, Option, Select } from '@/components/form'
import LocationPicker from '@/components/LocationPicker'
import { LngLatLike } from 'mapbox-gl'
import { states } from '@/constants'
import { Suggestion, VenueFormValues } from '@/types'
import { venueFormSchema } from '@/lib/schemas'
import AutoComplete from '@/components/autocomplete'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { venueService } from '@/services'
import { toast } from 'react-toastify'
import { isString } from '@/lib/utils'

interface Props {
  onSubmit: SubmitHandler<VenueFormValues>
  coordinates: LngLatLike | null
  onLocate: (coordinates: LngLatLike) => void
}

const VenueRegisterForm = ({ coordinates, onLocate, onSubmit }: Props) => {
  const [venueQuery, setVenueQuery] = useState('')

  const {
    data: venueSuggestions,
    error: suggestionError,
    isLoading: isLoadingSuggestions,
  } = useQuery([`venues/strays/autocomplete?query=${venueQuery}`], () =>
    venueService.strayAutocomplete(venueQuery),
  )

  if (suggestionError) {
    toast.error('Something went wrong in fetching list of venues')
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
  })

  const address = watch('address')
  const state = watch('state')
  const city = watch('city')

  const venue = watch('venue')

  const {
    data: selectedVenue,
    refetch: fetchSelectedVenue,
    error: selectedVenueError,
  } = useQuery(
    [`venues/${(venue as Suggestion)?._id}`],
    () => {
      if (venue && !isString(venue) && venue._id) {
        return venueService.findById(venue._id)
      }
    },
    {
      enabled: false,
    },
  )

  if (selectedVenueError) {
    toast.error('Something went wrong in fetching selected venue')
  }

  useEffect(() => {
    if (venue && !isString(venue) && venue._id) {
      fetchSelectedVenue()
    }
  }, [venue])

  useEffect(() => {
    if (selectedVenue) {
      setValue('address', selectedVenue.address.address)
      setValue('state', selectedVenue.address.state)
      setValue('city', selectedVenue.address.city)
      onLocate(selectedVenue.geometry.coordinates)
    }
  }, [selectedVenue])

  const disableInputs =
    venue !== undefined && !isString(venue) && venue._id !== undefined

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-[800px] gap-5">
        {/* left col */}
        <div className="w-6/12">
          <div>
            <label className="block mb-2" htmlFor="name">
              Venue name
            </label>
            <AutoComplete
              name="venue"
              control={control}
              isLoadingSuggestions={isLoadingSuggestions}
              suggestionList={venueSuggestions || []}
              onQueryChange={(query) => setVenueQuery(query)}
            />
            <p className="err-msg mt-2">{errors.venue?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="phone">
              Venue phone
            </label>
            <Input
              {...register('phone')}
              type="tel"
              id="phone"
              placeholder="Venue phone"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.phone?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="email">
              Venue email
            </label>
            <Input
              {...register('email')}
              type="email"
              id="email"
              placeholder="Venue email"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.email?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="website">
              Website
            </label>
            <Input
              {...register('website')}
              type="url"
              id="website"
              placeholder="Website"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.website?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="theme">
              Theme
            </label>
            <Input
              {...register('theme')}
              id="theme"
              placeholder="Theme/Style"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.theme?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="gallery">
              Gallery
            </label>
            <Input
              {...register('gallery')}
              type="file"
              multiple
              id="gallery"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.gallery?.message}</p>
          </div>
        </div>

        {/* right col */}
        <div className="w-6/12">
          <div>
            <label className="block" htmlFor="contactName">
              Contact person name
            </label>
            <Input
              {...register('contactName')}
              id="contactName"
              className="w-full mt-2"
              placeholder="Contact name"
            />
            <p className="err-msg mt-2">{errors.contactName?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="contactPhone">
              Contact person phone
            </label>
            <Input
              {...register('contactPhone')}
              type="tel"
              id="contactPhone"
              className="w-full mt-2"
              placeholder="Contact phone"
            />
            <p className="err-msg mt-2">{errors.contactName?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="contactEmail">
              Contact person email
            </label>
            <Input
              {...register('contactEmail')}
              type="email"
              id="contactEmail"
              className="w-full mt-2"
              placeholder="Contact email"
            />
            <p className="err-msg mt-2">{errors.contactEmail?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="details">
              Venue details
            </label>
            <TextArea
              {...register('details')}
              id="details"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.details?.message}</p>
          </div>
        </div>
      </div>

      {/* map and address section */}
      <div className="mt-8 border-t-2 pt-5">
        <h2 className="text-2xl text-center font-semibold">Venue location</h2>

        <div className="flex gap-5 mt-5">
          <LocationPicker
            coordinates={coordinates}
            containerStyle="w-1/2"
            getAddress={() =>
              [address, city, state].reduce(
                (p, c) => (c !== '' ? p + c + ' ' : p),
                '',
              )
            }
            onLocate={onLocate}
          />

          <div className="w-1/2">
            <div>
              <label className="block" htmlFor="address">
                Address
              </label>
              <Input
                {...register('address')}
                id="address"
                placeholder="Address"
                className="w-full mt-2"
                disabled={disableInputs}
              />
              <p className="err-msg mt-2">{errors.address?.message}</p>
            </div>

            <div className="mt-3">
              <div className="flex justify-between gap-4">
                <label className="inline" htmlFor="state">
                  State:
                </label>
                <Select
                  {...register('state')}
                  id="state"
                  className="w-8/12"
                  disabled={disableInputs}
                >
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
              <div className="flex justify-between gap-4">
                <label className="inline" htmlFor="city">
                  City:
                </label>
                <Input
                  {...register('city')}
                  className="w-8/12"
                  id="city"
                  placeholder="City"
                  disabled={disableInputs}
                />
              </div>
              <p className="err-msg mt-2">{errors.city?.message}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <button type="submit" className="btn-primary">
          Submit
        </button>
      </div>
    </form>
  )
}

export default VenueRegisterForm
