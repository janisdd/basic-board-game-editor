import {
  AnchorPoint,
  BezierPoint,
  BorderPoint,
  BorderPointWithPos,
  ConnectedLinesThroughAnchorPointsMap,
  CurveMode,
  FieldShape,
  FieldSymbol, IsFieldAndLineConnectedResult,
  LineShape,
  PlainPoint,
  Point,
  Rect
} from "../types/drawing";
import globalState from '../state/state'
import {getNextShapeId} from "../state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import {addLineShape, set_selectedLinePointNewPosAction} from "../state/reducers/tileEditor/lineProperties/actions";
import {defaultArrowHeight, defaultArrowWidth, lineShapeDefaultColor} from "../constants";
import {MajorLineDirection, TileProps} from "../types/world";
import {Compiler} from "../../simulation/compiler/compiler";
import {GameUnit} from "../../simulation/model/executionUnit";
import {Logger} from "./logger";
import {renewAllZIndicesInTile} from "./someIndexHelper";

const langCompiler = require('../../simulation/compiler/langCompiler').parser


// export function getFieldAnchorPoints(fieldX: number, fieldY: number, width: number, height: number): ReadonlyArray<PlainPoint> {
//
//   const topAnchorPoint: PlainPoint = {
//     x: fieldX + width / 2,
//     y: fieldY
//   }
//
//   const botAnchorPoint: PlainPoint = {
//     x: fieldX + width / 2,
//     y: fieldY + height
//   }
//
//   const rightAnchorPoint: PlainPoint = {
//     x: fieldX + width,
//     y: fieldY + height / 2
//   }
//
//   const leftAnchorPoint: PlainPoint = {
//     x: fieldX,
//     y: fieldY + height / 2
//   }
//
//   return [topAnchorPoint, botAnchorPoint, rightAnchorPoint, leftAnchorPoint]
// }

const compiler = new Compiler(langCompiler)


/**
 * calcs the bounding box of a line (uses only the points not the lines segments itself)
 * we could also use the control points which would give us probably better results
 * but then we need to check much more points... (performance)
 * @param {LineShape} line
 * @returns {Rect}
 */
export function calcLineBoundingBox(line: LineShape): Rect {

  let minX = line.startPoint.x
  let minY = line.startPoint.y
  let maxX = line.startPoint.x
  let maxY = line.startPoint.y

  for (const point of line.points) {
    if (point.x < minX) {
      minX = point.x
    }
    if (point.x > maxX) {
      maxX = point.x
    }
    if (point.y < minY) {
      minY = point.y
    }
    if (point.y > maxY) {
      maxY = point.y
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }

}

//from https://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection
/**
 * check is done with strict compare (less than not less equal)
 * @param r1
 * @param r2
 */
export function intersectRect(r1: Rect, r2: Rect): boolean {

  if (r1.width < 0) {
    r1.x = r1.x + r1.width
    r1.width = -r1.width
  }
  if (r1.height < 0) {
    r1.y = r1.y + r1.height
    r1.height = -r1.height
  }

  return !(r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y);
}

/**
 * check is done with strict compare (less than not less equal)
 * @param rect1
 * @param point
 */
export function intersectPoint(rect1: Rect, point: PlainPoint) {

  if (rect1.width < 0) {
    rect1.x = rect1.x + rect1.width
    rect1.width = -rect1.width
  }
  if (rect1.height < 0) {
    rect1.y = rect1.y + rect1.height
    rect1.height = -rect1.height
  }

  return !(point.x > rect1.x + rect1.width ||
    point.x < rect1.x ||
    point.y > rect1.y + rect1.height ||
    point.y < rect1.y)

}

//too lazy https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
/**
 * rotates the point to the angle (use -angle)!?!
 * @param {number} originX
 * @param {number} originY
 * @param {number} x
 * @param {number} y
 * @param {number} angle
 * @returns {PlainPoint}
 */
export function rotatePointBy(originX: number, originY: number, x: number, y: number, angle: number): PlainPoint {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - originX)) + (sin * (y - originY)) + originX,
    ny = (cos * (y - originY)) - (sin * (x - originX)) + originY;
  return {
    x: nx,
    y: ny
  }
}

//too lazy https://stackoverflow.com/questions/9614109/how-to-calculate-an-angle-from-points
/**
 * returns the angle in degree between the two points
 * 0/360 is east (of anchor is top left from x,y
 * @param {number} anchorX
 * @param {number} anchorY
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
export function getAngleInDeg(anchorX: number, anchorY: number, x: number, y: number): number {

  // *  (anchor)
  //  \
  //   \
  //    * (point)

  const dy = y - anchorY;
  const dx = x - anchorX;
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}


export function calcAnchorPointsRaw(fieldX: number, fieldY: number, fieldWidth: number, fieldHeight: number, anchorPoints: ReadonlyArray<AnchorPoint>, xOffset: number, yOffset: number, rotationInDegree: number): ReadonlyArray<PlainPoint> {
  const points: PlainPoint[] = []

  for (const anchorPoint of anchorPoints) {

    const x = (anchorPoint.percentX / 100) * fieldWidth + fieldX + xOffset
    const y = (anchorPoint.percentY / 100) * fieldHeight + fieldY + yOffset

    const rotatedPoint = rotatePointBy(fieldX + fieldWidth / 2 + xOffset, fieldY + fieldHeight / 2 + yOffset, x, y,
      -rotationInDegree)

    points.push({x: rotatedPoint.x, y: rotatedPoint.y})
  }
  return points
}

export function calcAnchorPoints(field: FieldShape, fieldSymbols: ReadonlyArray<FieldSymbol>, anchorPoints: ReadonlyArray<AnchorPoint>): ReadonlyArray<PlainPoint> {

  //use field anchor point definitions
  let symbol: FieldSymbol | null = null
  if (field.createdFromSymbolGuid !== null) {
    symbol = fieldSymbols.find(p => p.guid === field.createdFromSymbolGuid)

    if (!symbol) {
      const msg = `could not find field symbol for guid ${field.createdFromSymbolGuid}`
      Logger.fatal(msg)
      throw new Error(msg)
    }
  }

  const anchorPointPos = calcAnchorPointsRaw(
    field.x,
    field.y,
    field.createdFromSymbolGuid !== null && symbol.overwriteWidth ? symbol.width : field.width,
    field.createdFromSymbolGuid !== null && symbol.overwriteHeight ? symbol.height : field.height,
    anchorPoints,
    0,
    0,
    field.createdFromSymbolGuid !== null && symbol.overwriteRotationInDeg ? symbol.rotationInDegree : field.rotationInDegree,
  )

  return anchorPointPos
}

export function calcAnchorPoint(field: FieldShape, fieldSymbols: ReadonlyArray<FieldSymbol>, anchorPoint: AnchorPoint): PlainPoint {

  //use field anchor point definitions
  let symbol: FieldSymbol | null = null
  if (field.createdFromSymbolGuid !== null) {
    symbol = fieldSymbols.find(p => p.guid === field.createdFromSymbolGuid)

    if (!symbol) {
      const msg = `could not find field symbol for guid ${field.createdFromSymbolGuid}`
      Logger.fatal(msg)
      throw new Error(msg)
    }
  }

  const anchorPointPos = calcSingleAnchorPoint(
    field.x,
    field.y,
    field.createdFromSymbolGuid !== null && symbol.overwriteWidth ? symbol.width : field.width,
    field.createdFromSymbolGuid !== null && symbol.overwriteHeight ? symbol.height : field.height,
    anchorPoint,
    0,
    0,
    field.createdFromSymbolGuid !== null && symbol.overwriteRotationInDeg ? symbol.rotationInDegree : field.rotationInDegree,
  )

  return anchorPointPos
}

export function calcSingleAnchorPoint(fieldX: number, fieldY: number, fieldWidth: number, fieldHeight: number, anchorPoint: AnchorPoint, xOffset: number, yOffset: number, rotationInDegree: number): PlainPoint {

  const x = (anchorPoint.percentX / 100) * fieldWidth + fieldX + xOffset
  const y = (anchorPoint.percentY / 100) * fieldHeight + fieldY + yOffset

  const rotatedPoint = rotatePointBy(fieldX + fieldWidth / 2 + xOffset, fieldY + fieldHeight / 2 + yOffset, x, y,
    -rotationInDegree)


  return {
    x: rotatedPoint.x,
    y: rotatedPoint.y
  }
}


/**
 * automatically connect the fields with lines based on the goto statements
 * @param {ReadonlyArray<FieldShape>} fields
 * @param fieldSymbols
 * @param newZIndex
 * @param topBorderPoints
 * @param botBorderPoints
 * @param leftBorderPoints
 * @param rightBorderPoint
 * @param tileWidth
 * @param tileHeight
 * @param borderPointsDiameterInPx
 * @param majorLineDirection the line direction to start with (to know where the line start (head) should be)
 * @param lineShapes the lines to check if a border point is connected to a line (not add a line twice)
 * @param insertLinesEvenIfFieldsIntersect
 */
export function autoConnectFieldsWithLinesByCmdText(
  fields: ReadonlyArray<FieldShape>,
  fieldSymbols: ReadonlyArray<FieldSymbol>,
  newZIndex: number,
  topBorderPoints: ReadonlyArray<BorderPoint>,
  botBorderPoints: ReadonlyArray<BorderPoint>,
  leftBorderPoints: ReadonlyArray<BorderPoint>,
  rightBorderPoint: ReadonlyArray<BorderPoint>,
  tileWidth: number,
  tileHeight: number,
  borderPointsDiameterInPx: number,
  majorLineDirection: MajorLineDirection,
  lineShapes: ReadonlyArray<LineShape>,
  insertLinesEvenIfFieldsIntersect: boolean
): void {

  //one field is possible if we connect a border point to a field
  if (fields.length === 0 && (topBorderPoints.length + botBorderPoints.length + leftBorderPoints.length + rightBorderPoint.length) <= 1) return

  const allBorderPoints: ReadonlyArray<BorderPointWithPos> =
    topBorderPoints.map<BorderPointWithPos>(p => {
      return {
        id: p.id,
        nextFieldId: p.nextFieldId,
        x: p.val,
        y: 0,
        val: p.val,
        connectedLineTuples: p.connectedLineTuples
      }
    })
      .concat(
        botBorderPoints.map(p => {
          return {
            id: p.id,
            nextFieldId: p.nextFieldId,
            x: p.val,
            y: tileHeight,
            val: p.val,
            connectedLineTuples: p.connectedLineTuples
          }
        })
      )
      .concat(
        leftBorderPoints.map(p => {
          return {
            id: p.id,
            nextFieldId: p.nextFieldId,
            x: 0,
            y: p.val,
            val: p.val,
            connectedLineTuples: p.connectedLineTuples
          }
        })
      )
      .concat(
        rightBorderPoint.map(p => {
          return {
            id: p.id,
            nextFieldId: p.nextFieldId,
            x: tileWidth,
            y: p.val,
            val: p.val,
            connectedLineTuples: p.connectedLineTuples
          }
        })
      )


  let lastZIndex = newZIndex
  for (const field of fields) {
    lastZIndex = connectFieldsFromRootFieldByCmdText(field, fields, fieldSymbols, lastZIndex, majorLineDirection,
      allBorderPoints, borderPointsDiameterInPx, lineShapes, insertLinesEvenIfFieldsIntersect)
  }

  //connect border points to the fields

  for (const borderPoint of allBorderPoints) {

    if (borderPoint.nextFieldId === null) continue

    const nextField = fields.find(p => p.id === borderPoint.nextFieldId)

    if (!nextField) {


      //could be another border point...
      const otherBorderPoint = allBorderPoints.find(p => p.id === borderPoint.nextFieldId)

      if (!otherBorderPoint) {
        throw new Error(`cannot find target field id or other border point id: ${borderPoint.nextFieldId}, to connect to the border point with id ${borderPoint.id}`)
      }

      const rootBorderPointRect: Rect = {
        x: borderPoint.x,
        y: borderPoint.y,
        height: borderPointsDiameterInPx,
        width: borderPointsDiameterInPx
      }

      if (insertLinesEvenIfFieldsIntersect === false) {
        if (intersectPoint(rootBorderPointRect, otherBorderPoint)) {
          continue
        }
      }

      //are already connected?
      let alreadyConnected = false

      for (let i = 0; i < borderPoint.connectedLineTuples.length; i++) {
        const borderPointTuple = borderPoint.connectedLineTuples[i];


        if (otherBorderPoint.connectedLineTuples.some(p => p.lineId === borderPointTuple.lineId)) {
          alreadyConnected = true
        }
      }

      if (alreadyConnected) {
        continue
      }


      connectPointsWithLine(
        borderPoint.x,
        borderPoint.y,
        borderPointsDiameterInPx,
        borderPointsDiameterInPx,
        true,
        otherBorderPoint.x,
        otherBorderPoint.y,
        borderPointsDiameterInPx,
        borderPointsDiameterInPx,
        true,
        lastZIndex++,
        majorLineDirection,
        true
      )

      continue
    }

    let nextFieldSymbol: FieldSymbol | null = null

    if (nextField.createdFromSymbolGuid !== null) {
      const symbol = fieldSymbols.find(p => p.guid === nextField.createdFromSymbolGuid)

      if (symbol) {
        nextFieldSymbol = symbol
      } else {
        throw new Error(`next field symbol not found, guid: ${nextField.createdFromSymbolGuid}, from border point: ${borderPoint.id}`)
      }
    }


    if (insertLinesEvenIfFieldsIntersect === false) {
      //check if they intersect
      if (intersectPoint(nextField, borderPoint)) {
        continue
      }
    }

    let alreadyConnected = false

    for (let i = 0; i < borderPoint.connectedLineTuples.length; i++) {
      const borderPointTuple = borderPoint.connectedLineTuples[i];


      if (nextField.anchorPoints.some(p => p.connectedLineTuples.some(k => k.lineId === borderPointTuple.lineId))) {
        alreadyConnected = true
      }
    }

    if (alreadyConnected) {
      continue
    }

    connectPointsWithLine(
      borderPoint.x,
      borderPoint.y,
      borderPointsDiameterInPx,
      borderPointsDiameterInPx,
      true,
      nextField.x,
      nextField.y,
      (nextFieldSymbol !== null && nextFieldSymbol.overwriteWidth ? nextFieldSymbol.width : nextField.width),
      (nextFieldSymbol !== null && nextFieldSymbol.overwriteHeight ? nextFieldSymbol.height : nextField.height),
      false,
      lastZIndex++,
      majorLineDirection,
      true
    )
  }

}


/**
 * connects all reachable fields from the root field
 * @param {FieldShape} rootField
 * @param {ReadonlyArray<FieldShape>} fields
 * @param fieldSymbols
 * @param newZIndex
 * @param majorLineDirection
 * @param allBorderPoints
 * @param borderPointsDiameterInPx
 * @param lineShapes the lines to check if a border point is connected to a line (not add a line twice)
 * @param insertLinesEvenIfFieldsIntersect
 * @returns {number} the new z index
 */
function connectFieldsFromRootFieldByCmdText(
  rootField: FieldShape,
  fields: ReadonlyArray<FieldShape>,
  fieldSymbols: ReadonlyArray<FieldSymbol>,
  newZIndex: number,
  majorLineDirection: MajorLineDirection,
  allBorderPoints: ReadonlyArray<BorderPointWithPos>,
  borderPointsDiameterInPx: number,
  lineShapes: ReadonlyArray<LineShape>,
  insertLinesEvenIfFieldsIntersect: boolean
): number {

  if (rootField.cmdText === null || rootField.cmdText.trim() === '') return

  let game: GameUnit
  try {
    game = compiler.parse(rootField.cmdText)
  } catch (err) {
    const msg = err as string
    throw new Error(`parsing error on field with id '${rootField.id}': ${msg}`)
  }

  let lastZIndex = newZIndex

  let rootFieldSymbol: FieldSymbol | null = null

  if (rootField.createdFromSymbolGuid !== null) {
    const symbol = fieldSymbols.find(p => p.guid === p.createdFromSymbolGuid)

    if (symbol) {
      rootFieldSymbol = symbol
    }
  }

  let nextFieldIsBorderPoint = false

  for (const statement of game.statements) {

    if (statement.type === 'control_goto') {

      lastZIndex = connectFields(rootField,
        rootFieldSymbol,
        statement.targetId,
        fields,
        fieldSymbols,
        nextFieldIsBorderPoint,
        majorLineDirection,
        allBorderPoints,
        borderPointsDiameterInPx,
        false,
        lastZIndex,
        lineShapes,
        insertLinesEvenIfFieldsIntersect
      )

    } else if (statement.type === 'control_ifElse') {

      lastZIndex = connectFields(rootField,
        rootFieldSymbol,
        statement.trueTargetId,
        fields,
        fieldSymbols,
        nextFieldIsBorderPoint,
        majorLineDirection,
        allBorderPoints,
        borderPointsDiameterInPx,
        true,
        lastZIndex,
        lineShapes,
        insertLinesEvenIfFieldsIntersect
      )

      lastZIndex = connectFields(rootField,
        rootFieldSymbol,
        statement.falseTargetId,
        fields,
        fieldSymbols,
        nextFieldIsBorderPoint,
        majorLineDirection,
        allBorderPoints,
        borderPointsDiameterInPx,
        true,
        lastZIndex,
        lineShapes,
        insertLinesEvenIfFieldsIntersect
      )

    }

  }

  return lastZIndex
}

/**
 * connects the fields if they are not already connected by a line
 * @param {FieldShape} rootField
 * @param {FieldSymbol | null} rootFieldSymbol
 * @param nextFieldId
 * @param fieldShapes
 * @param {ReadonlyArray<FieldSymbol>} fieldSymbols
 * @param {boolean} nextFieldIsBorderPoint
 * @param {MajorLineDirection} majorLineDirection
 * @param allBorderPoints
 * @param borderPointsDiameterInPx
 * @param showLineEndArrow true: show line end arrow, false: not, if the next field is a border point the end arrow is drawn ignoring this value
 * @param {number} zIndex
 * @param lineShapes the lines to check if a border point is connected to a line (not add a line twice)
 * @param insertLinesEvenIfFieldsIntersect
 * @returns {number} returns the next z index
 */
function connectFields(rootField: FieldShape,
                       rootFieldSymbol: FieldSymbol | null,
                       nextFieldId: number,
                       fieldShapes: ReadonlyArray<FieldShape>,
                       fieldSymbols: ReadonlyArray<FieldSymbol>,
                       nextFieldIsBorderPoint: boolean,
                       majorLineDirection: MajorLineDirection,
                       allBorderPoints: ReadonlyArray<BorderPointWithPos>,
                       borderPointsDiameterInPx: number,
                       showLineEndArrow: boolean,
                       zIndex: number,
                       lineShapes: ReadonlyArray<LineShape>,
                       insertLinesEvenIfFieldsIntersect: boolean
): number {

  let nextFieldSymbol: FieldSymbol | null = null
  let fieldsAreAlreadyConnected = false

  let nextField = fieldShapes.find(p => p.id === nextFieldId)

  let nextFieldConnectedLineIds: ReadonlyArray<number> = []

  if (!nextField) {

    //could be a border point

    const targetBorderPoint = allBorderPoints.find(p => p.id === nextFieldId)

    if (!targetBorderPoint) {
      Logger.fatal(`next field/border point not found id: ${nextFieldId}, from field: ${rootField.id}`)
      return
    }

    if (insertLinesEvenIfFieldsIntersect === false) {
      if (intersectPoint(rootField, targetBorderPoint)) {
        return zIndex
      }
    }

    nextFieldConnectedLineIds = targetBorderPoint.connectedLineTuples.map(p => p.lineId)

    //too lazy to restructure method...just create a temp next field
    nextField = {
      ...rootField,
      id: targetBorderPoint.id,
      x: targetBorderPoint.x,
      y: targetBorderPoint.y,
      width: borderPointsDiameterInPx,
      height: borderPointsDiameterInPx,
      createdFromSymbolGuid: null
    }
    nextFieldIsBorderPoint = true
  } else {

    nextFieldConnectedLineIds = nextField.anchorPoints
      .reduce<number[]>((previousValue, currentValue) =>
          previousValue.concat(currentValue.connectedLineTuples.map(p => p.lineId)),
        [])

  }


  if (nextField.createdFromSymbolGuid !== null) {
    const symbol = fieldSymbols.find(p => p.guid === nextField.createdFromSymbolGuid)

    if (symbol) {
      nextFieldSymbol = symbol
    }
  }

  if (insertLinesEvenIfFieldsIntersect === false) {

    const targetRect: Rect = {
      x: nextField.x,
      y: nextField.y,
      width: (nextFieldSymbol !== null && nextFieldSymbol.overwriteWidth ? nextFieldSymbol.width : nextField.width),
      height: (nextFieldSymbol !== null && nextFieldSymbol.overwriteHeight ? nextFieldSymbol.height : nextField.height),
    }

    if (intersectRect(rootField, targetRect)) {
      return zIndex
    }
  }

  //if the fields are already connected do nothing

  for (let j = 0; j < rootField.anchorPoints.length; j++) {
    const rootAnchorPoint = rootField.anchorPoints[j];

    //if we find a line in anchorPoint and rootAnchorPoint with the same id
    //  then fields are already connected

    if (nextFieldConnectedLineIds.some(lineId => rootAnchorPoint.connectedLineTuples.some(k => k.lineId === lineId))) {
      fieldsAreAlreadyConnected = true
    }
  }


  if (fieldsAreAlreadyConnected) {
    return zIndex
  }

  connectPointsWithLine(
    rootField.x,
    rootField.y,
    (rootFieldSymbol !== null && rootFieldSymbol.overwriteWidth ? rootFieldSymbol.width : rootField.width),
    (rootFieldSymbol !== null && rootFieldSymbol.overwriteHeight ? rootFieldSymbol.height : rootField.height),
    false,
    nextField.x,
    nextField.y,
    (nextFieldSymbol !== null && nextFieldSymbol.overwriteWidth ? nextFieldSymbol.width : nextField.width),
    (nextFieldSymbol !== null && nextFieldSymbol.overwriteHeight ? nextFieldSymbol.height : nextField.height),
    nextFieldIsBorderPoint,
    zIndex,
    majorLineDirection,
    nextFieldIsBorderPoint || showLineEndArrow
  )

  zIndex++
  return zIndex
}


/**
 *
 * @param {number} startFieldX
 * @param {number} startFieldY
 * @param {number} startFieldWidth
 * @param {number} startFieldHeight
 * @param {boolean} startIsBorderPoint border points don't need to be adjusted in x,y because they are circular
 * @param {number} endFieldX
 * @param {number} endFieldY
 * @param {number} endFieldWidth
 * @param {number} endFieldHeight
 * @param {boolean} endIsBorderPoint border points don't need to be adjusted in x,y because they are circular
 * @param {number} zIndex
 * @param {MajorLineDirection} majorLineDirection
 * @param addEndArrow
 */
function connectPointsWithLine(startFieldX: number, startFieldY: number, startFieldWidth: number, startFieldHeight: number,
                               startIsBorderPoint: boolean,
                               endFieldX: number, endFieldY: number, endFieldWidth: number, endFieldHeight: number,
                               endIsBorderPoint: boolean,
                               zIndex: number,
                               majorLineDirection: MajorLineDirection,
                               addEndArrow: boolean
) {


  let startPoint: PlainPoint = null

  let endPoint: PlainPoint = null

  if (majorLineDirection === MajorLineDirection.topToBottom || majorLineDirection === MajorLineDirection.bottomToTop) {

    if (startFieldY <= endFieldY) {
      //start field is above current field --> line should start at bottom of the start field
      //line goes downwards

      startPoint = {
        x: startFieldX + (startIsBorderPoint ? 0 : startFieldWidth / 2),
        y: startFieldY + (startIsBorderPoint ? 0 : startFieldHeight)
      }

      endPoint = {
        x: endFieldX + (endIsBorderPoint ? 0 : endFieldWidth / 2),
        y: endFieldY
      }

    } else {
      //else the end field is above the start field so lines goes upwards

      startPoint = {
        x: startFieldX + (startIsBorderPoint ? 0 : startFieldWidth / 2),
        y: startFieldY
      }

      endPoint = {
        x: endFieldX + (endIsBorderPoint ? 0 : endFieldWidth / 2),
        y: endFieldY + (endIsBorderPoint ? 0 : endFieldHeight)
      }
    }
  } else if (majorLineDirection === MajorLineDirection.leftToRight || majorLineDirection === MajorLineDirection.rightToLeft) {

    if (startFieldX <= endFieldX) {
      //line goes from left to right

      startPoint = {
        x: startFieldX + (startIsBorderPoint ? 0 : startFieldWidth),
        y: startFieldY + (startIsBorderPoint ? 0 : startFieldHeight / 2)
      }

      endPoint = {
        x: endFieldX,
        y: endFieldY + (endIsBorderPoint ? 0 : endFieldHeight / 2)
      }
    } else {
      //line goes from right to left

      startPoint = {
        x: startFieldX,
        y: startFieldY + (startFieldHeight / 2)
      }

      endPoint = {
        x: endFieldX + (endIsBorderPoint ? 0 : endFieldWidth),
        y: endFieldY + (endIsBorderPoint ? 0 : endFieldHeight / 2)
      }
    }
  } else {
    throw new Error(`unknown majorLineDirection: ${majorLineDirection}`)
  }


  if (majorLineDirection === MajorLineDirection.bottomToTop || majorLineDirection === MajorLineDirection.rightToLeft) {
    let temp = startPoint
    startPoint = endPoint
    endPoint = temp
  }

  const point = getNiceBezierCurveBetween(startPoint, endPoint, majorLineDirection)

  const line: LineShape = {
    kind: "line",
    id: getNextShapeId(),
    zIndex: zIndex,
    color: lineShapeDefaultColor,
    hasEndArrow: addEndArrow,
    hasStartArrow: false,
    lineThicknessInPx: 3,
    dashArray: [15],
    startPoint: {
      id: getNextShapeId(),
      x: startPoint.x,
      y: startPoint.y
    },
    points: [point],
    isSymbol: false,
    createdFromSymbolGuid: null,
    arrowWidth: defaultArrowWidth,
    arrowHeight: defaultArrowHeight
  }

  //adding the line will automatically add the line as connected to the anchor points
  //  because of coords
  globalState.dispatch(addLineShape(line))

  renewAllZIndicesInTile()

}

/**
 * returns a nice bezier curve from a starting point (nice curvy somehow)
 * could be improved
 * @param {Point} startPoint
 * @param {Point} endPoint
 * @param majorLineDirection
 * @param ensureCoordsAreIntegers ensures that the points are integers (floor)
 * @returns {BezierPoint}
 */
export function getNiceBezierCurveBetween(startPoint: PlainPoint, endPoint: PlainPoint, majorLineDirection: MajorLineDirection, ensureCoordsAreIntegers = true): BezierPoint {

  const deltaX = endPoint.x - startPoint.x
  const deltaY = endPoint.y - startPoint.y

  let cp1X = 0
  let cp1Y = 0
  let cp2X = 0
  let cp2Y = 0

  if (majorLineDirection === MajorLineDirection.topToBottom) {

    cp1X = startPoint.x
    cp1Y = startPoint.y + deltaY / 3

    cp2X = endPoint.x
    cp2Y = endPoint.y - deltaY / 3


  } else if (majorLineDirection === MajorLineDirection.bottomToTop) {

    cp1X = startPoint.x
    cp1Y = startPoint.y - deltaY / 3

    cp2X = endPoint.x
    cp2Y = endPoint.y + deltaY / 3

  } else if (majorLineDirection === MajorLineDirection.leftToRight) {

    cp1X = startPoint.x + deltaX / 3
    cp1Y = startPoint.y

    cp2X = endPoint.x - deltaX / 3
    cp2Y = endPoint.y

  } else {
    cp1X = startPoint.x - deltaX / 3
    cp1Y = startPoint.y

    cp2X = endPoint.x + deltaX / 3
    cp2Y = endPoint.y
  }


  return {
    id: getNextShapeId(), //getNextLinePointId(),
    x: Math.floor(endPoint.x),
    y: Math.floor(endPoint.y),
    cp1: {
      id: getNextShapeId(),
      x: Math.floor(cp1X),
      y: Math.floor(cp1Y)
    },
    cp2: {
      id: getNextShapeId(),
      x: Math.floor(cp2X),
      y: Math.floor(cp2Y)
    },
    curveMode: CurveMode.smooth
  }

}


/**
 * call this if a field is moved and we need to check
 * if a line point is connected to an anchor point and thus we need to move the line too
 * @param field
 * @param allLines all possible lines to search
 * @param fieldSymbol
 * @param set_selectedLinePointNewPosAction
 */
export function adjustLinesFromAnchorPoints(field: FieldShape,
                                            allLines: ReadonlyArray<LineShape>, fieldSymbol: FieldSymbol | null,
                                            set_selectedLinePointNewPosAction: (lineId: number, oldPointId: number, newPointPos: PlainPoint) => any
): void {

  const newAnchorPointPoss = calcAnchorPoints(field, [fieldSymbol], field.anchorPoints)

  //just move all line points if they have different coords

  for (let i = 0; i < newAnchorPointPoss.length; i++) {
    const anchorPointPos = newAnchorPointPoss[i]
    const anchorPoint = field.anchorPoints[i]

    for (const tuple of anchorPoint.connectedLineTuples) {

      set_selectedLinePointNewPosAction(tuple.lineId, tuple.pointId, anchorPointPos)
    }
  }

}

/**
 * checks if the line and field is connected through some anchor point
 *
 * if yes it forces the line point to be placed on the anchor point (starts a new event)
 * this is also the reason we need canSetFieldAnchorPoints in setLinePointNewPos
 * because this calls this function again --> would be infinite loop
 *
 * one point could be connected to multiple anchor points... but we only take the first connected!
 * @param {FieldShape} field
 * @param {ReadonlyArray<FieldSymbol>} fieldSymbols
 * @param {LineShape} line
 * @param {number} anchorPointSnapToleranceRadiusInPx
 * @returns {ReadonlyArray<number>}
 */
export function isFieldAndLineConnectedThroughAnchorPoints(field: FieldShape, fieldSymbols: ReadonlyArray<FieldSymbol>, line: LineShape, anchorPointSnapToleranceRadiusInPx: number = 0): ReadonlyArray<IsFieldAndLineConnectedResult> {

  let connectedPointsIds: IsFieldAndLineConnectedResult[] = []


  //use field anchor point definitions
  let fieldAnchorPoints: ReadonlyArray<AnchorPoint> = field.anchorPoints
  let symbol: FieldSymbol | null = null
  if (field.createdFromSymbolGuid !== null) {
    symbol = fieldSymbols.find(p => p.guid === field.createdFromSymbolGuid)
    fieldAnchorPoints = symbol.anchorPoints

    if (!symbol) {
      const msg = `could not find field symbol for guid ${field.createdFromSymbolGuid}`
      Logger.fatal(msg)
      throw new Error(msg)
    }
  }

  const anchorPoints = calcAnchorPointsRaw(
    field.x,
    field.y,
    field.createdFromSymbolGuid !== null && symbol.overwriteWidth ? symbol.width : field.width,
    field.createdFromSymbolGuid !== null && symbol.overwriteHeight ? symbol.height : field.height,
    fieldAnchorPoints,
    0,
    0,
    field.createdFromSymbolGuid !== null && symbol.overwriteRotationInDeg ? symbol.rotationInDegree : field.rotationInDegree,
  )

  const alreadyConnected: { [pointId: number]: boolean } = {}

  for (let i = 0; i < anchorPoints.length; i++) {
    const anchorPoint = anchorPoints[i]

    const distance = getPointDistance(line.startPoint, anchorPoint)

    if (distance <= anchorPointSnapToleranceRadiusInPx) {

      //point is already connected to an anchor point?
      if (alreadyConnected[line.startPoint.id]) continue

      connectedPointsIds.push({
        anchorPointIndex: i,
        lineId: line.id,
        pointId: line.startPoint.id
      })

      alreadyConnected[line.startPoint.id] = true
    }

    for (const intermediatePointsInLine of line.points) {
      const distance = getPointDistance(intermediatePointsInLine, anchorPoint)

      if (distance <= anchorPointSnapToleranceRadiusInPx) {

        //point is already connected to an anchor point?
        if (alreadyConnected[intermediatePointsInLine.id]) continue

        connectedPointsIds.push({
          anchorPointIndex: i,
          lineId: line.id,
          pointId: intermediatePointsInLine.id
        })

        alreadyConnected[intermediatePointsInLine.id] = true

      }
    }
  }

  return connectedPointsIds
}


/**
 * same as
 * @see isFieldAndLineConnectedThroughAnchorPoints
 * but with a single line point
 *
 * one point could be connected to multiple anchor points... but we only take the first connected!
 * @param field
 * @param fieldSymbols
 * @param lineId
 * @param linePoint
 * @param anchorPointSnapToleranceRadiusInPx
 */
export function isFieldAndLinePointConnectedThroughAnchorPoints(field: FieldShape, fieldSymbols: ReadonlyArray<FieldSymbol>, lineId: number, linePoint: Point, anchorPointSnapToleranceRadiusInPx: number = 0): IsFieldAndLineConnectedResult | null {

  //use field anchor point definitions
  let fieldAnchorPoints: ReadonlyArray<AnchorPoint> = field.anchorPoints
  let symbol: FieldSymbol | null = null
  if (field.createdFromSymbolGuid !== null) {
    symbol = fieldSymbols.find(p => p.guid === field.createdFromSymbolGuid)
    fieldAnchorPoints = symbol.anchorPoints

    if (!symbol) {
      const msg = `could not find field symbol for guid ${field.createdFromSymbolGuid}`
      Logger.fatal(msg)
      throw new Error(msg)
    }
  }


  const anchorPoints = calcAnchorPointsRaw(
    field.x,
    field.y,
    field.createdFromSymbolGuid !== null && symbol.overwriteWidth ? symbol.width : field.width,
    field.createdFromSymbolGuid !== null && symbol.overwriteHeight ? symbol.height : field.height,
    fieldAnchorPoints,
    0,
    0,
    field.createdFromSymbolGuid !== null && symbol.overwriteRotationInDeg ? symbol.rotationInDegree : field.rotationInDegree,
  )

  for (let i = 0; i < anchorPoints.length; i++) {
    const anchorPoint = anchorPoints[i]

    const distance = getPointDistance(linePoint, anchorPoint)

    if (distance <= anchorPointSnapToleranceRadiusInPx) {

      const conn = {
        anchorPointIndex: i,
        lineId,
        pointId: linePoint.id
      }

      return conn
      // connectedPointsIds.push(conn)
    }
  }


  return null
}


/**
 *
 * @param tile
 * @param lineId
 * @param oldPoint
 * @param newPoint
 * @param setBorderPointFunc
 * @param __setLinePointNewPos
 * @param anchorPointSnapToleranceRadiusInPx
 * @param shouldCheckIfCanDisconnect if distance to border point is <= anchorPointSnapToleranceRadiusInPx,
 *   true: when we have a new point (user moved line away) this can disconnect the line if the old point was connected (same coords as border point)
 *   false: not check if the user moved line away, e.g. when we know we want to connect/snap the line to the border point (if distance to border point is <= anchorPointSnapToleranceRadiusInPx)
 */
export function checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap(tile: TileProps, lineId: number, oldPoint: Point, newPoint: PlainPoint,
                                                                        setBorderPointFunc: (borderPoint: BorderPoint, direction: "top" | "bottom" | "left" | "right", tileWidth: number, tileHeight: number) => void,
                                                                        __setLinePointNewPos: (lineId: number, oldPointId: number, newPointPos: PlainPoint) => void,
                                                                        anchorPointSnapToleranceRadiusInPx: number,
                                                                        shouldCheckIfCanDisconnect: boolean): void {


  let func = (borderPoint: BorderPoint, borderPointPos: PlainPoint, distance: number, direction: "top" | "bottom" | "left" | "right") => {

    if (distance <= anchorPointSnapToleranceRadiusInPx) {

      if (shouldCheckIfCanDisconnect && oldPoint.x === borderPointPos.x && oldPoint.y === borderPointPos.y &&
        (newPoint.x !== borderPointPos.x || newPoint.y !== borderPointPos.y)) {

        //old pos was on anchor point
        //new not... user wants to remove connection

        setBorderPointFunc({
          ...borderPoint,
          connectedLineTuples: borderPoint.connectedLineTuples
            .filter(k => k.pointId !== oldPoint.id) //clear old
        }, direction, tile.tileSettings.width, tile.tileSettings.height)

      } else {

        //add or renew connection

        setBorderPointFunc({
          ...borderPoint,
          connectedLineTuples: borderPoint.connectedLineTuples
            .filter(k => k.pointId !== oldPoint.id)
            .concat({
              lineId,
              pointId: oldPoint.id
            })
        }, direction, tile.tileSettings.width, tile.tileSettings.height)

        __setLinePointNewPos(lineId, oldPoint.id, borderPointPos)

      }
    } else {

      //disconnect if connected

      if (!(borderPoint.connectedLineTuples.some(p => p.pointId === oldPoint.id))) return

      //remove
      setBorderPointFunc({
        ...borderPoint,
        connectedLineTuples: borderPoint.connectedLineTuples
          .filter(k => k.pointId !== oldPoint.id)  //clear old
      }, direction, tile.tileSettings.width, tile.tileSettings.height)


    }

  }

  //--- top border points

  for (let i = 0; i < tile.topBorderPoints.length; i++) {
    const borderPoint = tile.topBorderPoints[i];
    const point: PlainPoint = {x: borderPoint.val, y: 0}

    const distance = getPointDistance(newPoint, point)

    func(borderPoint, point, distance, "top")
  }

  for (let i = 0; i < tile.botBorderPoints.length; i++) {
    const borderPoint = tile.botBorderPoints[i];
    const point: PlainPoint = {x: borderPoint.val, y: tile.tileSettings.height}

    const distance = getPointDistance(newPoint, point)

    func(borderPoint, point, distance, "bottom")
  }

  for (let i = 0; i < tile.leftBorderPoints.length; i++) {
    const borderPoint = tile.leftBorderPoints[i];
    const point: PlainPoint = {x: 0, y: borderPoint.val}

    const distance = getPointDistance(newPoint, point)

    func(borderPoint, point, distance, "left")
  }

  for (let i = 0; i < tile.rightBorderPoint.length; i++) {
    const borderPoint = tile.rightBorderPoint[i];
    const point: PlainPoint = {x: tile.tileSettings.width, y: borderPoint.val}

    const distance = getPointDistance(newPoint, point)

    func(borderPoint, point, distance, "right")
  }

}

export function getPointDistance(p1: PlainPoint, p2: PlainPoint): number {

  //a^2 + b^2 = c^2
  //c = sqrt(a^2 + b^2)
  const a = p2.x - p1.x
  const b = p2.y - p1.y

  return Math.sqrt(a ** 2 + b ** 2)
}


/**
 * returns a point between p1 and p2
 * the distance between the two points is 100%
 * t is the point we want (0 is p1, 1 is p2) all between 0,1 are interpolated
 *
 * assumes p1 is bottom left, p2 is top right??
 * @param {PlainPoint} p1
 * @param {PlainPoint} p2
 * @param {number} t between [0,1]
 * @returns {PlainPoint}
 */
export function interpolate2DPoint(p1: PlainPoint, p2: PlainPoint, t: number): PlainPoint {

  if (t < 0 || t > 1) {
    Logger.fatal(`interpolate2DPoint, t  must be [0,1] but was: ${t}`)
  }


  //y = mx + n   where t = x between [0, 1]
  const deltaX = p2.x - p1.x
  const deltaY = p2.y - p1.y


  if (p1.x === p2.x) {

    const distY = Math.abs(deltaY)

    if (p1.y >= p2.y) {
      return {
        x: p1.x,
        y: p1.y - t * distY
      }
    }

    return {
      x: p1.x,
      y: p1.y + t * distY
    }
  }

  const distX = Math.abs(deltaX)

  // distX      x?
  // ---     = ---
  // 100%      t
  //t is already  / 100 because [0,1]
  const wantedX = t * distX

  const n = p1.y
  const m = deltaY / deltaX

  const resY = wantedX * m + n

  return {
    x: p1.x + wantedX,
    y: resY
  }
}
