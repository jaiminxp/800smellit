import { Input, Option, Select } from '@/components/form'
import { states } from '@/constants'
import { ProductCategory, ProductType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  state: z.string(),
  city: z.string(),
  type: z.string(),
  category: z.string(),
})

export type FieldValues = z.infer<typeof formSchema>

const defaultValues: FieldValues = {
  state: '',
  city: '',
  type: '',
  category: '',
}

interface Props {
  onSubmit: SubmitHandler<FieldValues>
  onReset: () => void
}

const ProductFilter = ({ onSubmit, onReset }: Props) => {
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
      onSubmit={handleSubmit(onSubmit)}
      onReset={handleReset}
      className="h-min"
    >
      <div>
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
        <label className="inline" htmlFor="type">
          Type:
        </label>
        <Select {...register('type')} id="type" className="w-8/12">
          <Option value="" key={-1}>
            Select Type
          </Option>
          {Object.keys(ProductType).map((type) => (
            <Option value={type.toLowerCase()} key={type}>
              {type}
            </Option>
          ))}
        </Select>
      </div>

      {/* category field */}
      <div className="mt-3 flex justify-between gap-4">
        <label className="inline" htmlFor="category">
          Category:
        </label>
        <Select {...register('category')} id="category" className="w-8/12">
          <Option value="" key={-1}>
            Select Category
          </Option>
          {Object.keys(ProductCategory).map((category) => (
            <Option value={category.toLowerCase()} key={category}>
              {category}
            </Option>
          ))}
        </Select>
      </div>

      <div className="mt-4 flex justify-center gap-5">
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

export default ProductFilter
