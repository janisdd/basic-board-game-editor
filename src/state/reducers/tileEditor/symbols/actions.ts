import {
  ActionType,
  SET_selectedFieldSymbolGuidAction,
  SET_selectedImgSymbolGuidAction,
  SET_selectedLineSymbolGuidAction
} from "./symbolsReducer";


export function set_selectedFieldSymbolGuid(selectedFieldSymbolGuid: string | null): SET_selectedFieldSymbolGuidAction {
  return {
    type: ActionType.SET_selectedFieldSymbolGuid,
    selectedFieldSymbolGuid
  }
}

export function set_selectedImgSymbolGuid(selectedImgSymbolGuid: string | null): SET_selectedImgSymbolGuidAction {
  return {
    type: ActionType.SET_selectedImgSymbolGuid,
    selectedImgSymbolGuid
  }
}

export function set_selectedLineSymbolGuid(selectedLineSymbolGuid: string | null): SET_selectedLineSymbolGuidAction {
  return {
    type: ActionType.SET_selectedLineSymbolGuid,
    selectedLineSymbolGuid
  }
}
