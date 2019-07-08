import {Action} from "redux";
import {notExhaustive} from "./_notExhausiveHelper";


export enum AvailableAppTabs {
  guide = 0,
  gameInstructionEditor ,
  worldEditor,
  variableIndicator,
  tileEditor
}

export type State = {

  readonly activeTabIndex: AvailableAppTabs
}

export const initial: State = {
  activeTabIndex: AvailableAppTabs.gameInstructionEditor, //TODO worldEditor
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  SET_app_activeTabIndex = 'appReducer_SET_app_activeTabIndex',
  RESET = 'appReducer_RESET',
}


export interface SET_app_activeTabIndexAction extends ActionBase {
  readonly type: ActionType.SET_app_activeTabIndex
  readonly activeTabIndex: AvailableAppTabs
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_app_activeTabIndexAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_app_activeTabIndex:
      return {
        ...state,
        activeTabIndex: action.activeTabIndex

      }
    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

