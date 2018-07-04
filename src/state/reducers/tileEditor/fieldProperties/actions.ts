import {AnchorPoint, FieldShape, HorizontalAlign, VerticalAlign} from "../../../../types/drawing";
import {
  ActionBase,
  ActionType,
  ADD_fieldShapeAction, CLEAR_fieldShape_connectedLinesAction,
  Edit_fieldShapeRedo,
  Edit_fieldShapeUndo,
  REMOVE_fieldShapeAction,
  SET_connectedLinesThroughAnchorsAction,
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

    const fieldBefore = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldBefore === undefined) {
      Logger.fatal('[internal] could not find the fieldBefore')
      return
    }

    const beforeFieldSymbol = fieldBefore.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldBefore.createdFromSymbolGuid)

    if (beforeFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the beforeFieldSymbol')
      return
    }

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

    adjustLinesFromAnchorPoints(fieldBefore, fieldAfter, beforeFieldSymbol, afterFieldSymbol)
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

    const fieldBefore = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldBefore === undefined) {
      Logger.fatal('[internal] could not find the fieldBefore')
      return
    }

    const beforeFieldSymbol = fieldBefore.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldBefore.createdFromSymbolGuid)

    if (beforeFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the beforeFieldSymbol')
      return
    }

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

    adjustLinesFromAnchorPoints(fieldBefore, fieldAfter, beforeFieldSymbol, afterFieldSymbol)
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

    const fieldBefore = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldBefore === undefined) {
      Logger.fatal('[internal] could not find the beforeField')
      return
    }

    const beforeFieldSymbol = fieldBefore.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldBefore.createdFromSymbolGuid)

    if (beforeFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the beforeFieldSymbol')
      return
    }

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

    adjustLinesFromAnchorPoints(fieldBefore, fieldAfter, beforeFieldSymbol, afterFieldSymbol)
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

    const fieldBefore = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldBefore === undefined) {
      Logger.fatal('[internal] could not find the fieldBefore')
      return
    }

    const beforeFieldSymbol = fieldBefore.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldBefore.createdFromSymbolGuid)

    if (beforeFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the beforeFieldSymbol')
      return
    }

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

    adjustLinesFromAnchorPoints(fieldBefore, fieldAfter, beforeFieldSymbol, afterFieldSymbol)
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

    const fieldBefore = getState().tileEditorFieldShapesState.present.find(p => p.id === fieldId)

    if (fieldBefore === undefined) {
      Logger.fatal('[internal] could not find the fieldBefore')
      return
    }

    const beforeFieldSymbol = fieldBefore.createdFromSymbolGuid === null
      ? null
      : getState().fieldSymbolState.present.find(p => p.guid === fieldBefore.createdFromSymbolGuid)

    if (beforeFieldSymbol === undefined) {
      Logger.fatal('[internal] could not find the beforeFieldSymbol')
      return
    }

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

    adjustLinesFromAnchorPoints(fieldBefore, fieldAfter, beforeFieldSymbol, afterFieldSymbol)

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


/**
 *
 * @param {number} fieldId
 * @param {number} lineId
 * @param {ReadonlyArray<number>} connectedLinesThroughAnchors null or empty list will delete the connection
 * @returns {SET_connectedLinesThroughAnchorsAction}
 */
export function setPropertyEditor_FieldConnectedLinesThroughAnchors(fieldId: number, lineId: number, connectedLinesThroughAnchors: ReadonlyArray<number> | null): SET_connectedLinesThroughAnchorsAction {
  return {
    type: ActionType.SET_connectedLinesThroughAnchors,
    lineId,
    connectedLinesThroughAnchors,
    fieldId
  }
}

export function setPropertyEditor_FieldCreatedFromSymbolId(fieldId: number, createdFromSymbolGuid: string | null): SET_fieldCreatedFromSymbolIdAction {
  return {
    type: ActionType.SET_fieldCreatedFromSymbolId,
    createdFromSymbolGuid,
    fieldId
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

export function setPropertyEditor_FieldAnchorPoints(fieldId: number, anchorPoints: ReadonlyArray<AnchorPoint>): MultiActions {
  return (dispatch, getState) => {


    // const fieldBefore = getState().tileEditorFieldShapesState.find(p => p.id === fieldId)
    // const beforeFieldSymbol = fieldBefore.createdFromSymbolGuid === null
    //   ? null
    //   : getState().fieldSymbolState.find(p => p.guid === fieldBefore.createdFromSymbolGuid)


    dispatch(_setPropertyEditor_FieldAnchorPoints(fieldId, anchorPoints))

    // const fieldAfter = getState().tileEditorFieldShapesState.find(p => p.id === fieldId)
    // const afterFieldSymbol = fieldAfter.createdFromSymbolGuid === null
    //   ? null
    //   : getState().fieldSymbolState.find(p => p.guid === fieldAfter.createdFromSymbolGuid)
    //
    // adjustLinesFromAnchorPoints(fieldBefore, fieldAfter, beforeFieldSymbol, afterFieldSymbol)
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


