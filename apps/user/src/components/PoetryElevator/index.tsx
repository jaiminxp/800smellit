import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { POETRY_ELEVATOR_ENTER, POETRY_ELEVATOR_EXIT } from '@/constants/events'
import ButtonsPanel from './ButtonsPanel'
import Profile from './Profile'
import Register from './Register'
import Search from './Search'
import ViewPoems from './ViewPoems'
import theatreSignImg from '@/assets/theatre-sign.png'

function PoetryElevator() {
  const [showUI, setShowUI] = useState(false)

  window.addEventListener(POETRY_ELEVATOR_ENTER, () => {
    setShowUI(true)
  })

  window.addEventListener(POETRY_ELEVATOR_EXIT, () => setShowUI(false))

  const render = (
    <div className="flex flex-1 w-full h-full absolute">
      <img
        className="absolute top-2 left-2 z-10 w-[200px]"
        src={theatreSignImg}
        alt="theatre sign"
      />

      <Routes>
        <Route path="/" element={<ViewPoems />} />
        <Route path="view-poems" element={<ViewPoems />} />
        <Route path="search" element={<Search />} />
        <Route path="register-poetry" element={<Register />} />
        <Route path="profile-poetry" element={<Profile />} />
      </Routes>
      <ButtonsPanel></ButtonsPanel>
    </div>
  )

  return showUI ? render : null
}

export default PoetryElevator
