import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { AuthContext, AuthDispatchContext } from '@/context/authContext'
import {
  AuthActionType,
  EventModalData,
  MemberFormValues,
  CreateMusicianResponse,
  User,
  UserRoles,
  MusicianFormValues,
  Member,
  Event,
} from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { musicianService } from '@/services'
import EventModal from '@/components/modals/event-modal'
import MemberModal from '../modals/member-modal'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { musicianFormSchema } from '@/lib/schemas'
import { Input, Option, Select, TextArea } from '@/components/form'
import MemberList from '@/components/member-list'
import EventList from '@/components/event-list'
import { states } from '@/constants'
import { Navigate } from 'react-router-dom'
import AutoComplete from '../autocomplete'

function Register() {
  const [eventModalToggle, setEventModalToggle] = useState(false)
  const [memberModalToggle, setMemberModalToggle] = useState(false)
  const [events, setEvents] = useState<EventModalData[]>([])
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
  const [members, setMembers] = useState<MemberFormValues[]>([])
  const [query, setQuery] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<MusicianFormValues>({
    resolver: zodResolver(musicianFormSchema),
  })

  const {
    data: suggestions,
    error: suggestionError,
    isLoading: isLoadingSuggestions,
  } = useQuery([`musicians/strays/autocomplete?query=${query}`], () =>
    musicianService.strayAutocomplete(query),
  )

  if (suggestionError) {
    toast.error('Error fetching suggestions')
  }

  const selectedEvent = events[selectedItemIndex]
  const selectedMember = members[selectedItemIndex]

  const user = useContext(AuthContext)
  const authDispatch = useContext(AuthDispatchContext)
  const queryClient = useQueryClient()

  if (!user) {
    toast.info('Please login to register as a musician!')
    return <Navigate to={'/'} />
  }

  const createMusicianMutation = useMutation<
    CreateMusicianResponse,
    Error,
    FormData,
    { currentUser: User | undefined }
  >({
    mutationFn: (newVenue) => musicianService.create(newVenue),
    onMutate() {
      const currentUser = queryClient.getQueryData<User>(['me'])

      currentUser &&
        authDispatch &&
        authDispatch({
          type: AuthActionType.Set,
          payload: {
            ...currentUser,
            roles: [...currentUser.roles, UserRoles.Musician],
          },
        })

      return { currentUser }
    },
    onSuccess: () => {
      toast.success('Your musician profile has been created')
    },
    onError: (error, variables, context) => {
      context?.currentUser &&
        authDispatch &&
        authDispatch({
          type: AuthActionType.Set,
          payload: context.currentUser,
        })

      toast.error(
        error.message || 'Something went wrong while creating musician',
      )
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

  const handleEditEvent = (_e: Event | EventModalData, i: number) => {
    setSelectedItemIndex(i)
    setEventModalToggle(true)
  }

  const handleDeleteEvent = (i: number) => {
    const nextEvents = [...events]
    nextEvents.splice(i, 1)
    setEvents(nextEvents)
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

  const handleEventFormSubmit = (values: EventModalData) => {
    if (selectedEvent) {
      const nextEvents = events.slice()
      nextEvents[selectedItemIndex] = values
      setEvents(nextEvents)
      setSelectedItemIndex(-1)
    } else {
      const nextEvents = [...events, values]
      setEvents(nextEvents)
    }
  }

  const handleMusicianFormSubmit: SubmitHandler<MusicianFormValues> = ({
    logo,
    gallery,
    songs,
    address,
    state,
    city,
    ...values
  }) => {
    const musician = {
      ...values,
      members,
      events: events.map((e) => ({ ...e, venue: e.venue._id })),
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

    createMusicianMutation.mutate(payload)
  }

  return (
    <>
      <div className="max-h-[710px] overflow-y-scroll w-[70%] absolute top-[3%] left-[5%] text-white p-5 pb-10 pl-9 flex-col bg-music-elevator-ui bg-full bg-no-repeat">
        <h1 className="text-center text-3xl mb-5 font-bold">
          Register your profile
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit(handleMusicianFormSubmit)}
            className="flex w-[90%] gap-5"
          >
            {/* left-col */}
            <div className="flex-1">
              <div className="w-2/3">
                <label className="block mb-2" htmlFor="name">
                  Name
                </label>
                <AutoComplete
                  name="musician"
                  control={control}
                  isLoadingSuggestions={isLoadingSuggestions}
                  suggestionList={suggestions || []}
                  onQueryChange={(query) => setQuery(query)}
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
        data={selectedEvent}
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

export default Register
