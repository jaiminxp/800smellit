import Phaser, { Scene, Textures } from 'phaser'
import { BUY_SELL_STALL_SIGN_ATLAS } from '@/constants/textures'
import { BuySellStallScene } from '@scenes'

export class BuySellStallSign extends Phaser.GameObjects.Sprite {
  constructor(scene: Scene, texture: Textures.Texture | string, frame: string) {
    const coordinates = { x: 715, y: 700 }

    super(scene, coordinates.x, coordinates.y, texture, frame)

    this.anims.create({
      key: 'buy-sell-stall-sign',
      frames: this.anims.generateFrameNames(BUY_SELL_STALL_SIGN_ATLAS, {
        start: 1,
        end: 31,
        prefix: 'buy-sell-stall-sign-',
        suffix: '.png',
      }),
      frameRate: 3,
      repeat: -1,
    })

    this.anims.play('buy-sell-stall-sign')

    this.setInteractive()

    this.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.startZoom()
    })
  }

  startZoom = () => {
    const camera = this.scene.cameras.main

    camera.pan(this.x, this.y, 3000, 'Power2')
    camera.zoomTo(5, 4000, undefined, undefined, (_cam, progress: number) => {
      if (progress === 1) this.scene.scene.start(BuySellStallScene.sceneId)
    })
  }
}
