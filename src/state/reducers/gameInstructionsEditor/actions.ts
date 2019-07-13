import {
  ActionType,
  GameInstructionsSettings,
  ResetAction,
  SET_actionResultCopyTextAction,
  SET_createFieldTextExplanationListReplaceNumbersAction,
  SET_createFieldTextExplanationListReplacePostfixTextAction,
  SET_createFieldTextExplanationListReplacePrefixTextAction,
  SET_createFieldTextExplanationListReplaceVarNameAction,
  SET_editorFontSizeAction,
  SET_generalGameInstructionsFieldTextExplanationListElementTemplateAction,
  SET_generalGameInstructionsTemplateAction,
  SET_generalGameInstructionsVariableListElementTemplateAction,
  SET_isActionResultCopyModalDisplayedAction,
  Set_isGameInstructionsEditorSettingsModalDisplayedAction,
  SET_isImageLibraryDisplayedAction,
  SET_isMarkdownHelpModalDisplayedAction,
  SET_markdownAction,
  SET_previewFontSizeAction,
  SET_replaceGameInstructionsStateAction,
  SET_verticalGripperPositionOffsetInPxAction
} from "./gameInstructionsEditorReducer";


export function set_gie_markdown(markdown: string): SET_markdownAction {
  return {
    type: ActionType.SET_markdown,
    markdown
  }
}

export function set_gie_verticalGripperPositionOffsetInPx(verticalGripperPositionOffsetInPx: number): SET_verticalGripperPositionOffsetInPxAction {
  return {
    type: ActionType.SET_verticalGripperPositionOffsetInPx,
    verticalGripperPositionOffsetInPx
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

export function set_gie_isGameInstructionsEditorSettingsModalDisplayed(isGameInstructionsEditorSettingsModalDisplayed: boolean): Set_isGameInstructionsEditorSettingsModalDisplayedAction {
  return {
    type: ActionType.SET_isGameInstructionsEditorSettingsModalDisplayed,
    isGameInstructionsEditorSettingsModalDisplayed
  }
}

export function set_gie_isMarkdownHelpModalDisplayed(isMarkdownHelpModalDisplayed: boolean): SET_isMarkdownHelpModalDisplayedAction {
  return {
    type: ActionType.SET_isMarkdownHelpModalDisplayed,
    isMarkdownHelpModalDisplayed
  }
}

export function set_gie_isImageLibraryDisplayed(isImageLibraryDisplayed: boolean): SET_isImageLibraryDisplayedAction {
  return {
    type: ActionType.SET_isImageLibraryDisplayed,
    isImageLibraryDisplayed
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


export function set_gie_generalGameInstructionsTemplate(generalGameInstructionsTemplate: string): SET_generalGameInstructionsTemplateAction {
  return {
    type: ActionType.SET_generalGameInstructionsTemplate,
    generalGameInstructionsTemplate
  }
}

export function set_gie_generalGameInstructionsVariableListElementTemplate(generalGameInstructionsVariableListElementTemplate: string): SET_generalGameInstructionsVariableListElementTemplateAction {
  return {
    type: ActionType.SET_generalGameInstructionsVariableListElementTemplate,
    generalGameInstructionsVariableListElementTemplate
  }
}

export function set_gie_generalGameInstructionsFieldTextExplanationListElementTemplate(generalGameInstructionsFieldTextExplanationListElementTemplate: string): SET_generalGameInstructionsFieldTextExplanationListElementTemplateAction {
  return {
    type: ActionType.SET_generalGameInstructionsFieldTextExplanationListElementTemplate,
    generalGameInstructionsFieldTextExplanationListElementTemplate
  }
}



export function set_gie_replaceGameInstructionsState(replaceGameInstructionsState: GameInstructionsSettings): SET_replaceGameInstructionsStateAction {
  return {
    type: ActionType.SET_replaceGameInstructionsState,
    replaceGameInstructionsState
  }
}

export function set_gie_reset(): ResetAction {
  return {
    type: ActionType.RESET,
  }
}
