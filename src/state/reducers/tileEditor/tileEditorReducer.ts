import {Action} from "redux";
import {notExhaustive} from "../_notExhausiveHelper";
import {MajorLineDirection, Tile, TileProps} from "../../../types/world";
import {getDefaultNewTile} from "../../../constants";
import {BorderPoint, FieldShape} from "../../../types/drawing";

export const exampleTile: TileProps = getDefaultNewTile()


export enum LeftTileEditorTabs {
  fieldSymbolsTab = 0,
  imgSymbolsTab = 1,
  lineSymbolsTab = 2,
  tileOutlineTab = 3
}

export enum RightTileEditorTabs {
  simulationTab = 0,
  borderPointsTab = 1,
  propertyEditorTab = 2
}

export type State = {

  /**
   * true: when finished add to tile library...
   * false: we just want to edit a tile
   */
  readonly isCreatingNewTile: boolean

  readonly tileProps: TileProps

  readonly selectedFieldShapeIds: ReadonlyArray<number>
  readonly selectedLineShapeIds: ReadonlyArray<number>
  readonly selectedImageShapeIds: ReadonlyArray<number>


  readonly stageOffsetX: number
  readonly stageOffsetY: number

  /*
   * we need to save the original offset (by user) and the scaled correction offset
   * separately because when we scale we only want to change this but not to user defined
   * offset
   */
  readonly stageOffsetXScaleCorrection: number
  readonly stageOffsetYScaleCorrection: number

  readonly stageScaleX: number
  readonly stageScaleY: number

  readonly isAddImgShapeLibraryDisplayed: boolean


  readonly isTileEditorSettingsModalDisplayed: boolean

  /**
   * in the img properties
   */
  readonly isChooseImgShapeImageLibraryDisplayed: boolean

  /**
   * for the field shape/symbol background img prop
   */
  readonly isChooseFieldShapeBackgroundImageLibraryDisplayed: boolean

  /**
   * 0: border points
   * 1: (only if possible) the props of field/img/line/symbol...
   */
  readonly rightTabActiveIndex: RightTileEditorTabs

  /**
   * when we select automatically the edit props tab (when selecting a shape)
   * then we want to switch back to the last right tab index after the shape lost selection
   */
  readonly lastRightTabActiveIndex: RightTileEditorTabs

  readonly leftTabActiveIndex: LeftTileEditorTabs


  /**
   * select the next field for simulation (to know where go next)
   */
  readonly isSelectingNextField: boolean
  readonly sourceForSelectingNextField: FieldShape | null

  readonly isLeftTabMenuExpanded: boolean

  readonly isSymbolLibraryModalDisplayed: boolean

  /**
   * true: to display a loader in the button,
   * false: not
   * when (re-)connecting lines via position this could take a while
   * when we have many lines or fields (we need to call new pos for every point (with the old pos) in order to
   * connect them
   */
  readonly isReconnectingLinesToAnchorPoints: boolean

}

export interface SimulationResult {
  readonly runNumber: number
  readonly winnerIds: number[]
  readonly elapsedTime: number

  readonly error: string | null
}

export const initial: State = {
  isCreatingNewTile: true,
  tileProps: exampleTile,
  selectedFieldShapeIds: [],
  selectedLineShapeIds: [],
  selectedImageShapeIds: [],

  stageOffsetX: 0,
  stageOffsetY: 0,
  stageOffsetXScaleCorrection: 0,
  stageOffsetYScaleCorrection: 0,
  stageScaleX: 1,
  stageScaleY: 1,

  isAddImgShapeLibraryDisplayed: false,

  isChooseFieldShapeBackgroundImageLibraryDisplayed: false,

  isTileEditorSettingsModalDisplayed: false,

  rightTabActiveIndex: RightTileEditorTabs.simulationTab,
  lastRightTabActiveIndex: RightTileEditorTabs.simulationTab,
  leftTabActiveIndex: LeftTileEditorTabs.fieldSymbolsTab,


  isSelectingNextField: false,
  sourceForSelectingNextField: null,

  isLeftTabMenuExpanded: false,

  isChooseImgShapeImageLibraryDisplayed: false,

  isSymbolLibraryModalDisplayed: false,

  isReconnectingLinesToAnchorPoints: false,

}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  SET_tile = 'tileEditorReducer_SET_tile',


  SET_selectedFieldShapeIds = 'tileEditorReducer_SET_selectedFieldShapeIds',
  SET_selectedLineShapeIds = 'tileEditorReducer_SET_selectedLineShapeIds',
  SET_selectedImageShapeIds = 'tileEditorReducer_SET_selectedImageShapeIds',

  SET_moveBezierControlPointsWhenLineIsMoved = 'tileEditorReducer_SET_moveBezierControlPointsWhenLineIsMoved',


  SET_editor_gridSizeInPx = 'tileEditorReducer_SET_editor_gridSizeInPx',
  SET_editor_showGrid = 'tileEditorReducer_SET_editor_showGrid',
  SET_editor_snapToGrid = 'tileEditorReducer_SET_editor_snapToGrid',
  SET_editor_showSequenceIds = 'tileEditorReducer_SET_editor_showSequenceIds',

  SET_editor_stageOffset = 'tileEditorReducer_SET_editor_stageOffset',
  SET_editor_stageOffsetScaleCorrection = 'tileEditorReducer_SET_editor_stageOffsetScaleCorrection',
  SET_editor_stageScale = 'tileEditorReducer_SET_editor_stageScale',


  SET_editor_tileWidth = 'tileEditorReducer_SET_editor_tileWidth',
  SET_editor_tileHeight = 'tileEditorReducer_SET_editor_tileHeight',

  SET_editor_tileDisplayName = 'tileEditorReducer_SET_editor_tileDisplayName',

  SET_editor_isAddImgShapeLibraryDisplayed = 'tileEditorReducer_SET_editor_isAddImgShapeLibraryDisplayed',
  SET_editor_isChooseImgShapeImageLibraryDisplayed = 'tileEditorReducer_SET_editor_isChooseImgShapeImageLibraryDisplayed',
  SET_editor_isChooseFieldShapeBackgroundImageLibraryDisplayed = 'tileEditorReducer_SET_editor_isChooseFieldShapeBackgroundImageLibraryDisplayed',

  SET_editor_printLargeTilePreferredWidthInPx = 'tileEditorReducer_SET_editor_printLargeTilePreferredWidthInPx',
  SET_editor_printLargeTilePreferredHeightInPx = 'tileEditorReducer_SET_editor_printLargeTilePreferredHeightInPx',

  SET_editor_splitLargeTileForPrint = 'tileEditorReducer_SET_editor_splitLargeTileForPrint',


  SET_editor_topBorderPoints = 'tileEditorReducer_SET_editor_topBorderPoints',
  SET_editor_botBorderPoints = 'tileEditorReducer_SET_editor_botBorderPoints',
  SET_editor_leftBorderPoints = 'tileEditorReducer_SET_editor_leftBorderPoints',
  SET_editor_rightBorderPoint = 'tileEditorReducer_SET_editor_rightBorderPoint',

  SET_editor_isCreatingNewTile = 'tileEditorReducer_SET_editor_isCreatingNewTile',

  SET_editor_isTileEditorSettingsModalDisplayed = 'tileEditorReducer_SET_editor_isTileEditorSettingsModalDisplayed',
  SET_editor_rightTabActiveIndex = 'tileEditorReducer_SET_editor_rightTabActiveIndex',
  SET_editor_lastRightTabActiveIndex = 'tileEditorReducer_SET_editor_lastRightTabActiveIndex',
  SET_editor_leftTabActiveIndex = 'tileEditorReducer_SET_editor_leftTabActiveIndex',

  SET_editor_autoIncrementFieldTextNumbersOnDuplicate = 'tileEditorReducer_SET_editor_autoIncrementFieldTextNumbersOnDuplicate',
  SET_editor_insertLinesEvenIfFieldsIntersect = 'tileEditorReducer_SET_editor_insertLinesEvenIfFieldsIntersect',


  SET_editor_isSelectingNextField = 'tileEditorReducer_SET_editor_isSelectingNextField',

  SET_editor_majorLineDirection = 'tileEditorReducer_SET_editor_majorLineDirection',

  SET_editor_simulationStartFieldIds = 'tileEditorReducer_SET_editor_simulationStartFieldIds',
  SET_editor_simulationEndFieldIds = 'tileEditorReducer_SET_editor_simulationEndFieldIds',

  SET_editor_isLeftTabMenuExpanded = 'tileEditorReducer_SET_editor_isLeftTabMenuExpanded',

  SET_editor_arePrintGuidesDisplayed = 'tileEditorReducer_SET_editor_arePrintGuidesDisplayed',

  SET_editor_isSymbolLibraryModalDisplayed = 'tileEditorReducer_SET_editor_isSymbolLibraryModalDisplayed',

  SET_editor_isReconnectingLinesToAnchorPoints = 'tileEditorReducer_SET_editor_isReconnectingLinesToAnchorPoints',


  CLEAR_allBorderPoints_connectedLines = 'tileEditorReducer_CLEAR_allBorderPoints_connectedLines',

  RESET = 'tileEditorReducer_RESET',
}


export interface SET_editor_isCreatingNewTileAction extends ActionBase {
  readonly type: ActionType.SET_editor_isCreatingNewTile
  readonly isCreatingNewTile: boolean
  readonly tile: Tile
}


//only used for import currently...
export interface SET_tileAction extends ActionBase {
  readonly type: ActionType.SET_tile
  readonly tile: Tile
}

export interface SET_selectedFieldShapeIdsAction extends ActionBase {
  readonly type: ActionType.SET_selectedFieldShapeIds
  readonly selectedFieldShapeIds: ReadonlyArray<number>
}

export interface SET_selectedLineShapeIdsAction extends ActionBase {
  readonly type: ActionType.SET_selectedLineShapeIds
  readonly selectedLineShapeIds: ReadonlyArray<number>
}

export interface SET_selectedImageShapeIdsAction extends ActionBase {
  readonly type: ActionType.SET_selectedImageShapeIds
  readonly selectedImageShapeIds: ReadonlyArray<number>
}

export interface SET_editor_isAddImgShapeLibraryDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_editor_isAddImgShapeLibraryDisplayed
  readonly isAddImgShapeLibraryDisplayed: boolean
}

export interface SET_editor_isChooseImgShapeImageLibraryDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_editor_isChooseImgShapeImageLibraryDisplayed
  readonly isChooseImgShapeImageLibraryDisplayed: boolean
}

export interface SET_editor_isChooseFieldShapeBackgroundImageLibraryDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_editor_isChooseFieldShapeBackgroundImageLibraryDisplayed
  readonly isChooseFieldShapeBackgroundImageLibraryDisplayed: boolean
}

export interface SET_editor_isTileEditorSettingsModalDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_editor_isTileEditorSettingsModalDisplayed
  readonly isTileEditorSettingsModalDisplayed: boolean
}

export interface SET_editor_rightTabActiveIndexAction extends ActionBase {
  readonly type: ActionType.SET_editor_rightTabActiveIndex
  readonly rightTabActiveIndex: RightTileEditorTabs
}

export interface SET_editor_lastRightTabActiveIndexAction extends ActionBase {
  readonly type: ActionType.SET_editor_lastRightTabActiveIndex
  readonly lastRightTabActiveIndex: RightTileEditorTabs
}

export interface SET_editor_lastRightTabActiveIndexAction extends ActionBase {
  readonly type: ActionType.SET_editor_lastRightTabActiveIndex
  readonly lastRightTabActiveIndex: RightTileEditorTabs
}

export interface SET_editor_leftTabActiveIndexAction extends ActionBase {
  readonly type: ActionType.SET_editor_leftTabActiveIndex
  readonly leftTabActiveIndex: LeftTileEditorTabs
}

export interface SET_editor_isSelectingNextFieldAction extends ActionBase {
  readonly type: ActionType.SET_editor_isSelectingNextField
  readonly isSelectingNextField: boolean
  readonly sourceForSelectingNextField: FieldShape | null
}

export interface SET_editor_isLeftTabMenuExpandedAction extends ActionBase {
  readonly type: ActionType.SET_editor_isLeftTabMenuExpanded
  readonly isLeftTabMenuExpanded: boolean
}

export interface SET_editor_isSymbolLibraryModalDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_editor_isSymbolLibraryModalDisplayed
  readonly isSymbolLibraryModalDisplayed: boolean
}


//--- editor settings

export interface SET_moveControlPointWhenPointIsMovedAction extends ActionBase {
  readonly type: ActionType.SET_moveBezierControlPointsWhenLineIsMoved
  readonly moveBezierControlPointsWhenLineIsMoved: boolean
}


export interface SET_editor_gridSizeInPxAction extends ActionBase {
  readonly type: ActionType.SET_editor_gridSizeInPx
  readonly gridSizeInPx: number
}

export interface SET_editor_showGridAction extends ActionBase {
  readonly type: ActionType.SET_editor_showGrid
  readonly showGrid: boolean
}

export interface SET_editor_snapToGridAction extends ActionBase {
  readonly type: ActionType.SET_editor_snapToGrid
  readonly snapToGrid: boolean
}

export interface SET_editor_showSequenceIdsAction extends ActionBase {
  readonly type: ActionType.SET_editor_showSequenceIds
  readonly showSequenceIds: boolean
}

export interface SET_editor_stageOffsetAction extends ActionBase {
  readonly type: ActionType.SET_editor_stageOffset
  readonly stageOffsetX: number
  readonly stageOffsetY: number
}

export interface SET_editor_stageOffsetScaleCorrectionAction extends ActionBase {
  readonly type: ActionType.SET_editor_stageOffsetScaleCorrection
  readonly stageOffsetXScaleCorrection: number
  readonly stageOffsetYScaleCorrection: number
}

export interface SET_editor_stageScaleAction extends ActionBase {
  readonly type: ActionType.SET_editor_stageScale
  readonly stageScaleX: number
  readonly stageScaleY: number
}

export interface SET_editor_printLargeTilePreferredWidthInPxAction extends ActionBase {
  readonly type: ActionType.SET_editor_printLargeTilePreferredWidthInPx
  readonly printLargeTilePreferredWidthInPx: number
}

export interface SET_editor_printLargeTilePreferredHeightInPxAction extends ActionBase {
  readonly type: ActionType.SET_editor_printLargeTilePreferredHeightInPx
  readonly printLargeTilePreferredHeightInPx: number
}

export interface SET_editor_splitLargeTileForPrintAction extends ActionBase {
  readonly type: ActionType.SET_editor_splitLargeTileForPrint
  readonly splitLargeTileForPrint: boolean
}


export interface SET_editor_autoIncrementFieldTextNumbersOnDuplicateAction extends ActionBase {
  readonly type: ActionType.SET_editor_autoIncrementFieldTextNumbersOnDuplicate
  readonly autoIncrementFieldTextNumbersOnDuplicate: boolean
}

export interface SET_editor_insertLinesEvenIfFieldsIntersectAction extends ActionBase {
  readonly type: ActionType.SET_editor_insertLinesEvenIfFieldsIntersect
  readonly insertLinesEvenIfFieldsIntersect: boolean
}


export interface SET_editor_majorLineDirectionAction extends ActionBase {
  readonly type: ActionType.SET_editor_majorLineDirection
  readonly majorLineDirection: MajorLineDirection
}

export interface SET_editor_arePrintGuidesDisplayedAction extends ActionBase {
  readonly type: ActionType.SET_editor_arePrintGuidesDisplayed
  readonly arePrintGuidesDisplayed: boolean
}


//-- tile props

export interface SET_editor_tileWidthAction extends ActionBase {
  readonly type: ActionType.SET_editor_tileWidth
  readonly tileWidth: number
}

export interface SET_editor_tileHeightAction extends ActionBase {
  readonly type: ActionType.SET_editor_tileHeight
  readonly tileHeight: number
}

export interface SET_editor_tileDisplayNameAction extends ActionBase {
  readonly type: ActionType.SET_editor_tileDisplayName
  readonly tileDisplayName: string
}

export interface SET_editor_topBorderPointsAction extends ActionBase {
  readonly type: ActionType.SET_editor_topBorderPoints
  readonly topBorderPoints: ReadonlyArray<BorderPoint>
}

export interface SET_editor_botBorderPointsAction extends ActionBase {
  readonly type: ActionType.SET_editor_botBorderPoints
  readonly botBorderPoints: ReadonlyArray<BorderPoint>
}

export interface SET_editor_leftBorderPointsAction extends ActionBase {
  readonly type: ActionType.SET_editor_leftBorderPoints
  readonly leftBorderPoints: ReadonlyArray<BorderPoint>
}

export interface SET_editor_rightBorderPointAction extends ActionBase {
  readonly type: ActionType.SET_editor_rightBorderPoint
  readonly rightBorderPoint: ReadonlyArray<BorderPoint>
}

export interface SET_editor_simulationStartFieldIdsAction extends ActionBase {
  readonly type: ActionType.SET_editor_simulationStartFieldIds
  readonly simulationStartFieldIds: ReadonlyArray<number>
}

export interface SET_editor_simulationEndFieldIdsAction extends ActionBase {
  readonly type: ActionType.SET_editor_simulationEndFieldIds
  readonly simulationEndFieldIds: ReadonlyArray<number>
}

export interface SET_editor_isReconnectingLinesToAnchorPointsAction extends ActionBase {
  readonly type: ActionType.SET_editor_isReconnectingLinesToAnchorPoints
  readonly isReconnectingLinesToAnchorPoints: boolean
}

export interface CLEAR_allBorderPoints_connectedLinesAction extends ActionBase {
  readonly type: ActionType.CLEAR_allBorderPoints_connectedLines
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction

  | SET_editor_isCreatingNewTileAction
  | SET_tileAction
  | SET_selectedFieldShapeIdsAction
  | SET_selectedLineShapeIdsAction
  | SET_selectedImageShapeIdsAction
  | SET_editor_isAddImgShapeLibraryDisplayedAction
  | SET_editor_isChooseImgShapeImageLibraryDisplayedAction
  | SET_editor_isChooseFieldShapeBackgroundImageLibraryDisplayedAction
  | SET_editor_isTileEditorSettingsModalDisplayedAction
  | SET_editor_rightTabActiveIndexAction
  | SET_editor_lastRightTabActiveIndexAction
  | SET_editor_leftTabActiveIndexAction
  | SET_editor_isSelectingNextFieldAction
  | SET_editor_isLeftTabMenuExpandedAction
  | SET_editor_isSymbolLibraryModalDisplayedAction

  | SET_moveControlPointWhenPointIsMovedAction
  | SET_editor_gridSizeInPxAction
  | SET_editor_showGridAction
  | SET_editor_snapToGridAction
  | SET_editor_showSequenceIdsAction

  | SET_editor_stageOffsetAction
  | SET_editor_stageOffsetScaleCorrectionAction
  | SET_editor_stageScaleAction

  | SET_editor_tileWidthAction
  | SET_editor_tileHeightAction
  | SET_editor_tileDisplayNameAction
  | SET_editor_topBorderPointsAction
  | SET_editor_botBorderPointsAction
  | SET_editor_leftBorderPointsAction
  | SET_editor_rightBorderPointAction
  | SET_editor_simulationStartFieldIdsAction
  | SET_editor_simulationEndFieldIdsAction

  | SET_editor_printLargeTilePreferredWidthInPxAction
  | SET_editor_printLargeTilePreferredHeightInPxAction
  | SET_editor_splitLargeTileForPrintAction
  | SET_editor_autoIncrementFieldTextNumbersOnDuplicateAction
  | SET_editor_insertLinesEvenIfFieldsIntersectAction
  | SET_editor_majorLineDirectionAction
  | SET_editor_arePrintGuidesDisplayedAction
  | SET_editor_isReconnectingLinesToAnchorPointsAction

  | CLEAR_allBorderPoints_connectedLinesAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_tile:
      return {
        ...initial, //full reset
        tileProps: action.tile
      }


    case ActionType.CLEAR_allBorderPoints_connectedLines:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          topBorderPoints: state.tileProps.topBorderPoints.map(p => ({...p, connectedLineTuples: []})),
          botBorderPoints: state.tileProps.botBorderPoints.map(p => ({...p, connectedLineTuples: []})),
          leftBorderPoints: state.tileProps.leftBorderPoints.map(p => ({...p, connectedLineTuples: []})),
          rightBorderPoint: state.tileProps.rightBorderPoint.map(p => ({...p, connectedLineTuples: []})),
        }
      }

    case ActionType.SET_editor_isCreatingNewTile:
      return {
        ...initial, //full reset
        isLeftTabMenuExpanded: state.isLeftTabMenuExpanded,
        isCreatingNewTile: action.isCreatingNewTile,
        tileProps: action.tile
      }

    case ActionType.SET_selectedFieldShapeIds:
      return {
        ...state,
        selectedFieldShapeIds: action.selectedFieldShapeIds,
      }

    case ActionType.SET_selectedLineShapeIds:
      return {
        ...state,
        selectedLineShapeIds: action.selectedLineShapeIds,
      }
    case ActionType.SET_selectedImageShapeIds:
      return {
        ...state,
        selectedImageShapeIds: action.selectedImageShapeIds,
      }

    case ActionType.SET_moveBezierControlPointsWhenLineIsMoved:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            moveBezierControlPointsWhenLineIsMoved: action.moveBezierControlPointsWhenLineIsMoved
          }
        },
      }


    case ActionType.SET_editor_gridSizeInPx:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            gridSizeInPx: action.gridSizeInPx,
          }
        },
      }

    case ActionType.SET_editor_showGrid:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            showGrid: action.showGrid,
          }
        },
      }

    case ActionType.SET_editor_snapToGrid:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            snapToGrid: action.snapToGrid,
          }
        },
      }

    case ActionType.SET_editor_showSequenceIds:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            showSequenceIds: action.showSequenceIds,
          }
        },
      }

    case ActionType.SET_editor_stageOffset: {
      let offsetX = action.stageOffsetX
      let offsetY = action.stageOffsetY

      if (state.tileProps.tileSettings.snapToGrid) {
        offsetX = Math.round(action.stageOffsetX / state.tileProps.tileSettings.gridSizeInPx) * state.tileProps.tileSettings.gridSizeInPx
        offsetY = Math.round(action.stageOffsetY / state.tileProps.tileSettings.gridSizeInPx) * state.tileProps.tileSettings.gridSizeInPx
      }
      return {
        ...state,
        stageOffsetX: offsetX,
        stageOffsetY: offsetY
      }
    }
    case ActionType.SET_editor_stageOffsetScaleCorrection: {
      let offsetX = action.stageOffsetXScaleCorrection
      let offsetY = action.stageOffsetYScaleCorrection

      if (state.tileProps.tileSettings.snapToGrid) {
        offsetX = Math.round(action.stageOffsetXScaleCorrection / state.tileProps.tileSettings.gridSizeInPx) * state.tileProps.tileSettings.gridSizeInPx
        offsetY = Math.round(action.stageOffsetYScaleCorrection / state.tileProps.tileSettings.gridSizeInPx) * state.tileProps.tileSettings.gridSizeInPx
      }
      return {
        ...state,
        stageOffsetXScaleCorrection: offsetX,
        stageOffsetYScaleCorrection: offsetY
      }
    }

    case ActionType.SET_editor_stageScale: {
      let scaleX = action.stageScaleX
      let scaleY = action.stageScaleY
      return {
        ...state,
        stageScaleX: scaleX,
        stageScaleY: scaleY
      }
    }

    case ActionType.SET_editor_tileWidth:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            width: action.tileWidth
          }
        },
      }

    case ActionType.SET_editor_tileHeight:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            height: action.tileHeight
          }
        },
      }

    case ActionType.SET_editor_tileDisplayName:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            displayName: action.tileDisplayName
          }
        },
      }

    case ActionType.SET_editor_topBorderPoints:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          topBorderPoints: action.topBorderPoints
        },
      }

    case ActionType.SET_editor_botBorderPoints:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          botBorderPoints: action.botBorderPoints
        },
      }

    case ActionType.SET_editor_leftBorderPoints:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          leftBorderPoints: action.leftBorderPoints
        },
      }
    case ActionType.SET_editor_rightBorderPoint:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          rightBorderPoint: action.rightBorderPoint
        },
      }

    case ActionType.SET_editor_simulationStartFieldIds:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          simulationStartFieldIds: action.simulationStartFieldIds
        },
      }
    case ActionType.SET_editor_simulationEndFieldIds:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          simulationEndFieldIds: action.simulationEndFieldIds
        },
      }

    case ActionType.SET_editor_isAddImgShapeLibraryDisplayed:
      return {
        ...state,
        isAddImgShapeLibraryDisplayed: action.isAddImgShapeLibraryDisplayed
      }
    case ActionType.SET_editor_isChooseImgShapeImageLibraryDisplayed:
      return {
        ...state,
        isChooseImgShapeImageLibraryDisplayed: action.isChooseImgShapeImageLibraryDisplayed
      }
    case ActionType.SET_editor_isChooseFieldShapeBackgroundImageLibraryDisplayed:
      return {
        ...state,
        isChooseFieldShapeBackgroundImageLibraryDisplayed: action.isChooseFieldShapeBackgroundImageLibraryDisplayed
      }

    case ActionType.SET_editor_printLargeTilePreferredWidthInPx:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            printLargeTilePreferredWidthInPx: action.printLargeTilePreferredWidthInPx
          }
        },
      }

    case ActionType.SET_editor_printLargeTilePreferredHeightInPx:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            printLargeTilePreferredHeightInPx: action.printLargeTilePreferredHeightInPx
          }
        },
      }

    case ActionType.SET_editor_splitLargeTileForPrint:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            splitLargeTileForPrint: action.splitLargeTileForPrint
          }
        },
      }
    case ActionType.SET_editor_isTileEditorSettingsModalDisplayed:
      return {
        ...state,
        isTileEditorSettingsModalDisplayed: action.isTileEditorSettingsModalDisplayed
      }
    case ActionType.SET_editor_rightTabActiveIndex:
      return {
        ...state,
        rightTabActiveIndex: action.rightTabActiveIndex
      }
    case ActionType.SET_editor_lastRightTabActiveIndex:
      return {
        ...state,
        lastRightTabActiveIndex: action.lastRightTabActiveIndex
      }
    case ActionType.SET_editor_leftTabActiveIndex:
      return {
        ...state,
        leftTabActiveIndex: action.leftTabActiveIndex
      }
    case ActionType.SET_editor_autoIncrementFieldTextNumbersOnDuplicate:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            autoIncrementFieldTextNumbersOnDuplicate: action.autoIncrementFieldTextNumbersOnDuplicate
          }
        },
      }
    case ActionType.SET_editor_insertLinesEvenIfFieldsIntersect:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            insertLinesEvenIfFieldsIntersect: action.insertLinesEvenIfFieldsIntersect
          }
        },
      }

    case ActionType.SET_editor_isSelectingNextField:
      return {
        ...state,
        isSelectingNextField: action.isSelectingNextField,
        sourceForSelectingNextField: action.sourceForSelectingNextField
      }

    case ActionType.SET_editor_majorLineDirection:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            majorLineDirection: action.majorLineDirection,
          }
        },
      }

    case ActionType.SET_editor_isLeftTabMenuExpanded:
      return {
        ...state,
        isLeftTabMenuExpanded: action.isLeftTabMenuExpanded,
      }
    case ActionType.SET_editor_isSymbolLibraryModalDisplayed:
      return {
        ...state,
        isSymbolLibraryModalDisplayed: action.isSymbolLibraryModalDisplayed,
      }

    case ActionType.SET_editor_arePrintGuidesDisplayed:
      return {
        ...state,
        tileProps: {
          ...state.tileProps,
          tileSettings: {
            ...state.tileProps.tileSettings,
            arePrintGuidesDisplayed: action.arePrintGuidesDisplayed,
          }
        },
      }

    case ActionType.SET_editor_isReconnectingLinesToAnchorPoints:
      return {
        ...state,
        isReconnectingLinesToAnchorPoints: action.isReconnectingLinesToAnchorPoints
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

