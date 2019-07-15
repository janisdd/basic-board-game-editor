import {Tile} from "../types/world";
import * as graphics from '../../graphics/graphicsCore'
import {ZIndexCache} from "../types/ui";
import {FieldSymbol, ImgSymbol, LineSymbol} from "../types/drawing";
import {
  appProperties, fontAwesomeCssFontFaceDefForSvg, fontAwesomeLink,
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
import Shape = createjs.Shape;
import {injectFontAwesomeIconsIfNecessary} from "./markdownHelper";


declare var SVGExporter: any

export class PrintHelper {
  private constructor() {
  }


  //see https://github.com/jeromeetienne/AR.js/blob/master/three.js/examples/marker-training/threex-arpatternfile.js
  /**
   * @param
   */
  public static printArMarker(
    printAndExportScale: number,
    text: string = 'Hiro',
    fontSizeInPx: number = 100,
    isFontBold: boolean = true,
    markerSizeInPx: number = 512,
    color: string = 'black'
  ) {

    const isFontItalic = false
    const fontName = 'Arial'


    const pattRatio = 0.5
    const whiteMargin = 0.1 //from 0 to 1
    const blackMargin = (1 - 2 * whiteMargin) * ((1 - pattRatio) / 2)
    // var blackMargin = 0.2

    const innerMargin = whiteMargin + blackMargin

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
        .hidden {
          display: none;
        }
      }
      @media print {
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
       
  </head>
  <body>
  
 
  </body>
</html>
      `


    text = injectFontAwesomeIconsIfNecessary(text)

    let scaleFactor = 6
    scaleFactor = scaleFactor * printAndExportScale

    const printWindow = window.open()
    printWindow.document.write(html)

    printWindow.onload = async () => {

      await ((printWindow.document as any).fonts.load("12px 'Font Awesome 5 Free'") as Promise<void>);
      await ((printWindow.document as any).fonts.load("bold 12px 'Font Awesome 5 Free'") as Promise<void>);


      const markerCanvas = printWindow.document.createElement('canvas') as HTMLCanvasElement

      markerCanvas.style.width = `${markerSizeInPx * printAndExportScale}px`
      markerCanvas.style.height = `${markerSizeInPx * printAndExportScale}px`

      markerCanvas.width = markerSizeInPx * scaleFactor
      markerCanvas.height = markerSizeInPx * scaleFactor

      const stage = new createjs.Stage(markerCanvas)
      stage.scaleX = stage.scaleY = scaleFactor

      const whiteRect = new createjs.Shape()

      whiteRect
        .graphics
        .beginFill('white')
        .drawRect(
          0,
          0,
          markerSizeInPx,
          markerSizeInPx
        )

      //inner
      const borderShape = new createjs.Shape()
      borderShape.graphics
        .beginFill(color)
        .drawRect(
          whiteMargin * markerSizeInPx,
          whiteMargin * markerSizeInPx,
          markerSizeInPx * (1 - 2 * whiteMargin),
          markerSizeInPx * (1 - 2 * whiteMargin)
        )

      // clear the area for innerImage (in case of transparent image)

      const innerRect = new createjs.Shape()

      innerRect
        .graphics
        .beginFill('white')
        .drawRect(
          innerMargin * markerSizeInPx,
          innerMargin * markerSizeInPx,
          markerSizeInPx * (1 - 2 * innerMargin),
          markerSizeInPx * (1 - 2 * innerMargin)
        )

      // // display innerImage in the middle
      // var innerImage = document.createElement('img')
      // innerImage.addEventListener('load', function(){
      //   // draw innerImage
      //   context.drawImage(innerImage,
      //     innerMargin * canvas.width,
      //     innerMargin * canvas.height,
      //     canvas.width * (1-2*innerMargin),
      //     canvas.height * (1-2*innerMargin)
      //   );
      //
      //   var imageUrl = canvas.toDataURL()
      //   onComplete(imageUrl)
      // })
      // innerImage.src = innerImageURL

      const textShape = new createjs.Text()

      // const container = new createjs.Container()

      // container.x = innerMargin * markerSizeInPx
      // container.y = innerMargin * markerSizeInPx

      // container.setBounds(
      //   innerMargin * markerSizeInPx,
      //   innerMargin * markerSizeInPx,
      //   markerSizeInPx * (1 - 2 * innerMargin),
      //   markerSizeInPx * (1 - 2 * innerMargin)
      // )

      textShape.font = `${isFontBold ? 'bold ' : ''}${isFontItalic ? 'italic ' : ''}${fontSizeInPx}px '${fontName}', 'Font Awesome 5 Free'`
      textShape.color = color
      textShape.text = text
      textShape.x = innerMargin * markerSizeInPx
      textShape.y = innerMargin * markerSizeInPx

      let textHeight = textShape.getMeasuredHeight()

      // textShape.textBaseline = 'bottom'
      //inner box bottom y
      textShape.y = (innerMargin * markerSizeInPx + markerSizeInPx * (1 - 2 * innerMargin)) - textHeight + 12 //+12 tested...

      // container.addChild(textShape)

      printWindow.document.body.appendChild(markerCanvas)

      stage.addChild(whiteRect)
      // stage.update()

      stage.addChild(borderShape)
      // stage.update()

      stage.addChild(innerRect)
      // stage.update()

      stage.addChild(textShape)

      //draw marker...
      stage.update()
    }

    const fontAwesomeRule = printWindow.document.createElement('link')
    fontAwesomeRule.rel = 'stylesheet'
    fontAwesomeRule.href = fontAwesomeLink

    //works but we use window onload if we have multiple...
    // fontAwesomeRule.onload = async function()  {}

    printWindow.document.head.append(fontAwesomeRule)
    printWindow.document.close()


  }

  public static async exportVariableIndicator(
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
    fillBackgroundColor: string | null,
    drawQrCode: boolean,
    printAndExportScale: number, //the default size is already optimized for A4 (one per page)
    format: 'svg' | 'png'
  ) {

    //reset for svg, scale is not important for svg
    printAndExportScale = format === 'svg' ? 1 : printAndExportScale

    let canvas = document.createElement('canvas')

    canvas.width = stageWidth * printAndExportScale
    canvas.height = stageHeight * printAndExportScale

    const scale = stageWidth / outerCircleDiameterInPx

    // canvas.style.width = stageWidth + 'px'
    // canvas.style.height = stageHeight + 'px'

    const stage = new createjs.Stage(canvas)

    stage.clear()

    // stage.scaleX = stageWidth / outerCircleDiameterInPx
    // stage.scaleY = stageHeight / outerCircleDiameterInPx

    //stage width??
    await VariableIndicatorDrawer.drawVariableIndicator(stage,
      outerCircleDiameterInPx, outerCircleDiameterInPx, outerCircleDiameterInPx, innerCircleDiameterInPx, numOfFields,
      innerText,
      isBoolVar,
      fontSizeInPx,
      fontName,
      variableIndicatorStrokeThickness,
      fillBackgroundColor,
      drawQrCode,
      printAndExportScale
    )

    stage.update()

    if (format === 'svg') {

      const exporter = new (window as any).SVGExporter(stage, stageWidth, stageHeight, false);
      exporter.stretchImages = true;
      exporter.run()
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(exporter.svg);

      const date = new Date(Date.now())
      let fileName = `export_${appProperties.exportFileNamePrefix}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}__${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.svg`

      const blob = new Blob([svgStr], {type: "image/svg+xml;charset=utf-8"});
      fileSaver.saveAs(blob, fileName)

    } else if (format === 'png') {

      const date = new Date(Date.now())
      let fileName = `export_${appProperties.exportFileNamePrefix}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}__${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.png`;

      (stage.canvas as HTMLCanvasElement).toBlob((blob: Blob) => {
        fileSaver.saveAs(blob, fileName)
      })

    }


  }

  /**
   * TODO maybe move this to IO helper?? but this needs many settings
   * exports the tile
   * @param tile
   * @param {ReadonlyArray<FieldSymbol>} fieldSymbols
   * @param {ReadonlyArray<ImgSymbol>} imgSymbols
   * @param {ReadonlyArray<LineSymbol>} lineSymbols
   * @param {boolean} drawGrid
   * @param {number} gridSizeInPx
   * @param {number} gridStrokeThicknessInPx
   * @param {string} gridStrokeColor
   * @param {WorldSettings} worldSettings
   * @param fillBackgroundColor null for transparent or the color for the background
   * @param format
   * @param printAndExportScale the scale e.g. to print one tile on A4 (default should be 1)
   * @param additionalBorderWidthInPx
   */
  public static exportTileAsLargeImg(
    tile: Tile,
    fieldSymbols: ReadonlyArray<FieldSymbol>,
    imgSymbols: ReadonlyArray<ImgSymbol>,
    lineSymbols: ReadonlyArray<LineSymbol>,
    drawGrid: boolean, gridSizeInPx: number, gridStrokeThicknessInPx: number, gridStrokeColor: string,
    worldSettings: WorldSettings,
    fillBackgroundColor: string | null,
    format: 'svg' | 'png',
    printAndExportScale: number,
    additionalBorderWidthInPx: number
  ) {

    //reset for svg, scale is not important for svg
    printAndExportScale = format === 'svg' ? 1 : printAndExportScale

    let canvas = document.createElement('canvas')

    canvas.style.width = `${tile.tileSettings.width * printAndExportScale}px`
    canvas.style.height = `${tile.tileSettings.height * printAndExportScale}px`

    canvas.width = tile.tileSettings.width * printAndExportScale
    canvas.height = tile.tileSettings.height * printAndExportScale

    const stage = this.printFullTile(
      tile,
      fieldSymbols,
      imgSymbols, lineSymbols,
      canvas,
      drawGrid, gridSizeInPx,
      gridStrokeThicknessInPx,
      gridStrokeColor,
      worldSettings,
      fillBackgroundColor,
      printAndExportScale,
      additionalBorderWidthInPx
    )

    if (format === 'svg') {

      const exporter = new (window as any).SVGExporter(stage, tile.tileSettings.width, tile.tileSettings.height, false);
      exporter.stretchImages = true;
      exporter.run()
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(exporter.svg);

      //dirty inject fontawesome font
      //note that the woff/woff2 file needs to be in the same folder for fontawesome icons to work in svg...
      const svgWithFontawesomeFont = svgStr.replace('<defs/>', fontAwesomeCssFontFaceDefForSvg)

      const date = new Date(Date.now())
      let fileName = `export_${appProperties.exportFileNamePrefix}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}__${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.svg`

      const blob = new Blob([svgWithFontawesomeFont], {type: "image/svg+xml;charset=utf-8"});
      fileSaver.saveAs(blob, fileName)

    } else if (format === 'png') {

      const date = new Date(Date.now())
      let fileName = `export_${appProperties.exportFileNamePrefix}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}__${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.png`;

      (stage.canvas as HTMLCanvasElement).toBlob((blob: Blob) => {
        fileSaver.saveAs(blob, fileName)
      })

    }


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
   * @param fillBackgroundColor null for transparent or the color for the background
   * @param format
   * @param printAndExportScale the scale e.g. to print one tile on A4 (default should be 1) (not for svg)
   * @param additionalBorderWidthInPx
   */
  public static exportWorldAsLargeImage(
    tileSurrogates: ReadonlyArray<WorldTileSurrogate>,
    tilesToPrint: ReadonlyArray<Tile>,
    fieldSymbols: ReadonlyArray<FieldSymbol>,
    imgSymbols: ReadonlyArray<ImgSymbol>,
    lineSymbols: ReadonlyArray<LineSymbol>,
    allTiles: ReadonlyArray<Tile>,
    drawGrid: boolean, gridSizeInPx: number, gridStrokeThicknessInPx: number, gridStrokeColor: string,
    worldSettings: WorldSettings,
    fillBackgroundColor: string | null,
    format: 'svg' | 'png',
    printAndExportScale: number,
    additionalBorderWidthInPx: number
  ) {

    //reset for svg
    printAndExportScale = format === 'svg' ? 1 : printAndExportScale

    const shouldPrintBorder = additionalBorderWidthInPx > 0

    const tilesWidth = tilesToPrint[0].tileSettings.width
    const tilesHeight = tilesToPrint[0].tileSettings.height

    const boundingBox = WorldTilesHelper.getWorldBoundingBox(tileSurrogates)
    const widthInTiles = boundingBox.maxX - boundingBox.minX + 1 //+1 max = min = 1 --> 0 but this is 1 tile
    const heightInTiles = boundingBox.maxY - boundingBox.minY + 1

    const fullGameWidth = widthInTiles * tilesWidth
    const fullGameHeight = heightInTiles * tilesHeight

    const fullGameCanvas = document.createElement('canvas') as HTMLCanvasElement

    fullGameCanvas.style.width = `${fullGameWidth * printAndExportScale}px`
    fullGameCanvas.style.height = `${fullGameWidth * printAndExportScale}px`

    fullGameCanvas.width = fullGameWidth * printAndExportScale
    fullGameCanvas.height = fullGameHeight * printAndExportScale

    const zIndexCache: ZIndexCache = {}

    const stage = new createjs.Stage(fullGameCanvas)

    stage.clear()

    stage.scaleX = printAndExportScale
    stage.scaleY = printAndExportScale
    stage.x = 0
    stage.y = 0

    const bgRects: Shape[] = []

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

        if (shouldPrintBorder) {
          //only tiles on the sides needs borders...

          //for quadratic games this is enough but we could have holes..
          // let hasTopBorder = j === 0
          // let hasRightBorder = i === widthInTiles - 1
          // let hasBottomBorder = j === heightInTiles - 1
          // let hasLeftBorder = i === 0

          //so overwrite

          const neighbors = this.hasNeighbors(i, j, tileSurrogates)

          //only draw border if we have no neighbor in the direction
          let hasTopBorder = neighbors[0] === false
          let hasRightBorder = neighbors[1] === false
          let hasBottomBorder = neighbors[2] === false
          let hasLeftBorder = neighbors[3] === false

          //note that borders are drawn from the middle of the coordinates
          //so for tiles on the sides we get only additionalPrintBorderWidthInPx / 2 widths...
          //make sure all widths are additionalPrintBorderWidthInPx / 2

          //some side tiles some borders can use the full width because they will be clipped to / 2 width
          let topWidth = j === 0 ? additionalBorderWidthInPx : additionalBorderWidthInPx / 2
          let rightWidth = i === widthInTiles - 1 ? additionalBorderWidthInPx : additionalBorderWidthInPx / 2
          let botWidth = j === heightInTiles - 1 ? additionalBorderWidthInPx : additionalBorderWidthInPx / 2
          let leftWidth = i === 0 ? additionalBorderWidthInPx : additionalBorderWidthInPx / 2

          //when the size was 5 we made all borders to be 2.5 px
          //but for the changed width borders we use 2.5px which would draw:  1.75 | 1.75 px
          //so we need to move the starting position a bit so we get: | 2.5 px where | is the border start
          //so we move by 2.5 / 2 --> additionalPrintBorderWidthInPx / 4
          let topAdjust = j === 0 ? 0 : additionalBorderWidthInPx / 4
          let rightAdjust = i === widthInTiles - 1 ? 0 : additionalBorderWidthInPx / 4
          let botAdjust = j === heightInTiles - 1 ? 0 : additionalBorderWidthInPx / 4
          let leftAdjust = i === 0 ? 0 : additionalBorderWidthInPx / 4

          graphics.drawBorder(
            stage,
            tilesWidth,
            tilesHeight,
            'black',
            i * tilesWidth,
            j * tilesHeight,
            [
              hasTopBorder,
              hasRightBorder,
              hasBottomBorder,
              hasLeftBorder
            ],
            [
              topWidth,
              rightWidth,
              botWidth,
              leftWidth
            ],
            [
              topAdjust,
              rightAdjust,
              botAdjust,
              leftAdjust,
            ]
          )
        }

        const tile = allTiles.find(p => p.guid === tileSurrogate.tileGuid)

        if (!tile) continue

        if (fillBackgroundColor) {
          let bgShape = new createjs.Shape()
          bgShape.graphics.beginFill(fillBackgroundColor)
            .drawRect(i * tilesWidth, j * tilesHeight, tilesWidth, tilesHeight)

          stage.addChild(bgShape)
          bgRects.push(bgShape)
        }

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
          false, false,
          null, null
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
          false, false,
          null, null
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

    for (const bgRect of bgRects) {
      stage.setChildIndex(bgRect, 0)
    }

    stage.update()

    if (format === "svg") {
      const exporter = new (window as any).SVGExporter(stage, fullGameWidth, fullGameHeight, false);
      exporter.stretchImages = true;
      exporter.run()
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(exporter.svg);

      //dirty inject fontawesome font
      //note that the woff/woff2 file needs to be in the same folder for fontawesome icons to work in svg...
      const svgWithFontawesomeFont = svgStr.replace('<defs/>', fontAwesomeCssFontFaceDefForSvg)

      const date = new Date(Date.now())
      let fileName = `export_${appProperties.exportFileNamePrefix}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}__${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.svg`

      const blob = new Blob([svgWithFontawesomeFont], {type: "image/svg+xml;charset=utf-8"});
      fileSaver.saveAs(blob, fileName)

    } else if (format === "png") {

      const date = new Date(Date.now())
      let fileName = `export_${appProperties.exportFileNamePrefix}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}__${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.png`;

      (stage.canvas as HTMLCanvasElement).toBlob((blob: Blob) => {
        fileSaver.saveAs(blob, fileName)
      })
    }


  }

  /**
   * used to print a (possibly large) tile,
   * normally called from the tile editor to print the (large) tile
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
   * @param fillBackgroundColor null for transparent or the color for the background
   * @param printAndExportScale the scale e.g. to print one tile on A4 (default should be 1)
   * @param additionalBorderWidthInPx the additional border (black) to print, <= 0 for none
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
                               langId: KnownLangs,
                               fillBackgroundColor: string | null,
                               printAndExportScale: number,
                               additionalBorderWidthInPx: number
  ) {

    //allow any print tile size
    // preferredSubTileWidth = Math.min(maxPrintTileWidth, preferredSubTileWidth)
    // preferredSubTileHeight = Math.min(maxPrintTileHeight, preferredSubTileHeight)

    const {html: boilerplateHtml1, idDataAttributeKey, idCheckboxDataAttributeKey, idCheckboxDataSetKey, fullCanvasClass} = this.getHtmlBoilerplate(
      !splitLargeTileForPrint,
      langId)

    const printWindow = window.open()
    printWindow.document.write(boilerplateHtml1)

    printWindow.onload = async () => {

      await ((printWindow.document as any).fonts.load("12px 'Font Awesome 5 Free'") as Promise<void>);
      await ((printWindow.document as any).fonts.load("bold 12px 'Font Awesome 5 Free'") as Promise<void>);

      const canvas = printWindow.document.createElement('canvas') as HTMLCanvasElement

      if (splitLargeTileForPrint) {
        canvas.classList.add(fullCanvasClass)
      }

      const dpi = 300
      let scaleFactor = dpi / 96;
      scaleFactor = 6

      scaleFactor = scaleFactor * printAndExportScale

      //the canvas size will be used as element size
      canvas.style.width = `${fullTileWidth * printAndExportScale}px`
      canvas.style.height = `${fillTileHeight * printAndExportScale}px`

      canvas.width = fullTileWidth * scaleFactor
      canvas.height = fillTileHeight * scaleFactor

      if (!drawGrid) {
        //we only draw border
        gridStrokeThicknessInPx = 2 //better for high dpi printing
      }

      const stage = this.printFullTile(tile, fieldSymbols, imgSymbols, lineSymbols, canvas, drawGrid, gridSizeInPx,
        gridStrokeThicknessInPx, gridStrokeColor, worldSettings, fillBackgroundColor, printAndExportScale, additionalBorderWidthInPx)

      //this is needed because we need to print with higher dpi (same canvas size is very high, scale matches it but the canvas size is as we expect it --> high dpi)
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

          pieceCanvas.style.width = `${preferredSubTileWidth * printAndExportScale}px`
          pieceCanvas.style.height = `${preferredSubTileHeight * printAndExportScale}px`

          pieceCanvas.width = preferredSubTileWidth * scaleFactor
          pieceCanvas.height = preferredSubTileHeight * scaleFactor

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


    }

    const fontAwesomeRule = printWindow.document.createElement('link')
    fontAwesomeRule.rel = 'stylesheet'
    fontAwesomeRule.href = fontAwesomeLink

    //works but we use window onload if we have multiple...
    // fontAwesomeRule.onload = async function()  {}

    printWindow.document.head.append(fontAwesomeRule)
    printWindow.document.close()

  }


  public static printFullTile(tile: Tile,
                              fieldSymbols: ReadonlyArray<FieldSymbol>,
                              imgSymbols: ReadonlyArray<ImgSymbol>,
                              lineSymbols: ReadonlyArray<LineSymbol>,
                              canvas: HTMLCanvasElement, drawGrid: boolean, gridSizeInPx: number, gridStrokeThicknessInPx: number, gridStrokeColor: string, worldSettings: WorldSettings,
                              fillBackgroundColor: string | null,
                              printAndExportScale: number,
                              additionalPrintBorderWidthInPx: number
  ): createjs.Stage {

    const zIndexCache: ZIndexCache = {}

    const stage = new createjs.Stage(canvas)

    stage.clear()

    stage.scaleX = printAndExportScale
    stage.scaleY = printAndExportScale
    stage.x = 0
    stage.y = 0

    // const width = canvas.width
    // const height = canvas.height

    //canvas size is larger for printing (scaled) so use the tile size

    const shouldPrintBorder = additionalPrintBorderWidthInPx > 0


    if (drawGrid && shouldPrintBorder === false) {
      graphics.drawGrid(stage, tile.tileSettings.width, tile.tileSettings.height, gridSizeInPx, gridStrokeThicknessInPx, gridStrokeColor, false,
        0, 0)
    } else if (drawGrid && shouldPrintBorder) {

      graphics.drawGrid(stage, tile.tileSettings.width, tile.tileSettings.height, gridSizeInPx, gridStrokeThicknessInPx, gridStrokeColor, false,
        0, 0)

      graphics.drawGrid(stage, tile.tileSettings.width, tile.tileSettings.height, gridSizeInPx, additionalPrintBorderWidthInPx, 'black', true,
        0, 0)
    } else if (!drawGrid && shouldPrintBorder) {
      graphics.drawGrid(stage, tile.tileSettings.width, tile.tileSettings.height, gridSizeInPx, additionalPrintBorderWidthInPx, 'black', true,
        0, 0)
    } else {
      //no grid, no border --> only draw grid color as border

      graphics.drawGrid(stage, tile.tileSettings.width, tile.tileSettings.height, gridSizeInPx, gridStrokeThicknessInPx, gridStrokeColor, true,
        0, 0)
    }


    graphics.drawFieldsOnTile(stage, tile.fieldShapes, [], [], null, null, null, zIndexCache, false, false,
      worldSettings,
      fieldSymbols, 0, 0, false, false,
      null, null
    )

    graphics.drawLinesOnTile(stage, tile.lineShapes, [], [], null, null, zIndexCache, worldSettings, lineSymbols, 0, 0,
      false)

    graphics.drawImagesOnTile(stage, tile.imgShapes, [], [], null, null, null, zIndexCache, worldSettings, imgSymbols,
      0, 0, false, false,
      null, null)


    for (const zIndex in zIndexCache) {
      const list = zIndexCache[zIndex]

      for (const child of list) {
        stage.setChildIndex(child, parseInt(zIndex))
      }
    }

    if (fillBackgroundColor) {
      let bgShape = new createjs.Shape()
      bgShape.graphics.beginFill(fillBackgroundColor)
        .drawRect(0, 0, canvas.width, canvas.height)

      stage.addChild(bgShape)
      stage.setChildIndex(bgShape, 0)
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
    fillBackgroundColor: string | null,
    drawQrCode: boolean,
    printAndExportScale: number
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

    scaleFactor = scaleFactor * printAndExportScale

    const canvas = printWindow.document.createElement('canvas') as HTMLCanvasElement

    canvas.style.width = `${stageWidth * printAndExportScale}px`
    canvas.style.height = `${stageHeight * printAndExportScale}px`

    canvas.width = stageWidth * scaleFactor
    canvas.height = stageHeight * scaleFactor

    const stage = new createjs.Stage(canvas)

    graphics.drawGrid(stage, stageWidth, stageHeight, 0, 1, borderStrokeColor, true, 0, 0)

    await VariableIndicatorDrawer.drawVariableIndicator(stage,
      stageWidth, stageHeight, outerCircleDiameterInPx, innerCircleDiameterInPx, numOfFields,
      innerText,
      isBoolVar,
      fontSizeInPx,
      fontName,
      variableIndicatorStrokeThickness,
      fillBackgroundColor,
      drawQrCode,
      printAndExportScale,
    )

    //this is needed because we need to print with higher dpi (same canvas size is very high, scale matches it but the canvas size is as we expect it --> high dpi)
    stage.scaleX = stage.scaleY = scaleFactor

    stage.update()
    printWindow.document.body.appendChild(canvas)
    printWindow.document.close()

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
   * @param {boolean} onlyWholeWorld only print the world as one image else print all tiles
   * @param outerCircleDiameterInPx
   * @param innerCircleDiameterInPx
   * @param expectTileWidth
   * @param expectedTileHeight
   * @param variableFontSizeInPx
   * @param variableFontName
   * @param variableIndicatorStrokeThickness
   * @param drawQrCode
   * @param fillBackgroundColor null for transparent or the color for the background
   * @param printAndExportScale the scale e.g. to print one tile on A4 (default should be 1)
   * @param additionalBorderWidthInPx the black border to add to the printed images
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
    drawQrCode: boolean,
    fillBackgroundColor: string | null,
    printAndExportScale: number,
    additionalBorderWidthInPx: number
  ): Promise<void> {


    //a tile could be used multiple times...

    const {html: boilerplateHtml1, idDataAttributeKey, idCheckboxDataAttributeKey, idCheckboxDataSetKey, fullCanvasClass} = this.getHtmlBoilerplate(
      onlyWholeWorld,
      langId)

    const printWindow = window.open()

    printWindow.document.write(boilerplateHtml1);

    //not fired...not even if placed before write
    // printWindow.document.onload = function ()  {}

    //we need to wait until everything is loaded (especially the fontawesome link)
    printWindow.onload = async () => {

      await ((printWindow.document as any).fonts.load("12px 'Font Awesome 5 Free'") as Promise<void>);
      await ((printWindow.document as any).fonts.load("bold 12px 'Font Awesome 5 Free'") as Promise<void>);

      const dpi = 300
      let scaleFactor = dpi / 96
      scaleFactor = 6

      scaleFactor = scaleFactor * printAndExportScale

      let printTileCount = 0
      const shouldPrintBorder = additionalBorderWidthInPx > 0

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

        fullGameCanvas.style.width = `${fullGameWidth * printAndExportScale}px`
        fullGameCanvas.style.height = `${fullGameHeight * printAndExportScale}px`

        fullGameCanvas.width = fullGameWidth * scaleFactor
        fullGameCanvas.height = fullGameHeight * scaleFactor

        const zIndexCache: ZIndexCache = {}

        const stage = new createjs.Stage(fullGameCanvas)

        stage.clear()

        stage.scaleX = 1
        stage.scaleY = 1
        stage.x = 0
        stage.y = 0

        const bgRects: Shape[] = []

        for (let i = 0; i < widthInTiles; i++) { // 0 ... width
          for (let j = 0; j < heightInTiles; j++) { // 0 ... height

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

            if (shouldPrintBorder) {
              //only tiles on the sides needs borders...

              //for quadratic games this is enough but we could have holes..
              // let hasTopBorder = j === 0
              // let hasRightBorder = i === widthInTiles - 1
              // let hasBottomBorder = j === heightInTiles - 1
              // let hasLeftBorder = i === 0

              //so overwrite

              const neighbors = this.hasNeighbors(i, j, tileSurrogates)

              //only draw border if we have no neighbor in the direction
              let hasTopBorder = neighbors[0] === false
              let hasRightBorder = neighbors[1] === false
              let hasBottomBorder = neighbors[2] === false
              let hasLeftBorder = neighbors[3] === false

              //note that borders are drawn from the middle of the coordinates
              //so for tiles on the sides we get only additionalPrintBorderWidthInPx / 2 widths...
              //make sure all widths are additionalPrintBorderWidthInPx / 2

              //some side tiles some borders can use the full width because they will be clipped to / 2 width
              let topWidth = j === 0 ? additionalBorderWidthInPx : additionalBorderWidthInPx / 2
              let rightWidth = i === widthInTiles - 1 ? additionalBorderWidthInPx : additionalBorderWidthInPx / 2
              let botWidth = j === heightInTiles - 1 ? additionalBorderWidthInPx : additionalBorderWidthInPx / 2
              let leftWidth = i === 0 ? additionalBorderWidthInPx : additionalBorderWidthInPx / 2

              //when the size was 5 we made all borders to be 2.5 px
              //but for the changed width borders we use 2.5px which would draw:  1.75 | 1.75 px
              //so we need to move the starting position a bit so we get: | 2.5 px where | is the border start
              //so we move by 2.5 / 2 --> additionalPrintBorderWidthInPx / 4
              let topAdjust = j === 0 ? 0 : additionalBorderWidthInPx / 4
              let rightAdjust = i === widthInTiles - 1 ? 0 : additionalBorderWidthInPx / 4
              let botAdjust = j === heightInTiles - 1 ? 0 : additionalBorderWidthInPx / 4
              let leftAdjust = i === 0 ? 0 : additionalBorderWidthInPx / 4

              graphics.drawBorder(
                stage,
                tilesWidth,
                tilesHeight,
                'black',
                i * tilesWidth,
                j * tilesHeight,
                [
                  hasTopBorder,
                  hasRightBorder,
                  hasBottomBorder,
                  hasLeftBorder
                ],
                [
                  topWidth,
                  rightWidth,
                  botWidth,
                  leftWidth
                ],
                [
                  topAdjust,
                  rightAdjust,
                  botAdjust,
                  leftAdjust,
                ]
              )
            }

            const tile = allTiles.find(p => p.guid === tileSurrogate.tileGuid)

            if (!tile) continue

            if (fillBackgroundColor) {
              let bgShape = new createjs.Shape()
              bgShape.graphics.beginFill(fillBackgroundColor)
                .drawRect(i * tilesWidth, j * tilesHeight, tilesWidth, tilesHeight)

              stage.addChild(bgShape)
              bgRects.push(bgShape)
            }

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
              false, false,
              null, null
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
              false, false,
              null, null
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

        for (const bgRect of bgRects) {
          stage.setChildIndex(bgRect, 0)
        }

        //this is needed because we need to print with higher dpi (same canvas size is very high, scale matches it but the canvas size is as we expect it --> high dpi)
        stage.scaleX = stage.scaleY = scaleFactor
        stage.update()

        printWindow.document.body.appendChild(fullGameCanvas)

      } else {
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

          canvas.style.width = `${fullTileWidth * printAndExportScale}px`
          canvas.style.height = `${fillTileHeight * printAndExportScale}px`

          canvas.width = fullTileWidth * scaleFactor
          canvas.height = fillTileHeight * scaleFactor

          if (!drawGrid) {
            //we only draw border
            gridStrokeThicknessInPx = 2 //better for high dpi printing
          }

          const stage = this.printFullTile(printTile, fieldSymbols, imgSymbols, lineSymbols, canvas, drawGrid,
            gridSizeInPx,
            gridStrokeThicknessInPx, gridStrokeColor, worldSettings, fillBackgroundColor, printAndExportScale, additionalBorderWidthInPx)

          //this is needed because we need to print with higher dpi (same canvas size is very high, scale matches it but the canvas size is as we expect it --> high dpi)
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
          } else {
            uniqueTiles.push(tile)
          }
        }

        const allVarDefs = LangHelper.getAllVarDefiningStatements(worldSettings.worldCmdText, uniqueTiles)

        const variableIndicatorWidth = outerCircleDiameterInPx //expectTileWidth
        const variableIndicatorHeight = outerCircleDiameterInPx //expectedTileHeight

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
            fillBackgroundColor,
            drawQrCode,
            printAndExportScale
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
            fillBackgroundColor,
            drawQrCode,
            printAndExportScale
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
              fillBackgroundColor,
              drawQrCode,
              printAndExportScale
            )

            printWindow.document.body.appendChild(wrapperDiv)
          }
        }

      }

    }


    const fontAwesomeRule = printWindow.document.createElement('link')
    fontAwesomeRule.rel = 'stylesheet'
    fontAwesomeRule.href = fontAwesomeLink

    //works but we use window onload if we have multiple...
    // fontAwesomeRule.onload = async function()  {}

    printWindow.document.head.append(fontAwesomeRule)
    printWindow.document.close()


  }

  /**
   *
   * @param printWindow
   * @param idDataAttributeKey
   * @param idCheckboxDataSetKey
   * @param uniqueIndex
   * @param scaleFactor already adjusted scale factor (e.g. 6 * printAndExportScale)
   * @param width
   * @param height
   * @param outerCircleDiameterInPx
   * @param innerCircleDiameterInPx
   * @param fontSizeInPx
   * @param fontName
   * @param entry
   * @param strokeThickness
   * @param fillBackgroundColor
   * @param drawQrCode
   * @param printAndExportScale
   */
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
                                            fillBackgroundColor: string | null,
                                            drawQrCode: boolean,
                                            printAndExportScale: number
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

    canvas.style.width = `${width * printAndExportScale}px`
    canvas.style.height = `${height * printAndExportScale}px`

    canvas.width = width * scaleFactor
    canvas.height = height * scaleFactor


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
        fillBackgroundColor,
        drawQrCode,
        printAndExportScale
      )
    } else if (isBoolVar(entry)) {
      await VariableIndicatorDrawer.drawVariableIndicator(stage,
        width, height,
        outerCircleDiameterInPx,
        innerCircleDiameterInPx,
        2,
        entry.ident,
        true,
        fontSizeInPx,
        fontName,
        strokeThickness,
        fillBackgroundColor,
        drawQrCode,
        printAndExportScale
      )
    }

    wrapperDiv.appendChild(checkboxDiv)
    wrapperDiv.appendChild(canvas)


    //this is needed because we need to print with higher dpi (same canvas size is very high, scale matches it but the canvas size is as we expect it --> high dpi)
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

    //do not add css link here else the document.write is not processed immediately e.g. printWindow.document.body is null

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

  /**
   * returns an array (css order, [0] top, [1] right, [2] bottom, [3] left) indicating if the tile has an neighbor in this direction
   * @param posInTilesX
   * @param posInTilesY
   * @param tileSurrogates
   */
  static hasNeighbors(posInTilesX: number, posInTilesY: number, tileSurrogates: ReadonlyArray<WorldTileSurrogate>): [boolean, boolean, boolean, boolean] {

    const topNeighbor = WorldTilesHelper.getTileFromPos(posInTilesX, posInTilesY - 1, tileSurrogates)

    const rightNeighbor = WorldTilesHelper.getTileFromPos(posInTilesX + 1, posInTilesY, tileSurrogates)

    const botNeighbor = WorldTilesHelper.getTileFromPos(posInTilesX, posInTilesY + 1, tileSurrogates)

    const leftNeighbor = WorldTilesHelper.getTileFromPos(posInTilesX - 1, posInTilesY, tileSurrogates)

    return [
      topNeighbor != null,
      rightNeighbor != null,
      botNeighbor != null,
      leftNeighbor != null,
    ]
  }

}

