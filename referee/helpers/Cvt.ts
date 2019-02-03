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
      color: [tokenFromCv.color[0], tokenFromCv.color[1], tokenFromCv.color[2]],
      colorRgb: [tokenFromCv.colorRgb[2], tokenFromCv.colorRgb[1], tokenFromCv.colorRgb[1]],
    }


    return token
  }

  //from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  static rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }



}
