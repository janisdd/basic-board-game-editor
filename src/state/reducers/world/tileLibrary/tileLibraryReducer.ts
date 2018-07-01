import {Action} from "redux";
import {Tile} from "../../../../types/world";
import {notExhaustive} from "../../_notExhausiveHelper";
import {predefTiles} from "./preDefTiles";


let exampleWorld: ReadonlyArray<Tile> = predefTiles

export type State = {
  readonly possibleTiles: ReadonlyArray<Tile>
}

export const initial: State = {
  possibleTiles: exampleWorld,
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  SET_possibleTiles = 'tileLibraryReducer_SET_possibleTiles',
  RESET = 'tileLibraryReducer_RESET',
}


export interface SET_possibleTilesAction extends ActionBase {
  readonly type: ActionType.SET_possibleTiles
  readonly possibleTiles: ReadonlyArray<Tile>
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_possibleTilesAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_possibleTiles:
      return {
        ...state,
        possibleTiles: action.possibleTiles

      }
    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

