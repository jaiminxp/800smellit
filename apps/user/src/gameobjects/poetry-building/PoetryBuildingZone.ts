import { PoetryLobbyScene, HomeScene } from '@scenes'

export class PoetryBuildingZone {
  instance: Phaser.GameObjects.Zone

  constructor(private scene: HomeScene) {
    const coordinates = { x: 1405, y: 80 }
    const dimensions = { w: 270, h: 680 }

    this.instance = scene.add
      .zone(coordinates.x, coordinates.y, dimensions.w, dimensions.h)
      .setOrigin(0)
      .setInteractive()

    this.instance.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.startZoom()
      scene.clearTimeoutEvents()
      scene.sound.stopAll()

      scene.sound.play('poetry-building-sequence')
    })
  }

  startZoom = () => {
    const camera = this.scene.cameras.main

    camera.stopFollow()
    camera.pan(1535, 700, 3000, 'Power2')
    camera.zoomTo(10, 4000, undefined, undefined, (_cam, progress: number) => {
      if (progress === 1) this.scene.scene.start(PoetryLobbyScene.sceneId)
    })
  }
}
