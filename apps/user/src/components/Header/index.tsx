import { AuthContext, AuthDispatchContext } from '@/context/authContext'
import { authService } from '@/services/auth.service'
import { useState, useContext, Dispatch, SetStateAction } from 'react'
import AuthModal from './AuthModal'
import { useNavigate } from 'react-router-dom'
import exitImg from '@/assets/exit-banner.png'
import { GameContext } from '@/context/gameContext'
import VolumeControls from './VolumeControls'
import { User, AuthActionType } from '@/types'
import { useQueryClient } from '@tanstack/react-query'

export enum VolumeControlsPosition {
  Below = 'below',
  Left = 'Left',
}

interface Props {
  showExitBtn?: boolean
  showVolumeControls?: boolean
  volumeControlsPosition?: VolumeControlsPosition
  exitToScene?: string
}

export default function Header({
  showExitBtn,
  exitToScene,
  showVolumeControls = false,
  volumeControlsPosition = VolumeControlsPosition.Below,
}: Props) {
  const [showSignup, setShowSignup] = useState<boolean>(false)
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const user = useContext(AuthContext)
  const authDispatch = useContext(AuthDispatchContext)
  const queryClient = useQueryClient()

  const navigate = useNavigate()
  const { game } = useContext(GameContext)

  const setGameInput = (gameInput: boolean) => {
    if (game) game.input.enabled = gameInput
  }

  function toggleSignupModal(
    value: boolean,
    setter: Dispatch<SetStateAction<boolean>>
  ) {
    setter(value)
  }

  function toggleModalContent(
    state: boolean,
    setter: Dispatch<SetStateAction<boolean>>
  ) {
    setter(!state)
  }

  function handleLogout() {
    queryClient.setQueryData(['me'], null)
    authService.logout()
    authDispatch && authDispatch({ type: AuthActionType.Delete })
    navigate('/')
  }

  function handleSignup() {
    setIsLogin(false)
    toggleSignupModal(true, setShowSignup)
  }

  function handleLogin() {
    setIsLogin(true)
    toggleSignupModal(true, setShowSignup)
  }

  function handleExit() {
    if (game && exitToScene) {
      const activeScene = game.scene.getScenes(true)[0]

      game.scene.sleep(activeScene.scene.key)
      game.scene.start(exitToScene)
      navigate('/')
    }
  }

  return (
    <>
      <div className="flex justify-between z-10 w-full h-min px-10">
        {showExitBtn && (
          <button className="-mt-5" onClick={handleExit}>
            <img className="h-[80px]" src={exitImg} alt="exit button" />
          </button>
        )}

        <div
          className={`py-5 flex ml-auto ${
            volumeControlsPosition === VolumeControlsPosition.Below
              ? 'flex-col'
              : 'gap-5'
          }`}
        >
          {showVolumeControls &&
            volumeControlsPosition === VolumeControlsPosition.Left && (
              <VolumeControls />
            )}
          <AuthButtons
            user={user}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onLogout={handleLogout}
          />

          {showVolumeControls &&
            volumeControlsPosition === VolumeControlsPosition.Below && (
              <VolumeControls containerStyle="ml-auto mt-4" />
            )}
        </div>
      </div>
      <AuthModal
        isLogin={isLogin}
        handleClose={() => {
          setGameInput(true)
          toggleSignupModal(false, setShowSignup)
        }}
        show={showSignup}
        toggleContent={() => toggleModalContent(isLogin, setIsLogin)}
      />
    </>
  )
}

interface AuthButtonsProps {
  user: User | null
  onSignup: () => void
  onLogin: () => void
  onLogout: () => void
}

function AuthButtons({ user, onSignup, onLogin, onLogout }: AuthButtonsProps) {
  const { game } = useContext(GameContext)

  const setGameInput = (gameInput: boolean) => {
    if (game) game.input.enabled = gameInput
  }

  return user ? (
    <div
      onMouseEnter={() => setGameInput(false)}
      onMouseLeave={() => setGameInput(true)}
    >
      <button
        onClick={onLogout}
        type="button"
        className="btn-primary block pr-50"
      >
        Logout
      </button>
    </div>
  ) : (
    <div
      className="flex gap-5"
      onMouseEnter={() => setGameInput(false)}
      onMouseLeave={() => setGameInput(true)}
    >
      <button
        onClick={onSignup}
        type="button"
        className="btn-primary block pr-50"
      >
        Signup
      </button>
      <button
        onClick={onLogin}
        type="button"
        className="btn-primary block pr-50"
      >
        Login
      </button>
    </div>
  )
}
