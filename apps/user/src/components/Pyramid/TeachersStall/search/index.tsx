import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import Table from '@/components/Table'
import { useQuery } from '@tanstack/react-query'
import { tutorService } from '@/services/tutor.service'
import { createQueryString } from '@/lib/utils'
import TutorFilter from './tutor-filter'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>()

  const {
    data: tutors,
    error,
    isLoading,
  } = useQuery(['tutors', searchQuery], () => tutorService.search(searchQuery))

  if (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Something went wrong during fetching tutors')
    }
  }

  const createQueryStringCb = useCallback(createQueryString, [])

  return (
    <div className="flex flex-1 min-h-[300px] gap-5 p-5 bg-[rgba(0,0,0,0.5)] overflow-clip">
      <div className="w-4/12 text-center">
        <TutorFilter
          onSubmit={(data) => setSearchQuery(createQueryStringCb(data))}
          onReset={() => setSearchQuery('')}
        />
      </div>
      {isLoading ? (
        <div className="flex-1 text-center bg-gray-gradient h-min p-8">
          <h3 className="text-2xl">Loading...</h3>
        </div>
      ) : tutors && tutors.length > 0 ? (
        <div className="flex flex-1 items-start overflow-auto">
          <Table
            data={tutors}
            displayFields={[
              'name',
              'subject',
              'availability',
              'instrument',
              'contact',
              'fullAddress',
            ]}
            columns={[
              'TUTOR',
              'SUBJECT',
              'AVAILABILITY',
              'INSTRUMENT',
              'CONTACT',
              'LOCATION',
            ]}
          />
        </div>
      ) : (
        <div className="flex-1 text-center bg-gray-gradient h-min p-8">
          <h3 className="text-2xl">No tutors found for selected filters</h3>
        </div>
      )}
    </div>
  )
}

export default Search
