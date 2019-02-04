import {DefinitionTable, PlayerObj} from "../simulation/machine/machineState";


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
 * r,g,b (,alpha) or h,s,v ...
 */
export type CvScalar = [number, number, number, number?]

export interface CvToken {
  bbox: CvRect
  /**
   * hsv color, only 3 items used
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
  playerId: number
  tokenId: number

  tileGuid: string
  fieldId: number
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
}


