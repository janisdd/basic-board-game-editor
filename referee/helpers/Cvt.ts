import {CvDice, CvKeyPoint, CvPoint, CvToken} from "../types";

export class Cvt {
  private constructor() {
  }


  static convertDice(diceFromCv: any): CvDice {

    const pips: CvKeyPoint[] = []

    if (diceFromCv.pips) {

      const num = diceFromCv.pips.size()

      for (let i = 0; i < num; i++) {

        const pip = diceFromCv.pips.get(i)

        if (!pip) continue


        pips.push({
          angle: pip.angle,
          pt: {
            x: pip.pt.x,
            y: pip.pt.y
          },
          size: pip.size
        })

      }


    }

    const dice: CvDice = {
      value:diceFromCv.value,
      pips,
      centerPoint: this.convertPoint(diceFromCv.centerPoint),
      bottomLeftPip: {
        size: diceFromCv.bottomLeftPip.size,
        pt: this.convertPoint(diceFromCv.bottomLeftPip.pt),
        angle: diceFromCv.bottomLeftPip.angle
      },
      topLeftPip: {
        size: diceFromCv.topLeftPip.size,
        pt: this.convertPoint(diceFromCv.topLeftPip.pt),
        angle: diceFromCv.topLeftPip.angle
      },
    }

    return dice

  }

  static convertPoint(pt: any): CvPoint {
    return {
      x: pt.x,
      y: pt.y
    }
  }


  static convertToken(tokenFromCv: any): CvToken {

    const token: CvToken = {
      bbox: {
        x: tokenFromCv.bbox.x,
        y: tokenFromCv.bbox.y,
        height: tokenFromCv.bbox.height,
        width: tokenFromCv.bbox.width
      },
      bottomPoint: this.convertPoint(tokenFromCv.bottomPoint),
      color: 'TODO' as any //TODO
    }


    return token
  }


}
