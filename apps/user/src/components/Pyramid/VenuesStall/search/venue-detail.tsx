import EventList from '@/components/event-list'
import Gallery from '@/components/gallery'
import Map from '@/components/map'
import { Venue } from '@/types'

interface VenueDetailProps {
  venue: Venue
}

const VenueDetail = ({ venue }: VenueDetailProps) => {
  const [lng, lat] = venue.geometry.coordinates

  return (
    <div className="h-[40%] bg-[rgba(0,0,0,0.5)] px-5 pb-5 flex justify-between gap-5">
      <div className="w-4/12">
        <Map containerStyle="w-full h-[82%]" location={{ lng, lat }} />
        <p className="p-2 mt-2 bg-gray-gradient rounded-lg text-center">
          Location: {venue.fullAddress}
        </p>
      </div>
      <div className="bg-gray-gradient flex-1 p-5 rounded-lg overflow-y-scroll">
        <p>
          <span className="font-semibold">Venue - </span>
          {venue.name}
        </p>

        {venue.gallery.length > 0 && <Gallery images={venue.gallery} />}

        <div className="my-3 pt-3">
          <h3 className="text-xl">Events</h3>
          {venue.events.length > 0 ? (
            <div className="w-2/3 mt-2 border-2 border-white">
              <EventList
                data={venue.events}
                showActions={false}
                dataExtractor={(e) => ({
                  name: e.name,
                  date: e.date,
                  venue: venue.name,
                })}
              />
            </div>
          ) : (
            <p className="err-msg mt-3">No events</p>
          )}
        </div>

        <p className="mt-3">
          <span className="font-semibold">Details - </span>
          {venue.details}
        </p>
      </div>
    </div>
  )
}

export default VenueDetail
