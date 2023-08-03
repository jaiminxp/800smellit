import Phaser, { Scene } from 'phaser'

export class ServicesSign extends Phaser.GameObjects.Sprite {
  constructor(scene: Scene, texture: string, frame: string) {
    const coordinates = { x: 2874, y: 662 }

    super(scene, coordinates.x, coordinates.y, texture, frame)

    this.anims.create({
      key: 'services',
      frames: this.anims.generateFrameNames(texture, {
        start: 1,
        end: 7,
        prefix: 'services-sign-',
        suffix: '.png',
      }),
      frameRate: 3,
      repeat: -1,
    })

    this.anims.play('services')
  }
}
