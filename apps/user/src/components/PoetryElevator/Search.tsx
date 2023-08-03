const artists = [
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
  {
    name: 'METALLICA',
    origin: 'LOS ANGELES',
    genre: 'HEAVY METAL',
    gig: '12th Nov 22, USA',
    website: 'www.metallica.com',
  },
]

function Search() {
  return (
    <div className="bg-poetry-elevator-ui bg-full bg-no-repeat flex flex-col absolute top-[10%] left-[10%] text-black w-[65%] max-h-[85%] p-8 pl-12">
      <h1 className="text-center text-3xl mb-5">SEARCH</h1>
      <div className="flex flex-row justify-between">
        <div className="flex-1 min-w-[30%]">
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
            <p>
              <label htmlFor="artist_name" className="text-lg block mt-4">
                SEARCH BY ARTIST NAME
              </label>
              <input
                type="text"
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-3 rounded-[10px] border-none text-white"
                placeholder="ALL"
                id="artist_name"
                name="artist_name"
              />
              <input type="checkbox" className="ml-2" />

              <label htmlFor="venue" className="text-lg block mt-4">
                SEARCH BY VENUE
              </label>
              <input
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-3 rounded-[10px] border-none text-white"
                type="text"
                placeholder="ALL"
                id="venue"
                name="venue"
              />
              <input type="checkbox" className="ml-2" />

              <label htmlFor="event" className="text-lg block mt-4">
                SEARCH BY EVENT
              </label>
              <input
                type="text"
                className="bg-gray-gradient bg-no-repeat w-4/6 p-1.5 mt-3 rounded-[10px] border-none text-white"
                placeholder="ALL"
                id="event"
                name="event"
              />
              <input type="checkbox" className="ml-2" />

              <button className="btn-primary block mt-5" type="button">
                SEARCH
              </button>
            </p>
          </form>
        </div>

        <div className="grow-[2] max-h-[70vh] overflow-auto bg-gray-gradient bg-no-repeat bg-full text-white">
          <table className="w-full">
            <thead>
              <tr className="sticky top-0 bg-gradient-to-r from-black to-gray-800">
                <td className="p-2">
                  <h3 className="inline text-lg">ARTIST/BAND</h3>
                </td>
                <td className="p-2">
                  <h3 className="inline text-lg">ORIGIN</h3>
                </td>
                <td className="p-2">
                  <h3 className="inline text-lg">GENRE</h3>
                </td>
                <td className="p-2">
                  <h3 className="inline text-lg">UPCOMING GIGS</h3>
                </td>
                <td className="p-2">
                  <h3 className="inline text-lg">WEBSITE</h3>
                </td>
              </tr>
            </thead>

            {artists.map((artist) => (
              // eslint-disable-next-line react/jsx-key
              <tr id="data-row">
                <td className="p-2">{artist.name}</td>
                <td className="p-2">{artist.origin}</td>
                <td className="p-2">{artist.genre}</td>
                <td className="p-2">{artist.gig}</td>
                <td className="p-2">{artist.website}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  )
}

export default Search
