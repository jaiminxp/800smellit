import Phaser from 'phaser'
import { config } from '@config'
import { GameContext } from '@/context/gameContext'
import { useContext } from 'react'

const game = new Phaser.Game(config.gameConfig)

export const Game = () => {
  const { setGame } = useContext(GameContext)

  game.events.addListener(Phaser.Core.Events.READY, () => {
    setGame(game)
  })

  return null
}
