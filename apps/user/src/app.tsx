import { Game } from './components/Game'
import MusicElevatorUI from './components/MusicElevator'
import ArtElevatorUI from './components/ArtElevator'
import PoetryElevatorUI from './components/PoetryElevator'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { AuthProvider } from './context/authContext'
import { GameContextProvider } from './context/gameContext'
import FeedbackModal from './components/modals/feedback-modal'
import Splash from './components/Splash'
import PyramidUI from './components/Pyramid'
import HomePageUI from './components/HomePage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LightBoxContextProvider } from './context/lightbox-context'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GameContextProvider>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            theme="colored"
          />
          <Game />
          <Splash />
          <LightBoxContextProvider>
            <HomePageUI />
            <FeedbackModal />
            <MusicElevatorUI />
            <ArtElevatorUI />
            <PoetryElevatorUI />
            <PyramidUI />
          </LightBoxContextProvider>
        </GameContextProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
