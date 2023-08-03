import { GameContext } from '@/context/gameContext'
import { useState, useEffect, useContext } from 'react'

export function useGameObject(sceneKey: string, gameObjectKey: string) {
  const [gameObject, setGameObject] = useState<Phaser.GameObjects.GameObject>()
  const { game } = useContext(GameContext)

  useEffect(() => {
    if (!game) return

    const scene = game.scene.getScene(sceneKey)

    scene.events.addListener(Phaser.Scenes.Events.CREATE, () => {
      const foundGameObject = scene.children.getByName(gameObjectKey)
      if (!foundGameObject) {
        throw new Error(
          `GameObject: ${gameObjectKey} not found in scene: ${sceneKey}`
        )
      }

      setGameObject(foundGameObject)
    })
  }, [game, sceneKey, gameObjectKey])

  return { gameObject }
}
