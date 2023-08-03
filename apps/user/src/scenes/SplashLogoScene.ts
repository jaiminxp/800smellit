import Phaser from 'phaser'
import { ENTER_BTN_ATLAS } from '@/constants/textures'
import { IntroVideoScene } from '@scenes'

export default class SplashLogoScene extends Phaser.Scene {
  public static sceneId = 'splashlogoscene'

  constructor() {
    super(SplashLogoScene.sceneId)
  }

  create() {
    const introBtn = this.add.sprite(
      1040,
      540,
      ENTER_BTN_ATLAS,
      'intro-btn (1).png'
    )

    introBtn.setInteractive()

    this.anims.create({
      key: 'enterbtn',
      frames: this.anims.generateFrameNames(ENTER_BTN_ATLAS, {
        start: 1,
        end: 5,
        prefix: 'intro-btn (',
        suffix: ').png',
      }),
      frameRate: 4,
      repeat: -1,
    })

    introBtn.on(
      'pointerdown',
      () => {
        this.scene.start(IntroVideoScene.sceneId)
      },
      this
    )

    introBtn.anims.play('enterbtn')
  }
}
