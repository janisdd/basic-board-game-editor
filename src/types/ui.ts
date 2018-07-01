import {Action} from "redux";
import {RootState} from "../state";


export interface ZIndexCache {
  [zIndex: number]: createjs.DisplayObject[]
}

export interface CheckboxData {
  checked: boolean
}

export type MultiActions = (dispatch: <T>(action: Action | MultiActions | void) => void, getState: () => RootState) => void