import {Action} from "redux";
import {notExhaustive} from "../_notExhausiveHelper";

export type State = {
  readonly markdown: string
  readonly verticalGripperPositionInPercentage: number
}


export const initial: State = {
  markdown: '',
  verticalGripperPositionInPercentage: 50
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  SET_markdown = 'gameInstructionsEditorReducer_SET_markdown',
  SET_verticalGripperPositionInPercentage = 'gameInstructionsEditorReducer_SET_verticalGripperPositionInPercentage',
  RESET = 'gameInstructionsEditorReducer_RESET',
}


export interface SET_markdownAction extends ActionBase {
  readonly type: ActionType.SET_markdown
  readonly markdown: string
}

export interface SET_verticalGripperPositionInPercentageAction extends ActionBase {
  readonly type: ActionType.SET_verticalGripperPositionInPercentage
  readonly verticalGripperPositionInPercentage: number
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_markdownAction
  | SET_verticalGripperPositionInPercentageAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_markdown:
      return {
        ...state,
        markdown: action.markdown
      }
    case ActionType.SET_verticalGripperPositionInPercentage:
      return {
        ...state,
        verticalGripperPositionInPercentage: action.verticalGripperPositionInPercentage
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

