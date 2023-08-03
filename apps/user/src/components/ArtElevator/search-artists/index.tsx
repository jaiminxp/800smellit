import { useCallback, useState } from 'react'
import Table from '@/components/Table'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { createQueryString } from '@/lib/utils'
import { artistService } from '@/services'
import ArtistFilter from './artist-filter'

function SearchArtists() {
  const [searchQuery, setSearchQuery] = useState<string>()
  const createQueryStringCb = useCallback(createQueryString, [])

  const {
    data: artists,
    error,
    isLoading,
  } = useQuery(['search-artists', searchQuery], () =>
    artistService.search(searchQuery)
  )

  if (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Something went wrong during fetching musicians')
    }
  }

  return (
    <div className="bg-art-elevator-ui text-black bg-full bg-no-repeat flex flex-col absolute top-[10%] left-[10%] w-[65%] h-[85%] p-8 pl-12">
      <h1 className="text-center text-3xl mb-5 font-bold">
        SEARCH FOR ARTISTS
      </h1>
      <div className="flex flex-row justify-between mt-8 overflow-clip gap-4">
        <div className="ml-2 mt-8 w-4/12">
          <ArtistFilter
            onSubmit={(values) => setSearchQuery(createQueryStringCb(values))}
          />
        </div>

        <div className="bg-gray-gradient bg-no-repeat bg-full rounded-lg flex flex-1 overflow-scroll">
          {isLoading ? (
            <div className="flex-1 text-center bg-gray-gradient h-min p-8 m-2">
              <h3 className="text-2xl text-white">Loading...</h3>
            </div>
          ) : artists && artists.length > 0 ? (
            <Table
              data={artists}
              linkIndex={3}
              artistLinkIndex={0}
              artistLinkIdField="id"
              displayFields={['name', 'fullAddress', 'genre', 'website']}
              columns={['ARTIST', 'ORIGIN', 'GENRE', 'WEBSITE']}
            />
          ) : (
            <div className="flex-1 text-center bg-gray-gradient h-min p-8 m-2">
              <h3 className="text-2xl text-white">
                No artists found for selected filters
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchArtists
