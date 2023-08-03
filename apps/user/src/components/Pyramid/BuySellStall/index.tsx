import Buy from './buy'
import { Link, Route, Routes } from 'react-router-dom'
import Sell from './sell'
import basketImg from '@/assets/basket.png'
import saleImg from '@/assets/sale-banner.png'

const BuySellStall = () => {
  return (
    <div className="w-full h-[85%] flex justify-center items-start text-white p-5">
      <div className="flex flex-col w-full h-full max-w-[1400px]">
        <Routes>
          <Route path="/" element={<Buy />} />
          <Route path="/sell" element={<Sell />} />
        </Routes>
        <div className="flex items-center justify-around mt-3">
          <Link
            to={'/'}
            className="glow-container flex items-center gap-3 clickable"
          >
            <h3 className="text-[2.625rem] font-galada glow-text mt-3">
              Buy Stuff
            </h3>
            <img className="glow-filter h-[126px]" src={basketImg} alt="" />
          </Link>
          <Link
            to={'/sell'}
            className="glow-container flex items-center gap-3 clickable"
          >
            <img className="glow-filter h-[126px]" src={saleImg} alt="" />
            <h3 className="text-[2.625rem] font-galada glow-text">
              Sell Stuff
            </h3>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BuySellStall
