/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNumber, isString, resolvePath } from '@/lib/utils'
import { Link } from 'react-router-dom'

type Props = {
  columns: string[]
  data: any[]
  onRowClick?: (item: any, index: number) => void
  displayFields: Array<string | string[]> // display the first field that is non empty
  imageIndex?: number
  dateIndex?: number
  linkIndex?: number
  artistLinkIndex?: number
  artistLinkIdField?: string
}

//gets field value from given object
const getFieldValue = (obj: any, field: any) =>
  obj[field] || resolvePath(obj, field, '.')

//decides what to render depending on the type of content
function getTableContent(
  field: string | string[],
  obj: any,
  index: number,
  imageIndex: number | undefined,
  dateIndex: number | undefined,
  linkIndex: number | undefined,
  artistLinkIndex: number | undefined,
  artistLinkIdField: string | undefined
) {
  let fieldValue: any = null

  if (field instanceof Array) {
    // find the first field that is non empty
    field.forEach((f) => {
      if (!fieldValue) {
        fieldValue = getFieldValue(obj, f)
      }
    })
  } else {
    fieldValue = getFieldValue(obj, field)
  }

  let content

  if (fieldValue && (isString(fieldValue) || isNumber(fieldValue))) {
    if (index === imageIndex) {
      content = (
        <img
          className="w-10 h-10 border-white border-2"
          src={fieldValue.toString()}
          alt="band logo"
        />
      )
    } else if (index === dateIndex) {
      content = new Date(fieldValue).toLocaleDateString()
    } else if (index === linkIndex) {
      content = (
        <a href={fieldValue.toString()} className="link">
          {fieldValue}
        </a>
      )
    } else if (index === artistLinkIndex) {
      const id = getFieldValue(obj, artistLinkIdField)
      content = (
        <Link className="link" to={`/view-public-profile/${id}`}>
          {fieldValue}
        </Link>
      )
    } else {
      content = fieldValue
    }
  } else {
    content = '-'
  }

  return content
}

export default function Table({
  columns,
  data,
  onRowClick,
  displayFields,
  imageIndex,
  dateIndex,
  linkIndex,
  artistLinkIndex,
  artistLinkIdField,
}: Props) {
  return (
    <table className="w-full border-separate border-spacing-0 text-left text-white">
      <thead className="">
        <tr className="bg-gradient-to-r from-black to-gray-600 sticky top-0">
          {columns.map((c) => (
            <th className="p-2 border-white border-b">
              <h3 className="inline font-semibold uppercase">{c}</h3>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-gradient-to-r from-black to-gray-600">
        {data.map((el, i) => (
          <tr
            className={
              onRowClick
                ? 'hover:bg-gray-400 hover:text-black cursor-pointer'
                : ''
            }
            id="data-row"
            onClick={() => onRowClick && onRowClick(el, i)}
          >
            {displayFields.map((field, index) => (
              <td className="p-2.5">
                {getTableContent(
                  field,
                  el,
                  index,
                  imageIndex,
                  dateIndex,
                  linkIndex,
                  artistLinkIndex,
                  artistLinkIdField
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
