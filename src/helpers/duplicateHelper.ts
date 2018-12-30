import {BezierPoint, FieldShape, ImgShape, LineShape} from "../types/drawing";
import {getNextShapeId} from "../state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import {copyPastDiffXInPx, copyPastDiffYInPx} from "../constants";


export class DuplicateHelper {
  private constructor() {
  }

  private static numberRegex = new RegExp('[0-9]+', 'm')

  /**
   *
   * @param {ReadonlyArray<FieldShape>} fieldShapes
   * @param {number} nextZIndex
   * @param {boolean} autoIncrementFieldTextNumbersOnDuplicate
   * @param {boolean} invertOrder false: 1,2,3 --> 4,5,6 true: 1,2,3 --> 6,5,4 (e.g. for ladder game)
   * @returns {ReadonlyArray<FieldShape>}
   */
  public static duplicateFieldShapes(fieldShapes: ReadonlyArray<FieldShape>, nextZIndex: number, autoIncrementFieldTextNumbersOnDuplicate: boolean, invertOrder: boolean): ReadonlyArray<FieldShape> {
    let copies: FieldShape[] = []


    let count = 0

    let numbersInFieldsStrings: Array<string | null> = [] //only 1 number per field

    //if we select 1, 3 then we want 4,5 probably?
    let maxNum: number | null = null

    if (autoIncrementFieldTextNumbersOnDuplicate) {
      for (const fieldShape of fieldShapes) {
        const match = this.numberRegex.exec(fieldShape.text)

        if (!match) {
          numbersInFieldsStrings.push(null)
          continue
        }

        const num = parseInt(match[0], 10)
        if (isNaN(num)) {
          numbersInFieldsStrings.push(null)
          continue
        }

        if (maxNum === null || num > maxNum) {
          maxNum = num
        }

        numbersInFieldsStrings.push(match[0])
      }
    }

    if (invertOrder && maxNum !== null) {
      maxNum = maxNum + fieldShapes.length
    }

    for (let i = 0; i < fieldShapes.length; i++) {
      const fieldShape = fieldShapes[i]

      let text = fieldShape.text

      if (autoIncrementFieldTextNumbersOnDuplicate && maxNum !== null) {
        const foundNumberString = numbersInFieldsStrings[i]
        if (foundNumberString !== null) {

          if (invertOrder) {
            text = text.replace(foundNumberString, (maxNum--).toString())
          }
          else {
            text = text.replace(foundNumberString, (++maxNum).toString())
          }
        }
      }

      const copy: FieldShape = {
        ...fieldShape,
        id: getNextShapeId(),
        x: fieldShape.x + copyPastDiffXInPx,
        y: fieldShape.y + copyPastDiffYInPx,
        zIndex: nextZIndex + count,
        connectedLinesThroughAnchorPoints: {},
        text
      }
      count++
      copies.push(copy)
    }

    return copies
  }

  public static duplicateImgShapes(imgShapes: ReadonlyArray<ImgShape>, nextZIndex: number): ReadonlyArray<ImgShape> {

    let copies: ImgShape[] = []

    let count = 0
    for (const imgShape of imgShapes) {
      const copy: ImgShape = {
        ...imgShape,
        id: getNextShapeId(),
        x: imgShape.x + copyPastDiffXInPx,
        y: imgShape.y + copyPastDiffYInPx,
        zIndex: nextZIndex + count
      }

      count++
      copies.push(copy)
    }

    return copies
  }

  public static duplicateLineShapes(lineShapes: ReadonlyArray<LineShape>, nextZIndex: number): ReadonlyArray<LineShape> {


    let copies: LineShape[] = []

    let count = 0
    for (const lineShape of lineShapes) {
      const copy: LineShape = {
        ...lineShape,
        id: getNextShapeId(),
        zIndex: nextZIndex + count,
        startPoint: {
          id: getNextShapeId(),
          x: lineShape.startPoint.x + copyPastDiffXInPx,
          y: lineShape.startPoint.y + copyPastDiffYInPx
        },
        points: lineShape.points.map<BezierPoint>(p => {
          return {
            id: getNextShapeId(),
            x: p.x + copyPastDiffXInPx,
            y: p.y + copyPastDiffYInPx,
            cp1: {
              id: getNextShapeId(),
              x: p.cp1.x + copyPastDiffXInPx,
              y: p.cp1.y + copyPastDiffYInPx
            },
            cp2: {
              id: getNextShapeId(),
              x: p.cp2.x + copyPastDiffXInPx,
              y: p.cp2.y + copyPastDiffYInPx
            },
            curveMode: p.curveMode
          }
        })
      }

      count++
      copies.push(copy)
    }

    return copies

  }

}