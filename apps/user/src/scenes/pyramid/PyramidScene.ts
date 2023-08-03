import {
  SERVICES_STALL_SIGN_ATLAS,
  VENUES_STALL_SIGN_ATLAS,
  BUY_SELL_STALL_SIGN_ATLAS,
  TEACHERS_STALL_SIGN_ATLAS,
} from '@/constants/textures'
import { VenuesStallSign } from '../../gameobjects/pyramid/stall-signs/VenuesStallSign'
import { ServicesStallSign } from '../../gameobjects/pyramid/stall-signs/ServicesStallSign'
import { BuySellStallSign } from '../../gameobjects/pyramid/stall-signs/BuySellStallSign'
import { TeachersStallSign } from '../../gameobjects/pyramid/stall-signs/TeachersStallSign'
import HomeScene from '../HomeScene'

export default class PyramidScene extends Phaser.Scene {
  public static sceneId = 'pyramid-scene'

  constructor() {
    super(PyramidScene.sceneId)
  }

  create() {
    //background
    this.add.image(0, 0, 'pyramid-interior-bg').setOrigin(0)

    // exit b
    const exitBtn = this.add.image(1098, 798, 'exit').setInteractive()

    exitBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.sound.stopAll()
      this.scene.start(HomeScene.sceneId, { skipMonologue: true })
    })

    const venuesStallSign = new VenuesStallSign(
      this,
      VENUES_STALL_SIGN_ATLAS,
      'venues-stall-sign-1.png'
    )
    this.add.existing(venuesStallSign)

    const servicesStallSign = new ServicesStallSign(
      this,
      SERVICES_STALL_SIGN_ATLAS,
      'services-stall-sign-1.png'
    )
    this.add.existing(servicesStallSign)

    const buySellStallSign = new BuySellStallSign(
      this,
      BUY_SELL_STALL_SIGN_ATLAS,
      'buy-sell-stall-sign-1.png'
    )
    this.add.existing(buySellStallSign)

    const teachersStallSign = new TeachersStallSign(
      this,
      TEACHERS_STALL_SIGN_ATLAS,
      'teachers-stall-sign-1.png'
    )
    this.add.existing(teachersStallSign)
  }
}
