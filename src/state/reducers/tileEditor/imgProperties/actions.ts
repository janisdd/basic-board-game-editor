import {ImgShape} from "../../../../types/drawing";
import {
  ActionBase,
  ActionType,
  ADD_ImageShapeAction, Edit_imgRedo, Edit_imgUndo,
  REMOVE_ImageShapeAction, SET_image_isMouseSelectionDisabledAction, SET_image_skewXAction, SET_image_skewYAction,
  SET_imageCreatedFromSymbolIdAction,
  SET_imageHeightAction, SET_imageImgGuidAction,
  SET_imageRotationAction,
  SET_imageWidthAction,
  SET_imageXAction,
  SET_imageYAction,
  SET_imageZIndexAction,
  SET_tileImgArrayAction, UndoType
} from "./imgPropertyReducer";


export function setPropertyEditor_imgShapes(tileImgShapes: ReadonlyArray<ImgShape>): SET_tileImgArrayAction {
  return {
    type: ActionType.SET_tileImgArray,
    tileImgShapes
  }
}

export function removeImageShape(imgShapeId: number): REMOVE_ImageShapeAction {
  return {
    type: ActionType.REMOVE_ImageShape,
    imgShapeId
  }
}


export function addImageShape(imgShape: ImgShape): ADD_ImageShapeAction {
  return {
    type: ActionType.ADD_ImageShape,
    imgShape
  }
}

export function setPropertyEditor_ImageX(imgShapeId: number,x: number): SET_imageXAction {
  return {
    type: ActionType.SET_imageX,
    x,
    imgShapeId
  }
}

export function setPropertyEditor_ImageY(imgShapeId: number,y: number): SET_imageYAction {
  return {
    type: ActionType.SET_imageY,
    y,
    imgShapeId
  }
}

export function setPropertyEditor_ImageWidth(imgShapeId: number,width: number): SET_imageWidthAction {
  return {
    type: ActionType.SET_imageWidth,
    width,
    imgShapeId
  }
}

export function setPropertyEditor_ImageHeight(imgShapeId: number,height: number): SET_imageHeightAction {
  return {
    type: ActionType.SET_imageHeight,
    height,
    imgShapeId
  }
}

export function setPropertyEditor_ImageRotationInDegree(imgShapeId: number,degree: number): SET_imageRotationAction {
  return {
    type: ActionType.SET_imageRotation,
    degree,
    imgShapeId
  }
}

export function setPropertyEditor_ImageAbsoluteZIndex(imgShapeId: number, zIndex: number): SET_imageZIndexAction {
  return {
    type: ActionType.SET_imageZIndex,
    zIndex,
    imgShapeId
  }
}

/**
 * sets the real (img storage img id)
 * @param {number} imgShapeId
 * @param {number} imgGuid
 * @returns {SET_imageImgGuidAction}
 */
export function setPropertyEditor_ImageImgGuid(imgShapeId: number, imgGuid: string | null): SET_imageImgGuidAction {
  return {
    type: ActionType.SET_imageImgGuid,
    imgGuid,
    imgShapeId
  }
}

export function setPropertyEditor_ImageCreatedFromSymbolId(imgShapeId: number, createdFromSymbolGuid: string | null): SET_imageCreatedFromSymbolIdAction {
  return {
    type: ActionType.SET_imageCreatedFromSymbolId,
    createdFromSymbolGuid,
    imgShapeId
  }
}


export function setPropertyEditor_ImageSkewX(imgShapeId: number, skewX: number): SET_image_skewXAction {
  return {
    type: ActionType.SET_image_skewX,
    imgShapeId,
    skewX
  }
}

export function setPropertyEditor_ImageSkewY(imgShapeId: number, skewY: number): SET_image_skewYAction {
  return {
    type: ActionType.SET_image_skewY,
    imgShapeId,
    skewY
  }
}

export function setPropertyEditor_ImageIsMouseSelectionDisabled(imgShapeId: number, isMouseDisabled: boolean): SET_image_isMouseSelectionDisabledAction {
  return {
    type: ActionType.SET_image_isMouseSelectionDisabled,
    imgShapeId,
    isMouseSelectionDisabled: isMouseDisabled
  }
}

export function edit_imgUndo(): Edit_imgUndo {
  return {
    type: UndoType.undo
  }
}

export function edit_imgRedo(): Edit_imgRedo {
  return {
    type: UndoType.redo
  }
}