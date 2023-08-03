import bandLogo from '@/assets/band-logo.jpg'
import bandPhoto from '@/assets/band-photo-2x.jpg'

function Profile() {
  return (
    <div className="w-[70%] absolute top-[5%] left-[5%] text-white p-5 pb-10 pl-9 bg-poetry-elevator-ui bg-full bg-no-repeat">
      <div className="bg-profile bg-full flex justify-center">
        <div className="flex flex-col items-center max-w-[70%]">
          <h1 className="text-center text-xl mb-5">Artist Bio</h1>
          <img src={bandLogo} alt="" />
          <img src={bandPhoto} alt="" className="w-1/4" />
          <p className="m-5">
            BAND MEMBERS: JAMES HETFIELD LARS ULRICH KIRK HAMMETT ROBERT
            TRUJILLO
          </p>

          <div className="font-sans">
            <p className="m-5">
              Genres: Heavy metal; thrash metal; hard rock; speed metal
            </p>
            <p className="m-5">
              Labels: Megaforce; Elektra; Vertigo; Warner Bros. Blackened
            </p>
            <p className="m-5">
              Influences: Black Sabbath, Deep Purple, Kiss, Led Zeppelin, Queen,
              Ted Nugent, AC/DC, Rush, Aerosmith, Judas Priest
            </p>

            <p className="m-5">
              Albums: Master of Puppets, Metallica, ...And Justice for All, MORE
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
