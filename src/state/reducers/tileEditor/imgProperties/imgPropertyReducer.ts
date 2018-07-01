import {notExhaustive} from "../../_notExhausiveHelper";
import {ImgShape} from "../../../../types/drawing";
import {Action} from "redux";
import {replaceProperty} from "../../../../helpers/functionHelpers";
import {clearTileEditorEditShapesType, undoShapeLimit} from "../../../../constants";
import undoable from "redux-undo";


export type State = ReadonlyArray<ImgShape>


export const initial: State = []

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {


  ADD_ImageShape = 'tileEditorReducer_ADD_ImageShape',
  REMOVE_ImageShape = 'tileEditorReducer_REMOVE_ImageShape',

  SET_tileImgArray = 'fieldPropertyReducer_SET_tileImgArray',

  SET_imageX = 'tileEditorReducer_SET_imageX',
  SET_imageY = 'tileEditorReducer_SET_imageY',
  SET_imageWidth = 'tileEditorReducer_SET_imageWidth',
  SET_imageHeight = 'tileEditorReducer_SET_imageHeight',
  SET_imageRotation = 'tileEditorReducer_SET_imageRotation',
  SET_imageZIndex = 'tileEditorReducer_SET_imageZIndex',
  SET_imageImgGuid = 'tileEditorReducer_SET_imageImgGuid',

  SET_imageCreatedFromSymbolId = 'tileEditorReducer_SET_imageCreatedFromSymbolId',

  SET_image_skewX = 'tileEditorReducer_SET_image_skewX',
  SET_image_skewY = 'tileEditorReducer_SET_image_skewY',
  SET_image_isMouseSelectionDisabled = 'tileEditorReducer_SET_image_isMouseSelectionDisabled',

  RESET = 'imgPropertyReducer_RESET',
}


export interface SET_tileImgArrayAction extends ActionBase {
  readonly type: ActionType.SET_tileImgArray
  readonly tileImgShapes: ReadonlyArray<ImgShape>
}

export interface ADD_ImageShapeAction extends ActionBase {
  readonly type: ActionType.ADD_ImageShape
  readonly imgShape: ImgShape
}

export interface REMOVE_ImageShapeAction extends ActionBase {
  readonly type: ActionType.REMOVE_ImageShape
  readonly imgShapeId: number
}

//--- img props

export interface SET_imageXAction extends ActionBase {
  readonly type: ActionType.SET_imageX
  readonly imgShapeId: number
  readonly x: number
}

export interface SET_imageYAction extends ActionBase {
  readonly type: ActionType.SET_imageY
  readonly imgShapeId: number
  readonly y: number
}

export interface SET_imageWidthAction extends ActionBase {
  readonly type: ActionType.SET_imageWidth
  readonly imgShapeId: number
  readonly width: number
}

export interface SET_imageHeightAction extends ActionBase {
  readonly type: ActionType.SET_imageHeight
  readonly imgShapeId: number
  readonly height: number
}

export interface SET_imageRotationAction extends ActionBase {
  readonly type: ActionType.SET_imageRotation
  readonly imgShapeId: number
  readonly degree: number
}

export interface SET_imageZIndexAction extends ActionBase {
  readonly type: ActionType.SET_imageZIndex
  readonly imgShapeId: number
  readonly zIndex: number
}

export interface SET_imageImgGuidAction extends ActionBase {
  readonly type: ActionType.SET_imageImgGuid
  readonly imgShapeId: number
  readonly imgGuid: string | null
}

export interface SET_imageCreatedFromSymbolIdAction extends ActionBase {
  readonly type: ActionType.SET_imageCreatedFromSymbolId
  readonly imgShapeId: number
  readonly createdFromSymbolGuid: string | null
}

export interface SET_image_skewXAction extends ActionBase {
  readonly type: ActionType.SET_image_skewX
  readonly imgShapeId: number
  readonly skewX: number
}

export interface SET_image_skewYAction extends ActionBase {
  readonly type: ActionType.SET_image_skewY
  readonly imgShapeId: number
  readonly skewY: number
}

export interface SET_image_isMouseSelectionDisabledAction extends ActionBase {
  readonly type: ActionType.SET_image_isMouseSelectionDisabled
  readonly imgShapeId: number
  readonly isMouseSelectionDisabled: boolean
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | ADD_ImageShapeAction
  | REMOVE_ImageShapeAction

  | SET_tileImgArrayAction

  | SET_imageXAction
  | SET_imageYAction
  | SET_imageWidthAction
  | SET_imageHeightAction
  | SET_imageRotationAction
  | SET_imageZIndexAction
  | SET_imageImgGuidAction
  | SET_imageCreatedFromSymbolIdAction
  | SET_image_skewXAction
  | SET_image_skewYAction
  | SET_image_isMouseSelectionDisabledAction


function _reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {


    case ActionType.SET_tileImgArray:
      return [...action.tileImgShapes]

    case ActionType.ADD_ImageShape:
      return state.concat({...action.imgShape})

    case ActionType.REMOVE_ImageShape:
      return state.filter(p => p.id !== action.imgShapeId)


    case ActionType.SET_imageX: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, x: action.x}
      })
      return res
    }

    case ActionType.SET_imageY: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, y: action.y}
      })
      return res
    }
    case ActionType.SET_imageWidth: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, width: action.width}
      })
      return res
    }

    case ActionType.SET_imageHeight: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, height: action.height}
      })

      return res
    }

    case ActionType.SET_imageRotation: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, rotationInDegree: action.degree}
      })

      return res
    }

    case ActionType.SET_imageZIndex: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, zIndex: action.zIndex}
      })
      return res
    }
    case ActionType.SET_imageCreatedFromSymbolId: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, createdFromSymbolGuid: action.createdFromSymbolGuid}
      })
      return res
    }
    case ActionType.SET_imageImgGuid: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, imgGuid: action.imgGuid}
      })
      return res
    }
    case ActionType.SET_image_skewX: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, skewX: action.skewX}
      })
      return res
    }
    case ActionType.SET_image_skewY: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, skewY: action.skewY}
      })
      return res
    }

    case ActionType.SET_image_isMouseSelectionDisabled: {
      const res = replaceProperty(state, action.imgShapeId, p => {
        return {...p, isMouseSelectionDisabled: action.isMouseSelectionDisabled}
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


export enum UndoType {
  undo = 'img_shapesReducer_undo',
  redo = 'img_shapesReducer_redo',
}

export interface Edit_imgUndo {
  readonly type: UndoType.undo
}

export interface Edit_imgRedo {
  readonly type: UndoType.redo
}

//increment every time another (field/img/line) reducer applies an action
//then we don't group the next action in here into the same item
/*
    because the shape reducer groups field move then groups img move
    but the field reducer only sees field moves not img moves
    so when we move the field again we group into the same item...
 */
export let imgUndoVersionId = 0

export function incImgHistoryId(): void {
  imgUndoVersionId++
}

export const reducer = undoable(_reducer, {
  limit: undoShapeLimit,
  undoType: UndoType.undo,
  redoType: UndoType.redo,
  clearHistoryType: clearTileEditorEditShapesType,
  groupBy: (action, state) => {
    if (action.type === ActionType.SET_imageX || action.type === ActionType.SET_imageY) {
      return ActionType.SET_imageX + ActionType.SET_imageY + imgUndoVersionId
    }

    //not group bools else if we only trigger the bool then we get a undo item with no effect
    //also bad for enums...
    if (action.type === ActionType.SET_image_isMouseSelectionDisabled
    ) {
      return null
    }

    //all? might be odd for bools because we not go back to the last state but to the start bool state... but easier this way
    return action.type + imgUndoVersionId
  }
})
