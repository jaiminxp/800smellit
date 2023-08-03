import { IntroVideoScene } from '@scenes'
import { sceneList } from '@scenes'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: 'scene-container',
    width: 2080,
    height: 1080,
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: sceneList,
}

const sceneAfterLoad = IntroVideoScene.sceneId

export default {
  gameConfig,
  sceneAfterLoad,
}
