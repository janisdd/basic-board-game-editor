import {Action} from "redux";
import {notExhaustive} from "../_notExhausiveHelper";
import {defaultGameInstructionEditorFontSize, defaultGameInstructionPreviewFontSize} from "../../../constants";

const gameInstructionsTemplate = require('../../../components/gameInstructionsEditor/generalGameInstructionsTemplates/de/general.md')
const varListElementTemplate = require('../../../components/gameInstructionsEditor/generalGameInstructionsTemplates/de/varListElement.md')
const fieldTextExplanationElementTemplate = require('../../../components/gameInstructionsEditor/generalGameInstructionsTemplates/de/fieldTextExplanationListElement.md')

export type GameInstructionsSettings = {
  readonly markdown: string

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

  readonly previewFontSize: number
  readonly editorFontSize: number

  /**
   * template for the general game instructions where we replace known placeholders...
   */
  readonly generalGameInstructionsTemplate: string

  /**
   * in general game instruction one will likely explain used variables via a list
   * this is the template for the list elements
   */
  readonly generalGameInstructionsVariableListElementTemplate: string

  /**
   * in general game instruction one will likely explain field texts via a list
   * this is the template for the list elements
   */
  readonly generalGameInstructionsFieldTextExplanationListElementTemplate: string
}

export type State = {

  readonly verticalGripperPositionOffsetInPx: number

  readonly isActionResultCopyModalDisplayed: boolean
  /**
   * the text the user can copy in the modal
   */
  readonly actionResultCopyText: string

  readonly isGameInstructionsEditorSettingsModalDisplayed: boolean

  readonly isMarkdownHelpModalDisplayed: boolean

  readonly isImageLibraryDisplayed: boolean

} & GameInstructionsSettings


export const initial: State = {
  markdown: ``,
  verticalGripperPositionOffsetInPx: 0,

  previewFontSize: defaultGameInstructionPreviewFontSize,
  editorFontSize: defaultGameInstructionEditorFontSize,

  isActionResultCopyModalDisplayed: false,
  actionResultCopyText: '',

  isGameInstructionsEditorSettingsModalDisplayed: false,
  isMarkdownHelpModalDisplayed: false,

  createFieldTextExplanationListReplaceNumbers: true,
  createFieldTextExplanationListReplaceVarName: 'X',
  createFieldTextExplanationListReplacePrefixText: '[',
  createFieldTextExplanationListReplacePostfixText: ']',

  isImageLibraryDisplayed: false,
  generalGameInstructionsTemplate: gameInstructionsTemplate,
  generalGameInstructionsVariableListElementTemplate: varListElementTemplate,
  generalGameInstructionsFieldTextExplanationListElementTemplate: fieldTextExplanationElementTemplate,
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  SET_markdown = 'gameInstructionsEditorReducer_SET_markdown',
  SET_verticalGripperPositionOffsetInPx = 'gameInstructionsEditorReducer_SET_verticalGripperPositionOffsetInPx',

  SET_previewFontSize = 'gameInstructionsEditorReducer_SET_previewFontSize',
  SET_editorFontSize = 'gameInstructionsEditorReducer_SET_editorFontSize',

  SET_isActionResultCopyModalDisplayed = 'gameInstructionsEditorReducer_SET_isActionResultCopyModalDisplayed',
  SET_actionResultCopyText = 'gameInstructionsEditorReducer_SET_actionResultCopyText',


  SET_isGameInstructionsEditorSettingsModalDisplayed = 'gameInstructionsEditorReducer_SET_isGameInstructionsEditorSettingsModalDisplayed',
  SET_isMarkdownHelpModalDisplayed = 'gameInstructionsEditorReducer_SET_isMarkdownHelpModalDisplayed',
  SET_isImageLibraryDisplayed = 'gameInstructionsEditorReducer_SET_isImageLibraryDisplayed',

  SET_createFieldTextExplanationListAs = 'gameInstructionsEditorReducer_SET_createFieldTextExplanationListAs',
  SET_createFieldTextExplanationListReplaceNumbers = 'gameInstructionsEditorReducer_SET_createFieldTextExplanationListReplaceNumbers',
  SET_createFieldTextExplanationListReplaceVarName = 'gameInstructionsEditorReducer_SET_createFieldTextExplanationListReplaceVarName',
  SET_createFieldTextExplanationListReplacePrefixText = 'gameInstructionsEditorReducer_SET_createFieldTextExplanationListReplacePrefixText',
  SET_createFieldTextExplanationListReplacePostfixText = 'gameInstructionsEditorReducer_SET_createFieldTextExplanationListReplacePostfixText',

  SET_generalGameInstructionsTemplate = 'gameInstructionsEditorReducer_SET_generalGameInstructionsTemplate',
  SET_generalGameInstructionsVariableListElementTemplate = 'gameInstructionsEditorReducer_SET_generalGameInstructionsVariableListElementTemplate',
  SET_generalGameInstructionsFieldTextExplanationListElementTemplate = 'gameInstructionsEditorReducer_SET_generalGameInstructionsFieldTextExplanationListElementTemplate',


  SET_replaceGameInstructionsState = 'gameInstructionsEditorReducer_SET_replaceGameInstructionsState',
  RESET = 'gameInstructionsEditorReducer_RESET',
}


export interface SET_markdownAction extends ActionBase {
  readonly type: ActionType.SET_markdown
  readonly markdown: string
}

export interface SET_verticalGripperPositionOffsetInPxAction extends ActionBase {
  readonly type: ActionType.SET_verticalGripperPositionOffsetInPx
  readonly verticalGripperPositionOffsetInPx: number
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

export interface Set_isGameInstructionsEditorSettingsModalDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_isGameInstructionsEditorSettingsModalDisplayed
  readonly isGameInstructionsEditorSettingsModalDisplayed: boolean
}

export interface SET_isMarkdownHelpModalDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_isMarkdownHelpModalDisplayed
  readonly isMarkdownHelpModalDisplayed: boolean
}

export interface SET_isImageLibraryDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_isImageLibraryDisplayed
  readonly isImageLibraryDisplayed: boolean
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


export interface SET_generalGameInstructionsTemplateAction extends ActionBase {
  readonly type: ActionType.SET_generalGameInstructionsTemplate
  readonly generalGameInstructionsTemplate: string
}

export interface SET_generalGameInstructionsVariableListElementTemplateAction extends ActionBase {
  readonly type: ActionType.SET_generalGameInstructionsVariableListElementTemplate
  readonly generalGameInstructionsVariableListElementTemplate: string
}

export interface SET_generalGameInstructionsFieldTextExplanationListElementTemplateAction extends ActionBase {
  readonly type: ActionType.SET_generalGameInstructionsFieldTextExplanationListElementTemplate
  readonly generalGameInstructionsFieldTextExplanationListElementTemplate: string
}


export interface SET_replaceGameInstructionsStateAction extends ActionBase {
  readonly type: ActionType.SET_replaceGameInstructionsState
  readonly replaceGameInstructionsState: GameInstructionsSettings
}

export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_replaceGameInstructionsStateAction
  | SET_markdownAction
  | SET_verticalGripperPositionOffsetInPxAction
  | SET_previewFontSizeAction
  | SET_editorFontSizeAction

  | SET_isActionResultCopyModalDisplayedAction
  | SET_actionResultCopyTextAction

  | Set_isGameInstructionsEditorSettingsModalDisplayedAction
  | SET_isMarkdownHelpModalDisplayedAction
  | SET_isImageLibraryDisplayedAction

  | SET_createFieldTextExplanationListReplaceVarNameAction
  | SET_createFieldTextExplanationListReplaceNumbersAction
  | SET_createFieldTextExplanationListReplacePrefixTextAction
  | SET_createFieldTextExplanationListReplacePostfixTextAction
  | SET_generalGameInstructionsTemplateAction
  | SET_generalGameInstructionsVariableListElementTemplateAction
  | SET_generalGameInstructionsFieldTextExplanationListElementTemplateAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_markdown:
      return {
        ...state,
        markdown: action.markdown
      }
    case ActionType.SET_verticalGripperPositionOffsetInPx:
      return {
        ...state,
        verticalGripperPositionOffsetInPx: action.verticalGripperPositionOffsetInPx
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
    case ActionType.SET_isMarkdownHelpModalDisplayed:
      return {
        ...state,
        isMarkdownHelpModalDisplayed: action.isMarkdownHelpModalDisplayed
      }

    case ActionType.SET_isImageLibraryDisplayed:
      return {
        ...state,
        isImageLibraryDisplayed: action.isImageLibraryDisplayed
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

    case ActionType.SET_generalGameInstructionsTemplate:
      return {
        ...state,
        generalGameInstructionsTemplate: action.generalGameInstructionsTemplate
      }

    case ActionType.SET_generalGameInstructionsVariableListElementTemplate:
      return {
        ...state,
        generalGameInstructionsVariableListElementTemplate: action.generalGameInstructionsVariableListElementTemplate
      }
    case ActionType.SET_generalGameInstructionsFieldTextExplanationListElementTemplate:
      return {
        ...state,
        generalGameInstructionsFieldTextExplanationListElementTemplate: action.generalGameInstructionsFieldTextExplanationListElementTemplate
      }


    case ActionType.SET_replaceGameInstructionsState:
      return {
        ...state,
        ...action.replaceGameInstructionsState
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}


export function getGameInstructionsSettings(state: State): GameInstructionsSettings {
  return {
    createFieldTextExplanationListReplaceNumbers: state.createFieldTextExplanationListReplaceNumbers,
    createFieldTextExplanationListReplacePostfixText: state.createFieldTextExplanationListReplacePostfixText,
    createFieldTextExplanationListReplacePrefixText: state.createFieldTextExplanationListReplacePrefixText,
    createFieldTextExplanationListReplaceVarName: state.createFieldTextExplanationListReplaceVarName,
    editorFontSize: state.editorFontSize,
    markdown: state.markdown,
    previewFontSize: state.previewFontSize,
    generalGameInstructionsTemplate: state.generalGameInstructionsTemplate,
    generalGameInstructionsVariableListElementTemplate: state.generalGameInstructionsVariableListElementTemplate,
    generalGameInstructionsFieldTextExplanationListElementTemplate: state.generalGameInstructionsFieldTextExplanationListElementTemplate,
  }
}
