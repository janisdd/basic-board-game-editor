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

export interface TileProps {

  readonly width: number

  readonly height: number

  /**
   * the tile name e.g. when there is no preview
   */
  readonly displayName: string

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
}

export interface Tile extends TileProps {

  readonly guid: string

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

  readonly worldWidthInTiles: number
  readonly worldHeightInTiles: number

  /**
   * used to draw the empty tiles grid
   */
  readonly expectedTileWidth: number
  /**
   * used to draw the empty tiles grid
   */
  readonly expectedTileHeight: number

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


















