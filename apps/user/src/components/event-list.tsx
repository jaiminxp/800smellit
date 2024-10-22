import { Event, EventModalData } from '@/types'

interface Props {
  data: Event[] | EventModalData[]
  showActions?: boolean
  editItem?: (e: Event | EventModalData, i: number) => void
  deleteItem?: (i: number) => void
  dataExtractor: (e: Event | EventModalData) => {
    name: string
    date: string
    venue: string
  }
}

const EventList = ({
  data,
  editItem = () => null,
  deleteItem = () => null,
  showActions = true,
  dataExtractor,
}: Props) => {
  return (
    <div className="max-h-44 overflow-y-scroll text-white">
      {data.map((e, i) => {
        const { name, date, venue } = dataExtractor(e)

        return (
          <div
            key={i}
            className="bg-black flex items-center px-2 py-1 border-b-[1px] border-b-white"
          >
            <div className="w-4/6">
              <span className="font-bold text-lg">{name}</span>
              <div className="flex gap-4">
                <span className="text-sm text-slate-300">
                  {new Date(date).toLocaleDateString()}
                </span>
                <span className="text-sm text-slate-300">{venue}</span>
              </div>
            </div>
            {showActions && (
              <div className="w-2/6 flex gap-1">
                <button
                  onClick={() => editItem(e, i)}
                  type="button"
                  className="uppercase px-2 py-1 rounded-md bg-white text-black"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(i)}
                  type="button"
                  className="uppercase px-2 py-1 rounded-md bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default EventList
