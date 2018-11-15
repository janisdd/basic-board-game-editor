import {
  AnchorPoint,
  BezierPoint, BorderPoint, BorderPointWithPos, ConnectedLinesThroughAnchorPointsMap, CurveMode,
  FieldBase,
  FieldShape,
  FieldSymbol, IdAble,
  LineShape,
  PlainPoint,
  Point, Rect
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
 * 0/360 is east
 * add +90 in order to set 0 to north
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


export function calcAnchorPoints(fieldX: number, fieldY: number, fieldWidth: number, fieldHeight: number, anchorPoints: ReadonlyArray<AnchorPoint>, xOffset: number, yOffset: number, rotationInDegree: number): ReadonlyArray<PlainPoint> {
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
  lineShapes: ReadonlyArray<LineShape>
): void {

  //one field is possible if we connect a border point to a field
  if (fields.length === 0) return

  const allBorderPoints: ReadonlyArray<BorderPointWithPos> =
    topBorderPoints.map(p => {
      return {
        id: p.id,
        nextFieldId: p.nextFieldId,
        x: p.val,
        y: 0,
        val: p.val
      }
    })
      .concat(
        botBorderPoints.map(p => {
          return {
            id: p.id,
            nextFieldId: p.nextFieldId,
            x: p.val,
            y: tileHeight,
            val: p.val
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
            val: p.val
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
            val: p.val
          }
        })
      )


  let lastZIndex = newZIndex
  for (const field of fields) {
    lastZIndex = connectFieldsFromRootFieldByCmdText(field, fields, fieldSymbols, lastZIndex, majorLineDirection,
      allBorderPoints, borderPointsDiameterInPx, lineShapes)
  }

  //connect border points to the fields

  for (const borderPoint of allBorderPoints) {

    if (borderPoint.nextFieldId === null) continue

    const nextField = fields.find(p => p.id === borderPoint.nextFieldId)

    if (!nextField) {
      throw new Error(`cannot find target field ${borderPoint.nextFieldId} of border point with id ${borderPoint.id}`)
    }

    let nextFieldSymbol: FieldSymbol | null = null

    if (nextField.createdFromSymbolGuid !== null) {
      const symbol = fieldSymbols.find(p => p.guid === nextField.createdFromSymbolGuid)

      if (symbol) {
        nextFieldSymbol = symbol
      }
    }

    if (!nextField) {
      throw new Error(`next field not found! from border point: ${borderPoint.id}`)
    }

    let connectedLinesThroughAnchorPoints = getConnectedLinesThroughAnchorPointsForBorderPoint(borderPoint, lineShapes)

    const borderPointConnectedLinesIds = Object.keys(connectedLinesThroughAnchorPoints)

    //if the fields are already connected do nothing
    const nextFieldConnectedLinesIds = Object.keys(nextField.connectedLinesThroughAnchorPoints)

    let alreadyConnected = false

    for (const lineIdString of borderPointConnectedLinesIds) {
      if (nextFieldConnectedLinesIds.some(idString => idString === lineIdString)) {

        //already connected
        alreadyConnected = true
        break
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
      (nextFieldSymbol !== null ? nextFieldSymbol.width : nextField.width),
      (nextFieldSymbol !== null ? nextFieldSymbol.height : nextField.height),
      false,
      lastZIndex,
      majorLineDirection,
      true
    )
    lastZIndex++
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
  lineShapes: ReadonlyArray<LineShape>
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

  const rootFieldConnectedLines = Object.keys(rootField.connectedLinesThroughAnchorPoints)
  let nextFieldIsBorderPoint = false

  for (const statement of game.statements) {

    if (statement.type === 'control_goto') {

      lastZIndex = connectFields(rootField,
        rootFieldSymbol,
        statement.targetId,
        fields,
        fieldSymbols,
        nextFieldIsBorderPoint,
        rootFieldConnectedLines,
        majorLineDirection,
        allBorderPoints,
        borderPointsDiameterInPx,
        false,
        lastZIndex,
        lineShapes
      )

    }
    else if (statement.type === 'control_ifElse') {

      lastZIndex = connectFields(rootField,
        rootFieldSymbol,
        statement.trueTargetId,
        fields,
        fieldSymbols,
        nextFieldIsBorderPoint,
        rootFieldConnectedLines,
        majorLineDirection,
        allBorderPoints,
        borderPointsDiameterInPx,
        true,
        lastZIndex,
        lineShapes
      )

      lastZIndex = connectFields(rootField,
        rootFieldSymbol,
        statement.falseTargetId,
        fields,
        fieldSymbols,
        nextFieldIsBorderPoint,
        rootFieldConnectedLines,
        majorLineDirection,
        allBorderPoints,
        borderPointsDiameterInPx,
        true,
        lastZIndex,
        lineShapes
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
 * @param {string[]} rootFieldConnectedLines
 * @param {MajorLineDirection} majorLineDirection
 * @param allBorderPoints
 * @param borderPointsDiameterInPx
 * @param showLineEndArrow true: show line end arrow, false: not, if the next field is a border point the end arrow is drawn ignoring this value
 * @param {number} zIndex
 * @param lineShapes the lines to check if a border point is connected to a line (not add a line twice)
 * @returns {number} returns the next z index
 */
function connectFields(rootField: FieldShape,
                       rootFieldSymbol: FieldSymbol | null,
                       nextFieldId: number,
                       fieldShapes: ReadonlyArray<FieldShape>,
                       fieldSymbols: ReadonlyArray<FieldSymbol>,
                       nextFieldIsBorderPoint: boolean,
                       rootFieldConnectedLines: string[],
                       majorLineDirection: MajorLineDirection,
                       allBorderPoints: ReadonlyArray<BorderPointWithPos>,
                       borderPointsDiameterInPx: number,
                       showLineEndArrow: boolean,
                       zIndex: number,
                       lineShapes: ReadonlyArray<LineShape>
): number {

  let nextFieldSymbol: FieldSymbol | null = null
  let fieldsAreAlreadyConnected = false

  let nextField = fieldShapes.find(p => p.id === nextFieldId)

  if (!nextField) {

    //could be a border point

    const targetBorderPoint = allBorderPoints.find(p => p.id === nextFieldId)

    if (!targetBorderPoint) {
      Logger.fatal(`next field/border point not found id: ${nextFieldId}! from field: ${rootField.id}`)
      return
    }

    //the connected lines could be calculated inside autoConnectFieldsWithLinesByCmdText for all lines...
    //TODO??
    let connectedLinesThroughAnchorPoints = getConnectedLinesThroughAnchorPointsForBorderPoint(targetBorderPoint,
      lineShapes)

    //too lazy to restructure method...
    nextField = {
      ...rootField,
      connectedLinesThroughAnchorPoints,
      id: targetBorderPoint.id,
      x: targetBorderPoint.x,
      y: targetBorderPoint.y,
      width: borderPointsDiameterInPx,
      height: borderPointsDiameterInPx,
      createdFromSymbolGuid: null
    }
    nextFieldIsBorderPoint = true
  }


  if (nextField.createdFromSymbolGuid !== null) {
    const symbol = fieldSymbols.find(p => p.guid === nextField.createdFromSymbolGuid)

    if (symbol) {
      nextFieldSymbol = symbol
    }
  }

  //if the fields are already connected do nothing
  const nextFieldConnectedLinesIds = Object.keys(nextField.connectedLinesThroughAnchorPoints)

  for (const lineIdString of rootFieldConnectedLines) {
    if (nextFieldConnectedLinesIds.some(idString => idString === lineIdString)) {
      fieldsAreAlreadyConnected = true
      break
    }
  }

  if (fieldsAreAlreadyConnected) {
    return zIndex
  }

  connectPointsWithLine(
    rootField.x,
    rootField.y,
    (rootFieldSymbol !== null ? rootFieldSymbol.width : rootField.width),
    (rootFieldSymbol !== null ? rootFieldSymbol.height : rootField.height),
    false,
    nextField.x,
    nextField.y,
    (nextFieldSymbol !== null ? nextFieldSymbol.width : nextField.width),
    (nextFieldSymbol !== null ? nextFieldSymbol.height : nextField.height),
    nextFieldIsBorderPoint,
    zIndex,
    majorLineDirection,
    nextFieldIsBorderPoint || showLineEndArrow
  )

  zIndex++
  return zIndex
}


function getConnectedLinesThroughAnchorPointsForBorderPoint(targetBorderPoint: PlainPoint, lineShapes: ReadonlyArray<LineShape>): ConnectedLinesThroughAnchorPointsMap {

  let connectedLinesThroughAnchorPoints: ConnectedLinesThroughAnchorPointsMap = {}

  for (const lineShape of lineShapes) {

    let points: ReadonlyArray<Point> = (lineShape.points as ReadonlyArray<Point>).concat(lineShape.startPoint)

    for (const point of points) {
      if (point.x === targetBorderPoint.x && point.y === targetBorderPoint.y) {
        if (connectedLinesThroughAnchorPoints[lineShape.id] === undefined) {
          connectedLinesThroughAnchorPoints[lineShape.id] = [point.id]
        } else {
          connectedLinesThroughAnchorPoints[lineShape.id] = connectedLinesThroughAnchorPoints[lineShape.id].concat(
            point.id)
        }
      }
    }
  }

  return connectedLinesThroughAnchorPoints

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
  }
  else if (majorLineDirection === MajorLineDirection.leftToRight || majorLineDirection === MajorLineDirection.rightToLeft) {

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
    }
    else {
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
  }


  if (majorLineDirection === MajorLineDirection.bottomToTop || majorLineDirection === MajorLineDirection.rightToLeft) {
    let temp = startPoint
    startPoint = endPoint
    endPoint = temp
  }

  const point = getNiceBezierCurveBetween(startPoint, endPoint, majorLineDirection)

  const line: LineShape = {
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

  globalState.dispatch(addLineShape(line))

  renewAllZIndicesInTile()

}

/**
 * returns a nice bezier curve from a starting point (nice curvy somehow)
 * could be improved
 * @param {Point} startPoint
 * @param {Point} endPoint
 * @param majorLineDirection
 * @returns {BezierPoint}
 */
export function getNiceBezierCurveBetween(startPoint: PlainPoint, endPoint: PlainPoint, majorLineDirection: MajorLineDirection): BezierPoint {

  const deltaX = endPoint.x - startPoint.x
  const deltaY = endPoint.y - startPoint.y

  let cp1X = 0
  let cp1Y = 0
  let cp2X = 0
  let cp2Y = 0

  if (majorLineDirection === MajorLineDirection.topToBottom || majorLineDirection === MajorLineDirection.bottomToTop) {
    cp1X = startPoint.x
    cp1Y = startPoint.y + deltaY / 3

    cp2X = endPoint.x
    cp2Y = endPoint.y - deltaY / 3
  }
  else {
    cp1X = startPoint.x + deltaX / 3
    cp1Y = startPoint.y

    cp2X = endPoint.x - deltaX / 3
    cp2Y = endPoint.y
  }


  return {
    id: getNextShapeId(), //getNextLinePointId(),
    x: endPoint.x,
    y: endPoint.y,
    cp1: {
      id: getNextShapeId(),
      x: cp1X,
      y: cp1Y
    },
    cp2: {
      id: getNextShapeId(),
      x: cp2X,
      y: cp2Y
    },
    curveMode: CurveMode.smooth
  }

}


/**
 * call this if a field is moved and we need to check
 * if a line point is connected to an anchor point and thus we need to move the line too
 * @param fieldBefore
 * @param fieldAfter
 * @param fieldSymbolBefore the symbol for the before field or null
 * @param fieldSymbolAfter the symbol for the after field (can be the updated symbol)
 */
export function adjustLinesFromAnchorPoints(fieldBefore: FieldShape, fieldAfter: FieldShape, fieldSymbolBefore: FieldSymbol | null, fieldSymbolAfter: FieldSymbol | null): void {

  //TODO MAYBE maybe we can make this faster??

  const allLines = globalState.getState().tileEditorLineShapeState.present

  for (const key in fieldBefore.connectedLinesThroughAnchorPoints) {
    const lineId = parseInt(key)
    if (isNaN(lineId)) {
      console.error('line id cannot be nan')
      continue
    }

    const connectedLinePointIds = fieldBefore.connectedLinesThroughAnchorPoints[key]

    const line = allLines.find(p => p.id === lineId)
    if (!line) continue

    let someBefore = fieldBefore.createdFromSymbolGuid === null ? fieldBefore : fieldSymbolBefore
    let someAfter = fieldAfter.createdFromSymbolGuid === null ? fieldAfter : fieldSymbolAfter

    const anchorPoints = calcAnchorPoints(
      fieldBefore.x,
      fieldBefore.y,
      someBefore.width,
      someBefore.height,
      someBefore.anchorPoints,
      0,
      0,
      someBefore.rotationInDegree
    )
    const newAnchorPoints = calcAnchorPoints(
      fieldAfter.x,
      fieldAfter.y,
      someAfter.width,
      someAfter.height,
      someAfter.anchorPoints,
      0,
      0,
      someAfter.rotationInDegree
    )

    for (let i = 0; i < anchorPoints.length; i++) {
      const anchorPoint = anchorPoints[i]
      const newAnchorPoint = newAnchorPoints[i]

      //the start line is connected to the field && is on an anchor point
      if (connectedLinePointIds.indexOf(line.startPoint.id) !== -1 &&
        line.startPoint.x === anchorPoint.x && line.startPoint.y === anchorPoint.y) {
        //move the line point to the new anchor point pos
        globalState.dispatch(set_selectedLinePointNewPosAction(line.id, line.startPoint.id, newAnchorPoint, false))
      }

      for (const intermediatePointsInLine of line.points) {
        //the intermediate point is connected to the field
        if (connectedLinePointIds.indexOf(intermediatePointsInLine.id) !== -1 &&
          intermediatePointsInLine.x === anchorPoint.x && intermediatePointsInLine.y === anchorPoint.y) {
          //move the line point to the new anchor point pos
          globalState.dispatch(
            set_selectedLinePointNewPosAction(line.id, intermediatePointsInLine.id, newAnchorPoint, false))
        }
      }
    }

  }

}

/**
 * checks if the line and field is connected through some anchor point
 *
 * if yes it forces the line point to be placed on the anchor point (starts a new event)
 * this is also the reason we need canSetFieldAnchorPoints in setLinePointNewPos
 * because this calls this function again --> would be infinite loop
 * @param {FieldShape} field
 * @param {ReadonlyArray<FieldSymbol>} fieldSymbols
 * @param {LineShape} line
 * @param {number} anchorPointSnapToleranceRadiusInPx
 * @returns {ReadonlyArray<number>}
 */
export function isFieldAndLineConnectedThroughAnchorPoints(field: FieldShape, fieldSymbols: ReadonlyArray<FieldSymbol>, line: LineShape, anchorPointSnapToleranceRadiusInPx: number = 0): ReadonlyArray<number> {

  let connectedPointsIds: number[] = []


  //use field anchor point definitions
  let fieldAnchorPoints: ReadonlyArray<AnchorPoint> = field.anchorPoints
  let symbol: FieldSymbol | null = null
  if (field.createdFromSymbolGuid !== null) {
    symbol = fieldSymbols.find(p => p.guid === field.createdFromSymbolGuid)
    fieldAnchorPoints = symbol.anchorPoints
  }

  const anchorPoints = calcAnchorPoints(
    field.x,
    field.y,
    field.createdFromSymbolGuid !== null ? symbol.width : field.width,
    field.createdFromSymbolGuid !== null ? symbol.height : field.height,
    fieldAnchorPoints,
    0,
    0,
    field.createdFromSymbolGuid !== null ? symbol.rotationInDegree : field.rotationInDegree,
  )

  for (const anchorPoint of anchorPoints) {
    const distance = getPointDistance(line.startPoint, anchorPoint)
    if (line.startPoint.x === anchorPoint.x && line.startPoint.y === anchorPoint.y) {
      connectedPointsIds.push(line.startPoint.id)
    }
    else if (distance <= anchorPointSnapToleranceRadiusInPx) {

      connectedPointsIds.push(line.startPoint.id)
      globalState.dispatch(set_selectedLinePointNewPosAction(line.id, line.startPoint.id, anchorPoint, false))
    }

    for (const intermediatePointsInLine of line.points) {
      const distance = getPointDistance(intermediatePointsInLine, anchorPoint)

      if (intermediatePointsInLine.x === anchorPoint.x && intermediatePointsInLine.y === anchorPoint.y) {
        connectedPointsIds.push(intermediatePointsInLine.id)
      }
      else if (distance <= anchorPointSnapToleranceRadiusInPx) {
        connectedPointsIds.push(intermediatePointsInLine.id)
        globalState.dispatch(
          set_selectedLinePointNewPosAction(line.id, intermediatePointsInLine.id, anchorPoint, false))
      }
    }
  }

  return connectedPointsIds
}


export function checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap(tile: TileProps, line: LineShape, anchorPointSnapToleranceRadiusInPx: number = 0): void {


  //--- top border points

  const allBorderPoints = tile.topBorderPoints.map<PlainPoint>(p => {
    return {x: p.val, y: 0}
  })
    .concat(tile.botBorderPoints.map<PlainPoint>(p => {
      return {x: p.val, y: tile.tileSettings.height}
    }))
    .concat(tile.leftBorderPoints.map<PlainPoint>(p => {
      return {x: 0, y: p.val}
    }))
    .concat(tile.rightBorderPoint.map<PlainPoint>(p => {
      return {x: tile.tileSettings.width, y: p.val}
    }))

  for (const anchorPoint of allBorderPoints) {
    const distance = getPointDistance(line.startPoint, anchorPoint)
    if (distance <= anchorPointSnapToleranceRadiusInPx) {
      globalState.dispatch(set_selectedLinePointNewPosAction(line.id, line.startPoint.id, anchorPoint, false))
    }

    for (const intermediatePointsInLine of line.points) {
      const distance = getPointDistance(intermediatePointsInLine, anchorPoint)

      if (distance <= anchorPointSnapToleranceRadiusInPx) {
        globalState.dispatch(
          set_selectedLinePointNewPosAction(line.id, intermediatePointsInLine.id, anchorPoint, false))
      }
    }
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


  console.log('asdasdasd')

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
