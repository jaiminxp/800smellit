import Phaser from 'phaser'
import { worldBounds } from '@/constants'
import { FixedButton } from '../gameobjects/FixedButton'
import { BuySellSign } from '../gameobjects/pyramid/BuySellSign'
import { ServicesSign } from '../gameobjects/pyramid/ServicesSign'
import { TeachersSign } from '../gameobjects/pyramid/TeachersSign'
import { VenuesSign } from '../gameobjects/pyramid/VenuesSign'
import { DelayedEvent } from '@/types'
import { SongContainer } from '../gameobjects/SongOfTheDay'
import { MusicBuildingZone } from '../gameobjects/music-building/MusicBuildingZone'
import { MusicControlBtn } from '../gameobjects/MusicControlBtn'
import { ArtBuildingZone } from '../gameobjects/art-building/ArtBuildingZone'
import { PoetryBuildingZone } from '../gameobjects/poetry-building/PoetryBuildingZone'
import { GameBuildingZone } from '../gameobjects/game-building/GameBuildingZone'
import VolumeControls from '../gameobjects/VolumeControls'
import {
  ART_SIGN_ATLAS,
  BUY_SELL_SIGN_ATLAS,
  GAME_SIGN_ATLAS,
  HAND_ATLAS,
  HOME_MULTIATLAS,
  IDLE_ATLAS,
  MUSIC_SIGN_ATLAS,
  ORCHESTRA_ATLAS,
  SERVICES_SIGN_ATLAS,
  TEACHERS_SIGN_ATLAS,
  THEATRE_SIGN_ATLAS,
  VENUES_SIGN_ATLAS,
  WALK_ATLAS,
} from '@/constants/textures'
import { PyramidScene } from '@scenes'

export default class HomeScene extends Phaser.Scene {
  public static sceneId = 'homescene'
  public suggestionBox: Phaser.GameObjects.Image

  step = 35
  isIntroPlaying = true
  measurePoint = {}
  isMeasuring = false
  animationEvents: DelayedEvent[]
  bgAudio: Phaser.Sound.BaseSound
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  timeoutEvents: NodeJS.Timeout[]
  songContainer: SongContainer
  musicControlBtn: Phaser.GameObjects.Sprite
  musicBuildingZone: MusicBuildingZone
  artBuildingZone: ArtBuildingZone
  poetryBuildingZone: PoetryBuildingZone
  gameBuildingZone: GameBuildingZone
  volumeControls: VolumeControls
  isFirstRun = true

  init(data?: { skipMonologue: boolean }) {
    if (data && data.skipMonologue) {
      this.isFirstRun = false
    }
  }

  constructor() {
    super(HomeScene.sceneId)
    const firstDelay = 8500

    this.animationEvents = [
      {
        event: 'walk to #musicBuilding',
        delay: firstDelay,
        callback: this.walkTo,
        args: { x: 500, y: 800 },
      },
      {
        event: 'stop and point hand at #musicBuilding',
        delay: firstDelay + 1000,
        callback: this.stopMoving,
      },
      {
        event: 'walk to #artBuilding',
        delay: firstDelay + 2000,
        callback: this.walkTo,
        args: { x: 870, y: 800 },
      },
      {
        event: 'stop and point hand at #artBuilding',
        delay: firstDelay + 3000,
        callback: this.stopMoving,
      },
      {
        event: 'walk to #poetryBuilding',
        delay: firstDelay + 4000,
        callback: this.walkTo,
        args: { x: 1400, y: 800 },
      },
      {
        event: 'stop and point hand at #poetryBuilding',
        delay: firstDelay + 5000,
        callback: this.stopMoving,
      },
      {
        event: 'walk to #funGamesBuilding',
        delay: firstDelay + 6000,
        callback: this.walkTo,
        args: { x: 2000, y: 800 },
      },
      {
        event: 'stop and point hand at #funGamesBuilding',
        delay: firstDelay + 7000,
        callback: this.stopMoving,
      },
      {
        event: 'play idle at #funGamesBuilding',
        delay: firstDelay + 8000,
        callback: this.playIdle,
      },
      {
        event: 'walk to #marketplace',
        delay: firstDelay + 13000,
        callback: this.walkTo,
        args: { x: 2561, y: 800 },
      },
      {
        event: 'stop and point hand at #marketplace',
        delay: firstDelay + 14000,
        callback: this.stopMoving,
      },
      {
        event: 'play idle at #marketplace',
        delay: firstDelay + 15000,
        callback: this.playIdle,
      },
      {
        event: 'stop animation',
        delay: firstDelay + 30000,
        callback: this.stopAnim,
      },
    ]
  }

  startSongTimer = () => {
    this.isIntroPlaying = false

    if (this.isFirstRun) {
      //start song of the day after 3 seconds
      this.timeoutEvents.push(setTimeout(this.startSongOfTheDay, 3000))
    } else {
      this.startSongOfTheDay()
    }
  }

  create() {
    const { anims } = this
    this.sound.pauseOnBlur = false
    this.bgAudio = this.sound.add('arthur-monologue', { loop: false })
    this.bgAudio.on(Phaser.Sound.Events.COMPLETE, this.startSongTimer)
    this.bgAudio.on(
      Phaser.Sound.Events.PLAY,
      () => (this.isIntroPlaying = true),
    )
    this.bgAudio.play()

    this.add.image(0, 0, 'background').setOrigin(0)

    this.suggestionBox = this.add
      .image(270, 740, 'suggestion-box')
      .setInteractive()
      .setName('suggestion-box')

    const musicSign = this.add.sprite(
      600,
      145,
      MUSIC_SIGN_ATLAS,
      'music-sign-1.png',
    )

    const artSign = this.add.sprite(1080, 77, ART_SIGN_ATLAS, 'art-sign-1.png')

    const theatreSign = this.add.sprite(
      1539,
      140,
      THEATRE_SIGN_ATLAS,
      'theatre-sign-1.png',
    )
    theatreSign.setScale(0.28)

    const gameSign = this.add.sprite(
      2075,
      160,
      GAME_SIGN_ATLAS,
      'game-sign-1.png',
    )
    gameSign.setScale(0.5, 0.5)

    const marketplace = this.add.sprite(
      2875,
      325,
      HOME_MULTIATLAS,
      'marketplace/marketplace (1).png',
    )
    marketplace.setScale(0.8, 0.8)

    // neon signs on the pyramid
    const venuesSign = new VenuesSign(
      this,
      VENUES_SIGN_ATLAS,
      'venues-sign-1.png',
    )
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => this.startPyramidSequence())
    this.add.existing(venuesSign)

    const teachersSign = new TeachersSign(
      this,
      TEACHERS_SIGN_ATLAS,
      'teachers-sign-1.png',
    )
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => this.startPyramidSequence())
    this.add.existing(teachersSign)

    const servicesSign = new ServicesSign(
      this,
      SERVICES_SIGN_ATLAS,
      'services-sign-1.png',
    )
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => this.startPyramidSequence())
    this.add.existing(servicesSign)

    const buySellSign = new BuySellSign(
      this,
      BUY_SELL_SIGN_ATLAS,
      'buy-sell-sign-1.png',
    )
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => this.startPyramidSequence())
    this.add.existing(buySellSign)

    anims.create({
      key: 'music-sign',
      frames: this.anims.generateFrameNames(MUSIC_SIGN_ATLAS, {
        start: 1,
        end: 64,
        prefix: 'music-sign-',
        suffix: '.png',
      }),
      frameRate: 6,
      repeat: -1,
    })

    anims.create({
      key: 'art-sign',
      frames: this.anims.generateFrameNames(ART_SIGN_ATLAS, {
        start: 1,
        end: 35,
        prefix: 'art-sign-',
        suffix: '.png',
      }),
      frameRate: 5,
      repeat: -1,
    })

    anims.create({
      key: 'theatre-sign',
      frames: this.anims.generateFrameNames(THEATRE_SIGN_ATLAS, {
        start: 1,
        end: 111,
        prefix: 'theatre-sign-',
        suffix: '.png',
      }),
      frameRate: 6,
      repeat: -1,
    })

    anims.create({
      key: 'game-sign',
      frames: this.anims.generateFrameNames(GAME_SIGN_ATLAS, {
        start: 1,
        end: 14,
        prefix: 'game-sign-',
        suffix: '.png',
      }),
      frameRate: 2,
      repeat: -1,
    })

    anims.create({
      key: 'marketplace',
      frames: this.anims.generateFrameNames(HOME_MULTIATLAS, {
        start: 1,
        end: 20,
        prefix: 'marketplace/marketplace (',
        suffix: ').png',
      }),
      frameRate: 10,
      repeat: -1,
    })

    //walk
    anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames(WALK_ATLAS, {
        start: 1,
        end: 32,
        prefix: 'walk (',
        suffix: ').png',
      }),
      frameRate: 24,
      repeat: -1,
    })

    //hand
    anims.create({
      key: 'hand',
      frames: this.anims.generateFrameNames(HAND_ATLAS, {
        start: 1,
        end: 16,
        prefix: 'hand (',
        suffix: ').png',
      }),
      frameRate: 10,
      repeat: -1,
    })

    //idle
    anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames(IDLE_ATLAS, {
        start: 1,
        end: 2,
        prefix: 'idle (',
        suffix: ').png',
      }),
      frameRate: 3,
      repeat: -1,
    })

    //idle
    anims.create({
      key: 'orchestra',
      frames: this.anims.generateFrameNames(ORCHESTRA_ATLAS, {
        start: 1,
        end: 90,
        prefix: 'orchestra',
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    })

    musicSign.anims.play('music-sign')
    artSign.anims.play('art-sign')
    theatreSign.anims.play('theatre-sign')
    gameSign.anims.play('game-sign')
    marketplace.anims.play('marketplace')

    this.player = this.physics.add.sprite(103, 800, 'character')

    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, worldBounds.w, worldBounds.h)

    this.playerAnim()

    this.createZones()

    //render UI at last so it renders in front of everything
    this.createUI()

    if (!this.isFirstRun) {
      this.skipMonologue()
    }
  }

  startPyramidSequence() {
    this.clearTimeoutEvents()
    this.sound.stopAll()
    this.sound.play('pyramid-sequence', { loop: true })

    // zoom on pyramid
    const camera = this.cameras.main
    camera.stopFollow()
    camera.pan(2870, 295, 3000, 'Power2')
    camera.zoomTo(3.5, 4000, undefined, undefined, (_cam, progress: number) => {
      if (progress === 1) this.scene.start(PyramidScene.sceneId)
    })
  }

  createZones() {
    this.musicBuildingZone = new MusicBuildingZone(this)
    this.artBuildingZone = new ArtBuildingZone(this)
    this.poetryBuildingZone = new PoetryBuildingZone(this)
    this.gameBuildingZone = new GameBuildingZone(this)
  }

  createUI() {
    this.add.image(150, 100, 'logo')

    const moveCamera = (posX: number) => {
      // cannot move if the intro animation is playing
      if (!this.isIntroPlaying) {
        this.cameras.main.stopFollow()
        this.cameras.main.scrollX = posX
      }
    }

    const startPosX = 1600
    const btnY = 950

    const replayBtn = new FixedButton(this, startPosX + 370, btnY, 'replay')
    this.add.existing(replayBtn)

    replayBtn.on(Phaser.Input.Events.POINTER_DOWN, this.restartMonologue)

    const skipBtn = new FixedButton(this, startPosX + 240, btnY, 'skip')
    this.add.existing(skipBtn)

    skipBtn.on(Phaser.Input.Events.POINTER_DOWN, this.skipMonologue)

    const leftBtn = new FixedButton(this, startPosX, btnY, 'arrow')

    leftBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
      moveCamera(0)
    })
    this.add.existing(leftBtn).setScale(-1)

    const rightBtn = new FixedButton(this, startPosX + 120, btnY, 'arrow')
    rightBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
      moveCamera(3433)
    })
    this.add.existing(rightBtn)

    this.musicControlBtn = new MusicControlBtn(
      this,
      SongContainer.songKey,
      this.player,
    ).instance

    this.volumeControls = new VolumeControls(this, 2020, 150)

    // button container
    this.add.container(0, 0, [
      replayBtn,
      skipBtn,
      rightBtn,
      leftBtn,
      this.musicControlBtn,
      this.volumeControls,
    ])
  }

  clearTimeoutEvents = () => {
    for (const eventId of this.timeoutEvents) {
      clearTimeout(eventId)
    }
  }

  restartMonologue = () => {
    this.sound.removeAll()
    this.clearTimeoutEvents()
    this.scene.restart()
  }

  skipMonologue = () => {
    if (!this.isIntroPlaying) {
      return
    }

    this.clearTimeoutEvents()
    this.bgAudio.stop()
    this.player.setPosition(2561, 800)
    this.player.setVelocityX(0)
    this.player.anims.stop()
    this.player.setTexture('character')

    //start song of the day after 3s
    this.startSongTimer()
  }

  walkTo = (x: number, y: number) => {
    this.player.anims.play('walk')
    this.physics.moveTo(this.player, x, y, 60, 1000)
  }

  stopMoving = () => {
    this.player.setVelocityX(0)
    this.player.anims.play('hand')
  }

  playIdle = () => {
    this.player.anims.play('idle')
  }

  stopAnim = () => {
    this.player.anims.stop()
  }

  startSongOfTheDay = () => {
    this.player.anims.play('orchestra')

    //create new cloud instance
    this.songContainer = new SongContainer(this)

    //move cloud accross the scene
    this.songContainer.startHovering()

    //check for cloud position on every update
    this.events.on(Phaser.Scenes.Events.UPDATE, () => {
      this.songContainer.checkForBounds()
    })

    //play song of the day
    this.songContainer.startSong()
  }

  playerAnim() {
    // starting animation
    this.player.anims.play('idle')
    this.timeoutEvents = []

    for (const event of this.animationEvents) {
      if (event.args) {
        this.timeoutEvents.push(
          setTimeout(event.callback, event.delay, event.args.x, event.args.y),
        )
      } else {
        this.timeoutEvents.push(setTimeout(event.callback, event.delay))
      }
    }
  }
}
