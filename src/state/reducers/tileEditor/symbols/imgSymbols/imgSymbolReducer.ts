import {Action} from "redux";
import {ImgSymbol} from "../../../../../types/drawing";
import {notExhaustive} from "../../../_notExhausiveHelper";
import {replacePropertyByGuid} from "../../../../../helpers/functionHelpers";
import {
  clearTileEditorEditShapesType,
  undoShapeLimit
} from "../../../../../constants";
import undoable from "redux-undo";

export type State = ReadonlyArray<ImgSymbol>

const imgSymbolPresets: ReadonlyArray<ImgSymbol> = []

export const initial: State = imgSymbolPresets

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  SET_imgSymbols = 'imgSymbolReducer_SET_imgSymbols',
  SET_imgSymbol_width = 'imgSymbolReducer_SET_imgSymbol_width',
  SET_imgSymbol_height = 'imgSymbolReducer_SET_imgSymbol_height',
  SET_imgSymbol_rotation = 'imgSymbolReducer_SET_imgSymbol_rotation',

  SET_imgSymbol_imgStorageGuid = 'imgSymbolReducer_SET_imgSymbol_imgStorageGuid',

  SET_imgSymbol_displayIndex = 'imgSymbolReducer_SET_imgSymbol_displayIndex',
  SET_imgSymbol_displayName = 'imgSymbolReducer_SET_imgSymbol_displayName',

  SET_imgSymbol_skewX = 'imgSymbolReducer_SET_imgSymbol_skewX',
  SET_imgSymbol_skewY = 'imgSymbolReducer_SET_imgSymbol_skewY',

  SET_imgSymbol_isMouseSelectionDisabled = 'imgSymbolReducer_SET_imgSymbol_isMouseSelectionDisabled',

  RESET = 'imgSymbolReducer_RESET',
}


export interface SET_imgSymbolsAction extends ActionBase {
  readonly type: ActionType.SET_imgSymbols
  readonly imgSymbols: ReadonlyArray<ImgSymbol>
}

export interface SET_imgSymbol_widthAction extends ActionBase {
  readonly type: ActionType.SET_imgSymbol_width
  readonly imgSymbolGuid: string
  readonly width: number
}

export interface SET_imgSymbol_heightAction extends ActionBase {
  readonly type: ActionType.SET_imgSymbol_height
  readonly imgSymbolGuid: string
  readonly height: number
}

export interface SET_imgSymbol_rotationAction extends ActionBase {
  readonly type: ActionType.SET_imgSymbol_rotation
  readonly imgSymbolGuid: string
  readonly rotationInDegree: number
}

export interface SET_imgSymbol_imgStorageGuidAction extends ActionBase {
  readonly type: ActionType.SET_imgSymbol_imgStorageGuid
  readonly imgSymbolGuid: string
  readonly imgGuid: string | null
}

export interface SET_imgSymbol_displayIndexAction extends ActionBase {
  readonly type: ActionType.SET_imgSymbol_displayIndex
  readonly imgSymbolGuid: string
  readonly displayIndex: number
}

export interface SET_imgSymbol_displayNameAction extends ActionBase {
  readonly type: ActionType.SET_imgSymbol_displayName
  readonly imgSymbolGuid: string
  readonly displayName: string
}

export interface SET_imgSymbol_skewXAction extends ActionBase {
  readonly type: ActionType.SET_imgSymbol_skewX
  readonly imgSymbolGuid: string
  readonly skewX: number
}

export interface SET_imgSymbol_skewYAction extends ActionBase {
  readonly type: ActionType.SET_imgSymbol_skewY
  readonly imgSymbolGuid: string
  readonly skewY: number
}

export interface SET_imgSymbol_isMouseSelectionDisabledAction extends ActionBase {
  readonly type: ActionType.SET_imgSymbol_isMouseSelectionDisabled
  readonly imgSymbolGuid: string
  readonly isMouseSelectionDisabled: boolean
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_imgSymbolsAction
  | SET_imgSymbol_widthAction
  | SET_imgSymbol_heightAction
  | SET_imgSymbol_rotationAction
  | SET_imgSymbol_imgStorageGuidAction
  | SET_imgSymbol_displayIndexAction
  | SET_imgSymbol_displayNameAction
  | SET_imgSymbol_skewXAction
  | SET_imgSymbol_skewYAction
  | SET_imgSymbol_isMouseSelectionDisabledAction

export function _reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_imgSymbols:
      return [...action.imgSymbols]

    case ActionType.SET_imgSymbol_width: {
      const res = replacePropertyByGuid(state, action.imgSymbolGuid, p => {
        return {...p, width: action.width}
      })
      return res
    }

    case ActionType.SET_imgSymbol_height: {
      const res = replacePropertyByGuid(state, action.imgSymbolGuid, p => {
        return {...p, height: action.height}
      })
      return res
    }

    case ActionType.SET_imgSymbol_rotation: {
      const res = replacePropertyByGuid(state, action.imgSymbolGuid, p => {
        return {...p, rotationInDegree: action.rotationInDegree}
      })
      return res
    }

    case ActionType.SET_imgSymbol_imgStorageGuid: {
      const res = replacePropertyByGuid(state, action.imgSymbolGuid, p => {
        return {...p, imgGuid: action.imgGuid}
      })
      return res
    }

    case ActionType.SET_imgSymbol_displayIndex: {
      const res = replacePropertyByGuid(state, action.imgSymbolGuid, p => {
        return {...p, displayIndex: action.displayIndex}
      })
      return res
    }

    case ActionType.SET_imgSymbol_displayName: {
      const res = replacePropertyByGuid(state, action.imgSymbolGuid, p => {
        return {...p, displayName: action.displayName}
      })
      return res
    }

    case ActionType.SET_imgSymbol_skewX: {
      const res = replacePropertyByGuid(state, action.imgSymbolGuid, p => {
        return {...p, skewX: action.skewX}
      })
      return res
    }

    case ActionType.SET_imgSymbol_skewY: {
      const res = replacePropertyByGuid(state, action.imgSymbolGuid, p => {
        return {...p, skewY: action.skewY}
      })
      return res
    }

    case ActionType.SET_imgSymbol_isMouseSelectionDisabled: {
      const res = replacePropertyByGuid(state, action.imgSymbolGuid, p => {
        return {...p, isMouseSelectionDisabled: action.isMouseSelectionDisabled}
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


export enum UndoImgSymbolType {
  undo = 'imgSymbol_shapesReducer_undo',
  redo = 'imgSymbol_shapesReducer_redo',
}

export interface Edit_imgSymbolUndo {
  readonly type: UndoImgSymbolType.undo
}

export interface Edit_imgSymbolRedo {
  readonly type: UndoImgSymbolType.redo
}


//increment every time another (field/img/line) reducer applies an action
//then we don't group the next action in here into the same item
/*
    because the shape reducer groups field move then groups img move
    but the field reducer only sees field moves not img moves
    so when we move the field again we group into the same item...
 */
export let imgSymbolUndoVersionId = 0

export function incImgSymbolHistoryId(): void {
  imgSymbolUndoVersionId++
}

export const reducer = undoable(_reducer, {
  limit: undoShapeLimit,
  undoType: UndoImgSymbolType.undo,
  redoType: UndoImgSymbolType.redo,
  clearHistoryType: clearTileEditorEditShapesType,
  groupBy: (action, state) => {

    //not group bools else if we only trigger the bool then we get a undo item with no effect
    //also bad for enums...
    if (action.type === ActionType.SET_imgSymbol_isMouseSelectionDisabled
    ) {
      return null
    }

    //all? might be odd for bools because we not go back to the last state but to the start bool state... but easier this way
    return action.type + imgSymbolUndoVersionId
  }
})