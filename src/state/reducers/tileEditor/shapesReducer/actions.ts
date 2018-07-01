import {ActionType, LastEditedShapeType, UndoType} from "./shapesReducer";
import {MultiActions} from "../../../../types/ui";
import {notExhaustive} from "../../_notExhausiveHelper";
import {edit_fieldShapeRedo, edit_fieldShapeUndo} from "../fieldProperties/actions";
import {edit_imgRedo, edit_imgUndo} from "../imgProperties/actions";
import {edit_lineRedo, edit_lineUndo} from "../lineProperties/actions";
import {Action} from "redux";
import {clearTileEditorEditShapesType} from "../../../../constants";
import {ActionTypes} from "redux-undo";
import {edit_fieldSymbolRedo, edit_fieldSymbolUndo} from "../symbols/fieldSymbols/actions";
import {edit_imgSymbolRedo, edit_imgSymbolUndo} from "../symbols/imgSymbols/actions";
import {edit_lineSymbolRedo, edit_lineSymbolUndo} from "../symbols/lineSymbols/actions";


export function undo_shapeEditor(): MultiActions {
  return (dispatch, getState) => {

    const lastEditedShapeType = getState().shapesReducerState.present.lastEditedShapeType

    switch (lastEditedShapeType) {
      case LastEditedShapeType.fieldShape: {
        dispatch(edit_fieldShapeUndo())
        break
      }

      case LastEditedShapeType.imgShape: {
        dispatch(edit_imgUndo())
        break
      }

      case LastEditedShapeType.lineShape: {
        dispatch(edit_lineUndo())
        break
      }

      case LastEditedShapeType.fieldSymbol: {
        dispatch(edit_fieldSymbolUndo())
        break
      }
      case LastEditedShapeType.imgSymbol: {
        dispatch(edit_imgSymbolUndo())
        break
      }
      case LastEditedShapeType.lineSymbol: {
        dispatch(edit_lineSymbolUndo())
        break
      }

      default:
        notExhaustive(lastEditedShapeType)
    }

    dispatch({
      type: UndoType.undo
    })

  }
}

export function redo_shapeEditor(): MultiActions {
  return (dispatch, getState) => {


    dispatch({
      type: UndoType.redo
    })

    //use future because not yet applied
    const lastEditedShapeType = getState().shapesReducerState.present.lastEditedShapeType

    switch (lastEditedShapeType) {
      case LastEditedShapeType.fieldShape: {
        dispatch(edit_fieldShapeRedo())
        break
      }

      case LastEditedShapeType.imgShape: {
        dispatch(edit_imgRedo())
        break
      }

      case LastEditedShapeType.lineShape: {
        dispatch(edit_lineRedo())
        break
      }

      case LastEditedShapeType.fieldSymbol: {
        dispatch(edit_fieldSymbolRedo())
        break
      }
      case LastEditedShapeType.imgSymbol: {
        dispatch(edit_imgSymbolRedo())
        break
      }
      case LastEditedShapeType.lineSymbol: {
        dispatch(edit_lineSymbolRedo())
        break
      }

      default:
        notExhaustive(lastEditedShapeType)
    }

  }
}

export function reset_shapeEditor(): MultiActions {
  return (dispatch, getState) => {

    dispatch({
      type: ActionType.RESET
    })
  }
}

export function clearHistory_shapeEditor(): Action {
  return {
    type: clearTileEditorEditShapesType
  }
}