import {
  ImgShape,
  FieldShape,
  BorderPoint,
  FieldSymbol,
  ImgSymbol,
  LineSymbol,
  LineShape
} from "./drawing";
import {WorldTileSurrogate} from "../../simulation/machine/machineState";
import {WorldSettings} from "../state/reducers/world/worldSettings/worldSettingsReducer";

/**
 * a surrogate for a real img
 * the id equals an id for a real
 * @see ImageAsset
 */
export interface ImageAssetSurrogate {
  /**
   * we now use the md5 hash of the base64 data to better identify equal images
   */
  readonly guid: string

  readonly originalName: string
  /**
   * the display name
   */
  readonly displayName: string

  readonly sizeInByte: number

  /**
   * the mime type
   */
  readonly mimeType: string

  readonly width: number
  readonly height: number

  /**
   * 0 is front, N is last
   */
  readonly displayIndex: number
}

/**
 * a real img with data
 */
export interface ImageAsset extends ImageAssetSurrogate {
  /**
   * for built in images this is the url (we can use this as img src)
   * for user imported imgs this is the base64 value
   *
   * easeljs can handle both
   */
  readonly base64: string
}


export enum MajorLineDirection {
  topToBottom = 0,
  bottomToTop = 1,
  leftToRight = 2,
  rightToLeft = 3
}


export interface TileSettings {


  readonly width: number

  readonly height: number

  /**
   * the tile name e.g. when there is no preview
   */
  readonly displayName: string

  /**
   * if one duplicates a field (or multiple) and the field text contains any number
   * the number is incremented this should also work for multiple
   * e.g. field 1, field2 selected --> duplicate --> field 3, field4
   */
  readonly autoIncrementFieldTextNumbersOnDuplicate: boolean

  /**
   * when fields intersect we normally don't want to connect them via lines (e.g. ladder game)
   */
  readonly insertLinesEvenIfFieldsIntersect: boolean

  readonly gridSizeInPx: number
  readonly showGrid: boolean
  readonly snapToGrid: boolean
  readonly showSequenceIds: boolean
  /**
   * true: when the point is moved the bezier control point is moved too
   * false: not
   */
  readonly moveBezierControlPointsWhenLineIsMoved: boolean

  /**
   * the preferred width to split the large tile into pieces
   * @see maxPrintTileWidth for max value
   */
  readonly printLargeTilePreferredWidthInPx: number
  /**
   * the preferred height to split the large tile into pieces
   * @see maxPrintTileHeight for max value
   */
  readonly printLargeTilePreferredHeightInPx: number

  /**
   * true: split the large tile
   * false: not (maybe when we want to just save the img?)
   *  this will display the image in the print tab as one image
   */
  readonly splitLargeTileForPrint: boolean


  /**
   * the start direction for generated lines (to know where start and end is of the line)
   */
  readonly majorLineDirection: MajorLineDirection

  /**
   * the lines where we would split the tile
   */
  readonly arePrintGuidesDisplayed: boolean

}

export interface TileProps {

  readonly guid: string

  readonly topBorderPoints: ReadonlyArray<BorderPoint>
  readonly botBorderPoints: ReadonlyArray<BorderPoint>
  readonly leftBorderPoints: ReadonlyArray<BorderPoint>
  readonly rightBorderPoint: ReadonlyArray<BorderPoint>

  /**
   * the fake start field ids used for single tile simulation only
   * we only allow one start field now (software wise) but for the future there could be more
   */
  readonly simulationStartFieldIds: ReadonlyArray<number>

  /**
   * the fake end field ids used for single tile simulation only
   * this is evaluated as a forced game_end field
   */
  readonly simulationEndFieldIds: ReadonlyArray<number>

  readonly tileSettings: TileSettings
}

export interface Tile extends TileProps {


  /**
   * only for design
   */
  readonly imgShapes: ReadonlyArray<ImgShape>

  /**
   * all shapes with commands on the tile
   */
  readonly fieldShapes: ReadonlyArray<FieldShape>

  /**
   * all arrows on the tile
   */
  readonly lineShapes: ReadonlyArray<LineShape>
}


export interface World {
  readonly name: string
  readonly tiles: ReadonlyArray<Tile>
}

export interface SomeExport {
  /**
   * program version
   */
  readonly editorVersion: string
  readonly editorName: string
}

export interface ExportTile extends SomeExport {

  readonly tile: Tile
  readonly imgStorage: ImageAsset[]

  //--- symbols
  readonly fieldSymbols: ReadonlyArray<FieldSymbol>
  readonly imgSymbols: ReadonlyArray<ImgSymbol>
  readonly lineSymbols: ReadonlyArray<LineSymbol>

}


export interface ExportWorld extends SomeExport {

  readonly worldSettings: WorldSettings

  /**
   * all tiles in the tiles library
   */
  readonly allTiles: ReadonlyArray<Tile>

  readonly worldTiles: ReadonlyArray<WorldTileSurrogate>

  /**
   * the stored img assets
   */
  readonly imgStorage: ImageAsset[]

  //--- symbols
  readonly fieldSymbols: ReadonlyArray<FieldSymbol>
  readonly imgSymbols: ReadonlyArray<ImgSymbol>
  readonly lineSymbols: ReadonlyArray<LineSymbol>
}




export interface VariableIndicatorQrCodeData {
  readonly version: number
  readonly qrType: 'varInd'
  /**
   * outer circle diameter
   */
  readonly oDiam: number,
  /**
   * inner circle diameter
   */
  readonly iDiam: number,
  /**
   * numOfFields
   */
  readonly fields: number,
  /**
   * inner text
   */
  readonly text: string,
  /**
   * fontSizeInPx
   */
  readonly fSize: number,
  /**
   * fontName
   */
  readonly fName: string,
}













