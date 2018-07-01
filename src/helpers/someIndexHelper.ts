import {FieldShape, GuidAble, ImgShape, LineBase} from "../types/drawing";
import state from '../state/state'
import {
  setPropertyEditor_FieldAbsoluteZIndex, setPropertyEditor_FieldX, setPropertyEditor_FieldY
} from "../state/reducers/tileEditor/fieldProperties/actions";
import {setPropertyEditor_ImageAbsoluteZIndex} from "../state/reducers/tileEditor/imgProperties/actions";
import {setPropertyEditor_LineAbsoluteZIndex} from "../state/reducers/tileEditor/lineProperties/actions";


interface ObjWithZIndex {
  readonly id: number
  readonly zIndex: number
}


export function swapZIndexInTile(currObj: ObjWithZIndex,
                                 newZIndex: number,
                                 toTopMost: boolean, //move to absolute top ... swap all above
                                 toBottomMost: boolean, //move to absolute bot ... swap all below
                                 amountOfShapesInTile: number,
                                 fieldShapes: ReadonlyArray<FieldShape>,
                                 lineShapes: ReadonlyArray<LineBase>,
                                 imgShapes: ReadonlyArray<ImgShape>,
                                 changeCurrObjZIndex: (newZIndex: number) => any
): void {


  if (newZIndex > amountOfShapesInTile - 1) return
  if (newZIndex < 0) return
  if (currObj.zIndex === newZIndex) return

  //move up

  const otherZIndex = newZIndex

  const otherFieldShape = state.getState().tileEditorFieldShapesState.present.find(p => p.zIndex === otherZIndex)
  if (otherFieldShape) {
    //swap zindex

    state.dispatch(setPropertyEditor_FieldAbsoluteZIndex(otherFieldShape.id, currObj.zIndex))
    changeCurrObjZIndex(otherZIndex)

  }
  else {
    const otherShapeImg = state.getState().tileEditorImgShapesState.present.find(p => p.zIndex === otherZIndex)
    if (otherShapeImg) {
      //swap zindex

      state.dispatch(setPropertyEditor_ImageAbsoluteZIndex(otherShapeImg.id, currObj.zIndex))
      changeCurrObjZIndex(otherZIndex)

    }
    else {
      const otherShapeLine = state.getState().tileEditorLineShapeState.present.find(p => p.zIndex === otherZIndex)

      if (otherShapeLine) {
        //swap
        state.dispatch(setPropertyEditor_LineAbsoluteZIndex(otherShapeLine.id, currObj.zIndex))
        changeCurrObjZIndex(otherZIndex)
      }
    }
  }

  if (toTopMost) {
    swapZIndexInTile(
      {
        ...currObj,
        zIndex: newZIndex
      },
      newZIndex + 1,
      toTopMost,
      toBottomMost,
      amountOfShapesInTile,
      fieldShapes,
      lineShapes,
      imgShapes,
      changeCurrObjZIndex
    )
  }
  else if (toBottomMost) {
    swapZIndexInTile(
      {
        ...currObj,
        zIndex: newZIndex
      },
      newZIndex - 1,
      toTopMost,
      toBottomMost,
      amountOfShapesInTile,
      fieldShapes,
      lineShapes,
      imgShapes,
      changeCurrObjZIndex
    )
  }

}


interface ObjWithSequenceNr {
  readonly id: number
  readonly sequenceNr: number
  readonly x: number
  readonly y: number
}


interface ObjWithDisplayIndex {
  readonly id: number
  readonly displayIndex: number
}

interface ObjWithDisplayIndexAndGuid {
  readonly guid: string
  readonly displayIndex: number
}

/**
 * changes the display index (0 is left/first)
 * @param {ObjWithDisplayIndex} currObj
 * @param {number} newDisplayIndex the must be +1/-1 from the currObj.displayIndex because we call this recursively !!
 * @param {boolean} toAbsoluteFirst
 * @param {boolean} toAbsoluteLast
 * @param {number} maxDisplayIndex
 * @param {ReadonlyArray<ObjWithDisplayIndex>} allObjects
 * @param {(objId: number, newDisplayIndex: number) => any} changeDisplayIndex
 */
export function swapDisplayIndex(currObj: ObjWithDisplayIndex,
                                 //getSomeId:() =>
                                 newDisplayIndex: number,
                                 toAbsoluteFirst: boolean, //0 is first
                                 toAbsoluteLast: boolean,
                                 maxDisplayIndex: number,
                                 allObjects: ReadonlyArray<ObjWithDisplayIndex>,
                                 changeDisplayIndex:(objId: number, newDisplayIndex:number)=>any
                                 ) {

  if (newDisplayIndex >= maxDisplayIndex) return
  if (newDisplayIndex < 0) return
  if (currObj.displayIndex === newDisplayIndex) return



  const otherObj = allObjects.find(p => p.displayIndex === newDisplayIndex)

  if (otherObj) {
    //swap
    changeDisplayIndex(otherObj.id, currObj.displayIndex)
    changeDisplayIndex(currObj.id, newDisplayIndex)
  }

  if (toAbsoluteFirst) {
    swapDisplayIndex(
      {
        ...currObj,
        displayIndex: newDisplayIndex
      },
      newDisplayIndex - 1,
      toAbsoluteFirst,
      toAbsoluteLast,
      maxDisplayIndex,
      allObjects,
      changeDisplayIndex
    )
  }
  else if (toAbsoluteLast) {
    swapDisplayIndex(
      {
        ...currObj,
        displayIndex: newDisplayIndex
      },
      newDisplayIndex + 1,
      toAbsoluteFirst,
      toAbsoluteLast,
      maxDisplayIndex,
      allObjects,
      changeDisplayIndex
    )
  }

}


export function swapDisplayIndexWithGuid(currObj: ObjWithDisplayIndexAndGuid,
                                 newDisplayIndex: number,
                                 toAbsoluteFirst: boolean, //0 is first
                                 toAbsoluteLast: boolean,
                                 maxDisplayIndex: number,
                                 allObjects: ReadonlyArray<ObjWithDisplayIndexAndGuid>,
                                 changeDisplayIndex:(guid: string, newDisplayIndex:number)=>any
) {

  if (newDisplayIndex >= maxDisplayIndex) return
  if (newDisplayIndex < 0) return
  if (currObj.displayIndex === newDisplayIndex) return



  const otherObj = allObjects.find(p => p.displayIndex === newDisplayIndex)

  if (otherObj) {
    //swap
    changeDisplayIndex(otherObj.guid, currObj.displayIndex)
    changeDisplayIndex(currObj.guid, newDisplayIndex)
  }

  if (toAbsoluteFirst) {
    swapDisplayIndexWithGuid(
      {
        ...currObj,
        displayIndex: newDisplayIndex
      },
      newDisplayIndex - 1,
      toAbsoluteFirst,
      toAbsoluteLast,
      maxDisplayIndex,
      allObjects,
      changeDisplayIndex
    )
  }
  else if (toAbsoluteLast) {
    swapDisplayIndexWithGuid(
      {
        ...currObj,
        displayIndex: newDisplayIndex
      },
      newDisplayIndex + 1,
      toAbsoluteFirst,
      toAbsoluteLast,
      maxDisplayIndex,
      allObjects,
      changeDisplayIndex
    )
  }

}