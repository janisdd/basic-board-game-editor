import {LineSymbol} from "../../../../../types/drawing";
import {
  ActionType,
  Edit_lineSymbolRedo,
  Edit_lineSymbolUndo,
  SET_lineSymbol_arrowHeightAction,
  SET_lineSymbol_arrowWidthAction,
  SET_lineSymbol_colorAction,
  SET_lineSymbol_dashArrayAction,
  SET_lineSymbol_displayIndexAction,
  SET_lineSymbol_displayNameAction,
  SET_lineSymbol_hasEndArrowAction,
  SET_lineSymbol_hasStartArrowAction,
  SET_lineSymbol_thicknessInPxAction,
  SET_lineSymbolsAction, UndoLineSymbolType,
} from "./lineSymbolReducer";
import {MultiActions} from "../../../../../types/ui";
import {set_imgSymbol_displayIndex} from "../imgSymbols/actions";
import {setPropertyEditor_LineCreatedFromSymbolId} from "../../lineProperties/actions";
import { swapDisplayIndexWithGuid} from "../../../../../helpers/someIndexHelper";


export function set_lineSymbols(lineSymbols: ReadonlyArray<LineSymbol>): SET_lineSymbolsAction {
  return {
    type: ActionType.SET_lineSymbols,
    lineSymbols,
  }
}

//we need an extra function to set all dependent lines symbol ref to null
export function remove_lineSymbol(symbol: LineSymbol, allLineSymbols: ReadonlyArray<LineSymbol>): MultiActions {
  return (dispatch, getState) => {

    swapDisplayIndexWithGuid(
      symbol,
      symbol.displayIndex + 1,
      false,
      true,
      allLineSymbols.length,
      allLineSymbols,
      (objId: string, newDisplayIndex: number) => dispatch(set_imgSymbol_displayIndex(objId, newDisplayIndex))
    )
    const newList = getState().lineSymbolState.present.filter(p => p.guid !== symbol.guid)

    for (const lineFields  of getState().tileEditorLineShapeState.present) {
      if (lineFields.createdFromSymbolGuid === symbol.guid) {
        dispatch(setPropertyEditor_LineCreatedFromSymbolId(lineFields.id, null))
      }
    }

    dispatch(set_lineSymbols(newList))
  }
}


export function set_lineSymbol_color(lineSymbolGuid: string, color: string): SET_lineSymbol_colorAction {
  return {
    type: ActionType.SET_lineSymbol_color,
    lineSymbolGuid,
    color
  }
}

export function set_lineSymbol_thicknessInPx(lineSymbolGuid: string, thicknessInPx: number): SET_lineSymbol_thicknessInPxAction {
  return {
    type: ActionType.SET_lineSymbol_thicknessInPx,
    lineSymbolGuid,
    lineThicknessInPx: thicknessInPx
  }
}

export function set_lineSymbol_dashArray(lineSymbolGuid: string, dashArray: number[]): SET_lineSymbol_dashArrayAction {
  return {
    type: ActionType.SET_lineSymbol_dashArray,
    lineSymbolGuid,
    dashArray
  }
}

export function set_lineSymbol_hasStartArrow(lineSymbolGuid: string, hasStartArrow: boolean): SET_lineSymbol_hasStartArrowAction {
  return {
    type: ActionType.SET_lineSymbol_hasStartArrow,
    lineSymbolGuid,
    hasStartArrow
  }
}

export function set_lineSymbol_hasEndArrow(lineSymbolGuid: string, hasEndArrow: boolean): SET_lineSymbol_hasEndArrowAction {
  return {
    type: ActionType.SET_lineSymbol_hasEndArrow,
    lineSymbolGuid,
    hasEndArrow
  }
}

export function set_lineSymbol_displayIndex(lineSymbolGuid: string, displayIndex: number): SET_lineSymbol_displayIndexAction {
  return {
    type: ActionType.SET_lineSymbol_displayIndex,
    lineSymbolGuid,
    displayIndex
  }
}

export function set_lineSymbol_arrowWidth(lineSymbolGuid: string, arrowWidth: number): SET_lineSymbol_arrowWidthAction {
  return {
    type: ActionType.SET_lineSymbol_arrowWidth,
    lineSymbolGuid,
    arrowWidth
  }
}

export function set_lineSymbol_arrowHeight(lineSymbolGuid: string, arrowHeight: number): SET_lineSymbol_arrowHeightAction {
  return {
    type: ActionType.SET_lineSymbol_arrowHeight,
    lineSymbolGuid,
    arrowHeight
  }
}

export function set_lineSymbol_displayName(lineSymbolGuid: string, displayName: string): SET_lineSymbol_displayNameAction {
  return {
    type: ActionType.SET_lineSymbol_displayName,
    lineSymbolGuid,
    displayName
  }
}

export function edit_lineSymbolUndo(): Edit_lineSymbolUndo {
  return {
    type: UndoLineSymbolType.undo
  }
}


export function edit_lineSymbolRedo(): Edit_lineSymbolRedo {
  return {
    type: UndoLineSymbolType.redo
  }
}