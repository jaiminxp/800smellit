import { HomeScene } from '@scenes'
import { FixedButton } from './FixedButton'

export default class VolumeControls extends Phaser.GameObjects.Container {
  constructor(scene: HomeScene, x: number, y: number) {
    const volumeControlGap = 38
    const volumeBarCount = 8
    const volumeBars: Phaser.GameObjects.Sprite[] = []
    const volumeChangeFactor = 0.125

    let globalVolume = scene.sound.volume

    // scene.sound.volume controls the actual volume
    // globalVolume is used to determine how many volume bars to display

    const renderVolumeBars = () => {
      const displayBars = globalVolume / volumeChangeFactor

      for (let i = 0; i < volumeBarCount; i++) {
        if (i + 1 <= displayBars) {
          volumeBars[i].visible = true
        } else {
          volumeBars[i].visible = false
        }
      }
    }

    scene.sound.on(Phaser.Sound.Events.GLOBAL_VOLUME, () => {
      renderVolumeBars()
    })

    for (let i = volumeBarCount; i >= 1; i--) {
      const volumeBar = scene.add
        .sprite(0, volumeControlGap * i + 15, 'volume-bar')
        .setScrollFactor(0)
        .setRotation(1.5708)
        .setScale(0.7, 0.9)

      volumeBars.push(volumeBar)
    }

    const volumeDownBtn = new FixedButton(
      scene,
      0,
      volumeControlGap * (volumeBarCount + 1) + 30,
      'volume-down'
    ).setScale(0.9)

    const volumeUpBtn = new FixedButton(scene, 0, 0, 'volume-up').setScale(0.9)

    volumeUpBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (globalVolume < 1) {
        globalVolume += volumeChangeFactor
        scene.sound.volume += volumeChangeFactor
      }
    })

    volumeDownBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (globalVolume >= volumeChangeFactor) {
        globalVolume -= volumeChangeFactor
        scene.sound.volume -= volumeChangeFactor
      }
    })

    super(scene, x, y, [volumeUpBtn, volumeDownBtn, ...volumeBars])

    scene.add.existing(this)
  }
}
