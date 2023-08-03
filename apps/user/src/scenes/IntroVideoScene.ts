import Phaser from 'phaser'
import { HomeScene } from '@scenes'

export default class IntroVideoScene extends Phaser.Scene {
  public static sceneId = 'introvideoscene'
  constructor() {
    super(IntroVideoScene.sceneId)
  }

  create() {
    //skip videos on click
    this.input.on(Phaser.Input.Events.POINTER_DOWN, () =>
      this.scene.start(HomeScene.sceneId),
    )

    const introVideo = this.add.video(0, 0, 'intro').setOrigin(0)
    introVideo.displayHeight = 1080
    introVideo.displayWidth = 2080
    introVideo.play()

    introVideo.on(
      'complete',
      () => {
        const transitionVideo = this.add.video(0, 0, 'transition').setOrigin(0)
        transitionVideo.displayHeight = 1080
        transitionVideo.displayWidth = 2080
        transitionVideo.play()

        transitionVideo.on(
          'complete',
          () => {
            this.scene.start(HomeScene.sceneId)
          },
          this,
        )
      },
      this,
    )
  }
}
