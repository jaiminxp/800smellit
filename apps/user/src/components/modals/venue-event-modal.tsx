import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import closeIcon from '@/assets/close-icon.svg'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Option, Select } from '../form'
import {
  EventType,
  Suggestion,
  VenueEventFormValues,
  VenueEventModalData,
} from '@/types'
import { venueEventFormSchema } from '@/lib/schemas'
import { useQuery } from '@tanstack/react-query'
import { artistService, musicianService } from '@/services'
import AutoComplete from '../autocomplete'
import addIcon from '@/assets/icons/add.svg'
import ArtistModal from './artist-modal'

interface Props {
  data?: VenueEventModalData | null
  toggle: boolean
  onToggle: () => void
  onSubmit: (values: VenueEventModalData) => void
}

const defaultValues: VenueEventFormValues = {
  name: '',
  genre: '',
  date: '',
  time: '',
  type: EventType.Music,
  artist: {
    _id: '',
    name: '',
  },
}

const VenueEventModal = ({ toggle, onToggle, data, onSubmit }: Props) => {
  const [query, setQuery] = useState('')
  const [modalToggle, setModalToggle] = useState(false)

  let fieldValues: VenueEventFormValues | null = null
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
    setValue,
  } = useForm<VenueEventFormValues>({
    resolver: zodResolver(venueEventFormSchema),
    defaultValues: defaultValues,
    values: fieldValues || defaultValues,
  })

  const type = watch('type')

  const {
    data: suggestions,
    error: suggestionError,
    isRefetching: isLoadingSuggestions,
    refetch: fetchSuggestions,
  } = useQuery<Suggestion[] | undefined>(
    [`${type}/autocomplete?query=${query}`],
    () => {
      if (type === EventType.Music) {
        return musicianService.autocomplete(query)
      } else if (type === EventType.Art) {
        return artistService.autocomplete(query)
      }
    },
    { enabled: false }
  )

  if (suggestionError) {
    toast.error('Error fetching suggestions')
  }

  useEffect(() => {
    setValue('artist', { _id: '', name: '' })
  }, [type, setValue])

  useEffect(() => {
    if (query && type) {
      fetchSuggestions()
    }
  }, [query, type, fetchSuggestions])

  const handleFormSubmit: SubmitHandler<VenueEventFormValues> = (values) => {
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
        <div className="bg-orange-800 p-5 w-5xl rounded-lg relative">
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

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="w-full h-min"
          >
            <div>
              <label htmlFor="type">Event type</label>

              <Select {...register('type')} id="type" className="mt-2 w-full">
                {Object.entries(EventType).map(([key, value]) => (
                  <Option key={key} value={value}>
                    {key}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="relative w-full mt-3">
              <label className="inline" htmlFor="venue">
                Artist
              </label>
              <div className="mt-2">
                <AutoComplete
                  initialValue={data?.artist.name || ''}
                  name="artist"
                  control={control}
                  isLoadingSuggestions={isLoadingSuggestions}
                  suggestionList={suggestions || []}
                  onQueryChange={(query) => setQuery(query)}
                  actionItem={{
                    label: 'Create new artist',
                    action: () => setModalToggle(true),
                    icon: (
                      <img
                        alt="plus icon"
                        className="w-6 h-auto"
                        src={addIcon}
                      />
                    ),
                  }}
                />
              </div>
              <p className="err-msg mt-2">{errors.artist?.message}</p>
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
                {data ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ArtistModal
        toggle={modalToggle}
        onToggle={() => setModalToggle(!modalToggle)}
      />
    </>
  )
}

export default VenueEventModal
