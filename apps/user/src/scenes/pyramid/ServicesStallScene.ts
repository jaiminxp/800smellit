export default class ServicesStallScene extends Phaser.Scene {
  public static sceneId = 'services-stall-scene'

  constructor() {
    super(ServicesStallScene.sceneId)
  }

  create() {
    //background
    this.add.image(0, 0, 'services-stall-bg').setOrigin(0)
  }
}
