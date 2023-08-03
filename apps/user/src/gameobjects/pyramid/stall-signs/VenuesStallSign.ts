import Phaser, { Scene, Textures } from 'phaser'
import { VENUES_STALL_SIGN_ATLAS } from '@/constants/textures'
import { VenuesStallScene } from '@scenes'

export class VenuesStallSign extends Phaser.GameObjects.Sprite {
  constructor(scene: Scene, texture: Textures.Texture | string, frame: string) {
    const coordinates = { x: 1425, y: 715 }

    super(scene, coordinates.x, coordinates.y, texture, frame)

    this.anims.create({
      key: 'venues-stall-sign',
      frames: this.anims.generateFrameNames(VENUES_STALL_SIGN_ATLAS, {
        start: 1,
        end: 41,
        prefix: 'venues-stall-sign-',
        suffix: '.png',
      }),
      frameRate: 4,
      repeat: -1,
    })

    this.anims.play('venues-stall-sign')

    this.setInteractive()

    this.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.startZoom()
    })
  }

  startZoom = () => {
    const camera = this.scene.cameras.main

    camera.pan(this.x, this.y, 3000, 'Power2')
    camera.zoomTo(5, 4000, undefined, undefined, (_cam, progress: number) => {
      if (progress === 1) this.scene.scene.start(VenuesStallScene.sceneId)
    })
  }
}
