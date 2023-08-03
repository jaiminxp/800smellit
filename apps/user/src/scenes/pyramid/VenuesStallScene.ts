export default class VenuesStallScene extends Phaser.Scene {
  public static sceneId = 'venues-stall-scene'

  constructor() {
    super(VenuesStallScene.sceneId)
  }

  create() {
    //background
    this.add.image(0, 0, 'venues-stall-bg').setOrigin(0)
  }
}
