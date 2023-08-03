import chain from '@/assets/chain.gif'
import artist from '@/assets/artist-adv.png'
import soda from '@/assets/soda-adv.png'
import { useNavigate } from 'react-router-dom'
import { Musician, MusicianProfileStatus } from '@/types'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { musicianService } from '@/services'
import Gallery from '../gallery'

function Profile() {
  const { data: musician, error } = useQuery<Musician, Error>(
    ['musician-profile'],
    () => musicianService.me()
  )
  const navigate = useNavigate()

  if (error) {
    toast.error(
      error.message || 'Something went wrong fetching musician profile'
    )
  }

  return musician &&
    musician.profileStatus === MusicianProfileStatus.Approved ? (
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
          className={`btn-primary absolute right-10 lock pr-50 mt-5 ${
            musician.revision && 'btn-disabled'
          }`}
          type="button"
          onClick={() => {
            if (musician.revision) {
              toast.info('Please wait for your previous edit to be reviewed')
            } else {
              navigate('/edit-profile', { state: { data: musician } })
            }
          }}
        >
          Edit Profile
        </button>
        <div className="flex flex-col items-center max-w-[70%]">
          <h1 className="text-center text-xl mb-5">Artist Bio</h1>

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

export default Profile
