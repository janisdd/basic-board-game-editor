import {
  BezierPoint,
  CurveMode,
  FieldShape,
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
import {setPropertyEditor_FieldConnectedLinesThroughAnchors} from "../fieldProperties/actions";
import {
  checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap,
  isFieldAndLineConnectedThroughAnchorPoints
} from "../../../../helpers/interactionHelper";
import _ = require("lodash");


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

    //make sur integer coords...nah
    // lineShape = {
    //   ...lineShape,
    //   points: lineShape.points.map(p => {
    //     return {
    //       ...p,
    //       x: Math.floor(p.x),
    //       y: Math.floor(p.y),
    //       cp1: {
    //         ...p.cp1,
    //         x: Math.floor(p.cp1.x),
    //         y: Math.floor(p.cp1.y),
    //       },
    //       cp2: {
    //         ...p.cp2,
    //         x: Math.floor(p.cp2.x),
    //         y: Math.floor(p.cp2.y),
    //       }
    //     }
    //   }),
    //   startPoint: {
    //     ...lineShape.startPoint,
    //     x: Math.floor(lineShape.startPoint.x),
    //     y: Math.floor(lineShape.startPoint.y),
    //   }
    // }

    dispatch(_addLineShape(lineShape))

    const fields = getState().tileEditorFieldShapesState.present
    const fieldSymbols = getState().fieldSymbolState.present

    for (const field of fields) {

      const connectedPointIds = isFieldAndLineConnectedThroughAnchorPoints(field, fieldSymbols, lineShape, 0)
      if (connectedPointIds.length > 0) {

        dispatch(setPropertyEditor_FieldConnectedLinesThroughAnchors(field.id, lineShape.id,
          connectedPointIds))
      }
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

      const connectedPointsList = field.connectedLinesThroughAnchorPoints[lineShapeId]

      if (connectedPointsList !== undefined) {
        dispatch(setPropertyEditor_FieldConnectedLinesThroughAnchors(field.id, lineShapeId, null))
      }
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
    const fieldSymbols = getState().fieldSymbolState.present

    for (const field of fields) {

      const connectedPointsList = field.connectedLinesThroughAnchorPoints[lineId]

      if (connectedPointsList !== undefined) {
        //no longer connected??

        const connectedPointIds = isFieldAndLineConnectedThroughAnchorPoints(field, fieldSymbols, newLine, 0)

        if (connectedPointIds.length === 0) {
          dispatch(setPropertyEditor_FieldConnectedLinesThroughAnchors(field.id, lineId, null))
        }
      }
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
 *
 * @param {number} lineId
 * @param {number} oldPointId
 * @param {PlainPoint} newPointPos
 * @param {boolean} canSetFieldAnchorPoints when we move the line because of an anchor point we definitively won't change the connected lines of the connected field (from which the anchor point made us move the line point)
 * @returns {MultiActions}
 */
export function set_selectedLinePointNewPosAction(lineId: number, oldPointId: number, newPointPos: PlainPoint, canSetFieldAnchorPoints: boolean): MultiActions {
  return (dispatch, getState) => {

    dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))

    //also check if we need to change the connected fields e.g. when moving the line because it's connected
    //to a field that is moved we can end here
    if (!canSetFieldAnchorPoints) {
      return
    }

    //TODO maybe not use lodash --> smaller bundle size?
    const fields = _.orderBy(getState().tileEditorFieldShapesState.present, (p: FieldShape) => p.zIndex, 'desc')

    const newLine = getState().tileEditorLineShapeState.present.find(p => p.id === lineId)

    const anchorPointSnapToleranceRadiusInPx = getState().worldSettingsState.anchorPointSnapToleranceRadiusInPx
    const fieldSymbols = getState().fieldSymbolState.present


    const connectedMap = {}

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const connectedPointsList = field.connectedLinesThroughAnchorPoints[lineId]

      //not already connected?
      if (connectedPointsList === undefined) {

        //this makes the line point snap to the anchor point if wanted
        const connectedPointIds = isFieldAndLineConnectedThroughAnchorPoints(field, fieldSymbols, newLine,
          anchorPointSnapToleranceRadiusInPx)

        if (connectedPointIds.length > 0) {

          if (connectedMap[oldPointId] !== undefined) { //check for undefined ...if the id is 0...
            //a have already a field connected to this point (in the line)
            continue
          }

          dispatch(setPropertyEditor_FieldConnectedLinesThroughAnchors(field.id, lineId, connectedPointIds));
          //not need to update the map here because break
          break //because we can only have 1 field connected to the point we can break here
        }
      }
      else {

        //already connected but we could want to disconnect/or add a new connected point
        const connectedPointIds = isFieldAndLineConnectedThroughAnchorPoints(field, fieldSymbols, newLine,
          anchorPointSnapToleranceRadiusInPx)

        if (connectedMap[oldPointId] !== undefined) { //check for undefined ...if the id is 0...
          //a have already a field connected to this point (in the line)
          continue
        }

        if (connectedPointIds.length > 0) {
          //we add the point to update the map
          connectedMap[oldPointId] = field.id
        }

        //if undo it's better to only dispatch if we really changed something...

        if (connectedPointsList.length === connectedPointsList.length && connectedPointsList.every(
          (value, index) => value === connectedPointIds[index])) {
          //do nothing already connected
        }
        else {
          dispatch(setPropertyEditor_FieldConnectedLinesThroughAnchors(field.id, lineId,
            connectedPointIds.length === 0 ? null : connectedPointIds));

          break //because we can only have 1 field connected to the point we can break here
        }
      }
    }

    //--- check if the line points snaps to a tile border point
    checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap(getState().tileEditorState.tileProps, newLine,
      anchorPointSnapToleranceRadiusInPx)


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

export function setPropertyEditor_addPointToLineShape(lineId: number, bezierPoint: BezierPoint): ADD_PointToLineShapeAction {
  return {
    type: ActionType.ADD_PointToLineShape,
    bezierPoint,
    lineId,
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
    //set it to the old pos ... this should do the all for us

    const line = getState().tileEditorLineShapeState.present.find(p => p.id === lineId)
    const bezierPoint = line.points.find(p => p.id == linePointId)

    dispatch(set_selectedLinePointNewPosAction(lineId, linePointId, bezierPoint, false))

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
