import closeIcon from '@/assets/close-icon.svg'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Option, Select } from '../form'
import { EventOrganizerType, StrayArtist } from '@/types'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { artistService, musicianService } from '@/services'
import Spinner from '../spinner'
import { z } from 'zod'

interface Props {
  toggle: boolean
  onToggle: () => void
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  type: z.nativeEnum(EventOrganizerType, {
    errorMap: (issue, _ctx) => {
      if (_ctx.data === '') {
        return {
          message: 'Select artist type',
        }
      } else {
        return {
          message: `Type must be one of ${EventOrganizerType.Artist}, ${EventOrganizerType.Musician}`,
        }
      }
    },
  }),
})

type FieldValues = z.infer<typeof formSchema>

const defaultValues: FieldValues = {
  name: '',
  type: EventOrganizerType.Musician,
}

const ArtistModal = ({ toggle, onToggle }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    values: defaultValues,
  })

  const type = watch('type')

  const { mutate: createArtist, isLoading } = useMutation<
    StrayArtist,
    Error,
    { name: string }
  >({
    mutationFn: (artist) => {
      if (type === EventOrganizerType.Musician) {
        return musicianService.createStray(artist)
      } else if (type === EventOrganizerType.Artist) {
        return artistService.createStray(artist)
      } else {
        throw new Error(
          `Type must be one of ${EventOrganizerType.Artist}, ${EventOrganizerType.Musician}`
        )
      }
    },
    onSuccess: () => {
      toast.success('Artist created')
      onToggle()
    },
    onError: () => {
      toast.error('There was a problem in creating artist')
    },
    onSettled: () => {
      reset(defaultValues)
      onToggle()
    },
  })

  const handleFormSubmit: SubmitHandler<FieldValues> = (values) => {
    createArtist(values)
  }

  if (!toggle) {
    return null
  }

  return (
    <div className="z-10 absolute top-0 left-0 w-full h-full flex justify-center items-center text-white bg-[rgba(0,0,0,0.5)]">
      <div className="bg-orange-800 p-5 w-5xl rounded-lg relative">
        <h2 className="text-2xl text-center border-b-2 pb-5 mt-5 mb-3">
          Create new artist
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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="h-min">
          <div>
            <label className="inline" htmlFor="type">
              Type
            </label>
            <Select {...register('type')} id="type" className="w-full mt-2">
              {Object.entries(EventOrganizerType).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
            <p className="err-msg mt-2">{errors.type?.message}</p>
          </div>

          <div className="mt-3">
            <label className="inline" htmlFor="name">
              Name
            </label>
            <Input
              {...register('name')}
              placeholder="Artist name"
              id="name"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.name?.message}</p>
          </div>

          <div className="flex justify-center mt-5">
            {isLoading ? (
              <Spinner />
            ) : (
              <button className="btn-primary">Create artist</button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArtistModal
