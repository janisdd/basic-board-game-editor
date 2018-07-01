import {Action} from "redux";
import {WorldTileSurrogate} from "../../../../../simulation/machine/machineState";
import {ActionType, SET_worldTilesAction, UndoType} from "./tileSurrogateReducer";


export function set_world_tiles(tileSurrogates: ReadonlyArray<WorldTileSurrogate>): SET_worldTilesAction {
  return {
    type: ActionType.SET_worldTiles,
    tileSurrogates
  }
}

export function world_tileSurrogates_undo(): Action {
  return {
    type: UndoType.undo,
  }
}

export function world_tileSurrogates_redo(): Action {
  return {
    type: UndoType.redo,
  }
}