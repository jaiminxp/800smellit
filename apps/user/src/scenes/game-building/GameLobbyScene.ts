import { GameElevatorDoor } from '@/gameobjects/game-building/GameElevatorDoor'
import { GameElevatorScene } from '@scenes'

export default class GameLobbyScene extends Phaser.Scene {
  public static sceneId: string = 'game-lobbyscene'
  elevatorDoor: GameElevatorDoor

  constructor() {
    super(GameLobbyScene.sceneId)
  }

  create() {
    //background
    this.add.image(0, 0, 'game-lobby').setOrigin(0)

    this.elevatorDoor = new GameElevatorDoor(this)

    const camera = this.cameras.main

    setTimeout(() => {
      camera.pan(1105, 540, 3000, 'Power2')
      camera.zoomTo(3, 4000, undefined, undefined, (_cam, progress: number) => {
        if (progress === 1) {
          this.elevatorDoor.startAnim()
        }
      })
    }, 2000)

    this.elevatorDoor.instance.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => this.scene.start(GameElevatorScene.sceneId),
    )
  }
}
