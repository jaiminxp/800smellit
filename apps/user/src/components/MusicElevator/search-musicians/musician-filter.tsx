import { Input, Option, Select } from '@/components/form'
import { states } from '@/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string(),
  genre: z.string(),
  state: z.string(),
  city: z.string(),
})

export type FieldValues = z.infer<typeof formSchema>

interface Props {
  onSubmit: SubmitHandler<FieldValues>
}

const MusicianFilter = ({ onSubmit }: Props) => {
  const { register, handleSubmit } = useForm<FieldValues>({
    resolver: zodResolver(formSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between gap-4 items-center">
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

      <div className="mt-3 flex justify-between gap-4 items-center">
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

      <div className="mt-3 flex justify-between gap-4 items-center">
        <label className="inline" htmlFor="city">
          Genre:
        </label>
        <Input
          {...register('genre')}
          className="w-8/12"
          id="genre"
          placeholder="Genre"
        />
      </div>

      <div className="mt-3">
        <label className="inline" htmlFor="name">
          Search by artist name:
        </label>
        <Input
          {...register('name')}
          className="w-full mt-2"
          id="name"
          placeholder="Name"
        />
      </div>

      <button type="submit" className="btn-primary block ml-5 mt-8">
        SEARCH
      </button>
    </form>
  )
}

export default MusicianFilter
