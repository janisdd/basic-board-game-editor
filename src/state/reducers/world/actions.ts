import {
  ActionType,
  SET_world_isTileEditorDisplayedAction,
  SET_world_isTileLibraryModalDisplayedAction, SET_world_isWorldSettingsModalDisplayedAction,
  SET_world_selectedTilePosAction,
} from "./worldReducer";
import {PlainPoint} from "../../../types/drawing";


export function set_world_selectedTilePos(selectedTilePos: PlainPoint | null): SET_world_selectedTilePosAction {
  return {
    type: ActionType.SET_world_selectedTilePos,
    selectedTilePos
  }
}

export function set_world_isTileLibraryModalDisplayed(isTileLibraryModalDisplayed: boolean): SET_world_isTileLibraryModalDisplayedAction {
  return {
    type: ActionType.SET_world_isTileLibraryModalDisplayed,
    isTileLibraryModalDisplayed
  }
}

export function set_world_isTileEditorDisplayed(isTileEditorDisplayed: boolean): SET_world_isTileEditorDisplayedAction {
  return {
    type: ActionType.SET_world_isTileEditorDisplayed,
    isTileEditorDisplayed
  }
}

export function set_world_isWorldSettingsModalDisplayed(isWorldSettingsModalDisplayed: boolean): SET_world_isWorldSettingsModalDisplayedAction {
  return {
    type: ActionType.SET_world_isWorldSettingsModalDisplayed,
    isWorldSettingsModalDisplayed
  }
}
