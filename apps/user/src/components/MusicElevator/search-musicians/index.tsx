import { useCallback, useState } from 'react'
import Table from '@/components/Table'
import { toast } from 'react-toastify'
import { musicianService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { createQueryString } from '@/lib/utils'
import MusicianFilter from './musician-filter'

function SearchMusicians() {
  const [searchQuery, setSearchQuery] = useState<string>()
  const createQueryStringCb = useCallback(createQueryString, [])

  const {
    data: musicians,
    error,
    isLoading,
  } = useQuery(['search-musicians', searchQuery], () =>
    musicianService.search(searchQuery)
  )

  if (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Something went wrong during fetching musicians')
    }
  }

  return (
    <div className="bg-music-elevator-ui bg-full bg-no-repeat flex flex-col absolute top-[10%] left-[10%] text-white w-[65%] h-[85%] p-8 pl-12">
      <h1 className="text-center text-3xl mb-5 font-bold">
        SEARCH FOR ARTISTS
      </h1>
      <div className="flex flex-row justify-between mt-8 overflow-clip gap-4">
        <div className="ml-2 mt-8 w-4/12">
          <MusicianFilter
            onSubmit={(values) => setSearchQuery(createQueryStringCb(values))}
          />
        </div>

        <div className="bg-gray-gradient bg-no-repeat bg-full rounded-lg flex flex-1 overflow-scroll">
          {isLoading ? (
            <div className="flex-1 text-center bg-gray-gradient h-min p-8 m-2">
              <h3 className="text-2xl">Loading...</h3>
            </div>
          ) : musicians && musicians.length > 0 ? (
            <Table
              data={musicians}
              imageIndex={0}
              linkIndex={5}
              artistLinkIndex={1}
              artistLinkIdField="id"
              displayFields={[
                'logo.url',
                'name',
                'band',
                'fullAddress',
                'genre',
                'website',
              ]}
              columns={[
                'BAND LOGO',
                'ARTIST',
                'BAND',
                'ORIGIN',
                'GENRE',
                'WEBSITE',
              ]}
            />
          ) : (
            <div className="flex-1 text-center bg-gray-gradient h-min p-8 m-2">
              <h3 className="text-2xl">
                No musicians found for selected filters
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchMusicians
