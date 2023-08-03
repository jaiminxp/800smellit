import Table from '@/components/Table'
import { Venue } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import VenueDetail from './venue-detail'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1)

  const queryClient = useQueryClient()
  const venues = queryClient.getQueryData<Venue[]>(['venues/me'])
  const navigate = useNavigate()

  const selectedVenue = venues && venues[selectedItemIndex]

  return (
    <div className="flex-1 p-5 bg-[rgba(0,0,0,0.5)] overflow-y-auto">
      <h1 className="text-4xl text-center font-heading">Your venues</h1>
      <div className="mt-8 flex gap-4 h-full max-h-[75%]">
        <div className="flex-1">
          <div className="overflow-y-auto h-min max-h-full">
            <Table
              data={venues as Venue[]}
              columns={['NAME', 'LOCATION']}
              displayFields={['name', 'fullAddress']}
              onRowClick={(item: Venue, index: number) =>
                setSelectedItemIndex(index)
              }
            />
          </div>
          <button
            className="btn-primary block m-3 ml-auto"
            onClick={() => navigate('/register')}
          >
            Add new venue
          </button>
        </div>
        <div className="flex flex-1 bg-gray-gradient rounded-lg">
          {selectedVenue ? (
            <VenueDetail venue={selectedVenue} />
          ) : (
            <div className="flex-1">
              <p className="mt-5 text-center">
                Select a venue from the table to see its details here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
