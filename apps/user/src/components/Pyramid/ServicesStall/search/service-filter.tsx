import { Input, Option, Select } from '@/components/form'
import { states } from '@/constants'
import { ServiceDomain } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  state: z.string(),
  city: z.string(),
  domain: z.string(),
  expert: z.string(),
  name: z.string(),
})

export type FieldValues = z.infer<typeof formSchema>

const defaultValues: FieldValues = {
  state: '',
  city: '',
  domain: '',
  expert: '',
  name: '',
}

interface Props {
  onSubmit: SubmitHandler<FieldValues>
  onReset: () => void
}

const ServiceFilter = ({ onSubmit, onReset }: Props) => {
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
        <label className="inline" htmlFor="domain">
          Type:
        </label>
        <Select {...register('domain')} id="domain" className="w-8/12">
          <Option value="" key={-1}>
            Select Type
          </Option>
          {Object.keys(ServiceDomain).map((type) => (
            <Option value={type.toLowerCase()} key={type}>
              {type}
            </Option>
          ))}
        </Select>
      </div>

      <div className="mt-3 flex justify-between gap-4">
        <label className="inline" htmlFor="expert">
          Expert:
        </label>
        <Input
          {...register('expert')}
          className="w-8/12"
          id="expert"
          placeholder="Expert name"
        />
      </div>

      <div className="mt-3 flex justify-between gap-4">
        <label className="inline" htmlFor="name">
          Service:
        </label>
        <Input
          {...register('name')}
          className="w-8/12"
          id="name"
          placeholder="Service name"
        />
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

export default ServiceFilter
