import { Input, Option, Select } from '@/components/form'
import { states } from '@/constants'
import { productFormSchema } from '@/lib/schemas'
import {
  ComponentProductFormValues,
  ProductCategory,
  ProductFormValues,
  ProductType,
} from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form'

interface Props {
  onSubmit: SubmitHandler<ProductFormValues>
}

const ProductRegisterForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
  })

  const category = watch('category')
  const errors: FieldErrors<ComponentProductFormValues> = formErrors

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-5">
        {/* left col */}
        <div className="w-6/12">
          <div>
            <label className="block" htmlFor="seller">
              Seller name
            </label>
            <Input
              {...register('seller')}
              id="seller"
              placeholder="Enter your name"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.seller?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="contact">
              Contact
            </label>
            <Input
              {...register('contact')}
              id="contact"
              placeholder="Phone/Email"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.contact?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="address">
              Address
            </label>
            <Input
              {...register('address')}
              id="address"
              placeholder="Address"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.address?.message}</p>
          </div>

          <div className="mt-3">
            <div className="flex justify-between gap-4">
              <label className="inline" htmlFor="state">
                State:
              </label>
              <Select
                {...register('state')}
                id="state"
                className="form-control w-8/12"
              >
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
        </div>

        {/* right col */}
        <div className="w-6/12">
          <div>
            <label className="inline" htmlFor="type">
              Type
            </label>
            <Select
              {...register('type')}
              className="w-full mt-2"
              name="type"
              id="type"
            >
              <Option key={-1} value="">
                -Select Type-
              </Option>
              {Object.keys(ProductType).map((type) => (
                <Option value={type.toLowerCase()} key={type}>
                  {type}
                </Option>
              ))}
            </Select>
            <p className="err-msg mt-2">{errors.type?.message}</p>
          </div>

          <div className="mt-3">
            <label className="inline" htmlFor="category">
              Category
            </label>
            <Select
              {...register('category')}
              id="category"
              className="w-full mt-2"
            >
              <Option key={-1} value="">
                -Select Category-
              </Option>
              {Object.keys(ProductCategory).map((category) => (
                <Option value={category.toLowerCase()} key={category}>
                  {category}
                </Option>
              ))}
            </Select>
            <p className="err-msg mt-2">{errors.category?.message}</p>
          </div>

          <div className="mt-3">
            <label className="block" htmlFor="instrument">
              Instrument
            </label>
            <Input
              {...register('instrument')}
              id="instrument"
              placeholder="Instrument"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.instrument?.message}</p>
          </div>

          {category === ProductCategory.Component ? (
            <div className="mt-3">
              <label className="block" htmlFor="component">
                Component
              </label>
              <Input
                {...register('component')}
                id="component"
                placeholder="Component"
                className="w-full mt-2"
              />
              <p className="err-msg mt-2">{errors.component?.message}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <button type="submit" className="btn-primary">
          Submit
        </button>
      </div>
    </form>
  )
}

export default ProductRegisterForm
