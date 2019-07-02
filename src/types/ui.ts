import {Action} from "redux";
import {RootState} from "../state";


/**
 * because we used z index the order of stage.addChild does not matter
 *
 * setChildIndex e.g. will place the child at index 0
 * next also insert at 0 --> last has now index 1
 * --> index 0 is drawn first so we need to revert the order to preserve the order when drawing)
 *
 * However this is only important for tile editor because other (e.g. world) we have only one shape per z-index!!
 */
export interface ZIndexCache {
  [zIndex: number]: createjs.DisplayObject[]
}

export interface CheckboxData {
  checked: boolean
}

export type MultiActions = (dispatch: <T>(action: Action | MultiActions | void) => void, getState: () => RootState) => void
