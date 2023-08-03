import Phaser from 'phaser'
import {
  ENTER_BTN_ATLAS,
  HAND_ATLAS,
  HOME_MULTIATLAS,
  IDLE_ATLAS,
  ORCHESTRA_ATLAS,
  VENUES_STALL_SIGN_ATLAS,
  SERVICES_STALL_SIGN_ATLAS,
  BUY_SELL_STALL_SIGN_ATLAS,
  TEACHERS_STALL_SIGN_ATLAS,
  WALK_ATLAS,
  THEATRE_SIGN_ATLAS,
  MUSIC_BUILDING_SEQUENCE,
  VENUES_SIGN_ATLAS,
  TEACHERS_SIGN_ATLAS,
  SERVICES_SIGN_ATLAS,
  BUY_SELL_SIGN_ATLAS,
  MUSIC_SIGN_ATLAS,
  ART_SIGN_ATLAS,
  GAME_SIGN_ATLAS,
} from '@/constants/textures'
import { ArtElevatorDoor } from '../gameobjects/art-building/ArtElevatorDoor'
import { PoetryElevatorDoor } from '../gameobjects/poetry-building/PoetryElevatorDoor'
import { MusicElevatorDoor } from '../gameobjects/music-building/MusicElevatorDoor'
import { GameElevatorDoor } from '../gameobjects/game-building/GameElevatorDoor'
import { MusicControlBtn } from '../gameobjects/MusicControlBtn'
import { SongContainer } from '../gameobjects/SongOfTheDay'
import { isDev, config } from '@config'

export default class PreloadScene extends Phaser.Scene {
  public static sceneId = 'preloadscene'
  constructor() {
    super(PreloadScene.sceneId)
  }

  renderProgressBar() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 2 - 310, height / 2 - 60, 600, 100)

    const loadingText = this.make.text({
      x: width / 2 - 100,
      y: height / 2 + 80,
      text: 'Loading...',
      style: {
        font: '40px monospace',
      },
    })

    const percentText = this.make.text({
      x: width / 2 - 20,
      y: height / 2 - 20,
      text: '0%',
      style: {
        font: '28px monospace',
      },
    })

    this.load.on('progress', function (value: number) {
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(width / 2 - 300, height / 2 - 50, 580 * value, 80)
      percentText.setText(Math.floor(value * 100) + '%')
    })

    this.load.on(Phaser.Loader.Events.COMPLETE, () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
      percentText.destroy()

      isDev && this.scene.start(config.sceneAfterLoad)
    })
  }

  init() {
    this.renderProgressBar()
  }

  loadSplashLogoSceneAssets() {
    this.load.atlas(
      ENTER_BTN_ATLAS,
      'assets/frames/intro-btn/spritesheet.png',
      'assets/frames/intro-btn/spritesheet.json',
    )
  }

  loadIntroVideoSceneAssets() {
    this.load.video(
      'intro',
      'assets/videos/intro.mp4',
      'canplaythrough',
      false,
      false,
    )

    this.load.video(
      'transition',
      'assets/videos/transition.mp4',
      'canplaythrough',
      false,
      false,
    )
  }

  loadHomeSceneAssets() {
    this.load.image('background', 'assets/images/background.jpg')
    this.load.image('suggestion-box', 'assets/images/suggestion-box.png')

    this.load.image('logo', 'assets/images/logo.png')
    this.load.image(SongContainer.texture$, 'assets/images/cloud.png')

    //UI
    this.load.image('play', 'assets/images/ResumeButton.png')
    this.load.image('character', 'assets/images/arthur.png')
    this.load.image('replay', 'assets/images/replay.png')
    this.load.image('skip', 'assets/images/skip.png')
    this.load.image('arrow', 'assets/images/arrow.png')
    this.load.image('volume-up', 'assets/images/volume-up.png')
    this.load.image('volume-down', 'assets/images/volume-down.png')
    this.load.image('volume-bar', 'assets/images/volume-bar.png')
    this.load.image(MusicControlBtn.playTexture$, 'assets/images/play.png')
    this.load.image(MusicControlBtn.stopTexture$, 'assets/images/stop.png')

    this.load.audio('arthur-monologue', 'assets/audio/arthur-monologue.mp3')
    this.load.audio('song-of-the-day', 'assets/audio/song-of-the-day.mp3')
    this.load.audio(
      MUSIC_BUILDING_SEQUENCE,
      'assets/audio/music-building-sequence.mp3',
    )
    this.load.audio(
      'art-building-sequence',
      'assets/audio/art-building-sequence.mp3',
    )
    this.load.audio(
      'poetry-building-sequence',
      'assets/audio/poetry-building-sequence.mp3',
    )
    this.load.audio(
      'game-building-sequence',
      'assets/audio/game-building-sequence.mp3',
    )
    this.load.audio('pyramid-sequence', 'assets/audio/pyramid-sequence.mp3')

    //spritesheets
    this.load.multiatlas(
      HOME_MULTIATLAS,
      'assets/frames/homescene/spritesheet.json',
      'assets/frames/homescene',
    )

    this.load.atlas(
      MUSIC_SIGN_ATLAS,
      'assets/frames/building-signs/music-sign/spritesheet.png',
      'assets/frames/building-signs/music-sign/spritesheet.json',
    )

    this.load.atlas(
      ART_SIGN_ATLAS,
      'assets/frames/building-signs/art-sign/spritesheet.png',
      'assets/frames/building-signs/art-sign/spritesheet.json',
    )

    this.load.atlas(
      THEATRE_SIGN_ATLAS,
      'assets/frames/building-signs/theatre-sign/spritesheet.png',
      'assets/frames/building-signs/theatre-sign/spritesheet.json',
    )

    this.load.atlas(
      GAME_SIGN_ATLAS,
      'assets/frames/building-signs/game-sign/spritesheet.png',
      'assets/frames/building-signs/game-sign/spritesheet.json'
    )

    this.load.atlas(
      VENUES_SIGN_ATLAS,
      'assets/frames/pyramid-signs/venues-sign/spritesheet.png',
      'assets/frames/pyramid-signs/venues-sign/spritesheet.json',
    )

    this.load.atlas(
      TEACHERS_SIGN_ATLAS,
      'assets/frames/pyramid-signs/teachers-sign/spritesheet.png',
      'assets/frames/pyramid-signs/teachers-sign/spritesheet.json',
    )

    this.load.atlas(
      SERVICES_SIGN_ATLAS,
      'assets/frames/pyramid-signs/services-sign/spritesheet.png',
      'assets/frames/pyramid-signs/services-sign/spritesheet.json',
    )

    this.load.atlas(
      BUY_SELL_SIGN_ATLAS,
      'assets/frames/pyramid-signs/buy-sell-sign/spritesheet.png',
      'assets/frames/pyramid-signs/buy-sell-sign/spritesheet.json',
    )

    //arthur animations
    this.load.atlas(
      WALK_ATLAS,
      'assets/frames/walk/spritesheet.png',
      'assets/frames/walk/spritesheet.json',
    )

    this.load.atlas(
      HAND_ATLAS,
      'assets/frames/hand/spritesheet.png',
      'assets/frames/hand/spritesheet.json',
    )

    this.load.atlas(
      IDLE_ATLAS,
      'assets/frames/idle/spritesheet.png',
      'assets/frames/idle/spritesheet.json',
    )

    this.load.atlas(
      ORCHESTRA_ATLAS,
      'assets/frames/orchestra/spritesheet.png',
      'assets/frames/orchestra/spritesheet.json',
    )
  }

  loadMusicLobbySceneAssets() {
    this.load.image('lobby', 'assets/images/lobby.jpg')
    this.load.atlas(
      MusicElevatorDoor.ATLAS_TEXTURE,
      'assets/frames/music-elevator-door/spritesheet.png',
      'assets/frames/music-elevator-door/spritesheet.json',
    )
  }

  loadMusicElevatorSceneAssets() {
    this.load.image('music-elevator-bg', 'assets/images/music-elevator-bg.jpg')
  }

  loadArtLobbySceneAssets() {
    this.load.image('art-lobby', 'assets/images/art-lobby.jpg')
    this.load.atlas(
      ArtElevatorDoor.ATLAS_TEXTURE,
      'assets/frames/art-elevator-door/spritesheet.png',
      'assets/frames/art-elevator-door/spritesheet.json',
    )
  }

  loadArtElevatorSceneAssets() {
    this.load.image('art-elevator-bg', 'assets/images/art-elevator-bg.jpg')
  }

  loadPoetryLobbySceneAssets() {
    this.load.image('poetry-lobby', 'assets/images/poetry-lobby.jpg')
    this.load.atlas(
      PoetryElevatorDoor.ATLAS_TEXTURE,
      'assets/frames/poetry-elevator-door/spritesheet.png',
      'assets/frames/poetry-elevator-door/spritesheet.json',
    )
  }

  loadPoetryElevatorSceneAssets() {
    this.load.image(
      'poetry-elevator-bg',
      'assets/images/poetry-elevator-bg.jpg',
    )
  }

  loadGameLobbySceneAssets() {
    this.load.image('game-lobby', 'assets/images/game-lobby.jpg')
    this.load.atlas(
      GameElevatorDoor.ATLAS_TEXTURE,
      'assets/frames/game-elevator-door/spritesheet.png',
      'assets/frames/game-elevator-door/spritesheet.json',
    )
  }

  loadGameElevatorSceneAssets() {
    this.load.image('game-elevator-bg', 'assets/images/game-elevator-bg.jpg')
  }

  loadPyramidSceneAssets() {
    this.load.image(
      'pyramid-interior-bg',
      'assets/images/pyramid-interior-bg.jpg',
    )

    this.load.image('exit', 'assets/images/exit.png')

    this.load.atlas(
      VENUES_STALL_SIGN_ATLAS,
      'assets/frames/pyramid-signs/stall-signs/venues-sign/spritesheet.png',
      'assets/frames/pyramid-signs/stall-signs/venues-sign/spritesheet.json',
    )

    this.load.atlas(
      SERVICES_STALL_SIGN_ATLAS,
      'assets/frames/pyramid-signs/stall-signs/services-sign/spritesheet.png',
      'assets/frames/pyramid-signs/stall-signs/services-sign/spritesheet.json',
    )

    this.load.atlas(
      BUY_SELL_STALL_SIGN_ATLAS,
      'assets/frames/pyramid-signs/stall-signs/buy-sell-sign/spritesheet.png',
      'assets/frames/pyramid-signs/stall-signs/buy-sell-sign/spritesheet.json',
    )

    this.load.atlas(
      TEACHERS_STALL_SIGN_ATLAS,
      'assets/frames/pyramid-signs/stall-signs/teachers-sign/spritesheet.png',
      'assets/frames/pyramid-signs/stall-signs/teachers-sign/spritesheet.json',
    )
  }

  loadServicesStallSceneAssets() {
    this.load.image('services-stall-bg', 'assets/images/services-stall-bg.jpg')
  }

  loadBuySellStallSceneAssets() {
    this.load.image('buy-sell-stall-bg', 'assets/images/buy-sell-stall-bg.jpg')
  }

  loadTeachersStallSceneAssets() {
    this.load.image('teachers-stall-bg', 'assets/images/teachers-stall-bg.jpg')
  }

  loadVenuesStallSceneAssets() {
    this.load.image('venues-stall-bg', 'assets/images/venues-stall-bg.jpg')
  }

  //preload all assets
  preload() {
    this.load.setBaseURL(window.location.href)

    this.loadSplashLogoSceneAssets()
    this.loadIntroVideoSceneAssets()
    this.loadHomeSceneAssets()
    this.loadMusicLobbySceneAssets()
    this.loadMusicElevatorSceneAssets()
    this.loadArtLobbySceneAssets()
    this.loadArtElevatorSceneAssets()
    this.loadPoetryLobbySceneAssets()
    this.loadPoetryElevatorSceneAssets()
    this.loadGameLobbySceneAssets()
    this.loadGameElevatorSceneAssets()
    this.loadPyramidSceneAssets()
    this.loadServicesStallSceneAssets()
    this.loadBuySellStallSceneAssets()
    this.loadTeachersStallSceneAssets()
    this.loadVenuesStallSceneAssets()
  }
}
