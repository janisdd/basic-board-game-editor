import {FieldShape, FieldSymbol, ImgSymbol, LineSymbol} from "../types/drawing";
import {Tile} from "../types/world";
import * as graphics from "../../graphics/graphicsCore";
import {WorldSettings} from "../state/reducers/world/worldSettings/worldSettingsReducer";
import {FieldAbsolutePosition} from "./worldTilesHelper";
import {PrintHtmlHelper} from "./printHtmlHelper";
import {PrintHelper} from "./printHelper";


export class WorldUnitToImgHelper {
  private constructor() {
  }


  public static fieldByAbsPosToImg(fieldAbsolutePosition: FieldAbsolutePosition,
                                   allTiles: ReadonlyArray<Tile>,
                                   fieldSymbols: ReadonlyArray<FieldSymbol>,
                                   worldSettings: WorldSettings,
                                   canvas: HTMLCanvasElement): HTMLCanvasElement | null {

    const tile = allTiles.find(p => p.guid === fieldAbsolutePosition.tileGuid)

    if (!tile) return null

    const fieldShape = tile.fieldShapes.find(p => p.id === fieldAbsolutePosition.fieldId)

    if (!fieldShape) return null


    return WorldUnitToImgHelper.fieldToImg(fieldShape, fieldSymbols, worldSettings, canvas)
  }

  public static fieldByAbsolutePosToImg(fieldId: number, tileGuid: string,
                                        allTiles: ReadonlyArray<Tile>,
                                        fieldSymbols: ReadonlyArray<FieldSymbol>,
                                        worldSettings: WorldSettings,
                                        canvas: HTMLCanvasElement): HTMLCanvasElement | null {

    const tile = allTiles.find(p => p.guid === tileGuid)

    if (!tile) return null

    const fieldShape = tile.fieldShapes.find(p => p.id === fieldId)

    if (!fieldShape) return null


    return WorldUnitToImgHelper.fieldToImg(fieldShape, fieldSymbols, worldSettings, canvas)
  }

  public static fieldByIdToImg(fieldId: number, tile: Tile, fieldSymbols: ReadonlyArray<FieldSymbol>,
                               worldSettings: WorldSettings,
                               canvas: HTMLCanvasElement): HTMLCanvasElement | null {

    const fieldShape = tile.fieldShapes.find(p => p.id === fieldId)

    if (!fieldShape) return null


    return WorldUnitToImgHelper.fieldToImg(fieldShape, fieldSymbols, worldSettings, canvas)

  }

  public static fieldToImg(field: FieldShape, fieldSymbols: ReadonlyArray<FieldSymbol>,
                           worldSettings: WorldSettings,
                           canvas: HTMLCanvasElement): HTMLCanvasElement | null {

    let symbol: FieldSymbol | null = null

    if (field.createdFromSymbolGuid !== null) {

      symbol = fieldSymbols.find(p => p.guid === field.createdFromSymbolGuid)

      if (!symbol) return null

    }


    const fieldWidth = symbol && symbol.overwriteWidth
      ? symbol.width
      : field.width

    const fieldHeight = symbol && symbol.overwriteHeight
      ? symbol.height
      : field.height

    canvas.style.width = `${fieldWidth}px`
    canvas.style.height = `${fieldHeight}px`

    canvas.width = fieldWidth
    canvas.height = fieldHeight

    const stage = new createjs.Stage(canvas)


    //we need to use negative offset else we would draw the field relative to tile coords...

    graphics.drawFieldsOnTile(stage, [field], [], [], null, null, null, {}, false, false,
      worldSettings,
      fieldSymbols, -field.x, -field.y, false, false,
      null, null
    )

    stage.update()

    return canvas
  }


  /**
   * converts a tile (by guid) to an image (canvas)
   *
   * note when you want high dpi you need to set the canvas.style.width/height to the tile size (tile.tileSettings.width)
   * when you insert the canvas into the page because the canvas.style.width is the real size (not the width/height canvas attribute)
   * so e.g. you can set the worldSettings.printAndExportScale to 6 and then set canvas.style.width/height to the real tile size
   * you get the tile size * 6 pixels into an area of canvas.style.width/height --> higher dpi (good for e.g. printing)
   * @param tileGuid
   * @param allTiles
   * @param fieldSymbols
   * @param imgSymbols
   * @param lineSymbols
   * @param worldSettings
   * @param canvas
   * @param fillBackgroundColor
   */
  public static tileByGuidToImg(tileGuid: string,
                                allTiles: ReadonlyArray<Tile>,
                                fieldSymbols: ReadonlyArray<FieldSymbol>,
                                imgSymbols: ReadonlyArray<ImgSymbol>,
                                lineSymbols: ReadonlyArray<LineSymbol>,
                                worldSettings: WorldSettings,
                                canvas: HTMLCanvasElement,
                                fillBackgroundColor: string | null = null): HTMLCanvasElement | null {

    const tile = allTiles.find(p => p.guid === tileGuid)

    if (!tile) return null


    return WorldUnitToImgHelper.tileToImg(tile, fieldSymbols, imgSymbols, lineSymbols, worldSettings, canvas, fillBackgroundColor)
  }


  /**
   * converts a tile to an image (canvas)
   *
   * note when you want high dpi you need to set the canvas.style.width/height to the tile size (tile.tileSettings.width)
   * when you insert the canvas into the page because the canvas.style.width is the real size (not the width/height canvas attribute)
   * so e.g. you can set the worldSettings.printAndExportScale to 6 and then set canvas.style.width/height to the real tile size
   * you get the tile size * 6 pixels into an area of canvas.style.width/height --> higher dpi (good for e.g. printing)
   * @param tile
   * @param fieldSymbols
   * @param imgSymbols
   * @param lineSymbols
   * @param worldSettings
   * @param canvas
   * @param fillBackgroundColor
   */
  public static tileToImg(tile: Tile,
                          fieldSymbols: ReadonlyArray<FieldSymbol>,
                          imgSymbols: ReadonlyArray<ImgSymbol>,
                          lineSymbols: ReadonlyArray<LineSymbol>,
                          worldSettings: WorldSettings,
                          canvas: HTMLCanvasElement,
                          fillBackgroundColor: string | null): HTMLCanvasElement | null {


    canvas.style.width = `${tile.tileSettings.width * worldSettings.printAndExportScale}px`
    canvas.style.height = `${tile.tileSettings.height * worldSettings.printAndExportScale}px`

    canvas.width = tile.tileSettings.width * worldSettings.printAndExportScale
    canvas.height = tile.tileSettings.height * worldSettings.printAndExportScale

    PrintHelper.printFullTile(tile, fieldSymbols, imgSymbols, lineSymbols, canvas,
      false,
      tile.tileSettings.gridSizeInPx,
      worldSettings.gridStrokeThicknessInPx,
      worldSettings.gridStrokeColor,
      worldSettings,
      fillBackgroundColor,
      worldSettings.printAndExportScale,
      worldSettings.additionalBorderWidthInPx
    )

    return canvas
  }

}