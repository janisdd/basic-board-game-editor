import {
  BorderPoint, BorderPointOrientation, CurveMode, FieldBase,
  FieldShape, FieldSymbol, HorizontalAlign, ImgBase, ImgShape, ImgSymbol, LineBase,
  LineShape, LineSymbol, PlainPoint, VerticalAlign,
} from "../src/types/drawing";
import Stage = createjs.Stage;
import MouseEvent = createjs.MouseEvent
import {ImgStorage} from "../src/externalStorage/imgStorage";
import {ZIndexCache} from "../src/types/ui";
import Bitmap = createjs.Bitmap;
import {
  calcAnchorPoints,
  getAngleInDeg,
  getPointDistance,
  interpolate2DPoint,
  rotatePointBy
} from "../src/helpers/interactionHelper";
import {WorldSettings} from "../src/state/reducers/world/worldSettings/worldSettingsReducer";
import {
  isFieldShape,
  isFieldSymbol,
  isImgShape,
  isImgSymbol,
  isLineShape,
  isLineSymbol
} from "../src/helpers/typeHelper";
import {
  imgNotFoundBgColor, imgNotFoundColor,
  imgNotFoundStrokeThickness,
  isLinkedToSymbolIndicatorColor,
  isLinkedToSymbolIndicatorCornerRadius,
  isLinkedToSymbolIndicatorSizeInPx
} from "../src/constants";
import {Logger} from "../src/helpers/logger";

const Bezier = require("bezier-js") //used to calculate the arrow head/tail degree


export enum DragHandlePos {
  topLeft,
  topCenter,
  topRight,
  botLeft,
  botCenter,
  botRight,
  centerLeft,
  centerRight
}

export function drawGrid(stage: Stage, width: number, height: number, gridSizeInPx: number, gridStrokeThicknessInPx: number, gridStrokeColor: string, onlyBorder: boolean, xOffset: number, yOffset: number): void {

  if (onlyBorder) {

    let topLine = new createjs.Shape()
    topLine.graphics
      .setStrokeStyle(gridStrokeThicknessInPx)
      .beginStroke(gridStrokeColor)
      .moveTo(0 + xOffset, 0 + yOffset)
      .lineTo(width + xOffset, 0 + yOffset)
    topLine.mouseEnabled = false
    stage.addChild(topLine)

    let botLine = new createjs.Shape()
    botLine.graphics
      .setStrokeStyle(gridStrokeThicknessInPx)
      .beginStroke(gridStrokeColor)
      .moveTo(0 + xOffset, height + yOffset)
      .lineTo(width + xOffset, height + yOffset)
    botLine.mouseEnabled = false
    stage.addChild(botLine)

    let leftLine = new createjs.Shape()
    leftLine.graphics
      .setStrokeStyle(gridStrokeThicknessInPx)
      .beginStroke(gridStrokeColor)
      .moveTo(0 + xOffset, 0 + yOffset)
      .lineTo(0 + xOffset, height + yOffset)
    leftLine.mouseEnabled = false
    stage.addChild(leftLine)

    let rightLine = new createjs.Shape()
    rightLine.graphics
      .setStrokeStyle(gridStrokeThicknessInPx)
      .beginStroke(gridStrokeColor)
      .moveTo(width + xOffset, 0 + yOffset)
      .lineTo(width + xOffset, height + yOffset)
    rightLine.mouseEnabled = false
    stage.addChild(rightLine)


  } else {
    //horizontal
    for (let i = 0; i < (height / gridSizeInPx) + 1; i++) {
      let line = new createjs.Shape()
      const y = i * gridSizeInPx
      line.graphics
        .setStrokeStyle(gridStrokeThicknessInPx)
        .beginStroke(gridStrokeColor)
        .moveTo(0 + xOffset, y + yOffset)
        .lineTo(width + xOffset, y + yOffset)

      line.mouseEnabled = false

      stage.addChild(line)
    }

    //vertical
    for (let i = 0; i < (width / gridSizeInPx) + 1; i++) {
      let line = new createjs.Shape()
      const x = i * gridSizeInPx
      line.graphics
        .setStrokeStyle(gridStrokeThicknessInPx)
        .beginStroke(gridStrokeColor)
        .moveTo(x + xOffset, 0 + yOffset)
        .lineTo(x + xOffset, height + yOffset)

      line.mouseEnabled = false

      stage.addChild(line)
    }
  }


}


const printGuidesDashArray = [3]
const printGuidesStrokeThicknessInPx = 4
const printGuidesColor = 'black'

export function drawPrintGuides(stage: Stage, actualWidthInPx: number, actualHeightInPx: number, expectedWidthInPx: number, expectedHeightInPx: number, gridStrokeThicknessInPx: number, gridStrokeColor: string): void {


  for (let x = 1; x * expectedWidthInPx < actualWidthInPx; x++) {

    let topToBottomPrintGuide = new createjs.Shape()
    topToBottomPrintGuide.graphics
      .setStrokeStyle(printGuidesStrokeThicknessInPx)
      .beginStroke(printGuidesColor)
      .setStrokeDash(printGuidesDashArray)
      .moveTo(x * expectedWidthInPx, 0)
      .lineTo(x * expectedWidthInPx, actualHeightInPx)

    topToBottomPrintGuide.mouseEnabled = false
    stage.addChild(topToBottomPrintGuide)
  }

  for (let y = 1; y * expectedHeightInPx < actualHeightInPx; y++) {
    let topToBottomPrintGuide = new createjs.Shape()
    topToBottomPrintGuide.graphics
      .setStrokeStyle(printGuidesStrokeThicknessInPx)
      .beginStroke(printGuidesColor)
      .setStrokeDash(printGuidesDashArray)
      .moveTo(0, y * expectedHeightInPx)
      .lineTo(actualWidthInPx, y * expectedHeightInPx)

    topToBottomPrintGuide.mouseEnabled = false
    stage.addChild(topToBottomPrintGuide)

  }


}

/**
 * draws the tile border points (connection points to other tiles)
 * @param {createjs.Stage} stage
 * @param tileWidth the tile width
 * @param tileHeight the tile height
 * @param topBorderPoints
 * @param botBorderPoints
 * @param leftBorderPoints
 * @param rightBorderPoint
 * @param worldSettings
 * @param xOffset
 * @param yOffset
 * @param showIds
 */
export function drawTileBorderPoints(stage: Stage,
                                     tileWidth: number,
                                     tileHeight: number,
                                     topBorderPoints: ReadonlyArray<BorderPoint>,
                                     botBorderPoints: ReadonlyArray<BorderPoint>,
                                     leftBorderPoints: ReadonlyArray<BorderPoint>,
                                     rightBorderPoint: ReadonlyArray<BorderPoint>,
                                     worldSettings: WorldSettings,
                                     xOffset: number,
                                     yOffset: number,
                                     showIds: boolean,
                                     onBorderPointMouseDown: (borderPoint: BorderPoint, orientation: BorderPointOrientation, shape: createjs.Shape, e: MouseEvent) => void
): void {


  const pointIdOffsetInPx = 12

  for (const point of topBorderPoints) {
    let pointShape = new createjs.Shape()

    pointShape.graphics.beginFill(worldSettings.tileMidPointsUiColor)
      .drawCircle(point.val + xOffset, yOffset, worldSettings.tileMidPointsDiameter)

    if (showIds) {
      let text = new createjs.Text(point.id.toString(), '12px Arial', 'black')
      text.x = point.val + xOffset - (text.getMeasuredWidth() / 2)
      text.y = yOffset - pointIdOffsetInPx - text.getMeasuredHeight()


      stage.addChild(text)
    }

    if (onBorderPointMouseDown) {
      pointShape.on('mousedown', eventObj => {
        onBorderPointMouseDown(point, BorderPointOrientation.top, pointShape, eventObj as MouseEvent)
      })
    }

    stage.addChild(pointShape)
  }

  for (const point of botBorderPoints) {
    let pointShape = new createjs.Shape()

    pointShape.graphics.beginFill(worldSettings.tileMidPointsUiColor)
      .drawCircle(point.val + xOffset, tileHeight + yOffset, worldSettings.tileMidPointsDiameter)

    if (showIds) {
      let text = new createjs.Text(point.id.toString(), '12px Arial', 'black')
      text.x = point.val + xOffset - (text.getMeasuredWidth() / 2)
      text.y = tileHeight + yOffset + pointIdOffsetInPx

      stage.addChild(text)
    }

    if (onBorderPointMouseDown) {
      pointShape.on('mousedown', eventObj => {
        onBorderPointMouseDown(point, BorderPointOrientation.bottom, pointShape, eventObj as MouseEvent)
      })
    }

    stage.addChild(pointShape)
  }

  for (const point of leftBorderPoints) {
    let pointShape = new createjs.Shape()

    pointShape.graphics.beginFill(worldSettings.tileMidPointsUiColor)
      .drawCircle(xOffset, point.val + yOffset, worldSettings.tileMidPointsDiameter)

    if (showIds) {
      let text = new createjs.Text(point.id.toString(), '12px Arial', 'black')
      text.x = xOffset - pointIdOffsetInPx - text.getMeasuredWidth()
      text.y = point.val + yOffset - (text.getMeasuredHeight() / 2)

      stage.addChild(text)
    }

    if (onBorderPointMouseDown) {
      pointShape.on('mousedown', eventObj => {
        onBorderPointMouseDown(point, BorderPointOrientation.left, pointShape, eventObj as MouseEvent)
      })
    }

    stage.addChild(pointShape)
  }

  for (const point of rightBorderPoint) {
    let pointShape = new createjs.Shape()

    pointShape.graphics.beginFill(worldSettings.tileMidPointsUiColor)
      .drawCircle(tileWidth + xOffset, point.val + yOffset, worldSettings.tileMidPointsDiameter)

    if (showIds) {
      let text = new createjs.Text(point.id.toString(), '12px Arial', 'black')
      text.x = tileWidth + xOffset + pointIdOffsetInPx
      text.y = point.val + yOffset - (text.getMeasuredHeight() / 2)

      stage.addChild(text)
    }

    if (onBorderPointMouseDown) {
      pointShape.on('mousedown', eventObj => {
        onBorderPointMouseDown(point, BorderPointOrientation.right, pointShape, eventObj as MouseEvent)
      })
    }

    stage.addChild(pointShape)
  }

}


export function drawFieldsOnTile(stage: Stage, fieldShapes: ReadonlyArray<FieldShape | FieldSymbol>,
                                 selectedFieldShapeIds: ReadonlyArray<number>,
                                 selectedFieldShapeGuids: ReadonlyArray<string>,
                                 onClickHandler: ((field: FieldShape | FieldSymbol, container: createjs.Container, e: MouseEvent) => void) | null,
                                 onMouseDownHandler: ((field: FieldShape | FieldSymbol, container: createjs.Container, e: MouseEvent) => void) | null,
                                 onMouseUpHandler: ((field: FieldShape | FieldSymbol, container: createjs.Container, e: MouseEvent) => void) | null,
                                 zIndexCache: ZIndexCache,
                                 drawFieldIds: boolean,
                                 drawAnchorPoints: boolean,
                                 worldSettings: WorldSettings,
                                 fieldSymbols: ReadonlyArray<FieldSymbol>,
                                 xOffset: number,
                                 yOffset: number,
                                 drawBasedOnSymbolIndicator: boolean,
                                 // onDragHandlerMouseDownHandler: ((field: FieldShape | FieldSymbol, dragHandlerPos: DragHandlePos, container: createjs.Container, e: MouseEvent) => void) | null,
                                 // onDragHandlerMouseUpHandler: ((field: FieldShape | FieldSymbol, dragHandlerPos: DragHandlePos, container: createjs.Container, e: MouseEvent) => void) | null,
                                 // onDragHandlerMouseMoveHandler: ((field: FieldShape | FieldSymbol, dragHandlerPos: DragHandlePos, container: createjs.Container, e: MouseEvent) => void) | null,
): void {
  for (const shape of fieldShapes) {
    let isSelected = false

    if (isFieldShape(shape)) {
      isSelected = selectedFieldShapeIds.find(p => p === shape.id) !== undefined
    }

    if (isFieldSymbol(shape)) {
      isSelected = selectedFieldShapeGuids.find(p => p === shape.guid) !== undefined
    }

    drawFieldShape(stage, shape, selectedFieldShapeIds, onClickHandler, onMouseDownHandler, onMouseUpHandler,
      zIndexCache, drawFieldIds, drawAnchorPoints, worldSettings, fieldSymbols, xOffset, yOffset, isSelected,
      drawBasedOnSymbolIndicator,
      // onDragHandlerMouseDownHandler, onDragHandlerMouseUpHandler, onDragHandlerMouseMoveHandler
    )
  }

}

export function drawFieldShape(stage: Stage, field: FieldShape | FieldSymbol, selectedFieldBaseIds: ReadonlyArray<number>,
                               onClickHandler: ((field: FieldShape | FieldSymbol, container: createjs.Container, e: MouseEvent) => void) | null,
                               onMouseDownHandler: ((field: FieldShape | FieldSymbol, container: createjs.Container, e: MouseEvent) => void) | null,
                               onMouseUpHandler: ((field: FieldShape | FieldSymbol, container: createjs.Container, e: MouseEvent) => void) | null,
                               zIndexCache: ZIndexCache,
                               drawFieldIds: boolean,
                               drawAnchorPoints: boolean,
                               worldSettings: WorldSettings,
                               fieldSymbols: ReadonlyArray<FieldSymbol>,
                               xOffset: number,
                               yOffset: number,
                               isSelected: boolean,
                               drawBasedOnSymbolIndicator: boolean,
                               // onDragHandlerMouseDownHandler: ((field: FieldShape | FieldSymbol, dragHandlerPos: DragHandlePos, container: createjs.Container, e: MouseEvent) => void) | null,
                               // onDragHandlerMouseUpHandler: ((field: FieldShape | FieldSymbol, dragHandlerPos: DragHandlePos, container: createjs.Container, e: MouseEvent) => void) | null,
                               // onDragHandlerMouseMoveHandler: ((field: FieldShape | FieldSymbol, dragHandlerPos: DragHandlePos, container: createjs.Container, e: MouseEvent) => void) | null,
): void {


  let symbolForShape: FieldSymbol | null = null

  if (field.createdFromSymbolGuid !== null) {
    const res = fieldSymbols.find(p => p.guid === field.createdFromSymbolGuid)
    if (!res) {
      symbolForShape = null
      Logger.log('TODO symbol needed but not found')
    } else {
      symbolForShape = res
    }
  }

  let container = new createjs.Container()
  let rectShape = new createjs.Shape()
  //let borderShape = new createjs.Shape() //we use the stroke instead
  let graphics = rectShape.graphics


  //--start
  const borderSize = (symbolForShape !== null && symbolForShape.overwriteBorderSizeInPx ? symbolForShape.borderSizeInPx : field.borderSizeInPx)
  const borderColor = symbolForShape !== null && symbolForShape.overwriteBorderColor ? symbolForShape.borderColor : field.borderColor

  graphics = graphics.beginFill(symbolForShape !== null && symbolForShape.overwriteBgColor ? symbolForShape.bgColor : field.bgColor)

  if ((symbolForShape !== null && symbolForShape.overwriteCornerRadius ? symbolForShape.cornerRadiusInPx : field.cornerRadiusInPx) > 0) {

    if (borderSize > 0) {
      // borderShape.graphics
      //   .beginFill(borderColor)
      //   .drawRoundRect(
      //     field.x + xOffset,
      //     field.y + yOffset,
      //     symbolForShape !== null ? symbolForShape.width : field.width,
      //     symbolForShape !== null ? symbolForShape.height : field.height,
      //     symbolForShape !== null ? symbolForShape.cornerRadiusInPx : field.cornerRadiusInPx
      //   )

      graphics = graphics.beginStroke(borderColor).setStrokeStyle(borderSize)
    }

    graphics
      .drawRoundRect(
        (borderSize / 2), //the border grows in both directions...
        (borderSize / 2),
        (symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width) - borderSize,
        (symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height) - borderSize,
        symbolForShape !== null && symbolForShape.overwriteCornerRadius ? symbolForShape.cornerRadiusInPx : field.cornerRadiusInPx
      )


    //graphics.drawRoundRectComplex() //maybe?
  } else {
    if (borderSize > 0) {
      // borderShape.graphics
      //   .beginFill(borderColor)
      //   .drawRect(
      //     0 + xOffset,
      //     0 + yOffset,
      //     symbolForShape !== null ? symbolForShape.width : field.width,
      //     symbolForShape !== null ? symbolForShape.height : field.height
      //   )
      graphics = graphics.beginStroke(borderColor).setStrokeStyle(borderSize)
    }

    //is not mapped into drawRoundRect in code so maybe call this separately?
    graphics.drawRect(
      (borderSize / 2), //the border grows in both directions...
      (borderSize / 2),
      (symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width) - borderSize,
      (symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height) - borderSize
    )
  }
  rectShape.setBounds(
    0,
    0,
    symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width,
    symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height
  )


  // if (borderSize > 0) {
  //   container.addChild(borderShape)
  // }
  container.addChild(rectShape)

  const backgroundImg = ImgStorage.getImgFromGuid(
    symbolForShape !== null && symbolForShape.overwriteBackgroundImage ? symbolForShape.backgroundImgGuid : field.backgroundImgGuid)

  if (backgroundImg !== null) {

    let bitmap = new createjs.Bitmap(backgroundImg.base64);
    // bitmap.x = borderSize / 2
    // bitmap.y = borderSize / 2
    // bitmap.setBounds(
    //   0,
    //   0,
    //   (symbolForShape !== null ? symbolForShape.width : field.width),
    //   (symbolForShape !== null ? symbolForShape.height : field.height)
    // )

    bitmap.scaleX = (symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width) / bitmap.image.width
    bitmap.scaleY = (symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height) / bitmap.image.height

    container.addChild(bitmap)

  }


  if (isSelected) {
    //draw border
    const borderThickness = worldSettings.selectedFieldBorderThicknessInPx
    let border = new createjs.Shape()
    border.graphics.beginStroke(worldSettings.selectedFieldBorderColor)
    border.graphics.setStrokeStyle(borderThickness)

    border.graphics.drawRect(
      0 - borderThickness,
      0 - borderThickness,
      (symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width) + borderThickness * 2,
      (symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height) + borderThickness * 2
    )

    container.addChild(border)
  }

  if ((symbolForShape !== null && symbolForShape.overwriteText ? symbolForShape.text : field.text) !== null) {

    let textShape = new createjs.Text();
    textShape.text = (symbolForShape !== null && symbolForShape.overwriteText ? symbolForShape.text : field.text) || ''

    let fontSizeInPx = (symbolForShape !== null && symbolForShape.overwriteFontSizeInPx ? symbolForShape.fontSizeInPx : field.fontSizeInPx)
    let fontName = (symbolForShape !== null && symbolForShape.overwriteFontName ? symbolForShape.fontName : field.fontName)
    let isFontBold = (symbolForShape !== null && symbolForShape.overwriteFontDecoration ? symbolForShape.isFontBold : field.isFontBold)
    let isFontItalic = (symbolForShape !== null && symbolForShape.overwriteFontDecoration ? symbolForShape.isFontItalic : field.isFontItalic)

    textShape.font = `${isFontBold ? 'bold ' : ''}${isFontItalic ? 'italic ' : ''}${fontSizeInPx}px '${fontName}'`

    textShape.color = symbolForShape !== null && symbolForShape.overwriteColor ? symbolForShape.color : field.color

    textShape.lineWidth = symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width
    //textShape.lineHeight= field.height

    const {x, y} = container.getBounds()

    //horizontal text align
    if ((symbolForShape !== null && symbolForShape.overwriteHorizontalTextAlign ? symbolForShape.horizontalTextAlign : field.horizontalTextAlign) === HorizontalAlign.center) {
      textShape.textAlign = 'center'
      textShape.x = (symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width) / 2 + x
    } else if ((symbolForShape !== null && symbolForShape.overwriteHorizontalTextAlign ? symbolForShape.horizontalTextAlign : field.horizontalTextAlign) === HorizontalAlign.left) {
      textShape.textAlign = 'left'
      textShape.x = x + (symbolForShape !== null && symbolForShape.overwritePadding ? symbolForShape.padding.left : field.padding.left) + borderSize
    } else if ((symbolForShape !== null && symbolForShape.overwriteHorizontalTextAlign ? symbolForShape.horizontalTextAlign : field.horizontalTextAlign) === HorizontalAlign.right) {
      textShape.textAlign = 'right'
      textShape.x = x + (symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width) - (symbolForShape !== null ? symbolForShape.padding.right : field.padding.right) - borderSize
    }

    //vertical text align
    if ((symbolForShape !== null && symbolForShape.overwriteVerticalTextAlign ? symbolForShape.verticalTextAlign : field.verticalTextAlign) === VerticalAlign.center) {
      textShape.textBaseline = 'middle'
      textShape.y = y + (symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height) / 2
    } else if ((symbolForShape !== null && symbolForShape.overwriteVerticalTextAlign ? symbolForShape.verticalTextAlign : field.verticalTextAlign) === VerticalAlign.top) {
      textShape.textBaseline = 'top'
      textShape.y = y + (symbolForShape !== null && symbolForShape.overwritePadding ? symbolForShape.padding.top : field.padding.top) + borderSize
    } else if ((symbolForShape !== null && symbolForShape.overwriteVerticalTextAlign ? symbolForShape.verticalTextAlign : field.verticalTextAlign) === VerticalAlign.bottom) {
      textShape.textBaseline = 'bottom'
      textShape.y = y + (symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height) -
        (symbolForShape !== null && symbolForShape.overwritePadding ? symbolForShape.padding.bottom : field.padding.bottom) - borderSize
    }

    container.addChild(textShape)
  }

  //draw id
  if (drawFieldIds && isFieldShape(field)) {
    let seqContainer = new createjs.Container()
    let textShape = new createjs.Text();
    textShape.text = field.id.toString()
    textShape.font = `${worldSettings.fieldSequenceFontSizeInPx}px ${worldSettings.fieldSequenceFont}`
    textShape.color = worldSettings.fieldSequenceFontColor
    textShape.textAlign = 'center'
    textShape.textBaseline = 'middle'

    let padding = 3
    let rectWidth = textShape.getMeasuredWidth() + (padding * 2)
    let rectHeight = worldSettings.fieldSequenceFontSizeInPx + (padding * 2)

    let rectShape = new createjs.Shape()
    rectShape.graphics
      .beginStroke(worldSettings.fieldSequenceBoxColor)

      .drawRect((symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width),
        0 - rectHeight,
        rectWidth,
        rectHeight
      )

    rectShape.setBounds((symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width),
      0 - rectHeight,
      rectWidth,
      rectHeight
    )

    const {x, y} = rectShape.getBounds()
    textShape.x = rectWidth / 2 + x
    textShape.y = rectHeight / 2 + y

    seqContainer.addChild(rectShape)
    seqContainer.addChild(textShape)
    container.addChild(seqContainer)
  }

  if (symbolForShape !== null && drawBasedOnSymbolIndicator) {
    //draw a symbol so that the user knows that this shape is connected to a symbol

    let rectShape = new createjs.Shape()
    rectShape.graphics
      .beginStroke(isLinkedToSymbolIndicatorColor)

      .drawRoundRect(0 - isLinkedToSymbolIndicatorSizeInPx / 2,
        0 - isLinkedToSymbolIndicatorSizeInPx / 2,
        isLinkedToSymbolIndicatorSizeInPx,
        isLinkedToSymbolIndicatorSizeInPx,
        isLinkedToSymbolIndicatorCornerRadius
      )

    container.addChild(rectShape)
  }

  //draw anchor points

  if (drawAnchorPoints || isSelected) {


    const anchorPoints = calcAnchorPoints(
      0,
      0,
      symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width,
      symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height,
      (symbolForShape !== null ? symbolForShape.anchorPoints : field.anchorPoints), xOffset, yOffset,
      0, //the container is rotated no need to do it here...
    )
    for (const point of anchorPoints) { //anchor points depend on x,y so not use the symbol

      let pointShape = new createjs.Shape()
      pointShape.graphics.beginFill(worldSettings.anchorPointColor)
        .drawCircle(point.x, point.y, worldSettings.anchorPointDiameter)

      pointShape.setBounds(point.x - (worldSettings.anchorPointDiameter / 2), point.y - (worldSettings.anchorPointDiameter / 2),
        worldSettings.anchorPointDiameter, worldSettings.anchorPointDiameter)

      container.addChild(pointShape)
    }
  }


  if (onClickHandler) {
    container.on('click', (eventObj => {
      onClickHandler(field, container, eventObj as MouseEvent)
    }))
  }

  if (onMouseDownHandler) {
    container.on('mousedown', eventObj => {
      onMouseDownHandler(field, container, eventObj as MouseEvent)
    })
  }

  if (onMouseUpHandler) {
    container.on('pressup', eventObj => {
      onMouseUpHandler(field, container, eventObj as MouseEvent)
    })
  }

  //set bounds because seq nr would increase bounds
  container.setBounds(
    field.x + xOffset,
    field.y + yOffset,
    (symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width),
    (symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height)
  )

  //for rotation we need to set the props on the container
  //and draw all inside relative to the container coords e.g. NOT field.x + xOffset, but 0 + xOffset
  container.x = field.x + xOffset + (symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width) / 2
  container.y = field.y + yOffset + (symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height) / 2
  container.regX = (symbolForShape !== null && symbolForShape.overwriteWidth ? symbolForShape.width : field.width) / 2
  container.regY = (symbolForShape !== null && symbolForShape.overwriteHeight ? symbolForShape.height : field.height) / 2
  container.rotation = symbolForShape !== null && symbolForShape.overwriteRotationInDeg ? symbolForShape.rotationInDegree : field.rotationInDegree


  // if (isSelected && field.createdFromSymbolGuid === null) {
  //
  //   const dragHandleSize = 10
  //   const paddingSize = 5
  //
  //   let topLeftDragHandleShape = new createjs.Shape()
  //   topLeftDragHandleShape.x = -dragHandleSize - paddingSize
  //   topLeftDragHandleShape.y = -dragHandleSize - paddingSize
  //   topLeftDragHandleShape.graphics.beginFill('black').drawRect(0, 0, dragHandleSize, dragHandleSize)
  //   container.addChild(topLeftDragHandleShape)
  //
  //
  //   if (onDragHandlerMouseDownHandler) {
  //     topLeftDragHandleShape.on('mousedown', eventObj => {
  //       onDragHandlerMouseDownHandler(field, DragHandlePos.topLeft, container, eventObj as MouseEvent)
  //     })
  //   }
  //
  //   if (onDragHandlerMouseUpHandler) {
  //     topLeftDragHandleShape.on('mouseup', eventObj => {
  //       onDragHandlerMouseUpHandler(field, DragHandlePos.topLeft, container, eventObj as MouseEvent)
  //     })
  //   }
  //
  //   if (onDragHandlerMouseMoveHandler) {
  //     topLeftDragHandleShape.on('mousemove', eventObj => {
  //       onDragHandlerMouseMoveHandler(field, DragHandlePos.topLeft, container, eventObj as MouseEvent)
  //     })
  //   }
  //
  //   let topCenterDragHandleShape = new createjs.Shape()
  //   topCenterDragHandleShape.x = field.width / 2 - dragHandleSize / 2
  //   topCenterDragHandleShape.y = -dragHandleSize - paddingSize
  //   topCenterDragHandleShape.graphics.beginFill('black').drawRect(0, 0, dragHandleSize, dragHandleSize)
  //   container.addChild(topCenterDragHandleShape)
  //
  //   let topRightDragHandleShape = new createjs.Shape()
  //   topRightDragHandleShape.x = field.width + paddingSize
  //   topRightDragHandleShape.y = -dragHandleSize - paddingSize
  //   topRightDragHandleShape.graphics.beginFill('black').drawRect(0, 0, dragHandleSize, dragHandleSize)
  //   container.addChild(topRightDragHandleShape)
  //
  //
  //   let botLeftDragHandleShape = new createjs.Shape()
  //   botLeftDragHandleShape.x = -dragHandleSize - paddingSize
  //   botLeftDragHandleShape.y = field.height + paddingSize
  //   botLeftDragHandleShape.graphics.beginFill('black').drawRect(0, 0, dragHandleSize, dragHandleSize)
  //   container.addChild(botLeftDragHandleShape)
  //
  //   let botCenterDragHandleShape = new createjs.Shape()
  //   botCenterDragHandleShape.x = field.width / 2 - dragHandleSize / 2
  //   botCenterDragHandleShape.y = field.height + paddingSize
  //   botCenterDragHandleShape.graphics.beginFill('black').drawRect(0, 0, dragHandleSize, dragHandleSize)
  //   container.addChild(botCenterDragHandleShape)
  //
  //   let botRightDragHandleShape = new createjs.Shape()
  //   botRightDragHandleShape.x = field.width + paddingSize
  //   botRightDragHandleShape.y = field.height + paddingSize
  //   botRightDragHandleShape.graphics.beginFill('black').drawRect(0, 0, dragHandleSize, dragHandleSize)
  //   container.addChild(botRightDragHandleShape)
  //
  //
  //   let centerLeftDragHandleShape = new createjs.Shape()
  //   centerLeftDragHandleShape.x = -dragHandleSize - paddingSize
  //   centerLeftDragHandleShape.y = field.height / 2 - dragHandleSize / 2
  //   centerLeftDragHandleShape.graphics.beginFill('black').drawRect(0, 0, dragHandleSize, dragHandleSize)
  //   container.addChild(centerLeftDragHandleShape)
  //
  //   let centerRightDragHandleShape = new createjs.Shape()
  //   centerRightDragHandleShape.x = field.width + paddingSize
  //   centerRightDragHandleShape.y = field.height / 2 - dragHandleSize / 2
  //   centerRightDragHandleShape.graphics.beginFill('black').drawRect(0, 0, dragHandleSize, dragHandleSize)
  //   container.addChild(centerRightDragHandleShape)
  //
  // }

  stage.addChild(container)
  zIndexCache[field.zIndex] = [container]
}


export function drawLinesOnTile(stage: Stage, lineShapes: ReadonlyArray<LineShape | LineSymbol>,
                                selectedLineShapeIds: ReadonlyArray<number>,
                                selectedLineShapeGuids: ReadonlyArray<string>,
                                onMouseDownHandler: ((line: LineShape | LineSymbol, pointIdHit: number | null, isCp1Hit: boolean, isCp2Hit: boolean, shape: createjs.Shape, e: MouseEvent) => void) | null,
                                onMouseUpHandler: ((line: LineShape | LineSymbol, shape: createjs.Shape, e: MouseEvent) => void) | null,
                                zIndexCache: ZIndexCache,
                                worldSettings: WorldSettings,
                                lineSymbols: ReadonlyArray<LineSymbol>,
                                xOffset: number,
                                yOffset: number,
                                drawBasedOnSymbolIndicator: boolean
): void {

  for (const shape of lineShapes) {

    let isSelected = false

    if (isLineShape(shape)) {
      isSelected = selectedLineShapeIds.find(p => p === shape.id) !== undefined
    }

    if (isLineSymbol(shape)) {
      isSelected = selectedLineShapeGuids.find(p => p === shape.guid) !== undefined
    }

    drawLineShape(stage, shape, selectedLineShapeIds, onMouseDownHandler, onMouseUpHandler, zIndexCache, worldSettings,
      lineSymbols, xOffset, yOffset, isSelected, drawBasedOnSymbolIndicator)
  }
}


/**
 *
 * @param {createjs.Stage} stage
 * @param {LineShape} pathLine
 * @param selectedLineShapeIds
 * @param {((line: PathLine, shape: createjs.Shape, e: createjs.MouseEvent) => void) | null} onClickHandler click on the line
 * @param {((line: PathLine, pointHit: Point, shape: createjs.Shape, e: createjs.MouseEvent) => void) | null} onMouseDownHandler mouse down on a real point on the line (start point, bezier point) or null if only mouse down on the line
 * @param onMouseUpHandler
 * @param zIndexCache
 * @param worldSettings
 * @param lineSymbols
 * @param xOffset
 * @param yOffset
 * @param isSelected
 * @param drawBasedOnSymbolIndicator
 */
export function drawLineShape(stage: Stage, pathLine: LineShape | LineSymbol, selectedLineShapeIds: ReadonlyArray<number>,
                              onMouseDownHandler: ((line: LineShape | LineSymbol, pointIdHit: number | null, isCp1Hit: boolean, isCp2Hit: boolean, shape: createjs.Shape, e: MouseEvent) => void) | null,
                              onMouseUpHandler: ((line: LineShape | LineSymbol, shape: createjs.Shape, e: MouseEvent) => void) | null,
                              zIndexCache: ZIndexCache,
                              worldSettings: WorldSettings,
                              lineSymbols: ReadonlyArray<LineSymbol>,
                              xOffset: number,
                              yOffset: number,
                              isSelected: boolean,
                              drawBasedOnSymbolIndicator: boolean
): void {

  let symbolForShape: LineSymbol | null = null

  if (pathLine.createdFromSymbolGuid !== null) {
    const res = lineSymbols.find(p => p.guid === pathLine.createdFromSymbolGuid)
    if (!res) {
      symbolForShape = null
      console.log('TODO symbol needed but not found')
    } else {
      symbolForShape = res
    }
  }


  let lineShape = new createjs.Shape()
  zIndexCache[pathLine.zIndex] = []


  if (isLineShape(pathLine)) {
    //if curve mode is linear set the control points to real points so that we don't get any curves
    //but we don't need to change the code to linear lines...
    const copy: LineShape = {
      ...pathLine,
      points: pathLine.points.map((point, index) => {

        if (point.curveMode !== CurveMode.linear) return point

        const pStart = index === 0 ? pathLine.startPoint : pathLine.points[index - 1]
        const pEnd = point

        let beforeStart: PlainPoint
        let beforeEnd: PlainPoint

        let tStart = 0.0
        let tEnd = 1.0

        if ((symbolForShape !== null ? symbolForShape.hasStartArrow : pathLine.hasStartArrow)) {
          tStart = 0.5
        }

        if (symbolForShape !== null ? symbolForShape.hasEndArrow : pathLine.hasEndArrow) {
          tEnd = 0.5
        }

        if (pStart.x <= pEnd.x) {
          beforeStart = interpolate2DPoint(pStart, pEnd, tStart)
          beforeEnd = interpolate2DPoint(pStart, pEnd, tEnd)
        } else {
          beforeStart = interpolate2DPoint(pEnd, pStart, tStart)
          beforeEnd = interpolate2DPoint(pEnd, pStart, tEnd)
        }

        //we need to set the cp points to the opposite real point
        //because we need the arrows to point in the right direction
        return {
          ...point,
          cp1: {
            ...point.cp1,
            x: beforeStart.x,
            y: beforeStart.y
          },
          cp2: {
            ...point.cp2,
            x: beforeEnd.x,
            y: beforeEnd.y
          }
        }

      })
    }

    pathLine = copy
  }


  //if we draw arrows let the line start & end before the real points
  let startPoint: PlainPoint = pathLine.startPoint
  let endPoint: PlainPoint = pathLine.points[pathLine.points.length - 1]

  //start arrow
  if ((symbolForShape !== null ? symbolForShape.hasStartArrow : pathLine.hasStartArrow)) {

    //too lazy... https://gist.github.com/conorbuck/2606166
    const p1 = pathLine.startPoint
    const p2 = pathLine.points[0].cp1
    const angleDeg = getAngleInDeg(p1.x, p1.y, p2.x, p2.y) - 90

    //also works without... because we use -angleDeg below???
    // if (angleDeg < 0) {
    //   angleDeg = 270 + 90 - (-angleDeg)
    // }

    const p0 = pathLine.points[0]
    const b = new Bezier(p1.x, p1.y, p0.cp1.x, p0.cp1.y, p0.cp2.x, p0.cp2.y, p0.x, p0.y)

    const arrowLength = pathLine.arrowHeight / 2
    const percentageArrowLength = arrowLength / b.length()
    startPoint = b.compute(percentageArrowLength)

    const arrowWidth = pathLine.arrowWidth

    const rightArrowHeadPoint: PlainPoint = {
      x: p1.x + arrowWidth / 2,
      y: p1.y + pathLine.arrowHeight
    }
    const rotatedRightArrowHeadPoint = rotatePointBy(p1.x, p1.y, rightArrowHeadPoint.x, rightArrowHeadPoint.y,
      -angleDeg)

    const leftArrowHeadPoint: PlainPoint = {
      x: p1.x - arrowWidth / 2,
      y: p1.y + pathLine.arrowHeight
    }

    const rotatedLeftArrowHeadPoint = rotatePointBy(p1.x, p1.y, leftArrowHeadPoint.x, leftArrowHeadPoint.y, -angleDeg)


    lineShape.graphics
      .beginFill(symbolForShape !== null ? symbolForShape.color : pathLine.color)
      .setStrokeStyle(symbolForShape !== null ? symbolForShape.lineThicknessInPx : pathLine.lineThicknessInPx)
      .moveTo(p1.x + xOffset, p1.y + yOffset)
      .lineTo(rotatedRightArrowHeadPoint.x + xOffset, rotatedRightArrowHeadPoint.y + yOffset)
      .lineTo(rotatedLeftArrowHeadPoint.x + xOffset, rotatedLeftArrowHeadPoint.y + yOffset)
      .moveTo(p1.x + xOffset, p1.y + yOffset)

    // lineShape.graphics.drawPolyStar(val.x, val.y, worldSettings.lineStartArrowSizeInPx, 3,
    //   0, angleDeg - 180)
    lineShape.graphics.endFill()
  }

  //end arrow
  if ((symbolForShape !== null ? symbolForShape.hasEndArrow : pathLine.hasEndArrow)) {

    //too lazy... https://gist.github.com/conorbuck/2606166
    const p2 = pathLine.points[pathLine.points.length - 1].cp2 //point before end
    const p1 = pathLine.points[pathLine.points.length - 1] //end point control point
    const angleDeg = getAngleInDeg(p1.x, p1.y, p2.x, p2.y) - 90

    let p0: PlainPoint

    if (pathLine.points.length === 1) {
      p0 = pathLine.startPoint
    } else {
      p0 = pathLine.points[pathLine.points.length - 2]
    }

    const b = new Bezier(p0.x, p0.y, p1.cp1.x, p1.cp1.y, p1.cp2.x, p1.cp2.y, p1.x, p1.y)

    const arrowLength = pathLine.arrowHeight / 2
    const percentageArrowLength = arrowLength / b.length()
    const lineEndPoint = b.compute(1 - percentageArrowLength)
    endPoint = lineEndPoint

    const arrowWidth = pathLine.arrowWidth

    const rightArrowHeadPoint: PlainPoint = {
      x: p1.x + arrowWidth / 2,
      y: p1.y + pathLine.arrowHeight
    }
    const rotatedRightArrowHeadPoint = rotatePointBy(p1.x, p1.y, rightArrowHeadPoint.x, rightArrowHeadPoint.y,
      -angleDeg)

    const leftArrowHeadPoint: PlainPoint = {
      x: p1.x - arrowWidth / 2,
      y: p1.y + pathLine.arrowHeight
    }

    const rotatedLeftArrowHeadPoint = rotatePointBy(p1.x, p1.y, leftArrowHeadPoint.x, leftArrowHeadPoint.y, -angleDeg)


    lineShape.graphics
      .beginFill(symbolForShape !== null ? symbolForShape.color : pathLine.color)
      .setStrokeStyle(symbolForShape !== null ? symbolForShape.lineThicknessInPx : pathLine.lineThicknessInPx)
      .moveTo(p1.x + xOffset, p1.y + yOffset)
      .lineTo(rotatedRightArrowHeadPoint.x + xOffset, rotatedRightArrowHeadPoint.y + yOffset)
      .lineTo(rotatedLeftArrowHeadPoint.x + xOffset, rotatedLeftArrowHeadPoint.y + yOffset)
      .moveTo(p1.x + xOffset, p1.y + yOffset)

    // lineShape.graphics
    //   .beginFill(symbolForShape !== null ? symbolForShape.color : pathLine.color)
    //   .setStrokeStyle(symbolForShape !== null ? symbolForShape.lineThicknessInPx : pathLine.lineThicknessInPx)
    //   .moveTo(p1.x, p1.y)
    //
    // lineShape.graphics.drawPolyStar(p1.x, p1.y, worldSettings.lineEndArrowSizeInPx, 3, 0, angleDeg - 180)
    lineShape.graphics.endFill()
  }


  lineShape.graphics
    .beginStroke(symbolForShape !== null ? symbolForShape.color : pathLine.color)
    .setStrokeStyle(symbolForShape !== null ? symbolForShape.lineThicknessInPx : pathLine.lineThicknessInPx)
    .setStrokeDash((symbolForShape !== null ? symbolForShape.dashArray : pathLine.dashArray) as number[])
    .moveTo(startPoint.x + xOffset, startPoint.y + yOffset)


  for (let i = 0; i < pathLine.points.length - 1; i++) {
    const point = pathLine.points[i]

    lineShape.graphics
      .bezierCurveTo(point.cp1.x + xOffset, point.cp1.y + yOffset, point.cp2.x + xOffset, point.cp2.y + yOffset, point.x + xOffset, point.y + yOffset)
  }

  if (pathLine.points.length > 0) {
    const point = pathLine.points[pathLine.points.length - 1]
    lineShape.graphics
      .bezierCurveTo(point.cp1.x + xOffset, point.cp1.y + yOffset, point.cp2.x + xOffset, point.cp2.y + yOffset, endPoint.x + xOffset, endPoint.y + yOffset)
  }

  stage.addChild(lineShape)

  if (isSelected) {

    let startPointShape = new createjs.Shape()
    startPointShape.graphics.beginFill(worldSettings.linePointsUiColor)

      .drawCircle(pathLine.startPoint.x + xOffset, pathLine.startPoint.y + yOffset, worldSettings.linePointsUiDiameter) //easel raidus = diameter

    startPointShape.setBounds(pathLine.startPoint.x + xOffset - (worldSettings.linePointsUiDiameter / 2), pathLine.startPoint.y + yOffset - (worldSettings.linePointsUiDiameter / 2),
      worldSettings.linePointsUiDiameter, worldSettings.linePointsUiDiameter)

    stage.addChild(startPointShape)
    zIndexCache[pathLine.zIndex].push(startPointShape)

    if (onMouseDownHandler) {
      startPointShape.on('mousedown', eventObj => {
        onMouseDownHandler(pathLine, pathLine.startPoint.id, false, false, startPointShape, eventObj as MouseEvent)
      })
    }

    let lastPoint = pathLine.startPoint

    for (const point of pathLine.points) {


      //next point
      let pointShape = new createjs.Shape()
      pointShape.graphics.beginFill(worldSettings.linePointsUiColor)
        .drawCircle(point.x + xOffset, point.y + yOffset, worldSettings.linePointsUiDiameter)
      pointShape.setBounds(point.x + xOffset - (worldSettings.linePointsUiDiameter / 2), point.y + yOffset - (worldSettings.linePointsUiDiameter / 2),
        worldSettings.linePointsUiDiameter, worldSettings.linePointsUiDiameter)

      if (onMouseDownHandler) {
        pointShape.on('mousedown', eventObj => {
          onMouseDownHandler(pathLine, point.id, false, false, pointShape, eventObj as MouseEvent)
        })
      }

      //control point 1
      let cp1Shape = new createjs.Shape()
      cp1Shape.graphics.beginFill(worldSettings.lineBezierControlPoint1UiColor)
        .drawCircle(point.cp1.x + xOffset, point.cp1.y + yOffset, worldSettings.lineBezierControlPoint1UiDiameter)
      cp1Shape.setBounds(point.cp1.x + xOffset - (worldSettings.lineBezierControlPoint1UiDiameter / 2), point.cp1.y + yOffset - (worldSettings.lineBezierControlPoint1UiDiameter / 2),
        worldSettings.lineBezierControlPoint1UiDiameter, worldSettings.lineBezierControlPoint1UiDiameter)

      if (onMouseDownHandler) {
        cp1Shape.on('mousedown', eventObj => {
          onMouseDownHandler(pathLine, point.cp1.id, true, false, cp1Shape, eventObj as MouseEvent)
        })
      }

      let cp1LineShape = new createjs.Shape()
      cp1LineShape.graphics.beginStroke(worldSettings.lineBezierControlPoint1UiColor)
        .moveTo(point.cp1.x + xOffset, point.cp1.y + yOffset)
        .lineTo(lastPoint.x + xOffset, lastPoint.y + yOffset)

      //control point 2
      let cp2Shape = new createjs.Shape()
      cp2Shape.graphics.beginFill(worldSettings.lineBezierControlPoint2UiColor)
        .drawCircle(point.cp2.x + xOffset, point.cp2.y + yOffset, worldSettings.lineBezierControlPoint2UiDiameter)
      cp2Shape.setBounds(point.cp2.x + xOffset - (worldSettings.lineBezierControlPoint2UiDiameter / 2), point.cp2.y + yOffset - (worldSettings.lineBezierControlPoint2UiDiameter / 2),
        worldSettings.lineBezierControlPoint2UiDiameter, worldSettings.lineBezierControlPoint2UiDiameter)

      if (onMouseDownHandler) {
        cp2Shape.on('mousedown', eventObj => {
          onMouseDownHandler(pathLine, point.cp2.id, false, true, cp2Shape, eventObj as MouseEvent)
        })
      }

      let cp2LineShape = new createjs.Shape()
      cp2LineShape.graphics.beginStroke(worldSettings.lineBezierControlPoint2UiColor)
        .moveTo(point.cp2.x + xOffset, point.cp2.y + yOffset)
        .lineTo(point.x + xOffset, point.y + yOffset)

      lastPoint = {
        id: point.id,
        x: point.x + xOffset,
        y: point.y + yOffset
      }


      if (point.curveMode !== CurveMode.linear) {
        stage.addChild(cp1LineShape)
        zIndexCache[pathLine.zIndex].push(cp1LineShape)

        stage.addChild(cp2LineShape)
        zIndexCache[pathLine.zIndex].push(cp2LineShape)


        stage.addChild(cp1Shape)
        zIndexCache[pathLine.zIndex].push(cp1Shape)

        stage.addChild(cp2Shape)
        zIndexCache[pathLine.zIndex].push(cp2Shape)
      }


      stage.addChild(pointShape)
      zIndexCache[pathLine.zIndex].push(pointShape)
    }

  }

  if (onMouseDownHandler) {
    lineShape.on('mousedown', eventObj => {
      onMouseDownHandler(pathLine, null, false, true, lineShape, eventObj as MouseEvent)
    })
  }

  zIndexCache[pathLine.zIndex].push(lineShape)

  if (symbolForShape !== null && drawBasedOnSymbolIndicator) {
    //draw a symbol so that the user knows that this shape is connected to a symbol

    let rectShape = new createjs.Shape()
    rectShape.graphics
      .beginStroke(isLinkedToSymbolIndicatorColor)

      .drawRoundRect(pathLine.startPoint.x + xOffset - isLinkedToSymbolIndicatorSizeInPx / 2,
        pathLine.startPoint.y + yOffset - isLinkedToSymbolIndicatorSizeInPx / 2,
        isLinkedToSymbolIndicatorSizeInPx,
        isLinkedToSymbolIndicatorSizeInPx,
        isLinkedToSymbolIndicatorCornerRadius
      )

    stage.addChild(rectShape)
    zIndexCache[pathLine.zIndex].push(rectShape)
  }

  if (onMouseUpHandler) {
    lineShape.on('mouseup', eventObj => {
      onMouseUpHandler(pathLine, lineShape, eventObj as MouseEvent)
    })
  }

  if (onMouseDownHandler) {

  }

}


export function drawImagesOnTile(stage: Stage, imgShapes: ReadonlyArray<ImgShape | ImgSymbol>,
                                 selectedFieldShapeIds: ReadonlyArray<number>,
                                 selectedFieldSymbolGuids: ReadonlyArray<string>,
                                 onClickHandler: ((imgShape: ImgShape | ImgSymbol, container: createjs.Bitmap, e: MouseEvent) => void) | null,
                                 onMouseDownHandler: ((imgShape: ImgShape | ImgSymbol, shape: createjs.Bitmap, e: MouseEvent) => void) | null,
                                 onMouseUpHandler: ((imgShape: ImgShape | ImgSymbol, container: createjs.Bitmap, e: MouseEvent) => void) | null,
                                 zIndexCache: ZIndexCache,
                                 worldSettings: WorldSettings,
                                 imgSymbols: ReadonlyArray<ImgSymbol>,
                                 xOffset: number,
                                 yOffset: number,
                                 drawBasedOnSymbolIndicator: boolean
): void {

  for (const shape of imgShapes) {

    let isSelected = false

    if (isImgShape(shape)) {
      isSelected = selectedFieldShapeIds.find(p => p === shape.id) !== undefined
    }

    if (isImgSymbol(shape)) {
      isSelected = selectedFieldSymbolGuids.find(p => p === shape.guid) !== undefined
    }

    drawImgShape(stage, shape, selectedFieldShapeIds, onClickHandler, onMouseDownHandler, onMouseUpHandler,
      zIndexCache,
      worldSettings, imgSymbols, xOffset, yOffset, isSelected, drawBasedOnSymbolIndicator)
  }
}

export function drawImgShape(stage: Stage, imgShape: ImgShape | ImgSymbol, selectedFieldShapeIds: ReadonlyArray<number>,
                             onClickHandler: ((imgShape: ImgShape | ImgSymbol, container: createjs.Bitmap, e: MouseEvent) => void) | null,
                             onMouseDownHandler: ((imgShape: ImgShape | ImgSymbol, container: createjs.Bitmap, e: MouseEvent) => void) | null,
                             onMouseUpHandler: ((imgShape: ImgShape | ImgSymbol, container: createjs.Bitmap, e: MouseEvent) => void) | null,
                             zIndexCache: ZIndexCache,
                             worldSettings: WorldSettings,
                             imgSymbols: ReadonlyArray<ImgSymbol>,
                             xOffset: number,
                             yOffset: number,
                             isSelected: boolean,
                             drawBasedOnSymbolIndicator: boolean
): void {


  let symbolForShape: ImgSymbol | null = null

  if (imgShape.createdFromSymbolGuid !== null) {
    const res = imgSymbols.find(p => p.guid === imgShape.createdFromSymbolGuid)
    if (!res) {
      symbolForShape = null
      console.log('TODO symbol needed but not found')
    } else {
      symbolForShape = res
    }
  }


  let container = new createjs.Container()
  const img = ImgStorage.getImgFromGuid(symbolForShape !== null ? symbolForShape.imgGuid : imgShape.imgGuid)

  let imgWidth = (symbolForShape !== null ? symbolForShape.width : imgShape.width)
  let imgHeight = (symbolForShape !== null ? symbolForShape.height : imgShape.height)

  //--start
  let bitmap: Bitmap

  if (img === null) {

    //draw an border with an x inside to show that the original img was deleted...
    //draw border

    let border = new createjs.Shape()
    border.graphics
      .beginFill(imgNotFoundBgColor)
      .setStrokeStyle(imgNotFoundStrokeThickness)

    border.graphics.drawRect(
      0 - imgNotFoundStrokeThickness,
      0 - imgNotFoundStrokeThickness,
      (symbolForShape !== null ? symbolForShape.width : imgShape.width) + imgNotFoundStrokeThickness * 2,
      (symbolForShape !== null ? symbolForShape.height : imgShape.height) + imgNotFoundStrokeThickness * 2
    )

    border.setBounds(0 - imgNotFoundStrokeThickness,
      0 - imgNotFoundStrokeThickness,
      (symbolForShape !== null ? symbolForShape.width : imgShape.width) + imgNotFoundStrokeThickness * 2,
      (symbolForShape !== null ? symbolForShape.height : imgShape.height) + imgNotFoundStrokeThickness * 2
    )

    let lineXLeft = new createjs.Shape()
    lineXLeft.graphics
      .beginStroke(imgNotFoundColor)
      .setStrokeStyle(imgNotFoundStrokeThickness)

    lineXLeft.graphics
      .moveTo(0, 0)
      .lineTo(imgShape.width, imgShape.height)

    let lineXRight = new createjs.Shape()
    lineXRight.graphics
      .beginStroke(imgNotFoundColor)
      .setStrokeStyle(imgNotFoundStrokeThickness)

    lineXRight.graphics
      .moveTo(imgShape.width, 0)
      .lineTo(0, imgShape.height)

    container.addChild(border)
    container.addChild(lineXLeft)
    container.addChild(lineXRight)

  } else {

    bitmap = new createjs.Bitmap(img.base64);
    bitmap.x = 0
    bitmap.y = 0
    bitmap.scaleX = imgWidth / bitmap.image.width
    bitmap.scaleY = imgHeight / bitmap.image.height
    bitmap.regX = 0
    bitmap.regY = 0

    bitmap.setBounds(
      imgShape.x + xOffset,
      imgShape.y + yOffset,
      (symbolForShape !== null ? symbolForShape.width : imgShape.width),
      (symbolForShape !== null ? symbolForShape.height : imgShape.height)
    )

    //this was old without setting the scale
    // bitmap.draw = function (ctx, ignoreCache) {
    //   //mostly copied from easeljs source
    //   //https://createjs.com/docs/easeljs/files/easeljs_display_Bitmap.js.html#l144
    //   //but we need out own drawImage overload so that the svg matches the size
    //   if ((this as any).DisplayObject_draw(ctx, ignoreCache)) {
    //     return true;
    //   }
    //   let img: any = this.image, rect = this.sourceRect;
    //   if (img.getImage) {
    //     img = img.getImage();
    //   }
    //   if (!img) {
    //     return true;
    //   }
    //   //ctx.drawImage(img, 0, 0, canvasSize, canvasSize, 0, 0, imgShape.width, imgShape.height,)
    //   ctx.drawImage(
    //     img,
    //     0,
    //     0,
    //     (symbolForShape !== null ? symbolForShape.width : imgShape.width),
    //     (symbolForShape !== null ? symbolForShape.height : imgShape.height)
    //   )
    //
    //   return true
    // }

    // bitmap.regX = imgShape.width
    // bitmap.regY = imgShape.height
    // container.regX = 100
    // container.regY = 100
    container.addChild(bitmap)
  }

  container.x = imgShape.x + xOffset + (symbolForShape !== null ? symbolForShape.width : imgShape.width) / 2
  container.y = imgShape.y + yOffset + (symbolForShape !== null ? symbolForShape.height : imgShape.height) / 2
  container.regX = (symbolForShape !== null ? symbolForShape.width : imgShape.width) / 2
  container.regY = (symbolForShape !== null ? symbolForShape.height : imgShape.height) / 2

  container.skewX = (symbolForShape !== null ? symbolForShape.skewX : imgShape.skewX)
  container.skewY = (symbolForShape !== null ? symbolForShape.skewY : imgShape.skewY)


  //when we use an svg with width="100%" height="100%" viewBox="0 0 41 103" then the hit test is always wrong
  //createjs draws the img on a temp canvas and applied transformation so that the mouse point is on pos 0,0
  //then they use ctx.getImageData(0, 0, 1, 1).data[3] > 0 (the alpha channel) to check if there is a non-transparent
  //pixel
  //this however don't work if the svg has the above props... if we use e.g.
  //width="600px" height="976px" viewBox="0 0 600 976" then this works
  let hitTestShape = new createjs.Shape()
  hitTestShape.x = 0
  hitTestShape.y = 0
  hitTestShape.graphics
    .beginFill('black')
    .drawRect(
      0,
      0,
      (symbolForShape !== null ? symbolForShape.width : imgShape.width),
      (symbolForShape !== null ? symbolForShape.height : imgShape.height)
    )
  container.hitArea = hitTestShape

  if (isSelected) {
    //draw border
    const borderThickness = worldSettings.selectedFieldBorderThicknessInPx
    let border = new createjs.Shape()
    border.graphics.beginStroke(worldSettings.selectedFieldBorderColor)
    border.graphics.setStrokeStyle(borderThickness)
    const half = borderThickness / 2

    border.graphics.drawRect(
      xOffset - borderThickness,
      yOffset - borderThickness,
      (symbolForShape !== null ? symbolForShape.width : imgShape.width) + borderThickness * 2,
      (symbolForShape !== null ? symbolForShape.height : imgShape.height) + borderThickness * 2
    )

    // border.regX = imgShape.width / 2
    // border.regY = imgShape.height / 2
    //border.rotation = 45

    container.addChild(border)
  }

  // container.regX = imgShape.width / 2
  // container.regY = imgShape.height / 2
  container.rotation = (symbolForShape !== null ? symbolForShape.rotationInDegree : imgShape.rotationInDegree)

  if (symbolForShape !== null && drawBasedOnSymbolIndicator) {
    //draw a symbol so that the user knows that this shape is connected to a symbol

    let rectShape = new createjs.Shape()
    rectShape.graphics
      .beginStroke(isLinkedToSymbolIndicatorColor)

      .drawRoundRect(0 - isLinkedToSymbolIndicatorSizeInPx / 2,
        0 - isLinkedToSymbolIndicatorSizeInPx / 2,
        isLinkedToSymbolIndicatorSizeInPx,
        isLinkedToSymbolIndicatorSizeInPx,
        isLinkedToSymbolIndicatorCornerRadius
      )
    container.addChild(rectShape)
  }


  if (onClickHandler) {
    container.on('click', (eventObj => {
      onClickHandler(imgShape, bitmap, eventObj as MouseEvent)
      // onClickHandler(imgShape, eventObj as MouseEvent)
    }))
  }

  if (onMouseDownHandler) {
    container.on('mousedown', eventObj => {
      onMouseDownHandler(imgShape, bitmap, eventObj as MouseEvent)
    })
  }

  if (onMouseUpHandler) {
    container.on('pressup', eventObj => {
      onMouseUpHandler(imgShape, bitmap, eventObj as MouseEvent)
    })
  }

  stage.addChild(container)

  if (symbolForShape !== null ? symbolForShape.isMouseSelectionDisabled : imgShape.isMouseSelectionDisabled) {
    container.mouseEnabled = false
    container.alpha = 0.5
  }

  zIndexCache[imgShape.zIndex] = [container]
}

/**
 * the player is drawn from top to bot
 * TODO shift by px, bool shiftLeft (depend on text align)
 * @param {createjs.Stage} stage
 * @param field
 * @param color
 * @param xOffset
 * @param {number} yOffset
 * @param shiftXInPx the amount if px to shift the player token because this pos contains multiple player tokens
 * @param shiftYInPx same as shiftXInPx
 */
export function drawPlayer(stage: Stage,
                           field: FieldBase | null,
                           color: string,
                           xOffset: number,
                           yOffset: number,
                           shiftXInPx: number,
                           shiftYInPx: number
): void {


  let playerCircleSize = 14
  let playerBodyWidth = 20
  let playerBodyHeight = 23

  let defaultX = 0
  let defaultY = 0

  let container = new createjs.Container()

  let circle = new createjs.Shape()
  circle.graphics
    .beginFill(color)
    .drawCircle(playerBodyWidth / 2, playerCircleSize / 2, playerCircleSize / 2)


  let startBodyX = playerBodyWidth / 2
  let startBodyY = playerCircleSize / 2

  let body = new createjs.Shape()
  body.graphics
    .beginFill(color)
    .moveTo(startBodyX, startBodyY)
    .lineTo(0, playerBodyHeight + startBodyY)
    .lineTo(playerBodyWidth, playerBodyHeight + startBodyY)
    .lineTo(startBodyX, startBodyY)

  container.addChild(circle)
  container.addChild(body)

  if (field === null) {
    container.x = defaultX + xOffset - shiftXInPx
    container.y = defaultY + yOffset + shiftYInPx
  } else {

    if (field.horizontalTextAlign === HorizontalAlign.left) {

      container.x = field.x + field.width - playerBodyWidth + xOffset + shiftXInPx
      container.y = field.y + yOffset + shiftYInPx

    } else if (field.horizontalTextAlign === HorizontalAlign.right) {
      container.x = field.x + xOffset - shiftXInPx
      container.y = field.y + yOffset + shiftYInPx
    } else {
      container.x = field.x + xOffset - shiftXInPx
      container.y = field.y + yOffset + shiftYInPx
    }


  }


  stage.addChild(container)
  container.mouseEnabled = false


}
