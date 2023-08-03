import Phaser, { Scene } from 'phaser'

export class VenuesSign extends Phaser.GameObjects.Sprite {
  constructor(scene: Scene, texture: string, frame: string) {
    const coordinates = { x: 2874, y: 557.3319789283629 }
    super(scene, coordinates.x, coordinates.y, texture, frame)

    this.anims.create({
      key: 'venues',
      frames: this.anims.generateFrameNames(texture, {
        start: 1,
        end: 100,
        prefix: 'venues-sign-',
        suffix: '.png',
      }),
      frameRate: 6,
      repeat: -1,
    })

    this.anims.play('venues')
  }
}
