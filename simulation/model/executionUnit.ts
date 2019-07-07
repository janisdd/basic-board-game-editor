import {GameDefUnits} from "./gameDefUnits";


/**
 * the jison lexer location type
 */
export interface LexerLocation {
  readonly first_column: number
  readonly first_line: number

  readonly last_column: number
  readonly last_line: number
}


// export interface PrimitiveValue<T> {
//   readonly value: T
//   readonly location: LexerLocation
// }

/**
 * this should be stay in sync with the grammar
 */
export enum SomePlayer {
  currentPlayer = 0, nextPlayer = 1, previousPlayer = 2
}


export interface GameUnit {
  type: 'game'
  game_def_stats: GameDefUnits[]
  statements: StatementUnit[]
}

export interface VarDeclUnit {
  type: 'var_decl',
  ident: string
  var_type: VarType
  expr: ExpressionUnit

  /**
   * only for ints
   */
  maxVal: number | null //we use circular arithmetic from 15 + 1 = -16
}

export enum VarType {
  int = 0, bool = 1
}

export interface ExpressionUnit {
  type: 'expression'
  right: TernaryExpressionUnit | AssignmentUnit | PlayerVarAssignUnit
}


/**
 * this is a normal assignment x = y
 */
export interface AssignmentUnit {
  type: 'assignment'
  ident: string
  expr: ExpressionUnit
}

/**
 * this is an assignment where a player was specified on the left side [some player].x = y
 */
export interface PlayerVarAssignUnit {
  type: 'player_var_assign'
  player: SomePlayer
  ident: string
  expr: ExpressionUnit
}

//ternary expression ? :
//lower priority than or
export interface TernaryExpressionUnit {
  type: 'ternary_expression'

  disjunction: DisjunctionUnit | null

  //or

  condition: DisjunctionUnit | null
  trueExpression: ExpressionUnit | null
  falseExpression: ExpressionUnit | null
}

//or
export interface DisjunctionUnit {
  type: 'disjunction'
  left: DisjunctionUnit | null
  right: ConjunctionUnit
}

//and
export interface ConjunctionUnit {
  type: 'conjunction'
  left: ConjunctionUnit | null
  right: ComparisonUnit
}

export interface ComparisonUnit {
  type: 'comparison'
  left: RelationUnit | null
  right: RelationUnit
  op: '==' | '!=' | null
}

export interface RelationUnit {
  type: 'relation'
  left: SumUnit | null
  right: SumUnit
  op: '>' | '<' | '>=' | '<=' | null
}


export interface SumUnit {
  type: 'sum'
  left: SumUnit | null
  right: TermUnit
  op: '+' | '-' | null
}

export interface TermUnit {
  type: 'term'
  left: TermUnit | null
  right: FactorUnit
  op: '*' | '/' | '%' | null
}

export interface FactorUnit {
  type: 'factor'
  left: FactorUnit | null //if we have this we need un op
  right: PrimaryUnit | null
  unOp: '+' | '-' | 'not' | null
}


export interface PrimaryUnit {
  type: 'primary'
  primary: PrimaryConstantUnit | PrimaryIdentUnit | PrimaryIdentLeftStepsUnit | PrimaryIdentLastResult | ExpressionUnit | PrimaryIncrementUnit | PrimaryDecrementUnit | PrimaryPlayerVarIdentUnit | PrimaryRollDiceFunc | PrimaryChooseBoolFunc | PrimaryNumPlayers
}

export interface PrimaryConstantUnit {
  type: 'primary_constant'

  //one of
  intValue: number | null
  boolVal: boolean | null
}

export interface PrimaryIdentUnit {
  type: 'primary_ident'
  ident: string
}

/**
 * predefined var (ident), the left steps (left dive value)
 */
export interface PrimaryIdentLeftStepsUnit {
  type: 'primary_ident_leftSteps'
}

/**
 * predefined var (ident), the last returned value by return/result
 */
export interface PrimaryIdentLastResult {
  type: 'primary_ident_last_result'
}

export interface PrimaryRollDiceFunc {
  type: 'primary_roll_dice_func'
  /**
   * if null use the dice vals defined in the game
   * else use this value as max value
   */
  maxValExpr: ExpressionUnit | null
}

/**
 * the current player can choose a value
 */
export interface PrimaryChooseBoolFunc {
  type: 'primary_choose_bool_func'
}

export interface PrimaryIncrementUnit {
  type: 'primary_increment'
  ident: string
  isPost: boolean //true: x++, false: ++x
  player: SomePlayer | null
}

export interface PrimaryDecrementUnit {
  type: 'primary_decrement'
  ident: string
  isPost: boolean//true: x--, false: --x
  player: SomePlayer | null
}

export interface PrimaryPlayerVarIdentUnit {
  type: 'primary_player_var_ident'
  ident: string
  player: SomePlayer
}

/**
 * a built-in var returning the player count
 */
export interface PrimaryNumPlayers {
  type: 'primary_num_players'
}

// export interface ClauseUnit {
//   type: 'clause'
// }

export interface IfUnit {
  type: 'if'
  conditionExpr: ExpressionUnit
  trueUnits: StatementUnit[]
}

export interface IfElseUnit {
  type: 'ifElse'
  conditionExpr: ExpressionUnit
  trueUnits: StatementUnit[]
  falseUnits: StatementUnit[]
}


//--- built in functions

/**
 * if a field has this statement then all commands
 * need to be executed even if leftDiceVal > 0
 *
 * the force cmd must be the first command!
 */
export interface ForceUnit {
  type: 'force'
}

/**
 * makrs the start field
 */
export interface StartUnit {
  type: 'start'

  /**
   * e.g. one must have a 6 when rolled the dice
   */
  startCondition: ExpressionUnit | null
}

/**
 * marks the game end field
 */
export interface EndUnit {
  type: 'end',
}

export interface LogUnit {
  type: 'log'

  expr: ExpressionUnit
}

export interface GotoUnit {
  type: 'goto'
  targetId: number
}

/**
 * begins a new scope e.g. {
 *
 * internally we should push a new local variable def table here
 */
export interface BeginScopeUnit {
  type: 'begin_scope'
}

/**
 * every player has a "last result value" that stores the last returned function value
 * to simulate functions, we should set this value with this uni
 */
export interface SetReturnResultUnit {
  type: 'set_return_result'
  expr: ExpressionUnit
}

/**
 * used to disallow the search in outer scopes
 */
export interface LimitScopeUnit {
  type: 'limit_scope'
}

/**
 * ends the last opened scope e.g. }
 * NOT that we need to match begin and end scopes e.g. { }
 *
 * internally we should pop the last local variable def table here
 */
export interface EndScopeUnit {
  type: 'end_scope'
}


/**
 * built in function to move the current player token
 * actually only adds the steps to the left dice value
 */
export interface MoveFunc {
  type: 'move_func',
  numStepsExpr: ExpressionUnit
}

/**
 * function that rolls back the current player round
 * but persists the observed time needed
 * this is useful when we want to step exactly on the end field with no steps left
 * if not then we don't want to make the move
 */
export interface RollbackFunc {
  type: 'rollback_func'
}

export interface SleepFunc {
  type: 'sleep_func'
  player: SomePlayer
  /**
   * adds the sleep rounds to the suspend counter
   */
  roundsExpr: ExpressionUnit
}


//--- control units

/**
 * an control if where both branches are gotos
 */
export interface ControlIfElseUnit {
  type: 'control_ifElse'
  conditionExpr: ExpressionUnit
  trueTargetId: number
  falseTargetId: number
}


export interface ControlGotoUnit {
  type: 'control_goto'
  targetId: number
}

/**
 * control statements are only to know where the next field is
 */
export type ControlStatementUnit = ControlIfElseUnit | ControlGotoUnit

export type StatementUnit =
  StartUnit
  | EndUnit
  | GotoUnit
  | ExpressionUnit
  | LogUnit
  | VarDeclUnit
  | IfUnit
  | IfElseUnit
  | ForceUnit
  | MoveFunc
  | RollbackFunc
  | SleepFunc
  | ControlStatementUnit
  | BeginScopeUnit
  | SetReturnResultUnit
  | EndScopeUnit
  | LimitScopeUnit


export type SomeExprUnits =
  TernaryExpressionUnit
  | AssignmentUnit
  | PlayerVarAssignUnit
  | DisjunctionUnit
  | ConjunctionUnit
  | ComparisonUnit
  | RelationUnit
  | SumUnit
  | TermUnit
  | FactorUnit
  | PrimaryConstantUnit
  | PrimaryIdentUnit
  | PrimaryIdentLeftStepsUnit
  | PrimaryIdentLastResult
  | ExpressionUnit
  | PrimaryIncrementUnit
  | PrimaryDecrementUnit
  | PrimaryPlayerVarIdentUnit
  | PrimaryRollDiceFunc
  | PrimaryChooseBoolFunc
  | PrimaryNumPlayers
