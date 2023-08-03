import { ArtLobbyScene } from '@scenes'

export class ArtElevatorDoor {
  public static ATLAS_TEXTURE = 'ART_ELEVATOR_DOOR'
  public static FRAME = 'art-elevator-door-1.png'
  coordinates = { x: 1040, y: 420 }

  instance: Phaser.GameObjects.Sprite

  constructor(private scene: ArtLobbyScene) {
    this.instance = scene.add.sprite(
      this.coordinates.x,
      this.coordinates.y,
      ArtElevatorDoor.ATLAS_TEXTURE,
      ArtElevatorDoor.FRAME
    )

    this.createMask()
  }

  createMask() {
    const rect = this.scene.make
      .graphics({})
      .fillRect(
        this.coordinates.x - this.instance.width / 4,
        this.coordinates.y - this.instance.height / 2,
        this.instance.width / 2,
        this.instance.height
      )

    const mask = rect.createGeometryMask()

    this.instance.setMask(mask)
  }

  public startAnim() {
    this.instance.anims.create({
      key: 'art-elevator-door',
      frames: this.instance.anims.generateFrameNames(
        ArtElevatorDoor.ATLAS_TEXTURE,
        {
          start: 1,
          end: 100,
          prefix: 'art-elevator-door-',
          suffix: '.png',
        }
      ),
      frameRate: 30,
    })

    this.instance.anims.play('art-elevator-door')
  }
}
