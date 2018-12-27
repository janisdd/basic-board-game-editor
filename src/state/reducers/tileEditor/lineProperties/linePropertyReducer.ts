import {Action} from "redux";
import {BezierPoint, CurveMode, FieldShape, LineBase, LineShape, PlainPoint, Point} from "../../../../types/drawing";
import {notExhaustive} from "../../_notExhausiveHelper";
import {replaceProperty} from "../../../../helpers/functionHelpers";
import globalState from '../../../state'
import {getAngleInDeg, getPointDistance, rotatePointBy} from "../../../../helpers/interactionHelper";
import {clearTileEditorEditShapesType, undoShapeLimit} from "../../../../constants";
import undoable from "redux-undo";


// let lastLinePointId = 0
//
// export function getNextLinePointId(): number {
//   return lastLinePointId++
// }


export type State = ReadonlyArray<LineShape>


export const initial: State = []

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {

  SET_lineArray = 'fieldPropertyReducer_SET_lineArray',

  ADD_LineShape = 'tileEditorReducer_ADD_LineShape',
  ADD_PointToLineShape = 'tileEditorReducer_ADD_PointToLineShape',

  REMOVE_LineShape = 'tileEditorReducer_REMOVE_LineShape',
  REMOVE_PointFromLineShape = 'tileEditorReducer_REMOVE_PointFromLineShape',

  SET_selectedLinePointNewPos = 'tileEditorReducer_SET_selectedLinePointNewPos',

  SET_linePointCurveMode = 'tileEditorReducer_SET_linePointCurveMode',

  SET_lineColor = 'tileEditorReducer_SET_lineColor',
  SET_lineThicknessInPx = 'tileEditorReducer_SET_lineThicknessInPx',
  SET_lineDashArray = 'tileEditorReducer_SET_lineDashArray',

  SET_lineHasStartArrow = 'tileEditorReducer_SET_lineHasStartArrow',
  SET_lineHasEndArrow = 'tileEditorReducer_SET_lineHasEndArrow',
  SET_lineZIndex = 'tileEditorReducer_SET_lineZIndex',

  SET_lineCreatedFromSymbolId = 'tileEditorReducer_SET_lineCreatedFromSymbolId',

  SET_lineArrowHeight = 'tileEditorReducer_SET_lineArrowHeight',
  SET_lineArrowWidth = 'tileEditorReducer_SET_lineArrowWidth',

  RESET = 'linePropertyReducer_RESET',
}


export interface SET_lineArrayAction extends ActionBase {
  readonly type: ActionType.SET_lineArray
  readonly lines: ReadonlyArray<LineShape>
}

export interface ADD_LineShapeAction extends ActionBase {
  readonly type: ActionType.ADD_LineShape
  readonly lineShape: LineShape
}

export interface REMOVE_LineShapeAction extends ActionBase {
  readonly type: ActionType.REMOVE_LineShape
  readonly lineShapeId: number
}

export interface ADD_PointToLineShapeAction extends ActionBase {
  readonly type: ActionType.ADD_PointToLineShape
  readonly lineId: number
  readonly bezierPoint: BezierPoint
}

export interface REMOVE_PointFromLineShapeAction extends ActionBase {
  readonly type: ActionType.REMOVE_PointFromLineShape
  readonly lineId: number
  readonly pointId: number
}


//move a point, could be a bezier control point
export interface SET_selectedLinePointNewPosAction extends ActionBase {
  readonly type: ActionType.SET_selectedLinePointNewPos
  readonly lineId: number
  readonly oldPointId: number
  /**
   * the new pos for the old point
   */
  readonly newPointPos: PlainPoint
}

export interface SET_linePointCurveModeAction extends ActionBase {
  readonly type: ActionType.SET_linePointCurveMode
  readonly lineId: number
  readonly linePointId: number

  readonly curveMode: CurveMode
}

//---line props

export interface SET_lineColorAction extends ActionBase {
  readonly type: ActionType.SET_lineColor
  readonly lineId: number
  readonly color: string
}

export interface SET_lineThicknessInPxAction extends ActionBase {
  readonly type: ActionType.SET_lineThicknessInPx
  readonly lineId: number
  readonly thicknessInPx: number
}

export interface SET_lineDashArrayAction extends ActionBase {
  readonly type: ActionType.SET_lineDashArray
  readonly lineId: number
  readonly dashArray: ReadonlyArray<number>
}

export interface SET_hasStartArrowAction extends ActionBase {
  readonly type: ActionType.SET_lineHasStartArrow
  readonly lineId: number
  readonly hasStartArrow: boolean
}


export interface SET_hasEndArrowAction extends ActionBase {
  readonly type: ActionType.SET_lineHasEndArrow
  readonly lineId: number
  readonly hasEndArrow: boolean
}

export interface SET_lineArrowHeightAction extends ActionBase {
  readonly type: ActionType.SET_lineArrowHeight
  readonly lineId: number
  readonly arrowHeight: number
}

export interface SET_lineArrowWidthAction extends ActionBase {
  readonly type: ActionType.SET_lineArrowWidth
  readonly lineId: number
  readonly arrowWidth: number
}


export interface SET_lineZIndexAction extends ActionBase {
  readonly type: ActionType.SET_lineZIndex
  readonly lineId: number
  readonly zIndex: number
}

export interface SET_lineCreatedFromSymbolIdAction extends ActionBase {
  readonly type: ActionType.SET_lineCreatedFromSymbolId
  readonly lineId: number
  readonly createdFromSymbolGuid: string | null
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction

  | SET_lineArrayAction

  | ADD_LineShapeAction
  | ADD_PointToLineShapeAction

  | REMOVE_LineShapeAction
  | REMOVE_PointFromLineShapeAction

  | SET_selectedLinePointNewPosAction
  | SET_linePointCurveModeAction

  | SET_lineColorAction
  | SET_lineThicknessInPxAction
  | SET_lineDashArrayAction
  | SET_hasStartArrowAction
  | SET_hasEndArrowAction
  | SET_lineZIndexAction
  | SET_lineCreatedFromSymbolIdAction

  | SET_lineArrowHeightAction
  | SET_lineArrowWidthAction

function _reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_lineArray:
      return [...action.lines]

    case ActionType.ADD_LineShape:
      return state.concat({...action.lineShape})

    case ActionType.REMOVE_LineShape:
      return state.filter(p => p.id !== action.lineShapeId)

    case ActionType.REMOVE_PointFromLineShape:
      return state.map(p =>
        p.id !== action.lineId
          ? p
          : {
            ...p,
            points: p.points.filter(k => k.id !== action.pointId)
          })


    case ActionType.SET_selectedLinePointNewPos: {

      const targetLine = state.find(p => p.id === action.lineId)
      if (!targetLine) return state

      const newLine = replacePointInLineCanBeBezierPoint(targetLine, action.oldPointId, action.newPointPos,
        globalState.getState().tileEditorState.tileProps.tileSettings.moveBezierControlPointsWhenLineIsMoved)

      return state.map(p =>
        p.id !== action.lineId
          ? p
          : newLine
      )
    }

    case ActionType.SET_linePointCurveMode: {

      const targetLine = state.find(p => p.id === action.lineId)

      const newLine = changeBezierPointCurveMode(targetLine, action.linePointId, action.curveMode)

      return state.map(p =>
        p.id !== action.lineId
          ? p
          : newLine
      )
    }


    case ActionType.SET_lineColor: {
      const res = replaceProperty(state, action.lineId, p => {
        return {...p, color: action.color}
      })
      return res

    }
    case ActionType.SET_lineThicknessInPx: {
      const res = replaceProperty(state, action.lineId, p => {
        return {...p, lineThicknessInPx: action.thicknessInPx}
      })
      return res

    }

    case ActionType.SET_lineDashArray: {
      const res = replaceProperty(state, action.lineId, p => {
        return {...p, dashArray: action.dashArray}
      })
      return res
    }

    case ActionType.ADD_PointToLineShape: {
      const res = replaceProperty(state, action.lineId, p => {
        return {...p, points: p.points.concat(action.bezierPoint)}
      })
      return res
    }

    case ActionType.SET_lineHasStartArrow: {
      const res = replaceProperty(state, action.lineId, p => {
        return {...p, hasStartArrow: action.hasStartArrow}
      })
      return res
    }

    case ActionType.SET_lineHasEndArrow: {
      const res = replaceProperty(state, action.lineId, p => {
        return {...p, hasEndArrow: action.hasEndArrow}
      })
      return res
    }
    case ActionType.SET_lineZIndex: {
      const res = replaceProperty(state, action.lineId, p => {
        return {...p, zIndex: action.zIndex}
      })
      return res
    }

    case ActionType.SET_lineCreatedFromSymbolId: {
      const res = replaceProperty(state, action.lineId, p => {
        return {...p, createdFromSymbolGuid: action.createdFromSymbolGuid}
      })
      return res
    }

    case ActionType.SET_lineArrowHeight: {
      const res = replaceProperty(state, action.lineId, p => {
        return {...p, arrowHeight: action.arrowHeight}
      })
      return res
    }
    case ActionType.SET_lineArrowWidth: {
      const res = replaceProperty(state, action.lineId, p => {
        return {...p, arrowWidth: action.arrowWidth}
      })
      return res
    }


    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}


function replacePointInLineCanBeBezierPoint(line: LineShape, oldPointId: number, newPointPos: PlainPoint, moveControlPointWhenPointIsMoved: boolean): LineShape {

  if (line.startPoint.id === oldPointId) {

    if (moveControlPointWhenPointIsMoved) {
      const deltaX = newPointPos.x - line.startPoint.x
      const deltaY = newPointPos.y - line.startPoint.y

      return {
        ...line,
        startPoint: {
          ...line.startPoint,
          x: newPointPos.x,
          y: newPointPos.y
        },
        points: line.points.map((p, index) =>
          index !== 0
            ? p
            : {
              ...p,
              cp1: {
                ...p.cp1,
                x: p.cp1.x + deltaX,
                y: p.cp1.y + deltaY
              }
            })
      }
    }

    return {
      ...line,
      startPoint: {
        ...line.startPoint,
        x: newPointPos.x,
        y: newPointPos.y
      }
    }
  }

  //check others

  for (let i = 0; i < line.points.length; i++) {
    const point = line.points[i]

    //when we moved a bezier point (not a control point) we don't need to take curve mode into account
    if (point.id === oldPointId) {

      if (moveControlPointWhenPointIsMoved) {

        const deltaX = newPointPos.x - point.x
        const deltaY = newPointPos.y - point.y

        if (i === line.points.length - 1) {
          //this is the last bezier point which has no following point

          return {
            ...line,
            points: line.points.map((p, index) =>
              index !== i
                ? p
                : {
                  ...p,
                  x: newPointPos.x,
                  y: newPointPos.y,
                  cp2: {
                    ...p.cp2,
                    x: p.cp2.x + deltaX,
                    y: p.cp2.y + deltaY
                  }
                })
          }

        } else {

          //an intermediate point
          //we need to move 2 anchor points here...

          return {
            ...line,
            points: line.points.map((p, index) => {

                if (index === i) {
                  return {
                    ...p,
                    x: newPointPos.x,
                    y: newPointPos.y,
                    cp2: {
                      ...p.cp2,
                      x: p.cp2.x + deltaX,
                      y: p.cp2.y + deltaY
                    }
                  }
                }

                if (index === i + 1) {
                  return {
                    ...p,
                    cp1: {
                      ...p.cp1,
                      x: p.cp1.x + deltaX,
                      y: p.cp1.y + deltaY
                    }
                  }
                }
                return p
              }
            )
          }
        }


      }

      return {
        ...line,
        points: line.points.map((p, index) =>
          index !== i
            ? p
            : {
              ...p,
              x: newPointPos.x,
              y: newPointPos.y,
            })
      }
    }

    //check control point 1
    if (point.cp1.id === oldPointId) {

      //linear don't mind control
      //the first bezier point cp1 is for the line start point so this cannot be changed by the curve mode

      //because curve mode the cp1 is part of the previous point... we need to check the previous point curve mode
      if (i === 0 || line.points[i - 1].curveMode === CurveMode.free || line.points[i - 1].curveMode === CurveMode.linear) {
        return {
          ...line,
          points: line.points.map((p, index) =>
            index !== i
              ? p
              : {
                ...p,
                cp1: {
                  id: p.cp1.id,
                  x: newPointPos.x,
                  y: newPointPos.y
                }
              })
        }
      }
      //else CurveMode.smooth

      //this is cp1 and because we cannot change the start cp point and the end cp point
      //the counter part to this cp1 is the cp2 of the previous point
      return {
        ...line,
        points: line.points.map((p, index) => {

          if (index === i) {
            return {
              ...p,
              cp1: {
                id: p.cp1.id,
                x: newPointPos.x,
                y: newPointPos.y
              }
            }
          }

          if (index === i - 1) { //the previous line point we need to get the 180 degree in smooth mode...

            const cp1AnchorPoint = line.points[index]
            const realCp = point.cp1
            const realCopAngle = getAngleInDeg(cp1AnchorPoint.x, cp1AnchorPoint.y, realCp.x, realCp.y) + 90
            const cpToMove = p.cp2
            const cpLineLength = getPointDistance(cp1AnchorPoint, cpToMove) //we want to keep the original length
            const newPoint = rotatePointBy(cp1AnchorPoint.x, cp1AnchorPoint.y,
              cp1AnchorPoint.x, cp1AnchorPoint.y - cpLineLength, -(realCopAngle + 180))
            return {
              ...p,
              cp2: {
                id: p.cp2.id,
                x: newPoint.x,
                y: newPoint.y
              }
            }
          }

          return p
        })

      }

    }

    //check control point 2
    if (point.cp2.id === oldPointId) {

      //linear don't mind control
      //the last bezier point cp2 is for the line end point so this cannot be changed by the curve mode
      if (point.curveMode === CurveMode.free || point.curveMode === CurveMode.linear || i === line.points.length - 1) {
        return {
          ...line,
          points: line.points.map((p, index) =>
            index !== i
              ? p
              : {
                ...p,
                cp2: {
                  id: p.cp2.id,
                  x: newPointPos.x,
                  y: newPointPos.y
                }
              })
        }
      }

      //else CurveMode.smooth

      //this is cp2 and because we cannot change the start cp point and the end cp point
      //the counter part to this cp2 is the cp1 of the next point

      return {
        ...line,
        points: line.points.map((p, index) => {

          if (index === i) {
            return {
              ...p,
              cp2: {
                id: p.cp2.id,
                x: newPointPos.x,
                y: newPointPos.y
              }
            }
          }
          if (index === i + 1) { //the next line point we need to get the 180 degree in smooth mode...
            const cp2AnchorPoint = point
            const realCp = point.cp2
            const realCopAngle = getAngleInDeg(cp2AnchorPoint.x, cp2AnchorPoint.y, realCp.x, realCp.y) + 90
            const cpToMove = p.cp1
            const cpLineLength = getPointDistance(cp2AnchorPoint, cpToMove) //we want to keep the original length
            const newPoint = rotatePointBy(cp2AnchorPoint.x, cp2AnchorPoint.y,
              cp2AnchorPoint.x, cp2AnchorPoint.y - cpLineLength, -(realCopAngle + 180))
            return {
              ...p,
              cp1: {
                id: p.cp1.id,
                x: newPoint.x,
                y: newPoint.y
              }
            }
          }

          return p
        })

      }
    }

  }

  console.error('TOOD no point found')
  return line
}


function changeBezierPointCurveMode(line: LineShape, bezierPointId: number, newCurveMode: CurveMode): LineShape {

  return {
    ...line,
    points: line.points.map(p =>
      p.id !== bezierPointId
        ? p
        : {
          ...p,
          curveMode: newCurveMode
        })
  }
}


export enum UndoType {
  undo = 'line_shapesReducer_undo',
  redo = 'line_shapesReducer_redo',
}

export interface Edit_lineUndo {
  readonly type: UndoType.undo
}

export interface Edit_lineRedo {
  readonly type: UndoType.redo
}

//increment every time another (field/img/line) reducer applies an action
//then we don't group the next action in here into the same item
/*
    because the shape reducer groups field move then groups img move
    but the field reducer only sees field moves not img moves
    so when we move the field again we group into the same item...
 */
export let lineUndoVersionId = 0

export function incLineHistoryId(): void {
  lineUndoVersionId++
}

export const reducer = undoable(_reducer, {
  limit: undoShapeLimit,
  undoType: UndoType.undo,
  redoType: UndoType.redo,
  clearHistoryType: clearTileEditorEditShapesType,
  groupBy: (action, state) => {
    if (action.type === ActionType.SET_selectedLinePointNewPos) {
      return ActionType.SET_selectedLinePointNewPos + lineUndoVersionId
    }

    //not group bools else if we only trigger the bool then we get a undo item with no effect
    //also bad for enums...
    if (action.type === ActionType.SET_lineHasStartArrow
      || action.type === ActionType.SET_lineHasEndArrow
      || action.type === ActionType.SET_linePointCurveMode
    ) {
      return null
    }

    return action.type + lineUndoVersionId
  }
})
