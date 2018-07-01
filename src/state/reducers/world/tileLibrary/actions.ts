import {ActionType, SET_possibleTilesAction} from "./tileLibraryReducer";
import {Tile} from "../../../../types/world";


export function set_tileLibrary_possibleTiles(possibleTiles: ReadonlyArray<Tile>): SET_possibleTilesAction {
  return {
    type: ActionType.SET_possibleTiles,
    possibleTiles
  }
}

