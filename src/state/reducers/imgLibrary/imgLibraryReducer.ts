import {Action} from "redux";
import { ImgStorage} from "../../../externalStorage/imgStorage";
import {notExhaustive} from "../_notExhausiveHelper";
import {replaceProperty, replacePropertyByGuid} from "../../../helpers/functionHelpers";
import {ImageAssetSurrogate} from "../../../types/world";

export type State = ReadonlyArray<ImageAssetSurrogate>

//the real imgs are stored in src/externalStorage/imgStorage.ts

export const initial: State = []

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  ADD_img = 'imgLibraryReducer_ADD_img',
  REMOVE_img = 'imgLibraryReducer_REMOVE_img',

  SET_imgDisplayIndex = 'imgLibraryReducer_SET_imgDisplayIndex',

  RESET = 'imgLibraryReducer_RESET',
}


export interface ADD_imgAction extends ActionBase {
  readonly type: ActionType.ADD_img
  readonly imgSurrogate: ImageAssetSurrogate
}

export interface REMOVE_imgAction extends ActionBase {
  readonly type: ActionType.REMOVE_img
  readonly imgSurrogateGuid: string
}

export interface SET_imgDisplayIndexAction extends ActionBase {
  readonly type: ActionType.SET_imgDisplayIndex
  readonly imgSurrogateGuid: string
  readonly imgDisplayIndex: number
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | ADD_imgAction
  | REMOVE_imgAction

  | SET_imgDisplayIndexAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.REMOVE_img:

      //remove real img & surrogate
      ImgStorage.removeImg(action.imgSurrogateGuid)

      return state.filter(p => p.guid !== action.imgSurrogateGuid)


    case ActionType.ADD_img: {

      //the img itself should be added already to the img storage

      return state.concat(action.imgSurrogate)
    }

    case ActionType.SET_imgDisplayIndex:
      return replacePropertyByGuid(state, action.imgSurrogateGuid, (el => {
        return {
          ...el,
          displayIndex: action.imgDisplayIndex
        }
      }))


    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

