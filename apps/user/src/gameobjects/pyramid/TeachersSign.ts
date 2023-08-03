import Phaser, { Scene } from 'phaser'

export class TeachersSign extends Phaser.GameObjects.Sprite {
  constructor(scene: Scene, texture: string, frame: string) {
    const coordinates = { x: 2882.73544973545, y: 717 }

    super(scene, coordinates.x, coordinates.y, texture, frame)

    this.anims.create({
      key: 'teachers',
      frames: this.anims.generateFrameNames(texture, {
        start: 1,
        end: 6,
        prefix: 'teachers-sign-',
        suffix: '.png',
      }),
      frameRate: 3,
      repeat: -1,
    })

    this.anims.play('teachers')
  }
}
