import {PlainPoint} from "../src/types/drawing";
import {rotatePointBy} from "../src/helpers/interactionHelper";
import * as QRCode from "qrcode";
import {VariableIndicatorQrCodeData} from "../src/types/world";
import {qrCodeCorrectionLevel, qrCodeDataVersion, qrCodeSizeInPx} from "../src/constants";
import Bitmap = createjs.Bitmap;


export class VariableIndicatorDrawer {
  private constructor() {
  }

  /**
   *
   * @param {createjs.Stage} stage
   * @param {number} stageWidth
   * @param {number} stageHeight
   * @param {number} outerCircleDiameterInPx
   * @param {number} innerCircleDiameterInPx
   * @param {number} numOfFields
   * @param {boolean} isBoolVar if true then numOfFields is ignored
   * @param {string} innerText
   * @param fontSizeInPx
   * @param fontName
   * @param innerTextFontSizeInPx
   * @param strokeThickness
   * @param drawQrCode
   */
  public static async drawVariableIndicator(stage: createjs.Stage,
                                      stageWidth: number,
                                      stageHeight: number,
                                      outerCircleDiameterInPx: number,
                                      innerCircleDiameterInPx: number,
                                      numOfFields: number,
                                      innerText: string,
                                      isBoolVar: boolean,
                                      fontSizeInPx: number,
                                      fontName: string,
                                      strokeThickness: number,
                                      drawQrCode: boolean
  ): Promise<void> {

    const color = 'black'

    const centerPoint: PlainPoint = {
      x: stageWidth / 2,
      y: stageHeight / 2
    }

    const innerCircleRadius = innerCircleDiameterInPx / 2

    let outerCircle = new createjs.Shape()
    outerCircle.graphics
      .beginStroke(color)
      .setStrokeStyle(strokeThickness)
      .drawCircle(centerPoint.x, centerPoint.y, outerCircleDiameterInPx / 2 - (strokeThickness/2))


    if (isBoolVar) {
      numOfFields = 2
    }

    const fieldDegree = 360 / numOfFields
    let count = -(Math.ceil((numOfFields - 1) / 2)) //because 0

    for (let i = 0; i < numOfFields; i++) {

      let line = new createjs.Shape()

      const degree = fieldDegree * i
      const lineEndPoint = rotatePointBy(centerPoint.x, centerPoint.y, stageWidth / 2, 0, degree)
      const lineStartPoint = rotatePointBy(centerPoint.x,
        centerPoint.y, stageWidth / 2, stageHeight / 2 - innerCircleRadius, degree)

      // console.log(lineEndPoint)

      let yText = (stageHeight / 2 - innerCircleRadius) / 2

      line.graphics
        .beginStroke(color)
        .setStrokeStyle(strokeThickness)
        .moveTo(lineStartPoint.x, lineStartPoint.y)
        .lineTo(lineEndPoint.x, lineEndPoint.y)

      stage.addChild(line)

      let textDegree = degree + fieldDegree / 2

      let text = new createjs.Text()
      text.font = `${fontSizeInPx}px ${fontName}`

      if (isBoolVar) {
        if (i === 0) {
          text.text = 'true'
        }
        else {
          text.text = 'false'
        }

      }
      else {
        if (i < numOfFields / 2) {
          text.text = i.toString()
        }
        else {
          text.text = count.toString()
          count++
        }
      }


      const textWidth = text.getMeasuredWidth()
      const textHeight = text.getMeasuredHeight()
      const textPoint = rotatePointBy(centerPoint.x,
        centerPoint.y, stageWidth / 2, yText, textDegree)
      text.x = textPoint.x - textWidth / 2
      text.y = textPoint.y - textHeight / 2

      stage.addChild(text)

    }

    let innerCircle = new createjs.Shape()
    innerCircle.graphics
      .beginFill('transparent')
      .beginStroke(color)
      .setStrokeStyle(strokeThickness)
      .drawCircle(centerPoint.x, centerPoint.y, innerCircleRadius - (strokeThickness/2))


    let qrCodeData: VariableIndicatorQrCodeData = {
      version: qrCodeDataVersion,
      qrType: "varInd",
      oDiam: outerCircleDiameterInPx,
      iDiam: innerCircleDiameterInPx,
      fields: numOfFields,
      text: innerText,
      fSize: fontSizeInPx,
      fName: fontName,
    }


    let innerTextShape = new createjs.Text()

    innerTextShape.font = `${fontSizeInPx}px ${fontName}`

    innerTextShape.text = innerText
    const innerTextShapeHeight = innerTextShape.getMeasuredHeight()




    const innerCircleContentSize = innerTextShapeHeight + (drawQrCode ? qrCodeSizeInPx : 0)
    const centerYTop = stageHeight / 2 - (innerCircleContentSize / 2)

    if (drawQrCode) {



      try {
        const qrResult = await QRCode.toString(JSON.stringify(qrCodeData), {
          errorCorrectionLevel: qrCodeCorrectionLevel,
          type: 'svg',
          width: qrCodeSizeInPx
        });

        let container = new createjs.Container()
        let bitmap: Bitmap
        bitmap = new createjs.Bitmap("data:image/svg+xml;base64," + window.btoa(qrResult));//window.btoa(qrResult)

        // bitmap = new createjs.Bitmap(qrResult);
        bitmap.x = 0
        bitmap.y = 0
        // bitmap.scaleX = qrCodeSizeInPx / bitmap.image.width
        // bitmap.scaleY = qrCodeSizeInPx / bitmap.image.height
        bitmap.regX = 0
        bitmap.regY = 0

        container.addChild(bitmap)

        container.x = stageWidth / 2 - (qrCodeSizeInPx / 2)
        container.y = centerYTop

        // container.regX =  (qrCodeSizeInPx / 2)
        // container.regY =  (qrCodeSizeInPx / 2)

        stage.addChild(container)

      } catch(err) {
        throw err
      }
    }

    innerTextShape.x = stageWidth / 2
    // innerTextShape.y = stageHeight / 2 - innerTextShapeHeight / 2
    innerTextShape.y = centerYTop + + (drawQrCode ? qrCodeSizeInPx : 0)
    innerTextShape.textAlign = 'center'



    stage.addChild(innerTextShape)
    stage.addChild(innerCircle)

    stage.addChild(outerCircle)


  }

  private static getMaxTextLineWidth(text: string): number {

    const lines = text.split('\n')

    let maxWidth = 0;

    for (const line of lines) {
      let innerTextShape = new createjs.Text()
      innerTextShape.text = line
      const innerTextShapeWidth = innerTextShape.getMeasuredWidth()

      if (innerTextShapeWidth > maxWidth) {
        maxWidth = innerTextShapeWidth
      }
      const innerTextShapeHeight = innerTextShape.getMeasuredHeight()
    }

    return maxWidth
  }

  private static getPointOnLine(startX: number, startY: number, endX: number, endY: number, xVal: number): number {

    //y = mx + n
    const m = endY - startY / endX - startX

    //n = y - mx
    const n = startY - m * startX

    return m * xVal + n
  }

}