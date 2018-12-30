import {PlainPoint} from "../types/drawing";
import {defaultFieldShape} from "../constants";

export class CoordHelper {


  public static toAbsolutePos(point: PlainPoint, offsetX: number, offsetY: number,  scaleX: number, scaleY: number, xScaleCorrectionOffset: number = 0, yScaleCorrectionOffset: number = 0): PlainPoint {

    return {
      x: point.x - (offsetX + xScaleCorrectionOffset) / scaleX,
      y:  point.y - (offsetY + yScaleCorrectionOffset) / scaleY,
    }
  }

  public static toSnapGridCoords(point: PlainPoint, gridSizeInPx: number): PlainPoint {
    return {
      x: Math.floor((point.x / gridSizeInPx)) * gridSizeInPx,
      y: Math.floor((point.y / gridSizeInPx)) * gridSizeInPx,
    }
  }
}