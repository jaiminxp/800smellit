import Phaser from 'phaser'

export class FixedButton extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: Phaser.Textures.Texture | string
  ) {
    super(scene, x, y, texture)

    const { POINTER_OVER, POINTER_OUT } = Phaser.Input.Events
    const grow = 0.1

    //fixed to camera
    this.setScrollFactor(0)

    this.setInteractive()

    this.on(POINTER_OVER, () => {
      const newScale = (Math.abs(this.scale) + grow) * Math.sign(this.scale)
      this.setScale(newScale)
    })

    this.on(POINTER_OUT, () => {
      const newScale = (Math.abs(this.scale) - grow) * Math.sign(this.scale)
      this.setScale(newScale)
    })
  }
}
