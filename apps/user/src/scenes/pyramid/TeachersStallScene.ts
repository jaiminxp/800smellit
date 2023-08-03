export default class TeachersStallScene extends Phaser.Scene {
  public static sceneId = 'teachers-stall-scene'

  constructor() {
    super(TeachersStallScene.sceneId)
  }

  create() {
    //background
    this.add.image(0, 0, 'teachers-stall-bg').setOrigin(0)
  }
}
