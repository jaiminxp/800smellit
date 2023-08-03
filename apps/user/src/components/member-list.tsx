import { Member } from '@/types'

interface Props {
  data: Member[]
  editItem: (e: Member, i: number) => void
  deleteItem: (i: number) => void
}

const MemberList = (props: Props) => {
  const { data, editItem, deleteItem } = props

  return (
    <div className="max-h-44 overflow-y-scroll">
      {data.map((e, i) => (
        <div
          key={i}
          className="bg-black flex items-center px-2 py-1 border-b-[1px] border-b-white"
        >
          <div className="w-4/6">
            <span className="font-bold text-lg">{e.name}</span>
            <div className="flex gap-4">
              <span className="text-sm text-slate-300">{e.role}</span>
              <span className="text-sm text-slate-300">{e.instrument}</span>
            </div>
          </div>
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
        </div>
      ))}
    </div>
  )
}

export default MemberList
