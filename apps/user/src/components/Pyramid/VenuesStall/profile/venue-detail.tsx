import Map from '@/components/map'
import EventList from '@/components/event-list'
import Gallery from '@/components/gallery'
import { venueService } from '@/services'
import { Venue } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface Props {
  venue: Venue
}

const VenueDetail = ({ venue }: Props) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const deleteVenueMutation = useMutation<
    Venue,
    Error,
    string,
    { prevVenues: Venue[]; nextVenues: Venue[] }
  >({
    mutationFn: (id) => venueService.remove(id),
    onMutate: (id) => {
      // unmutated list of venues
      const prevVenues = queryClient.getQueryData<Venue[]>(['venues/me'])

      if (!prevVenues) {
        return {
          prevVenues: [],
          nextVenues: [],
        }
      }

      // delete venue from list
      const nextVenues = [...prevVenues]
      const venueIndex = nextVenues.findIndex((v) => v._id === id)
      nextVenues.splice(venueIndex, 1)
      queryClient.setQueryData<Venue[]>(['venues/me'], nextVenues)

      return {
        prevVenues,
        nextVenues, // mutated list of venues
      }
    },
    onSuccess: (deletedVenue, id, context) => {
      toast.success('Venue deleted')

      // if user has no venues, redirect to register page
      if (context && context.nextVenues.length === 0) {
        navigate('/register')
      }
    },
    onError: (error, id, context) => {
      // reset back to original list of venues
      context &&
        queryClient.setQueryData<Venue[]>(['venues/me'], context.prevVenues)
      toast.error(error.message || 'Something went wrong while deleting venue')
    },
  })

  return (
    <div className="flex-1 p-5 overflow-y-auto">
      {/* title and action buttons */}
      <div className="flex justify-between gap-5">
        <div>
          <h2 className="text-3xl">{venue.name}</h2>
          <p className="mt-1">
            Theme:<span className="ml-2">{venue.theme}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-secondary h-min"
            onClick={() => navigate('/edit', { state: { venue } })}
          >
            Edit
          </button>
          <button
            className="btn-danger h-min"
            onClick={() => deleteVenueMutation.mutate(venue._id)}
          >
            Delete
          </button>
        </div>
      </div>

      <Map
        containerStyle="w-full h-[280px] mt-3"
        location={venue.geometry.coordinates}
      />
      <p className="mt-3">
        Location:<span className="ml-2">{venue.fullAddress}</span>
      </p>

      {venue.gallery.length > 0 && <Gallery images={venue.gallery} />}

      {/* more details */}
      <div>
        <p className="mt-1">
          Email:
          <a className="link ml-2" href={`mailto:${venue.email}`}>
            {venue.email}
          </a>
        </p>
        <p className="mt-1">
          Phone:
          <a className="link ml-2" href={`tel:${venue.phone}`}>
            {venue.phone}
          </a>
        </p>
        <p className="mt-1">
          Website:
          <a className="link ml-2" href={venue.website}>
            {venue.website}
          </a>
        </p>
      </div>

      {/* contact person details */}
      <div className="border-t-2 border-gray-50 mt-3 pt-3">
        <h3 className="text-xl">Contact person details</h3>
        <div className="mt-3">
          <p className="mt-1">
            Name: <span className="ml-2">{venue.contact.name}</span>
          </p>
          <p className="mt-1">
            Email:
            <a className="link ml-2" href={`mailto:${venue.contact.email}`}>
              {venue.contact.email}
            </a>
          </p>
          <p className="mt-1">
            Phone:
            <a className="link ml-2" href={`tel:${venue.contact.phone}`}>
              {venue.contact.phone}
            </a>
          </p>
        </div>
      </div>

      {/* events section */}

      <div className="border-t-2 border-gray-50 my-3 pt-3">
        <h3 className="text-xl">Events</h3>
        {venue.events.length > 0 ? (
          <div className="w-2/3 mt-2 border-2 border-white">
            <EventList data={venue.events} showActions={false} />
          </div>
        ) : (
          <p className="err-msg mt-3">No events</p>
        )}
      </div>

      {/* venue description */}
      <div className="border-t-2 border-gray-50 mt-3 pt-3">
        <h3 className="text-xl">Venue description</h3>
        <p className="mt-1">{venue.details}</p>
      </div>
    </div>
  )
}

export default VenueDetail
