import {
  ActionBase,
  ActionType,
  ResetAction, SET_varIndicator_fontNameAction, SET_varIndicator_fontSizeInPxAction,
  SET_varIndicator_innerCircleDiameterInPxAction,
  SET_varIndicator_innerTextAction, SET_varIndicator_innerTextFontSizeInPxAction,
  SET_varIndicator_isBoolVarAction,
  SET_varIndicator_numOfFieldsAction,
  SET_varIndicator_outerCircleDiameterInPxAction
} from "./variableIndicatorReducer";

export function set_varIndicator_outerCircleDiameterInPxAction(outerCircleDiameterInPx: number): SET_varIndicator_outerCircleDiameterInPxAction {
  return {
    type: ActionType.SET_varIndicator_outerCircleDiameterInPx,
    outerCircleDiameterInPx
  }
}

export function set_varIndicator_innerCircleDiameterInPxAction(innerCircleDiameterInPx: number): SET_varIndicator_innerCircleDiameterInPxAction {
  return {
    type: ActionType.SET_varIndicator_innerCircleDiameterInPx,
    innerCircleDiameterInPx
  }
}

export function set_varIndicator_numOfFieldsAction(numOfFields: number): SET_varIndicator_numOfFieldsAction {
  return {
    type: ActionType.SET_varIndicator_numOfFields,
    numOfFields
  }
}

export function set_varIndicator_innerText(innerText: string): SET_varIndicator_innerTextAction {
  return {
    type: ActionType.SET_varIndicator_innerText,
    innerText
  }
}

export function set_varIndicator_isBoolVarAction(isBoolVar: boolean): SET_varIndicator_isBoolVarAction {
  return {
    type: ActionType.SET_varIndicator_isBoolVar,
    isBoolVar
  }
}

export function set_varIndicator_fontSizeInPxAction(fontSizeInPx: number): SET_varIndicator_fontSizeInPxAction {
  return {
    type: ActionType.SET_varIndicator_fontSizeInPx,
    fontSizeInPx
  }
}

export function set_varIndicator_fontNameAction(fontName: string): SET_varIndicator_fontNameAction {
  return {
    type: ActionType.SET_varIndicator_fontName,
    fontName
  }
}

export function set_varIndicator_innerTextFontSizeInPxAction(innerTextFontSizeInPx: number): SET_varIndicator_innerTextFontSizeInPxAction {
  return {
    type: ActionType.SET_varIndicator_innerTextFontSizeInPx,
    innerTextFontSizeInPx
  }
}

export function varIndicator_reset(): ResetAction {
  return {
    type: ActionType.RESET,
  }
}
