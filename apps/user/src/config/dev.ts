import * as Scenes from '@scenes'
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
    arcade: { debug: true },
  },
  scene: sceneList,
}

const sceneAfterLoad = Scenes.IntroVideoScene.sceneId

export default {
  gameConfig,
  sceneAfterLoad,
}
