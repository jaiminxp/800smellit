import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import Table from '@/components/Table'
import { Venue } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { venueService } from '@/services'
import { createQueryString } from '@/lib/utils'
import VenueFilter from './venue-filter'
import VenueDetail from './venue-detail'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>()
  const [selectedId, setSelectedId] = useState<string>()

  const {
    data: venues,
    error,
    isLoading,
  } = useQuery(['venues', searchQuery], () => venueService.search(searchQuery))

  if (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Something went wrong during fetching venues')
    }
  }

  const selectedVenue =
    venues && venues.find((venue) => venue._id === selectedId)

  const createQueryStringCb = useCallback(createQueryString, [])

  return (
    <>
      <div className="flex flex-1 min-h-[300px] gap-5 p-5 bg-[rgba(0,0,0,0.5)] overflow-clip">
        <div className="w-4/12 text-center">
          <VenueFilter
            onSubmit={(data) => setSearchQuery(createQueryStringCb(data))}
            onReset={() => setSearchQuery('')}
          />
        </div>
        {isLoading ? (
          <div className="flex-1 text-center bg-gray-gradient h-min p-8">
            <h3 className="text-2xl">Loading...</h3>
          </div>
        ) : venues && venues.length > 0 ? (
          <div className="flex flex-1 items-start overflow-auto">
            <Table
              onRowClick={(venue: Venue) => setSelectedId(venue._id)}
              data={venues}
              linkIndex={4}
              displayFields={[
                'name',
                'theme',
                'phone',
                'fullAddress',
                'website',
              ]}
              columns={['VENUE', 'THEME', 'CONTACT', 'LOCATION', 'WEBSITE']}
            />
          </div>
        ) : (
          <div className="flex-1 text-center bg-gray-gradient h-min p-8">
            <h3 className="text-2xl">No venues found for selected filters</h3>
          </div>
        )}
      </div>
      {selectedVenue ? (
        <VenueDetail venue={selectedVenue} />
      ) : (
        <div className="h-full bg-[rgba(0,0,0,0.5)] px-5 pb-5 flex">
          <h1 className="text-3xl m-auto">
            Select a venue to view its details here
          </h1>
        </div>
      )}
    </>
  )
}

export default Search
