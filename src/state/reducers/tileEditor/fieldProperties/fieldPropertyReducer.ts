import {AnchorPoint, FieldShape, HorizontalAlign, VerticalAlign} from "../../../../types/drawing";
import {Action} from "redux";
import {notExhaustive} from "../../_notExhausiveHelper";
import {replaceProperty} from "../../../../helpers/functionHelpers";
import undoable, {excludeAction} from "redux-undo";
import {clearTileEditorEditShapesType, undoShapeLimit} from "../../../../constants";


let lastShapeId = 0

export function getNextShapeId(): number {
  return lastShapeId++
}


/**
 * only for import/export
 * @param {number} num
 * @returns {number}
 * @private
 */
export function __setNextShapeId(num: number): number {
  return lastShapeId = num
}


export type State = ReadonlyArray<FieldShape>

export const initial: State = []

export interface ActionBase extends Action {
  readonly type: ActionType
}

export enum ActionType {

  SET_fieldsArray = 'fieldPropertyReducer_SET_fieldsArray',

  ADD_fieldShape = 'tileEditorReducer_ADD_fieldShape',
  REMOVE_fieldShape = 'tileEditorReducer_REMOVE_fieldShape',

  SET_fieldText = 'fieldPropertyReducer_SET_fieldText',
  SET_fieldX = 'fieldPropertyReducer_SET_fieldXAction',
  SET_fieldY = 'fieldPropertyReducer_SET_fieldYAction',
  SET_fieldWidth = 'fieldPropertyReducer_SET_fieldWidthAction',
  SET_fieldHeight = 'fieldPropertyReducer_SET_fieldHeightAction',
  SET_fieldColor = 'fieldPropertyReducer_SET_fieldColorAction',
  SET_fieldBgColor = 'fieldPropertyReducer_SET_fieldBgColorAction',
  SET_fieldVerticalTextAlign = 'fieldPropertyReducer_SET_fieldVerticalTextAlign',
  SET_fieldHorizontalTextAlign = 'fieldPropertyReducer_SET_fieldHorizontalTextAlign',
  SET_fieldCmdText = 'fieldPropertyReducer_SET_fieldCmdText',
  SET_fieldCornerRadius = 'fieldPropertyReducer_SET_fieldCornerRadius',
  SET_field_isFontBold = 'fieldPropertyReducer_SET_field_isFontBold',
  SET_field_isFontItalic = 'fieldPropertyReducer_SET_field_isFontItalic',
  SET_fieldZIndex = 'fieldPropertyReducer_SET_fieldZIndex',

  SET_fieldAnchorPoints = 'fieldPropertyReducer_SET_fieldAnchorPoints',

  SET_connectedLinesThroughAnchors = 'fieldPropertyReducer_SET_connectedLinesThroughAnchors',

  SET_fieldCreatedFromSymbolId = 'fieldPropertyReducer_SET_fieldCreatedFromSymbolId',
  SET_fieldPadding = 'fieldPropertyReducer_SET_fieldPadding',

  SET_field_rotationInDegree = 'fieldPropertyReducer_SET_field_rotationInDegree',

  SET_fieldBorderSizeInPx = 'fieldPropertyReducer_SET_fieldBorderSizeInPx',
  SET_fieldBorderColor = 'fieldPropertyReducer_SET_fieldBorderColor',

  SET_fieldFontName = 'fieldPropertyReducer_SET_fieldFontName',
  SET_fieldFontSizeInPx = 'fieldPropertyReducer_SET_fieldFontSizeInPx',

  SET_field_backgroundImgGuid = 'fieldPropertyReducer_SET_fieldBackgroundImgGuid',


  RESET = 'fieldPropertyReducer_RESET',
}

export interface SET_fieldsArrayAction extends ActionBase {
  readonly type: ActionType.SET_fieldsArray
  readonly fields: ReadonlyArray<FieldShape>
}

export interface ADD_fieldShapeAction extends ActionBase {
  readonly type: ActionType.ADD_fieldShape
  readonly fieldShape: FieldShape
}

export interface REMOVE_fieldShapeAction extends ActionBase {
  readonly type: ActionType.REMOVE_fieldShape
  readonly fieldShapeId: number
}


//--- field props

export interface SET_fieldTextAction extends ActionBase {
  readonly type: ActionType.SET_fieldText
  readonly fieldId: number
  readonly text: string
}

export interface SET_fieldXAction extends ActionBase {
  readonly type: ActionType.SET_fieldX
  readonly fieldId: number
  readonly x: number
}

export interface SET_fieldYAction extends ActionBase {
  readonly type: ActionType.SET_fieldY
  readonly fieldId: number
  readonly y: number
}

export interface SET_fieldWidthAction extends ActionBase {
  readonly type: ActionType.SET_fieldWidth
  readonly fieldId: number
  readonly width: number
}

export interface SET_fieldHeightAction extends ActionBase {
  readonly type: ActionType.SET_fieldHeight
  readonly fieldId: number
  readonly height: number
}

export interface SET_fieldColorAction extends ActionBase {
  readonly type: ActionType.SET_fieldColor
  readonly fieldId: number
  readonly color: string
}

export interface SET_fieldBgColorAction extends ActionBase {
  readonly type: ActionType.SET_fieldBgColor
  readonly fieldId: number
  readonly color: string
}

export interface SET_fieldVerticalTextAlignAction extends ActionBase {
  readonly type: ActionType.SET_fieldVerticalTextAlign
  readonly fieldId: number
  readonly verticalAlign: VerticalAlign
}

export interface SET_fieldHorizontalTextAlign extends ActionBase {
  readonly type: ActionType.SET_fieldHorizontalTextAlign
  readonly fieldId: number
  readonly horizontalAlign: HorizontalAlign
}

export interface SET_fieldCmdTextAction extends ActionBase {
  readonly type: ActionType.SET_fieldCmdText
  readonly fieldId: number
  readonly cmdText: string
}

export interface SET_field_isFontBoldAction extends ActionBase {
  readonly type: ActionType.SET_field_isFontBold
  readonly fieldId: number
  readonly isFontBold: boolean
}

export interface SET_field_isFontItalicAction extends ActionBase {
  readonly type: ActionType.SET_field_isFontItalic
  readonly fieldId: number
  readonly isFontItalic: boolean
}

export interface SET_fieldCornerRadiusAction extends ActionBase {
  readonly type: ActionType.SET_fieldCornerRadius
  readonly fieldId: number
  readonly cornerRadiusInPx: number
}

export interface SET_fieldZIndexAction extends ActionBase {
  readonly type: ActionType.SET_fieldZIndex
  readonly fieldId: number
  readonly zIndex: number
}


export interface SET_connectedLinesThroughAnchorsAction extends ActionBase {
  readonly type: ActionType.SET_connectedLinesThroughAnchors
  readonly fieldId: number
  readonly lineId: number
  readonly connectedLinesThroughAnchors: ReadonlyArray<number> | null
}

export interface SET_fieldCreatedFromSymbolIdAction extends ActionBase {
  readonly type: ActionType.SET_fieldCreatedFromSymbolId
  readonly fieldId: number
  readonly createdFromSymbolGuid: string | null
}

export interface SET_fieldPaddingAction extends ActionBase {
  readonly type: ActionType.SET_fieldPadding
  readonly fieldId: number
  readonly paddingTop: number
  readonly paddingRight: number
  readonly paddingBottom: number
  readonly paddingLeft: number
}

export interface SET_fieldBorderColorAction extends ActionBase {
  readonly type: ActionType.SET_fieldBorderColor
  readonly fieldId: number
  readonly borderColor: string
}

export interface SET_fieldBorderSizeInPxAction extends ActionBase {
  readonly type: ActionType.SET_fieldBorderSizeInPx
  readonly fieldId: number
  readonly borderSizeInPx: number
}

export interface SET_fieldFontNameAction extends ActionBase {
  readonly type: ActionType.SET_fieldFontName
  readonly fieldId: number
  readonly fontName: string
}

export interface SET_fieldFontSizeInPxAction extends ActionBase {
  readonly type: ActionType.SET_fieldFontSizeInPx
  readonly fieldId: number
  readonly fontSizeInPx: number
}

export interface SET_fieldAnchorPointsAction extends ActionBase {
  readonly type: ActionType.SET_fieldAnchorPoints
  readonly fieldId: number
  readonly anchorPoints: ReadonlyArray<AnchorPoint>
}

export interface SET_field_rotationInDegreeAction extends ActionBase {
  readonly type: ActionType.SET_field_rotationInDegree
  readonly fieldId: number
  readonly rotationInDegree: number
}

export interface SET_fieldBackgroundImgGuidAction extends ActionBase {
  readonly type: ActionType.SET_field_backgroundImgGuid
  readonly fieldId: number
  readonly backgroundImgGuid: string
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction

  | ADD_fieldShapeAction
  | REMOVE_fieldShapeAction
  | SET_fieldsArrayAction

  | SET_fieldTextAction
  | SET_fieldXAction
  | SET_fieldYAction
  | SET_fieldWidthAction
  | SET_fieldHeightAction
  | SET_fieldColorAction
  | SET_fieldBgColorAction
  | SET_fieldVerticalTextAlignAction
  | SET_fieldHorizontalTextAlign
  | SET_fieldCmdTextAction
  | SET_fieldCornerRadiusAction
  | SET_fieldZIndexAction
  | SET_connectedLinesThroughAnchorsAction
  | SET_fieldCreatedFromSymbolIdAction
  | SET_fieldPaddingAction
  | SET_fieldBorderColorAction
  | SET_fieldBorderSizeInPxAction
  | SET_fieldFontNameAction
  | SET_fieldFontSizeInPxAction
  | SET_fieldAnchorPointsAction
  | SET_field_isFontBoldAction
  | SET_field_isFontItalicAction
  | SET_field_rotationInDegreeAction
  | SET_fieldBackgroundImgGuidAction


function _reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {


    case ActionType.ADD_fieldShape:
      return state.concat({...action.fieldShape})

    case ActionType.REMOVE_fieldShape:
      return state.filter(p => p.id !== action.fieldShapeId)

    case ActionType.SET_fieldsArray: {
      return [...action.fields]
    }

    //--- field properties
    case ActionType.SET_fieldText: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, text: action.text}
      })
      return res
    }


    case ActionType.SET_fieldX: {
      const res = replaceProperty(state, action.fieldId, p => {

        return {
          ...p,
          x: action.x
        }
      })
      return res
    }


    case ActionType.SET_fieldY: {
      const res = replaceProperty(state, action.fieldId, p => {


        return {...p, y: action.y}
      })
      return res
    }

    case ActionType.SET_fieldWidth: {
      const res = replaceProperty(state, action.fieldId, p => {

        return {
          ...p, width: action.width
        }
      })
      return res
    }

    case ActionType.SET_fieldHeight: {
      const res = replaceProperty(state, action.fieldId, p => {

        return {
          ...p, height: action.height
        }
      })
      return res
    }

    case ActionType.SET_fieldColor: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, color: action.color}
      })
      return res
    }

    case ActionType.SET_fieldBgColor: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, bgColor: action.color}
      })
      return res
    }

    case ActionType.SET_fieldVerticalTextAlign: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, verticalTextAlign: action.verticalAlign}
      })
      return res
    }

    case ActionType.SET_fieldCmdText: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, cmdText: action.cmdText}
      })

      return res
    }

    case ActionType.SET_fieldHorizontalTextAlign: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, horizontalTextAlign: action.horizontalAlign}
      })

      return res
    }

    case ActionType.SET_fieldCornerRadius: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, cornerRadiusInPx: action.cornerRadiusInPx}
      })

      return res
    }

    case ActionType.SET_fieldZIndex: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, zIndex: action.zIndex}
      })

      return res
    }


    case ActionType.SET_connectedLinesThroughAnchors: {
      const res = replaceProperty<FieldShape>(state, action.fieldId, p => {

        //this is working but for proper undo we should not mutate... | ...p copies only 1 level
        const copy: FieldShape = {
          ...p,
          connectedLinesThroughAnchorPoints: {
            ...p.connectedLinesThroughAnchorPoints
          }
        }

        if (action.connectedLinesThroughAnchors === null || action.connectedLinesThroughAnchors.length === 0) {
          delete copy.connectedLinesThroughAnchorPoints[action.lineId]
        }
        else {
          copy.connectedLinesThroughAnchorPoints[action.lineId] = action.connectedLinesThroughAnchors
        }

        //this is not working because if we set to undefined we still have the key
        // const copy: FieldShape = {
        //   ...p,
        //   connectedLinesThroughAnchorPoints: {
        //     ...p.connectedLinesThroughAnchorPoints,
        //     [action.lineId]: action.connectedLinesThroughAnchors === null ? undefined : action.connectedLinesThroughAnchors
        //   }
        // }

        return copy
      })

      return res
    }
    case ActionType.SET_fieldCreatedFromSymbolId: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, createdFromSymbolGuid: action.createdFromSymbolGuid}
      })
      return res
    }

    case ActionType.SET_fieldPadding: {
      const res = replaceProperty(state, action.fieldId, p => {
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

    case ActionType.SET_fieldBorderColor: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, borderColor: action.borderColor}
      })
      return res
    }
    case ActionType.SET_fieldBorderSizeInPx: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, borderSizeInPx: action.borderSizeInPx}
      })
      return res
    }

    case ActionType.SET_fieldAnchorPoints: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, anchorPoints: action.anchorPoints}
      })
      return res
    }

    case ActionType.SET_fieldFontName: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, fontName: action.fontName}
      })
      return res
    }

    case ActionType.SET_fieldFontSizeInPx: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, fontSizeInPx: action.fontSizeInPx}
      })
      return res
    }
    case ActionType.SET_field_isFontBold: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, isFontBold: action.isFontBold}
      })
      return res
    }
    case ActionType.SET_field_isFontItalic: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, isFontItalic: action.isFontItalic}
      })
      return res
    }
    case ActionType.SET_field_rotationInDegree: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, rotationInDegree: action.rotationInDegree}
      })
      return res
    }
    case ActionType.SET_field_backgroundImgGuid: {
      const res = replaceProperty(state, action.fieldId, p => {
        return {...p, backgroundImgGuid: action.backgroundImgGuid}
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


export enum UndoFieldShapeType {
  undo = 'field_shapesReducer_undo',
  redo = 'field_shapesReducer_redo',
}

export interface Edit_fieldShapeUndo {
  readonly type: UndoFieldShapeType.undo
}

export interface Edit_fieldShapeRedo {
  readonly type: UndoFieldShapeType.redo
}

//increment every time another (field/img/line) reducer applies an action
//then we don't group the next action in here into the same item
/*
    because the shape reducer groups field move then groups img move
    but the field reducer only sees field moves not img moves
    so when we move the field again we group into the same item...
 */
let fieldUndoVersionId = 0

export function incFieldHistoryId(): void {
  fieldUndoVersionId++
}

export const reducer = undoable(_reducer, {
  limit: undoShapeLimit,
  undoType: UndoFieldShapeType.undo,
  redoType: UndoFieldShapeType.redo,
  clearHistoryType: clearTileEditorEditShapesType,
  filter: excludeAction([ActionType.SET_fieldAnchorPoints]), //this is always set because of other actions
  groupBy: (action, state) => {
    if (action.type === ActionType.SET_fieldX || action.type === ActionType.SET_fieldY) {
      return ActionType.SET_fieldX + ActionType.SET_fieldY + fieldUndoVersionId
    }

    //not group bools else if we only trigger the bool then we get a undo item with no effect
    //also bad for enums...
    if (action.type === ActionType.SET_field_isFontItalic
      || action.type === ActionType.SET_field_isFontBold
      || action.type === ActionType.SET_fieldHorizontalTextAlign
      || action.type === ActionType.SET_fieldVerticalTextAlign
      || action.type === ActionType.SET_connectedLinesThroughAnchors
    ) {
      return null
    }


    return action.type + fieldUndoVersionId

    /*
    if (action.type === ActionType.SET_fieldWidth) return ActionType.SET_fieldWidth

    if (action.type === ActionType.SET_fieldHeight) return ActionType.SET_fieldHeight

    if (action.type === ActionType.SET_fieldPadding) return ActionType.SET_fieldPadding

    if (action.type === ActionType.SET_fieldCornerRadius) return ActionType.SET_fieldCornerRadius

    if (action.type === ActionType.SET_fieldFontSizeInPx) return ActionType.SET_fieldFontSizeInPx

    if (action.type === ActionType.SET_fieldFontName) return ActionType.SET_fieldFontName

    if (action.type === ActionType.SET_fieldAnchorPoints) return ActionType.SET_fieldAnchorPoints

    if (action.type === ActionType.SET_fieldBorderSizeInPx) return ActionType.SET_fieldBorderSizeInPx

    if (action.type === ActionType.SET_fieldBorderColor) return ActionType.SET_fieldBorderColor

    if (action.type === ActionType.SET_fieldBorderColor) return ActionType.SET_fieldBorderColor
*/

  }
})
