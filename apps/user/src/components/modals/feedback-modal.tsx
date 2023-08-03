import { useGameObject } from '@/hooks/useGameObject'
import { HomeScene } from '@/scenes'
import { useContext, useEffect, useState } from 'react'
import { GameContext } from '@/context/gameContext'
import closeIcon from '@/assets/close-icon.svg'
import { toast } from 'react-toastify'
import { FeedBackFormValues, FeedBackResponse } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { utilsService } from '@/services'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feedbackFormSchema } from '@/lib/schemas'
import { Input, TextArea } from '../form'
import { Game } from 'phaser'

const defaultValues: FeedBackFormValues = {
  email: '',
  feedback: '',
}

const FeedbackModal = () => {
  const [display, setDisplay] = useState(false)
  const suggestionBox = useGameObject(HomeScene.sceneId, 'suggestion-box')

  const { game } = useContext(GameContext)

  const openForm = (game: Game) => {
    setDisplay(true)
    game.input.enabled = false
  }

  const closeForm = (game: Game) => {
    setDisplay(false)
    game.input.enabled = true
  }

  useEffect(() => {
    if (game && suggestionBox.gameObject) {
      suggestionBox.gameObject.on(Phaser.Input.Events.POINTER_DOWN, () =>
        openForm(game),
      )
    }
  }, [suggestionBox.gameObject])

  const sendFeedBackMutation = useMutation<
    FeedBackResponse,
    Error,
    FeedBackFormValues
  >({
    mutationFn: (values) => utilsService.sendFeedback(values),
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (error) => {
      toast.error(
        error.message || 'Something went wrong while sending feedback',
      )
    },
  })

  const onSubmit: SubmitHandler<FeedBackFormValues> = (values) => {
    sendFeedBackMutation.mutate(values)
    reset(defaultValues)
    closeForm(game as Game)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedBackFormValues>({
    defaultValues,
    resolver: zodResolver(feedbackFormSchema),
  })

  return game && display ? (
    <div className="absolute w-full h-full top-0 left-0 flex text-white bg-[rgba(0,0,0,0.5)]">
      <div className="relative m-auto bg-orange-800 p-5 pt-10 rounded-lg text-center shadow-lg shadow-zinc-700">
        <h2 className="text-center text-2xl">Feedback</h2>
        <button
          type="button"
          className="hover:bg-orange-900 rounded-lg p-1.5 absolute top-5 right-5"
          onClick={() => closeForm(game)}
        >
          <img className="w-5 h-5 fill-white" src={closeIcon} />
          <span className="sr-only">Close modal</span>
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              {...register('email')}
              type="email"
              className="mt-2 w-full"
              placeholder="Email"
            />
            <p className="mt-2 err-msg">{errors.email?.message}</p>
          </div>

          <div className="mt-3">
            <TextArea
              {...register('feedback')}
              className="w-full mt-2"
              placeholder="Feedback"
            />
            <p className="err-msg mt-2">{errors.feedback?.message}</p>
          </div>

          <button type="submit" className="btn-primary mt-5">
            Submit
          </button>
        </form>
      </div>
    </div>
  ) : null
}

export default FeedbackModal
