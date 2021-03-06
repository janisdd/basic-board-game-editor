import {
  AnchorPoint,
  BezierPoint,
  CurveMode,
  FieldSymbol,
  LineShape,
  PlainPoint,
  Point
} from "../../../../types/drawing";
import {
  ActionType,
  ADD_LineShapeAction,
  ADD_PointToLineShapeAction,
  Edit_lineRedo,
  Edit_lineUndo,
  REMOVE_LineShapeAction,
  REMOVE_PointFromLineShapeAction,
  SET_hasEndArrowAction,
  SET_hasStartArrowAction,
  SET_lineArrayAction,
  SET_lineArrowHeightAction,
  SET_lineArrowWidthAction,
  SET_lineColorAction,
  SET_lineCreatedFromSymbolIdAction,
  SET_lineDashArrayAction,
  SET_linePointCurveModeAction,
  SET_lineThicknessInPxAction,
  SET_lineZIndexAction,
  SET_selectedLinePointNewPosAction,
  UndoType
} from "./linePropertyReducer";
import {MultiActions} from "../../../../types/ui";
import {_setPropertyEditor_FieldAnchorPoints,} from "../fieldProperties/actions";
import {
  calcAnchorPoint,
  checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap,
  isFieldAndLineConnectedThroughAnchorPoints,
  isFieldAndLinePointConnectedThroughAnchorPoints
} from "../../../../helpers/interactionHelper";
import {
  _set_editor_botBorderPoints, _set_editor_leftBorderPoints, _set_editor_rightBorderPoint,
  _set_editor_topBorderPoints,
  set_editor_botBorderPoints,
  set_editor_leftBorderPoints,
  set_editor_rightBorderPoint,
  set_editor_topBorderPoints
} from "../actions";
import {Logger} from "../../../../helpers/logger";
import {notExhaustiveThrow} from "../../_notExhausiveHelper";


export function setPropertyEditor_lineShapes(lines: ReadonlyArray<LineShape>): SET_lineArrayAction {
  return {
    type: ActionType.SET_lineArray,
    lines
  }
}

export function _addLineShape(lineShape: LineShape): ADD_LineShapeAction {
  return {
    type: ActionType.ADD_LineShape,
    lineShape
  }
}

export function addLineShape(lineShape: LineShape): MultiActions {
  return (dispatch, getState) => {


    dispatch(_addLineShape(lineShape))

    //new added line could already connect to fields

    const fields = getState().tileEditorFieldShapesState.present
    const fieldSymbols = getState().fieldSymbolState.present

    for (const field of fields) {

      const connectedPointIds = isFieldAndLineConnectedThroughAnchorPoints(field, fieldSymbols, lineShape, 0)
      if (connectedPointIds.length > 0) {

        dispatch(_setPropertyEditor_FieldAnchorPoints(field.id, field.anchorPoints.map((p, index) => {
          return {
            ...p,
            //only take the connected points that are connected to the current anchor point
            connectedLineTuples: p.connectedLineTuples.concat(
              connectedPointIds
                .filter(p => p.anchorPointIndex === index)
                .map(k => {
                  return {
                    lineId: k.lineId,
                    pointId: k.pointId
                  }
                })
            )
          }
        })))

      }
    }

    //this is needed e.g. when we auto insert lines from fields to border points...

    const __setLinePointNewPos = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))

    checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap(getState().tileEditorState.tileProps, lineShape.id, lineShape.startPoint, lineShape.startPoint,
      (borderPoint, direction, tileWidth, tileHeight) => {

        switch (direction) {
          case "top": {
            const topBorderPoints = getState().tileEditorState.tileProps.topBorderPoints

            dispatch(set_editor_topBorderPoints(topBorderPoints.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint)))

            break;
          }
          case "bottom": {
            const botBorderPoints = getState().tileEditorState.tileProps.botBorderPoints

            dispatch(set_editor_botBorderPoints(botBorderPoints.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint), tileHeight))
            break;
          }

          case "left": {
            const leftBorderPoints = getState().tileEditorState.tileProps.leftBorderPoints

            dispatch(set_editor_leftBorderPoints(leftBorderPoints.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint)))
            break;
          }

          case "right": {
            const rightBorderPoint = getState().tileEditorState.tileProps.rightBorderPoint

            dispatch(set_editor_rightBorderPoint(rightBorderPoint.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint), tileWidth))
            break;
          }
          default:
            notExhaustiveThrow(direction)
        }
      },
      __setLinePointNewPos,
      0, false)

    for (let i = 0; i < lineShape.points.length; i++) {
      const linePoint = lineShape.points[i];

      checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap(getState().tileEditorState.tileProps, lineShape.id, linePoint, linePoint,
        (borderPoint, direction, tileWidth, tileHeight) => {

          switch (direction) {
            case "top": {
              const topBorderPoints = getState().tileEditorState.tileProps.topBorderPoints

              dispatch(set_editor_topBorderPoints(topBorderPoints.map(p => p.id !== borderPoint.id
                ? p
                : borderPoint)))

              break;
            }
            case "bottom": {
              const botBorderPoints = getState().tileEditorState.tileProps.botBorderPoints

              dispatch(set_editor_botBorderPoints(botBorderPoints.map(p => p.id !== borderPoint.id
                ? p
                : borderPoint), tileHeight))
              break;
            }

            case "left": {
              const leftBorderPoints = getState().tileEditorState.tileProps.leftBorderPoints

              dispatch(set_editor_leftBorderPoints(leftBorderPoints.map(p => p.id !== borderPoint.id
                ? p
                : borderPoint)))
              break;
            }

            case "right": {
              const rightBorderPoint = getState().tileEditorState.tileProps.rightBorderPoint

              dispatch(set_editor_rightBorderPoint(rightBorderPoint.map(p => p.id !== borderPoint.id
                ? p
                : borderPoint), tileWidth))
              break;
            }
            default:
              notExhaustiveThrow(direction)
          }
        },
        __setLinePointNewPos,
        0, false)
    }

  }
}

export function _removeLineShape(lineShapeId: number): REMOVE_LineShapeAction {
  return {
    type: ActionType.REMOVE_LineShape,
    lineShapeId
  }
}


export function removeLineShape(lineShapeId: number): MultiActions {
  return (dispatch, getState) => {

    dispatch(_removeLineShape(lineShapeId))

    //also remove connected line from fields
    const fields = getState().tileEditorFieldShapesState.present

    for (const field of fields) {

      for (let i = 0; i < field.anchorPoints.length; i++) {
        const anchorPoint = field.anchorPoints[i]

        const isAtLeastOneLineConnected = anchorPoint.connectedLineTuples.some(p => p.lineId === lineShapeId)

        if (!isAtLeastOneLineConnected) continue

        dispatch(_setPropertyEditor_FieldAnchorPoints(field.id, field.anchorPoints.map(p => {
          return {
            ...p,
            connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== lineShapeId)
          }
        })))

      }

    }

    const tileProps = getState().tileEditorState.tileProps

    //maybe we could remove the check and always dispatch??
    if (tileProps.topBorderPoints.some(p => p.connectedLineTuples.some(k => k.lineId === lineShapeId))) {
      dispatch(_set_editor_topBorderPoints(tileProps.topBorderPoints.map(p => {
        return {
          ...p,
          connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== lineShapeId)
        }
      })))
    }


    if (tileProps.botBorderPoints.some(p => p.connectedLineTuples.some(k => k.lineId === lineShapeId))) {
      dispatch(_set_editor_botBorderPoints(tileProps.botBorderPoints.map(p => {
        return {
          ...p,
          connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== lineShapeId)
        }
      })))
    }

    if (tileProps.leftBorderPoints.some(p => p.connectedLineTuples.some(k => k.lineId === lineShapeId))) {
      dispatch(_set_editor_leftBorderPoints(tileProps.leftBorderPoints.map(p => {
        return {
          ...p,
          connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== lineShapeId)
        }
      })))
    }

    if (tileProps.rightBorderPoint.some(p => p.connectedLineTuples.some(k => k.lineId === lineShapeId))) {
      dispatch(_set_editor_rightBorderPoint(tileProps.rightBorderPoint.map(p => {
        return {
          ...p,
          connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== lineShapeId)
        }
      })))
    }

  }
}


export function _removePointFromLineShape(lineId: number, pointId: number): REMOVE_PointFromLineShapeAction {
  return {
    type: ActionType.REMOVE_PointFromLineShape,
    lineId,
    pointId
  }
}

export function removePointFromLineShape(lineId: number, pointId: number): MultiActions {
  return (dispatch, getState) => {

    dispatch(_removePointFromLineShape(lineId, pointId))

    const newLine = getState().tileEditorLineShapeState.present.find(p => p.id === lineId)

    //also check if we need to change the connected fields
    const fields = getState().tileEditorFieldShapesState.present

    for (const field of fields) {


      for (let i = 0; i < field.anchorPoints.length; i++) {
        const anchorPoint = field.anchorPoints[i]

        const isAtLeastOnePointConnected = anchorPoint.connectedLineTuples.some(p => p.pointId === pointId)

        if (!isAtLeastOnePointConnected) continue

        dispatch(_setPropertyEditor_FieldAnchorPoints(field.id, field.anchorPoints.map(p => {
          return {
            ...p,
            connectedLineTuples: p.connectedLineTuples.filter(k => k.pointId !== pointId)
          }
        })))

      }
    }

    //check if we need to remove the point from a border point connection list

    const tileProps = getState().tileEditorState.tileProps

    if (tileProps.topBorderPoints.some(p => p.connectedLineTuples.some(k => k.lineId === lineId && k.pointId === pointId))) {
      dispatch(set_editor_topBorderPoints(tileProps.topBorderPoints.map(p => {
        return {
          ...p,
          connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== lineId || k.pointId !== pointId)
        }
      })))
    }

    if (tileProps.botBorderPoints.some(p => p.connectedLineTuples.some(k => k.lineId === lineId && k.pointId === pointId))) {
      dispatch(set_editor_botBorderPoints(tileProps.botBorderPoints.map(p => {
        return {
          ...p,
          connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== lineId || k.pointId !== pointId)
        }
      }), tileProps.tileSettings.height))
    }

    if (tileProps.leftBorderPoints.some(p => p.connectedLineTuples.some(k => k.lineId === lineId && k.pointId === pointId))) {
      dispatch(set_editor_leftBorderPoints(tileProps.leftBorderPoints.map(p => {
        return {
          ...p,
          connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== lineId || k.pointId !== pointId)
        }
      })))
    }

    if (tileProps.rightBorderPoint.some(p => p.connectedLineTuples.some(k => k.lineId === lineId && k.pointId === pointId))) {
      dispatch(set_editor_rightBorderPoint(tileProps.rightBorderPoint.map(p => {
        return {
          ...p,
          connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== lineId || k.pointId !== pointId)
        }
      }), tileProps.tileSettings.width))
    }

  }
}


export function _setLinePointNewPos(lineId: number, oldPointId: number, newPointPos: PlainPoint): SET_selectedLinePointNewPosAction {
  return {
    type: ActionType.SET_selectedLinePointNewPos,
    lineId,
    oldPointId,
    newPointPos
  }
}


/**
 * this will attach or detach the line from fields
 *
 * @param lineId
 * @param oldPointId
 * @param newPointPos
 */
export function set_selectedLinePointNewPosAction(lineId: number, oldPointId: number, newPointPos: PlainPoint): MultiActions {
  return (dispatch, getState) => {


    //also check if we need to change the connected fields e.g. when moving the line because it's connected
    //to a field that is moved we can end here

    const anchorPointSnapToleranceRadiusInPx = getState().worldSettingsState.anchorPointSnapToleranceRadiusInPx

    const fields = getState().tileEditorFieldShapesState.present
    const fieldSymbols = getState().fieldSymbolState.present

    const lines = getState().tileEditorLineShapeState.present

    const line = lines.find(p => p.id === lineId)

    if (!line) return

    //this is the old point (coords)
    const targetPoint: Point = line.startPoint.id === oldPointId
      ? line.startPoint
      : line.points.find(p => p.id === oldPointId)

    dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))

    //undefined then probably a control point... nothing to do here (connected lines cannot change)
    if (targetPoint === undefined) {

      return
    }

    let posSet = false

    for (const field of fields) {

      let symbol: FieldSymbol | null = null
      if (field.createdFromSymbolGuid !== null) {
        symbol = fieldSymbols.find(p => p.guid === field.createdFromSymbolGuid)
        if (!symbol) {
          const msg = `could not find field symbol for guid ${field.createdFromSymbolGuid}`
          Logger.fatal(msg)
          throw new Error(msg)
        }
      }

      //if we have many fields this has a big performance impact (positively)...
      if (targetPoint.x < field.x && newPointPos.x < field.x) continue
      if (targetPoint.y < field.y && newPointPos.y < field.y) continue

      if (targetPoint.x < field.x && newPointPos.x < field.x) continue
      if (targetPoint.y < field.y && newPointPos.y < field.y) continue

      if (field.x + (field.createdFromSymbolGuid !== null && symbol.overwriteWidth ? symbol.width : field.width) < targetPoint.x &&
        field.x + (field.createdFromSymbolGuid !== null && symbol.overwriteWidth ? symbol.width : field.width) < newPointPos.x
      ) continue

      if (field.y + (field.createdFromSymbolGuid !== null && symbol.overwriteHeight ? symbol.height : field.height) < targetPoint.y &&
        field.y + (field.createdFromSymbolGuid !== null && symbol.overwriteHeight ? symbol.height : field.height) < newPointPos.y
      ) continue


      const connectedLineTuple = isFieldAndLinePointConnectedThroughAnchorPoints(field, fieldSymbols, lineId, targetPoint, anchorPointSnapToleranceRadiusInPx)

      if (connectedLineTuple === null) {
        //try to remove connected

        posSet = true

        //if no anchor point is connected to this point don't dispatch

        if (!(field.anchorPoints.some(p => p.connectedLineTuples.some(k => k.pointId === oldPointId)))) continue

        dispatch(_setPropertyEditor_FieldAnchorPoints(field.id, field.anchorPoints.map((p, index) => {
          return {
            ...p,
            connectedLineTuples: p.connectedLineTuples.filter(k => k.pointId !== oldPointId)
          }
        })))


      } else {

        //try to snap to the anchor point

        //the old anchor point but coords have not changed...
        const anchorPointPos = calcAnchorPoint(field, fieldSymbols, field.anchorPoints[connectedLineTuple.anchorPointIndex])

        if (targetPoint.x === anchorPointPos.x && targetPoint.y === anchorPointPos.y &&
          (newPointPos.x !== anchorPointPos.x || newPointPos.y !== anchorPointPos.y)) {

          //old pos was on anchor point
          //new not... user wants to remove connection

          dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))
          posSet = true

          //remove connection
          dispatch(_setPropertyEditor_FieldAnchorPoints(field.id, field.anchorPoints.map((p, index) => {
            return {
              ...p,
              connectedLineTuples: p.connectedLineTuples.filter(k => k.pointId !== oldPointId)
            }
          })))

        } else {

          //add or renew connection

          dispatch(_setPropertyEditor_FieldAnchorPoints(field.id, field.anchorPoints.map((p, index) => {
            return index !== connectedLineTuple.anchorPointIndex
              ? p
              : {
                ...p,
                connectedLineTuples: p.connectedLineTuples
                  .filter(k => k.pointId !== oldPointId) //if we have two anchor points at the same coords... disconnect the other
                  .concat({
                    pointId: connectedLineTuple.pointId,
                    lineId: connectedLineTuple.lineId
                  })
              }
          })))


          dispatch(_setLinePointNewPos(lineId, oldPointId, anchorPointPos))
          posSet = true

        }

      }

    }


    //--- check if the line points snaps to a tile border point

    const __setLinePointNewPos = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))

    checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap(getState().tileEditorState.tileProps, lineId, targetPoint, newPointPos,
      (borderPoint, direction, tileWidth, tileHeight) => {

        switch (direction) {
          case "top": {
            const topBorderPoints = getState().tileEditorState.tileProps.topBorderPoints

            dispatch(set_editor_topBorderPoints(topBorderPoints.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint)))

            break;
          }
          case "bottom": {
            const botBorderPoints = getState().tileEditorState.tileProps.botBorderPoints

            dispatch(set_editor_botBorderPoints(botBorderPoints.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint), tileHeight))
            break;
          }

          case "left": {
            const leftBorderPoints = getState().tileEditorState.tileProps.leftBorderPoints

            dispatch(set_editor_leftBorderPoints(leftBorderPoints.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint)))
            break;
          }

          case "right": {
            const rightBorderPoint = getState().tileEditorState.tileProps.rightBorderPoint

            dispatch(set_editor_rightBorderPoint(rightBorderPoint.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint), tileWidth))
            break;
          }
          default:
            notExhaustiveThrow(direction)
        }
      },
      __setLinePointNewPos,
      anchorPointSnapToleranceRadiusInPx, true)

  }
}


//--- line props

export function setPropertyEditor_LineColor(lineId: number, color: string): SET_lineColorAction {
  return {
    type: ActionType.SET_lineColor,
    color,
    lineId,
  }
}

export function setPropertyEditor_LineThicknessInPx(lineId: number, thicknessInPx: number): SET_lineThicknessInPxAction {
  return {
    type: ActionType.SET_lineThicknessInPx,
    thicknessInPx,
    lineId,
  }
}

export function setPropertyEditor_LineDashArray(lineId: number, dashArray: ReadonlyArray<number>): SET_lineDashArrayAction {
  return {
    type: ActionType.SET_lineDashArray,
    dashArray,
    lineId,
  }
}

export function _setPropertyEditor_addPointToLineShape(lineId: number, bezierPoint: BezierPoint): ADD_PointToLineShapeAction {
  return {
    type: ActionType.ADD_PointToLineShape,
    bezierPoint,
    lineId,
  }
}

export function setPropertyEditor_addPointToLineShape(lineId: number, bezierPoint: BezierPoint): MultiActions {

  return (dispatch, getState) => {

    dispatch(_setPropertyEditor_addPointToLineShape(lineId, bezierPoint))

    //a new point could be connected (coords) to a field anchor point

    const fields = getState().tileEditorFieldShapesState.present
    const fieldSymbols = getState().fieldSymbolState.present

    const lines = getState().tileEditorLineShapeState.present

    const lineShape = lines.find(p => p.id === lineId)

    if (!lineShape) return

    const targetPoint: Point = lineShape.startPoint.id === bezierPoint.id
      ? lineShape.startPoint
      : lineShape.points.find(p => p.id === bezierPoint.id)

    for (const field of fields) {

      const connectedPointIds = isFieldAndLinePointConnectedThroughAnchorPoints(field, fieldSymbols, lineShape.id, targetPoint, 0)
      if (connectedPointIds !== null) {

        dispatch(_setPropertyEditor_FieldAnchorPoints(field.id, field.anchorPoints.map((p, index) => {
            return index !== connectedPointIds.anchorPointIndex
              ? p
              : {
                ...p,
                //remove all connected tuples from this line
                //because they are re added
                connectedLineTuples: p.connectedLineTuples.concat({
                  pointId: connectedPointIds.pointId,
                  lineId: connectedPointIds.lineId
                })
              }
          }
        )))

      }
    }

    //check if the new point is on the same coords as a border point

    const __setLinePointNewPos = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))

    checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap(getState().tileEditorState.tileProps, lineId, targetPoint, bezierPoint,
      (borderPoint, direction, tileWidth, tileHeight) => {

        switch (direction) {
          case "top": {
            const topBorderPoints = getState().tileEditorState.tileProps.topBorderPoints

            dispatch(set_editor_topBorderPoints(topBorderPoints.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint)))

            break;
          }
          case "bottom": {
            const botBorderPoints = getState().tileEditorState.tileProps.botBorderPoints

            dispatch(set_editor_botBorderPoints(botBorderPoints.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint), tileHeight))
            break;
          }

          case "left": {
            const leftBorderPoints = getState().tileEditorState.tileProps.leftBorderPoints

            dispatch(set_editor_leftBorderPoints(leftBorderPoints.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint)))
            break;
          }

          case "right": {
            const rightBorderPoint = getState().tileEditorState.tileProps.rightBorderPoint

            dispatch(set_editor_rightBorderPoint(rightBorderPoint.map(p => p.id !== borderPoint.id
              ? p
              : borderPoint), tileWidth))
            break;
          }
          default:
            notExhaustiveThrow(direction)
        }
      },
      __setLinePointNewPos,
      0, false)

  }
}


export function setPropertyEditor_LineHasStartArrow(lineId: number, hasStartArrow: boolean): SET_hasStartArrowAction {
  return {
    type: ActionType.SET_lineHasStartArrow,
    hasStartArrow,
    lineId,
  }
}

export function setPropertyEditor_LineHasEndArrow(lineId: number, hasEndArrow: boolean): SET_hasEndArrowAction {
  return {
    type: ActionType.SET_lineHasEndArrow,
    hasEndArrow,
    lineId,
  }
}

export function setPropertyEditor_LineAbsoluteZIndex(lineId: number, zIndex: number): SET_lineZIndexAction {
  return {
    type: ActionType.SET_lineZIndex,
    zIndex,
    lineId
  }
}

export function setPropertyEditor_LineCreatedFromSymbolId(lineId: number, createdFromSymbolGuid: string | null): SET_lineCreatedFromSymbolIdAction {
  return {
    type: ActionType.SET_lineCreatedFromSymbolId,
    createdFromSymbolGuid,
    lineId
  }
}

export function setPropertyEditor_LineArrowHeight(lineId: number, arrowHeight: number): SET_lineArrowHeightAction {
  return {
    type: ActionType.SET_lineArrowHeight,
    arrowHeight,
    lineId
  }
}

export function setPropertyEditor_LineArrowWidth(lineId: number, arrowWidth: number): SET_lineArrowWidthAction {
  return {
    type: ActionType.SET_lineArrowWidth,
    arrowWidth,
    lineId
  }
}

export function _setPropertyEditor_linePointCurveMode(lineId: number, linePointId: number, curveMode: CurveMode): SET_linePointCurveModeAction {
  return {
    type: ActionType.SET_linePointCurveMode,
    lineId,
    linePointId,
    curveMode
  }
}

export function setPropertyEditor_linePointCurveMode(lineId: number, linePointId: number, curveMode: CurveMode): MultiActions {
  return (dispatch, getState) => {

    dispatch(_setPropertyEditor_linePointCurveMode(lineId, linePointId, curveMode))

    //after setting the mode adjust the control points...
    //set it to the old pos ... this should do all for us

    const line = getState().tileEditorLineShapeState.present.find(p => p.id === lineId)
    const bezierPoint = line.points.find(p => p.id == linePointId)

    dispatch(set_selectedLinePointNewPosAction(lineId, linePointId, bezierPoint))

  }
}


export function edit_lineUndo(): Edit_lineUndo {
  return {
    type: UndoType.undo
  }
}

export function edit_lineRedo(): Edit_lineRedo {
  return {
    type: UndoType.redo
  }
}
