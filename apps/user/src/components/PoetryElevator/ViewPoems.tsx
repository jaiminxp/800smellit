import artists from '@/data/artists.json'
import Map from '../map'

function ViewPoems() {
  return (
    <div className="bg-poetry-elevator-ui bg-full bg-no-repeat flex justify-center absolute top-[3%] left-[7%] text-black w-[70%] max-h-[95%] p-5 pb-10 pl-9 flex-col">
      <h1 className="text-center text-3xl mb-5">VIEW POEMS</h1>

      <div className="overflow-auto m-2 bg-gray-gradient bg-cover bg-no-repeat text-white">
        <table className="w-full">
          <thead>
            <tr className="sticky top-0 bg-gradient-to-r from-black to-gray-600">
              <td className="p-2">
                <h3 className="inline text-lg">ARTIST NAME</h3>
              </td>
              <td className="p-2">
                <h3 className="inline text-lg">BAND NAME</h3>
              </td>
              <td className="p-2">
                <h3 className="inline text-lg">ORIGIN</h3>
              </td>
              <td className="p-2">
                <h3 className="inline text-lg">GENRE</h3>
              </td>
              <td className="p-2">
                <h3 className="inline text-lg">NEXT EVENT</h3>
              </td>
            </tr>
          </thead>

          {artists.map((artist) => (
            // eslint-disable-next-line react/jsx-key
            <tr id="data-row">
              <td className="p-2.5">{artist.name}</td>
              <td className="p-2.5">{artist.band}</td>
              <td className="p-2.5">{artist.origin}</td>
              <td className="p-2.5">{artist.genre}</td>
              <td className="p-2.5">{artist.event}</td>
            </tr>
          ))}
        </table>
      </div>

      <div className="flex pl-2">
        <div className="flex-1 max-w-[40%]">
          <form action="">
            <p className="p-2">
              <label className="inline" htmlFor="state">
                STATE:
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
                CITY:
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
                GENRE:
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
            <p className="m-2">
              <label className="block" htmlFor="state">
                SEARCH BY ARTIST NAME
                <br />
              </label>
              <input
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-2 rounded-[10px] border-none text-white"
                type="text"
                placeholder="ALL"
              />
              <input type="checkbox" className="ml-2" />

              <label className="block mt-2" htmlFor="state">
                SEARCH BY VENUE
                <br />
              </label>
              <input
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-2 rounded-[10px] border-none text-white"
                type="text"
                placeholder="ALL"
              />
              <input type="checkbox" className="ml-2" />

              <label className="block mt-2" htmlFor="state">
                SEARCH BY DATE
                <br />
              </label>
              <div className="inline">
                <input
                  className="bg-gray-gradient bg-no-repeat w-2/5 p-1.5 mt-2 rounded-[10px] border-none text-white"
                  type="date"
                  placeholder="PRINCE"
                />
                <span className="mx-2">-</span>
                <input
                  className="bg-gray-gradient bg-no-repeat w-2/5 p-1.5 mt-2 rounded-[10px] border-none text-white"
                  type="date"
                  placeholder="PRINCE"
                />
              </div>
              <input type="checkbox" className="ml-2" />

              <button className="btn-primary block mt-5" type="button">
                SEARCH
              </button>
            </p>
          </form>
        </div>

        <div className="flex-1">
          <Map />
        </div>
      </div>
    </div>
  )
}

export default ViewPoems
