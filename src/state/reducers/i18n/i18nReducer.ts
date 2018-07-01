import {Action} from "redux";
import {KnownLangs} from "../../../../i18n/i18nRoot";
import {notExhaustive} from "../_notExhausiveHelper";

export type State = {
  readonly langId: KnownLangs
}

export const initial: State = {
  langId: KnownLangs.english,
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  RESET = 'i18nReducer_RESET',
}


// export interface SET_usernameAction extends ActionBase {
//   readonly type: ActionType.SET_username
//   readonly id: string
// }


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  // | SET_usernameAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    // case ActionType.SET_username:
    //   return {
    //     ...state,
    //     username: action.username
    //
    //   }
    case ActionType.RESET:
      return initial

    default:
      // notExhaustive(action)
      return state
  }
}

