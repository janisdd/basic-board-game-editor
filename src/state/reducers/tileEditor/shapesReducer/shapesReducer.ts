import {notExhaustive} from "../../_notExhausiveHelper";
import {
  ActionType as FieldShapedActionTypes,
  AllActions as AllFieldShapeActions, incFieldHistoryId,
} from '../fieldProperties/fieldPropertyReducer'
import {
  ActionType as ImgShapedActionTypes,
  AllActions as AllImgShapeActions, incImgHistoryId, SET_image_isMouseSelectionDisabledAction,
} from '../imgProperties/imgPropertyReducer'
import {
  ActionType as LineShapedActionTypes,
  AllActions as AllLineShapeActions, incLineHistoryId,
} from '../lineProperties/linePropertyReducer'
import undoable, {ActionTypes, groupByActionTypes} from "redux-undo";
import {clearTileEditorEditShapesType, undoShapeLimit} from "../../../../constants";

import {
  ActionType as FieldSymbolActionTypes,
  AllActions as AllFieldSymbolActions,
  incFieldSymbolHistoryId
} from '../symbols/fieldSymbols/fieldSymbolReducer'
import {
  ActionType as ImgSymbolActionTypes,
  AllActions as AllImgSymbolActions,
  incImgSymbolHistoryId
} from '../symbols/imgSymbols/imgSymbolReducer'
import {
  ActionType as LineSymbolActionTypes,
  AllActions as AllLineSymbolActions,
  incLineSymbolHistoryId
} from '../symbols/lineSymbols/lineSymbolReducer'


export enum LastEditedShapeType {
  fieldShape = 0,
  imgShape = 1,
  lineShape = 2,

  fieldSymbol = 3,
  imgSymbol = 4,
  lineSymbol = 5
}

export type State = {
  /**
   * used to know which history we need to undo
   */
  readonly lastEditedShapeType: LastEditedShapeType
}

export const initial: State = {
  lastEditedShapeType: LastEditedShapeType.fieldShape
}

export enum ActionType {
  RESET = 'shapesReducer_reset'
}

/**
 * @see clearTileEditorEditShapesType
 */
interface ClearAction {
  type: ActionType.RESET
}

export type AllActions =
  AllFieldShapeActions
  | AllImgShapeActions
  | AllLineShapeActions
  | AllFieldSymbolActions
  | AllImgSymbolActions
  | AllLineSymbolActions
  | ClearAction


export function _reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.RESET: {
      return {
        ...state,
        lastEditedShapeType: 0
      }
    }

    case FieldSymbolActionTypes.SET_fieldSymbols:
    case FieldSymbolActionTypes.SET_fieldSymbol_text:
    case FieldSymbolActionTypes.SET_fieldSymbol_width:
    case FieldSymbolActionTypes.SET_fieldSymbol_height:
    case FieldSymbolActionTypes.SET_fieldSymbol_color:
    case FieldSymbolActionTypes.SET_fieldSymbol_bgColor:
    case FieldSymbolActionTypes.SET_fieldSymbol_verticalAlign:
    case FieldSymbolActionTypes.SET_fieldSymbol_horizontalAlign:
    case FieldSymbolActionTypes.SET_fieldSymbol_cornerRadiusInPx:
    case FieldSymbolActionTypes.SET_fieldSymbol_cmdText:
    case FieldSymbolActionTypes.SET_fieldSymbol_displayIndex:
    case FieldSymbolActionTypes.SET_fieldSymbol_padding:
    case FieldSymbolActionTypes.SET_fieldSymbol_borderColor:
    case FieldSymbolActionTypes.SET_fieldSymbol_borderSizeInPx:
    case FieldSymbolActionTypes.SET_fieldSymbol_fontName:
    case FieldSymbolActionTypes.SET_fieldSymbol_fontSizeInPx:
    case FieldSymbolActionTypes.SET_fieldSymbol_anchorPoints:
    case FieldSymbolActionTypes.SET_fieldSymbol_displayName:
    case FieldSymbolActionTypes.SET_fieldSymbol_isFontBold:
    case FieldSymbolActionTypes.SET_fieldSymbol_isFontItalic:
    case FieldSymbolActionTypes.SET_fieldSymbol_rotationInDegree:
    case FieldSymbolActionTypes.SET_fieldSymbol_backgroundImgGuid:
    case FieldSymbolActionTypes.RESET: {
      if (state.lastEditedShapeType !== LastEditedShapeType.fieldSymbol) {
        incFieldSymbolHistoryId()
      }

      return {
        ...state,
        lastEditedShapeType: LastEditedShapeType.fieldSymbol
      }
    }

    case ImgSymbolActionTypes.SET_imgSymbols:
    case ImgSymbolActionTypes.SET_imgSymbol_width:
    case ImgSymbolActionTypes.SET_imgSymbol_height:
    case ImgSymbolActionTypes.SET_imgSymbol_rotation:
    case ImgSymbolActionTypes.SET_imgSymbol_imgStorageGuid:
    case ImgSymbolActionTypes.SET_imgSymbol_displayIndex:
    case ImgSymbolActionTypes.SET_imgSymbol_displayName:
    case ImgSymbolActionTypes.SET_imgSymbol_skewX:
    case ImgSymbolActionTypes.SET_imgSymbol_skewY:
    case ImgSymbolActionTypes.SET_imgSymbol_isMouseSelectionDisabled:
    case ImgSymbolActionTypes.RESET: {
      if (state.lastEditedShapeType !== LastEditedShapeType.imgSymbol) {
        incImgSymbolHistoryId()
      }

      return {
        ...state,
        lastEditedShapeType: LastEditedShapeType.imgSymbol
      }
    }

    case LineSymbolActionTypes.SET_lineSymbols:
    case LineSymbolActionTypes.SET_lineSymbol_color:
    case LineSymbolActionTypes.SET_lineSymbol_thicknessInPx:
    case LineSymbolActionTypes.SET_lineSymbol_dashArray:
    case LineSymbolActionTypes.SET_lineSymbol_hasStartArrow:
    case LineSymbolActionTypes.SET_lineSymbol_hasEndArrow:
    case LineSymbolActionTypes.SET_lineSymbol_displayIndex:
    case LineSymbolActionTypes.SET_lineSymbol_arrowWidth:
    case LineSymbolActionTypes.SET_lineSymbol_arrowHeight:
    case LineSymbolActionTypes.SET_lineSymbol_displayName:
    case LineSymbolActionTypes.RESET: {
      if (state.lastEditedShapeType !== LastEditedShapeType.lineSymbol) {
        incLineSymbolHistoryId()
      }

      return {
        ...state,
        lastEditedShapeType: LastEditedShapeType.lineSymbol
      }
    }

    case FieldShapedActionTypes.ADD_fieldShape:
    case FieldShapedActionTypes.REMOVE_fieldShape:
    case FieldShapedActionTypes.SET_fieldsArray:
    case FieldShapedActionTypes.SET_fieldText:
    case FieldShapedActionTypes.SET_fieldX:
    case FieldShapedActionTypes.SET_fieldY:
    case FieldShapedActionTypes.SET_fieldWidth:
    case FieldShapedActionTypes.SET_fieldHeight:
    case FieldShapedActionTypes.SET_fieldColor:
    case FieldShapedActionTypes.SET_fieldBgColor:
    case FieldShapedActionTypes.SET_fieldVerticalTextAlign:
    case FieldShapedActionTypes.SET_fieldCmdText:
    case FieldShapedActionTypes.SET_fieldHorizontalTextAlign:
    case FieldShapedActionTypes.SET_fieldCornerRadius:
    case FieldShapedActionTypes.SET_fieldZIndex:
    case FieldShapedActionTypes.SET_connectedLinesThroughAnchors:
    case FieldShapedActionTypes.SET_fieldCreatedFromSymbolId:
    case FieldShapedActionTypes.SET_fieldPadding:
    case FieldShapedActionTypes.SET_fieldBorderColor:
    case FieldShapedActionTypes.SET_fieldBorderSizeInPx:
    case FieldShapedActionTypes.SET_fieldAnchorPoints:
    case FieldShapedActionTypes.SET_fieldFontName:
    case FieldShapedActionTypes.SET_fieldFontSizeInPx:
    case FieldShapedActionTypes.SET_field_isFontBold:
    case FieldShapedActionTypes.SET_field_isFontItalic:
    case FieldShapedActionTypes.SET_field_rotationInDegree:
    case FieldShapedActionTypes.SET_field_backgroundImgGuid:
    case FieldShapedActionTypes.RESET: {

      if (state.lastEditedShapeType !== LastEditedShapeType.fieldShape) {
        incFieldHistoryId()
      }


      return {
        ...state,
        lastEditedShapeType: LastEditedShapeType.fieldShape
      }
    }

    case ImgShapedActionTypes.SET_tileImgArray:
    case ImgShapedActionTypes.ADD_ImageShape:
    case ImgShapedActionTypes.REMOVE_ImageShape:
    case ImgShapedActionTypes.SET_imageX:
    case ImgShapedActionTypes.SET_imageY:
    case ImgShapedActionTypes.SET_imageWidth:
    case ImgShapedActionTypes.SET_imageHeight:
    case ImgShapedActionTypes.SET_imageRotation:
    case ImgShapedActionTypes.SET_imageZIndex:
    case ImgShapedActionTypes.SET_imageCreatedFromSymbolId:
    case ImgShapedActionTypes.SET_imageImgGuid:
    case ImgShapedActionTypes.SET_image_skewX:
    case ImgShapedActionTypes.SET_image_skewY:
    case ImgShapedActionTypes.SET_image_isMouseSelectionDisabled:
    case ImgShapedActionTypes.RESET: {

      if (state.lastEditedShapeType !== LastEditedShapeType.imgShape) {
        incImgHistoryId()
      }
      return {
        ...state,
        lastEditedShapeType: LastEditedShapeType.imgShape
      }
    }


    case LineShapedActionTypes.SET_lineArray:
    case LineShapedActionTypes.ADD_LineShape:
    case LineShapedActionTypes.REMOVE_LineShape:
    case LineShapedActionTypes.REMOVE_PointFromLineShape:
    case LineShapedActionTypes.SET_selectedLinePointNewPos:
    case LineShapedActionTypes.SET_linePointCurveMode:
    case LineShapedActionTypes.SET_lineColor:
    case LineShapedActionTypes.SET_lineThicknessInPx:
    case LineShapedActionTypes.SET_lineDashArray:
    case LineShapedActionTypes.ADD_PointToLineShape:
    case LineShapedActionTypes.SET_lineHasStartArrow:
    case LineShapedActionTypes.SET_lineHasEndArrow:
    case LineShapedActionTypes.SET_lineZIndex:
    case LineShapedActionTypes.SET_lineCreatedFromSymbolId:
    case LineShapedActionTypes.SET_lineArrowHeight:
    case LineShapedActionTypes.SET_lineArrowWidth:
    case LineShapedActionTypes.RESET: {

      if (state.lastEditedShapeType !== LastEditedShapeType.lineShape) {
        incLineHistoryId()
      }

      return {
        ...state,
        lastEditedShapeType: LastEditedShapeType.lineShape
      }
    }


    default:
      notExhaustive(action)
      return state
  }
}


export enum UndoType {
  undo = 'shapesReducer_undo',
  redo = 'shapesReducer_redo',
}

export const reducer = undoable(_reducer, {
  limit: undoShapeLimit,
  undoType: UndoType.undo,
  redoType: UndoType.redo,
  clearHistoryType: clearTileEditorEditShapesType,
  groupBy: (action, state) => {

    ///--- field
    if (action.type === FieldShapedActionTypes.SET_fieldX || action.type === FieldShapedActionTypes.SET_fieldY) {
      return FieldShapedActionTypes.SET_fieldX + FieldShapedActionTypes.SET_fieldY
    }

    //not group bools else if we only trigger the bool then we get a undo item with no effect
    //also bad for enums...
    if (action.type === FieldShapedActionTypes.SET_field_isFontItalic
      || action.type === FieldShapedActionTypes.SET_field_isFontBold
      || action.type === FieldShapedActionTypes.SET_fieldHorizontalTextAlign
      || action.type === FieldShapedActionTypes.SET_fieldVerticalTextAlign
      || action.type === FieldShapedActionTypes.SET_connectedLinesThroughAnchors
    ) {
      return null
    }


    //---img

    if (action.type === ImgShapedActionTypes.SET_imageX || action.type === ImgShapedActionTypes.SET_imageY) {
      return ImgShapedActionTypes.SET_imageX + ImgShapedActionTypes.SET_imageY
    }

    //--- line

    if (action.type === LineShapedActionTypes.SET_selectedLinePointNewPos) {
      return LineShapedActionTypes.SET_selectedLinePointNewPos
    }

    //not group bools else if we only trigger the bool then we get a undo item with no effect
    //also bad for enums...
    if (action.type === LineShapedActionTypes.SET_lineHasStartArrow
      || action.type === LineShapedActionTypes.SET_lineHasEndArrow
      || action.type === LineShapedActionTypes.SET_linePointCurveMode
    ) {
      return null
    }

    //--- field symbols
    if (action.type === FieldSymbolActionTypes.SET_fieldSymbol_isFontItalic
      || action.type === FieldSymbolActionTypes.SET_fieldSymbol_isFontBold
      || action.type === FieldSymbolActionTypes.SET_fieldSymbol_horizontalAlign
      || action.type === FieldSymbolActionTypes.SET_fieldSymbol_verticalAlign
    ) {
      return null
    }

    //--- img symbols

    //--- line symbols
    if (action.type === LineSymbolActionTypes.SET_lineSymbol_hasStartArrow
      || action.type === LineSymbolActionTypes.SET_lineSymbol_hasEndArrow
    ) {
      return null
    }

    return action.type
  }

})

// export interface CombinedReducer {
//   fieldShapes: typeof fieldPropertyReducer
//   imgShapes: typeof imgPropertyReducer
//   lineShapes: typeof linePropertyReducer
// }
//
// export const reducer = combineReducers<CombinedReducer>({
//   fieldShapes: fieldPropertyReducer,
//   imgShapes: imgPropertyReducer,
//   lineShapes: linePropertyReducer
// })
