import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import closeIcon from '@/assets/close-icon.svg'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../form'
import { EventFormValues, EventModalData } from '@/types'
import { eventFormSchema } from '@/lib/schemas'
import { useQuery } from '@tanstack/react-query'
import { venueService } from '@/services'
import Map from '../map'
import AutoComplete from '../autocomplete'
import addIcon from '@/assets/icons/add.svg'
import VenueModal from './venue-modal'

interface EventModalProps {
  data?: EventModalData | null
  toggle: boolean
  onToggle: () => void
  onSubmit: (values: EventModalData) => void
}

const defaultValues: EventModalData = {
  name: '',
  genre: '',
  date: '',
  time: '',
  venue: {
    _id: '',
    name: '',
  },
}

const EventModal = ({ toggle, onToggle, data, onSubmit }: EventModalProps) => {
  const [venueQuery, setVenueQuery] = useState('')
  const [venueModalToggle, setVenueModalToggle] = useState(false)

  const {
    data: venueSuggestions,
    refetch: fetchVenueSuggestions,
    error: suggestionError,
    isLoading: isLoadingSuggestions,
  } = useQuery(
    [`venues/autocomplete?query=${venueQuery}`],
    () => venueService.autocomplete(venueQuery),
    {
      enabled: false,
    }
  )

  if (suggestionError) {
    toast.error('Something went wrong in fetching list of venues')
  }

  let fieldValues: EventFormValues | null = null
  if (data) {
    fieldValues = data
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    control,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultValues,
    values: fieldValues || defaultValues,
  })

  const venue = watch('venue')

  const {
    data: selectedVenue,
    refetch: fetchSelectedVenue,
    error: selectedVenueError,
  } = useQuery(
    [`venues/${venue._id}`],
    () => venueService.findById(venue._id),
    {
      enabled: !!venue._id,
    }
  )

  if (selectedVenueError) {
    toast.error('Something went wrong in fetching selected venue')
  }

  useEffect(() => {
    fetchVenueSuggestions()
  }, [venueQuery, fetchVenueSuggestions])

  useEffect(() => {
    if (!venue._id) return
    fetchSelectedVenue()
  }, [venue, fetchSelectedVenue])

  const handleFormSubmit: SubmitHandler<EventFormValues> = (values) => {
    onSubmit(values) //call the parent submit function
    reset(defaultValues)
    onToggle() //close the modal
  }

  if (!toggle) {
    return null
  }

  return (
    <>
      <div className="z-10 absolute top-0 left-0 w-full h-full flex justify-center items-center text-white bg-[rgba(0,0,0,0.5)]">
        <div className="bg-orange-800 p-5 w-2/3 max-w-5xl rounded-lg relative">
          <h2 className="text-2xl text-center border-b-2 pb-5 mt-5 mb-3">
            Enter event information
          </h2>
          <button
            type="button"
            className="absolute top-5 right-5 hover:bg-orange-900 rounded-lg p-1.5"
            onClick={() => onToggle()}
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
              <div className="relative w-full">
                <label className="inline" htmlFor="venue">
                  Venue
                </label>
                <div className="mt-2">
                  <AutoComplete
                    initialValue={data?.venue.name || ''}
                    name="venue"
                    control={control}
                    isLoadingSuggestions={isLoadingSuggestions}
                    suggestionList={venueSuggestions || []}
                    onQueryChange={(query) => setVenueQuery(query)}
                    actionItem={{
                      label: 'Create new venue',
                      action: () => setVenueModalToggle(true),
                      icon: (
                        <img
                          className="w-6 h-auto"
                          src={addIcon}
                          alt="plus icon"
                        />
                      ),
                    }}
                  />
                </div>
                <p className="err-msg mt-2">{errors.venue?.message}</p>
              </div>

              <div className="mt-3">
                <label className="inline-block" htmlFor="name">
                  Name of Event
                </label>
                <Input
                  {...register('name')}
                  placeholder="Event name"
                  id="name"
                  className="w-full mt-2"
                />
                <p className="err-msg mt-2">{errors.name?.message}</p>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center gap-4">
                  <label className="inline" htmlFor="genre">
                    Genre:
                  </label>
                  <Input
                    {...register('genre')}
                    placeholder="Genre"
                    id="genre"
                    className="w-2/3 ml-auto"
                  />
                </div>
                <p className="err-msg mt-2">{errors.genre?.message}</p>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center gap-4">
                  <label className="inline" htmlFor="date">
                    Date:
                  </label>
                  <Input
                    {...register('date')}
                    type="date"
                    id="date"
                    className="w-2/3 ml-auto"
                  />
                </div>
                <p className="err-msg mt-2">{errors.date?.message}</p>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center gap-4">
                  <label className="inline" htmlFor="time">
                    Time:
                  </label>
                  <Input
                    {...register('time')}
                    type="time"
                    id="time"
                    className="w-2/3 ml-auto"
                  />
                </div>
                <p className="err-msg mt-2">{errors.time?.message}</p>
              </div>

              <div className="flex justify-center mt-5">
                <button className="btn-primary">
                  {data ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </form>
            <div className="flex-1">
              <Map
                containerStyle="w-full h-full"
                location={selectedVenue?.geometry?.coordinates}
              />
            </div>
          </div>
        </div>
      </div>

      <VenueModal
        toggle={venueModalToggle}
        onToggle={() => setVenueModalToggle(!venueModalToggle)}
      />
    </>
  )
}

export default EventModal
