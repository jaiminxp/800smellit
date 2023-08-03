import Phaser, { Scene, Textures } from 'phaser'
import { SERVICES_STALL_SIGN_ATLAS } from '@/constants/textures'
import { worldBounds } from '@/constants'
import { ServicesStallScene } from '@scenes'

export class ServicesStallSign extends Phaser.GameObjects.Sprite {
  constructor(scene: Scene, texture: Textures.Texture | string, frame: string) {
    const coordinates = { x: 1825, y: 545 }

    super(scene, coordinates.x, coordinates.y, texture, frame)

    this.anims.create({
      key: 'services-stall-sign',
      frames: this.anims.generateFrameNames(SERVICES_STALL_SIGN_ATLAS, {
        start: 1,
        end: 41,
        prefix: 'services-stall-sign-',
        suffix: '.png',
      }),
      frameRate: 4,
      repeat: -1,
    })

    this.anims.play('services-stall-sign')

    this.setInteractive()

    this.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.startZoom()
    })
  }

  startZoom = () => {
    this.scene.cameras.main.setBounds(0, 0, worldBounds.w, worldBounds.h)
    const camera = this.scene.cameras.main

    camera.setBounds(0, 0, worldBounds.w, worldBounds.h)

    camera.pan(1600, 590, 3000, 'Power2')
    camera.zoomTo(4.2, 4000, undefined, undefined, (_cam, progress: number) => {
      if (progress === 1) this.scene.scene.start(ServicesStallScene.sceneId)
    })
  }
}
