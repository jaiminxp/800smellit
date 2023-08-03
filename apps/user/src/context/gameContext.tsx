import {
  createContext,
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from 'react'

interface IGameContext {
  game: Phaser.Game | null
  setGame: Dispatch<SetStateAction<Phaser.Game | null>>
}

export const GameContext = createContext<IGameContext>({
  game: null,
  setGame: () => console.log('Game is not initialized'),
})

export function GameContextProvider({ children }: PropsWithChildren) {
  const [game, setGame] = useState<Phaser.Game | null>(null)

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  )
}
