import {
  ActionType,
  Edit_fieldSymbolRedo,
  Edit_fieldSymbolUndo,
  SET_fieldSymbol_anchorPointsAction,
  SET_fieldSymbol_backgroundImgGuidAction,
  SET_fieldSymbol_bgColorAction,
  SET_fieldSymbol_borderColorAction,
  SET_fieldSymbol_borderSizeInPxAction,
  SET_fieldSymbol_cmdTextAction,
  SET_fieldSymbol_colorAction,
  SET_fieldSymbol_cornerRadiusInPxAction,
  SET_fieldSymbol_displayIndexAction,
  SET_fieldSymbol_displayNameAction,
  SET_fieldSymbol_fontNameAction,
  SET_fieldSymbol_fontSizeInPxAction,
  SET_fieldSymbol_heightAction,
  SET_fieldSymbol_horizontalAlignAction,
  SET_fieldSymbol_isFontBoldAction,
  SET_fieldSymbol_isFontItalicAction, SET_fieldSymbol_overwriteBackgroundImageAction,
  SET_fieldSymbol_overwriteBgColorAction,
  SET_fieldSymbol_overwriteBorderColorAction,
  SET_fieldSymbol_overwriteBorderSizeInPxAction,
  SET_fieldSymbol_overwriteCmdTextAction,
  SET_fieldSymbol_overwriteColorAction,
  SET_fieldSymbol_overwriteCornerRadiusAction,
  SET_fieldSymbol_overwriteFontDecorationAction,
  SET_fieldSymbol_overwriteFontNameAction,
  SET_fieldSymbol_overwriteFontSizeInPxAction,
  SET_fieldSymbol_overwriteHeightAction,
  SET_fieldSymbol_overwriteHorizontalTextAlignAction,
  SET_fieldSymbol_overwritePaddingAction,
  SET_fieldSymbol_overwriteRotationInDegAction,
  SET_fieldSymbol_overwriteTextAction,
  SET_fieldSymbol_overwriteVerticalTextAlignAction,
  SET_fieldSymbol_overwriteWidthAction,
  SET_fieldSymbol_paddingAction,
  SET_fieldSymbol_rotationInDegreeAction,
  SET_fieldSymbol_textAction,
  SET_fieldSymbol_verticalAlignAction,
  SET_fieldSymbol_widthAction,
  SET_fieldSymbolsAction,
  UndoFieldSymbolType
} from "./fieldSymbolReducer";
import {AnchorPoint, FieldSymbol, HorizontalAlign, VerticalAlign} from "../../../../../types/drawing";
import {MultiActions} from "../../../../../types/ui";
import {
  setPropertyEditor_FieldAnchorPoints,
  setPropertyEditor_FieldCreatedFromSymbolId
} from "../../fieldProperties/actions";
import {swapDisplayIndexWithGuid} from "../../../../../helpers/someIndexHelper";
import {Logger} from "../../../../../helpers/logger";
import {remove_fieldSymbolGlobal} from "../../../world/tileLibrary/actions";


export function set_fieldSymbols(fieldSymbols: ReadonlyArray<FieldSymbol>): SET_fieldSymbolsAction {
  return {
    type: ActionType.SET_fieldSymbols,
    fieldSymbols,
  }
}

//we need an extra function to set all dependent fields symbol ref to null
export function remove_fieldSymbol(symbol: FieldSymbol, allFieldSymbols: ReadonlyArray<FieldSymbol>): MultiActions {
  return (dispatch, getState) => {

    swapDisplayIndexWithGuid(
      symbol,
      symbol.displayIndex + 1,
      false,
      true,
      allFieldSymbols.length,
      allFieldSymbols,
      (objId: string, newDisplayIndex: number) => dispatch(set_fieldSymbol_displayIndex(objId, newDisplayIndex))
    )

    // this updates the shapes in the library but the current tile in the editor is a copy...
    // so we need to update it too (see below)
    dispatch(remove_fieldSymbolGlobal(symbol.guid))

    //we need to get the new state because we changed the display index...
    const newList = getState().fieldSymbolState.present.filter(p => p.guid !== symbol.guid)

    for (const fieldShape  of getState().tileEditorFieldShapesState.present) {
      if (fieldShape.createdFromSymbolGuid === symbol.guid) {
        dispatch(setPropertyEditor_FieldCreatedFromSymbolId(fieldShape.id, null))
      }
    }

    dispatch(set_fieldSymbols(newList))
  }
}


export function set_fieldSymbol_text(fieldSymbolGuid: string, text: string): SET_fieldSymbol_textAction {
  return {
    type: ActionType.SET_fieldSymbol_text,
    fieldSymbolGuid,
    text
  }
}

export function _set_fieldSymbol_width(fieldSymbolGuid: string, width: number): SET_fieldSymbol_widthAction {
  return {
    type: ActionType.SET_fieldSymbol_width,
    fieldSymbolGuid,
    width
  }
}

export function set_fieldSymbol_width(fieldSymbolGuid: string, width: number): MultiActions {
  return (dispatch, getState) => {

    //we only set the symbol props ... the field values are not touched ... we only draw the fields like the symbol

    dispatch(_set_fieldSymbol_width(fieldSymbolGuid, width))
  }
}

export function _set_fieldSymbol_height(fieldSymbolGuid: string, height: number): SET_fieldSymbol_heightAction {
  return {
    type: ActionType.SET_fieldSymbol_height,
    fieldSymbolGuid,
    height
  }
}

export function set_fieldSymbol_height(fieldSymbolGuid: string, height: number): MultiActions {
  return (dispatch, getState) => {

    //we only set the symbol props ... the field values are not touched ... we only draw the fields like the symbol
    dispatch(_set_fieldSymbol_height(fieldSymbolGuid, height))
  }
}

export function set_fieldSymbol_color(fieldSymbolGuid: string, color: string): SET_fieldSymbol_colorAction {
  return {
    type: ActionType.SET_fieldSymbol_color,
    fieldSymbolGuid,
    color
  }
}

export function set_fieldSymbol_bgColor(fieldSymbolGuid: string, bgColor: string): SET_fieldSymbol_bgColorAction {
  return {
    type: ActionType.SET_fieldSymbol_bgColor,
    fieldSymbolGuid,
    bgColor
  }
}


export function set_fieldSymbol_verticalAlign(fieldSymbolGuid: string, verticalAlign: VerticalAlign): SET_fieldSymbol_verticalAlignAction {
  return {
    type: ActionType.SET_fieldSymbol_verticalAlign,
    fieldSymbolGuid,
    verticalTextAlign: verticalAlign
  }
}

export function set_fieldSymbol_horizontalAlign(fieldSymbolGuid: string, horizontalAlign: HorizontalAlign): SET_fieldSymbol_horizontalAlignAction {
  return {
    type: ActionType.SET_fieldSymbol_horizontalAlign,
    fieldSymbolGuid,
    horizontalTextAlign: horizontalAlign
  }
}

export function set_fieldSymbol_cornerRadiusInPx(fieldSymbolGuid: string, cornerRadiusInPx: number): SET_fieldSymbol_cornerRadiusInPxAction {
  return {
    type: ActionType.SET_fieldSymbol_cornerRadiusInPx,
    fieldSymbolGuid,
    cornerRadiusInPx
  }
}

export function set_fieldSymbol_cmdText(fieldSymbolGuid: string, cmdText: string): SET_fieldSymbol_cmdTextAction {
  return {
    type: ActionType.SET_fieldSymbol_cmdText,
    fieldSymbolGuid,
    cmdText
  }
}

export function set_fieldSymbol_displayIndex(fieldSymbolGuid: string, displayIndex: number): SET_fieldSymbol_displayIndexAction {
  return {
    type: ActionType.SET_fieldSymbol_displayIndex,
    fieldSymbolGuid: fieldSymbolGuid,
    displayIndex
  }
}

export function set_fieldSymbol_padding(fieldSymbolGuid: string, paddingTop: number, paddingRight: number, paddingBottom: number, paddingLeft: number): SET_fieldSymbol_paddingAction {
  return {
    type: ActionType.SET_fieldSymbol_padding,
    fieldSymbolGuid,
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingBottom,
  }
}

export function _set_fieldSymbol_anchorPoints(fieldSymbolGuid: string, anchorPoints: ReadonlyArray<AnchorPoint>): SET_fieldSymbol_anchorPointsAction {
  return {
    type: ActionType.SET_fieldSymbol_anchorPoints,
    fieldSymbolGuid,
    anchorPoints
  }
}

export function set_fieldSymbol_anchorPoints(fieldSymbolGuid: string, anchorPoints: ReadonlyArray<AnchorPoint>): MultiActions {
  return (dispatch, getState) => {


    dispatch(_set_fieldSymbol_anchorPoints(fieldSymbolGuid, anchorPoints))

    //we need to keep symbol and fields anchor points in sync else the connected lines don't work properly...

    const allFields = getState().tileEditorFieldShapesState.present

    for (let i = 0; i < allFields.length; i++) {
      const field = allFields[i]

      if (field.createdFromSymbolGuid !== fieldSymbolGuid) continue

      //copy the anchor points from symbol to field but keep connected lines
      const newAnchorPoints = anchorPoints.map(p => {

        const fieldAnchorPoint = field.anchorPoints.find(k => k.id === p.id)

        if (!fieldAnchorPoint) return p

        return {
          ...p,
          connectedLineTuples: fieldAnchorPoint.connectedLineTuples
        }
      })

      dispatch(setPropertyEditor_FieldAnchorPoints(field.id, newAnchorPoints, true))

    }

  }
}

export function set_fieldSymbol_displayName(fieldSymbolGuid: string, displayName: string): SET_fieldSymbol_displayNameAction {
  return {
    type: ActionType.SET_fieldSymbol_displayName,
    fieldSymbolGuid,
    displayName
  }
}


export function set_fieldSymbol_borderColor(fieldSymbolGuid: string, borderColor: string): SET_fieldSymbol_borderColorAction {
  return {
    type: ActionType.SET_fieldSymbol_borderColor,
    fieldSymbolGuid,
    borderColor
  }
}

export function set_fieldSymbol_borderSizeInPx(fieldSymbolGuid: string, borderSizeInPx: number): SET_fieldSymbol_borderSizeInPxAction {
  return {
    type: ActionType.SET_fieldSymbol_borderSizeInPx,
    fieldSymbolGuid,
    borderSizeInPx
  }
}

export function set_fieldSymbol_fontName(fieldSymbolGuid: string, fontName: string): SET_fieldSymbol_fontNameAction {
  return {
    type: ActionType.SET_fieldSymbol_fontName,
    fieldSymbolGuid,
    fontName
  }
}

export function set_fieldSymbol_fontSizeInPx(fieldSymbolGuid: string, fontSizeInPx: number): SET_fieldSymbol_fontSizeInPxAction {
  return {
    type: ActionType.SET_fieldSymbol_fontSizeInPx,
    fieldSymbolGuid,
    fontSizeInPx
  }
}


export function set_fieldSymbol_isFontBold(fieldSymbolGuid: string, isFontBold: boolean): SET_fieldSymbol_isFontBoldAction {
  return {
    type: ActionType.SET_fieldSymbol_isFontBold,
    fieldSymbolGuid,
    isFontBold
  }
}

export function set_fieldSymbol_isFontItalic(fieldSymbolGuid: string, isFontItalic: boolean): SET_fieldSymbol_isFontItalicAction {
  return {
    type: ActionType.SET_fieldSymbol_isFontItalic,
    fieldSymbolGuid,
    isFontItalic
  }
}

export function set_fieldSymbol_rotationInDegree(fieldSymbolGuid: string, rotationInDegree: number): SET_fieldSymbol_rotationInDegreeAction {
  return {
    type: ActionType.SET_fieldSymbol_rotationInDegree,
    fieldSymbolGuid,
    rotationInDegree
  }
}

export function set_fieldSymbol_backgroundImgGuid(fieldSymbolGuid: string, backgroundImgGuid: string): SET_fieldSymbol_backgroundImgGuidAction {
  return {
    type: ActionType.SET_fieldSymbol_backgroundImgGuid,
    fieldSymbolGuid,
    backgroundImgGuid
  }
}


export function edit_fieldSymbolUndo(): Edit_fieldSymbolUndo {
  return {
    type: UndoFieldSymbolType.undo
  }
}

export function edit_fieldSymbolRedo(): Edit_fieldSymbolRedo {
  return {
    type: UndoFieldSymbolType.redo
  }
}


export function set_fieldSymbol_overwriteCmdText(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteCmdTextAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteCmdText,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteWidth(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteWidthAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteWidth,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteHeight(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteHeightAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteHeight,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteColor(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteColorAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteColor,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteBgColor(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteBgColorAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteBgColor,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteBorderColor(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteBorderColorAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteBorderColor,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteBorderSizeInPx(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteBorderSizeInPxAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteBorderSizeInPx,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteFontName(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteFontNameAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteFontName,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteFontSizeInPx(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteFontSizeInPxAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteFontSizeInPx,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteFontDecoration(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteFontDecorationAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteFontDecoration,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteText(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteTextAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteText,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteHorizontalTextAlign(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteHorizontalTextAlignAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteHorizontalTextAlign,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteVerticalTextAlign(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteVerticalTextAlignAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteVerticalTextAlign,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwritePadding(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwritePaddingAction {
  return {
    type: ActionType.SET_fieldSymbol_overwritePadding,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteCornerRadius(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteCornerRadiusAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteCornerRadius,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteRotationInDeg(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteRotationInDegAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteRotationInDeg,
    overwrite,
    fieldSymbolGuid
  }
}

export function set_fieldSymbol_overwriteBackgroundImage(fieldSymbolGuid: string, overwrite: boolean): SET_fieldSymbol_overwriteBackgroundImageAction {
  return {
    type: ActionType.SET_fieldSymbol_overwriteBackgroundImage,
    overwrite,
    fieldSymbolGuid
  }
}
