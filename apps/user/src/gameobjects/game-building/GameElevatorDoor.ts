import { GameLobbyScene } from '@scenes'

export class GameElevatorDoor {
  public static ATLAS_TEXTURE = 'GAME_ELEVATOR_DOOR'
  public static FRAME = 'game-elevator-door-1.png'
  coordinates = { x: 1115, y: 563 }

  instance: Phaser.GameObjects.Sprite

  constructor(private scene: GameLobbyScene) {
    this.instance = scene.add
      .sprite(
        this.coordinates.x,
        this.coordinates.y,
        GameElevatorDoor.ATLAS_TEXTURE,
        GameElevatorDoor.FRAME
      )
      .setScale(0.98, 1)

    this.createMask()
  }

  createMask() {
    const rect = this.scene.make
      .graphics({})
      .fillRect(
        this.coordinates.x - this.instance.width / 4 + 9,
        this.coordinates.y - this.instance.height / 2 - 5,
        this.instance.width / 2 - 58,
        this.instance.height
      )

    const mask = rect.createGeometryMask()

    this.instance.setMask(mask)

    this.scene.input.enableDebug(rect)
  }

  public startAnim() {
    this.instance.anims.create({
      key: 'game-elevator-door',
      frames: this.instance.anims.generateFrameNames(
        GameElevatorDoor.ATLAS_TEXTURE,
        {
          start: 1,
          end: 250,
          prefix: 'game-elevator-door-',
          suffix: '.png',
        }
      ),
      frameRate: 60,
    })

    this.instance.anims.play('game-elevator-door')
  }
}
