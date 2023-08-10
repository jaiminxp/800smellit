import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import EventList from '@/components/event-list'
import { states } from '@/constants'
import { AuthContext, AuthDispatchContext } from '@/context/authContext'
import EventModal from '../modals/event-modal'
import {
  AuthActionType,
  CreateArtistResponse,
  EventModalData,
  User,
  UserRoles,
  ArtistFormValues,
  Event,
} from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { artistService } from '@/services'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { artistFormSchema } from '@/lib/schemas'
import { Input, Option, Select, TextArea } from '../form'
import { Navigate } from 'react-router-dom'
import AutoComplete from '../autocomplete'

function Register() {
  const [eventModalToggle, setEventModalToggle] = useState(false)
  const [events, setEvents] = useState<EventModalData[]>([])
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
  const [query, setQuery] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ArtistFormValues>({
    resolver: zodResolver(artistFormSchema),
  })

  const {
    data: suggestions,
    error: suggestionError,
    isLoading: isLoadingSuggestions,
  } = useQuery([`artists/strays/autocomplete?query=${query}`], () =>
    artistService.strayAutocomplete(query)
  )

  if (suggestionError) {
    toast.error('Error fetching suggestions')
  }

  const selectedEvent = events[selectedItemIndex]

  const user = useContext(AuthContext)
  const authDispatch = useContext(AuthDispatchContext)
  const queryClient = useQueryClient()

  const createArtistMutation = useMutation<
    CreateArtistResponse,
    Error,
    FormData,
    { currentUser: User | undefined }
  >({
    mutationFn: (newVenue) => artistService.create(newVenue),
    onMutate() {
      const currentUser = queryClient.getQueryData<User>(['me'])

      currentUser &&
        authDispatch &&
        authDispatch({
          type: AuthActionType.Set,
          payload: {
            ...currentUser,
            roles: [...currentUser.roles, UserRoles.Artist],
          },
        })

      return { currentUser }
    },
    onSuccess: () => {
      toast.success('Your artist profile has been created')
    },
    onError: (error, variables, context) => {
      context?.currentUser &&
        authDispatch &&
        authDispatch({
          type: AuthActionType.Set,
          payload: context.currentUser,
        })

      toast.error(error.message || 'Something went wrong while creating artist')
    },
  })

  if (!user) {
    toast.info('Please login to register as an artist!')
    return <Navigate to={'/'} />
  }

  const handleEditEvent = (e: Event | EventModalData, i: number) => {
    setSelectedItemIndex(i)
    setEventModalToggle(true)
  }

  const handleDeleteEvent = (i: number) => {
    const nextEvents = [...events]
    nextEvents.splice(i, 1)
    setEvents(nextEvents)
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

  const handleArtistFormSubmit: SubmitHandler<ArtistFormValues> = ({
    gallery,
    address,
    state,
    city,
    ...values
  }) => {
    const artist = {
      ...values,
      events: events.map((e) => ({ ...e, venue: e.venue._id })),
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

    createArtistMutation.mutate(payload)
  }

  return (
    <>
      <div className="max-h-[710px] overflow-y-scroll w-[70%] absolute top-[3%] left-[5%] text-black p-5 pb-10 pl-9 flex-col bg-art-elevator-ui bg-full bg-no-repeat">
        <h1 className="text-center text-3xl mb-5 font-bold">
          Register your profile
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit(handleArtistFormSubmit)}
            className="flex w-[90%] gap-5"
          >
            {/* left-col */}
            <div className="flex-1">
              <div className="w-2/3 text-white">
                <label className="block mb-2" htmlFor="name">
                  Name
                </label>
                <AutoComplete
                  name="artist"
                  control={control}
                  isLoadingSuggestions={isLoadingSuggestions}
                  suggestionList={suggestions || []}
                  onQueryChange={(query) => setQuery(query)}
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
        data={selectedEvent}
        toggle={eventModalToggle}
        onToggle={() => setEventModalToggle(!eventModalToggle)}
        onSubmit={handleEventFormSubmit}
      />
    </>
  )
}

export default Register
