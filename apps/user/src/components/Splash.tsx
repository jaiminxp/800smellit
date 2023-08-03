import splashGif from '@/assets/splash.gif'
import expandIcon from '@/assets/expand-icon.svg'
import { useScene } from '@/hooks/useScene'
import { PreloadScene } from '@/scenes'
import { useEffect, useState } from 'react'
import { isProd, config } from '@config'
import content from '@/data/splash.json'
import { isString } from '@/lib/utils'

const Splash = () => {
  const [display, setDisplay] = useState(false)

  const preloadScene = useScene(PreloadScene.sceneId) as PreloadScene

  useEffect(() => {
    if (preloadScene) {
      preloadScene.load.on(Phaser.Loader.Events.COMPLETE, () => {
        setDisplay(true)
      })
    }
  }, [preloadScene])

  const loadFirstScene = () => {
    setDisplay(false)
    preloadScene.scene.start(config.sceneAfterLoad)
  }

  return display && isProd ? (
    <div className="absolute top-0 left-0 w-full h-screen p-5 flex flex-col text-white text-center bg-black">
      <p className="mb-10 w-1/2 mx-auto text-sm font-sans">{content.joke}</p>
      <div className="flex items-center justify-around m-auto h-full gap-5 max-w-7xl">
        <div className="h-full flex flex-col justify-center items-center">
          <DropDown title="Mission" content={content.mission} />
          <DropDown title="Credits" content={content.credits} />
        </div>
        <img
          src={splashGif}
          alt="800smellit logo gif"
          className="w-1/2 h-auto"
          onClick={loadFirstScene}
        />
        <div className="h-full flex flex-col justify-center items-center">
          <DropDown title="Vision" content={content.vision} />
          <DropDown title="Donors" content={content.donors} />
        </div>
      </div>
    </div>
  ) : null
}

interface DropDownProps {
  title: string
  content:
    | string
    | {
        id: string
        title: string
        content: string
      }[]
}

const DropDown = ({ title, content }: DropDownProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-auto h-1/2 max-h-[220px] w-[300px]">
      <h2 className="text-3xl">{title}</h2>
      <img
        src={expandIcon}
        alt=""
        className="inline"
        onClick={() => setOpen((prev) => !prev)}
      />
      <div className={`overflow-clip expand ${open ? 'h-full' : 'h-0'}`}>
        <div className="text-sm border-2 border-cyan-400 font-sans mt-4 p-5 overflow-y-scroll h-full">
          {isString(content) ? (
            <p>{content}</p>
          ) : (
            content.map((section) => <Section key={section.id} {...section} />)
          )}
        </div>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  content: string
}

const Section = ({ title, content }: SectionProps) => {
  return (
    <div className="mb-3">
      <h3 className="text-xl font-bold uppercase mb-3">{title}</h3>
      <p>{content}</p>
    </div>
  )
}

export default Splash
