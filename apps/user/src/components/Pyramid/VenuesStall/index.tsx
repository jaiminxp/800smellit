import Search from './search'
import { Link, Route, Routes } from 'react-router-dom'
import Register from './register'
import lampImg from '@/assets/lamp.png'
import ticketsImg from '@/assets/tickets.png'
import { venueService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { Venue } from '@/types'
import { useContext } from 'react'
import { AuthContext } from '@/context/authContext'
import { toast } from 'react-toastify'
import Profile from './profile'
import EditVenue from './edit'
import LightBox from '@/components/lightbox'
import { LightBoxContext } from '@/context/lightbox-context'

const VenuesStall = () => {
  const user = useContext(AuthContext)
  const { image, setImage } = useContext(LightBoxContext)

  const {
    data: venues,
    isLoading,
    error,
    refetch,
  } = useQuery<Venue[], Error>(
    ['venues/me'],
    () => venueService.getMyVenues(),
    {
      enabled: user !== null,
    }
  )

  if (error) {
    toast.error('There was an error fetching registered venues')
  }

  // fetch venues when user logs in
  if (!venues && !isLoading && user) {
    refetch()
  }

  return (
    <>
      <div className="w-full h-[calc(100%-140px)] flex justify-center items-start text-white p-5">
        <div className="flex flex-col w-full h-full max-w-[1400px]">
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit" element={<EditVenue />} />
          </Routes>
          <div className="flex items-center justify-around mt-3">
            <Link
              to={'/'}
              className="glow-container flex items-center gap-3 clickable"
            >
              <h3 className="text-[2.625rem] font-galada glow-text mt-3">
                Search Venues
              </h3>
              <img className="glow-filter h-[126px]" src={lampImg} alt="" />
            </Link>
            {venues && venues.length > 0 ? (
              <Link
                to={'/profile'}
                className="glow-container flex items-center gap-3 clickable"
              >
                <img
                  className="glow-filter h-[126px]"
                  src={ticketsImg}
                  alt=""
                />
                <h3 className="text-[2.625rem] font-galada glow-text">
                  Profile
                </h3>
              </Link>
            ) : (
              <Link
                to={'/register'}
                className="glow-container flex items-center gap-3 clickable"
              >
                <img
                  className="glow-filter h-[126px]"
                  src={ticketsImg}
                  alt=""
                />
                <h3 className="text-[2.625rem] font-galada glow-text">
                  Register Venue
                </h3>
              </Link>
            )}
          </div>
        </div>
      </div>

      <LightBox image={image} onClose={() => setImage(null)} />
    </>
  )
}

export default VenuesStall
