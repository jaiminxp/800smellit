import { MusicLobbyScene } from '@scenes'

export class MusicElevatorDoor {
  public static ATLAS_TEXTURE: string = 'ELEVATOR_DOOR'
  public static FRAME: string = 'elevator-door-1.png'
  coordinates = { x: 1042, y: 560 }

  instance: Phaser.GameObjects.Sprite

  constructor(private scene: MusicLobbyScene) {
    this.instance = scene.add.sprite(
      this.coordinates.x,
      this.coordinates.y,
      MusicElevatorDoor.ATLAS_TEXTURE,
      MusicElevatorDoor.FRAME,
    )

    this.createMask()
  }

  createMask() {
    const rect = this.scene.make
      .graphics({})
      .fillRect(
        this.coordinates.x - this.instance.width / 2,
        this.coordinates.y - this.instance.height / 2,
        this.instance.width,
        this.instance.height,
      )

    const mask = rect.createGeometryMask()

    this.instance.setMask(mask)
  }

  public startAnim() {
    this.instance.anims.create({
      key: 'elevator-door',
      frames: this.instance.anims.generateFrameNames(
        MusicElevatorDoor.ATLAS_TEXTURE,
        {
          start: 1,
          end: 125,
          prefix: 'elevator-door-',
          suffix: '.png',
        },
      ),
      frameRate: 30,
    })

    this.instance.anims.play('elevator-door')
  }
}
