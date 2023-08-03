import { Input, Option, Select } from '@/components/form'
import { states } from '@/constants'
import { tutorFormSchema } from '@/lib/schemas'
import { TutorAvalibility, TutorFormValues, TutorSubject } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

interface Props {
  onSubmit: SubmitHandler<TutorFormValues>
}

const TutorRegisterForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TutorFormValues>({
    resolver: zodResolver(tutorFormSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-5">
        {/* left col */}
        <div className="w-6/12">
          <div>
            <label className="block" htmlFor="name">
              Tutor name
            </label>
            <Input
              {...register('name')}
              id="name"
              placeholder="Enter your name"
              className="w-full mt-2"
            />
            <p className="err-msg mt-2">{errors.name?.message}</p>
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
            <label className="inline" htmlFor="subject">
              Subject:
            </label>
            <Select
              {...register('subject')}
              id="subject"
              className="w-full mt-2"
            >
              <Option value="" key={-1}>
                Select Subject
              </Option>
              {Object.keys(TutorSubject).map((subject) => (
                <Option value={subject.toLowerCase()} key={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
            <p className="err-msg mt-2">{errors.subject?.message}</p>
          </div>

          <div className="mt-3">
            <label className="inline" htmlFor="availability">
              Availability
            </label>
            <Select
              {...register('availability')}
              id="availability"
              className="w-full mt-2"
            >
              <Option value="" key={-1}>
                Select availability
              </Option>
              {Object.entries(TutorAvalibility).map(([key, avalibility]) => (
                <Option value={avalibility.toLowerCase()} key={avalibility}>
                  {key}
                </Option>
              ))}
            </Select>
            <p className="err-msg mt-2">{errors.availability?.message}</p>
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

export default TutorRegisterForm
