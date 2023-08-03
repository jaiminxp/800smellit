import { PoetryElevatorDoor } from '../../gameobjects/poetry-building/PoetryElevatorDoor'
import { PoetryElevatorScene } from '@scenes'

export default class PoetryLobbyScene extends Phaser.Scene {
  public static sceneId: string = 'poetry-lobbyscene'
  elevatorDoor: PoetryElevatorDoor

  constructor() {
    super(PoetryLobbyScene.sceneId)
  }

  create() {
    //background
    this.add.image(0, 0, 'poetry-lobby').setOrigin(0)

    this.elevatorDoor = new PoetryElevatorDoor(this)

    const camera = this.cameras.main

    setTimeout(() => {
      camera.pan(1040, 540, 3000, 'Power2')
      camera.zoomTo(
        2.75,
        4000,
        undefined,
        undefined,
        (_cam, progress: number) => {
          if (progress === 1) {
            this.elevatorDoor.startAnim()
          }
        },
      )
    }, 2000)

    this.elevatorDoor.instance.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => this.scene.start(PoetryElevatorScene.sceneId),
    )
  }
}
