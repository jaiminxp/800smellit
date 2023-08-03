import closeIcon from '@/assets/icons/close.svg'
import { isString } from '@/lib/utils'
import { CloudAsset } from '@/types'

export type ImageSource = string | CloudAsset | undefined | null

interface LightboxProps {
  image?: ImageSource
  onClose: () => void
}

const LightBox = ({ image, onClose }: LightboxProps) => {
  if (!image) return null

  return (
    <div className="absolute top-0 left-0 z-10 w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="relative h-[90%]">
        <button
          title="Close"
          type="button"
          onClick={onClose}
          className="absolute -top-[2rem] -right-[2rem] bg-white p-5 rounded-full"
        >
          <img className="w-6 h-6" src={closeIcon} />
        </button>
        <img src={isString(image) ? image : image.url} className="h-full" />
      </div>
    </div>
  )
}

export default LightBox
