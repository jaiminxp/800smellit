import Phaser, { Scene } from 'phaser'

export class BuySellSign extends Phaser.GameObjects.Sprite {
  constructor(scene: Scene, texture: string, frame: string) {
    const coordinates = { x: 2873, y: 610 }

    super(scene, coordinates.x, coordinates.y, texture, frame)

    this.anims.create({
      key: 'buy-sell',
      frames: this.anims.generateFrameNames(texture, {
        start: 1,
        end: 2,
        prefix: 'buy-sell-sign-',
        suffix: '.png',
      }),
      frameRate: 2,
      repeat: -1,
    })

    this.anims.play('buy-sell')
  }
}
