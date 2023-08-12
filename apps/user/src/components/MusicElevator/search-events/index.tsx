import { useState, useCallback } from 'react'
import Map from '../../map'
import Table from '@/components/Table'
import { createQueryString } from '@/lib/utils'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { eventService } from '@/services'
import { Event, EventOrganizerType } from '@/types/event'
import { LngLatLike } from 'mapbox-gl'
import EventFilter from './event-filter'

function SearchEvent() {
  const [searchQuery, setSearchQuery] = useState<string>(
    `type=${EventOrganizerType.Musician}`
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
    <div className="bg-music-elevator-ui bg-full bg-no-repeat flex justify-center absolute top-[3%] left-[7%] text-white w-[70%] max-h-[95%] p-5 pb-10 pl-9 flex-col">
      <h1 className="text-center text-3xl mb-5 font-bold">
        Search for music events
      </h1>

      {isLoading ? (
        <div className="flex-1 text-center bg-gray-gradient h-min p-8 m-2">
          <h3 className="text-2xl">Loading...</h3>
        </div>
      ) : events && events.length > 0 ? (
        <div className="overflow-auto m-2">
          <Table
            data={events}
            onRowClick={(event) => setSelectedEventId((event as Event)._id)}
            dateIndex={0}
            artistLinkIndex={1}
            artistLinkIdField="organizerInfo.organizer._id"
            displayFields={[
              'date',
              ['organizerInfo.organizer.band', 'organizerInfo.organizer.name'],
              'venue.fullAddress',
              'genre',
            ]}
            columns={['DATE', 'NAME', 'VENUE', 'GENRE']}
          />
        </div>
      ) : (
        <div className="flex-1 text-center bg-gray-gradient h-min p-8 m-2">
          <h3 className="text-2xl">No events found for selected filters</h3>
        </div>
      )}

      <div className="flex justify-between">
        <div className="w-5/12">
          <EventFilter
            onSubmit={(values) =>
              setSearchQuery(
                createQueryStringCb({
                  ...values,
                  type: EventOrganizerType.Musician,
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
