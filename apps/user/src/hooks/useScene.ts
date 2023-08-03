import { GameContext } from '@/context/gameContext'
import { useState, useEffect, useContext } from 'react'

export function useScene(sceneKey: string) {
  const [scene, setScene] = useState<Phaser.Scene>()
  const { game } = useContext(GameContext)

  useEffect(() => {
    if (game) {
      const scene = game.scene.getScene(sceneKey)
      setScene(scene)
    }
  }, [game])

  return scene
}
