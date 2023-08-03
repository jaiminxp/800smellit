import { Link, useMatch, useNavigate, useResolvedPath } from 'react-router-dom'
import { POETRY_ELEVATOR_EXIT } from '@/constants/events'
import { useState } from 'react'

import viewActive from '@/assets/view-poems-active.png'
import viewInactive from '@/assets/view-poems-inactive.png'
import searchActive from '@/assets/search-active.png'
import searchInactive from '@/assets/search-inactive.png'
import registerActive from '@/assets/register-active.png'
import registerInactive from '@/assets/register-inactive.png'
import exitActive from '@/assets/exit-active.png'
import exitInactive from '@/assets/exit-inactive.png'
import { ElevatorButtonProps } from '@/types'

function ButtonsPanel() {
  const [title, setTitle] = useState('Login')
  const [authState, setAuthState] = useState(false)
  const navigate = useNavigate()

  function onClick() {
    if (title === 'Login') {
      setTitle('Logout')
      setAuthState(true)
    } else {
      setTitle('Login')
      setAuthState(false)
    }
  }

  return (
    <>
      <button
        className="btn-primary absolute right-20 block mt-5 ml-2"
        type="button"
        onClick={onClick}
      >
        {title}
      </button>

      <div className="absolute w-[249px] h-[382px] right-0 top-[22vh] bg-poetry-buttons-panel bg-contain bg-no-repeat">
        <ElevatorButton
          active={viewActive}
          inactive={viewInactive}
          to="/view-poems"
          styles="top-[28.5%] left-[21%]"
        />
        <ElevatorButton
          active={searchActive}
          inactive={searchInactive}
          to="/search"
          styles="top-[41%] left-[21%]"
        />
        <ElevatorButton
          active={registerActive}
          inactive={registerInactive}
          to={authState ? '/profile-poetry' : '/register-poetry'}
          styles="top-[53.5%] left-[21%]"
        />
        <ElevatorButton
          active={exitActive}
          inactive={exitInactive}
          styles="top-[66%] left-[21%]"
          onClick={() => {
            window.dispatchEvent(new CustomEvent(POETRY_ELEVATOR_EXIT))
            navigate('/')
          }}
        />
      </div>
    </>
  )
}

interface PoetryElevatorButtonProps extends Omit<ElevatorButtonProps, 'title'> {
  active: string
  inactive: string
}

function ElevatorButton({
  active,
  inactive,
  to,
  styles = '',
  onClick,
}: PoetryElevatorButtonProps) {
  const [hover, setHover] = useState(false)
  const resolved = useResolvedPath(to || '')
  const match = useMatch({ path: resolved.pathname, end: true })

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={
        'w-[150px] h-[35px] flex justify-center items-center absolute text-white' +
        ' ' +
        styles
      }
    >
      {to ? (
        <Link className="font-galada text-lg font-bold" to={to}>
          <img className="" src={match || hover ? active : inactive} alt="" />
        </Link>
      ) : (
        <span className="font-galada text-lg font-bold cursor-pointer">
          <img className="" src={match || hover ? active : inactive} alt="" />
        </span>
      )}
    </div>
  )
}

export default ButtonsPanel
