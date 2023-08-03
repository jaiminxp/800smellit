import { LightBoxContext } from '@/context/lightbox-context'
import { isString } from '@/lib/utils'
import { CloudAsset } from '@/types'
import { useContext } from 'react'

interface Props {
  images: CloudAsset[] | string[]
}

const Gallery = ({ images }: Props) => {
  const { setImage } = useContext(LightBoxContext)

  return (
    <div className="flex gap-5 overflow-x-auto items-center my-3 pb-2">
      {images.map((image: string | CloudAsset) => (
        <img
          key={isString(image) ? image : image.url}
          onClick={() => setImage(image)}
          src={isString(image) ? image : image.url}
          className="h-[200px]"
        />
      ))}
    </div>
  )
}

export default Gallery
