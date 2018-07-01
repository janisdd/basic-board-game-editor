import {Action} from "redux";
import {WorldTileSurrogate} from "../../../../../simulation/machine/machineState";
import {notExhaustive} from "../../_notExhausiveHelper";
import undoable, {includeAction} from "redux-undo";

export type State = ReadonlyArray<WorldTileSurrogate>


export const initial: State = []

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  SET_worldTiles = 'tileSurrogateReducer_SET_worldTiles',
  RESET = 'tileSurrogateReducer_RESET',
}


export interface SET_worldTilesAction extends ActionBase {
  readonly type: ActionType.SET_worldTiles
  readonly tileSurrogates: ReadonlyArray<WorldTileSurrogate>
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_worldTilesAction


export function _reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_worldTiles:
      return [...action.tileSurrogates]

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

export enum UndoType {
  undo = 'worldReducer_undo',
  redo = 'worldReducer_redo',
}

export const reducer =  undoable(_reducer, {
  undoType: UndoType.undo,
  redoType: UndoType.redo,
  limit: 50
})