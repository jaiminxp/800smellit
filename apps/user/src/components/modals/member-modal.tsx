import { MemberFormValues } from '@/types'
import closeIcon from '@/assets/close-icon.svg'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/form'
import { memberFormSchema } from '@/lib/schemas'

interface Props {
  data?: MemberFormValues | null
  toggle: boolean
  onToggle: () => void
  onSubmit: (values: MemberFormValues) => void
}

const defaultValues = {
  name: '',
  role: '',
  instrument: '',
}

const MemberModal = ({ data, onSubmit, toggle, onToggle }: Props) => {
  let fieldValues: MemberFormValues | null = null
  if (data) {
    fieldValues = data
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: defaultValues,
    values: fieldValues || defaultValues,
  })

  const handleFormSubmit: SubmitHandler<MemberFormValues> = (values) => {
    onSubmit(values) //call the parent submit function
    reset(defaultValues)
    onToggle() //close the modal
  }

  if (!toggle) {
    return null
  }

  return (
    <div className="z-10 absolute top-0 left-0 w-full h-full flex justify-center items-center text-white bg-[rgba(0,0,0,0.5)]">
      <div className="bg-orange-800 p-5 w-4/12 max-w-[500px] rounded-lg relative">
        <h2 className="text-2xl text-center border-b-2 pb-5 mt-5 mb-3">
          Band Members Details
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

        <div className="w-full flex gap-3">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex-1 h-min"
          >
            <div>
              <div className="flex justify-between items-center gap-4">
                <label className="inline" htmlFor="name">
                  Name:
                </label>
                <Input
                  {...register('name')}
                  placeholder="Name"
                  id="instrument"
                  className="w-2/3 ml-auto"
                />
              </div>
              <p className="err-msg mt-2">{errors.name?.message}</p>
            </div>

            <div className="mt-3">
              <div className="flex justify-between items-center gap-4">
                <label className="inline" htmlFor="role">
                  Role:
                </label>
                <Input
                  {...register('role')}
                  placeholder="Role"
                  id="role"
                  className="w-2/3 ml-auto"
                />
              </div>
              <p className="err-msg mt-2">{errors.role?.message}</p>
            </div>

            <div className="mt-3 border-b-2 pb-4">
              <div className="flex justify-between items-center gap-4">
                <label className="inline" htmlFor="instrument">
                  Instrument:
                </label>
                <Input
                  {...register('instrument')}
                  placeholder="Instrument"
                  id="instrument"
                  className="w-2/3 ml-auto"
                />
              </div>
              <p className="err-msg mt-2">{errors.instrument?.message}</p>
            </div>

            <div className="flex justify-center mt-5">
              <button className="btn-primary">
                {data ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MemberModal
