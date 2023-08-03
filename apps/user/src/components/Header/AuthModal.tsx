import closeIcon from '@/assets/close-icon.svg'
import { MouseEventHandler, useContext } from 'react'
import { toast } from 'react-toastify'
import { AuthDispatchContext } from '@/context/authContext'
import { GameContext } from '@/context/gameContext'
import { authService } from '@/services'
import { AuthActionType, AuthFormValues, AuthResponse } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authFormSchema } from '@/lib/schemas'
import { Input } from '../form'

const defaultValues: AuthFormValues = {
  email: '',
  password: '',
}

interface Props {
  isLogin: boolean
  toggleContent: MouseEventHandler<HTMLButtonElement>
  show: boolean
  handleClose: () => void
}

export default function AuthModal({
  show,
  handleClose,
  isLogin = true,
  toggleContent,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>({
    defaultValues,
    resolver: zodResolver(authFormSchema),
  })

  const loginMutation = useMutation<AuthResponse, Error, AuthFormValues>({
    mutationFn: (values) => authService.login(values),
    onSuccess: (data) => {
      authDispatch &&
        authDispatch({ type: AuthActionType.Set, payload: data.user })

      handleClose()
      reset(defaultValues)
      toast.success('Logged in successfully')
    },
    onError(error) {
      toast.error(error.message || 'Something went wrong while logging in')
    },
  })

  const signupMutation = useMutation<{ success: true }, Error, AuthFormValues>({
    mutationFn: (values) => authService.signup(values),
    onSuccess: () => {
      handleClose()
      reset(defaultValues)
      toast.success('Account created. Verify your email.')
    },
    onError(error) {
      toast.error(error.message || 'Something went wrong while signing up')
    },
  })

  const authDispatch = useContext(AuthDispatchContext)

  const { game } = useContext(GameContext)

  const setGameInput = (gameInput: boolean) => {
    if (game) game.input.enabled = gameInput
  }

  const toggleClass = show ? 'flex' : 'hidden'

  const modalContent = {
    login: {
      title: 'Login',
      footerMsg: "Don't have an acccount?",
      primaryBtnText: 'Login',
      secondaryBtnText: 'Signup',
    },
    signup: {
      title: 'Signup',
      footerMsg: 'Already have an acccount?',
      primaryBtnText: 'Signup',
      secondaryBtnText: 'Login',
    },
  }

  const content = isLogin ? modalContent.login : modalContent.signup

  const onSubmit: SubmitHandler<AuthFormValues> = (values: AuthFormValues) => {
    if (isLogin) {
      loginMutation.mutate(values)
    } else {
      signupMutation.mutate(values)
    }
  }

  return (
    <div
      className={
        toggleClass +
        ' ' +
        'justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-white bg-[rgba(0,0,0,0.5)]'
      }
      onMouseEnter={() => setGameInput(false)}
      onMouseLeave={() => setGameInput(true)}
    >
      <div className="relative w-auto my-6 mx-auto max-w-xl">
        <div className="border-0 rounded-lg shadow-lg shadow-zinc-700 relative flex flex-col w-full  bg-orange-800 outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-2xl pl-40 font-semibold">{content.title}</h3>
            <button
              type="button"
              className="hover:bg-orange-900 rounded-lg p-1.5"
              onClick={handleClose}
            >
              <img
                className="w-5 h-5 fill-white"
                src={closeIcon}
                alt="close icon"
              />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="relative p-9 flex-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email">Email</label>
                <Input
                  {...register('email')}
                  type="email"
                  className="mt-2 w-full"
                  placeholder="Email"
                />
                <p className="mt-2 err-msg">{errors.email?.message}</p>
              </div>

              <div className="mt-3">
                <label htmlFor="password">Password</label>
                <Input
                  {...register('password')}
                  type="password"
                  className="mt-2 w-full"
                  placeholder="Password"
                />
                <p className="mt-2 err-msg">{errors.password?.message}</p>
              </div>

              <div className="flex justify-center mt-5">
                <button type="submit" className="btn-primary">
                  {content.primaryBtnText}
                </button>
              </div>
            </form>

            <div className="flex justify-between gap-5 items-center m-2 mt-4">
              {content.footerMsg}
              <button
                className=" ml-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                onClick={toggleContent}
              >
                {content.secondaryBtnText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
