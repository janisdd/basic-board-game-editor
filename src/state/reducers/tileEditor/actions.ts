import {
  ActionType,
  LeftTileEditorTabs,
  MajorLineDirection,
  RightTileEditorTabs, SET_editor_arePrintGuidesDisplayedAction,
  SET_editor_autoIncrementFieldTextNumbersOnDuplicateAction,
  SET_editor_botBorderPointsAction,
  SET_editor_gridSizeInPxAction,
  SET_editor_isAddImgShapeLibraryDisplayedAction, SET_editor_isChooseFieldShapeBackgroundImageLibraryDisplayedAction,
  SET_editor_isChooseImgShapeImageLibraryDisplayedAction,
  SET_editor_isCreatingNewTileAction, SET_editor_isLeftTabMenuExpandedAction,
  SET_editor_isSelectingNextFieldAction,
  SET_editor_isTileEditorSettingsModalDisplayedAction, SET_editor_lastRightTabActiveIndexAction,
  SET_editor_leftBorderPointsAction,
  SET_editor_leftTabActiveIndexAction,
  SET_editor_majorLineDirectionAction,
  SET_editor_printLargeTilePreferredHeightInPxAction,
  SET_editor_printLargeTilePreferredWidthInPxAction,
  SET_editor_rightBorderPointAction,
  SET_editor_rightTabActiveIndexAction,
  SET_editor_showGridAction,
  SET_editor_showSequenceIdsAction, SET_editor_simulationEndFieldIdsAction, SET_editor_simulationStartFieldIdsAction,
  SET_editor_snapToGridAction,
  SET_editor_splitLargeTileForPrintAction,
  SET_editor_stageOffsetAction,
  SET_editor_stageOffsetScaleCorrectionAction,
  SET_editor_stageScaleAction,
  SET_editor_tileDisplayNameAction,
  SET_editor_tileHeightAction,
  SET_editor_tileWidthAction,
  SET_editor_topBorderPointsAction,
  SET_moveControlPointWhenPointIsMovedAction,
  SET_selectedFieldShapeIdsAction,
  SET_selectedImageShapeIdsAction,
  SET_selectedLineShapeIdsAction,
  SET_tileAction
} from "./tileEditorReducer";
import {Tile} from "../../../types/world";
import {BorderPoint, FieldShape, LineShape, LineSymbol} from "../../../types/drawing";
import {MultiActions} from "../../../types/ui";
import {setPropertyEditor_imgShapes} from "./imgProperties/actions";
import {setPropertyEditor_fieldsShapes} from "./fieldProperties/actions";
import {setPropertyEditor_lineShapes} from "./lineProperties/actions";
import {set_simulation_simulationStatus} from "../simulation/actions";
import {__setNextShapeId} from "./fieldProperties/fieldPropertyReducer";
import {clearHistory_shapeEditor, reset_shapeEditor} from "./shapesReducer/actions";
import {getDefaultNewTile} from "../../../constants";
import {renewAllZIndicesInTile} from "../../../helpers/someIndexHelper";

//only used for import currently...
export function setEditorTile(tile: Tile): SET_tileAction {
  return {
    type: ActionType.SET_tile,
    tile
  }
}

export function _set_editor_isCreatingNewTile(isCreatingNewTile: boolean, tile: Tile): SET_editor_isCreatingNewTileAction {
  return {
    type: ActionType.SET_editor_isCreatingNewTile,
    isCreatingNewTile,
    tile
  }
}

/**
 * this will also set the next shape id new
 * @param {boolean} isCreatingNewTile
 * @param {Tile |null} tile the tile to editor or null to create a new tile
 * @returns {MultiActions}
 */
export function set_editor_isCreatingNewTile(isCreatingNewTile: boolean, tile: Tile | null): MultiActions {
  return (dispatch, getState) => {


    if (isCreatingNewTile) {
      //every new tile can start fields with id 0
      __setNextShapeId(0)

      //we need to make sure this is called after we reset the ids else the tile border points ids are not reset
      tile = getDefaultNewTile()
    }
    else {
      //use max id+1

      const maxFieldId = Math.max(...tile.fieldShapes.map(p => p.id))
      const maxImgId = Math.max(...tile.imgShapes.map(p => p.id))


      //every line point has a separate id...
      const getAllLineIds = (line: LineShape): number[] => {
        let ids: number[] = [line.id, line.startPoint.id]
        for (const point of line.points) {
          ids.push(point.id)
          ids.push(point.cp1.id)
          ids.push(point.cp2.id)
        }
        return ids
      }

      //symbols only have a guid but lines have the point ids too
      const getAllLineIdsFromSymbol = (symbol: LineSymbol): number[] => {
        let ids: number[] = [symbol.startPoint.id]
        for (const point of symbol.points) {
          ids.push(point.id)
          ids.push(point.cp1.id)
          ids.push(point.cp2.id)
        }
        return ids
      }


      const maxLineId = Math.max(...tile.lineShapes.map(p => getAllLineIds(p))
        .reduce((previousValue, currentValue) => previousValue.concat(currentValue), []))

      // const maxLineSymbolsId = Math.max(...tile.line.map(p => getAllLineIds(p))
      //   .reduce((previousValue, currentValue) => previousValue.concat(currentValue), []))


      const maxBorderPointId = Math.max(
        ...tile.topBorderPoints.map(p => p.id),
        ...tile.botBorderPoints.map(p => p.id),
        ...tile.leftBorderPoints.map(p => p.id),
        ...tile.rightBorderPoint.map(p => p.id),
      )

      const maxId = Math.max(maxFieldId, maxImgId, maxLineId, maxBorderPointId)
      __setNextShapeId(maxId + 1)
    }

    dispatch(set_simulation_simulationStatus(null, null))

    dispatch(_set_editor_isCreatingNewTile(isCreatingNewTile, tile))

    dispatch(setPropertyEditor_fieldsShapes(tile.fieldShapes))
    dispatch(setPropertyEditor_imgShapes(tile.imgShapes))
    dispatch(setPropertyEditor_lineShapes(tile.lineShapes))

    //this can fix all z indices that are wrong...
    renewAllZIndicesInTile()

    //clear history
    dispatch(reset_shapeEditor()) //this is needed because we changed lines & ... to [] which will set the last edited shape type
    dispatch(clearHistory_shapeEditor()) //this only clears the history arrays but not reset the shape reducer state

  }
}

export function setSelectedFieldShapeIds(selectedFieldShapeIds: ReadonlyArray<number>): SET_selectedFieldShapeIdsAction {
  return {
    type: ActionType.SET_selectedFieldShapeIds,
    selectedFieldShapeIds
  }
}


export function setSelectedLineShapeIds(selectedLineShapeIds: ReadonlyArray<number>): SET_selectedLineShapeIdsAction {
  return {
    type: ActionType.SET_selectedLineShapeIds,
    selectedLineShapeIds
  }
}


export function setSelectedImageShapeIds(selectedImageShapeIds: ReadonlyArray<number>): SET_selectedImageShapeIdsAction {
  return {
    type: ActionType.SET_selectedImageShapeIds,
    selectedImageShapeIds
  }
}

export function setEditor_IsAddImgShapeLibraryDisplayed(isAddImgShapeLibraryDisplayed: boolean): SET_editor_isAddImgShapeLibraryDisplayedAction {
  return {
    type: ActionType.SET_editor_isAddImgShapeLibraryDisplayed,
    isAddImgShapeLibraryDisplayed
  }
}

export function setEditor_IsChooseImgShapeImageLibraryDisplayed(isChooseImgShapeImageLibraryDisplayed: boolean): SET_editor_isChooseImgShapeImageLibraryDisplayedAction {
  return {
    type: ActionType.SET_editor_isChooseImgShapeImageLibraryDisplayed,
    isChooseImgShapeImageLibraryDisplayed
  }
}

export function setEditor_isChooseFieldShapeBackgroundImageLibraryDisplayed(isChooseFieldShapeBackgroundImageLibraryDisplayed: boolean): SET_editor_isChooseFieldShapeBackgroundImageLibraryDisplayedAction {
  return {
    type: ActionType.SET_editor_isChooseFieldShapeBackgroundImageLibraryDisplayed,
    isChooseFieldShapeBackgroundImageLibraryDisplayed
  }
}

export function set_editor_isSelectingNextField(isSelectingNextField: boolean, sourceForSelectingNextField: FieldShape | null): SET_editor_isSelectingNextFieldAction {
  return {
    type: ActionType.SET_editor_isSelectingNextField,
    isSelectingNextField,
    sourceForSelectingNextField
  }
}


//--- editor settings

export function setEditor_moveControlPointWhenPointIsMoved(moveControlPointWhenPointIsMoved: boolean): SET_moveControlPointWhenPointIsMovedAction {
  return {
    type: ActionType.SET_moveControlPointWhenPointIsMoved,
    moveControlPointWhenPointIsMoved
  }
}

export function setEditor_gridSizeInPx(gridSizeInPx: number): SET_editor_gridSizeInPxAction {
  return {
    type: ActionType.SET_editor_gridSizeInPx,
    gridSizeInPx
  }
}

export function setEditor_showGrid(showGrid: boolean): SET_editor_showGridAction {
  return {
    type: ActionType.SET_editor_showGrid,
    showGrid
  }
}


export function setEditor_snapToGrid(snapToGrid: boolean): SET_editor_snapToGridAction {
  return {
    type: ActionType.SET_editor_snapToGrid,
    snapToGrid
  }
}

export function setEditor_showSequenceIds(showSequenceIds: boolean): SET_editor_showSequenceIdsAction {
  return {
    type: ActionType.SET_editor_showSequenceIds,
    showSequenceIds
  }
}


export function setEditor_stageOffset(stageOffsetX: number, stageOffsetY: number): SET_editor_stageOffsetAction {
  return {
    type: ActionType.SET_editor_stageOffset,
    stageOffsetX,
    stageOffsetY
  }
}

export function set_editor_stageOffsetScaleCorrection(stageOffsetXScaleCorrection: number, stageOffsetYScaleCorrection: number): SET_editor_stageOffsetScaleCorrectionAction {
  return {
    type: ActionType.SET_editor_stageOffsetScaleCorrection,
    stageOffsetXScaleCorrection,
    stageOffsetYScaleCorrection
  }
}

export function setEditor_stageScale(stageScaleX: number, stageScaleY: number): SET_editor_stageScaleAction {
  return {
    type: ActionType.SET_editor_stageScale,
    stageScaleX,
    stageScaleY
  }
}


export function setEditor_printLargeTilePreferredWidthInPx(printLargeTilePreferredWidthInPx: number): SET_editor_printLargeTilePreferredWidthInPxAction {
  return {
    type: ActionType.SET_editor_printLargeTilePreferredWidthInPx,
    printLargeTilePreferredWidthInPx
  }
}

export function setEditor_printLargeTilePreferredHeightInPx(printLargeTilePreferredHeightInPx: number): SET_editor_printLargeTilePreferredHeightInPxAction {
  return {
    type: ActionType.SET_editor_printLargeTilePreferredHeightInPx,
    printLargeTilePreferredHeightInPx
  }
}

export function setEditor_splitLargeTileForPrint(splitLargeTileForPrint: boolean): SET_editor_splitLargeTileForPrintAction {
  return {
    type: ActionType.SET_editor_splitLargeTileForPrint,
    splitLargeTileForPrint
  }
}

//--- tile props

export function setEditor_tileWidth(tileWidth: number): SET_editor_tileWidthAction {
  return {
    type: ActionType.SET_editor_tileWidth,
    tileWidth
  }
}

export function setEditor_tileHeight(tileHeight: number): SET_editor_tileHeightAction {
  return {
    type: ActionType.SET_editor_tileHeight,
    tileHeight
  }
}

export function setEditor_tileDisplayName(tileDisplayName: string): SET_editor_tileDisplayNameAction {
  return {
    type: ActionType.SET_editor_tileDisplayName,
    tileDisplayName
  }
}

export function set_editor_topBorderPoints(topBorderPoints: ReadonlyArray<BorderPoint>): SET_editor_topBorderPointsAction {
  return {
    type: ActionType.SET_editor_topBorderPoints,
    topBorderPoints
  }
}

export function set_editor_botBorderPoints(botBorderPoints: ReadonlyArray<BorderPoint>): SET_editor_botBorderPointsAction {
  return {
    type: ActionType.SET_editor_botBorderPoints,
    botBorderPoints
  }
}

export function set_editor_leftBorderPoints(leftBorderPoints: ReadonlyArray<BorderPoint>): SET_editor_leftBorderPointsAction {
  return {
    type: ActionType.SET_editor_leftBorderPoints,
    leftBorderPoints
  }
}

export function set_editor_rightBorderPoint(rightBorderPoint: ReadonlyArray<BorderPoint>): SET_editor_rightBorderPointAction {
  return {
    type: ActionType.SET_editor_rightBorderPoint,
    rightBorderPoint
  }
}

export function set_editor_simulationStartFieldIds(simulationStartFieldIds: ReadonlyArray<number>): SET_editor_simulationStartFieldIdsAction {
  return {
    type: ActionType.SET_editor_simulationStartFieldIds,
    simulationStartFieldIds
  }
}

export function set_editor_simulationEndFieldIds(simulationEndFieldIds: ReadonlyArray<number>): SET_editor_simulationEndFieldIdsAction {
  return {
    type: ActionType.SET_editor_simulationEndFieldIds,
    simulationEndFieldIds
  }
}

export function set_editor_isTileEditorSettingsModalDisplayed(isTileEditorSettingsModalDisplayed: boolean): SET_editor_isTileEditorSettingsModalDisplayedAction {
  return {
    type: ActionType.SET_editor_isTileEditorSettingsModalDisplayed,
    isTileEditorSettingsModalDisplayed
  }
}

export function _set_editor_rightTabActiveIndex(rightTabActiveIndex: RightTileEditorTabs): SET_editor_rightTabActiveIndexAction {
  return {
    type: ActionType.SET_editor_rightTabActiveIndex,
    rightTabActiveIndex
  }
}

export function set_editor_rightTabActiveIndex(rightTabActiveIndex: RightTileEditorTabs): MultiActions {
  return (dispatch, getState) => {

    const lastRightTabActiveIndex = getState().tileEditorState.rightTabActiveIndex

    if (lastRightTabActiveIndex === rightTabActiveIndex) {
      //nothing to do
      return
    }

    dispatch(_set_editor_rightTabActiveIndex(rightTabActiveIndex))

    //we can't go back to property editor, it might be removed when we roll back the index
    if (lastRightTabActiveIndex === RightTileEditorTabs.simulationTab || lastRightTabActiveIndex === RightTileEditorTabs.borderPointsTab) {
      dispatch(_set_editor_lastRightTabActiveIndex(lastRightTabActiveIndex))
    }
  }
}

export function set_editor_restoreRightTabActiveIndex(): MultiActions {
  return (dispatch, getState) => {

    const lastRightTabActiveIndex = getState().tileEditorState.lastRightTabActiveIndex
    const rightTabActiveIndex = getState().tileEditorState.rightTabActiveIndex

    //only roll back if we still select the props editor
    if (rightTabActiveIndex !== RightTileEditorTabs.propertyEditorTab) return

    dispatch(_set_editor_rightTabActiveIndex(lastRightTabActiveIndex))
  }
}

export function _set_editor_lastRightTabActiveIndex(lastRightTabActiveIndex: RightTileEditorTabs): SET_editor_lastRightTabActiveIndexAction {
  return {
    type: ActionType.SET_editor_lastRightTabActiveIndex,
    lastRightTabActiveIndex
  }
}

export function set_editor_leftTabActiveIndex(leftTabActiveIndex: LeftTileEditorTabs): SET_editor_leftTabActiveIndexAction {
  return {
    type: ActionType.SET_editor_leftTabActiveIndex,
    leftTabActiveIndex
  }
}

export function set_editor_autoIncrementFieldTextNumbersOnDuplicate(autoIncrementFieldTextNumbersOnDuplicate: boolean): SET_editor_autoIncrementFieldTextNumbersOnDuplicateAction {
  return {
    type: ActionType.SET_editor_autoIncrementFieldTextNumbersOnDuplicate,
    autoIncrementFieldTextNumbersOnDuplicate
  }
}

export function set_editor_majorLineDirectionAction(majorLineDirection: MajorLineDirection): SET_editor_majorLineDirectionAction {
  return {
    type: ActionType.SET_editor_majorLineDirection,
    majorLineDirection
  }
}

export function set_editor_isLeftTabMenuExpandedAction(isLeftTabMenuExpanded: boolean): SET_editor_isLeftTabMenuExpandedAction {
  return {
    type: ActionType.SET_editor_isLeftTabMenuExpanded,
    isLeftTabMenuExpanded
  }
}

export function set_editor_arePrintGuidesDisplayed(arePrintGuidesDisplayed: boolean): SET_editor_arePrintGuidesDisplayedAction {
  return {
    type: ActionType.SET_editor_arePrintGuidesDisplayed,
    arePrintGuidesDisplayed
  }
}