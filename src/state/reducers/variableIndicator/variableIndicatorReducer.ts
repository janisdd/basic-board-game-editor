import {Action} from "redux";
import {notExhaustive} from "../_notExhausiveHelper";
import {
  defaultVariableIndicatorInnerCircleDiameterInPx,
  defaultVariableIndicatorOuterCircleDiameterInPx
} from "../../../constants";

export type State = {
  readonly outerCircleDiameterInPx: number
  readonly innerCircleDiameterInPx: number
  readonly numOfFields: number
  readonly innerText: string
  readonly isBoolVar: boolean
  readonly fontSizeInPx: number
  readonly fontName: string

  readonly drawQrCode: boolean
}


export const initial: State = {
  outerCircleDiameterInPx: defaultVariableIndicatorOuterCircleDiameterInPx,
  innerCircleDiameterInPx: defaultVariableIndicatorInnerCircleDiameterInPx,
  numOfFields: 12,
  innerText: 'text',
  isBoolVar: false,
  fontSizeInPx: 18,
  fontName: 'Arial',
  drawQrCode: true
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  SET_varIndicator_outerCircleDiameterInPx = 'variableIndicatorReducer_SET_varIndicator_outerCircleDiameterInPx',
  SET_varIndicator_innerCircleDiameterInPx = 'variableIndicatorReducer_SET_varIndicator_innerCircleDiameterInPx',
  SET_varIndicator_numOfFields = 'variableIndicatorReducer_SET_varIndicator_numOfFields',
  SET_varIndicator_innerText = 'variableIndicatorReducer_SET_varIndicator_innerText',
  SET_varIndicator_isBoolVar = 'variableIndicatorReducer_SET_varIndicator_isBoolVar',
  SET_varIndicator_fontSizeInPx = 'variableIndicatorReducer_SET_varIndicator_fontSizeInPx',
  SET_varIndicator_fontName = 'variableIndicatorReducer_SET_varIndicator_fontName',

  SET_drawQrCode = 'variableIndicatorReducer_SET_drawQrCode',


  RESET = 'variableIndicatorReducer_RESET',
}


export interface SET_varIndicator_outerCircleDiameterInPxAction extends ActionBase {
  readonly type: ActionType.SET_varIndicator_outerCircleDiameterInPx
  readonly outerCircleDiameterInPx: number
}

export interface SET_varIndicator_innerCircleDiameterInPxAction extends ActionBase {
  readonly type: ActionType.SET_varIndicator_innerCircleDiameterInPx
  readonly innerCircleDiameterInPx: number
}

export interface SET_varIndicator_numOfFieldsAction extends ActionBase {
  readonly type: ActionType.SET_varIndicator_numOfFields
  readonly numOfFields: number
}

export interface SET_varIndicator_innerTextAction extends ActionBase {
  readonly type: ActionType.SET_varIndicator_innerText
  readonly innerText: string
}

export interface SET_varIndicator_isBoolVarAction extends ActionBase {
  readonly type: ActionType.SET_varIndicator_isBoolVar
  readonly isBoolVar: boolean
}

export interface SET_varIndicator_fontSizeInPxAction extends ActionBase {
  readonly type: ActionType.SET_varIndicator_fontSizeInPx
  readonly fontSizeInPx: number
}

export interface SET_varIndicator_fontNameAction extends ActionBase {
  readonly type: ActionType.SET_varIndicator_fontName
  readonly fontName: string
}


export interface SET_drawQrCodeAction extends ActionBase {
  readonly type: ActionType.SET_drawQrCode
  readonly drawQrCode: boolean
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_varIndicator_outerCircleDiameterInPxAction
  | SET_varIndicator_numOfFieldsAction
  | SET_varIndicator_innerCircleDiameterInPxAction
  | SET_varIndicator_innerTextAction
  | SET_varIndicator_isBoolVarAction
  | SET_varIndicator_fontSizeInPxAction
  | SET_varIndicator_fontNameAction
  | SET_drawQrCodeAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_varIndicator_outerCircleDiameterInPx:
      return {
        ...state,
        outerCircleDiameterInPx: action.outerCircleDiameterInPx
      }

    case ActionType.SET_varIndicator_innerCircleDiameterInPx:
      return {
        ...state,
        innerCircleDiameterInPx: action.innerCircleDiameterInPx
      }

    case ActionType.SET_varIndicator_innerText:
      return {
        ...state,
        innerText: action.innerText
      }

    case ActionType.SET_varIndicator_numOfFields:
      return {
        ...state,
        numOfFields: action.numOfFields
      }

    case ActionType.SET_varIndicator_isBoolVar:
      return {
        ...state,
        isBoolVar: action.isBoolVar
      }

    case ActionType.SET_varIndicator_fontSizeInPx:
      return {
        ...state,
        fontSizeInPx: action.fontSizeInPx
      }
    case ActionType.SET_varIndicator_fontName:
      return {
        ...state,
        fontName: action.fontName
      }

    case ActionType.SET_drawQrCode:
      return {
        ...state,
        drawQrCode: action.drawQrCode
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

