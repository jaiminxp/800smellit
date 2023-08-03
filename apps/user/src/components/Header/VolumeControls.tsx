import volumeUp from '@/assets/volume-up.png'
import volumeDown from '@/assets/volume-down.png'
import volumeBar from '@/assets/volume-bar.png'
import { HTMLAttributes, useContext, useEffect, useState } from 'react'
import { GameContext } from '@/context/gameContext'

interface Props {
  containerStyle?: HTMLAttributes<HTMLDivElement>['className']
}

export default function VolumeControls({ containerStyle }: Props) {
  const { game } = useContext(GameContext)
  const [volume, setVolume] = useState(0)
  const volumeChangeFactor = 0.125
  const totalBars = volume / volumeChangeFactor

  function increaseVolume() {
    const gameVolume = game?.sound.volume

    console.log(gameVolume)

    if (game && volume < 1) {
      game.sound.volume += volumeChangeFactor
      setVolume(volume + volumeChangeFactor)
    }
  }

  function decreaseVolume() {
    const gameVolume = game?.sound.volume

    console.log(gameVolume)

    if (game && volume >= volumeChangeFactor) {
      game.sound.volume -= volumeChangeFactor
      setVolume(volume - volumeChangeFactor)
    }
  }

  useEffect(() => {
    if (game) {
      setVolume(game.sound.volume)
    }
  }, [])

  return (
    <div
      className={`flex items-center gap-2 h-[60px] w-[325px] ${
        containerStyle || ''
      }`}
    >
      <button onClick={decreaseVolume}>
        <img className="w-[40px] h-[40px]" src={volumeDown} />
      </button>
      <VolumeBars nBars={totalBars} />
      <button className="ml-auto" onClick={increaseVolume}>
        <img className="w-[40px] h-[40px]" src={volumeUp} />
      </button>
    </div>
  )
}

function VolumeBars({ nBars }: { nBars: number }) {
  return (
    <div className="flex min-w-max gap-4">
      {new Array(nBars).fill(volumeBar).map((src) => (
        // eslint-disable-next-line react/jsx-key
        <img className="h-[38px]" src={src} />
      ))}
    </div>
  )
}
