import {Action} from "redux";
import {AnchorPoint, FieldShape, FieldSymbol, HorizontalAlign, VerticalAlign} from "../../../../../types/drawing";
import {notExhaustive} from "../../../_notExhausiveHelper";
import {
  getNextShapeId,
} from "../../fieldProperties/fieldPropertyReducer";
import {replaceProperty, replacePropertyByGuid} from "../../../../../helpers/functionHelpers";
import {
  clearTileEditorEditShapesType, undoShapeLimit
} from "../../../../../constants";
import undoable from "redux-undo";

export type State = ReadonlyArray<FieldSymbol>


const fieldSymbolPresets: ReadonlyArray<FieldSymbol> = [
  // {
  //   guid: getGuid(),
  //   connectedLinesThroughAnchorPoints: [],
  //   anchorPoints: defaultAnchorPoints,
  //   height: 30,
  //   width: 100,
  //   x: symbolPreviewStageXOffset,
  //   y: symbolPreviewStageYOffset,
  //   text: 'Symbol 1',
  //   zIndex: 0,
  //   cornerRadiusInPx: 0,
  //   horizontalTextAlign: HorizontalAlign.center,
  //   verticalTextAlign: VerticalAlign.center,
  //   bgColor: '#dddddd',
  //   color: 'black',
  //   fontName: 'Arial',
  //   fontSizeInPx: 12,
  //   cmdText: null,
  //   createdFromSymbolGuid: null,
  //   isSymbol: true,
  //   padding: defaultPadding,
  //   displayIndex: 0,
  //   displayName: 'normal symbol',
  //   borderSizeInPx: 0,
  //   borderColor: 'black',
  //   isFontBold: false,
  //   isFontItalic: false,
  //   isFontUnderlined: false
  // },
]


export const initial: State = [].concat(fieldSymbolPresets)

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {

  SET_fieldSymbols = 'fieldSymbolReducer_SET_fieldSymbols',

  SET_fieldSymbol_text = 'fieldSymbolReducer_SET_fieldSymbol_text',
  SET_fieldSymbol_width = 'fieldSymbolReducer_SET_fieldSymbol_width',
  SET_fieldSymbol_height = 'fieldSymbolReducer_SET_fieldSymbol_height',
  SET_fieldSymbol_color = 'fieldSymbolReducer_SET_fieldSymbol_color',
  SET_fieldSymbol_bgColor = 'fieldSymbolReducer_SET_fieldSymbol_bgColor',
  SET_fieldSymbol_verticalAlign = 'fieldSymbolReducer_SET_fieldSymbol_verticalAlign',
  SET_fieldSymbol_horizontalAlign = 'fieldSymbolReducer_SET_fieldSymbol_horizontalAlign',
  SET_fieldSymbol_cornerRadiusInPx = 'fieldSymbolReducer_SET_fieldSymbol_cornerRadiusInPx',
  SET_fieldSymbol_cmdText = 'fieldSymbolReducer_SET_fieldSymbol_cmdText',
  SET_fieldSymbol_isFontBold = 'fieldSymbolReducer_SET_fieldSymbol_isFontBold',
  SET_fieldSymbol_isFontItalic = 'fieldSymbolReducer_SET_fieldSymbol_isFontItalic',

  SET_fieldSymbol_padding = 'fieldSymbolReducer_SET_fieldSymbol_padding',
  SET_fieldSymbol_anchorPoints = 'fieldSymbolReducer_SET_fieldSymbol_anchorPoints',

  SET_fieldSymbol_borderColor = 'fieldSymbolReducer_SET_fieldSymbol_borderColor',
  SET_fieldSymbol_borderSizeInPx = 'fieldSymbolReducer_SET_fieldSymbol_borderSizeInPx',

  SET_fieldSymbol_fontName = 'fieldSymbolReducer_SET_fieldSymbol_fontName',
  SET_fieldSymbol_fontSizeInPx = 'fieldSymbolReducer_SET_fieldSymbol_fontSizeInPx',

  SET_fieldSymbol_rotationInDegree = 'fieldSymbolReducer_SET_fieldSymbol_rotationInDegree',

  SET_fieldSymbol_backgroundImgGuid = 'fieldSymbolReducer_SET_fieldSymbol_backgroundImgGuid',

  //for ui ordering
  SET_fieldSymbol_displayIndex = 'fieldSymbolReducer_SET_fieldSymbol_displayIndex',

  SET_fieldSymbol_displayName = 'fieldSymbolReducer_SET_fieldSymbol_displayName',

  SET_fieldSymbol_overwriteCmdText = 'fieldSymbolReducer_SET_fieldSymbol_overwriteCmdText',
  SET_fieldSymbol_overwriteWidth = 'fieldSymbolReducer_SET_fieldSymbol_overwriteWidth',
  SET_fieldSymbol_overwriteHeight = 'fieldSymbolReducer_SET_fieldSymbol_overwriteHeight',
  SET_fieldSymbol_overwriteColor = 'fieldSymbolReducer_SET_fieldSymbol_overwriteColor',
  SET_fieldSymbol_overwriteBgColor = 'fieldSymbolReducer_SET_fieldSymbol_overwriteBgColor',
  SET_fieldSymbol_overwriteBorderColor = 'fieldSymbolReducer_SET_fieldSymbol_overwriteBorderColor',
  SET_fieldSymbol_overwriteBorderSizeInPx = 'fieldSymbolReducer_SET_fieldSymbol_overwriteBorderSizeInPx',
  SET_fieldSymbol_overwriteFontName = 'fieldSymbolReducer_SET_fieldSymbol_overwriteFontName',
  SET_fieldSymbol_overwriteFontSizeInPx = 'fieldSymbolReducer_SET_fieldSymbol_overwriteFontSizeInPx',
  SET_fieldSymbol_overwriteFontDecoration = 'fieldSymbolReducer_SET_fieldSymbol_overwriteFontDecoration',
  SET_fieldSymbol_overwriteText = 'fieldSymbolReducer_SET_fieldSymbol_overwriteText',
  SET_fieldSymbol_overwriteHorizontalTextAlign = 'fieldSymbolReducer_SET_fieldSymbol_overwriteHorizontalTextAlign',
  SET_fieldSymbol_overwriteVerticalTextAlign = 'fieldSymbolReducer_SET_fieldSymbol_overwriteVerticalTextAlign',
  SET_fieldSymbol_overwritePadding = 'fieldSymbolReducer_SET_fieldSymbol_overwritePadding',
  SET_fieldSymbol_overwriteCornerRadius = 'fieldSymbolReducer_SET_fieldSymbol_overwriteCornerRadius',
  SET_fieldSymbol_overwriteRotationInDeg = 'fieldSymbolReducer_SET_fieldSymbol_overwriteRotationInDeg',
  SET_fieldSymbol_overwriteBackgroundImage = 'fieldSymbolReducer_SET_fieldSymbol_overwriteBackgroundImage',

  RESET = 'fieldSymbolReducer_RESET',
}

export interface SET_fieldSymbolsAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbols
  readonly fieldSymbols: ReadonlyArray<FieldSymbol>
}

export interface SET_fieldSymbol_textAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_text
  readonly fieldSymbolGuid: string
  readonly text: string
}

export interface SET_fieldSymbol_widthAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_width
  readonly fieldSymbolGuid: string
  readonly width: number
}

export interface SET_fieldSymbol_heightAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_height
  readonly fieldSymbolGuid: string
  readonly height: number
}

export interface SET_fieldSymbol_colorAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_color
  readonly fieldSymbolGuid: string
  readonly color: string
}

export interface SET_fieldSymbol_bgColorAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_bgColor
  readonly fieldSymbolGuid: string
  readonly bgColor: string
}

export interface SET_fieldSymbol_verticalAlignAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_verticalAlign
  readonly fieldSymbolGuid: string
  readonly verticalTextAlign: VerticalAlign
}

export interface SET_fieldSymbol_horizontalAlignAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_horizontalAlign
  readonly fieldSymbolGuid: string
  readonly horizontalTextAlign: HorizontalAlign
}

export interface SET_fieldSymbol_cornerRadiusInPxAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_cornerRadiusInPx
  readonly fieldSymbolGuid: string
  readonly cornerRadiusInPx: number
}

export interface SET_fieldSymbol_cmdTextAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_cmdText
  readonly fieldSymbolGuid: string
  readonly cmdText: string
}

export interface SET_fieldSymbol_displayIndexAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_displayIndex
  readonly fieldSymbolGuid: string
  readonly displayIndex: number
}

export interface SET_fieldSymbol_paddingAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_padding
  readonly fieldSymbolGuid: string
  readonly paddingTop: number
  readonly paddingRight: number
  readonly paddingBottom: number
  readonly paddingLeft: number
}

export interface SET_fieldSymbol_borderColorAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_borderColor
  readonly fieldSymbolGuid: string
  readonly borderColor: string
}

export interface SET_fieldSymbol_borderSizeInPxAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_borderSizeInPx
  readonly fieldSymbolGuid: string
  readonly borderSizeInPx: number
}

export interface SET_fieldSymbol_fontNameAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_fontName
  readonly fieldSymbolGuid: string
  readonly fontName: string
}

export interface SET_fieldSymbol_fontSizeInPxAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_fontSizeInPx
  readonly fieldSymbolGuid: string
  readonly fontSizeInPx: number
}


export interface SET_fieldSymbol_anchorPointsAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_anchorPoints
  readonly fieldSymbolGuid: string
  readonly anchorPoints: ReadonlyArray<AnchorPoint>
}

export interface SET_fieldSymbol_anchorPointsAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_anchorPoints
  readonly fieldSymbolGuid: string
  readonly anchorPoints: ReadonlyArray<AnchorPoint>
}

export interface SET_fieldSymbol_displayNameAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_displayName
  readonly fieldSymbolGuid: string
  readonly displayName: string
}

export interface SET_fieldSymbol_isFontBoldAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_isFontBold
  readonly fieldSymbolGuid: string
  readonly isFontBold: boolean
}

export interface SET_fieldSymbol_isFontItalicAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_isFontItalic
  readonly fieldSymbolGuid: string
  readonly isFontItalic: boolean
}

export interface SET_fieldSymbol_rotationInDegreeAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_rotationInDegree
  readonly fieldSymbolGuid: string
  readonly rotationInDegree: number
}

export interface SET_fieldSymbol_backgroundImgGuidAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_backgroundImgGuid
  readonly fieldSymbolGuid: string
  readonly backgroundImgGuid: string
}


export interface SET_fieldSymbol_overwriteCmdTextAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteCmdText
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteWidthAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteWidth
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteHeightAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteHeight
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteColorAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteColor
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteBgColorAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteBgColor
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteBorderColorAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteBorderColor
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteBorderSizeInPxAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteBorderSizeInPx
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteFontNameAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteFontName
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteFontSizeInPxAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteFontSizeInPx
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteFontDecorationAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteFontDecoration
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteTextAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteText
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteHorizontalTextAlignAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteHorizontalTextAlign
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteVerticalTextAlignAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteVerticalTextAlign
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwritePaddingAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwritePadding
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteCornerRadiusAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteCornerRadius
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteRotationInDegAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteRotationInDeg
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}
export interface SET_fieldSymbol_overwriteBackgroundImageAction extends ActionBase {
  readonly type: ActionType.SET_fieldSymbol_overwriteBackgroundImage
  readonly overwrite: boolean
  readonly fieldSymbolGuid: string
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_fieldSymbolsAction
  | SET_fieldSymbol_textAction
  | SET_fieldSymbol_widthAction
  | SET_fieldSymbol_heightAction
  | SET_fieldSymbol_colorAction
  | SET_fieldSymbol_bgColorAction
  | SET_fieldSymbol_bgColorAction
  | SET_fieldSymbol_verticalAlignAction
  | SET_fieldSymbol_horizontalAlignAction
  | SET_fieldSymbol_cornerRadiusInPxAction
  | SET_fieldSymbol_cmdTextAction
  | SET_fieldSymbol_displayIndexAction
  | SET_fieldSymbol_paddingAction
  | SET_fieldSymbol_borderColorAction
  | SET_fieldSymbol_borderSizeInPxAction
  | SET_fieldSymbol_fontNameAction
  | SET_fieldSymbol_fontSizeInPxAction
  | SET_fieldSymbol_anchorPointsAction
  | SET_fieldSymbol_displayNameAction
  | SET_fieldSymbol_isFontBoldAction
  | SET_fieldSymbol_isFontItalicAction
  | SET_fieldSymbol_rotationInDegreeAction
  | SET_fieldSymbol_backgroundImgGuidAction

 | SET_fieldSymbol_overwriteCmdTextAction
 | SET_fieldSymbol_overwriteWidthAction
 | SET_fieldSymbol_overwriteHeightAction
 | SET_fieldSymbol_overwriteColorAction
 | SET_fieldSymbol_overwriteBgColorAction
 | SET_fieldSymbol_overwriteBorderColorAction
 | SET_fieldSymbol_overwriteBorderSizeInPxAction
 | SET_fieldSymbol_overwriteFontNameAction
 | SET_fieldSymbol_overwriteFontSizeInPxAction
 | SET_fieldSymbol_overwriteFontDecorationAction
 | SET_fieldSymbol_overwriteTextAction
 | SET_fieldSymbol_overwriteHorizontalTextAlignAction
 | SET_fieldSymbol_overwriteVerticalTextAlignAction
 | SET_fieldSymbol_overwritePaddingAction
 | SET_fieldSymbol_overwriteCornerRadiusAction
 | SET_fieldSymbol_overwriteRotationInDegAction
 | SET_fieldSymbol_overwriteBackgroundImageAction

export function _reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_fieldSymbols:
      return [...action.fieldSymbols]

    case ActionType.SET_fieldSymbol_text: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, text: action.text}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_width: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, width: action.width}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_height: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, height: action.height}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_color: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, color: action.color}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_bgColor: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, bgColor: action.bgColor}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_verticalAlign: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, verticalTextAlign: action.verticalTextAlign}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_horizontalAlign: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, horizontalTextAlign: action.horizontalTextAlign}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_cornerRadiusInPx: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, cornerRadiusInPx: action.cornerRadiusInPx}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_cmdText: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, cmdText: action.cmdText}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_displayIndex: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, displayIndex: action.displayIndex}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_padding: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {
          ...p,
          padding: {
            top: action.paddingTop,
            right: action.paddingRight,
            bottom: action.paddingBottom,
            left: action.paddingLeft
          }
        }
      })
      return res
    }

    case ActionType.SET_fieldSymbol_borderColor: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, borderColor: action.borderColor}
      })
      return res
    }
    case ActionType.SET_fieldSymbol_borderSizeInPx: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, borderSizeInPx: action.borderSizeInPx}
      })
      return res
    }
    case ActionType.SET_fieldSymbol_fontName: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, fontName: action.fontName}
      })
      return res
    }
    case ActionType.SET_fieldSymbol_fontSizeInPx: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, fontSizeInPx: action.fontSizeInPx}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_anchorPoints: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, anchorPoints: action.anchorPoints}
      })
      return res
    }
    case ActionType.SET_fieldSymbol_displayName: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, displayName: action.displayName}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_isFontBold: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, isFontBold: action.isFontBold}
      })
      return res
    }
    case ActionType.SET_fieldSymbol_isFontItalic: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, isFontItalic: action.isFontItalic}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_rotationInDegree: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, rotationInDegree: action.rotationInDegree}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_backgroundImgGuid: {
      const res = replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {...p, backgroundImgGuid: action.backgroundImgGuid}
      })
      return res
    }

    case ActionType.SET_fieldSymbol_overwriteCmdText: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {
          ...p,
          overwriteCmdText: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteWidth: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {
          ...p,
          overwriteWidth: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteHeight: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {
          ...p,
          overwriteHeight: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteColor: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {
          ...p,
          overwriteColor: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteBgColor: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {
          ...p,
          overwriteBgColor: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteBorderColor: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {
          ...p,
          overwriteBorderColor: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteBorderSizeInPx: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid,p => {
        return {
          ...p,
          overwriteBorderSizeInPx: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteFontName: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {
          ...p,
          overwriteFontName: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteFontSizeInPx: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid,p => {
        return {
          ...p,
          overwriteFontSizeInPx: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteFontDecoration: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid,p => {
        return {
          ...p,
          overwriteFontDecoration: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteText: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {
          ...p,
          overwriteText: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteHorizontalTextAlign: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid,p => {
        return {
          ...p,
          overwriteHorizontalTextAlign: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteVerticalTextAlign: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid,p => {
        return {
          ...p,
          overwriteVerticalTextAlign: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwritePadding: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid, p => {
        return {
          ...p,
          overwritePadding: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteCornerRadius: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid,p => {
        return {
          ...p,
          overwriteCornerRadius: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteRotationInDeg: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid,p => {
        return {
          ...p,
          overwriteRotationInDeg: action.overwrite
        }
      })
    }
    case ActionType.SET_fieldSymbol_overwriteBackgroundImage: {
      return replacePropertyByGuid(state, action.fieldSymbolGuid,p => {
        return {
          ...p,
          overwriteBackgroundImage: action.overwrite
        }
      })
    }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

export enum UndoFieldSymbolType {
  undo = 'fieldSymbol_shapesReducer_undo',
  redo = 'fieldSymbol_shapesReducer_redo',
}

export interface Edit_fieldSymbolUndo {
  readonly type: UndoFieldSymbolType.undo
}

export interface Edit_fieldSymbolRedo {
  readonly type: UndoFieldSymbolType.redo
}

//increment every time another (field/img/line) reducer applies an action
//then we don't group the next action in here into the same item
/*
    because the shape reducer groups field move then groups img move
    but the field reducer only sees field moves not img moves
    so when we move the field again we group into the same item...
 */
export let fieldSymbolUndoVersionId = 0

export function incFieldSymbolHistoryId(): void {
  fieldSymbolUndoVersionId++
}

export const reducer = undoable(_reducer, {
  limit: undoShapeLimit,
  undoType: UndoFieldSymbolType.undo,
  redoType: UndoFieldSymbolType.redo,
  clearHistoryType: clearTileEditorEditShapesType,
  groupBy: (action, state) => {


    //not group bools else if we only trigger the bool then we get a undo item with no effect
    //also bad for enums...
    if (action.type === ActionType.SET_fieldSymbol_isFontItalic
      || action.type === ActionType.SET_fieldSymbol_isFontBold
      || action.type === ActionType.SET_fieldSymbol_horizontalAlign
      || action.type === ActionType.SET_fieldSymbol_verticalAlign
    ) {
      return null
    }

    return action.type + fieldSymbolUndoVersionId
  }
})