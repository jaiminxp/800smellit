import { POETRY_ELEVATOR_ENTER, POETRY_ELEVATOR_EXIT } from '@/constants/events'
import { HomeScene } from '@scenes'

export default class PoetryElevatorScene extends Phaser.Scene {
  public static sceneId = 'poetry-elevatorscene'

  constructor() {
    super(PoetryElevatorScene.sceneId)

    window.addEventListener(POETRY_ELEVATOR_EXIT, () => {
      this.sound.removeAll()
      this.scene.start(HomeScene.sceneId, { skipMonologue: true })
    })
  }

  create() {
    //background
    this.add.image(0, 0, 'poetry-elevator-bg').setOrigin(0)

    window.dispatchEvent(new CustomEvent(POETRY_ELEVATOR_ENTER))
  }
}
