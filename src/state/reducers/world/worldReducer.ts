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


  //--- ar settings are not saved in the world because very experimental...
  readonly isArFrameDisplayed: boolean
  readonly isArJsEnabled: boolean
  readonly tileSizeInMeters: number
  readonly playerTokenSizeInMeters: number

  //--- scroll positions
  readonly tileEditorRightPropertyEditorTabScrollY: number
  readonly tileEditorRightBorderPointsTabScrollY: number
  readonly tileEditorRightSimulationTabScrollY: number
}


export const initial: State = {
  selectedTilePos: null,
  isTileLibraryModalDisplayed: false,
  isTileEditorDisplayed: false,
  isWorldSettingsModalDisplayed: false,
  isImageLibraryDisplayed: false,
  isArFrameDisplayed: false,
  isArJsEnabled: false,
  tileSizeInMeters: 10,
  playerTokenSizeInMeters: 0.5,

  tileEditorRightPropertyEditorTabScrollY: 0,
  tileEditorRightBorderPointsTabScrollY: 0,
  tileEditorRightSimulationTabScrollY: 0,
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


  SET_isArFrameDisplayed = 'worldReducer_SET_isArFrameDisplayed',
  SET_isArJsEnabled = 'worldReducer_SET_isArJsEnabled',
  SET_tileSizeInMeters = 'worldReducer_SET_tileSizeInMeters',
  SET_playerTokenSizeInMeters = 'worldReducer_SET_playerTokenSizeInMeters',

  SET_tileEditorRightPropertyEditorTabScrollY = 'worldReducer_SET_tileEditorRightPropertyEditorTabScrollY',
  SET_tileEditorRightBorderPointsTabScrollY = 'worldReducer_SET_tileEditorRightBorderPointsTabScrollY',
  SET_tileEditorRightSimulationTabScrollY = 'worldReducer_SET_tileEditorRightSimulationTabScrollY',

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


//--- ar settings are not saved in the world because very experimental...

export interface SET_isArJsEnabledAction extends ActionBase {
  readonly type: ActionType.SET_isArJsEnabled
  readonly isArJsEnabled: boolean
}

export interface SET_tileSizeInMetersAction extends ActionBase {
  readonly type: ActionType.SET_tileSizeInMeters
  readonly tileSizeInMeters: number
}

export interface SET_playerTokenSizeInMetersAction extends ActionBase {
  readonly type: ActionType.SET_playerTokenSizeInMeters
  readonly playerTokenSizeInMeters: number
}

export interface SET_isArFrameDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_isArFrameDisplayed
  readonly isArFrameDisplayed: boolean
}

//scroll positions

export interface SET_tileEditorRightPropertyEditorTabScrollYAction extends ActionBase {
  readonly type: ActionType.SET_tileEditorRightPropertyEditorTabScrollY
  readonly tileEditorRightPropertyEditorTabScrollY: number
}

export interface SET_tileEditorRightBorderPointsTabScrollYAction extends ActionBase {
  readonly type: ActionType.SET_tileEditorRightBorderPointsTabScrollY
  readonly tileEditorRightBorderPointsTabScrollY: number
}

export interface SET_tileEditorRightSimulationTabScrollYAction extends ActionBase {
  readonly type: ActionType.SET_tileEditorRightSimulationTabScrollY
  readonly tileEditorRightSimulationTabScrollY: number
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

  | SET_isArFrameDisplayedAction
  | SET_isArJsEnabledAction
  | SET_tileSizeInMetersAction
  | SET_playerTokenSizeInMetersAction

  | SET_tileEditorRightPropertyEditorTabScrollYAction
  | SET_tileEditorRightBorderPointsTabScrollYAction
  | SET_tileEditorRightSimulationTabScrollYAction


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

    case ActionType.SET_isArJsEnabled:
      return {
        ...state,
        isArJsEnabled: action.isArJsEnabled
      }
    case ActionType.SET_tileSizeInMeters:
      return {
        ...state,
        tileSizeInMeters: action.tileSizeInMeters
      }
    case ActionType.SET_playerTokenSizeInMeters:
      return {
        ...state,
        playerTokenSizeInMeters: action.playerTokenSizeInMeters
      }
    case ActionType.SET_isArFrameDisplayed:
      return {
        ...state,
        isArFrameDisplayed: action.isArFrameDisplayed
      }

    case ActionType.SET_tileEditorRightPropertyEditorTabScrollY:
      return {
        ...state,
        tileEditorRightPropertyEditorTabScrollY: action.tileEditorRightPropertyEditorTabScrollY
      }
    case ActionType.SET_tileEditorRightBorderPointsTabScrollY:
      return {
        ...state,
        tileEditorRightBorderPointsTabScrollY: action.tileEditorRightBorderPointsTabScrollY
      }
    case ActionType.SET_tileEditorRightSimulationTabScrollY:
      return {
        ...state,
        tileEditorRightSimulationTabScrollY: action.tileEditorRightSimulationTabScrollY
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}
