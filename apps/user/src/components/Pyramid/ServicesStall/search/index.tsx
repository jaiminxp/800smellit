import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import Table from '@/components/Table'
import { useQuery } from '@tanstack/react-query'
import { serviceService } from '@/services'
import { createQueryString } from '@/lib/utils'
import ServiceFilter from './service-filter'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>()

  const {
    data: services,
    error,
    isLoading,
  } = useQuery(['services', searchQuery], () =>
    serviceService.search(searchQuery)
  )

  if (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Something went wrong during fetching services')
    }
  }

  const createQueryStringCb = useCallback(createQueryString, [])

  return (
    <div className="flex flex-1 min-h-[300px] gap-5 p-5 bg-[rgba(0,0,0,0.5)] overflow-clip">
      <div className="w-4/12 text-center">
        <ServiceFilter
          onSubmit={(values) => setSearchQuery(createQueryStringCb(values))}
          onReset={() => setSearchQuery('')}
        />
      </div>
      {isLoading ? (
        <div className="flex-1 text-center bg-gray-gradient h-min p-8">
          <h3 className="text-2xl">Loading...</h3>
        </div>
      ) : services && services.length > 0 ? (
        <div className="flex flex-1 items-start overflow-auto">
          <Table
            data={services}
            linkIndex={4}
            displayFields={[
              'name',
              'domain',
              'expert',
              'contact',
              'website',
              'fullAddress',
            ]}
            columns={[
              'SERVICE',
              'TYPE',
              'EXPERT',
              'CONTACT',
              'WEBSITE',
              'LOCATION',
            ]}
          />
        </div>
      ) : (
        <div className="flex-1 text-center bg-gray-gradient h-min p-8">
          <h3 className="text-2xl">No services found for selected filters</h3>
        </div>
      )}
    </div>
  )
}

export default Search
