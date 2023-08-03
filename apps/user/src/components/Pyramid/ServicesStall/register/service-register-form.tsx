import { Input, Option, Select } from '@/components/form'
import { states } from '@/constants'
import { serviceFormSchema } from '@/lib/schemas'
import { ServiceDomain, ServiceFormValues } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

interface Props {
  onSubmit: SubmitHandler<ServiceFormValues>
}

const ServiceRegisterForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-5">
        {/* left col */}
        <div className="w-6/12">
          <div>
            <label className="block" htmlFor="name">
              Service name
            </label>
            <Input
              {...register('name')}
              id="name"
              placeholder="Enter service name"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.name?.message}</p>
          </div>

          <div className="mt-3">
            <label className="inline" htmlFor="domain">
              Service Type
            </label>
            <Select {...register('domain')} id="domain" className="w-full mt-2">
              <Option value="" key={-1}>
                Select Type
              </Option>
              {Object.keys(ServiceDomain).map((type) => (
                <Option value={type.toLowerCase()} key={type}>
                  {type}
                </Option>
              ))}
            </Select>
            <p className="err-msg mt-2">{errors.domain?.message}</p>
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
            <label className="block" htmlFor="expert">
              Expert name
            </label>
            <Input
              {...register('expert')}
              id="expert"
              placeholder="Expert name"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.expert?.message}</p>
          </div>

          <div className="mt-3">
            <label className="inline" htmlFor="contact">
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
            <label className="block" htmlFor="website">
              Website
            </label>
            <Input
              {...register('website')}
              type="url"
              id="website"
              placeholder="Website"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.website?.message}</p>
          </div>
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

export default ServiceRegisterForm
