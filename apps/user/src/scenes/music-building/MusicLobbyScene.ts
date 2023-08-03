import { MusicElevatorDoor } from '../../gameobjects/music-building/MusicElevatorDoor'
import { MusicElevatorScene } from '@scenes'

export default class MusicLobbyScene extends Phaser.Scene {
  public static sceneId = 'music-lobbyscene'
  elevatorDoor: MusicElevatorDoor

  constructor() {
    super(MusicLobbyScene.sceneId)
  }

  create() {
    //background
    this.add.image(0, 0, 'lobby').setOrigin(0)

    this.elevatorDoor = new MusicElevatorDoor(this)

    const camera = this.cameras.main

    setTimeout(() => {
      camera.pan(1042, 560, 3000, 'Power2')
      camera.zoomTo(
        3.5,
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
      () => this.scene.start(MusicElevatorScene.sceneId),
    )
  }
}
