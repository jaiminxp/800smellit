import BuySellStall from './BuySellStall'
import TeachersStall from './TeachersStall'
import ServicesStall from './ServicesStall'
import VenuesStall from './VenuesStall'
import Header, { VolumeControlsPosition } from '../Header'
import {
  BuySellStallScene,
  PyramidScene,
  TeachersStallScene,
  ServicesStallScene,
  VenuesStallScene,
} from '@/scenes'
import { useEffect, useState } from 'react'
import { useScene } from '@/hooks/useScene'

const PyramidUI = () => {
  const [display, setDisplay] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<JSX.Element>()

  const buySellStallScene = useScene(
    BuySellStallScene.sceneId
  ) as BuySellStallScene

  const teachersStallScene = useScene(
    TeachersStallScene.sceneId
  ) as TeachersStallScene

  const servicesStallScene = useScene(
    ServicesStallScene.sceneId
  ) as ServicesStallScene

  const venuesStallScene = useScene(
    VenuesStallScene.sceneId
  ) as VenuesStallScene

  useEffect(() => {
    if (buySellStallScene) {
      buySellStallScene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
        setDisplay(true)
        setCurrentScreen(<BuySellStall />)
      })

      buySellStallScene.events.addListener(Phaser.Scenes.Events.SLEEP, () => {
        setDisplay(false)
      })
    }
  }, [buySellStallScene])

  useEffect(() => {
    if (teachersStallScene) {
      teachersStallScene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
        setDisplay(true)
        setCurrentScreen(<TeachersStall />)
      })

      teachersStallScene.events.addListener(Phaser.Scenes.Events.SLEEP, () => {
        setDisplay(false)
      })
    }
  }, [teachersStallScene])

  useEffect(() => {
    if (servicesStallScene) {
      servicesStallScene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
        setDisplay(true)
        setCurrentScreen(<ServicesStall />)
      })

      servicesStallScene.events.addListener(Phaser.Scenes.Events.SLEEP, () => {
        setDisplay(false)
      })
    }
  }, [servicesStallScene])

  useEffect(() => {
    if (venuesStallScene) {
      venuesStallScene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
        setDisplay(true)
        setCurrentScreen(<VenuesStall />)
      })

      venuesStallScene.events.addListener(Phaser.Scenes.Events.SLEEP, () => {
        setDisplay(false)
      })
    }
  }, [venuesStallScene])

  if (!display) return null

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-auto">
      <Header
        showExitBtn={true}
        exitToScene={PyramidScene.sceneId}
        showVolumeControls={true}
        volumeControlsPosition={VolumeControlsPosition.Left}
      />
      {currentScreen}
    </div>
  )
}

export default PyramidUI
