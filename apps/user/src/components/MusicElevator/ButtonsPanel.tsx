import { Link, useMatch, useNavigate, useResolvedPath } from 'react-router-dom'
import button_active from '@/assets/button-active.png'
import button_inactive from '@/assets/button-inactive.png'
import { MUSIC_ELEVATOR_EXIT } from '@/constants/events'
import { useState, useContext } from 'react'
import Marquee from '@/components/Marquee'
import { AuthContext } from '@/context/authContext'
import { ElevatorButtonProps, UserRoles } from '@/types'

function ButtonsPanel() {
  const user = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <>
      <div className="absolute bottom-2 overflow-auto">
        {!user && (
          <Marquee
            text={
              'To register as an artist please click on the "Register" button on the elevator panel and fill out the Sign Up form. Click the Sign Up button to move to the next screen to give us information for administrative approval. After filling out you must hit the "Submit" button to send us your information. We will send you a confirmation email with username password after being accepted.'
            }
          />
        )}
      </div>
      <div className="absolute w-[234px] h-[359px] right-[8vh] top-[18vh] bg-music-buttons-panel bg-full bg-no-repeat">
        <ElevatorButton
          title="Search Events"
          to="/"
          styles="top-[12%] left-[14%]"
        />
        <ElevatorButton
          title="Search Artists"
          to="/search-artists"
          styles="top-[29%] left-[14%]"
        />
        <ElevatorButton
          title="Play Music"
          to="/play-music"
          styles="top-[45%] left-[14%]"
        />
        <ElevatorButton
          title={
            user && user.roles.includes(UserRoles.Musician)
              ? 'Edit Info'
              : 'Register'
          }
          to={'/profile'}
          styles="top-[62%] left-[14%]"
        />
        <ElevatorButton
          title="Exit"
          styles="top-[78%] left-[14%]"
          onClick={() => {
            window.dispatchEvent(new CustomEvent(MUSIC_ELEVATOR_EXIT))
            navigate('/')
          }}
        />
      </div>
    </>
  )
}

function ElevatorButton({
  title,
  to,
  styles = '',
  onClick,
}: ElevatorButtonProps) {
  const [hover, setHover] = useState(false)
  const resolved = to && useResolvedPath(to)
  const match = resolved && useMatch({ path: resolved.pathname, end: true })

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={
        'w-[170px] h-[55px] pl-5 text-sm flex justify-between items-center absolute text-white' +
        ' ' +
        styles
      }
    >
      {to ? (
        <Link className="font-economica text-xl font-bold" to={to}>
          {title}
        </Link>
      ) : (
        <span className="font-economica text-xl font-bold cursor-pointer">
          {title}
        </span>
      )}
      {match || hover ? (
        <img className="" width={35} src={button_active} alt="" />
      ) : (
        <img className="" width={35} src={button_inactive} alt="" />
      )}
    </div>
  )
}

export default ButtonsPanel
