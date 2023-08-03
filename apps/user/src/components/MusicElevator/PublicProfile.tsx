import chain from '@/assets/chain.gif'
import artist from '@/assets/artist-adv.png'
import soda from '@/assets/soda-adv.png'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { musicianService } from '@/services'
import { toast } from 'react-toastify'
import { Musician, MusicianProfileStatus } from '@/types'
import Gallery from '../gallery'

function PublicProfile() {
  const navigate = useNavigate()
  const { id } = useParams()

  if (!id) {
    throw new Error('Id is required')
  }

  const { data: musician, error } = useQuery<Musician, Error>(
    [`musician/${id}`],
    () => musicianService.findById(id)
  )

  if (error) {
    toast.error(error.message || 'Something went wrong while fetching musician')
  }

  return musician?.profileStatus === MusicianProfileStatus.Approved ? (
    <div className="w-[70%] absolute top-[5%] left-[5%] text-white p-5 pb-10 pl-9 bg-music-elevator-ui bg-full bg-no-repeat">
      {/* advertisement banner 1 */}
      <div className="absolute">
        <div className="relative -left-[43%] -rotate-45">
          <img src={chain} alt="" />
          <img
            src={artist}
            alt=""
            className="slide-anim-1 w-56 relative -top-20 left-[40%]"
          />
        </div>
      </div>

      {/* advertisement banner 2 */}
      <div className="absolute">
        <div className="relative left-[47%] top-[35rem] -rotate-45">
          <img src={chain} alt="" />
          <img
            src={soda}
            alt=""
            className="slide-anim-2 w-16 relative -top-20 left-[40%]"
          />
        </div>
      </div>

      <div className="bg-profile bg-full flex justify-center">
        <button
          className="btn-primary absolute right-10 lock pr-50 mt-5"
          type="button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <div className="flex flex-col items-center max-w-[70%]">
          <h1 className="text-center text-xl mb-5">Artist Info</h1>

          <img src={musician?.logo?.url} alt="" className="w-1/6" />

          <p className="m-5">Artist Name: {musician.name}</p>
          <br />
          {musician.gallery && musician.gallery?.length > 0 && (
            <Gallery images={musician.gallery} />
          )}

          <span className="m-5">
            Website:
            <a className="inline-block link pl-2" href={musician.website}>
              {musician.website}
            </a>
          </span>

          <p className="m-5">
            BAND MEMBERS:
            {musician.members?.length === 0
              ? ' - '
              : musician.members?.map((items) => {
                  return ' ' + items.name + ','
                })}
          </p>

          <p className="m-5">Influences: {musician.influences}</p>

          <p className="m-5">Band Information: {musician.bio}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-[70%] h-5/6 absolute top-[5%] left-[5%] text-white p-5 pb-10 pl-9 bg-music-elevator-ui bg-full bg-no-repeat">
      <div className="h-full w-full flex justify-center items-center">
        <h2 className="text-3xl bg-gradient-to-r from-black to-gray-700 p-5">
          Profile is being reviewed
        </h2>
      </div>
    </div>
  )
}

export default PublicProfile
