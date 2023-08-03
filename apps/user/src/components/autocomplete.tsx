import { Suggestion } from '@/types'
import { Control, Controller } from 'react-hook-form'
import { Input } from './form'
import { useState } from 'react'
import Spinner from './spinner'

interface Props {
  name: string
  initialValue?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  isLoadingSuggestions: boolean
  suggestionList: Suggestion[]
  onQueryChange: (query: string) => void
  actionItem?: {
    label: string
    icon: JSX.Element
    action: () => void
  }
}

const AutoComplete = ({
  initialValue,
  suggestionList,
  control,
  name,
  onQueryChange,
  isLoadingSuggestions,
  actionItem,
}: Props) => {
  const [isSelecting, setIsSelecting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [query, setQuery] = useState(initialValue || '')

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div className="relative">
          <Input
            className="w-full"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              onQueryChange(e.target.value)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              !value?._id && onChange(query)
              !isSelecting && setShowSuggestions(false)
              value?._id && setQuery(value.name)
            }}
            placeholder="Search..."
          />

          {showSuggestions && (
            <div
              onMouseEnter={() => setIsSelecting(true)}
              onMouseLeave={() => setIsSelecting(false)}
              className={
                'z-[1] absolute top-11 left-0 p-5 w-full max-h-[200px] overflow-y-auto bg-gray-gradient rounded-md border-2 border-white'
              }
            >
              {actionItem && (
                <div
                  onClick={() => actionItem.action()}
                  className="flex items-center gap-2 p-2 mb-2 rounded-md 
                  hover:bg-[rgba(255,255,255,0.1)] active:bg-[rgba(255,255,255,0.2)] select-none"
                >
                  {actionItem.icon}
                  {actionItem.label}
                </div>
              )}

              {!query ? (
                <p>Start typing...</p>
              ) : isLoadingSuggestions ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              ) : suggestionList.length === 0 ? (
                <p>No suggestions found</p>
              ) : (
                suggestionList.map((item) => (
                  <div
                    className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.1)]"
                    key={item._id}
                    onClick={() => {
                      setQuery(item.name)
                      onChange(item)
                      setShowSuggestions(false)
                    }}
                  >
                    {item.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    />
  )
}

export default AutoComplete
