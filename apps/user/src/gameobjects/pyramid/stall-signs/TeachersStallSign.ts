import Phaser, { Scene, Textures } from 'phaser'
import { TEACHERS_STALL_SIGN_ATLAS } from '@/constants/textures'
import { TeachersStallScene } from '@scenes'

export class TeachersStallSign extends Phaser.GameObjects.Sprite {
  constructor(scene: Scene, texture: Textures.Texture | string, frame: string) {
    const coordinates = { x: 300, y: 570 }

    super(scene, coordinates.x, coordinates.y, texture, frame)

    this.setScale(0.9)

    this.anims.create({
      key: 'teachers-stall-sign',
      frames: this.anims.generateFrameNames(TEACHERS_STALL_SIGN_ATLAS, {
        start: 1,
        end: 41,
        prefix: 'teachers-stall-sign-',
        suffix: '.png',
      }),
      frameRate: 4,
      repeat: -1,
    })

    this.anims.play('teachers-stall-sign')

    this.setInteractive()

    this.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.startZoom()
    })
  }

  startZoom = () => {
    const camera = this.scene.cameras.main

    camera.pan(this.x + 100, this.y + 50, 3000, 'Power2')
    camera.zoomTo(4.2, 4000, undefined, undefined, (_cam, progress: number) => {
      if (progress === 1) this.scene.scene.start(TeachersStallScene.sceneId)
    })
  }
}
