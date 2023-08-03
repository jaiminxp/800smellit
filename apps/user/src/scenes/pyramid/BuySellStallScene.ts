export default class BuySellStallScene extends Phaser.Scene {
  public static sceneId = 'buy-sell-stall-scene'

  constructor() {
    super(BuySellStallScene.sceneId)
  }

  create() {
    //background
    this.add.image(0, 0, 'buy-sell-stall-bg').setOrigin(0)
  }
}
