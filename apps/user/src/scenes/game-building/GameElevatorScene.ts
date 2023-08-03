import { HOME_MULTIATLAS } from '@/constants/textures'

export default class GameElevatorScene extends Phaser.Scene {
  public static sceneId = 'game-elevatorscene'

  constructor() {
    super(GameElevatorScene.sceneId)
  }

  create() {
    //background
    this.add.image(0, 0, 'game-elevator-bg').setOrigin(0)

    this.add
      .image(10, 10, HOME_MULTIATLAS, 'fun-games/fun-games (1).png')
      .setOrigin(0)
      .setScale(0.6)
  }
}
