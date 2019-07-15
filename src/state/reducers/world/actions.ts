import {
  ActionBase,
  ActionType, SET_isArFrameDisplayedAction,
  SET_isArJsEnabledAction,
  SET_playerTokenSizeInMetersAction,
  SET_tileSizeInMetersAction,
  SET_world_isImageLibraryDisplayedAction,
  SET_world_isTileEditorDisplayedAction,
  SET_world_isTileLibraryModalDisplayedAction,
  SET_world_isWorldSettingsModalDisplayedAction,
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

export function set_world_isImageLibraryDisplayed(isImageLibraryDisplayed: boolean): SET_world_isImageLibraryDisplayedAction {
  return {
    type: ActionType.SET_world_isImageLibraryDisplayed,
    isImageLibraryDisplayed
  }
}



//--- ar settings are not saved in the world because very experimental...

export function set_world_isArFrameDisplayed(isArFrameDisplayed: boolean): SET_isArFrameDisplayedAction {
  return {
    type: ActionType.SET_isArFrameDisplayed,
    isArFrameDisplayed
  }
}

export function set_world_isArJsEnabled(isArJsEnabled: boolean): SET_isArJsEnabledAction {
  return {
    type: ActionType.SET_isArJsEnabled,
    isArJsEnabled
  }
}

export function set_world_tileSizeInMeters(tileSizeInMeters: number): SET_tileSizeInMetersAction {
  return {
    type: ActionType.SET_tileSizeInMeters,
    tileSizeInMeters
  }
}

export function set_world_playerTokenSizeInMeters(playerTokenSizeInMeters: number): SET_playerTokenSizeInMetersAction {
  return {
    type: ActionType.SET_playerTokenSizeInMeters,
    playerTokenSizeInMeters
  }
}

