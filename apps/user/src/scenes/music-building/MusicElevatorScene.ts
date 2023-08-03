import { MUSIC_ELEVATOR_ENTER, MUSIC_ELEVATOR_EXIT } from '@/constants/events'
import { HomeScene } from '@scenes'

export default class MusicElevatorScene extends Phaser.Scene {
  public static sceneId = 'music-elevatorscene'

  constructor() {
    super(MusicElevatorScene.sceneId)
    window.addEventListener(MUSIC_ELEVATOR_EXIT, () => {
      this.sound.removeAll()
      this.scene.start(HomeScene.sceneId, { skipMonologue: true })
    })
  }

  create() {
    //background
    this.add.image(0, 0, 'music-elevator-bg').setOrigin(0)

    window.dispatchEvent(new CustomEvent(MUSIC_ELEVATOR_ENTER))
  }
}
