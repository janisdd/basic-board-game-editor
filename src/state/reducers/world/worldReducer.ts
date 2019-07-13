import {Action, combineReducers} from "redux";
import {notExhaustive} from "../_notExhausiveHelper";
import {PlainPoint,} from "../../../types/drawing";


export type State = {

  /**
   * the selected tile pos in tiles
   */
  readonly selectedTilePos: PlainPoint | null

  readonly isTileLibraryModalDisplayed: boolean

  readonly isTileEditorDisplayed: boolean

  readonly isWorldSettingsModalDisplayed: boolean

  readonly isImageLibraryDisplayed: boolean
}


export const initial: State = {
  selectedTilePos: null,
  isTileLibraryModalDisplayed: false,
  isTileEditorDisplayed: false,
  isWorldSettingsModalDisplayed: false,
  isImageLibraryDisplayed: false,
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {

  SET_world_selectedTilePos = 'worldReducer_SET_world_selectedTilePos',
  SET_world_isTileLibraryModalDisplayed = 'SET_world_isTileLibraryModalDisplayed',

  SET_world_isTileEditorDisplayed = 'worldReducer_SET_world_isTileEditorDisplayed',
  SET_world_isWorldSettingsModalDisplayed = 'worldReducer_SET_world_isWorldSettingsModalDisplayed',
  SET_world_isImageLibraryDisplayed = 'worldReducer_SET_world_isImageLibraryDisplayed',


  RESET = 'worldReducer_RESET',
}

export interface SET_world_selectedTilePosAction extends ActionBase {
  readonly type: ActionType.SET_world_selectedTilePos
  readonly selectedTilePos: PlainPoint | null
}

export interface SET_world_isTileLibraryModalDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_world_isTileLibraryModalDisplayed
  readonly isTileLibraryModalDisplayed: boolean
}

export interface SET_world_isTileEditorDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_world_isTileEditorDisplayed
  readonly isTileEditorDisplayed: boolean
}

export interface SET_world_isWorldSettingsModalDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_world_isWorldSettingsModalDisplayed
  readonly isWorldSettingsModalDisplayed: boolean
}

export interface SET_world_isImageLibraryDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_world_isImageLibraryDisplayed
  readonly isImageLibraryDisplayed: boolean
}

export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction

  | SET_world_selectedTilePosAction
  | SET_world_isTileLibraryModalDisplayedAction
  | SET_world_isTileEditorDisplayedAction
  | SET_world_isWorldSettingsModalDisplayedAction
  | SET_world_isImageLibraryDisplayedAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_world_selectedTilePos:
      return {
        ...state,
        selectedTilePos: action.selectedTilePos
      }
    case ActionType.SET_world_isTileLibraryModalDisplayed:
      return {
        ...state,
        isTileLibraryModalDisplayed: action.isTileLibraryModalDisplayed
      }
    case ActionType.SET_world_isTileEditorDisplayed:
      return {
        ...state,
        isTileEditorDisplayed: action.isTileEditorDisplayed
      }
    case ActionType.SET_world_isWorldSettingsModalDisplayed:
      return {
        ...state,
        isWorldSettingsModalDisplayed: action.isWorldSettingsModalDisplayed
      }
    case ActionType.SET_world_isImageLibraryDisplayed:
      return {
        ...state,
        isImageLibraryDisplayed: action.isImageLibraryDisplayed
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}
