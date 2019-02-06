import {
  DefinitionTable,
  DefinitionTableBoolEntry,
  DefinitionTableIntEntry,
  PlayerObj
} from "../simulation/machine/machineState";
import {Tile} from "../src/types/world";


export interface CvRect {
  x: number
  y: number
  width: number
  height: number
}


export interface CvPoint {
  x: number
  y: number
}

/**
 * r,g,b (,alpha) or h,s,v ... (h is between 0-360??,  s,v is between 0-256
 */
export type CvScalar = [number, number, number, number]

export interface CvToken {
  bbox: CvRect
  /**
   * hsv color, only 3 items used (0-256)
   */
  color: CvScalar
  /**
   * we swapped indices... its actually BGR when we get it from opencv js ... maybe recompile
   */
  colorRgb: CvScalar
  bottomPoint: CvPoint

}


export interface CvKeyPoint {
  pt: CvPoint
  size: number
  angle: number

  //not important props are missing
}


export interface CvDice {

  /**
   * int
   */
  value: number

  centerPoint: CvPoint

  pips: CvKeyPoint[]

  /**
   * top left pip
   */
  topLeftPip: CvKeyPoint

  /**
   * bottom left pip (or is it right?)
   */
  bottomLeftPip: CvKeyPoint

}



export interface TokenPosition {
  playerId: number | null
  tokenId: number

  tileGuid: string
  /**
   * if we get multiple for the same token on the same tile use the smallest dist
   */
  distToFieldCenterInPx: number
  fieldId: number
  /**
   * just for debug
   */
  fieldText: string
}

export interface VarIndicatorTokenPosition {
  playerId: number | null
  tokenId: number


  /**
   * the clockwise index of the field with the given angle
   * where index 0 is the first field (right)!
   */
  index: number
  value: number
}


export interface CvRealMachineState {

  readonly globalDefTable: DefinitionTable


  readonly tokenPositions: TokenPosition[]
  /**
   * one entry for every player
   */
  readonly players: PlayerObj[]

  // //indices for the playerDefTables
  // readonly currentPlayerIndex: number
  // readonly previousPlayerIndex: number
  // readonly nextPlayerIndex: number
  //
  // readonly currentPlayerActiveTokenIndex: number

  /**
   * the rolled dice value
   * can be larger than 6 if specified by the game
   */
  readonly rolledDiceValue: number

  // /**
  //  * the winners ordered
  //  */
  // readonly winnersIds: number[]

}


export interface HomographyTuple {
  synToRealMat: any
  realToSynMat: any
  tile: Tile
  syntheticImgMat: any
  /**
   * the real world pos
   */
  tileRect: CvRect
}

export interface HomographyVarIndicatorTuple {
  synToRealMat: any
  realToSynMat: any
  entry: DefinitionTableBoolEntry | DefinitionTableIntEntry
  syntheticImgMat: any
  /**
   * the real world pos
   */
  indicatorRect: CvRect
}

export interface SyntheticImgTuple {
  canvas: HTMLCanvasElement
  tile: Tile
}

export interface SyntheticVarTuple {
  canvas: HTMLCanvasElement
  entry: DefinitionTableBoolEntry | DefinitionTableIntEntry
}

