import { useState, useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MUSIC_ELEVATOR_ENTER, MUSIC_ELEVATOR_EXIT } from '@/constants/events'
import ButtonsPanel from './ButtonsPanel'
import Profile from './Profile'
import Register from './register'
import SearchMusicians from './search-musicians'
import SearchEvent from './search-events'
import Header from '../Header'
import { AuthContext } from '@/context/authContext'
import EditProfile from './edit-profile'
import musicSignImg from '@/assets/music-sign.png'
import PlayMusic from './play-music'
import PublicProfile from './PublicProfile'
import { UserRoles } from '@/types'
import LightBox from '../lightbox'
import { LightBoxContext } from '@/context/lightbox-context'

function MusicElevator() {
  const [showUI, setShowUI] = useState(false)

  const user = useContext(AuthContext)
  const { image, setImage } = useContext(LightBoxContext)

  //event listeners for toggling the UI
  window.addEventListener(MUSIC_ELEVATOR_ENTER, () => {
    setShowUI(true)
  })

  window.addEventListener(MUSIC_ELEVATOR_EXIT, () => setShowUI(false))

  const render = (
    <>
      <div className="flex flex-1 w-full h-full bg-full bg-no-repeat absolute overflow-hidden">
        <Header showVolumeControls={true} />
        <img
          className="absolute top-2 left-2 z-10 w-[200px]"
          src={musicSignImg}
        />

        <Routes>
          <Route path="/" element={<SearchEvent />} />
          <Route path="search-events" element={<SearchEvent />} />
          <Route path="search-artists" element={<SearchMusicians />} />
          <Route path="play-music" element={<PlayMusic />} />

          {/* if user does not have a musician profile, display the register form */}
          <Route
            path="profile"
            element={
              user && user.roles.includes(UserRoles.Musician) ? (
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

export default MusicElevator
