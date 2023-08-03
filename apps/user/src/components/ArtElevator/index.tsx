import { AuthContext } from '@/context/authContext'
import { useContext, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ART_ELEVATOR_ENTER, ART_ELEVATOR_EXIT } from '@/constants/events'
import Header from '../Header'
import ButtonsPanel from './ButtonsPanel'
import EditProfile from './edit-profile'
import Profile from './Profile'
import Register from './register'
import SearchArtists from './search-artists'
import SearchEvents from './search-events'
import artSignImg from '@/assets/art-sign.png'
import PublicProfile from './PublicProfile'
import { UserRoles } from '@/types'
import { LightBoxContext } from '@/context/lightbox-context'
import LightBox from '../lightbox'

function ArtElevator() {
  const [showUI, setShowUI] = useState(false)

  const user = useContext(AuthContext)
  const { image, setImage } = useContext(LightBoxContext)

  window.addEventListener(ART_ELEVATOR_ENTER, () => {
    setShowUI(true)
  })

  window.addEventListener(ART_ELEVATOR_EXIT, () => setShowUI(false))

  const render = (
    <>
      <div className="flex flex-1 w-full h-full absolute overflow-hidden">
        <Header showVolumeControls={true} />
        <img
          className="absolute top-2 left-2 z-10 w-[200px]"
          src={artSignImg}
          alt="art sign"
        />

        <Routes>
          <Route path="/" element={<SearchEvents />} />
          <Route path="search-events" element={<SearchEvents />} />
          <Route path="search-artists" element={<SearchArtists />} />
          <Route
            path="profile"
            element={
              user && user.roles.includes(UserRoles.Artist) ? (
                <Profile />
              ) : (
                <Register />
              )
            }
          />
          <Route path="edit-profile" element={<EditProfile />} />

          <Route path="view-public-profile/:id" element={<PublicProfile />} />
        </Routes>
        <ButtonsPanel></ButtonsPanel>
      </div>

      <LightBox image={image} onClose={() => setImage(null)} />
    </>
  )

  return showUI ? render : null
}

export default ArtElevator
