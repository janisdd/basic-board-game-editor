import {
  ActionBase,
  ActionType,
  ResetAction,
  SET_actionResultCopyTextAction,
  SET_editorFontSizeAction,
  SET_isActionResultCopyModalDisplayedAction,
  SET_markdownAction,
  SET_previewFontSizeAction,
  SET_verticalGripperPositionInPercentageAction
} from "./gameInstructionsEditorReducer";


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


export function set_gie_reset(): ResetAction {
  return {
    type: ActionType.RESET,
  }
}
