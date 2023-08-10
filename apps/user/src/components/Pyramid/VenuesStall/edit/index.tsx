import LocationPicker from '@/components/LocationPicker'
import EventList from '@/components/event-list'
import { Input, Option, Select, TextArea } from '@/components/form'
import VenueEventModal from '@/components/modals/venue-event-modal'
import { states } from '@/constants'
import { venueFormSchema } from '@/lib/schemas'
import { formatDate, formatTime } from '@/lib/utils'
import { eventService, venueService } from '@/services'
import {
  Event,
  EventOrganizerType,
  EventPayload,
  EventType,
  Venue,
  VenueEventModalData,
  VenueFormValues,
} from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LngLatLike } from 'mapbox-gl'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const EditVenue = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1)
  const [eventModalToggle, setEventModalToggle] = useState(false)

  const venue = (useLocation().state as { venue: Venue }).venue

  useEffect(() => {
    venue && setEvents(venue.events)
  }, [venue])

  const [coordinates, setCoordinates] = useState<LngLatLike | null>(
    venue.geometry.coordinates
  )
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const updateVenueMutation = useMutation<
    Venue,
    Error,
    { id: string; venue: FormData }
  >({
    mutationFn: ({ id, venue }) => venueService.update(id, venue),
    onSuccess: (updatedVenue) => {
      // update user's list of venues
      queryClient.setQueryData<Venue[]>(['venues/me'], (prevVenues) => {
        if (!prevVenues) {
          return [updatedVenue]
        }
        const venueIndex = prevVenues?.findIndex((v) => v._id === venue._id)
        prevVenues.splice(venueIndex, 1, updatedVenue)
        return prevVenues
      })

      toast.success('Venue updated')
      navigate('/profile')
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong while updating venue')
    },
  })

  const createEventMutation = useMutation<Event, Error, EventPayload>({
    mutationFn: (newEvent) => {
      return eventService.create(newEvent)
    },
    onSuccess: (createdEvent) => {
      const newEvents = [...events, createdEvent]
      setEvents(newEvents)
      toast.success(`Added ${createdEvent.name}`)
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong while creating event')
    },
  })

  const updateEventMutation = useMutation<
    Event,
    Error,
    { id: string; event: EventPayload }
  >({
    mutationFn: ({ id, event }) => {
      return eventService.update(id, event)
    },
    onSuccess: (updatedEvent) => {
      const newEvents = events.slice()
      newEvents[selectedItemIndex] = updatedEvent
      setEvents(newEvents)
      setSelectedItemIndex(-1)

      toast.success('Event updated')
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong while updating event')
    },
  })

  const deleteEventMutation = useMutation<
    Event,
    Error,
    { id: string; index: number }
  >({
    mutationFn: ({ id }) => {
      return eventService.delete(id)
    },
    onSuccess: (deletedEvent, { index }) => {
      const updatedSchedule = [...events]
      toast.success('Deleted event')
      updatedSchedule.splice(index, 1)
      setEvents(updatedSchedule)
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong while deleting event')
    },
  })

  const handleEventFormSubmit = async ({
    type,
    artist,
    ...values
  }: VenueEventModalData) => {
    let organizerType: EventOrganizerType

    switch (type) {
      case EventType.Music:
        organizerType = EventOrganizerType.Musician
        break
      case EventType.Art:
        organizerType = EventOrganizerType.Artist
        break
    }

    if (selectedEvent) {
      updateEventMutation.mutate({
        id: selectedEvent._id,
        event: {
          ...values,
          organizerType,
          organizerId: artist._id,
          venue: venue._id,
        },
      })
    } else {
      const eventPayload: EventPayload = {
        ...values,
        organizerType,
        organizerId: artist._id,
        venue: venue._id,
      }

      createEventMutation.mutate(eventPayload)
    }
  }

  const onEditFormSubmit: SubmitHandler<VenueFormValues> = ({
    gallery,
    ...values
  }) => {
    if (!coordinates) {
      toast.error('Please locate venue address on map')
      return
    }

    const nextVenue = { ...values, coordinates }

    const payload = new FormData()
    payload.append('venue', JSON.stringify(nextVenue))

    if (gallery && gallery?.length !== 0) {
      for (const file of gallery) {
        payload.append('gallery', file)
      }
    }

    updateVenueMutation.mutate({ id: venue._id, venue: payload })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    values: {
      venue: venue.name,
      phone: venue.phone,
      email: venue.email,
      website: venue.website,
      theme: venue.theme,
      details: venue.details,
      address: venue.address.address,
      state: venue.address.state,
      city: venue.address.city,
      contactName: venue.contact.name,
      contactEmail: venue.contact.email,
      contactPhone: venue.contact.phone,
    },
  })

  const address = watch('address')
  const state = watch('state')
  const city = watch('city')

  const selectedEvent = events[selectedItemIndex]
  const eventType =
    selectedEvent?.organizerType === EventOrganizerType.Musician
      ? EventType.Music
      : EventType.Art

  const eventModalData: VenueEventModalData | null = selectedEvent
    ? {
        name: selectedEvent.name,
        genre: selectedEvent.genre,
        date: formatDate(new Date(selectedEvent.date)),
        time: formatTime(new Date(selectedEvent.date)),
        type: eventType,
        artist: {
          _id: selectedEvent.organizerInfo.organizer,
          name: selectedEvent.organizerInfo.name,
        },
      }
    : null

  if (!venue) {
    toast.error('Venue not found')
    return <Navigate to={'/profile'} />
  }

  return (
    <>
      <div className="flex-1 p-5 bg-[rgba(0,0,0,0.5)] overflow-y-auto">
        <h1 className="text-4xl text-center font-heading">Edit venue</h1>
        <div className="mt-8 flex justify-center">
          <form onSubmit={handleSubmit(onEditFormSubmit)}>
            <div className="flex w-[800px] gap-5">
              {/* left col */}
              <div className="w-6/12">
                <div>
                  <label className="block" htmlFor="name">
                    Venue name
                  </label>
                  <Input
                    {...register('venue')}
                    id="name"
                    placeholder="Enter venue name"
                    className="w-full mt-2"
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

            {/* events section */}
            <div className="mt-8 border-t-2 pt-5 flex flex-col items-center">
              <h2 className="text-2xl font-semibold">Events</h2>
              <div className="w-2/3 mt-3">
                {events.length > 0 ? (
                  <div>
                    <EventList
                      data={events}
                      editItem={(e, i) => {
                        setSelectedItemIndex(i)
                        setEventModalToggle(true)
                      }}
                      deleteItem={(i) =>
                        deleteEventMutation.mutate({
                          id: events[i]._id,
                          index: i,
                        })
                      }
                      dataExtractor={(e) => ({
                        name: e.name,
                        date: e.date,
                        venue: e.venue.name,
                      })}
                    />
                  </div>
                ) : (
                  <p className="err-msg">No events</p>
                )}
                <button
                  type="button"
                  className="mt-3 btn-secondary ml-auto block"
                  onClick={() => {
                    setEventModalToggle(true)
                    setSelectedItemIndex(-1)
                  }}
                >
                  Add event
                </button>
              </div>
            </div>

            {/* map and address section */}
            <div className="mt-8 border-t-2 pt-5">
              <h2 className="text-2xl text-center font-semibold">
                Venue location
              </h2>

              <div className="flex gap-5 mt-5">
                <LocationPicker
                  coordinates={coordinates}
                  containerStyle="w-1/2"
                  getAddress={() =>
                    [address, city, state].reduce(
                      (p, c) => (c !== '' ? p + c + ' ' : p),
                      ''
                    )
                  }
                  onLocate={setCoordinates}
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
        </div>
      </div>

      <VenueEventModal
        data={eventModalData}
        onSubmit={handleEventFormSubmit}
        toggle={eventModalToggle}
        onToggle={() => setEventModalToggle(!setEventModalToggle)}
      />
    </>
  )
}

export default EditVenue
