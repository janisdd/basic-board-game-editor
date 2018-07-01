import {ImgSymbol} from "../../../../../types/drawing";
import {
  ActionType, Edit_imgSymbolRedo, Edit_imgSymbolUndo,
  SET_imgSymbol_displayIndexAction,
  SET_imgSymbol_displayNameAction,
  SET_imgSymbol_heightAction,
  SET_imgSymbol_imgStorageGuidAction, SET_imgSymbol_isMouseSelectionDisabledAction,
  SET_imgSymbol_rotationAction,
  SET_imgSymbol_skewXAction,
  SET_imgSymbol_skewYAction,
  SET_imgSymbol_widthAction,
  SET_imgSymbolsAction, UndoImgSymbolType
} from "./imgSymbolReducer";
import {MultiActions} from "../../../../../types/ui";
import {setPropertyEditor_ImageCreatedFromSymbolId} from "../../imgProperties/actions";
import {swapDisplayIndexWithGuid} from "../../../../../helpers/someIndexHelper";


export function set_imgSymbols(imgSymbols: ReadonlyArray<ImgSymbol>): SET_imgSymbolsAction {
  return {
    type: ActionType.SET_imgSymbols,
    imgSymbols,
  }
}

//we need an extra function to set all dependent imgs symbol ref to null
export function remove_imgSymbol(symbol: ImgSymbol, allImgSymbols: ReadonlyArray<ImgSymbol>): MultiActions {
  return (dispatch, getState) => {

    swapDisplayIndexWithGuid(
      symbol,
      symbol.displayIndex + 1,
      false,
      true,
      allImgSymbols.length,
      allImgSymbols,
      (objId: string, newDisplayIndex: number) => dispatch(set_imgSymbol_displayIndex(objId, newDisplayIndex))
    )
    const newList = getState().imgSymbolState.present.filter(p => p.guid !== symbol.guid)

    for (const imgFields  of getState().tileEditorImgShapesState.present) {
      if (imgFields.createdFromSymbolGuid === symbol.guid) {
        dispatch(setPropertyEditor_ImageCreatedFromSymbolId(imgFields.id, null))
      }
    }

    dispatch(set_imgSymbols(newList))
  }
}

export function set_imgSymbol_width(imgSymbolGuid: string, width: number): SET_imgSymbol_widthAction {
  return {
    type: ActionType.SET_imgSymbol_width,
    imgSymbolGuid,
    width
  }
}


export function set_imgSymbol_height(imgSymbolGuid: string, height: number): SET_imgSymbol_heightAction {
  return {
    type: ActionType.SET_imgSymbol_height,
    imgSymbolGuid,
    height
  }
}

export function set_imgSymbol_rotation(imgSymbolGuid: string, rotation: number): SET_imgSymbol_rotationAction {
  return {
    type: ActionType.SET_imgSymbol_rotation,
    imgSymbolGuid,
    rotationInDegree: rotation
  }
}

export function set_imgSymbol_imgStorageGuid(imgSymbolGuid: string, imgGuid: string | null): SET_imgSymbol_imgStorageGuidAction {
  return {
    type: ActionType.SET_imgSymbol_imgStorageGuid,
    imgSymbolGuid,
    imgGuid
  }
}


export function set_imgSymbol_displayIndex(imgSymbolGuid: string, displayIndex: number): SET_imgSymbol_displayIndexAction {
  return {
    type: ActionType.SET_imgSymbol_displayIndex,
    imgSymbolGuid,
    displayIndex
  }
}


export function set_imgSymbol_displayName(imgSymbolGuid: string, displayName: string): SET_imgSymbol_displayNameAction {
  return {
    type: ActionType.SET_imgSymbol_displayName,
    imgSymbolGuid,
    displayName
  }
}

export function set_imgSymbol_skewX(imgSymbolGuid: string, skewX: number): SET_imgSymbol_skewXAction {
  return {
    type: ActionType.SET_imgSymbol_skewX,
    imgSymbolGuid,
    skewX
  }
}

export function set_imgSymbol_skewY(imgSymbolGuid: string, skewY: number): SET_imgSymbol_skewYAction {
  return {
    type: ActionType.SET_imgSymbol_skewY,
    imgSymbolGuid,
    skewY
  }
}

export function set_imgSymbol_isMouseSelectionDisabled(imgSymbolGuid: string, isMouseDisabled: boolean): SET_imgSymbol_isMouseSelectionDisabledAction {
  return {
    type: ActionType.SET_imgSymbol_isMouseSelectionDisabled,
    imgSymbolGuid,
    isMouseSelectionDisabled: isMouseDisabled
  }
}

export function edit_imgSymbolUndo(): Edit_imgSymbolUndo {
  return {
    type: UndoImgSymbolType.undo
  }
}

export function edit_imgSymbolRedo(): Edit_imgSymbolRedo {
  return {
    type: UndoImgSymbolType.redo
  }
}