import { ArtElevatorDoor } from '../../gameobjects/art-building/ArtElevatorDoor'
import { ArtElevatorScene } from '@scenes'

export default class ArtLobbyScene extends Phaser.Scene {
  public static sceneId = 'art-lobbyscene'
  elevatorDoor: ArtElevatorDoor

  constructor() {
    super(ArtLobbyScene.sceneId)
  }

  create() {
    //background
    this.add.image(0, 0, 'art-lobby').setOrigin(0)

    this.elevatorDoor = new ArtElevatorDoor(this)

    const camera = this.cameras.main

    setTimeout(() => {
      camera.pan(1040, 400, 3000, 'Power2')
      camera.zoomTo(5, 4000, undefined, undefined, (_cam, progress: number) => {
        if (progress === 1) {
          this.elevatorDoor.startAnim()
        }
      })
    }, 2000)

    this.elevatorDoor.instance.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => this.scene.start(ArtElevatorScene.sceneId)
    )
  }
}
