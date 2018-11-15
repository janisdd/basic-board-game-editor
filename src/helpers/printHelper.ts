import {Tile} from "../types/world";
import * as graphics from '../../graphics/graphicsCore'
import {ZIndexCache} from "../types/ui";
import {FieldSymbol, ImgSymbol, LineSymbol} from "../types/drawing";
import {
  appProperties, defaultGameInitCode,
  maxPrintTileHeight,
  maxPrintTileWidth,
  printLargeTileBgColor,
  worldTileBorderColor
} from "../constants";
import {WorldSettings} from "../state/reducers/world/worldSettings/worldSettingsReducer";
import {VariableIndicatorDrawer} from "../../graphics/variableIndicatorDrawer";
import {
  DefinitionTableBoolEntry,
  DefinitionTableIntEntry, isBoolVar, isIntVar,
  WorldTileSurrogate
} from "../../simulation/machine/machineState";
import {getI18n, KnownLangs} from "../../i18n/i18nRoot";
import {WorldTilesHelper} from "./worldTilesHelper";
import fileSaver = require("file-saver");
import {LangHelper} from "./langHelper";
import {VarType} from "../../simulation/model/executionUnit";
import Stage = createjs.Stage;


declare var SVGExporter: any

export class PrintHelper {
  private constructor() {
  }

  /**
   * TODO maybe move this to IO helper?? but this needs many settings
   * exports the tile as svg
   * @param tile
   * @param {ReadonlyArray<FieldSymbol>} fieldSymbols
   * @param {ReadonlyArray<ImgSymbol>} imgSymbols
   * @param {ReadonlyArray<LineSymbol>} lineSymbols
   * @param {boolean} drawGrid
   * @param {number} gridSizeInPx
   * @param {number} gridStrokeThicknessInPx
   * @param {string} gridStrokeColor
   * @param {WorldSettings} worldSettings
   */
  public static exportTileAsLargeSvg(
    tile: Tile,
    fieldSymbols: ReadonlyArray<FieldSymbol>,
    imgSymbols: ReadonlyArray<ImgSymbol>,
    lineSymbols: ReadonlyArray<LineSymbol>,
    drawGrid: boolean, gridSizeInPx: number, gridStrokeThicknessInPx: number, gridStrokeColor: string,
    worldSettings: WorldSettings,
  ) {

    let canvas = document.createElement('canvas')

    canvas.width = tile.tileSettings.width
    canvas.height = tile.tileSettings.height

    const stage = this.printFullTile(
      tile,
      fieldSymbols,
      imgSymbols, lineSymbols,
      canvas,
      drawGrid, gridSizeInPx,
      gridStrokeThicknessInPx,
      gridStrokeColor,
      worldSettings
    )

    const exporter = new (window as any).SVGExporter(stage, tile.tileSettings.width, tile.tileSettings.height, false);
    exporter.stretchImages = true;
    exporter.run()
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(exporter.svg);

    const date = new Date(Date.now())
    let fileName = `export_${appProperties.exportFileNamePrefix}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}__${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.svg`

    const blob = new Blob([svgStr], {type: "image/svg+xml;charset=utf-8"});
    fileSaver.saveAs(blob, fileName)
  }

  /**
   * TODO maybe move this to IO helper?? but this needs many settings
   * @param tileSurrogates
   * @param tilesToPrint
   * @param {ReadonlyArray<FieldSymbol>} fieldSymbols
   * @param {ReadonlyArray<ImgSymbol>} imgSymbols
   * @param {ReadonlyArray<LineSymbol>} lineSymbols
   * @param allTiles
   * @param {boolean} drawGrid
   * @param {number} gridSizeInPx
   * @param {number} gridStrokeThicknessInPx
   * @param {string} gridStrokeColor
   * @param {WorldSettings} worldSettings
   */
  public static exportWorldAsLargeSvg(
    tileSurrogates: ReadonlyArray<WorldTileSurrogate>,
    tilesToPrint: ReadonlyArray<Tile>,
    fieldSymbols: ReadonlyArray<FieldSymbol>,
    imgSymbols: ReadonlyArray<ImgSymbol>,
    lineSymbols: ReadonlyArray<LineSymbol>,
    allTiles: ReadonlyArray<Tile>,
    drawGrid: boolean, gridSizeInPx: number, gridStrokeThicknessInPx: number, gridStrokeColor: string,
    worldSettings: WorldSettings,
  ) {

    const tilesWidth = tilesToPrint[0].tileSettings.width
    const tilesHeight = tilesToPrint[0].tileSettings.height

    const boundingBox = WorldTilesHelper.getWorldBoundingBox(tileSurrogates)
    const widthInTiles = boundingBox.maxX - boundingBox.minX + 1 //+1 max = min = 1 --> 0 but this is 1 tile
    const heightInTiles = boundingBox.maxY - boundingBox.minY + 1

    const fullGameWidth = widthInTiles * tilesWidth
    const fullGameHeight = heightInTiles * tilesHeight

    const fullGameCanvas = document.createElement('canvas') as HTMLCanvasElement

    fullGameCanvas.width = fullGameWidth
    fullGameCanvas.height = fullGameHeight

    const zIndexCache: ZIndexCache = {}

    const stage = new createjs.Stage(fullGameCanvas)

    stage.clear()

    stage.scaleX = 1
    stage.scaleY = 1
    stage.x = 0
    stage.y = 0

    for (let i = 0; i < widthInTiles; i++) {
      for (let j = 0; j < heightInTiles; j++) {

        const tileSurrogate = WorldTilesHelper.getTileFromPos(i, j, tileSurrogates)

        if (tileSurrogate === null) continue

        graphics.drawGrid(
          stage,
          tilesWidth,
          tilesHeight,
          0,
          1,
          worldTileBorderColor,
          true,
          i * tilesWidth,
          j * tilesHeight
        )

        const tile = allTiles.find(p => p.guid === tileSurrogate.tileGuid)

        if (!tile) continue

        graphics.drawFieldsOnTile(
          stage,
          tile.fieldShapes,
          [],
          [],
          null,
          null,
          null,
          zIndexCache,
          false,
          false,
          worldSettings,
          fieldSymbols,
          i * tilesWidth,
          j * tilesHeight,
          false,
          //null,null,null
        )

        graphics.drawImagesOnTile(
          stage,
          tile.imgShapes,
          [],
          [],
          null,
          null,
          null,
          zIndexCache,
          worldSettings,
          imgSymbols,
          i * tilesWidth,
          j * tilesHeight,
          false
        )

        graphics.drawLinesOnTile(
          stage,
          tile.lineShapes,
          [],
          [],
          null,
          null,
          zIndexCache,
          worldSettings,
          lineSymbols,
          i * tilesWidth,
          j * tilesHeight,
          false
        )

      }
    }

    //set zindex
    for (const zIndex in zIndexCache) {
      const list = zIndexCache[zIndex]

      for (const child of list) {
        stage.setChildIndex(child, parseInt(zIndex))
      }
    }

    stage.update()


    const exporter = new (window as any).SVGExporter(stage, fullGameWidth, fullGameHeight, false);
    exporter.stretchImages = true;
    exporter.run()
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(exporter.svg);

    const date = new Date(Date.now())
    let fileName = `export_${appProperties.exportFileNamePrefix}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}__${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.svg`

    const blob = new Blob([svgStr], {type: "image/svg+xml;charset=utf-8"});
    fileSaver.saveAs(blob, fileName)
  }

  /**
   *
   * @param {Tile} tile
   * @param {ReadonlyArray<FieldSymbol>} fieldSymbols
   * @param {ReadonlyArray<ImgSymbol>} imgSymbols
   * @param {ReadonlyArray<LineSymbol>} lineSymbols
   * @param {boolean} drawGrid
   * @param {number} gridSizeInPx
   * @param {number} gridStrokeThicknessInPx
   * @param {string} gridStrokeColor
   * @param {WorldSettings} worldSettings
   * @param {number} fullTileWidth
   * @param {number} fillTileHeight
   * @param {number} preferredSubTileWidth e.g. 500 then the large tile is divided into sub tiles of max 500 width sub images
   *    @see maxPrintTileWidth for max value
   * @param {number} preferredSubTileHeight e.g. 500 then the large tile is divided into sub tiles of max 500 width sub images
   *    @see maxPrintTileHeight for max value
   * @param splitLargeTileForPrint
   * @param langId
   *
   */
  public static printLargeTile(tile: Tile,
                               fieldSymbols: ReadonlyArray<FieldSymbol>,
                               imgSymbols: ReadonlyArray<ImgSymbol>,
                               lineSymbols: ReadonlyArray<LineSymbol>,
                               drawGrid: boolean, gridSizeInPx: number, gridStrokeThicknessInPx: number, gridStrokeColor: string,
                               worldSettings: WorldSettings,
                               fullTileWidth: number,
                               fillTileHeight: number,
                               preferredSubTileWidth: number,
                               preferredSubTileHeight: number,
                               splitLargeTileForPrint: boolean,
                               langId: KnownLangs
  ) {

    preferredSubTileWidth = Math.min(maxPrintTileWidth, preferredSubTileWidth)
    preferredSubTileHeight = Math.min(maxPrintTileHeight, preferredSubTileHeight)

    const {html: boilerplateHtml1, idDataAttributeKey, idCheckboxDataAttributeKey, idCheckboxDataSetKey, fullCanvasClass} = this.getHtmlBoilerplate(
      !splitLargeTileForPrint,
      langId)

    const printWindow = window.open()
    printWindow.document.write(boilerplateHtml1)

    const canvas = printWindow.document.createElement('canvas') as HTMLCanvasElement

    if (splitLargeTileForPrint) {
      canvas.classList.add(fullCanvasClass)
    }

    const dpi = 300
    let scaleFactor = dpi / 96;
    scaleFactor = 6


    canvas.style.width = `${fullTileWidth}px`
    canvas.style.height = `${fillTileHeight}px`

    canvas.width = Math.ceil(fullTileWidth * scaleFactor);
    canvas.height = Math.ceil(fillTileHeight * scaleFactor);

    if (!drawGrid) {
      //we only draw border
      gridStrokeThicknessInPx = 2 //better for high dpi printing
    }

    const stage = this.printFullTile(tile, fieldSymbols, imgSymbols, lineSymbols, canvas, drawGrid, gridSizeInPx,
      gridStrokeThicknessInPx, gridStrokeColor, worldSettings)

    stage.scaleX = stage.scaleY = scaleFactor
    stage.update()

    if (splitLargeTileForPrint) {
      this.printTileBorders(
        stage,
        fullTileWidth,
        fillTileHeight,
        preferredSubTileWidth,
        preferredSubTileHeight,
        gridStrokeThicknessInPx,
        'black',
      )
    }

    printWindow.document.body.appendChild(canvas)

    const stageData = (stage.canvas as HTMLCanvasElement).toDataURL(printLargeTileBgColor, 'image/png')//stage.toDataURL(printLargeTileBgColor, 'image/png')

    if (splitLargeTileForPrint) {

      const pieces = this.imgToPieces(
        stageData, fullTileWidth * scaleFactor, fillTileHeight * scaleFactor, preferredSubTileWidth * scaleFactor,
        preferredSubTileHeight * scaleFactor)

      for (let i = 0; i < pieces.length; i++) {

        const pieceBitmap: createjs.Bitmap = pieces[i]

        const wrapperDiv = printWindow.document.createElement('div') as HTMLDivElement
        wrapperDiv.classList.add('wrapper-div')
        wrapperDiv.dataset[idDataAttributeKey] = i.toString()

        const checkbox = printWindow.document.createElement('input') as HTMLInputElement
        checkbox.type = 'checkbox'
        checkbox.checked = true
        checkbox.dataset[idCheckboxDataSetKey] = i.toString()

        const checkboxLabel = printWindow.document.createElement('label') as HTMLLabelElement
        checkboxLabel.innerText = "" //maybe some text??

        const checkboxDiv = printWindow.document.createElement('div')
        checkboxDiv.classList.add('print-hidden')

        checkboxDiv.appendChild(checkbox)
        checkboxDiv.appendChild(checkboxLabel)

        const pieceCanvas = printWindow.document.createElement('canvas') as HTMLCanvasElement

        pieceCanvas.style.width = `${preferredSubTileWidth}px`
        pieceCanvas.style.height = `${preferredSubTileHeight}px`

        pieceCanvas.width = preferredSubTileWidth * scaleFactor
        pieceCanvas.height = preferredSubTileHeight * scaleFactor

        // pieceCanvas.width = Math.ceil(preferredSubTileWidth * scaleFactor)
        // pieceCanvas.height = Math.ceil(preferredSubTileHeight * scaleFactor)
        //
        // pieceBitmap.scaleX = pieceBitmap.scaleY = scaleFactor

        // const dpiHelper = new CanvasDpiHelper(stage)
        // dpiHelper.setDPI(canvas, 600)
        // console.log(dpiHelper)

        wrapperDiv.appendChild(checkboxDiv)
        wrapperDiv.appendChild(pieceCanvas)

        pieceBitmap.image.onload = ev1 => {

          const pieceStage = new createjs.Stage(pieceCanvas)
          pieceStage.addChild(pieceBitmap)
          pieceStage.update()
          // printWindow.document.body.appendChild(pieceCanvas)
          printWindow.document.body.appendChild(wrapperDiv)
        }
      }


    }

    // printWindow.window.print()
    // printWindow.window.close()
  }


  private static printFullTile(tile: Tile,
                               fieldSymbols: ReadonlyArray<FieldSymbol>,
                               imgSymbols: ReadonlyArray<ImgSymbol>,
                               lineSymbols: ReadonlyArray<LineSymbol>,
                               canvas: HTMLCanvasElement, drawGrid: boolean, gridSizeInPx: number, gridStrokeThicknessInPx: number, gridStrokeColor: string, worldSettings: WorldSettings,
  ): createjs.Stage {

    const zIndexCache: ZIndexCache = {}

    const stage = new createjs.Stage(canvas)

    stage.clear()

    stage.scaleX = 1
    stage.scaleY = 1
    stage.x = 0
    stage.y = 0

    // const width = canvas.width
    // const height = canvas.height


    //canvas size is larger for printing (scaled) so use the tile size
    graphics.drawGrid(stage, tile.tileSettings.width, tile.tileSettings.height, gridSizeInPx, gridStrokeThicknessInPx, gridStrokeColor, !drawGrid,
      0, 0)

    graphics.drawFieldsOnTile(stage, tile.fieldShapes, [], [], null, null, null, zIndexCache, false, false,
      worldSettings,
      fieldSymbols, 0, 0, false,
      // null,null,null
    )

    graphics.drawLinesOnTile(stage, tile.lineShapes, [], [], null, null, zIndexCache, worldSettings, lineSymbols, 0, 0,
      false)

    graphics.drawImagesOnTile(stage, tile.imgShapes, [], [], null, null, null, zIndexCache, worldSettings, imgSymbols,
      0, 0, false)


    for (const zIndex in zIndexCache) {
      const list = zIndexCache[zIndex]

      for (const child of list) {
        stage.setChildIndex(child, parseInt(zIndex))
      }
    }

    stage.update()

    return stage

  }


  /**
   * use this to print the lines where we need to cut (where we split the img)
   */
  private static printTileBorders(stage: Stage,
                                  fullTileWidth: number,
                                  fillTileHeight: number,
                                  preferredSubTileWidth: number,
                                  preferredSubTileHeight: number,
                                  gridStrokeThicknessInPx: number,
                                  gridStrokeColor: string,
  ): void {

    for (let x = 1; x * preferredSubTileWidth < fullTileWidth; x++) {

      let topToBottomPrintGuide = new createjs.Shape()
      topToBottomPrintGuide.graphics
        .setStrokeStyle(gridStrokeThicknessInPx)
        .beginStroke(gridStrokeColor)
        .moveTo(x * preferredSubTileWidth, 0)
        .lineTo(x * preferredSubTileWidth, fillTileHeight)

      topToBottomPrintGuide.mouseEnabled = false
      stage.addChild(topToBottomPrintGuide)
    }

    for (let y = 1; y * preferredSubTileHeight < fillTileHeight; y++) {
      let topToBottomPrintGuide = new createjs.Shape()
      topToBottomPrintGuide.graphics
        .setStrokeStyle(gridStrokeThicknessInPx)
        .beginStroke(gridStrokeColor)
        .moveTo(0, y * preferredSubTileHeight)
        .lineTo(fullTileWidth, y * preferredSubTileHeight)

      topToBottomPrintGuide.mouseEnabled = false
      stage.addChild(topToBottomPrintGuide)
    }

    stage.update()
  }


  private static imgToPieces(
    fullTileImageData: string,
    fullTileWidth: number,
    fillTileHeight: number,
    preferredSubTileWidth: number,
    preferredSubTileHeight: number,
  ): ReadonlyArray<createjs.Bitmap> {

    const res: createjs.Bitmap[] = []

    const xTiles = Math.ceil(fullTileWidth / preferredSubTileWidth)
    const yTiles = Math.ceil(fillTileHeight / preferredSubTileHeight)

    for (let j = 0; j < yTiles; j++) {
      for (let i = 0; i < xTiles; i++) {

        const bitmap = new createjs.Bitmap(fullTileImageData)
        bitmap.sourceRect = new createjs.Rectangle(i * preferredSubTileWidth, j * preferredSubTileHeight,
          preferredSubTileWidth,
          preferredSubTileHeight)

        res.push(bitmap)
      }
    }

    return res
  }


  public static async printVariableIndicator(
    stageWidth: number,
    stageHeight: number,
    outerCircleDiameterInPx: number,
    innerCircleDiameterInPx: number,
    numOfFields: number,
    innerText: string,
    borderStrokeColor: string,
    isBoolVar: boolean,
    fontSizeInPx: number,
    fontName: string,
    variableIndicatorStrokeThickness: number,
    drawQrCode: boolean
  ): Promise<void> {

    const boilerplateHtml1 =
      `
<html>
  <head>
  <title>Printing</title>
    <style>
      canvas {
        /*border: 1px solid black;*/
        margin: 0.5em;
      }
    </style>
  </head>
  <body>
</html>
      `
    const printWindow = window.open()
    printWindow.document.write(boilerplateHtml1)

    const dpi = 300
    let scaleFactor = dpi / 96;
    scaleFactor = 6

    //TODO not working...
    // printWindow.document.write(boilerplateHtml2)
    // printWindow.window.addEventListener('load', evt => {
    //   console.log('okokok')
    // })
    //
    // printWindow.addEventListener('load', evt => {
    //   console.log('okokok')
    // })

    const canvas = printWindow.document.createElement('canvas') as HTMLCanvasElement

    canvas.style.width = `${stageWidth}px`
    canvas.style.height = `${stageHeight}px`

    canvas.width = Math.ceil(stageWidth * scaleFactor);
    canvas.height = Math.ceil(stageHeight * scaleFactor);

    const stage = new createjs.Stage(canvas)

    graphics.drawGrid(stage, stageWidth, stageHeight, 0, 1, borderStrokeColor, true, 0, 0)

    await VariableIndicatorDrawer.drawVariableIndicator(stage,
      stageWidth, stageHeight, outerCircleDiameterInPx, innerCircleDiameterInPx, numOfFields,
      innerText,
      isBoolVar,
      fontSizeInPx,
      fontName,
      variableIndicatorStrokeThickness,
      drawQrCode
    )

    stage.scaleX = stage.scaleY = scaleFactor

    stage.update()
    printWindow.document.body.appendChild(canvas)

  }


  /**
   *
   * @param {ReadonlyArray<WorldTileSurrogate>} tileSurrogates
   * @param {ReadonlyArray<Tile>} tilesToPrint to surrogates mapped to tiles
   * @param {ReadonlyArray<FieldSymbol>} fieldSymbols
   * @param {ReadonlyArray<ImgSymbol>} imgSymbols
   * @param {ReadonlyArray<LineSymbol>} lineSymbols
   * @param {ReadonlyArray<Tile>} allTiles
   * @param {boolean} drawGrid
   * @param {number} gridSizeInPx
   * @param {number} gridStrokeThicknessInPx
   * @param {string} gridStrokeColor
   * @param {WorldSettings} worldSettings
   * @param {KnownLangs} langId
   * @param {boolean} onlyWholeWorld
   * @param outerCircleDiameterInPx
   * @param innerCircleDiameterInPx
   * @param expectTileWidth
   * @param expectedTileHeight
   * @param variableFontSizeInPx
   * @param variableFontName
   * @param variableInnerTextFontSizeInPx
   * @param variableIndicatorStrokeThickness
   * @param drawQrCode
   */
  public static async printWorld(
    tileSurrogates: ReadonlyArray<WorldTileSurrogate>,
    tilesToPrint: ReadonlyArray<Tile>,
    fieldSymbols: ReadonlyArray<FieldSymbol>,
    imgSymbols: ReadonlyArray<ImgSymbol>,
    lineSymbols: ReadonlyArray<LineSymbol>,
    allTiles: ReadonlyArray<Tile>,
    drawGrid: boolean,
    gridSizeInPx: number, gridStrokeThicknessInPx: number, gridStrokeColor: string,
    worldSettings: WorldSettings,
    langId: KnownLangs,
    onlyWholeWorld: boolean,
    outerCircleDiameterInPx: number,
    innerCircleDiameterInPx: number,
    expectTileWidth: number,
    expectedTileHeight: number,
    variableFontSizeInPx: number,
    variableFontName: string,
    variableIndicatorStrokeThickness: number,
    drawQrCode: boolean
  ): Promise<void> {


    //a tile could be used multiple times...

    const {html: boilerplateHtml1, idDataAttributeKey, idCheckboxDataAttributeKey, idCheckboxDataSetKey, fullCanvasClass} = this.getHtmlBoilerplate(
      onlyWholeWorld,
      langId)

    const printWindow = window.open()
    printWindow.document.write(boilerplateHtml1)
    const dpi = 300
    let scaleFactor = dpi / 96
    scaleFactor = 6

    let printTileCount = 0

    if (onlyWholeWorld) {

      //only print the world as one image

      const tilesWidth = tilesToPrint[0].tileSettings.width
      const tilesHeight = tilesToPrint[0].tileSettings.height

      const boundingBox = WorldTilesHelper.getWorldBoundingBox(tileSurrogates)
      const widthInTiles = boundingBox.maxX - boundingBox.minX + 1 //+1 max = min = 1 --> 0 but this is 1 tile
      const heightInTiles = boundingBox.maxY - boundingBox.minY + 1

      const fullGameWidth = widthInTiles * tilesWidth
      const fullGameHeight = heightInTiles * tilesHeight

      const fullGameCanvas = printWindow.document.createElement('canvas') as HTMLCanvasElement

      fullGameCanvas.style.width = `${fullGameWidth}px`
      fullGameCanvas.style.height = `${fullGameHeight}px`
      fullGameCanvas.width = Math.ceil(fullGameWidth * scaleFactor);
      fullGameCanvas.height = Math.ceil(fullGameHeight * scaleFactor);

      const zIndexCache: ZIndexCache = {}

      const stage = new createjs.Stage(fullGameCanvas)

      stage.clear()

      stage.scaleX = 1
      stage.scaleY = 1
      stage.x = 0
      stage.y = 0

      for (let i = 0; i < widthInTiles; i++) {
        for (let j = 0; j < heightInTiles; j++) {

          const tileSurrogate = WorldTilesHelper.getTileFromPos(i, j, tileSurrogates)

          if (tileSurrogate === null) continue

          graphics.drawGrid(
            stage,
            tilesWidth,
            tilesHeight,
            0,
            1,
            worldTileBorderColor,
            true,
            i * tilesWidth,
            j * tilesHeight
          )

          const tile = allTiles.find(p => p.guid === tileSurrogate.tileGuid)

          if (!tile) continue

          graphics.drawFieldsOnTile(
            stage,
            tile.fieldShapes,
            [],
            [],
            null,
            null,
            null,
            zIndexCache,
            false,
            false,
            worldSettings,
            fieldSymbols,
            i * tilesWidth,
            j * tilesHeight,
            false,
            //null,null,null
          )

          graphics.drawImagesOnTile(
            stage,
            tile.imgShapes,
            [],
            [],
            null,
            null,
            null,
            zIndexCache,
            worldSettings,
            imgSymbols,
            i * tilesWidth,
            j * tilesHeight,
            false
          )

          graphics.drawLinesOnTile(
            stage,
            tile.lineShapes,
            [],
            [],
            null,
            null,
            zIndexCache,
            worldSettings,
            lineSymbols,
            i * tilesWidth,
            j * tilesHeight,
            false
          )

        }
      }

      //set zindex
      for (const zIndex in zIndexCache) {
        const list = zIndexCache[zIndex]

        for (const child of list) {
          stage.setChildIndex(child, parseInt(zIndex))
        }
      }

      stage.scaleX = stage.scaleY = scaleFactor
      stage.update()

      printWindow.document.body.appendChild(fullGameCanvas)

    }
    else {
      //print all tiles
      for (let i = 0; i < tilesToPrint.length; i++) {
        const printTile = tilesToPrint[i]

        const wrapperDiv = printWindow.document.createElement('div') as HTMLDivElement
        wrapperDiv.classList.add('wrapper-div')
        wrapperDiv.dataset[idDataAttributeKey] = i.toString()

        const checkbox = printWindow.document.createElement('input') as HTMLInputElement
        checkbox.type = 'checkbox'
        checkbox.checked = true
        checkbox.dataset[idCheckboxDataSetKey] = i.toString()

        const checkboxLabel = printWindow.document.createElement('label') as HTMLLabelElement
        checkboxLabel.innerText = "" //maybe some text??

        const checkboxDiv = printWindow.document.createElement('div')
        checkboxDiv.classList.add('print-hidden')

        checkboxDiv.appendChild(checkbox)
        checkboxDiv.appendChild(checkboxLabel)

        const canvas = printWindow.document.createElement('canvas') as HTMLCanvasElement

        const fullTileWidth = printTile.tileSettings.width
        const fillTileHeight = printTile.tileSettings.height

        canvas.style.width = `${fullTileWidth}px`
        canvas.style.height = `${fillTileHeight}px`

        canvas.width = Math.ceil(fullTileWidth * scaleFactor);
        canvas.height = Math.ceil(fillTileHeight * scaleFactor);

        if (!drawGrid) {
          //we only draw border
          gridStrokeThicknessInPx = 2 //better for high dpi printing
        }

        const stage = this.printFullTile(printTile, fieldSymbols, imgSymbols, lineSymbols, canvas, drawGrid,
          gridSizeInPx,
          gridStrokeThicknessInPx, gridStrokeColor, worldSettings)

        stage.scaleX = stage.scaleY = scaleFactor
        stage.update()

        wrapperDiv.appendChild(checkboxDiv)
        wrapperDiv.appendChild(canvas)

        printWindow.document.body.appendChild(wrapperDiv)
      }
    }

    printTileCount = tilesToPrint.length

    if (onlyWholeWorld === false) {
      //only print vars when we print every tile

      let uniqueTiles: Tile[] = []

      for (const tile of tilesToPrint) {

        if (uniqueTiles.find(p => p.guid === tile.guid)) {
          //we have a tile >1 tiles... we only need 1 var tile for this
        }
        else {
          uniqueTiles.push(tile)
        }
      }

      const allVarDefs = LangHelper.getAllVarDefiningStatements(worldSettings.worldCmdText, uniqueTiles)

      const variableIndicatorWidth = expectTileWidth
      const variableIndicatorHeight = expectedTileHeight

      for (const globalVar of allVarDefs.globalVars) {

        const wrapperDiv = await this.getVariablePrintTile(printWindow,
          idDataAttributeKey,
          idCheckboxDataSetKey,
          printTileCount++,
          scaleFactor,
          variableIndicatorWidth,
          variableIndicatorHeight,
          outerCircleDiameterInPx,
          innerCircleDiameterInPx,
          variableFontSizeInPx,
          variableFontName,
          (globalVar.var_type === VarType.bool
            ? {
              ident: globalVar.ident,
              boolVal: false //actual value doesn't matter
            } as DefinitionTableBoolEntry
            : {
              ident: globalVar.ident,
              val: 0, //actual value doesn't matter
              maxVal: globalVar.maxVal
            } as DefinitionTableIntEntry),
          variableIndicatorStrokeThickness,
          drawQrCode
        )

        printWindow.document.body.appendChild(wrapperDiv)
      }

      for (const playerVar of allVarDefs.playerVars) {
        const wrapperDiv = await this.getVariablePrintTile(printWindow,
          idDataAttributeKey,
          idCheckboxDataSetKey,
          printTileCount++,
          scaleFactor,
          variableIndicatorWidth,
          variableIndicatorHeight,
          outerCircleDiameterInPx,
          innerCircleDiameterInPx,
          variableFontSizeInPx,
          variableFontName,
          (playerVar.var_type === VarType.bool
            ? {
              ident: playerVar.ident,
              boolVal: false //actual value doesn't matter
            } as DefinitionTableBoolEntry
            : {
              ident: playerVar.ident,
              val: 0, //actual value doesn't matter
              maxVal: playerVar.maxVal
            } as DefinitionTableIntEntry),
          variableIndicatorStrokeThickness,
          drawQrCode
        )

        printWindow.document.body.appendChild(wrapperDiv)
      }

      //TODO maybe we have adjacent scopes with same var names ... we could reuse them (only print once)??
      for (const localVarObj of allVarDefs.localVars) {

        for (const localVarDef of localVarObj.localVars) {

          const wrapperDiv = await this.getVariablePrintTile(printWindow,
            idDataAttributeKey,
            idCheckboxDataSetKey,
            printTileCount++,
            scaleFactor,
            variableIndicatorWidth,
            variableIndicatorHeight,
            outerCircleDiameterInPx,
            innerCircleDiameterInPx,
            variableFontSizeInPx,
            variableFontName,
            (localVarDef.var_type === VarType.bool
              ? {
                ident: localVarDef.ident,
                boolVal: false //actual value doesn't matter
              } as DefinitionTableBoolEntry
              : {
                ident: localVarDef.ident,
                val: 0, //actual value doesn't matter
                maxVal: localVarDef.maxVal
              } as DefinitionTableIntEntry),
            variableIndicatorStrokeThickness,
            drawQrCode
          )

          printWindow.document.body.appendChild(wrapperDiv)
        }
      }

    }

  }

  private static async getVariablePrintTile(printWindow: Window, idDataAttributeKey: string,
                                      idCheckboxDataSetKey: string,
                                      uniqueIndex: number,
                                      scaleFactor: number,
                                      width: number,
                                      height: number,
                                      outerCircleDiameterInPx: number,
                                      innerCircleDiameterInPx: number,
                                      fontSizeInPx: number,
                                      fontName: string,
                                      entry: DefinitionTableBoolEntry | DefinitionTableIntEntry,
                                      strokeThickness: number,
                                      drawQrCode: boolean
  ): Promise<HTMLDivElement> {

    const wrapperDiv = printWindow.document.createElement('div') as HTMLDivElement
    wrapperDiv.classList.add('wrapper-div')
    wrapperDiv.dataset[idDataAttributeKey] = uniqueIndex.toString()

    const checkbox = printWindow.document.createElement('input') as HTMLInputElement
    checkbox.type = 'checkbox'
    checkbox.checked = true
    checkbox.dataset[idCheckboxDataSetKey] = uniqueIndex.toString()

    const checkboxLabel = printWindow.document.createElement('label') as HTMLLabelElement
    checkboxLabel.innerText = "" //maybe some text??

    const checkboxDiv = printWindow.document.createElement('div')
    checkboxDiv.classList.add('print-hidden')

    checkboxDiv.appendChild(checkbox)
    checkboxDiv.appendChild(checkboxLabel)

    const canvas = printWindow.document.createElement('canvas') as HTMLCanvasElement

    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    canvas.width = Math.ceil(width * scaleFactor);
    canvas.height = Math.ceil(height * scaleFactor);


    const stage = new createjs.Stage(canvas)

    if (isIntVar(entry)) {
      await VariableIndicatorDrawer.drawVariableIndicator(stage,
        width, height,
        outerCircleDiameterInPx,
        innerCircleDiameterInPx,
        (entry.maxVal * 2) + 1,
        entry.ident,
        false,
        fontSizeInPx,
        fontName,
        strokeThickness,
        drawQrCode
      )
    }

    else if (isBoolVar(entry)) {
      await  VariableIndicatorDrawer.drawVariableIndicator(stage,
        width, height,
        outerCircleDiameterInPx,
        innerCircleDiameterInPx,
        2,
        entry.ident,
        true,
        fontSizeInPx,
        fontName,
        strokeThickness,
        drawQrCode
      )
    }

    wrapperDiv.appendChild(checkboxDiv)
    wrapperDiv.appendChild(canvas)


    stage.scaleX = stage.scaleY = scaleFactor
    stage.update()

    return wrapperDiv

  }


  /**
   *
   * @param isSingleImage true: hide all buttons & interactions we can only print this one image, false: display all
   * @param langId the lang for some labels
   */
  private static getHtmlBoilerplate(isSingleImage: boolean, langId: KnownLangs):
    {
      html: string
      idDataAttributeKey: string
      idCheckboxDataAttributeKey: string
      idCheckboxDataSetKey: string,
      fullCanvasClass: string
    } {

    const checkAllCheckboxesString = getI18n(langId, "Check all")
    const uncheckAllCheckboxesString = getI18n(langId, "Uncheck all")
    const toggleAllCheckboxesString = getI18n(langId, "Toggle all")
    const removedUncheckedPiecesString = getI18n(langId, "Remove unchecked")


    const printNoteText = getI18n(langId,
      "You can now print the page. Note that this text & other elements will be removed when printing this page. To remove some tiles uncheck them and remove them with a click on the remove button")


    const idDataAttributeKey = 'id'
    const idCheckboxDataAttributeKey = 'id-for'
    const idCheckboxDataSetKey = 'idFor'

    const fullCanvasClass = 'full-canvas'

    const html = `
<html>
  <head>
  <title>Printing</title>
    <style>
      @media screen {
        .wrapper-div {
          display: inline-flex;
          flex-direction: column;
        }
        canvas {
          /*border: 1px solid black;*/
          margin: 0.5em;
        }
        .${fullCanvasClass} {
          display: none;
        }
        .hidden {
          display: none;
        }
      }
      @media print {
        .${fullCanvasClass} {
          display: none;
        }
        .hidden {
          display: none;
        }
        .print-hidden {
          display: none;
        }
        canvas {
          /*border: 1px solid black;*/
          margin: 0.5em;
        }
      }
    </style>
    
    <script>
        
      function setChecked(newState) {
        let checkboxes = document.querySelectorAll('[data-${idCheckboxDataAttributeKey}]')
       
        for(let i = 0; i < checkboxes.length;i++) {
            let checkbox = checkboxes[i]
            checkbox.checked = newState
        }
      }
      
      function toggleAll() {
        let checkboxes = document.querySelectorAll('[data-${idCheckboxDataAttributeKey}]')
        for(let i = 0; i < checkboxes.length;i++) {
            let checkbox = checkboxes[i]
            checkbox.checked = !checkbox.checked
        }
      }
      
      function removeUnchecked() {
        let wrapperDiv = document.querySelectorAll('[data-${idDataAttributeKey}]')
        let checkboxes = document.querySelectorAll('[data-${idCheckboxDataAttributeKey}]')
        
        for(let i = 0; i < wrapperDiv.length;i++) {
            let div = wrapperDiv[i]
            let wrapperId = parseInt(div.dataset['${idDataAttributeKey}'])
            
            //find the related checkbox
            for(let k = 0; k < checkboxes.length;k++) {
                let checkbox = checkboxes[k]
                let checkboxId = parseInt(checkbox.dataset['${idCheckboxDataSetKey}'])
                
                if (wrapperId === checkboxId && checkbox.checked === false) {
                  document.body.removeChild(div)
                  break
                }
            }
        }
      }
    </script>
   
  </head>
  <body>
  
  <div class="print-hidden${isSingleImage ? ' hidden' : ''}">
    <button onclick="setChecked(true)">${checkAllCheckboxesString}</button>
    <button onclick="setChecked(false)">${uncheckAllCheckboxesString}</button>
    <button onclick="toggleAll()">${toggleAllCheckboxesString}</button>
    <button style="margin-left: 2em" onclick="removeUnchecked()">${removedUncheckedPiecesString}</button>
  </div>
  
  <div style="padding: 1em" class="print-hidden${isSingleImage ? ' hidden' : ''}">
    ${printNoteText} 
  </div>
  
  </body>
</html>
      `


    return {
      html,
      idDataAttributeKey,
      idCheckboxDataAttributeKey,
      idCheckboxDataSetKey,
      fullCanvasClass
    }
  }

}
