import {ActionType, ADD_imgAction, REMOVE_imgAction, SET_imgDisplayIndexAction} from "./imgLibraryReducer";
import {MultiActions} from "../../../types/ui";
import {setPropertyEditor_ImageImgGuid} from "../tileEditor/imgProperties/actions";
import {set_imgSymbol_imgStorageGuid} from "../tileEditor/symbols/imgSymbols/actions";
import {ImageAssetSurrogate} from "../../../types/world";
import {setPropertyEditor_field_backgroundImgGuid} from "../tileEditor/fieldProperties/actions";
import {set_fieldSymbol_backgroundImgGuid} from "../tileEditor/symbols/fieldSymbols/actions";


export function imgLibrary_addImg(imgSurrogate: ImageAssetSurrogate): ADD_imgAction {
  return {
    type: ActionType.ADD_img,
    imgSurrogate
  }
}

export function _imgLibrary_removeImg(imgSurrogateGuid: string): REMOVE_imgAction {
  return {
    type: ActionType.REMOVE_img,
    imgSurrogateGuid
  }
}

export function imgLibrary_removeImg(imgSurrogateGuid: string): MultiActions {
  return (dispatch, getState) => {

    //set all img shapes & symbol img ids to null if the removed img was referenced

    const imgShapes = getState().tileEditorImgShapesState.present
    const imgSymbols = getState().imgSymbolState.present

    const fieldShapes = getState().tileEditorFieldShapesState.present
    const fieldSymbols = getState().fieldSymbolState.present

    for (const imgShape of imgShapes) {
      if (imgShape.imgGuid === imgSurrogateGuid) {
        dispatch(setPropertyEditor_ImageImgGuid(imgShape.id, null))
      }
    }

    for (const imgSymbol of imgSymbols) {
      if (imgSymbol.imgGuid === imgSurrogateGuid) {
        dispatch(set_imgSymbol_imgStorageGuid(imgSymbol.guid, null))
      }
    }

    for (const fieldShape of fieldShapes) {
      if (fieldShape.backgroundImgGuid === imgSurrogateGuid) {
        dispatch(setPropertyEditor_field_backgroundImgGuid(fieldShape.id, null))
      }
    }

    for (const fieldSymbol of fieldSymbols) {
      if (fieldSymbol.backgroundImgGuid === imgSurrogateGuid) {
        dispatch(set_fieldSymbol_backgroundImgGuid(fieldSymbol.guid, null))
      }
    }


    dispatch(_imgLibrary_removeImg(imgSurrogateGuid))
  }
}

export function imgLibrary_set_imgDisplayIndexAction(imgSurrogateGuid: string, imgDisplayIndex: number): SET_imgDisplayIndexAction {
  return {
    type: ActionType.SET_imgDisplayIndex,
    imgSurrogateGuid,
    imgDisplayIndex
  }
}


