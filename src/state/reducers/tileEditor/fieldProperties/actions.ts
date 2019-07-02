import {
  AnchorPoint,
  FieldShape,
  FieldSymbol,
  HorizontalAlign,
  LineShape, PlainPoint,
  VerticalAlign
} from "../../../../types/drawing";
import {
  ActionBase,
  ActionType,
  ADD_fieldShapeAction, CLEAR_fieldShape_connectedLinesAction,
  Edit_fieldShapeRedo,
  Edit_fieldShapeUndo, getNextShapeId,
  REMOVE_fieldShapeAction,
  SET_field_isFontBoldAction,
  SET_field_isFontItalicAction,
  SET_field_rotationInDegreeAction,
  SET_fieldAnchorPointsAction, SET_fieldBackgroundImgGuidAction,
  SET_fieldBgColorAction,
  SET_fieldBorderColorAction,
  SET_fieldBorderSizeInPxAction,
  SET_fieldCmdTextAction,
  SET_fieldColorAction,
  SET_fieldCornerRadiusAction,
  SET_fieldCreatedFromSymbolIdAction,
  SET_fieldFontNameAction,
  SET_fieldFontSizeInPxAction,
  SET_fieldHeightAction,
  SET_fieldHorizontalTextAlign,
  SET_fieldPaddingAction,
  SET_fieldsArrayAction,
  SET_fieldTextAction,
  SET_fieldVerticalTextAlignAction,
  SET_fieldWidthAction,
  SET_fieldXAction,
  SET_fieldYAction,
  SET_fieldZIndexAction,
  UndoFieldShapeType
} from "./fieldPropertyReducer";
import {MultiActions} from "../../../../types/ui";
import {adjustLinesFromAnchorPoints} from "../../../../helpers/interactionHelper";
import {Logger} from "../../../../helpers/logger";
import {_setLinePointNewPos, set_selectedLinePointNewPosAction} from "../lineProperties/actions";
import {set_LinePointNewPosAction} from "../../world/tileLibrary/actions";


export function setPropertyEditor_fieldsShapes(fields: ReadonlyArray<FieldShape>): SET_fieldsArrayAction {
  return {
    type: ActionType.SET_fieldsArray,
    fields
  }
}

export function addFieldShape(field: FieldShape): ADD_fieldShapeAction {
  return {
    type: ActionType.ADD_fieldShape,
    fieldShape: field
  }
}

export function removeFieldShape(fieldShapeId: number): REMOVE_fieldShapeAction {
  return {
    type: ActionType.REMOVE_fieldShape,
    fieldShapeId
  }
}


export function clearAllConnectedLinesFromAllFields(): CLEAR_fieldShape_connectedLinesAction {
  return {
    type: ActionType.CLEAR_fieldShape_connectedLines,
  }
}


export function setPropertyEditor_TileFieldArray(fields: ReadonlyArray<FieldShape>): SET_fieldsArrayAction {
  return {
    type: ActionType.SET_fieldsArray,
    fields
  }
}


export function setPropertyEditor_FieldText(fieldId: number, text: string): SET_fieldTextAction {
  return {
    type: ActionType.SET_fieldText,
    text,
    fieldId
  }
}


export function _setPropertyEditor_FieldX(fieldId: number, x: number): SET_fieldXAction {
  return {
    type: ActionType.SET_fieldX,
    x,
    fieldId
  }
}

/**
 * sets the field x and moves connected line points (through anchor points)
 * @param {number} fieldId
 * @param {number} x
 * @returns {MultiActions}
 */
export function setPropertyEditor_FieldX(fieldId: number, x: number): MultiActions {
  return (dispatch, getState) => {


    dispatch(_setPropertyEditor_FieldX(fieldId, x))

    const fieldAfter = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldAfter === undefined) {
      Logger.fatal('[internal] could not find the fieldAfter')
      return
    }

    const afterFieldSymbol = fieldAfter.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldAfter.createdFromSymbolGuid)

    if (afterFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the afterFieldSymbol')
      return
    }

    const allLines = getState().tileEditorLineShapeState.present

    const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))

    adjustLinesFromAnchorPoints(fieldAfter, allLines, afterFieldSymbol, setLinePoint)
  }
}

export function _setPropertyEditor_FieldY(fieldId: number, y: number): SET_fieldYAction {
  return {
    type: ActionType.SET_fieldY,
    y,
    fieldId
  }
}

export function setPropertyEditor_FieldY(fieldId: number, y: number): MultiActions {
  return (dispatch, getState) => {

    dispatch(_setPropertyEditor_FieldY(fieldId, y))

    const fieldAfter = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldAfter === undefined) {
      Logger.fatal('[internal] could not find the fieldAfter')
      return
    }

    const afterFieldSymbol = fieldAfter.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldAfter.createdFromSymbolGuid)

    if (afterFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the afterFieldSymbol')
      return
    }

    const allLines = getState().tileEditorLineShapeState.present
    const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))
    adjustLinesFromAnchorPoints(fieldAfter, allLines, afterFieldSymbol, setLinePoint)
  }
}

export function _setPropertyEditor_FieldWidth(fieldId: number, width: number): SET_fieldWidthAction {
  return {
    type: ActionType.SET_fieldWidth,
    width,
    fieldId
  }
}

export function setPropertyEditor_FieldWidth(fieldId: number, width: number): MultiActions {
  return (dispatch, getState) => {


    dispatch(_setPropertyEditor_FieldWidth(fieldId, width))

    const fieldAfter = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldAfter === undefined) {
      Logger.fatal('[internal] could not find the fieldAfter')
      return
    }

    const afterFieldSymbol = fieldAfter.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldAfter.createdFromSymbolGuid)

    if (afterFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the afterFieldSymbol')
      return
    }

    const allLines = getState().tileEditorLineShapeState.present
    const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))
    adjustLinesFromAnchorPoints(fieldAfter, allLines, afterFieldSymbol, setLinePoint)
  }
}

export function _setPropertyEditor_FieldHeight(fieldId: number, height: number): SET_fieldHeightAction {
  return {
    type: ActionType.SET_fieldHeight,
    height,
    fieldId
  }
}

export function setPropertyEditor_FieldHeight(fieldId: number, height: number): MultiActions {
  return (dispatch, getState) => {

    dispatch(_setPropertyEditor_FieldHeight(fieldId, height))

    const fieldAfter = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldAfter === undefined) {
      Logger.fatal('[internal] could not find the fieldAfter')
      return
    }

    const afterFieldSymbol = fieldAfter.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldAfter.createdFromSymbolGuid)

    if (afterFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the afterFieldSymbol')
      return
    }

    const allLines = getState().tileEditorLineShapeState.present
    const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))
    adjustLinesFromAnchorPoints(fieldAfter, allLines, afterFieldSymbol, setLinePoint)
  }
}

export function _setPropertyEditor_field_rotationInDegree(fieldId: number, rotationInDegree: number): SET_field_rotationInDegreeAction {
  return {
    type: ActionType.SET_field_rotationInDegree,
    rotationInDegree,
    fieldId
  }
}

export function setPropertyEditor_field_rotationInDegree(fieldId: number, rotationInDegree: number): MultiActions {
  return (dispatch, getState) => {

    dispatch(_setPropertyEditor_field_rotationInDegree(fieldId, rotationInDegree))

    const fieldAfter = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldAfter === undefined) {
      Logger.fatal('[internal] could not find the fieldAfter')
      return
    }

    const afterFieldSymbol = fieldAfter.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldAfter.createdFromSymbolGuid)

    if (afterFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the afterFieldSymbol')
      return
    }

    const allLines = getState().tileEditorLineShapeState.present
    const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))
    adjustLinesFromAnchorPoints(fieldAfter, allLines, afterFieldSymbol, setLinePoint)

  }
}

export function setPropertyEditor_FieldColor(fieldId: number, color: string): SET_fieldColorAction {
  return {
    type: ActionType.SET_fieldColor,
    color,
    fieldId
  }
}

export function setPropertyEditor_FieldBgColor(fieldId: number, color: string): SET_fieldBgColorAction {
  return {
    type: ActionType.SET_fieldBgColor,
    color,
    fieldId
  }
}

export function setPropertyEditor_FieldVerticalAlign(fieldId: number, verticalAlign: VerticalAlign): SET_fieldVerticalTextAlignAction {
  return {
    type: ActionType.SET_fieldVerticalTextAlign,
    verticalAlign,
    fieldId
  }
}

export function setPropertyEditor_FieldHorizontalAlign(fieldId: number, horizontalAlign: HorizontalAlign): SET_fieldHorizontalTextAlign {
  return {
    type: ActionType.SET_fieldHorizontalTextAlign,
    horizontalAlign,
    fieldId
  }
}


export function setPropertyEditor_FieldCmdText(fieldId: number, cmdText: string): SET_fieldCmdTextAction {
  return {
    type: ActionType.SET_fieldCmdText,
    cmdText,
    fieldId
  }
}

export function setPropertyEditor_FieldCornerRadiusInPx(fieldId: number, cornerRadiusInPx: number): SET_fieldCornerRadiusAction {
  return {
    type: ActionType.SET_fieldCornerRadius,
    cornerRadiusInPx,
    fieldId
  }
}

export function setPropertyEditor_FieldAbsoluteZIndex(fieldId: number, zIndex: number): SET_fieldZIndexAction {
  return {
    type: ActionType.SET_fieldZIndex,
    zIndex,
    fieldId
  }
}

export function _setPropertyEditor_FieldCreatedFromSymbolId(fieldId: number, createdFromSymbolGuid: string | null): SET_fieldCreatedFromSymbolIdAction {
  return {
    type: ActionType.SET_fieldCreatedFromSymbolId,
    createdFromSymbolGuid,
    fieldId
  }
}

export function setPropertyEditor_FieldCreatedFromSymbolId(fieldId: number, createdFromSymbolGuid: string | null): MultiActions {
  return (dispatch, getState) => {


    //but we also need to sync the anchor points!
    //else lines would snap to the old anchor points and not the symbol anchor points...

    const field = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (field === undefined) {
      Logger.fatal('[internal] could not find the fieldBefore')
      return
    }

    const fieldSymbol = createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === createdFromSymbolGuid)

    if (fieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the beforeFieldSymbol')
      return
    }


    if (fieldSymbol) {

      const anchorPointsCopy = fieldSymbol.anchorPoints.map<AnchorPoint>(p => {

        //check if we find anchor points with same coords... and use them as connection to lines

        const fieldAnchorPoints = field.anchorPoints.find(k => k.percentX === p.percentX && k.percentY === p.percentY)

        //symbol anchor point has new pos
        if (!fieldAnchorPoints) return p

        return {
          ...p,
          //it will be the same as symbol field, this is ok because the values should be equal (except for connectedLineTuples)
          //we found an old anchor point by position... take the connected lines
          connectedLineTuples: fieldAnchorPoints.connectedLineTuples
        }
      })

      dispatch(_setPropertyEditor_FieldAnchorPoints(fieldId, anchorPointsCopy))
    } else {
      //disconnect, make new anchor point ids to make id unique in tile
      //field.anchorPoints is in sync with the symbol anchor points so only make a copy of field.anchorPoints here with new unique ids

      const anchorPointsCopy = field.anchorPoints.map<AnchorPoint>(p => {
        return {
          ...p,
          id: getNextShapeId(),
          // connectedLineTuples: p.connectedLineTuples.map(k => k) //connectedLineTuples is not tracked in symbol so it's ok
        }
      })

      dispatch(_setPropertyEditor_FieldAnchorPoints(fieldId, anchorPointsCopy))

    }


    dispatch(_setPropertyEditor_FieldCreatedFromSymbolId(fieldId, createdFromSymbolGuid))


  }
}

export function setPropertyEditor_FieldPadding(fieldId: number, paddingTop: number, paddingRight: number, paddingBottom: number, paddingLeft: number): SET_fieldPaddingAction {
  return {
    type: ActionType.SET_fieldPadding,
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingBottom,
    fieldId
  }
}

export function _setPropertyEditor_FieldAnchorPoints(fieldId: number, anchorPoints: ReadonlyArray<AnchorPoint>): SET_fieldAnchorPointsAction {
  return {
    type: ActionType.SET_fieldAnchorPoints,
    anchorPoints,
    fieldId
  }
}

export function setPropertyEditor_FieldAnchorPoints(fieldId: number, anchorPoints: ReadonlyArray<AnchorPoint>, adjustLinePointPositions: boolean): MultiActions {
  return (dispatch, getState) => {


    dispatch(_setPropertyEditor_FieldAnchorPoints(fieldId, anchorPoints))

    const fieldAfter = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldAfter === undefined) {
      Logger.fatal('[internal] could not find the fieldBefore')
      return
    }


    const afterFieldSymbol = fieldAfter.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldAfter.createdFromSymbolGuid)

    if (afterFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the beforeFieldSymbol')
      return
    }


    if (!adjustLinePointPositions) return

    const allLines = getState().tileEditorLineShapeState.present

    const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))
    adjustLinesFromAnchorPoints(fieldAfter, allLines, afterFieldSymbol, setLinePoint)

  }
}

export function setPropertyEditor_fieldBorderColor(fieldId: number, borderColor: string): SET_fieldBorderColorAction {
  return {
    type: ActionType.SET_fieldBorderColor,
    borderColor,
    fieldId
  }
}

export function setPropertyEditor_fieldBorderSizeInPx(fieldId: number, borderSizeInPx: number): SET_fieldBorderSizeInPxAction {
  return {
    type: ActionType.SET_fieldBorderSizeInPx,
    borderSizeInPx,
    fieldId
  }
}

export function setPropertyEditor_fieldFontName(fieldId: number, fontName: string): SET_fieldFontNameAction {
  return {
    type: ActionType.SET_fieldFontName,
    fontName,
    fieldId
  }
}

export function setPropertyEditor_fieldFontSizeInPx(fieldId: number, fontSizeInPx: number): SET_fieldFontSizeInPxAction {
  return {
    type: ActionType.SET_fieldFontSizeInPx,
    fontSizeInPx,
    fieldId
  }
}

export function setPropertyEditor_field_isFontBold(fieldId: number, isFontBold: boolean): SET_field_isFontBoldAction {
  return {
    type: ActionType.SET_field_isFontBold,
    isFontBold,
    fieldId
  }
}

export function setPropertyEditor_field_isFontItalic(fieldId: number, isFontItalic: boolean): SET_field_isFontItalicAction {
  return {
    type: ActionType.SET_field_isFontItalic,
    isFontItalic,
    fieldId
  }
}

export function setPropertyEditor_field_backgroundImgGuid(fieldId: number, backgroundImgGuid: string): SET_fieldBackgroundImgGuidAction {
  return {
    type: ActionType.SET_field_backgroundImgGuid,
    backgroundImgGuid,
    fieldId
  }
}


export function edit_fieldShapeUndo(): Edit_fieldShapeUndo {
  return {
    type: UndoFieldShapeType.undo
  }
}

export function edit_fieldShapeRedo(): Edit_fieldShapeRedo {
  return {
    type: UndoFieldShapeType.redo
  }
}


//--- helpers

/**
 * updates the lines connected to the field (the field is connected to a symbol and we changed the symbol width)
 * @param fieldShape
 * @param fieldSymbol
 * @param allLines
 * @param oldSymbolWidth
 * @param newSymbolWidth
 * @param tileGuide
 */
export function adjustLinesFromAnchorPointsFromFieldSymbolChangedWidth(fieldShape: FieldShape, fieldSymbol: FieldSymbol,
                                                                       allLines: ReadonlyArray<LineShape> | null, tileGuide: string | null, newSymbolWidth: number): MultiActions {
  return (dispatch, getState) => {

    const afterFieldSymbol: FieldSymbol = {
      ...fieldSymbol,
      width: newSymbolWidth
    }

    allLines = allLines !== null ? allLines : getState().tileEditorLineShapeState.present

    if (tileGuide !== null) {
      //update tile that we might now editing right now...
      const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(set_LinePointNewPosAction(tileGuide, lineId, oldPointId, newPointPos))
      adjustLinesFromAnchorPoints(fieldShape, allLines, afterFieldSymbol, setLinePoint)
    } else {
      const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))
      adjustLinesFromAnchorPoints(fieldShape, allLines, afterFieldSymbol, setLinePoint)
    }

  }
}

/**
 * updates the lines connected to the field (the field is connected to a symbol and we changed the symbol width)
 * @param fieldShape
 * @param fieldSymbol
 * @param allLines
 * @param tileGuide
 * @param oldSymbolHeight
 * @param newSymbolHeight
 */
export function adjustLinesFromAnchorPointsFromFieldSymbolChangedHeight(fieldShape: FieldShape, fieldSymbol: FieldSymbol, allLines: ReadonlyArray<LineShape> | null, tileGuide: string | null, newSymbolHeight: number): MultiActions {
  return (dispatch, getState) => {


    const afterFieldSymbol: FieldSymbol = {
      ...fieldSymbol,
      height: newSymbolHeight,
    }

    allLines = allLines !== null ? allLines : getState().tileEditorLineShapeState.present

    if (tileGuide !== null) {
      //update tile that we might now editing right now...
      const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(set_LinePointNewPosAction(tileGuide, lineId, oldPointId, newPointPos))
      adjustLinesFromAnchorPoints(fieldShape, allLines, afterFieldSymbol, setLinePoint)
    } else {
      const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))
      adjustLinesFromAnchorPoints(fieldShape, allLines, afterFieldSymbol, setLinePoint)
    }


  }
}

/**
 * updates the lines connected to the field (the field is connected to a symbol and we changed the symbol rotation)
 * @param fieldShape
 * @param fieldSymbol
 * @param allLines
 * @param tileGuide
 * @param oldSymbolRotation
 * @param newSymbolRotation
 */
export function adjustLinesFromAnchorPointsFromFieldSymbolChangedRotation(fieldShape: FieldShape, fieldSymbol: FieldSymbol, allLines: ReadonlyArray<LineShape> | null, tileGuide: string | null, newSymbolRotation: number): MultiActions {
  return (dispatch, getState) => {


    const afterFieldSymbol: FieldSymbol = {
      ...fieldSymbol,
      rotationInDegree: newSymbolRotation
    }

    allLines = allLines !== null ? allLines : getState().tileEditorLineShapeState.present

    if (tileGuide !== null) {
      //update tile that we might now editing right now...
      const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(set_LinePointNewPosAction(tileGuide, lineId, oldPointId, newPointPos))
      adjustLinesFromAnchorPoints(fieldShape, allLines, afterFieldSymbol, setLinePoint)

    } else {
      const setLinePoint = (lineId: number, oldPointId: number, newPointPos: PlainPoint) => dispatch(_setLinePointNewPos(lineId, oldPointId, newPointPos))
      adjustLinesFromAnchorPoints(fieldShape, allLines, afterFieldSymbol, setLinePoint)
    }

  }
}

