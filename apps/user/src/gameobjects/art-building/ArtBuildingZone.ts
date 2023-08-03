import { HomeScene, ArtLobbyScene } from '@scenes'

export class ArtBuildingZone {
  instance: Phaser.GameObjects.Zone

  constructor(private scene: HomeScene) {
    const coordinates = { x: 910, y: 52 }
    const dimensions = { w: 345, h: 720 }

    this.instance = scene.add
      .zone(coordinates.x, coordinates.y, dimensions.w, dimensions.h)
      .setOrigin(0)
      .setInteractive()

    this.instance.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.startZoom()
      scene.clearTimeoutEvents()
      scene.sound.stopAll()
      scene.sound.play('art-building-sequence')
    })
  }

  startZoom = () => {
    const camera = this.scene.cameras.main

    camera.stopFollow()
    camera.pan(1100, 720, 3000, 'Power2')
    camera.zoomTo(10, 4000, undefined, undefined, (_cam, progress: number) => {
      if (progress === 1)
        this.scene.scene.start(ArtLobbyScene.sceneId, {
          background: 'art-lobby',
        })
    })
  }
}
