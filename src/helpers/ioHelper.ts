import {ExportTile, ExportWorld, ImageAsset, Tile} from "../types/world";
import globalState from "../state/state";
import fileSaver = require("file-saver");
import {ImgStorage} from "../externalStorage/imgStorage";
import {appProperties, tileFileExtensionWithoutDot, worldFileExtensionWithoutDot} from "../constants";
import {set_tileLibrary_possibleTiles} from "../state/reducers/world/tileLibrary/actions";
import {set_fieldSymbols} from "../state/reducers/tileEditor/symbols/fieldSymbols/actions";
import {set_imgSymbols} from "../state/reducers/tileEditor/symbols/imgSymbols/actions";
import {set_lineSymbols} from "../state/reducers/tileEditor/symbols/lineSymbols/actions";
import {FieldSymbol, ImgSymbol, LineSymbol} from "../types/drawing";
import {imgLibrary_addImg} from "../state/reducers/imgLibrary/actions";
import {set_world_tiles} from "../state/reducers/world/tileSurrogates/actions";
import {MigrationHelper} from "./MigrationHelpers";
import {Logger} from "./logger";
import {
  replace_worldSettings,
  set_world_expectedTileHeight,
  set_world_expectedTileWidth, set_world_printGameAsOneImageAction, set_world_timeInS_advancePlayerAction,
  set_world_timeInS_choose_bool_funcAction,
  set_world_timeInS_expr_comparisonAction,
  set_world_timeInS_expr_conjunctionAction,
  set_world_timeInS_expr_disjunctionAction,
  set_world_timeInS_expr_factorAction, set_world_timeInS_expr_primary_constantAction,
  set_world_timeInS_expr_primary_identAction,
  set_world_timeInS_expr_primary_incrementOrDecrementAction,
  set_world_timeInS_expr_primary_leftStepsAction,
  set_world_timeInS_expr_relationAction,
  set_world_timeInS_expr_sumAction,
  set_world_timeInS_expr_termAction,
  set_world_timeInS_gotoAction,
  set_world_timeInS_rollbackAction, set_world_timeInS_rollDiceAction,
  set_world_timeInS_set_varAction,
  set_world_timeInS_var_declAction,
  set_world_worldCmdTextAction, set_world_worldHeightInTiles, set_world_worldWidthInTiles
} from "../state/reducers/world/worldSettings/actions";
import {WorldSettings} from "../state/reducers/world/worldSettings/worldSettingsReducer";


export class IoHelper {
  private constructor() {
  }


  public static exportTile(tile: Tile):
    void {

    //only export used symbols
    const allFieldSymbols = globalState.getState().fieldSymbolState.present
    const fieldShapeWithSymbol = tile.fieldShapes.filter(p => p.createdFromSymbolGuid !== null)

    const usedFieldSymbols: FieldSymbol[] = []

    for (const fieldWithSymbol of fieldShapeWithSymbol) {

      let found = false

      for (const symbol of allFieldSymbols) {
        if (fieldWithSymbol.createdFromSymbolGuid === symbol.guid) {

          found = true
          usedFieldSymbols.push(symbol)
          break
        }

        if (!found) {
          const msg = `could not find field symbol with guid: ${fieldWithSymbol.createdFromSymbolGuid}`
          Logger.fatal(msg)
          throw new Error(msg)
        }
      }
    }

    const allImgSymbols = globalState.getState().imgSymbolState.present
    const imgShapeWithSymbol = tile.imgShapes.filter(p => p.createdFromSymbolGuid !== null)

    const usedImgSymbols: ImgSymbol[] = []

    for (const imgWithSymbol of imgShapeWithSymbol) {
      for (const symbol of allImgSymbols) {

        let found = false

        if (imgWithSymbol.createdFromSymbolGuid === symbol.guid) {

          found = true
          usedImgSymbols.push(symbol)
          break
        }

        if (!found) {
          const msg = `could not find img symbol with guid: ${imgWithSymbol.createdFromSymbolGuid}`
          Logger.fatal(msg)
          throw new Error(msg)
        }
      }
    }

    const allLineSymbols = globalState.getState().lineSymbolState.present
    const lineShapeWithSymbol = tile.lineShapes.filter(p => p.createdFromSymbolGuid !== null)

    const usedLineSymbols: LineSymbol[] = []

    for (const lineWithSymbol of lineShapeWithSymbol) {
      for (const symbol of allLineSymbols) {

        let found = false

        if (lineWithSymbol.createdFromSymbolGuid === symbol.guid) {

          found = true
          usedLineSymbols.push(symbol)
          break
        }

        if (!found) {
          const msg = `could not find img symbol with guid: ${lineWithSymbol.createdFromSymbolGuid}`
          Logger.fatal(msg)
          throw new Error(msg)
        }
      }
    }

    //only export used images
    const usedRealImages: ImageAsset[] = []

    //for field the background could be an image
    for (const fieldShape of tile.fieldShapes) {
      if (!fieldShape.backgroundImgGuid) continue

      const imgAsset = ImgStorage.getImgFromGuid(fieldShape.backgroundImgGuid)

      //no error because we maybe add later an img with this guid (because it's the md5 hash of the img)
      //so the user could repair this
      if (!imgAsset) continue

      if (usedRealImages.some(p => p.guid === imgAsset.guid)) {
        //only add once
        continue
      }

      usedRealImages.push(imgAsset)
    }

    for (const imgShape of tile.imgShapes) {
      if (!imgShape.imgGuid) continue

      const imgAsset = ImgStorage.getImgFromGuid(imgShape.imgGuid)

      //no error because we maybe add later an img with this guid (because it's the md5 hash of the img)
      //so the user could repair this
      if (!imgAsset) continue

      if (usedRealImages.some(p => p.guid === imgAsset.guid)) {
        //only add once
        continue
      }

      usedRealImages.push(imgAsset)
    }

    const exportTile: ExportTile = {
      editorVersion: appProperties.version,
      editorName: appProperties.appName,
      tile: tile,
      fieldSymbols: usedFieldSymbols,
      imgSymbols: usedImgSymbols,
      lineSymbols: usedLineSymbols,
      imgStorage: usedRealImages,
    }

    const value = JSON.stringify(exportTile, null, "\t")

    // noinspection TsLint
    const date = new Date(Date.now())
    let fileName = `export_${appProperties.exportFileNamePrefix}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}__${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.${tileFileExtensionWithoutDot}`

    const blob = new Blob([value], {type: "application/json;charset=utf-8"});
    fileSaver.saveAs(blob, fileName)

  }

  public static importTile(data: string): void {

    let exportedTile: ExportTile | null = JSON.parse(data)

    //maybe we need to migrate...
    exportedTile = MigrationHelper.applyMigrationsToTile(exportedTile)

    if (exportedTile === null) {
      //error is already displayed in MigrationHelper.applyMigrationsToTile
      return
    }

    //the fields are stored in separate reducers...
    const tile: Tile = {
      guid: exportedTile.tile.guid,
      topBorderPoints: exportedTile.tile.topBorderPoints,
      botBorderPoints: exportedTile.tile.botBorderPoints,
      leftBorderPoints: exportedTile.tile.leftBorderPoints,
      rightBorderPoint: exportedTile.tile.rightBorderPoint,
      fieldShapes: exportedTile.tile.fieldShapes,
      imgShapes: exportedTile.tile.imgShapes,
      lineShapes: exportedTile.tile.lineShapes,
      simulationStartFieldIds: exportedTile.tile.simulationStartFieldIds,
      simulationEndFieldIds: exportedTile.tile.simulationEndFieldIds,
      tileSettings: {
        displayName: exportedTile.tile.tileSettings.displayName,
        width: exportedTile.tile.tileSettings.width,
        height: exportedTile.tile.tileSettings.height,
        majorLineDirection: exportedTile.tile.tileSettings.majorLineDirection,
        gridSizeInPx: exportedTile.tile.tileSettings.gridSizeInPx,
        showGrid: exportedTile.tile.tileSettings.showGrid,
        snapToGrid: exportedTile.tile.tileSettings.snapToGrid,
        showSequenceIds: exportedTile.tile.tileSettings.showSequenceIds,
        moveBezierControlPointsWhenLineIsMoved: exportedTile.tile.tileSettings.moveBezierControlPointsWhenLineIsMoved,
        arePrintGuidesDisplayed: exportedTile.tile.tileSettings.arePrintGuidesDisplayed,
        autoIncrementFieldTextNumbersOnDuplicate: exportedTile.tile.tileSettings.autoIncrementFieldTextNumbersOnDuplicate,
        printLargeTilePreferredWidthInPx: exportedTile.tile.tileSettings.printLargeTilePreferredWidthInPx,
        printLargeTilePreferredHeightInPx: exportedTile.tile.tileSettings.printLargeTilePreferredHeightInPx,
        splitLargeTileForPrint: exportedTile.tile.tileSettings.splitLargeTileForPrint,
        insertLinesEvenIfFieldsIntersect: exportedTile.tile.tileSettings.insertLinesEvenIfFieldsIntersect
      }
    }

    const allTiles = globalState.getState().tileLibraryState.possibleTiles

    //check if we already have the tile...
    if (allTiles.find(p => p.guid === tile.guid)) {
      Logger.message(`tile was already in library and was not imported, guid: ${tile.guid}`)
      return
    }

    //only add new imgs

    for (const img of exportedTile.imgStorage) {
      const oldImg = ImgStorage.images.find(p => p.guid === img.guid)

      if (oldImg) {
        //TODO warn??
        continue
      }

      const surrogate = ImgStorage.addImg(img)
      globalState.dispatch(imgLibrary_addImg(surrogate))
    }

    //only add new symbols

    //--- fields
    const fieldSymbols = globalState.getState().fieldSymbolState.present
    let fieldSymbolsToImport: FieldSymbol[] = []
    for (const importFieldSymbol of exportedTile.fieldSymbols) {

      const oldSymbol = fieldSymbols.find(p => p.guid == importFieldSymbol.guid)

      if (oldSymbol) {
        //TODO display warning?? ... us old symbol --> no import
        continue
      }
      fieldSymbolsToImport.push(importFieldSymbol)
    }
    globalState.dispatch(set_fieldSymbols(fieldSymbols.concat(fieldSymbolsToImport)))


    //--- images
    const imgSymbols = globalState.getState().imgSymbolState.present
    let imgSymbolsToImport: ImgSymbol[] = []
    for (const importImgSymbol of exportedTile.imgSymbols) {
      const oldSymbol = imgSymbols.find(p => p.guid == importImgSymbol.guid)

      if (oldSymbol) {
        //TODO display warning?? ... us old symbol --> no import
        continue
      }
      imgSymbolsToImport.push(importImgSymbol)
    }

    globalState.dispatch(set_imgSymbols(imgSymbols.concat(imgSymbolsToImport)))


    //--- lines
    const lineSymbols = globalState.getState().lineSymbolState.present
    let lineSymbolsToImport: LineSymbol[] = []

    for (const importLineSymbol of exportedTile.lineSymbols) {
      const oldSymbol = lineSymbols.find(p => p.guid == importLineSymbol.guid)

      if (oldSymbol) {
        //TODO display warning?? ... us old symbol --> no import
        continue
      }
      lineSymbolsToImport.push(importLineSymbol)
    }
    globalState.dispatch(set_lineSymbols(lineSymbols.concat(lineSymbolsToImport)))


    globalState.dispatch(set_tileLibrary_possibleTiles(allTiles.concat(tile)))

  }


  public static exportWorld(): void {

    const exportWorld: ExportWorld = {
      editorName: appProperties.appName,
      editorVersion: appProperties.version,

      allTiles: globalState.getState().tileLibraryState.possibleTiles,

      fieldSymbols: globalState.getState().fieldSymbolState.present,
      imgSymbols: globalState.getState().imgSymbolState.present,
      lineSymbols: globalState.getState().lineSymbolState.present,

      worldSettings: globalState.getState().worldSettingsState,

      worldTiles: globalState.getState().tileSurrogateState.present,

      imgStorage: ImgStorage.images,
    }

    //TODO only export used imgs??

    const value = JSON.stringify(exportWorld, null, "\t")

    const date = new Date(Date.now())
    let fileName = `export_${appProperties.exportFileNamePrefix}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}__${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.${worldFileExtensionWithoutDot}`

    const blob = new Blob([value], {type: "application/json;charset=utf-8"});
    fileSaver.saveAs(blob, fileName)
  }

  public static importWorld(data: string): void {

    let exportedWorld: ExportWorld | null = JSON.parse(data)

    //maybe we need to migrate...
    exportedWorld = MigrationHelper.applyMigrationsToWorld(exportedWorld)

    if (exportedWorld === null) {
      //error is already displayed in MigrationHelper.applyMigrationsToTile
      return
    }

    //TODO maybe check if valid??

    ImgStorage.images = exportedWorld.imgStorage

    globalState.dispatch(set_fieldSymbols(exportedWorld.fieldSymbols))
    globalState.dispatch(set_imgSymbols(exportedWorld.imgSymbols))
    globalState.dispatch(set_lineSymbols(exportedWorld.lineSymbols))


    globalState.dispatch(set_tileLibrary_possibleTiles(exportedWorld.allTiles))


    const newWorldSettings = overwriteWorldSettings(globalState.getState().worldSettingsState, exportedWorld.worldSettings)

    globalState.dispatch(replace_worldSettings(newWorldSettings))

    globalState.dispatch(set_world_tiles(exportedWorld.worldTiles))


  }

}

/**
 * dispatches events to set all options in the state from the given world settings
 * only take settings we know so we can drop unknown ones
 * @param {WorldSettings} currentWorldSettings
 * @param {WorldSettings} loadedWorldSettings these might have more/less props
 * @returns {WorldSettings}
 */
export function overwriteWorldSettings(currentWorldSettings: WorldSettings, loadedWorldSettings: WorldSettings): WorldSettings {

  const keys = Object.keys(currentWorldSettings)
  const copy = {...currentWorldSettings} //remember this does only a shallow copy

  for (const key of keys) {

    if (loadedWorldSettings[key] === undefined) {
      continue
    }
    //let's hope for equal types
    copy[key] = loadedWorldSettings[key]
  }


  Logger.log('overwrote world settings')
  return copy
}
