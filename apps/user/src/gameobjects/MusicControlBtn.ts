import { HomeScene } from '@scenes'

export class MusicControlBtn {
  public static playTexture$ = 'play-btn'
  public static stopTexture$ = 'stop-btn'
  instance: Phaser.GameObjects.Sprite
  songObject: Phaser.Sound.BaseSound

  constructor(
    private scene: HomeScene,
    private songKey: string,
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    this.instance = scene.add.sprite(1480, 945, MusicControlBtn.stopTexture$)

    const { instance } = this

    const { POINTER_OVER, POINTER_OUT } = Phaser.Input.Events
    const grow = instance.scale / 10

    //fixed to camera
    instance.setScrollFactor(0)

    instance.setInteractive()

    instance.on(POINTER_OVER, () => {
      const { scale } = instance

      const newScale = (Math.abs(scale) + grow) * Math.sign(scale)
      instance.setScale(newScale)
    })

    instance.on(POINTER_OUT, () => {
      const { scale } = instance

      const newScale = (Math.abs(scale) - grow) * Math.sign(scale)
      instance.setScale(newScale)
    })

    instance.on(Phaser.Input.Events.POINTER_DOWN, () => this.toggleSong())
  }

  toggleSong() {
    const { songKey } = this

    if (!this.scene.sound.get(songKey)) {
      return
    }

    this.songObject = this.scene.sound.get(songKey)

    if (this.songObject.isPlaying) {
      this.songObject.pause()
    } else if (this.songObject.isPaused) {
      this.songObject.resume()
    }

    //toggle player animation
    const anim = this.player.anims.currentAnim
    const isPlaying = this.player.anims.isPlaying && anim.key === 'orchestra'

    if (isPlaying) {
      this.player.anims.stop()
      this.player.setTexture('character')
    } else {
      this.player.anims.restart()
    }

    //toggle cloud hovering
    const songContainer = this.scene.songContainer
    const isHovering = songContainer.isHovering

    if (isHovering) {
      songContainer.pauseHovering()
    } else {
      songContainer.resumeHovering()
    }

    //toggle button texture
    this.toggleTexture()
  }

  toggleTexture() {
    const { instance } = this

    switch (instance.texture.key) {
      case MusicControlBtn.playTexture$:
        instance.setTexture(MusicControlBtn.stopTexture$)
        break

      case MusicControlBtn.stopTexture$:
        instance.setTexture(MusicControlBtn.playTexture$)
        break

      default:
        instance.setTexture(MusicControlBtn.playTexture$)
    }
  }
}
