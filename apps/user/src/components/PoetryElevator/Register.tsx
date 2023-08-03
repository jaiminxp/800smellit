import bandLogo from '@/assets/band-logo.jpg'
import bandPhoto from '@/assets/band-photo.jpg'

const bandGallery = [bandPhoto, bandPhoto, bandPhoto]

function Register() {
  return (
    <div className="w-[70%] absolute top-[3%] left-[5%] text-black p-5 pb-10 pl-9 flex-col bg-poetry-elevator-ui bg-full bg-no-repeat">
      <h1 className="text-center text-3xl mb-5">Register your profile</h1>

      <div className="flex justify-center">
        <form action="" className="pl-2 flex flex-row w-[90%]">
          <div className="flex-1">
            <p className="p-2">
              <label className="inline" htmlFor="full_name">
                Full name of the artist
              </label>
              <input
                id="full_name"
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-2 rounded-[10px] border-none text-white"
                type="text"
                placeholder="ALL"
              />
            </p>
            <p className="p-2">
              <label className="inline" htmlFor="band_name">
                Name of the band
              </label>
              <input
                id="band_name"
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-2 rounded-[10px] border-none text-white"
                type="text"
              />
            </p>
            <p className="p-2">
              <label className="inline" htmlFor="band_members">
                Band members - role & instruments
              </label>
              <input
                id="band_members"
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-2 rounded-[10px] border-none text-white"
                type="text"
              />
            </p>
            <p className="p-2">
              <label className="block" htmlFor="band_members">
                Influences
              </label>
              <input
                id="band_members"
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-2 rounded-[10px] border-none text-white"
                type="text"
              />
            </p>
            <p className="p-2">
              <p className="pb-2">Band logo</p>
              <img src={bandLogo} alt="" />
            </p>
            <p className="p-2">
              <label className="block" htmlFor="band_members">
                Schedule of events
              </label>
              <input
                id="band_members"
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-2 rounded-[10px] border-none text-white"
                type="text"
              />
            </p>
            <button className="btn-primary block mt-5 ml-2" type="button">
              SUBMIT
            </button>
          </div>
          <div className="flex-1">
            <p className="p-2">
              <label className="inline" htmlFor="state">
                State:
              </label>
              <select
                className="bg-gray-gradient bg-no-repeat ml-5 w-6/12 p-1.5 rounded-[10px] border-none text-white"
                name="state"
                id="state"
              >
                <option value="NY">New York</option>
                <option value="CA">California</option>
              </select>
            </p>
            <p className="p-2">
              <label className="inline" htmlFor="city">
                City:
              </label>
              <select
                className="bg-gray-gradient bg-no-repeat ml-5 w-6/12 p-1.5 rounded-[10px] border-none text-white"
                name="city"
                id="city"
              >
                <option value="detroit">Detroit</option>
                <option value="california">Los Angeles</option>
              </select>
            </p>
            <p className="p-2">
              <label className="inline" htmlFor="genre">
                Genre:
              </label>
              <select
                className="bg-gray-gradient bg-no-repeat ml-5 w-6/12 p-1.5 rounded-[10px] border-none text-white"
                name="genre"
                id="genre"
              >
                <option value="metal">Metal</option>
                <option value="pop">Pop</option>
              </select>
            </p>
            <p className="p-2">
              <label className="inline" htmlFor="band_info">
                Band information
              </label>
              <textarea
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-2 rounded-[10px] border-none text-white"
                id="band_info"
                cols={30}
                rows={3}
              ></textarea>
            </p>

            <p className="p-2">
              <p className="pb-2">Band gallery</p>
              <div className="flex">
                {bandGallery.map((photo) => (
                  // eslint-disable-next-line react/jsx-key
                  <img src={photo} alt="" className="m-2 w-1/4" />
                ))}
              </div>
            </p>
            <p className="p-2">
              <label className="inline" htmlFor="event_state">
                State:
              </label>
              <select
                className="bg-gray-gradient bg-no-repeat ml-5 w-6/12 p-1.5 rounded-[10px] border-none text-white"
                name="event_state"
                id="event_state"
              >
                <option value="NY">New York</option>
                <option value="CA">California</option>
              </select>
            </p>
            <p className="p-2">
              <label className="inline" htmlFor="event_city">
                City:
              </label>
              <select
                className="bg-gray-gradient bg-no-repeat ml-5 w-6/12 p-1.5 rounded-[10px] border-none text-white"
                name="event_city"
                id="event_city"
              >
                <option value="detroit">Detroit</option>
                <option value="california">Los Angeles</option>
              </select>
            </p>
            <p className="p-2">
              <label className="inline" htmlFor="event_genre">
                Genre:
              </label>
              <select
                className="bg-gray-gradient bg-no-repeat ml-5 w-6/12 p-1.5 rounded-[10px] border-none text-white"
                name="event_genre"
                id="event_genre"
              >
                <option value="metal">Metal</option>
                <option value="pop">Pop</option>
              </select>
            </p>
            <p className="p-2">
              <label className="inline" htmlFor="event_date">
                Date:
              </label>
              <input
                className="bg-gray-gradient bg-no-repeat ml-5 w-6/12 p-1.5 rounded-[10px] border-none text-white"
                type="date"
                placeholder="PRINCE"
              />
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
