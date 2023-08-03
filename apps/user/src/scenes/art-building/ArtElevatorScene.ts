import { ART_ELEVATOR_ENTER, ART_ELEVATOR_EXIT } from '@/constants/events'
import { HomeScene } from '@scenes'

export default class ArtElevatorScene extends Phaser.Scene {
  public static sceneId = 'art-elevatorscene'

  constructor() {
    super(ArtElevatorScene.sceneId)

    window.addEventListener(ART_ELEVATOR_EXIT, () => {
      this.sound.removeAll()
      this.scene.start(HomeScene.sceneId, { skipMonologue: true })
    })
  }

  create() {
    //background
    this.add.image(0, 0, 'art-elevator-bg').setOrigin(0)

    window.dispatchEvent(new CustomEvent(ART_ELEVATOR_ENTER))
  }
}
