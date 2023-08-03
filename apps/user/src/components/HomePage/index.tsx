import { useScene } from '@/hooks/useScene'
import Header from '../Header'
import { HomeScene } from '@/scenes'
import { useEffect, useState } from 'react'

const HomePageUI = () => {
  const [display, setDisplay] = useState(false)
  const homeScene = useScene(HomeScene.sceneId) as HomeScene

  useEffect(() => {
    if (homeScene) {
      homeScene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
        setDisplay(true)
      })

      homeScene.events.addListener(Phaser.Scenes.Events.SHUTDOWN, () => {
        setDisplay(false)
      })
    }
  }, [homeScene])

  return display ? (
    <div className="absolute top-0 right-0 -mt-3 small-btn">
      <Header />
    </div>
  ) : null
}

export default HomePageUI
