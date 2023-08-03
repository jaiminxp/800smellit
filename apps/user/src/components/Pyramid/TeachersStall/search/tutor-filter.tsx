import { Input, Option, Select } from '@/components/form'
import { states } from '@/constants'
import { TutorAvalibility, TutorSubject } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  state: z.string(),
  city: z.string(),
  subject: z.string(),
  availability: z.string(),
})

export type FieldValues = z.infer<typeof formSchema>

const defaultValues: FieldValues = {
  state: '',
  city: '',
  subject: '',
  availability: '',
}

interface Props {
  onSubmit: SubmitHandler<FieldValues>
  onReset: () => void
}

const TutorFilter = ({ onSubmit, onReset }: Props) => {
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  const handleReset = () => {
    reset(defaultValues)
    onReset()
  }

  return (
    <form
      className="h-min"
      onSubmit={handleSubmit(onSubmit)}
      onReset={handleReset}
    >
      <div className="flex justify-between gap-4">
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

      <div className="mt-3 flex justify-between gap-4">
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

      <div className="mt-3 flex justify-between gap-4">
        <label className="inline" htmlFor="subject">
          Subject:
        </label>
        <Select {...register('subject')} id="subject" className="w-8/12">
          <Option value="" key={-1}>
            Select Subject
          </Option>
          {Object.keys(TutorSubject).map((subject) => (
            <Option value={subject.toLowerCase()} key={subject}>
              {subject}
            </Option>
          ))}
        </Select>
      </div>

      <div className="mt-3 flex justify-between gap-4">
        <label className="inline" htmlFor="availability">
          Availability:
        </label>
        <Select
          {...register('availability')}
          id="availability"
          className="w-8/12"
        >
          <Option value="" key={-1}>
            Select Availability
          </Option>
          {Object.entries(TutorAvalibility).map(([key, avalibility]) => (
            <Option value={avalibility.toLowerCase()} key={avalibility}>
              {key}
            </Option>
          ))}
        </Select>
      </div>

      <div className="flex justify-center gap-5 mt-4">
        <button type="reset" className="btn-secondary">
          Reset
        </button>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </div>
    </form>
  )
}

export default TutorFilter
