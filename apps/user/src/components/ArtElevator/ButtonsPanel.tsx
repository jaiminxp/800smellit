import { Link, useMatch, useNavigate, useResolvedPath } from 'react-router-dom'
import button_active from '@/assets/art-button-active.png'
import { ART_ELEVATOR_EXIT } from '@/constants/events'
import { useContext, useState } from 'react'
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
      <div className="absolute w-[258px] h-[445px] right-0 top-[22vh] bg-art-buttons-panel bg-full bg-no-repeat">
        <ElevatorButton
          title="Search Events"
          to="/"
          styles="top-[7.5%] left-[11.7%]"
        />
        <ElevatorButton
          title="Search Artists"
          to="/search-artists"
          styles="top-[16.5%] left-[11.7%]"
        />
        <ElevatorButton
          title="View Art"
          to="/view-art"
          styles="top-[25.5%] left-[11.7%]"
        />
        <ElevatorButton
          title={
            user && user.roles.includes(UserRoles.Artist)
              ? 'Edit Info'
              : 'Register'
          }
          to={'/profile'}
          styles="top-[34.5%] left-[11.7%]"
        />
        <ElevatorButton
          title="Exit"
          styles="top-[44.5%] left-[11.7%]"
          onClick={() => {
            window.dispatchEvent(new CustomEvent(ART_ELEVATOR_EXIT))
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
        'w-[178px] h-[30px] pl-5 flex justify-between items-center absolute text-white' +
        ' ' +
        styles
      }
    >
      {to ? (
        <Link className="font-galada text-lg font-bold" to={to}>
          {title}
        </Link>
      ) : (
        <span className="font-galada text-lg font-bold cursor-pointer">
          {title}
        </span>
      )}
      {(match || hover) && (
        <img
          className="absolute top-[-8px] right-[-7px]"
          width={45}
          src={button_active}
          alt=""
        />
      )}
    </div>
  )
}

export default ButtonsPanel
