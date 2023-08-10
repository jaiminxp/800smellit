import { useEffect, useState } from 'react'
import { states } from '@/constants'
import MemberList from '@/components/member-list'
import EventList from '@/components/event-list'
import { toast } from 'react-toastify'
import { formatDate, formatTime, readFile } from '@/lib/utils'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import {
  Event,
  Musician,
  Member,
  CloudAsset,
  EventModalData,
  EventPayload,
  EventOrganizerType,
  MusicianFormValues,
  MemberFormValues,
} from '@/types'
import EventModal from '../modals/event-modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventService, musicianService } from '@/services'
import MemberModal from '../modals/member-modal'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { musicianFormSchema } from '@/lib/schemas'
import { Input, Option, Select, TextArea } from '../form'
import Gallery from '../gallery'

function EditProfile() {
  const [currentLogo, setCurrentLogo] = useState<CloudAsset>()
  const [currentGallery, setCurrentGallery] = useState<CloudAsset[]>([])
  const [newLogo, setNewLogo] = useState<string>() // stores logo file selected by user
  const [newGallery, setNewGallery] = useState<string[]>([]) // stores gallery files selected by user
  const [memberModalToggle, setMemberModalToggle] = useState<boolean>(false)
  const [eventModalToggle, setEventModalToggle] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1)

  const selectedEvent = events[selectedItemIndex]
  const selectedMember = members[selectedItemIndex]

  const location: Location = useLocation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const profile: Musician = (location.state as { data: Musician }).data

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

  function setInitialState(data: Musician) {
    setEvents(data.events)
    data.members && setMembers(data.members)
    data.logo && setCurrentLogo(data.logo)
    data.gallery && setCurrentGallery(data.gallery)
  }

  useEffect(() => {
    profile && setInitialState(profile)
  }, [profile])

  const updateMusicianMutation = useMutation<
    { success: true },
    Error,
    { id: string; musician: FormData },
    { musicianProfile: Musician | undefined }
  >({
    mutationFn: ({ id, musician }) => musicianService.update(id, musician),
    onMutate: () => {
      const musicianProfile = queryClient.getQueryData<Musician>([
        'musician-profile',
      ])

      if (musicianProfile) {
        queryClient.setQueryData(['musician-profile'], {
          ...musicianProfile,
          revision: true,
        })
      }

      navigate('/profile')
      return { musicianProfile }
    },
    onSuccess: () => {
      toast.success('Profile update submitted for review')
    },
    onError: (error, variables, context) => {
      toast.error(error.message)
      context &&
        queryClient.setQueryData(['musician-profile'], context.musicianProfile)
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

  const handleEditMember = (e: Member, i: number) => {
    setSelectedItemIndex(i)
    setMemberModalToggle(true)
  }

  const handleDeleteMember = (i: number) => {
    const updatedMembers = [...members]
    updatedMembers.splice(i, 1)
    setMembers(updatedMembers)
  }

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
        organizerType: EventOrganizerType.Musician,
        organizerId: profile._id,
        venue: values.venue._id,
      }

      createEventMutation.mutate(eventPayload)
    }
  }

  const handleMemberFormSubmit = (member: MemberFormValues) => {
    if (selectedMember) {
      const nextMembers = [...members]
      nextMembers[selectedItemIndex] = member
      setMembers(nextMembers)
      setSelectedItemIndex(-1)
      toast.success(`Member updated`)
    } else {
      setMembers((prevState) => [...prevState, member])
      toast.success(`Member added`)
    }
  }

  const handleEditFormSubmit: SubmitHandler<MusicianFormValues> = ({
    logo,
    gallery,
    songs,
    address,
    state,
    city,
    musician: name,
    ...values
  }) => {
    const musician = {
      ...values,
      name,
      members,
      address: {
        address,
        state,
        city,
      },
    }

    const payload = new FormData()
    payload.append('musician', JSON.stringify(musician))

    //append files to payload
    if (logo && logo?.length > 0) {
      payload.append('logo', logo[0])
    }

    if (gallery) {
      for (const file of gallery) {
        payload.append('gallery', file)
      }
    }

    if (songs) {
      for (const file of songs) {
        payload.append('songs', file)
      }
    }

    updateMusicianMutation.mutate({
      id: profile._id,
      musician: payload,
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MusicianFormValues>({
    resolver: zodResolver(musicianFormSchema),
    values: {
      // prefill form values
      musician: profile.name,
      bio: profile.bio,
      genre: profile.genre,
      address: profile.address.address,
      state: profile.address.state,
      city: profile.address.city,
      band: profile.band || '',
      influences: profile.influences || '',
      website: profile.website || '',
      phone: profile.phone || '',
    },
  })

  const logo = watch('logo')
  const gallery = watch('gallery')

  const displayGallery = newGallery.length > 0 ? newGallery : currentGallery

  // parse selected logo image to base64 string
  useEffect(() => {
    const parseLogo = async (logo: File) => setNewLogo(await readFile(logo))
    if (logo && logo.length > 0) parseLogo(logo[0])
  }, [logo])

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
      <div className="overflow-y-scroll w-[70%] h-5/6 absolute top-[3%] left-[5%] text-white p-5 pb-10 pl-9 flex-col bg-music-elevator-ui bg-full bg-no-repeat">
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
                  {...register('musician')}
                  id="name"
                  className="w-2/3 mt-2"
                />
                <p className="err-msg mt-2">{errors.musician?.message}</p>
              </div>

              <div className="mt-3">
                <label htmlFor="band">Name of the band</label>
                <Input {...register('band')} id="band" className="w-2/3 mt-2" />
                <p className="err-msg mt-2">{errors.band?.message}</p>
              </div>

              <div className="mt-3">
                <p>Band members</p>
                <button
                  className="btn-secondary mt-2 mb-3"
                  type="button"
                  onClick={() => {
                    setMemberModalToggle(true)
                    setSelectedItemIndex(-1)
                  }}
                >
                  Add Member
                </button>

                <MemberList
                  data={members}
                  editItem={handleEditMember}
                  deleteItem={handleDeleteMember}
                />
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
                <label className="block" htmlFor="logo">
                  Band logo
                </label>
                <img
                  src={newLogo ? newLogo : currentLogo?.url}
                  alt=""
                  className="w-[100px] mb-4"
                />
                <Input
                  {...register('logo')}
                  type="file"
                  id="logo"
                  accept="image/*"
                  className="mt-2"
                />
                <p className="err-msg mt-2">{errors.logo?.message}</p>
              </div>

              <div className="mt-3">
                <label className="block" htmlFor="songs">
                  Upload songs
                </label>
                <Input
                  {...register('songs')}
                  className="mt-2"
                  id="songs"
                  type="file"
                  multiple
                  accept="audio/*"
                />
                <p className="err-msg mt-2">{errors.songs?.message}</p>
              </div>
            </div>

            {/* right col */}
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
                <label className="block" htmlFor="bio">
                  Band information
                  <span className="required-label ml-2">*</span>
                </label>
                <TextArea
                  {...register('bio')}
                  id="bio"
                  className="w-full mt-2"
                />
                <p className="err-msg mt-2">{errors.bio?.message}</p>
              </div>

              <div className="mt-3">
                <label className="block" htmlFor="gallery">
                  Band gallery
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
                  dataExtractor={(e) => ({
                    name: e.name,
                    date: e.date,
                    venue: e.venue.name,
                  })}
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

      <MemberModal
        data={selectedMember}
        toggle={memberModalToggle}
        onToggle={() => setMemberModalToggle(!memberModalToggle)}
        onSubmit={handleMemberFormSubmit}
      />
    </>
  )
}

export default EditProfile
