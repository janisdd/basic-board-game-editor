import {Action} from "redux";
import {notExhaustive} from "../_notExhausiveHelper";
import {defaultGameInstructionEditorFontSize, defaultGameInstructionPreviewFontSize} from "../../../constants";

export type State = {
  readonly markdown: string
  readonly verticalGripperPositionInPercentage: number
  readonly previewFontSize: number
  readonly editorFontSize: number

  readonly isActionResultCopyModalDisplayed: boolean
  /**
   * the text the user can copy in the modal
   */
  readonly actionResultCopyText: string
}


export const initial: State = {
  markdown: `# 123

das ist ein test....

ende`,
  verticalGripperPositionInPercentage: 50,

  previewFontSize: defaultGameInstructionPreviewFontSize,
  editorFontSize: defaultGameInstructionEditorFontSize,

  isActionResultCopyModalDisplayed: false,
  actionResultCopyText: '',
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  SET_markdown = 'gameInstructionsEditorReducer_SET_markdown',
  SET_verticalGripperPositionInPercentage = 'gameInstructionsEditorReducer_SET_verticalGripperPositionInPercentage',

  SET_previewFontSize = 'gameInstructionsEditorReducer_SET_previewFontSize',
  SET_editorFontSize = 'gameInstructionsEditorReducer_SET_editorFontSize',

  SET_isActionResultCopyModalDisplayed = 'gameInstructionsEditorReducer_SET_isActionResultCopyModalDisplayed',
  SET_actionResultCopyText = 'gameInstructionsEditorReducer_SET_actionResultCopyText',

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


export interface SET_previewFontSizeAction extends ActionBase {
  readonly type: ActionType.SET_previewFontSize
  readonly previewFontSize: number
}

export interface SET_editorFontSizeAction extends ActionBase {
  readonly type: ActionType.SET_editorFontSize
  readonly editorFontSize: number
}

export interface SET_isActionResultCopyModalDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_isActionResultCopyModalDisplayed
  readonly isActionResultCopyModalDisplayed: boolean
}

export interface SET_actionResultCopyTextAction extends ActionBase {
  readonly type: ActionType.SET_actionResultCopyText
  readonly actionResultCopyText: string
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_markdownAction
  | SET_verticalGripperPositionInPercentageAction
  | SET_previewFontSizeAction
  | SET_editorFontSizeAction

  | SET_isActionResultCopyModalDisplayedAction
  | SET_actionResultCopyTextAction


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

    case ActionType.SET_previewFontSize:
      return {
        ...state,
        previewFontSize: action.previewFontSize
      }
    case ActionType.SET_editorFontSize:
      return {
        ...state,
        editorFontSize: action.editorFontSize
      }

    case ActionType.SET_isActionResultCopyModalDisplayed:
      return {
        ...state,
        isActionResultCopyModalDisplayed: action.isActionResultCopyModalDisplayed
      }

    case ActionType.SET_actionResultCopyText:
      return {
        ...state,
        actionResultCopyText: action.actionResultCopyText
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

