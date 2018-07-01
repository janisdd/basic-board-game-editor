import {Action} from "redux";
import {notExhaustive} from "../../_notExhausiveHelper";
import {FieldShape, HorizontalAlign, ImgShape, LineShape, VerticalAlign} from "../../../../types/drawing";
import {getNextShapeId} from "../fieldProperties/fieldPropertyReducer";


export type State = {

  // actually we could use 1 id field because all shape ids are distinct...
  readonly selectedFieldSymbolGuid: string | null
  readonly selectedImgSymbolGuid: string | null
  readonly selectedLineSymbolGuid: string | null

}

export const initial: State = {
  selectedFieldSymbolGuid: null,
  selectedImgSymbolGuid: null,
  selectedLineSymbolGuid: null
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {

  SET_selectedFieldSymbolGuid = 'symbolsReducer_SET_selectedFieldSymbolGuid',
  SET_selectedImgSymbolGuid = 'symbolsReducer_SET_selectedImgSymbolGuid',
  SET_selectedLineSymbolGuid = 'symbolsReducer_SET_selectedLineSymbolGuid',

  RESET = 'symbolsReducer_RESET',
}


export interface SET_selectedFieldSymbolGuidAction extends ActionBase {
  readonly type: ActionType.SET_selectedFieldSymbolGuid
  readonly selectedFieldSymbolGuid: string | null
}

export interface SET_selectedImgSymbolGuidAction extends ActionBase {
  readonly type: ActionType.SET_selectedImgSymbolGuid
  readonly selectedImgSymbolGuid: string | null
}

export interface SET_selectedLineSymbolGuidAction extends ActionBase {
  readonly type: ActionType.SET_selectedLineSymbolGuid
  readonly selectedLineSymbolGuid: string | null
}

export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_selectedFieldSymbolGuidAction
  | SET_selectedImgSymbolGuidAction
  | SET_selectedLineSymbolGuidAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_selectedFieldSymbolGuid:
      return {
        ...state,
        selectedLineSymbolGuid: null,
        selectedImgSymbolGuid: null,
        selectedFieldSymbolGuid: action.selectedFieldSymbolGuid
      }

    case ActionType.SET_selectedImgSymbolGuid:
      return {
        ...state,
        selectedLineSymbolGuid: null,
        selectedImgSymbolGuid: action.selectedImgSymbolGuid,
        selectedFieldSymbolGuid: null
      }

    case ActionType.SET_selectedLineSymbolGuid:
      return {
        ...state,
        selectedLineSymbolGuid: action.selectedLineSymbolGuid,
        selectedImgSymbolGuid: null,
        selectedFieldSymbolGuid: null
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}



