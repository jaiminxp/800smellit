import chain from '@/assets/chain.gif'
import art from '@/assets/artist-adv.png'
import soda from '@/assets/soda-adv.png'
import { useNavigate } from 'react-router-dom'
import { Artist, ArtistProfileStatus } from '@/types'
import { toast } from 'react-toastify'
import { artistService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import Gallery from '../gallery'

function Profile() {
  const { data: artist, error } = useQuery<Artist, Error>(
    ['artist-profile'],
    () => artistService.me()
  )
  const navigate = useNavigate()

  if (error) {
    toast.error(error.message || 'Something went wrong fetching artist profile')
  }

  return artist && artist.profileStatus === ArtistProfileStatus.Approved ? (
    <div className="w-[70%] absolute top-[5%] left-[5%] text-white p-5 pb-10 pl-9 bg-art-elevator-ui bg-full bg-no-repeat">
      {/* advertisement banner 1 */}
      <div className="absolute">
        <div className="relative -left-[43%] -rotate-45">
          <img src={chain} alt="" />
          <img
            src={art}
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
            artist.revision && 'btn-disabled'
          }`}
          type="button"
          onClick={() => {
            if (artist.revision) {
              toast.info('Please wait for your previous edit to be reviewed')
            } else {
              navigate('/edit-profile', { state: { data: artist } })
            }
          }}
        >
          Edit Profile
        </button>
        <div className="flex flex-col items-center max-w-[70%]">
          <h1 className="text-center text-xl mb-5">Artist Bio</h1>

          <p className="m-5">Artist Name: {artist.name}</p>
          <br />
          {artist.gallery && artist.gallery?.length > 0 && (
            <Gallery images={artist.gallery} />
          )}
          <span className="m-5">
            Website:
            <a className="inline-block link pl-2" href={artist.website}>
              {artist.website}
            </a>
          </span>

          <p className="m-5">Influences: {artist.influences}</p>

          <p className="m-5">Band Information: {artist.bio}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-[70%] h-5/6 absolute top-[5%] left-[5%] text-white p-5 pb-10 pl-9 bg-art-elevator-ui bg-full bg-no-repeat">
      <div className="h-full w-full flex justify-center items-center">
        <h2 className="text-3xl bg-gradient-to-r from-black to-gray-700 p-5">
          Profile is being reviewed
        </h2>
      </div>
    </div>
  )
}

export default Profile
