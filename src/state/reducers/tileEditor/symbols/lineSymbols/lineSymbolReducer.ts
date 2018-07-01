import {Action} from "redux";
import {LineSymbol} from "../../../../../types/drawing";
import {notExhaustive} from "../../../_notExhausiveHelper";
import { replacePropertyByGuid} from "../../../../../helpers/functionHelpers";
import undoable from "redux-undo";
import {clearTileEditorEditShapesType, undoShapeLimit} from "../../../../../constants";


const lineSymbolPresets: ReadonlyArray<LineSymbol> = [
  // {
  //   isSymbol: false,
  //   createdFromSymbolId: null,
  //   id: getNextShapeId(),
  //   zIndex: -1,
  //   color: lineShapeDefaultColor,
  //   hasEndArrow: false,
  //   hasStartArrow: false,
  //   lineThicknessInPx: 3,
  //   dashArray: [15],
  //   startPoint: {
  //     id: getNextShapeId(),
  //     x: symbolPreviewStageXOffset,
  //     y: symbolPreviewStageYOffset,
  //   },
  //   points: [
  //     getNiceBezierCurveBetween({x: symbolPreviewStageXOffset, y: symbolPreviewStageYOffset}, {x: 100, y: 100})
  //   ],
  //   displayIndex: 0,
  //   arrowWidth: defaultArrowWidth,
  //   arrowHeight: defaultArrowHeight,
  //   displayName: 'line symbol 1'
  // }
]

export type State = ReadonlyArray<LineSymbol>

export const initial: State = [].concat(lineSymbolPresets)

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {

  SET_lineSymbols = 'lineSymbolReducer_SET_lineSymbols',

  SET_lineSymbol_color = 'lineSymbolReducer_SET_lineSymbol_color',
  SET_lineSymbol_thicknessInPx = 'lineSymbolReducer_SET_lineSymbol_thicknessInPx',
  SET_lineSymbol_dashArray = 'lineSymbolReducer_SET_lineSymbol_dashArray',
  SET_lineSymbol_hasStartArrow = 'lineSymbolReducer_SET_lineSymbol_hasStartArrow',
  SET_lineSymbol_hasEndArrow = 'lineSymbolReducer_SET_lineSymbol_hasEndArrow',

  SET_lineSymbol_arrowWidth = 'lineSymbolReducer_SET_lineSymbol_arrowWidth',
  SET_lineSymbol_arrowHeight = 'lineSymbolReducer_SET_lineSymbol_arrowHeight',

  SET_lineSymbol_displayIndex = 'lineSymbolReducer_SET_lineSymbol_displayIndex',
  SET_lineSymbol_displayName = 'lineSymbolReducer_SET_lineSymbol_displayName',

  RESET = 'lineSymbolReducer_RESET',
}


export interface SET_lineSymbolsAction extends ActionBase {
  readonly type: ActionType.SET_lineSymbols
  readonly lineSymbols: ReadonlyArray<LineSymbol>
}

export interface SET_lineSymbol_colorAction extends ActionBase {
  readonly type: ActionType.SET_lineSymbol_color
  readonly lineSymbolGuid: string
  readonly color: string
}

export interface SET_lineSymbol_thicknessInPxAction extends ActionBase {
  readonly type: ActionType.SET_lineSymbol_thicknessInPx
  readonly lineSymbolGuid: string
  readonly lineThicknessInPx: number
}

export interface SET_lineSymbol_dashArrayAction extends ActionBase {
  readonly type: ActionType.SET_lineSymbol_dashArray
  readonly lineSymbolGuid: string
  readonly dashArray: number[]
}

export interface SET_lineSymbol_hasStartArrowAction extends ActionBase {
  readonly type: ActionType.SET_lineSymbol_hasStartArrow
  readonly lineSymbolGuid: string
  readonly hasStartArrow: boolean
}

export interface SET_lineSymbol_hasEndArrowAction extends ActionBase {
  readonly type: ActionType.SET_lineSymbol_hasEndArrow
  readonly lineSymbolGuid: string
  readonly hasEndArrow: boolean
}

export interface SET_lineSymbol_displayIndexAction extends ActionBase {
  readonly type: ActionType.SET_lineSymbol_displayIndex
  readonly lineSymbolGuid: string
  readonly displayIndex: number
}

export interface SET_lineSymbol_arrowWidthAction extends ActionBase {
  readonly type: ActionType.SET_lineSymbol_arrowWidth
  readonly lineSymbolGuid: string
  readonly arrowWidth: number
}

export interface SET_lineSymbol_arrowHeightAction extends ActionBase {
  readonly type: ActionType.SET_lineSymbol_arrowHeight
  readonly lineSymbolGuid: string
  readonly arrowHeight: number
}


export interface SET_lineSymbol_displayNameAction extends ActionBase {
  readonly type: ActionType.SET_lineSymbol_displayName
  readonly lineSymbolGuid: string
  readonly displayName: string
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_lineSymbolsAction
  | SET_lineSymbol_colorAction
  | SET_lineSymbol_thicknessInPxAction
  | SET_lineSymbol_dashArrayAction
  | SET_lineSymbol_hasStartArrowAction
  | SET_lineSymbol_hasEndArrowAction
  | SET_lineSymbol_displayIndexAction
  | SET_lineSymbol_arrowWidthAction
  | SET_lineSymbol_arrowHeightAction
  | SET_lineSymbol_displayNameAction


export function _reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_lineSymbols:
      return [...action.lineSymbols]


    case ActionType.SET_lineSymbol_color: {
      const res = replacePropertyByGuid(state, action.lineSymbolGuid, p => {
        return {...p, color: action.color}
      })
      return res
    }
    case ActionType.SET_lineSymbol_thicknessInPx: {
      const res = replacePropertyByGuid(state, action.lineSymbolGuid, p => {
        return {...p, lineThicknessInPx: action.lineThicknessInPx}
      })
      return res
    }

    case ActionType.SET_lineSymbol_dashArray: {
      const res = replacePropertyByGuid(state, action.lineSymbolGuid, p => {
        return {...p, dashArray: action.dashArray}
      })
      return res
    }
    case ActionType.SET_lineSymbol_hasStartArrow: {
      const res = replacePropertyByGuid(state, action.lineSymbolGuid, p => {
        return {...p, hasStartArrow: action.hasStartArrow}
      })
      return res
    }

    case ActionType.SET_lineSymbol_hasEndArrow: {
      const res = replacePropertyByGuid(state, action.lineSymbolGuid, p => {
        return {...p, hasEndArrow: action.hasEndArrow}
      })
      return res
    }

    case ActionType.SET_lineSymbol_displayIndex: {
      const res = replacePropertyByGuid(state, action.lineSymbolGuid, p => {
        return {...p, displayIndex: action.displayIndex}
      })
      return res
    }
    case ActionType.SET_lineSymbol_arrowWidth: {
      const res = replacePropertyByGuid(state, action.lineSymbolGuid, p => {
        return {...p, arrowWidth: action.arrowWidth}
      })
      return res
    }
    case ActionType.SET_lineSymbol_arrowHeight: {
      const res = replacePropertyByGuid(state, action.lineSymbolGuid, p => {
        return {...p, arrowHeight: action.arrowHeight}
      })
      return res
    }

    case ActionType.SET_lineSymbol_displayName: {
      const res = replacePropertyByGuid(state, action.lineSymbolGuid, p => {
        return {...p, displayName: action.displayName}
      })
      return res
    }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}



export enum UndoLineSymbolType {
  undo = 'lineSymbol_shapesReducer_undo',
  redo = 'lineSymbol_shapesReducer_redo',
}

export interface Edit_lineSymbolUndo {
  readonly type: UndoLineSymbolType.undo
}

export interface Edit_lineSymbolRedo {
  readonly type: UndoLineSymbolType.redo
}


//increment every time another (field/img/line) reducer applies an action
//then we don't group the next action in here into the same item
/*
    because the shape reducer groups field move then groups img move
    but the field reducer only sees field moves not img moves
    so when we move the field again we group into the same item...
 */
export let lineSymbolUndoVersionId = 0

export function incLineSymbolHistoryId(): void {
  lineSymbolUndoVersionId++
}

export const reducer = undoable(_reducer, {
  limit: undoShapeLimit,
  undoType: UndoLineSymbolType.undo,
  redoType: UndoLineSymbolType.redo,
  clearHistoryType: clearTileEditorEditShapesType,
  groupBy: (action, state) => {

    //not group bools else if we only trigger the bool then we get a undo item with no effect
    //also bad for enums...
    if (action.type === ActionType.SET_lineSymbol_hasStartArrow
      || action.type === ActionType.SET_lineSymbol_hasEndArrow
    ) {
      return null
    }

    return action.type + lineSymbolUndoVersionId
  }
})
