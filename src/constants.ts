import {
  AbsolutePosition,
  AnchorPoint,
  FieldShape,
  HorizontalAlign,
  ImgShape,
  LineShape,
  VerticalAlign
} from "./types/drawing";
import {MajorLineDirection, Tile} from "./types/world";
import {getNextShapeId} from "./state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import {getGuid} from "./helpers/guid";
import {ActionTypes} from "redux-undo";

export const appProperties = {
  version: '1.2.1',
  appName: 'Basic board game editor',
  exportFileNamePrefix: 'bbge'
}


//if we have e.g. widht 5000 and height 1000 we get a small rectangle...
export const maxTileRendererCanvasWidth = 1000
export const maxTileRendererCanvasHeight = 1000

export const symbolPreviewWidth = 150
export const symbolPreviewHeight = 150

export const changeLinesFromAllTilesInLibraryWhenChangingFieldSymbol = true

export  const exportPngImagesBgColor: string | null = 'white'

export const qrCodeSizeInPx = 300
export const qrCodeDataVersion = 1
export const qrCodeCorrectionLevel: "low" | "medium" | "quartile" | "high" = "low"

export const maxTileBorderPointToBorderPointTransitionWithoutFields = 1000

export let isLinkedToSymbolIndicatorSizeInPx = 10
export let isLinkedToSymbolIndicatorCornerRadius = 2
export let isLinkedToSymbolIndicatorColor = '#000000'

export let imgNotFoundBgColor = '#ebebeb'
export let imgNotFoundColor = '#dddddd'
export let imgNotFoundStrokeThickness = 2


export const selectionRectBgColor = '#50a2f0'
export const selectionRectBorderColor = 'black'
export const selectionBgAlpha = 0.3

export const popupDelay = 1000

export const lineShapeDefaultColor = '#d4d4d4'


export const newField_x = 100
export const newField_y = 100
export const newField_width = 100
export const newField_height = 45


export const ui_helpPopupDelayInMs = 1500

export const defaultTileWidth = 500
export const defaultTileHeight = 500

export const worldSelectedTileBorderColor = 'blue'
export const worldTileBorderColor = '#dddddd'

export const printVariableIndicatorBorderColor = '#dddddd'
export const printVariableIndicatorStrokeThickness = 3

export const copyPastDiffXInPx = 20
export const copyPastDiffYInPx = 20

export const defaultAddImgHeight = 100
export const defaultAddImgWidth = 100

export const globalZoomStep = 0.25
export const globalMinimalZoom = 0.25

/**
 * larger than 500 and we cannot get 2 tiles on one din a4
 * removed... the user can specify this... if it makes no sense then the user is to be blamed
 */
// export const maxPrintTileWidth = 500
// export const maxPrintTileHeight = 500

export const printLargeTileBgColor = '#ffffff'

export const defaultArrowWidth = 10
export const defaultArrowHeight = 10

//offsets for the symbol preview
export const symbolPreviewStageXOffset = 10
export const symbolPreviewStageYOffset = 10

export const defaultVariableIndicatorOuterCircleDiameterInPx = 700
export const defaultVariableIndicatorInnerCircleDiameterInPx = 430


export const undoShapeLimit = 50

//if we use a custom string this is not working for all reducers??? e.g. we clear only the shape reducer but not field/img/line??
//so we use the default action type
export const clearTileEditorEditShapesType = ActionTypes.CLEAR_HISTORY

export const defaultAnchorPoints: ReadonlyArray<AnchorPoint> = [
  //top
  {
    percentX: 50,
    percentY: 0
  },
  //bot
  {
    percentX: 50,
    percentY: 100
  },
  //left
  {
    percentX: 0,
    percentY: 50
  },
  //right
  {
    percentX: 100,
    percentY: 50
  }
]

export const defaultPadding: AbsolutePosition = {
  bottom: 10,
  left: 50, //see newField_height
  right: 50, //see newField_height
  top: 10
}

function createField(x: number, y: number, fieldId: number, text: string, cmdText: string): FieldShape {

  return {
    kind: "field",
    id: fieldId,
    connectedLinesThroughAnchorPoints: [],
    anchorPoints: defaultAnchorPoints,
    height: 30,
    width: 100,
    x: x,
    y: y,
    text,
    zIndex: 0,
    cornerRadiusInPx: 0,
    horizontalTextAlign: HorizontalAlign.center,
    verticalTextAlign: VerticalAlign.center,
    bgColor: '#dddddd',
    color: 'black',
    fontName: 'Arial',
    fontSizeInPx: 12,
    cmdText: cmdText,
    createdFromSymbolGuid: null,
    isSymbol: true,
    padding: defaultPadding,
    borderSizeInPx: 0,
    borderColor: 'black',
    isFontBold: false,
    isFontItalic: false,
    isFontUnderlined: false,
    rotationInDegree: 0,
    backgroundImgGuid: null
  }
}

export const worldFileExtensionWithoutDot = 'world'
export const tileFileExtensionWithoutDot = 'tile'


export const defaultGameInitCode =
  `
game {
  maxDiceValue 6
  int truhe {15} = 0
}

2 players {
  numTokens 1
  int gold {15} = 0
}
  `

export const newTileFields: () => FieldShape[] = () => [
  // createField(10, 10, 1000, 'start', `
  // game_start
  // goto 1001
  // `),
  // createField(100, 100, 1001, 'goto 10002', `
  // force
  // cp.x = 10
  // goto 10002
  // `),
  // createField(200, 200, 10002, 'goto 10003', `
  // goto 10003
  // `),
  // createField(300, 300, 10003, 'end?', `game_end`),
]

export function getDefaultNewTile(): Tile {
  return {
    topBorderPoints: [{
      id: getNextShapeId(),
      val: defaultTileWidth / 2,
      nextFieldId: null
    }],
    botBorderPoints: [{
      id: getNextShapeId(),
      val: defaultTileWidth / 2,
      nextFieldId: null
    }],
    leftBorderPoints: [{
      id: getNextShapeId(),
      val: defaultTileHeight / 2,
      nextFieldId: null
    }],
    rightBorderPoint: [{
      id: getNextShapeId(),
      val: defaultTileHeight / 2,
      nextFieldId: null
    }],
    guid: getGuid(),
    fieldShapes: newTileFields(),
    lineShapes: [],
    imgShapes: [],
    simulationEndFieldIds: [],
    simulationStartFieldIds: [],

    tileSettings: {
      displayName: 'tile 1',
      width: defaultTileWidth,
      height: defaultTileHeight,
      majorLineDirection: MajorLineDirection.topToBottom,
      gridSizeInPx: 10,
      showGrid: true,
      snapToGrid: true,
      showSequenceIds: false,
      moveBezierControlPointsWhenLineIsMoved: true,
      arePrintGuidesDisplayed: false,
      autoIncrementFieldTextNumbersOnDuplicate: true,
      printLargeTilePreferredWidthInPx: 500,
      printLargeTilePreferredHeightInPx: 500,
      splitLargeTileForPrint: true,
      insertLinesEvenIfFieldsIntersect: false,
    }
  }
}


export const defaultFieldShape: FieldShape = {
  kind: "field",
  isSymbol: false,
  createdFromSymbolGuid: null,
  connectedLinesThroughAnchorPoints: {},
  anchorPoints: defaultAnchorPoints,
  id: -1, //will be set when added
  cornerRadiusInPx: 0,
  bgColor: '#dddddd',
  height: newField_height,
  width: newField_width,
  padding: defaultPadding,
  horizontalTextAlign: HorizontalAlign.left,
  verticalTextAlign: VerticalAlign.center,
  text: '', //will be set when added
  x: newField_x,
  y: newField_y,
  cmdText: null,
  color: 'black',
  fontSizeInPx: 12,
  fontName: 'Arial',
  zIndex: -1, //will be set when added
  borderColor: 'black',
  borderSizeInPx: 0,
  isFontUnderlined: false,
  isFontItalic: false,
  isFontBold: false,
  rotationInDegree: 0,
  backgroundImgGuid: null
}

export const defaultLineShape: LineShape = {
  kind: 'line',
  isSymbol: false,
  createdFromSymbolGuid: null,
  id: -1, //will be set when added
  zIndex: -1, //will be set when added
  color: lineShapeDefaultColor,
  hasEndArrow: false,
  hasStartArrow: false,
  lineThicknessInPx: 3,
  dashArray: [15],
  startPoint: { //will be set when added
    id: -1,
    x: -1,
    y: -1
  },
  points: [], //will be set when added
  arrowHeight: defaultArrowHeight,
  arrowWidth: defaultArrowWidth
}

export const defaultImgShapeProps: ImgShape = {
  kind: "img",
  id: -1, //will be set when added
  x: 100,
  y: 100,
  width: defaultAddImgWidth,
  height: defaultAddImgHeight,
  zIndex: -1, //will be set when added
  imgGuid: null, //is set if the img is added (through the img library)
  rotationInDegree: 0,
  isSymbol: false,
  createdFromSymbolGuid: null,
  skewX: 0,
  skewY: 0,
  isMouseSelectionDisabled: false
}


