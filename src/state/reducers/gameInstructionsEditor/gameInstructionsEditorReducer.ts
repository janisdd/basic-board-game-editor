import {Action} from "redux";
import {notExhaustive} from "../_notExhausiveHelper";
import {defaultGameInstructionEditorFontSize, defaultGameInstructionPreviewFontSize} from "../../../constants";
import {CreateFieldTextExplanationListType} from "../../../helpers/markdownHelper";

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

  readonly isGameInstructionsEditorSettingsModalDisplayed: boolean

  /**
   * how to
   */
  readonly createFieldTextExplanationListAs: CreateFieldTextExplanationListType
  /**
   * true: replace numbers e.g. move 3 fields forward --> move [X] fields forward
   * false: field text is not changed move 3 fields forward
   */
  readonly createFieldTextExplanationListReplaceNumbers: boolean

  /**
   * the var name to replace the number with
   */
  readonly createFieldTextExplanationListReplaceVarName: string
  /**
   * the text to prepend to vars if we
   * @see createFieldTextExplanationListReplaceNumbers
   */
  readonly createFieldTextExplanationListReplacePrefixText: string

  /**
   * the text to append if we
   * @see createFieldTextExplanationListReplaceNumbers
   */
  readonly createFieldTextExplanationListReplacePostfixText: string

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

  isGameInstructionsEditorSettingsModalDisplayed: false,

  createFieldTextExplanationListAs: CreateFieldTextExplanationListType.definitionList,
  createFieldTextExplanationListReplaceNumbers: true,
  createFieldTextExplanationListReplaceVarName: 'X',
  createFieldTextExplanationListReplacePrefixText: '[',
  createFieldTextExplanationListReplacePostfixText: ']',
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


  SET_isGameInstructionsEditorSettingsModalDisplayed = 'gameInstructionsEditorReducer_SET_isGameInstructionsEditorSettingsModalDisplayed',

  SET_createFieldTextExplanationListAs = 'gameInstructionsEditorReducer_SET_createFieldTextExplanationListAs',
  SET_createFieldTextExplanationListReplaceNumbers = 'gameInstructionsEditorReducer_SET_createFieldTextExplanationListReplaceNumbers',
  SET_createFieldTextExplanationListReplaceVarName = 'gameInstructionsEditorReducer_SET_createFieldTextExplanationListReplaceVarName',
  SET_createFieldTextExplanationListReplacePrefixText = 'gameInstructionsEditorReducer_SET_createFieldTextExplanationListReplacePrefixText',
  SET_createFieldTextExplanationListReplacePostfixText = 'gameInstructionsEditorReducer_SET_createFieldTextExplanationListReplacePostfixText',

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

export interface set_isGameInstructionsEditorSettingsModalDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_isGameInstructionsEditorSettingsModalDisplayed
  readonly isGameInstructionsEditorSettingsModalDisplayed: boolean
}

export interface set_createFieldTextExplanationListAsAction extends ActionBase {
  readonly type: ActionType.SET_createFieldTextExplanationListAs
  readonly createFieldTextExplanationListAs: CreateFieldTextExplanationListType
}

export interface SET_createFieldTextExplanationListReplaceVarNameAction extends ActionBase {
  readonly type: ActionType.SET_createFieldTextExplanationListReplaceVarName
  readonly createFieldTextExplanationListReplaceVarName: string
}

export interface SET_createFieldTextExplanationListReplaceNumbersAction extends ActionBase {
  readonly type: ActionType.SET_createFieldTextExplanationListReplaceNumbers
  readonly createFieldTextExplanationListReplaceNumbers: boolean
}

export interface SET_createFieldTextExplanationListReplacePrefixTextAction extends ActionBase {
  readonly type: ActionType.SET_createFieldTextExplanationListReplacePrefixText
  readonly createFieldTextExplanationListReplacePrefixText: string
}

export interface SET_createFieldTextExplanationListReplacePostfixTextAction extends ActionBase {
  readonly type: ActionType.SET_createFieldTextExplanationListReplacePostfixText
  readonly createFieldTextExplanationListReplacePostfixText: string
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

  | set_isGameInstructionsEditorSettingsModalDisplayedAction
  | set_createFieldTextExplanationListAsAction
  |SET_createFieldTextExplanationListReplaceVarNameAction
  | SET_createFieldTextExplanationListReplaceNumbersAction
  | SET_createFieldTextExplanationListReplacePrefixTextAction
  | SET_createFieldTextExplanationListReplacePostfixTextAction


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
    case ActionType.SET_isGameInstructionsEditorSettingsModalDisplayed:
      return {
        ...state,
        isGameInstructionsEditorSettingsModalDisplayed: action.isGameInstructionsEditorSettingsModalDisplayed
      }


    case ActionType.SET_createFieldTextExplanationListAs:
      return {
        ...state,
        createFieldTextExplanationListAs: action.createFieldTextExplanationListAs
      }
    case ActionType.SET_createFieldTextExplanationListReplaceVarName:
      return {
        ...state,
        createFieldTextExplanationListReplaceVarName: action.createFieldTextExplanationListReplaceVarName
      }
    case ActionType.SET_createFieldTextExplanationListReplaceNumbers:
      return {
        ...state,
        createFieldTextExplanationListReplaceNumbers: action.createFieldTextExplanationListReplaceNumbers
      }
    case ActionType.SET_createFieldTextExplanationListReplacePrefixText:
      return {
        ...state,
        createFieldTextExplanationListReplacePrefixText: action.createFieldTextExplanationListReplacePrefixText
      }
    case ActionType.SET_createFieldTextExplanationListReplacePostfixText:
      return {
        ...state,
        createFieldTextExplanationListReplacePostfixText: action.createFieldTextExplanationListReplacePostfixText
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

