import {
  ActionType,
  SET_markdownAction,
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

