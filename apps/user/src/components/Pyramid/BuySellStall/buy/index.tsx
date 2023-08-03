import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import Table from '@/components/Table'
import { productService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { createQueryString } from '@/lib/utils'
import ProductFilter from './product-filter'

const Buy = () => {
  const [searchQuery, setSearchQuery] = useState<string>()

  const {
    data: products,
    error,
    isLoading,
  } = useQuery(['products', searchQuery], () =>
    productService.search(searchQuery)
  )

  if (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Something went wrong during fetching products')
    }
  }

  const createQueryStringCb = useCallback(createQueryString, [])

  return (
    <div className="flex flex-1 min-h-[300px] gap-5 p-5 bg-[rgba(0,0,0,0.5)] overflow-clip">
      <div className="w-4/12 text-center">
        <ProductFilter
          onSubmit={(values) => setSearchQuery(createQueryStringCb(values))}
          onReset={() => setSearchQuery('')}
        />
      </div>
      {isLoading ? (
        <div className="flex-1 text-center bg-gray-gradient h-min p-8">
          <h3 className="text-2xl">Loading...</h3>
        </div>
      ) : products && products.length > 0 ? (
        <div className="flex flex-1 items-start overflow-auto">
          <Table
            data={products}
            displayFields={[
              'type',
              'category',
              'instrument',
              'component',
              'seller',
              'contact',
              'fullAddress',
            ]}
            columns={[
              'TYPE',
              'CATEGORY',
              'INSTRUMENT',
              'COMPONENT',
              'SELLER',
              'CONTACT',
              'LOCATION',
            ]}
          />
        </div>
      ) : (
        <div className="flex-1 text-center bg-gray-gradient h-min p-8">
          <h3 className="text-2xl">No products found for selected filters</h3>
        </div>
      )}
    </div>
  )
}

export default Buy
