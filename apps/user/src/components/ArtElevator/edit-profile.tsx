import { useEffect, useState } from 'react'
import { states } from '@/constants'
import EventList from '@/components/event-list'
import { toast } from 'react-toastify'
import { formatDate, formatTime, readFile } from '@/lib/utils'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import {
  Event,
  Artist,
  EventModalData,
  EventPayload,
  EventOrganizerType,
  CloudAsset,
  ArtistFormValues,
} from '@/types'
import EventModal from '../modals/event-modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { artistService, eventService } from '@/services'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { artistFormSchema } from '@/lib/schemas'
import { Input, Option, Select, TextArea } from '../form'
import Gallery from '../gallery'

function EditProfile() {
  const [currentGallery, setCurrentGallery] = useState<CloudAsset[]>([])
  const [newGallery, setNewGallery] = useState<string[]>([]) // stores gallery files selected by user
  const [eventModalToggle, setEventModalToggle] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1)

  const selectedEvent = events[selectedItemIndex]

  const location: Location = useLocation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const profile: Artist = (location.state as { data: Artist }).data

  const eventModalData: EventModalData | null = selectedEvent
    ? {
        name: selectedEvent.name,
        genre: selectedEvent.genre,
        date: formatDate(new Date(selectedEvent.date)),
        time: formatTime(new Date(selectedEvent.date)),
        venue: {
          _id: selectedEvent.venue._id,
          name: selectedEvent.venue.name,
        },
      }
    : null

  function setInitialState(data: Artist) {
    setEvents(data.events)
    data.gallery && setCurrentGallery(data.gallery)
  }

  useEffect(() => {
    setInitialState(profile)
  }, [])

  const updateArtistMutation = useMutation<
    { success: true },
    Error,
    { id: string; artist: FormData },
    { artistProfile: Artist | undefined }
  >({
    mutationFn: ({ id, artist }) => artistService.update(id, artist),
    onMutate: () => {
      const artistProfile = queryClient.getQueryData<Artist>(['artist-profile'])

      if (artistProfile) {
        queryClient.setQueryData(['artist-profile'], {
          ...artistProfile,
          revision: true,
        })
      }

      navigate('/profile')
      return { artistProfile }
    },
    onSuccess: () => {
      toast.success('Profile update submitted for review')
    },
    onError: (error, variables, context) => {
      toast.error(error.message)
      context?.artistProfile &&
        queryClient.setQueryData(['artist-profile'], context.artistProfile)
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

  const handleEditEvent = (e: Event | EventModalData, i: number) => {
    setSelectedItemIndex(i)
    setEventModalToggle(true)
  }

  const handleDeleteEvent = (i: number) => {
    deleteEventMutation.mutate({ id: events[i]._id, index: i })
  }

  const handleEventFormSubmit = async (values: EventModalData) => {
    if (selectedEvent) {
      updateEventMutation.mutate({
        id: selectedEvent._id,
        event: { ...values, venue: values.venue._id },
      })
    } else {
      const eventPayload: EventPayload = {
        ...values,
        organizerType: EventOrganizerType.Artist,
        organizerId: profile._id,
        venue: values.venue._id,
      }

      createEventMutation.mutate(eventPayload)
    }
  }

  const handleEditFormSubmit: SubmitHandler<ArtistFormValues> = ({
    gallery,
    address,
    state,
    city,
    artist: name,
    ...values
  }) => {
    const artist = {
      ...values,
      name,
      address: {
        address,
        state,
        city,
      },
    }

    const payload = new FormData()
    payload.append('artist', JSON.stringify(artist))

    //append files to payload
    if (gallery) {
      for (const file of gallery) {
        payload.append('gallery', file)
      }
    }

    updateArtistMutation.mutate({
      id: profile._id,
      artist: payload,
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ArtistFormValues>({
    resolver: zodResolver(artistFormSchema),
    values: {
      // prefill form values
      artist: profile.name,
      bio: profile.bio,
      genre: profile.genre,
      address: profile.address.address,
      state: profile.address.state,
      city: profile.address.city,
      influences: profile.influences || '',
      website: profile.website || '',
      phone: profile.phone || '',
    },
  })

  const gallery = watch('gallery')
  const displayGallery = newGallery.length > 0 ? newGallery : currentGallery

  // parse selected gallery images to base64 strings
  useEffect(() => {
    const parseGallery = async (gallery: FileList) => {
      const parsedGallery: string[] = []
      for (const file of gallery) {
        parsedGallery.push(await readFile(file))
      }
      setNewGallery(parsedGallery)
    }
    if (gallery && gallery.length > 0) parseGallery(gallery)
  }, [gallery])

  return (
    <>
      <div className="overflow-y-scroll w-[70%] h-5/6 absolute top-[3%] left-[5%] text-black p-5 pb-10 pl-9 flex-col bg-art-elevator-ui bg-full bg-no-repeat">
        <h1 className="text-center text-3xl mb-5 font-bold">
          Edit your profile
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit(handleEditFormSubmit)}
            className="flex w-[90%] gap-5"
          >
            {/* left-col */}
            <div className="flex-1">
              <div>
                <label htmlFor="name">
                  Full name of the artist
                  <span className="required-label ml-2">*</span>
                </label>
                <Input
                  {...register('artist')}
                  id="name"
                  className="w-2/3 mt-2"
                />
                <p className="err-msg mt-2">{errors.artist?.message}</p>
              </div>

              <div className="mt-3">
                <label className="block" htmlFor="influences">
                  Influences
                </label>
                <Input
                  {...register('influences')}
                  id="influences"
                  className="w-2/3 mt-2"
                />
                <p className="err-msg mt-2">{errors.influences?.message}</p>
              </div>

              <div className="mt-3">
                <label className="block" htmlFor="website">
                  Website
                </label>
                <Input
                  {...register('website')}
                  type="url"
                  id="website"
                  className="w-2/3 mt-2"
                />
                <p className="err-msg mt-2">{errors.website?.message}</p>
              </div>

              <div className="mt-3">
                <label className="block" htmlFor="phone">
                  Phone
                </label>
                <Input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className="w-2/3 mt-2"
                />
                <p className="err-msg mt-2">{errors.phone?.message}</p>
              </div>

              <div className="mt-3">
                <label className="block" htmlFor="bio">
                  Artist information
                  <span className="required-label ml-2">*</span>
                </label>
                <TextArea
                  {...register('bio')}
                  id="bio"
                  className="w-full mt-2"
                />
                <p className="err-msg mt-2">{errors.bio?.message}</p>
              </div>
            </div>

            {/* right-col */}
            <div className="flex-1">
              <div>
                <label className="block" htmlFor="address">
                  Address
                  <span className="required-label ml-2">*</span>
                </label>
                <Input
                  {...register('address')}
                  id="address"
                  className="w-2/3 mt-2"
                />
                <p className="err-msg mt-2">{errors.address?.message}</p>
              </div>

              <div className="mt-3">
                <div className="flex justify-between gap-4">
                  <label className="inline" htmlFor="state">
                    State:
                    <span className="required-label ml-2">*</span>
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
                <div className="flex justify-between gap-4">
                  <label className="inline" htmlFor="city">
                    City:
                    <span className="required-label ml-2">*</span>
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

              <div className="mt-3">
                <div className="flex justify-between gap-4">
                  <label className="inline" htmlFor="genre">
                    Genre:
                    <span className="required-label ml-2">*</span>
                  </label>
                  <Input
                    {...register('genre')}
                    className="w-8/12"
                    id="genre"
                    placeholder="Genre"
                  />
                </div>
                <p className="err-msg mt-2">{errors.genre?.message}</p>
              </div>

              <div className="mt-3">
                <label className="block" htmlFor="gallery">
                  Artist gallery
                </label>

                {displayGallery.length > 0 && (
                  <Gallery images={displayGallery} />
                )}

                <Input
                  {...register('gallery')}
                  id="gallery"
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-2"
                />
              </div>

              <div className="mt-3">
                <p>Schedule of events</p>
                <button
                  className="btn-secondary mt-2 mb-3"
                  type="button"
                  onClick={() => {
                    setEventModalToggle(true)
                    setSelectedItemIndex(-1)
                  }}
                >
                  Add Event
                </button>
                <EventList
                  data={events}
                  editItem={handleEditEvent}
                  deleteItem={handleDeleteEvent}
                />
              </div>

              <button className="btn-primary block mt-5 ml-auto">SUBMIT</button>
            </div>
          </form>
        </div>
      </div>

      <EventModal
        data={eventModalData}
        toggle={eventModalToggle}
        onToggle={() => setEventModalToggle(!eventModalToggle)}
        onSubmit={handleEventFormSubmit}
      />
    </>
  )
}

export default EditProfile
