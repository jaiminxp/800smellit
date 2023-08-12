import { useCallback, useState } from 'react'
import Map from '../../map'
import Table from '@/components/Table'
import { createQueryString } from '@/lib/utils'
import { toast } from 'react-toastify'
import { LngLatLike } from 'mapbox-gl'
import { Event, EventOrganizerType } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { eventService } from '@/services'
import EventFilter from './event-filter'

function SearchEvent() {
  const [searchQuery, setSearchQuery] = useState<string>(
    `type=${EventOrganizerType.Artist}`
  )
  const [selectedEventId, setSelectedEventId] = useState<string>()

  const {
    data: events,
    error,
    isLoading,
  } = useQuery(['search-events', searchQuery], () =>
    eventService.search(searchQuery)
  )

  const selectedEvent: Event | undefined =
    events && events.find((event) => event._id === selectedEventId)

  const mapLocation: LngLatLike | undefined = selectedEvent && {
    lng: selectedEvent.venue.geometry.coordinates[0],
    lat: selectedEvent.venue.geometry.coordinates[1],
  }

  if (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Something went wrong during fetching events')
    }
  }

  const createQueryStringCb = useCallback(createQueryString, [])

  return (
    <div className="bg-art-elevator-ui text-black bg-full bg-no-repeat flex justify-center absolute top-[3%] left-[7%] w-[70%] max-h-[95%] p-5 pb-10 pl-9 flex-col">
      <h1 className="text-center text-3xl mb-5 font-bold">
        Search for art events
      </h1>

      {isLoading ? (
        <div className="flex-1 text-center bg-gray-gradient h-min p-8 m-2">
          <h3 className="text-2xl text-white">Loading...</h3>
        </div>
      ) : events && events.length > 0 ? (
        <div className="overflow-auto m-2">
          <Table
            data={events}
            onRowClick={(event) => setSelectedEventId((event as Event)._id)}
            dateIndex={2}
            artistLinkIndex={1}
            artistLinkIdField="organizerInfo.organizer._id"
            columns={['EVENT NAME', 'ARTIST', 'DATE', 'VENUE', 'GENRE']}
            displayFields={[
              'name',
              'organizerInfo.organizer.name',
              'date',
              'venue.fullAddress',
              'genre',
            ]}
          />
        </div>
      ) : (
        <div className="flex-1 text-center bg-gray-gradient h-min p-8 m-2">
          <h3 className="text-2xl text-white">
            No events found for selected filters
          </h3>
        </div>
      )}

      <div className="flex justify-between">
        <div className="w-5/12">
          <EventFilter
            onSubmit={(values) =>
              setSearchQuery(
                createQueryStringCb({
                  ...values,
                  type: EventOrganizerType.Artist,
                })
              )
            }
          />
        </div>

        <Map containerStyle="w-7/12" location={mapLocation} />
      </div>
    </div>
  )
}

export default SearchEvent
