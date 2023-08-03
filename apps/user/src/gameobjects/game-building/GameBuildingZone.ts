import { GameLobbyScene, HomeScene } from '@scenes'

export class GameBuildingZone {
  instance: Phaser.GameObjects.Zone

  constructor(private scene: HomeScene) {
    const coordinates = { x: 1891, y: 40 }
    const dimensions = { w: 366, h: 725 }

    this.instance = scene.add
      .zone(coordinates.x, coordinates.y, dimensions.w, dimensions.h)
      .setOrigin(0)
      .setInteractive()

    this.instance.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.startZoom()
      scene.clearTimeoutEvents()
      scene.sound.stopAll()
      scene.sound.play('game-building-sequence')
    })
  }

  startZoom = () => {
    const camera = this.scene.cameras.main

    camera.stopFollow()
    camera.pan(2190, 660, 2000, 'Power2')
    camera.zoomTo(6.3, 3000, undefined, undefined, (_cam, progress: number) => {
      if (progress === 1) this.scene.scene.start(GameLobbyScene.sceneId)
    })
  }
}
