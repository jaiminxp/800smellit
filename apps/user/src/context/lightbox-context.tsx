import { ImageSource } from '@/components/lightbox'
import {
  createContext,
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from 'react'

interface LightBoxContext {
  image: ImageSource
  setImage: Dispatch<SetStateAction<ImageSource>>
}

export const LightBoxContext = createContext<LightBoxContext>({
  image: null,
  setImage: () => null,
})

export function LightBoxContextProvider({ children }: PropsWithChildren) {
  const [image, setImage] = useState<ImageSource>(null)

  return (
    <LightBoxContext.Provider value={{ image, setImage }}>
      {children}
    </LightBoxContext.Provider>
  )
}
