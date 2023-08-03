import Search from './search'
import { Link, Route, Routes } from 'react-router-dom'
import Register from './register'
import bagImg from '@/assets/bag.png'
import telescopeImg from '@/assets/telescope.png'

const TeachersStall = () => {
  return (
    <div className="w-full h-[85%] flex justify-center items-start text-white p-5">
      <div className="flex flex-col w-full h-full max-w-[1400px]">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <div className="flex items-center justify-around mt-3">
          <Link
            to={'/'}
            className="glow-container flex items-center gap-3 clickable"
          >
            <h3 className="text-[2.625rem] font-galada glow-text mt-3">
              Search Tutors
            </h3>
            <img className="glow-filter h-[126px]" src={telescopeImg} alt="" />
          </Link>
          <Link
            to={'/register'}
            className="glow-container flex items-center gap-3 clickable"
          >
            <img className="glow-filter h-[126px]" src={bagImg} alt="" />
            <h3 className="text-[2.625rem] font-galada glow-text">Register</h3>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TeachersStall
