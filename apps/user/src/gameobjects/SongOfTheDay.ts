import Phaser from 'phaser'
import { worldBounds } from '../constants'
import { HomeScene } from '@scenes'

export class SongContainer {
  public static texture$ = 'cloud'
  public static songKey = 'song-of-the-day'

  instance: Phaser.GameObjects.Container
  sprite: Phaser.GameObjects.Sprite
  textObject: Phaser.GameObjects.Text
  text = "Willie's Sausage"
  hoverTween: Phaser.Tweens.Tween

  public get isHovering(): boolean {
    return this.hoverTween.isPlaying()
  }

  constructor(private scene: HomeScene) {
    const coordinates = {
      x: worldBounds.w,
      y: 0,
    }

    this.sprite = scene.add.sprite(0, 0, SongContainer.texture$).setOrigin(0)

    this.textObject = scene.add
      .text(105, 95, this.text, {
        fontFamily: 'Arial',
        fontSize: '24px',
        strokeThickness: 5,
        stroke: '#2e486f',
        fontStyle: 'bold',
      })
      .setOrigin(0)

    this.instance = scene.add.container(coordinates.x, coordinates.y, [
      this.sprite,
      this.textObject,
    ])
  }

  public startHovering() {
    this.hoverTween = this.scene.tweens.add({
      targets: this.instance,
      x: this.instance.x - worldBounds.w - this.sprite.width,
      duration: 20000,
      repeat: -1,
    })
  }

  public pauseHovering() {
    this.hoverTween.pause()
  }

  public resumeHovering() {
    this.hoverTween.resume()
  }

  public checkForBounds() {
    if (this.instance.x < -300) {
      this.instance.setPosition(worldBounds.w, this.instance.y)
    }
  }

  public startSong() {
    this.scene.sound.play(SongContainer.songKey, { loop: true })
  }
}
