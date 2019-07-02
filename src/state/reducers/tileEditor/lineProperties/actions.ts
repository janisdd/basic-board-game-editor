import {
  BezierPoint, ConnectedLineTuple,
  CurveMode,
  FieldShape, FieldSymbol,
  ImgShape,
  LineBase,
  LineShape,
  PlainPoint,
  Point
} from "../../../../types/drawing";
import {
  ActionBase,
  ActionType,
  ADD_LineShapeAction,
  ADD_PointToLineShapeAction, Edit_lineRedo, Edit_lineUndo,
  REMOVE_LineShapeAction,
  REMOVE_PointFromLineShapeAction, SET_hasEndArrowAction, SET_hasStartArrowAction,
  SET_lineArrayAction, SET_lineArrowHeightAction, SET_lineArrowWidthAction,
  SET_lineColorAction, SET_lineCreatedFromSymbolIdAction,
  SET_lineDashArrayAction, SET_linePointCurveModeAction,
  SET_lineThicknessInPxAction, SET_lineZIndexAction,
  SET_selectedLinePointNewPosAction, UndoType
} from "./linePropertyReducer";
import {MultiActions} from "../../../../types/ui";
import {
  _setPropertyEditor_FieldAnchorPoints,
  setPropertyEditor_FieldAnchorPoints,
} from "../fieldProperties/actions";
import {
  calcAnchorPoint,
  calcSingleAnchorPoint,
  checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap,
  isFieldAndLineConnectedThroughAnchorPoints, isFieldAndLinePointConnectedThroughAnchorPoints
} from "../../../../helpers/interactionHelper";


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

    //TODO tile border points

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

    //TODO tile border points

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

    //TODO tile border points

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
 * @param lineId
 * @param oldPointId
 * @param newPointPos
 * @param canSetFieldAnchorPoints
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

    const targetPoint: Point = line.startPoint.id === oldPointId
      ? line.startPoint
      : line.points.find(p => p.id === oldPointId)


    //undefined then probably a control point... nothing to do here
    if (targetPoint === undefined) {
      dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))
      return
    }

    for (const field of fields) {

      const connectedLineTuple = isFieldAndLinePointConnectedThroughAnchorPoints(field, fieldSymbols, lineId, targetPoint, anchorPointSnapToleranceRadiusInPx)

      if (connectedLineTuple === null) {
        //try to remove connected

        dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))

        //if no anchor point is connected to this point don't dispatch

        if (!(field.anchorPoints.some(p => p.connectedLineTuples.some(k => k.pointId === oldPointId)))) continue

        dispatch(_setPropertyEditor_FieldAnchorPoints(field.id, field.anchorPoints.map((p, index) => {
          return {
            ...p,
            connectedLineTuples: p.connectedLineTuples.filter(k => k.pointId !== oldPointId)
          }
        })))

        return

      } else {

        //try to snap to the anchor point

        //the old anchor point but coords have not changed...
        const anchorPointPos = calcAnchorPoint(field, fieldSymbols, field.anchorPoints[connectedLineTuple.anchorPointIndex])

        if (targetPoint.x === anchorPointPos.x && targetPoint.y === anchorPointPos.y &&
          (newPointPos.x !== anchorPointPos.x || newPointPos.y !== anchorPointPos.y)) {
          //old pos was on anchor point
          //new not... user wants to remove connection

          dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))

          //remove connection
          dispatch(_setPropertyEditor_FieldAnchorPoints(field.id, field.anchorPoints.map((p, index) => {
            return {
              ...p,
              connectedLineTuples: p.connectedLineTuples.filter(k => k.pointId !== oldPointId)
            }
          })))

        } else {

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

        }

        return

      }

    }

    //TODO tile border points

    //--- check if the line points snaps to a tile border point
    // checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap(getState().tileEditorState.tileProps, newLine,
    //   anchorPointSnapToleranceRadiusInPx)


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

        // .filter(p => p.lineId === lineId).concat(connectedTuples)
        //TOOD line
        console.log('CHECK!!!!!!!!!')

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

    //TODO tile border points

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
