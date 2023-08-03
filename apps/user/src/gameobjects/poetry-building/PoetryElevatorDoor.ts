import { PoetryLobbyScene } from '@scenes'

export class PoetryElevatorDoor {
  public static ATLAS_TEXTURE: string = 'POETRY_ELEVATOR_DOOR'
  public static FRAME: string = 'poetry-elevator-door-1.png'
  coordinates = { x: 1043, y: 555 }

  instance: Phaser.GameObjects.Sprite

  constructor(private scene: PoetryLobbyScene) {
    this.instance = scene.add
      .sprite(
        this.coordinates.x,
        this.coordinates.y,
        PoetryElevatorDoor.ATLAS_TEXTURE,
        PoetryElevatorDoor.FRAME,
      )
      .setScale(0.985)

    this.createMask()
  }

  createMask() {
    const rect = this.scene.make
      .graphics({})
      .fillRect(
        this.coordinates.x - this.instance.width / 4,
        this.coordinates.y - this.instance.height / 2,
        this.instance.width / 2,
        this.instance.height,
      )

    const mask = rect.createGeometryMask()

    this.instance.setMask(mask)
  }

  public startAnim() {
    this.instance.anims.create({
      key: 'poetry-elevator-door',
      frames: this.instance.anims.generateFrameNames(
        PoetryElevatorDoor.ATLAS_TEXTURE,
        {
          start: 1,
          end: 100,
          prefix: 'poetry-elevator-door-',
          suffix: '.png',
        },
      ),
      frameRate: 30,
    })

    this.instance.anims.play('poetry-elevator-door')
  }
}
