import { MUSIC_BUILDING_SEQUENCE } from '@/constants/textures'
import { MusicLobbyScene, HomeScene } from '@scenes'

export class MusicBuildingZone {
  instance: Phaser.GameObjects.Zone

  constructor(private scene: HomeScene) {
    const coordinates = { x: 460, y: 205 }
    const dimensions = { w: 280, h: 580 }

    this.instance = scene.add
      .zone(coordinates.x, coordinates.y, dimensions.w, dimensions.h)
      .setOrigin(0)
      .setInteractive()

    this.instance.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.startZoom()
      scene.clearTimeoutEvents()
      scene.sound.stopAll()
      scene.sound.play(MUSIC_BUILDING_SEQUENCE)
    })
  }

  startZoom = () => {
    const camera = this.scene.cameras.main

    camera.stopFollow()
    camera.pan(605, 660, 3000, 'Power2')
    camera.zoomTo(10, 4000, undefined, undefined, (_cam, progress: number) => {
      if (progress === 1)
        this.scene.scene.start(MusicLobbyScene.sceneId, {
          background: 'lobby',
        })
    })
  }
}
