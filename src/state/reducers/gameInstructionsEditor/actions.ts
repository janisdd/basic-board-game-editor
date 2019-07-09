import {
  ActionBase,
  ActionType,
  ResetAction,
  SET_actionResultCopyTextAction,
  set_createFieldTextExplanationListAsAction,
  SET_createFieldTextExplanationListReplaceNumbersAction,
  SET_createFieldTextExplanationListReplacePostfixTextAction,
  SET_createFieldTextExplanationListReplacePrefixTextAction, SET_createFieldTextExplanationListReplaceVarNameAction,
  SET_editorFontSizeAction,
  SET_isActionResultCopyModalDisplayedAction, set_isGameInstructionsEditorSettingsModalDisplayedAction,
  SET_markdownAction,
  SET_previewFontSizeAction,
  SET_verticalGripperPositionInPercentageAction
} from "./gameInstructionsEditorReducer";
import {CreateFieldTextExplanationListType} from "../../../helpers/markdownHelper";


export function set_gie_markdown(markdown: string): SET_markdownAction {
  return {
    type: ActionType.SET_markdown,
    markdown
  }
}

export function set_gie_verticalGripperPositionInPercentage(verticalGripperPositionInPercentage: number): SET_verticalGripperPositionInPercentageAction {
  return {
    type: ActionType.SET_verticalGripperPositionInPercentage,
    verticalGripperPositionInPercentage
  }
}

export function set_gie_previewFontSize(previewFontSize: number): SET_previewFontSizeAction {
  return {
    type: ActionType.SET_previewFontSize,
    previewFontSize
  }
}

export function set_gie_editorFontSize(editorFontSize: number): SET_editorFontSizeAction {
  return {
    type: ActionType.SET_editorFontSize,
    editorFontSize
  }
}

export function set_gie_isActionResultCopyModalDisplayed(isActionResultCopyModalDisplayed: boolean): SET_isActionResultCopyModalDisplayedAction {
  return {
    type: ActionType.SET_isActionResultCopyModalDisplayed,
    isActionResultCopyModalDisplayed
  }
}

export function set_gie_actionResultCopyText(actionResultCopyText: string): SET_actionResultCopyTextAction {
  return {
    type: ActionType.SET_actionResultCopyText,
    actionResultCopyText
  }
}

export function set_gie_isGameInstructionsEditorSettingsModalDisplayed(isGameInstructionsEditorSettingsModalDisplayed: boolean): set_isGameInstructionsEditorSettingsModalDisplayedAction {
  return {
    type: ActionType.SET_isGameInstructionsEditorSettingsModalDisplayed,
    isGameInstructionsEditorSettingsModalDisplayed
  }
}

export function set_gie_createFieldTextExplanationListAs(createFieldTextExplanationListAs: CreateFieldTextExplanationListType): set_createFieldTextExplanationListAsAction {
  return {
    type: ActionType.SET_createFieldTextExplanationListAs,
    createFieldTextExplanationListAs
  }
}

export function set_gie_createFieldTextExplanationListReplaceVarName(createFieldTextExplanationListReplaceVarName: string): SET_createFieldTextExplanationListReplaceVarNameAction {
  return {
    type: ActionType.SET_createFieldTextExplanationListReplaceVarName,
    createFieldTextExplanationListReplaceVarName
  }
}

export function set_gie_createFieldTextExplanationListReplaceNumbers(createFieldTextExplanationListReplaceNumbers: boolean): SET_createFieldTextExplanationListReplaceNumbersAction {
  return {
    type: ActionType.SET_createFieldTextExplanationListReplaceNumbers,
    createFieldTextExplanationListReplaceNumbers
  }
}

export function set_gie_createFieldTextExplanationListReplacePrefixText(createFieldTextExplanationListReplacePrefixText: string): SET_createFieldTextExplanationListReplacePrefixTextAction {
  return {
    type: ActionType.SET_createFieldTextExplanationListReplacePrefixText,
    createFieldTextExplanationListReplacePrefixText
  }
}

export function set_gie_createFieldTextExplanationListReplacePostfixText(createFieldTextExplanationListReplacePostfixText: string): SET_createFieldTextExplanationListReplacePostfixTextAction {
  return {
    type: ActionType.SET_createFieldTextExplanationListReplacePostfixText,
    createFieldTextExplanationListReplacePostfixText
  }
}


export function set_gie_reset(): ResetAction {
  return {
    type: ActionType.RESET,
  }
}
