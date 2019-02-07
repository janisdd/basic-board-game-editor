import {ExpressionUnit} from "../model/executionUnit";

/**
 * the world only stores this surrogate, the real tile is in the library
 */
export interface WorldTileSurrogate {
  /**
   * the x pos in tiles, zero-based, top left is 0,0
   */
  readonly x: number
  /**
   * the y pos tiles, zero-based, , top left is 0,0
   */
  readonly y: number

  readonly tileGuid: string
}

export interface WorldSimulationPosition {
  readonly tileGuid: string
  readonly fieldId: number
}

export interface MachineState {

  readonly globalDefTable: DefinitionTable

  /**
   * one entry for every player
   */
  readonly players: PlayerObj[]

  //indices for the playerDefTables
  readonly currentPlayerIndex: number
  readonly previousPlayerIndex: number
  readonly nextPlayerIndex: number

  readonly currentPlayerActiveTokenIndex: number

  /**
   * if we roll the dice we get a value between 1 and maxDiceValue
   */
  readonly maxDiceValue: number

  /**
   * the rolled dice value
   * can be larger than 6 if specified by the game
   */
  readonly rolledDiceValue: number

  /**
   * every goto should decrement this (if a player advances one field)
   */
  readonly leftDiceValue: number

  /**
   * global game end condition
   * the current player should be part of it because the current player will
   * win when this condition is met
   */
  readonly gameEndCondition: ExpressionUnit | null

  /**
   * the state for the rollback function usually the state at start of the player round
   * or null (if no previous state)
   */
  readonly rollbackState: MachineState | null

  /**
   * if true we rolled back and should not execute any code on the current field
   * because that's the field we started off
   */
  readonly wasStateRolledBack: boolean

  /**
   * the winners ordered
   */
  readonly winnersIds: number[]

  /**
   * the elapsed time in seconds
   * every command can increase this counter
   */
  readonly elapsedTimeInS: number
}


export interface PlayerObj {
  readonly id: number
  readonly color: string
  readonly name: string

  /**
   * all tokens of the player
   */
  readonly tokens: ReadonlyArray<PlayerToken>


  /**
   * if this player needs to suspend this is the value of rounds still to suspend
   * if 0 all ok
   * if > 0 then if this player is the next time the current player he is skipped (no action)
   */
  readonly suspendCounter: number

  /**
   * this is the def table for the player vars (like this.X in java), these are defined in the game init code (in the world)
   *
   * when we use this.X we use this prop when we just use X we check the local scopes first
   * also see simulation/__tests__/semantic/statements/builtInFuncs/scopes.ts (in tests for the difference between local and player vars
   * player vars are like this.X (cp.X) where normal X is a local var for the player in the current scope
   */
  readonly defTable: DefinitionTable

  /**
   * if we open a new scope we push a new def table here
   * if we close a scope pop the last def table
   *
   * the current scope is always the last def table
   * note that we have a default function scope
   *  @see AbstractMachine.createNewMachineState
   *  if we are in the default (0) scope vars can be in localDefTables or defTable
   */
  readonly localDefTables: ReadonlyArray<DefinitionTableWrapper>

  /**
   * stores the last returned value by
   * @see SetReturnResultUnit
   * if int not bound by anything...
   *
   * undefined only if not assigned
   */
  readonly lastReturnedValue: boolean | number | undefined
}

//[ger: spielstein]
export interface PlayerToken {
  readonly name: string
  readonly color: string

  /**
   * the pos on a tile
   */
  readonly fieldId: number | null
  /**
   * the tile guid
   */
  readonly tileGuid: string | null


  /**
   * all previous positions of the player token
   *
   * don't store tile border points else we would need to handle them separately when moving back (tile transitions)
   */
  readonly previousPositions: ReadonlyArray<WorldSimulationPosition>
}

/**
 * a wrapper with some meta data for the def table
 */
export interface DefinitionTableWrapper {

  readonly isScopeLimited: boolean

  readonly defTable: DefinitionTable

  readonly [id: string]: boolean | DefinitionTable
}

export interface DefinitionTable {
  //maybe make this readonly like everything else???
  readonly [ident: string]: DefinitionTableIntEntry | DefinitionTableBoolEntry
}

export interface DefinitionTableIntEntry {
  readonly ident: string
  readonly val: number
  /**
   * e.g. 15
   * then we have -16 to 15 as possible values
   */
  readonly maxVal: number
}

export interface DefinitionTableBoolEntry {
  readonly ident: string
  readonly boolVal: boolean
}


export function isIntVar(entry: DefinitionTableIntEntry | DefinitionTableBoolEntry): entry is DefinitionTableIntEntry {
  return (entry as DefinitionTableIntEntry).val !== undefined
}

export function isBoolVar(entry: DefinitionTableIntEntry | DefinitionTableBoolEntry): entry is DefinitionTableBoolEntry {
  return (entry as DefinitionTableBoolEntry).boolVal !== undefined
}
