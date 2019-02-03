import {RefereeHelper} from "./helpers/RefereeHelper";
import {CvDice} from "./types";
import {Cvt} from "./helpers/Cvt";
import {IoHelper} from "../src/helpers/ioHelper";
import {ExportWorld} from "../src/types/world";
import {MigrationHelper} from "../src/helpers/MigrationHelpers";

declare var cv: any

export class Referee {
  constructor() {
  }

  diceHelper: any = null
  world: ExportWorld


  init() {
    this.diceHelper = new cv.DiceHelper()
  }


  /**
   * returns dices and draws debug into imgMatCopy
   * @param imgMatCopy
   */
  getDiceValue(imgMatCopy: any): CvDice {

    if (!this.diceHelper) this.init()

    let _dices = this.diceHelper.getDiceValues(imgMatCopy)
    this.diceHelper.drawDiceDebug(_dices, imgMatCopy)

    const dices: CvDice[] = []

    const numDices = _dices.size()
    for (let i = 0; i < numDices; i++) {
      dices.push(Cvt.convertDice(_dices.get(i)))
      console.log(_dices.get(i))
    }

    if (dices.length === 0) throw new Error(`no dice found`)

    return dices[0]
  }


  importWorld(exportWorld: ExportWorld) {
    this.world = exportWorld
    console.log(exportWorld)
  }


}
