import { Input, Option, Select } from '@/components/form'
import { states } from '@/constants'
import { formatDate } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z
  .object({
    state: z.string(),
    city: z.string(),
    genre: z.string(),
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (new Date(endDate) < new Date(startDate)) {
      ctx.addIssue({
        message: 'End date must be later than the start date',
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
      })
    } else if (new Date(endDate) < new Date())
      ctx.addIssue({
        message: 'End date must be later than today',
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
      })
  })

type FieldValues = z.infer<typeof formSchema>

interface Props {
  onSubmit: SubmitHandler<FieldValues>
}

const EventFilter = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: formatDate(new Date()),
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="m-2">
      {/* state field */}
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

      {/* city field */}
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

      {/* genre field */}
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

      {/* name field */}
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

      {/* Date fields */}
      <div className="mt-3">
        <p>Search by date</p>
        <div className="flex items-center gap-3">
          <Input
            {...register('startDate')}
            type="date"
            className="w-full"
            id="startDate"
          />
          <Input
            {...register('endDate')}
            type="date"
            className="w-full"
            id="startDate"
          />
        </div>

        <p className="mt-2 err-msg">{errors.endDate?.message}</p>
      </div>

      <button type="submit" className="btn-primary mt-5">
        SEARCH
      </button>
    </form>
  )
}

export default EventFilter
