import {
  ExpressionUnit,
  VarDeclUnit
} from "./executionUnit";


export interface PlayersDefUnit {
  type: 'players_def'
  numPlayers: number

  /**
   * tokens [ger: spielsteine] per player
   */
  numTokensPerPlayer: number

  vars: VarDeclUnit[]
}

export interface GameVarsUnit {
  type: 'game_vars'

  maxDiceValue: number
  endCondition: ExpressionUnit | null

  vars: VarDeclUnit[]
}

export type GameDefUnits = PlayersDefUnit | GameVarsUnit