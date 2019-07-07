import {
  AssignmentUnit,
  BeginScopeUnit,
  ComparisonUnit,
  ConjunctionUnit,
  ControlGotoUnit,
  ControlIfElseUnit,
  DisjunctionUnit,
  EndScopeUnit,
  EndUnit,
  ExpressionUnit,
  FactorUnit,
  GotoUnit,
  IfElseUnit,
  IfUnit,
  LimitScopeUnit,
  MoveFunc,
  PlayerVarAssignUnit,
  PrimaryDecrementUnit,
  PrimaryIdentUnit,
  PrimaryIncrementUnit,
  PrimaryPlayerVarIdentUnit,
  PrimaryUnit,
  RelationUnit,
  RollbackFunc,
  SetReturnResultUnit,
  SleepFunc,
  SomePlayer,
  StartUnit,
  StatementUnit,
  SumUnit,
  TermUnit,
  TernaryExpressionUnit,
  VarDeclUnit,
  VarType
} from "../model/executionUnit";
import {
  DefinitionTableBoolEntry,
  DefinitionTableIntEntry,
  DefinitionTableWrapper,
  isBoolVar,
  isIntVar,
  MachineState,
  PlayerObj,
  PlayerToken,
  WorldSimulationPosition
} from "./machineState";
import {notExhaustiveThrow} from "../../src/state/reducers/_notExhausiveHelper";
import {GameDefUnits, GameVarsUnit, PlayersDefUnit} from "../model/gameDefUnits";

declare function require(s: string): any

const seedrandom = require("seedrandom");


const errorVal = 42

//--- time constants to calculate elapsed time, these are funcs in case we want to change them e.g. by random numbers

const logTimes = false

export interface SimulationTimesObj {
  readonly _timeInS_rollDice: number
  readonly _timeInS_choose_bool_func: number
  readonly _timeInS_goto: number
  readonly _timeInS_set_var: number
  readonly _timeInS_advancePlayer: number
  readonly _timeInS_rollback: number
  readonly _timeInS_var_decl: number
  readonly _timeInS_expr_primary_leftSteps: number
  readonly _timeInS_expr_primary_constant: number
  readonly _timeInS_expr_primary_ident: number
  readonly _timeInS_expr_primary_incrementOrDecrement: number
  readonly _timeInS_expr_disjunction: number
  readonly _timeInS_expr_conjunction: number
  readonly _timeInS_expr_comparison: number
  readonly _timeInS_expr_relation: number
  readonly _timeInS_expr_sum: number
  readonly _timeInS_expr_term: number
  readonly _timeInS_expr_factor: number
}

export class SimulationTimes {
  private constructor() {
  }

  //DON'T move this to constants else the simulation worker would include everything that constants reference to...
  //with webpack worker loader

  public static readonly timeInS_rollDice_default = 2
  public static readonly timeInS_choose_bool_func_default = 2
  public static readonly timeInS_goto_default = 1.5
  public static readonly timeInS_set_var_default = 3
  public static readonly timeInS_advancePlayer_default = 1
  public static readonly timeInS_rollback_default = 2
  public static readonly timeInS_var_decl_default = 3
  public static readonly timeInS_expr_primary_leftSteps_default = 2
  public static readonly timeInS_expr_primary_constant_default = 0.5
  public static readonly timeInS_expr_primary_ident_default = 1
  public static readonly timeInS_expr_primary_incrementOrDecrement_default = 1
  public static readonly timeInS_expr_disjunction_default = 1
  public static readonly timeInS_expr_conjunction_default = 1
  public static readonly timeInS_expr_comparison_default = 1
  public static readonly timeInS_expr_relation_default = 1
  public static readonly timeInS_expr_sum_default = 1
  public static readonly timeInS_expr_term_default = 1
  public static readonly timeInS_expr_factor_default = 1

  public static _timeInS_rollDice = SimulationTimes.timeInS_rollDice_default
  public static _timeInS_choose_bool_func = SimulationTimes.timeInS_choose_bool_func_default
  public static _timeInS_goto = SimulationTimes.timeInS_goto_default
  public static _timeInS_set_var = SimulationTimes.timeInS_set_var_default
  public static _timeInS_advancePlayer = SimulationTimes.timeInS_advancePlayer_default
  public static _timeInS_rollback = SimulationTimes.timeInS_rollback_default
  public static _timeInS_var_decl = SimulationTimes.timeInS_var_decl_default
  public static _timeInS_expr_primary_leftSteps = SimulationTimes.timeInS_expr_primary_leftSteps_default
  public static _timeInS_expr_primary_constant = SimulationTimes.timeInS_expr_primary_constant_default
  public static _timeInS_expr_primary_ident = SimulationTimes.timeInS_expr_primary_ident_default
  public static _timeInS_expr_primary_incrementOrDecrement = SimulationTimes.timeInS_expr_primary_incrementOrDecrement_default
  public static _timeInS_expr_disjunction = SimulationTimes.timeInS_expr_disjunction_default
  public static _timeInS_expr_conjunction = SimulationTimes.timeInS_expr_conjunction_default
  public static _timeInS_expr_comparison = SimulationTimes.timeInS_expr_comparison_default
  public static _timeInS_expr_relation = SimulationTimes.timeInS_expr_relation_default
  public static _timeInS_expr_sum = SimulationTimes.timeInS_expr_sum_default
  public static _timeInS_expr_term = SimulationTimes.timeInS_expr_term_default
  public static _timeInS_expr_factor = SimulationTimes.timeInS_expr_factor_default

  public static setTimes(obj: SimulationTimesObj) {
    this._timeInS_rollDice = obj._timeInS_rollDice
    this._timeInS_choose_bool_func = obj._timeInS_choose_bool_func
    this._timeInS_goto = obj._timeInS_goto
    this._timeInS_set_var = obj._timeInS_set_var
    this._timeInS_advancePlayer = obj._timeInS_advancePlayer
    this._timeInS_rollback = obj._timeInS_rollback
    this._timeInS_var_decl = obj._timeInS_var_decl
    this._timeInS_expr_primary_leftSteps = obj._timeInS_expr_primary_leftSteps
    this._timeInS_expr_primary_constant = obj._timeInS_expr_primary_constant
    this._timeInS_expr_primary_ident = obj._timeInS_expr_primary_ident
    this._timeInS_expr_primary_incrementOrDecrement = obj._timeInS_expr_primary_incrementOrDecrement
    this._timeInS_expr_disjunction = obj._timeInS_expr_disjunction
    this._timeInS_expr_conjunction = obj._timeInS_expr_conjunction
    this._timeInS_expr_comparison = obj._timeInS_expr_comparison
    this._timeInS_expr_relation = obj._timeInS_expr_relation
    this._timeInS_expr_sum = obj._timeInS_expr_sum
    this._timeInS_expr_term = obj._timeInS_expr_term
    this._timeInS_expr_factor = obj._timeInS_expr_factor
  }

  //time to roll the dice
  public static timeInS_rollDice(): number {
    // if (logTimes)
    // console.log(`roll took ${this._timeInS_rollDice}s`)
    return this._timeInS_rollDice
  }


  public static timeInS_choose_bool_func(): number {
    if (logTimes) console.log(`boll func took ${this._timeInS_choose_bool_func}s`)
    return this._timeInS_choose_bool_func
  }

//for all goto s
  public static timeInS_goto(): number {
    if (logTimes) console.log(`goto took ${this._timeInS_goto}s`)
    return this._timeInS_goto
  }

//time to set the new var value
  public static timeInS_set_var(): number {
    if (logTimes) console.log(`set var took ${this._timeInS_set_var}s`)
    return this._timeInS_set_var
  }

//time to give the next player the dice
  public static timeInS_advancePlayer(): number {
    if (logTimes) console.log(`set next player took ${this._timeInS_advancePlayer}s`)
    return this._timeInS_advancePlayer
  }

//time to get the token back
  public static timeInS_rollback(): number {
    if (logTimes) console.log(`rollback took ${this._timeInS_rollback}s`)
    return this._timeInS_rollback
  }

  public static timeInS_var_decl(): number {
    if (logTimes) console.log(`var decl took ${this._timeInS_var_decl}s`)
    return this._timeInS_var_decl
  }

  public static timeInS_expr_primary_leftSteps(): number {
    if (logTimes) console.log(`primary left steps took ${this._timeInS_expr_primary_leftSteps}s`)
    return this._timeInS_expr_primary_leftSteps
  }

  public static timeInS_expr_primary_constant(): number {
    if (logTimes) console.log(`primary constant took ${this._timeInS_expr_primary_constant}s`)
    return this._timeInS_expr_primary_constant
  }

  public static timeInS_expr_primary_ident(): number {
    if (logTimes) console.log(`primary ident took ${this._timeInS_expr_primary_ident}s`)
    return this._timeInS_expr_primary_ident
  }

  public static timeInS_expr_primary_incrementOrDecrement(): number {
    if (logTimes) console.log(`primary inc/decrement took ${this._timeInS_expr_primary_incrementOrDecrement}s`)
    return this._timeInS_expr_primary_incrementOrDecrement
  }

//or
  public static timeInS_expr_disjunction(): number {
    if (logTimes) console.log(`primary or took ${this._timeInS_expr_disjunction}s`)
    return this._timeInS_expr_disjunction
  }

//and
  public static timeInS_expr_conjunction(): number {
    if (logTimes) console.log(`primary and took ${this._timeInS_expr_conjunction}s`)
    return this._timeInS_expr_conjunction
  }

//comparison ops: ==, !=
  public static timeInS_expr_comparison(): number {
    if (logTimes) console.log(`primary compare took ${this._timeInS_expr_comparison}s`)
    return this._timeInS_expr_comparison
  }

//relation ops: <, >, <=, >=
  public static timeInS_expr_relation(): number {
    if (logTimes) console.log(`primary relation (>, ...) took ${this._timeInS_expr_relation}s`)
    return this._timeInS_expr_relation
  }

//sum ops: x + x, x - x
  public static timeInS_expr_sum(): number {
    if (logTimes) console.log(`primary sum took ${this._timeInS_expr_sum}s`)
    return this._timeInS_expr_sum
  }

//mul ops: *, /, %
  public static timeInS_expr_term(): number {
    if (logTimes) console.log(`primary term/mul op took ${this._timeInS_expr_term}s`)
    return this._timeInS_expr_term
  }

//un ops: +x, -x, not x
  public static timeInS_expr_factor(): number {
    if (logTimes) console.log(`primary factor (un op) took ${this._timeInS_expr_factor}s`)
    return this._timeInS_expr_factor
  }

}

//TODO game setup times

//---

export const playerColors = ['#00dd0a', '#0089dd', '#dd0011', '#f1f300', '#f300b5'
  //TODO more
]


let random = seedrandom()

const defaultPlayerId = -1

export class AbstractMachine {
  private constructor() {
  }

  public static createNewMachineState(): MachineState {
    return {
      globalDefTable: {},
      currentPlayerIndex: 0,
      nextPlayerIndex: 0,   //this is set when player statements are executed
      previousPlayerIndex: 0, //this is set when player statements are executed
      currentPlayerActiveTokenIndex: 0,
      players: [ //a default player to execute statements fast without the need to define a player
        {
          tokens: [],
          defTable: {},
          suspendCounter: 0,
          color: '',
          name: 'default player',
          id: defaultPlayerId,
          localDefTables: [{
            isScopeLimited: false,
            defTable: {}
          }], //define the implicit main function scope
          lastReturnedValue: undefined
        }],
      rolledDiceValue: 0,
      leftDiceValue: 0,
      maxDiceValue: 0,
      gameEndCondition: null,
      rollbackState: null,
      wasStateRolledBack: false,
      elapsedTimeInS: 0,
      winnersIds: [],
    }
  }

  public static setSeed(seed: number | null) {
    random = seedrandom(seed === null
      ? null
      : seed.toString())
  }

  //game functions e.g. next round, roll dice...

  public static rollDice(state: MachineState, min = 1, max = 6): { state: MachineState, diceValue: number } {

    return {
      state: {
        ...state,
        elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_rollDice()
      },
      diceValue: Math.floor((random.quick() * max) + min)
    }
  }


  public static advancePlayerIndex(state: MachineState): MachineState {

    let newCurrentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length
    return {
      ...state,
      currentPlayerIndex: newCurrentPlayerIndex,
      nextPlayerIndex: (newCurrentPlayerIndex + 1) % state.players.length,
      previousPlayerIndex: (newCurrentPlayerIndex - 1) < 0
        ? state.players.length - 1
        : (newCurrentPlayerIndex - 1),

      elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_advancePlayer()
    }

  }

  //game def statements

  public static executeAllGameDefinitionStatements(
    statements: ReadonlyArray<GameDefUnits>, state: MachineState): MachineState {
    let newState = state
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      newState = this.executeGameDefinitionStatement(statement, newState)
    }

    return newState
  }

  public static executeGameDefinitionStatement(statement: GameDefUnits, state: MachineState): MachineState {


    switch (statement.type) {

      case "game_vars": {
        const res = this.execGameDef(statement, state)
        return res
      }

      case "players_def" : {

        const res = this.execPlayerDef(statement, state)
        return res
      }

      default:
        notExhaustiveThrow(statement)
        throw new Error()
    }
  }

  public static execPlayerDef(defs: PlayersDefUnit, state: MachineState): MachineState {


    if (state.players.length > 0 && state.players[0].id !== defaultPlayerId) { //allow the default player
      this.makeError(`players def can only be defined once`)
    }

    if (defs.numTokensPerPlayer <= 0) {
      this.makeError(`a player needs at least 1 token --> set numTokensPerPlayer to >= 1`)
    }

    let lastState: MachineState = {
      ...state,
      players: [] //reset because the default player should be removed
    }

    for (let i = 0; i < defs.numPlayers; i++) {

      const color = playerColors[i]

      let tokens: PlayerToken[] = []
      for (let j = 0; j < defs.numTokensPerPlayer; j++) {
        const token: PlayerToken = {
          color: color,
          fieldId: null,
          tileGuid: null,
          name: `player${i}_token${j}`,
          previousPositions: []
        }
        tokens.push(token)
      }

      const player: PlayerObj = {
        id: i,
        color: color,
        name: `player${i}`,
        defTable: {},
        localDefTables: [{
          isScopeLimited: false,
          defTable: {}
        }], //define the implicit main function scope
        tokens,
        suspendCounter: 0,
        lastReturnedValue: undefined
      }

      lastState = {
        ...lastState,
        players: lastState.players.concat(player),
        currentPlayerIndex: i //if we use y++ inside player var defs we need to increment the right value
      }

      const newState = this.execPlayerVars(defs.vars, lastState, i)

      lastState = newState
    }


    let newCurrentPlayerIndex = 0
    lastState = {
      ...lastState,
      currentPlayerIndex: newCurrentPlayerIndex,
      nextPlayerIndex: (newCurrentPlayerIndex + 1) % lastState.players.length,
      previousPlayerIndex: (newCurrentPlayerIndex - 1) < 0
        ? lastState.players.length - 1
        : (newCurrentPlayerIndex - 1),
    }

    return lastState
  }

  /**
   *
   * @param {VarDeclUnit[]} vars
   * @param {MachineState} state we need the state in case we use global vars (e.g. x++) & to evaluate the expr
   * @param playerIndex the player index
   * @returns {MachineState}
   */
  private static execPlayerVars(vars: VarDeclUnit[], state: MachineState, playerIndex: number): MachineState {

    let lastState = state
    for (let i = 0; i < vars.length; i++) {
      const varDecl = vars[i]


      if (state.players[playerIndex] === undefined) {
        this.makeError(`player with index ${playerIndex} was not found (execPlayerVars)`)
      }

      const entry = lastState.players[playerIndex].defTable[varDecl.ident]

      if (entry) {
        this.makeError(`player var ${varDecl.ident} is already defined`)
      }

      const expRes = this.execExpression(varDecl.expr, lastState)

      lastState = expRes.state

      if (varDecl.var_type === VarType.int) {

        if (expRes.boolVal !== null) {
          this.makeError(`player var ${varDecl.ident} is of type int but expression is of type bool`)
          throw new Error()
        }

        if (expRes.val === null) {
          this.makeError(`player var ${varDecl.ident} expression int was null`)
          throw new Error()
        }

        if (varDecl.maxVal === null) {
          this.makeError(`player var ${varDecl.ident} expression int was null`)
          throw new Error()
        }

        //replace the modified player
        lastState = {
          ...lastState,
          players: lastState.players.map((p, index) => playerIndex !== index
            ? p
            : {
              ...p,
              defTable: {
                ...p.defTable,
                [varDecl.ident]: {
                  val: this.circularArithmeticVal(expRes.val, varDecl.maxVal + 1, varDecl.maxVal),
                  ident: varDecl.ident,
                  maxVal: varDecl.maxVal
                } as DefinitionTableIntEntry
              }
            })
        }

      } else if (varDecl.var_type === VarType.bool) {

        if (expRes.val !== null) {
          this.makeError(`player var ${varDecl.ident} is of type bool but expression is of type int`)
        }

        //replace the modified player
        lastState = {
          ...lastState,
          players: lastState.players.map((p, index) => playerIndex !== index
            ? p
            : {
              ...p,
              defTable: {
                ...p.defTable,
                [varDecl.ident]: {
                  boolVal: expRes.boolVal,
                  ident: varDecl.ident,
                } as DefinitionTableBoolEntry
              }
            })
        }

      }
    }
    return lastState
  }

  private static execPlayerVarAssign(playerVarAssign: PlayerVarAssignUnit, state: MachineState): ExprTuple {

    let playerIndex = this.getSomePlayerIndex(playerVarAssign.player, state, 'primary_player_var_ident unknown player')

    const entry = state.players[playerIndex].defTable[playerVarAssign.ident]

    if (!entry) {
      this.makeError(`player var assign unknown var ${playerVarAssign.ident} for player`)
    }

    const exprRes = this.execExpression(playerVarAssign.expr, state)
    state = exprRes.state

    return this._execPlayerVarAssign(entry, playerIndex, exprRes, state)

  }


  /**
   * same as execPlayerVarAssign but uses an already evaluated expr (we use this method somehwere else too)
   * @param {DefinitionTableIntEntry | DefinitionTableBoolEntry} entry
   * @param {number} playerIndex
   * @param {ExprTuple} exprRes the state is not used! use the state arg instead
   * @param {MachineState} state
   * @returns {ExprTuple}
   * @private
   */
  private static _execPlayerVarAssign(entry: DefinitionTableIntEntry | DefinitionTableBoolEntry, playerIndex: number,
                                      exprRes: ExprTuple, state: MachineState
  ): ExprTuple {

    if (exprRes.val !== null) {

      if (isBoolVar(entry)) {
        this.makeError(`player var assign var ${entry.ident} is of type bool but epxr is of type int`)
      }

      if (isIntVar(entry)) {
        //priori and posteriori type matches (int, int)

        const copyState: MachineState = {
          ...exprRes.state,
          players: state.players.map((p, index) => index !== playerIndex
            ? p
            : {
              ...p,
              defTable: {
                ...p.defTable,
                [entry.ident]: {
                  val: exprRes.val,
                  maxVal: entry.maxVal,
                  ident: entry.ident
                } as DefinitionTableIntEntry
              }
            } as PlayerObj),
          elapsedTimeInS: exprRes.state.elapsedTimeInS + SimulationTimes.timeInS_set_var()
        }

        return {
          val: exprRes.val,
          boolVal: null,
          state: copyState
        }
      }
    }

    if (exprRes.boolVal !== null) {

      if (isIntVar(entry)) {
        this.makeError(`player var assign var ${entry.ident} is of type int but epxr is of type bool`)
      }

      if (isBoolVar(entry)) {
        const copyState: MachineState = {
          ...exprRes.state,
          players: state.players.map((p, index) => index !== playerIndex
            ? p
            : {
              ...p,
              defTable: {
                ...p.defTable,
                [entry.ident]: {
                  boolVal: exprRes.boolVal,
                  ident: entry.ident
                } as DefinitionTableBoolEntry
              }
            } as PlayerObj),
          elapsedTimeInS: exprRes.state.elapsedTimeInS + SimulationTimes.timeInS_set_var()
        }

        return {
          val: null,
          boolVal: exprRes.boolVal,
          state: copyState
        }
      }

    }


    this.makeError(`player var assign var ${entry.ident} unknown val/type`)
    return null
  }

  private static execGameDef(gameVars: GameVarsUnit, state: MachineState): MachineState {

    const res = this.execGameVars(gameVars.vars, state)

    return {
      ...res,
      maxDiceValue: gameVars.maxDiceValue,
      gameEndCondition: gameVars.endCondition
    }
  }

  private static execGameVars(vars: VarDeclUnit[], state: MachineState): MachineState {

    for (let i = 0; i < vars.length; i++) {
      const varDecl = vars[i]

      const entry = state.globalDefTable[varDecl.ident]

      if (entry) {
        this.makeError(`global var ${varDecl.ident} is already defined`)
      }

      const expRes = this.execExpression(varDecl.expr, state)
      state = expRes.state

      if (varDecl.var_type === VarType.int) {

        if (expRes.boolVal !== null) {
          this.makeError(`global var ${varDecl.ident} is of type int but expression is of type bool`)
        }

        state = {
          ...state,
          globalDefTable: {
            ...state.globalDefTable,
            [varDecl.ident]: {
              val: this.circularArithmeticVal(expRes.val, varDecl.maxVal + 1, varDecl.maxVal),
              ident: varDecl.ident,
              maxVal: varDecl.maxVal
            } as DefinitionTableIntEntry
          }
        }

      } else if (varDecl.var_type === VarType.bool) {

        if (expRes.val !== null) {
          this.makeError(`global var ${varDecl.ident} is of type bool but expression is of type int`)
        }

        state = {
          ...state,
          globalDefTable: {
            ...state.globalDefTable,
            [varDecl.ident]: {
              boolVal: expRes.boolVal,
              ident: varDecl.ident,
            } as DefinitionTableBoolEntry
          }
        }
      }

    }


    return state
  }

// statements

  public static executeAll(statements: ReadonlyArray<StatementUnit>, state: MachineState): MachineState {

    let newState = state
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      newState = this.executeStatement(statement, newState)
    }

    return newState
  }

  public static executeStatement(statement: StatementUnit, state: MachineState): MachineState {

    switch (statement.type) {


      case "var_decl": {
        const res = this.execVarDecl(statement, state)
        return res

      }

      case "expression": {

        const res = this.execExpression(statement, state)
        return res.state
      }


      case "log": {

        const res = this.execExpression(statement.expr, state)

        if (res.boolVal !== null) {
          this.builtIn_log(res.boolVal)
        }
        else if (res.val !== null) {
          this.builtIn_log(res.val)
        }

        return state
      }

      case "if": {

        const res = this.execIf(statement, state)
        return res
      }

      case "ifElse": {

        const res = this.execIfElse(statement, state)
        return res
      }

      case "goto": {

        const res = this.execGoto(statement, state)
        return res
      }

      case "start": {

        const res = this.execStart(statement, state)
        return res
      }

      case "end": {

        const res = this.execEnd(statement, state)
        return res
      }

      //this is only important for simulation but not for the normal program flow
      case "force":
        return state

      case "control_goto": {
        const res = this.execControlGoto(statement, state)
        return res
      }

      case "control_ifElse": {
        const res = this.execControlIfElse(statement, state)
        return res
      }

      case "move_func": {
        const res = this.execMoveFunc(statement, state)
        return res
      }

      case "rollback_func": {
        const res = this.execRollbackFunc(statement, state)
        return res
      }

      case "sleep_func": {
        const res = this.execSleepFunc(statement, state)
        return res
      }

      case "begin_scope": {
        const res = this.execBeginScope(statement, state)
        return res
      }

      case "set_return_result": {
        const res = this.execSetReturnResultUnit(statement, state)
        return res
      }

      case "end_scope": {
        const res = this.execEndScope(statement, state)
        return res
      }

      case "limit_scope": {
        const res = this.execLimitScope(statement, state)
        return res
      }

      default:
        notExhaustiveThrow(statement)
    }
  }

  //-- control stats - all control statements decrease the left dice value

  private static execControlIfElse(controlIfElse: ControlIfElseUnit, state: MachineState): MachineState {

    const conditionRes = this.execExpression(controlIfElse.conditionExpr, state)
    //control statements expression cannot change state
    //state = conditionRes.state


    if (conditionRes.boolVal === null) {
      this.makeError('if condition must be of type bool')
    }

    const playerToken = state.players[state.currentPlayerIndex].tokens[state.currentPlayerActiveTokenIndex]

    return {
      ...state,
      players: state.players.map((p, index) => index !== state.currentPlayerIndex
        ? p
        : {
          ...p,
          tokens: p.tokens.map(
            (t, index1) => index1 !== state.currentPlayerActiveTokenIndex
              ? t
              : {
                ...t,
                fieldId: conditionRes.boolVal === true
                  ? controlIfElse.trueTargetId
                  : controlIfElse.falseTargetId,
                previousPositions: playerToken.previousPositions.concat(
                  {
                    tileGuid: playerToken.tileGuid,
                    fieldId: playerToken.fieldId
                  } as WorldSimulationPosition)
              } as PlayerToken)
        } as PlayerObj),
      leftDiceValue: state.leftDiceValue - 1,

      //use the elapsed time from the expr evaluation
      elapsedTimeInS: conditionRes.state.elapsedTimeInS + SimulationTimes.timeInS_goto()
    }

  }

  private static execControlGoto(controlGoto: ControlGotoUnit, state: MachineState): MachineState {

    const playerToken = state.players[state.currentPlayerIndex].tokens[state.currentPlayerActiveTokenIndex]

    return {
      ...state,
      players: state.players.map((p, index) => index !== state.currentPlayerIndex
        ? p
        : {
          ...p,
          tokens: p.tokens.map(
            (t, index1) => index1 !== state.currentPlayerActiveTokenIndex
              ? t
              : {
                ...t,
                fieldId: controlGoto.targetId,
                previousPositions: playerToken.previousPositions.concat(
                  {
                    tileGuid: playerToken.tileGuid,
                    fieldId: playerToken.fieldId
                  } as WorldSimulationPosition)
              } as PlayerToken)
        } as PlayerObj),
      leftDiceValue: state.leftDiceValue - 1,

      elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_goto()
    }
  }

  //-- end control stats

  //--- built in funcs

  private static execBeginScope(beginScope: BeginScopeUnit, state: MachineState): MachineState {

    return {
      ...state,
      players: state.players.map((value, playerIndex) => playerIndex !== state.currentPlayerIndex
        ? value
        : {
          ...value,
          localDefTables: value.localDefTables.concat({
            isScopeLimited: false,
            defTable: {}
          }) //push new scope
        })
    }
  }

  private static execEndScope(endScope: EndScopeUnit, state: MachineState): MachineState {

    if (state.players[state.currentPlayerIndex].localDefTables.length === 1) {
      //this is the initial scope that cannot be ended...
      this.makeError(`the initial scope cannot be closed/ended`)
    }

    return {
      ...state,
      players: state.players.map((value, playerIndex) => playerIndex !== state.currentPlayerIndex
        ? value
        : {
          ...value,
          localDefTables: value.localDefTables.filter((p, index) => index < value.localDefTables.length - 1) //pop last scope
        })
    }
  }

  private static execLimitScope(limitScope: LimitScopeUnit, state: MachineState): MachineState {

    return {
      ...state,
      players: state.players.map((value, playerIndex) => playerIndex !== state.currentPlayerIndex
        ? value
        : {
          ...value,
          localDefTables: value.localDefTables.map((p, index) => index !== value.localDefTables.length - 1
            ? p
            : {
              ...p,
              isScopeLimited: true
            })
        })
    }
  }

  private static execSetReturnResultUnit(setReturnResult: SetReturnResultUnit, state: MachineState): MachineState {

    const exprRes = this.execExpression(setReturnResult.expr, state)
    state = exprRes.state

    if (exprRes.val === null && exprRes.boolVal === null) {
      this.makeError(`assigning return result expression did not give a result`)
    }

    return {
      ...state,
      players: state.players.map((value, playerIndex) => playerIndex !== state.currentPlayerIndex
        ? value
        : {
          ...value,
          lastReturnedValue: exprRes.val !== null
            ? exprRes.val
            : exprRes.boolVal
        }),
      elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_set_var()
    }
  }

  private static execSleepFunc(sleepFunc: SleepFunc, state: MachineState): MachineState {

    const exprRes = this.execExpression(sleepFunc.roundsExpr, state)
    //this sets the elapsed time
    state = exprRes.state

    if (exprRes.val === null) {
      this.makeError('sleep function rounds arg needs to be of type int')
    }

    let targetPlayerIndex = this.getSomePlayerIndex(sleepFunc.player, state, 'unknown player for sleep function')

    return {
      ...state,
      players: state.players.map((p, index) => index !== targetPlayerIndex
        ? p
        : {
          ...p,
          suspendCounter: Math.max(p.suspendCounter + exprRes.val, 0) //we should not get -x sleep
        } as PlayerObj), //player cannot move any further if he should sleep
      leftDiceValue: sleepFunc.player === SomePlayer.currentPlayer
        ? 0
        : state.leftDiceValue,

      //itself doesn't consume time
      //this sets the elapsed time
      //state = exprRes.state
    }
  }

  private static execMoveFunc(moveFunc: MoveFunc, state: MachineState): MachineState {

    const exprRes = this.execExpression(moveFunc.numStepsExpr, state)

    if (exprRes.val === null) {
      this.makeError('move argument must return an int')
    }

    state = exprRes.state

    return {
      ...state,
      leftDiceValue: state.leftDiceValue + exprRes.val, //move itself does not use time
      //state = exprRes.state also sets elapsed time
    }
  }

  private static execRollbackFunc(rollbackFunc: RollbackFunc, state: MachineState): MachineState {

    if (state.rollbackState === null) return state

    return {
      ...state.rollbackState,
      leftDiceValue: 0,
      wasStateRolledBack: true,
      elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_rollback()
    }
  }

  private static execStart(start: StartUnit, state: MachineState): MachineState {

    if (start.startCondition === null) return state

    const exprRes = this.execExpression(start.startCondition, state)


    if (exprRes.boolVal === null) {
      this.makeError('start condition must be of type bool')
    }

    return {
      ...state,
      elapsedTimeInS: exprRes.state.elapsedTimeInS
    }
  }

  private static execEnd(end: EndUnit, state: MachineState): MachineState {

    const currentPlayer = state.players[state.currentPlayerIndex]

    return {
      ...state,
      winnersIds: state.winnersIds.concat(currentPlayer.id), //uses no time
    }
  }

  private static execGoto(goto: GotoUnit, state: MachineState): MachineState {

    //don't decrement dice value because when we need to travel to another tile
    //this should not be counted as move
    return {
      ...state,
      players: state.players.map((p, index) => index !== state.currentPlayerIndex
        ? p
        : {
          ...p,
          tokens: p.tokens.map(
            (t, index1) => index1 !== state.currentPlayerActiveTokenIndex
              ? t
              : {
                ...t,
                fieldId: goto.targetId
              } as PlayerToken)
        } as PlayerObj),
      elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_goto()
    }
  }

  //-- end built in funcs


  private static execIf(ifStatement: IfUnit, state: MachineState): MachineState {

    const conditionRes = this.execExpression(ifStatement.conditionExpr, state)

    if (conditionRes.boolVal === null) {
      this.makeError('if condition must be of type bool')
    }

    //don't change anything only expression side effects (e.g. x++)
    if (conditionRes.boolVal === false) return conditionRes.state

    let lastState = conditionRes.state
    for (let i = 0; i < ifStatement.trueUnits.length; i++) {
      const statement = ifStatement.trueUnits[i]
      lastState = this.executeStatement(statement, lastState)
    }

    //time is set inside every statement
    return lastState
  }

  private static execIfElse(ifStatement: IfElseUnit, state: MachineState): MachineState {

    //time is set inside every statement

    const conditionRes = this.execExpression(ifStatement.conditionExpr, state)

    if (conditionRes.boolVal === null) {
      this.makeError('if else condition must be of type bool')
    }

    let lastState = conditionRes.state

    if (conditionRes.boolVal === false) {

      for (let i = 0; i < ifStatement.falseUnits.length; i++) {
        const statement = ifStatement.falseUnits[i]
        lastState = this.executeStatement(statement, lastState)
      }

      return lastState

    }

    //true branch

    for (let i = 0; i < ifStatement.trueUnits.length; i++) {
      const statement = ifStatement.trueUnits[i]
      lastState = this.executeStatement(statement, lastState)
    }

    return lastState
  }


  private static execVarDecl(varDecl: VarDeclUnit, state: MachineState): MachineState {

    //only the current player because local vars are player local

    //use the current local vars scope of the current player

    const scopes = state.players[state.currentPlayerIndex].localDefTables

    const scopeIndex = scopes.length - 1

    const currentDefTable = scopes[scopeIndex]

    const defTabEntry = currentDefTable.defTable[varDecl.ident]

    if (defTabEntry) {
      this.makeError(`var ${varDecl.ident} is already defined in current local vars scope`)
    }

    const expRes = this.execExpression(varDecl.expr, state)
    state = expRes.state

    let copy: MachineState
    if (varDecl.var_type === VarType.int) {

      if (expRes.boolVal !== null) {
        this.makeError(`var ${varDecl.ident} is of type int but expression is of type bool`)
      }

      copy = {
        ...state,
        players: state.players.map((p, playerIdex) => playerIdex !== state.currentPlayerIndex
          ? p
          : {
            ...p,
            localDefTables: p.localDefTables.map((value, index) => index !== scopeIndex
              ? value
              : {
                ...value,
                defTable: {
                  ...value.defTable,
                  [varDecl.ident]: {
                    ident: varDecl.ident,
                    val: this.circularArithmeticVal(expRes.val, varDecl.maxVal + 1, varDecl.maxVal),
                    maxVal: varDecl.maxVal
                  } as DefinitionTableIntEntry
                }
              })
          }),
        elapsedTimeInS: expRes.state.elapsedTimeInS + SimulationTimes.timeInS_var_decl()
      }

      return copy
    }

    if (varDecl.var_type === VarType.bool) {

      if (expRes.val !== null) {
        this.makeError(`var ${varDecl.ident} is of type bool but expression is of type int`)
      }

      copy = {
        ...state,
        players: state.players.map((p, playerIdex) => playerIdex !== state.currentPlayerIndex
          ? p
          : {
            ...p,
            localDefTables: p.localDefTables.map((value, index) => index !== scopeIndex
              ? value
              : {
                ...value,
                defTable: {
                  ...value.defTable,
                  [varDecl.ident]: {
                    ident: varDecl.ident,
                    boolVal: expRes.boolVal,
                  } as DefinitionTableBoolEntry
                }
              })
          }),
        elapsedTimeInS: expRes.state.elapsedTimeInS + SimulationTimes.timeInS_var_decl()
      }
      return copy
    }


    this.makeError(`var type for var ${varDecl.ident} is unknown`)


    //new vars as global var
    // const defTabEntry = state.globalDefTable[varDecl.ident]
    //
    // if (defTabEntry) {
    //   this.makeError(`var ${varDecl.ident} is already defined`)
    // }
    //
    // const expRes = this.execExpression(varDecl.expr, state)
    //
    // let copy: ExprTuple
    //
    // if (varDecl.var_type === VarType.int) {
    //
    //   if (expRes.boolVal !== null) {
    //     this.makeError(`var ${varDecl.ident} is of type int but expression is of type bool`)
    //   }
    //
    //   copy = {
    //     val: expRes.val,
    //     boolVal: null,
    //     state: {
    //       ...expRes.state,
    //       globalDefTable: {
    //         ...expRes.state.globalDefTable,
    //         [varDecl.ident]: {
    //           ident: varDecl.ident,
    //           val: this.circularArithmeticVal(expRes.val, varDecl.maxVal + 1, varDecl.maxVal),
    //           maxVal: varDecl.maxVal
    //         } as DefinitionTableIntEntry
    //       },
    //       elapsedTimeInS: expRes.state.elapsedTimeInS + SimulationTimes.timeInS_var_decl()
    //     }
    //   }
    // }
    // else if (varDecl.var_type === VarType.bool) {
    //
    //   if (expRes.val !== null) {
    //     this.makeError(`var ${varDecl.ident} is of type bool but expression is of type int`)
    //   }
    //
    //   copy = {
    //     val: null,
    //     boolVal: expRes.boolVal,
    //     state: {
    //       ...expRes.state,
    //       globalDefTable: {
    //         ...expRes.state.globalDefTable,
    //         [varDecl.ident]: {
    //           ident: varDecl.ident,
    //           boolVal: expRes.boolVal,
    //         } as DefinitionTableBoolEntry
    //       },
    //       elapsedTimeInS: expRes.state.elapsedTimeInS + SimulationTimes.timeInS_var_decl()
    //     }
    //   }
    // }
    // else {
    //   this.makeError(`var type for var ${varDecl.ident} is unknown`)
    // }
    //
    // return copy
  }


  //--- expressions

  public static execExpression(expr: ExpressionUnit, state: MachineState): ExprTuple {

    switch (expr.right.type) {
      case "assignment": {

        const res = this.execAssign(expr.right, state)
        return res
      }

      case  "ternary_expression": {
        const res = this.execTernaryExpr(expr.right, state)
        return res
      }


      case "player_var_assign": {
        const res = this.execPlayerVarAssign(expr.right, state)
        return res

      }

      default:
        notExhaustiveThrow(expr.right)
    }
  }


  /**
   * an assignment
   *
   * @param {AssignmentUnit} assign
   * @param {MachineState} state
   * @returns {ExprTuple}
   */
  private static execAssign(assign: AssignmentUnit, state: MachineState): ExprTuple {


    //if the assign is prefixed we would call execPlayerVarAssign directly

    const expRes = this.execExpression(assign.expr, state)
    state = expRes.state

    //check first local var assign
    if (state.players[state.currentPlayerIndex].localDefTables.length > 0) {

      let scopeIndex = state.players[state.currentPlayerIndex].localDefTables.length - 1

      while (scopeIndex >= 0) {
        const currentDefTableScope: DefinitionTableWrapper = state.players[state.currentPlayerIndex].localDefTables[scopeIndex]

        if (currentDefTableScope.isScopeLimited) {
          //not search any further outer scopes
          break
        }

        const entry = currentDefTableScope.defTable[assign.ident]

        if (entry === undefined) {
          scopeIndex--
          continue
        }

        if (isBoolVar(entry)) {

          if (expRes.boolVal === null) {
            this.makeError(`assignment error: tried to assign a not bool value to the bool variable ${assign.ident}`)
          }

          return {
            val: null,
            boolVal: expRes.boolVal,
            state: {
              ...state,
              players: state.players.map((p, playerIndex) => playerIndex !== state.currentPlayerIndex
                ? p
                : {
                  ...p,
                  localDefTables: p.localDefTables.map(
                    (value, index) => index !== scopeIndex
                      ? value
                      : {
                        ...value,
                        defTable: {
                          ...value.defTable,
                          [assign.ident]: {
                            ident: assign.ident,
                            boolVal: expRes.boolVal
                          } as DefinitionTableBoolEntry
                        }
                      }  as DefinitionTableWrapper)
                } as PlayerObj),
              elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_set_var()
            }
          }
        }

        if (isIntVar(entry)) {

          if (expRes.val === null) {
            this.makeError(`assignment error: tried to assign a not int value to the int variable ${assign.ident}`)
          }

          return {
            val: expRes.val,
            boolVal: null,
            state: {
              ...state,
              players: state.players.map((p, playerIndex) => playerIndex !== state.currentPlayerIndex
                ? p
                : {
                  ...p,
                  localDefTables: p.localDefTables.map(
                    (value, index) => index !== scopeIndex
                      ? value
                      : {
                        ...value,
                        defTable: {
                          ...value.defTable,
                          [assign.ident]: {
                            ident: assign.ident,
                            maxVal: entry.maxVal,
                            val: this.circularArithmeticVal(
                              expRes.val, entry.maxVal + 1,
                              entry.maxVal
                            )
                          } as DefinitionTableIntEntry
                        }
                      } as DefinitionTableWrapper)

                } as PlayerObj),
              elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_set_var()
            }
          }
        }
      }
    }

    //then try implicit player variable
    if (state.players[state.currentPlayerIndex].defTable[assign.ident] !== undefined) {

      const entry = state.players[state.currentPlayerIndex].defTable[assign.ident]
      return this._execPlayerVarAssign(entry, state.currentPlayerIndex, expRes, state)
    }

    //then a global var assign

    const defTabEntry = state.globalDefTable[assign.ident]

    if (!defTabEntry) {
      this.makeError(`var ${assign.ident} is not defined`)
    }


    if (isBoolVar(defTabEntry)) {

      if (expRes.boolVal === null) {
        this.makeError(`global var ${assign.ident} assing: cannot assign not bool expr to bool var`)
      }

      //bool and bool mach

      const copy: ExprTuple = {
        val: null,
        boolVal: expRes.boolVal,
        state: {
          ...expRes.state,
          globalDefTable: {
            ...expRes.state.globalDefTable,
            [assign.ident]: {
              ident: assign.ident,
              boolVal: expRes.boolVal
            } as DefinitionTableBoolEntry
          },
          elapsedTimeInS: expRes.state.elapsedTimeInS + SimulationTimes.timeInS_set_var()
        }
      }
      return copy

    }

    if (isIntVar(defTabEntry)) {

      if (expRes.val === null) {
        this.makeError(`global var ${assign.ident} assing: cannot assign not int expr to int var`)
      }

      //make sure we keep the value range / domain
      //-16 till 15
      const realVal = this.circularArithmeticVal(expRes.val, defTabEntry.maxVal + 1, defTabEntry.maxVal)

      const copy: ExprTuple = {
        val: realVal,
        boolVal: null,
        state: {
          ...expRes.state,
          globalDefTable: {
            ...expRes.state.globalDefTable,
            [assign.ident]: {
              ident: assign.ident,
              val: realVal,
              maxVal: defTabEntry.maxVal
            } as DefinitionTableIntEntry
          },
          elapsedTimeInS: expRes.state.elapsedTimeInS + SimulationTimes.timeInS_set_var()
        }
      }

      return copy
    }

    this.makeError(`global var ${assign.ident} assing: unknown variable type`)
    return {
      state,
      val: null,
      boolVal: null
    }
  }


  private static execTernaryExpr(ternaryExpr: TernaryExpressionUnit, state: MachineState): ExprTuple {

    if (ternaryExpr.disjunction !== null) {
      const res = this.execDisjunction(ternaryExpr.disjunction, state)
      return res
    }

    //we have a ternary expression e.g. true ? 0 : 1

    if (ternaryExpr.condition === null) {
      this.makeError('ternary expression has no condition')
    }
    if (ternaryExpr.trueExpression === null) {
      this.makeError('ternary expression has no true expression (left)')
    }
    if (ternaryExpr.falseExpression === null) {
      this.makeError('ternary expression has no false expression (right)')
    }


    const conditionRes = this.execDisjunction(ternaryExpr.condition, state)
    state = conditionRes.state

    if (conditionRes.boolVal === null) {
      this.makeError(`ternary expression condition didn't evaluate to a bool`)
    }

    //make a deep copy to check for both branches and do not modify state
    const trueState: MachineState = JSON.parse(JSON.stringify(state))
    const falseState: MachineState = JSON.parse(JSON.stringify(state))

    const trueRes = this.execExpression(ternaryExpr.trueExpression, trueState)
    const falseRes = this.execExpression(ternaryExpr.falseExpression, falseState)

    if (trueRes.val !== null && falseRes.val !== null) {
      //both int val --> res is int
    } else if (trueRes.boolVal !== null && falseRes.boolVal !== null) {
      //both bool val --> res is bool
    } else {
      this.makeError('ternary expression both values must be of the same type')
    }


    if (conditionRes.boolVal) {
      return trueRes
    }


    return falseRes
  }

  private static execDisjunction(disjunction: DisjunctionUnit, state: MachineState): ExprTuple {

    if (disjunction.left === null) {

      //no other path
      const res = this.execConjunction(disjunction.right, state)
      return res
    }

    const lefRes = this.execDisjunction(disjunction.left, state)
    const rightRes = this.execConjunction(disjunction.right, lefRes.state)

    if (lefRes.boolVal === null) {
      this.makeError('disjunction (or) left op must be of type bool')
    }

    if (rightRes.boolVal === null) {
      this.makeError('disjunction (or) right op must be of type bool')
    }

    return {
      state: {
        ...rightRes.state,
        elapsedTimeInS: rightRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_disjunction()
      },
      val: null,
      boolVal: lefRes.boolVal || rightRes.boolVal
    }

  }

  private static execConjunction(conjunction: ConjunctionUnit, state: MachineState): ExprTuple {

    if (conjunction.left === null) {
      const res = this.execComparison(conjunction.right, state)
      return res
    }

    const lefRes = this.execConjunction(conjunction.left, state)
    const rightRes = this.execComparison(conjunction.right, lefRes.state)

    if (lefRes.boolVal === null) {
      this.makeError('conjunction (and) left op must be of type bool')
    }

    if (rightRes.boolVal === null) {
      this.makeError('conjunction (and) right op must be of type bool')
    }

    return {
      state: {
        ...rightRes.state,
        elapsedTimeInS: rightRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_conjunction()
      },
      val: null,
      boolVal: lefRes.boolVal && rightRes.boolVal
    }
  }

  private static execComparison(comparison: ComparisonUnit, state: MachineState): ExprTuple {

    if (comparison.left === null) {

      const res = this.execRelation(comparison.right, state)
      return res
    }

    if (comparison.op === null) {
      this.makeError('comarison op was null, must be one of ==, !==')
    }

    const leftRes = this.execRelation(comparison.left, state)
    const rightRes = this.execRelation(comparison.right, leftRes.state)

    if (leftRes.val !== null && rightRes.val !== null) {
      //both ints --> ok, result is nevertheless bool
      return {
        state: {
          ...rightRes.state,
          elapsedTimeInS: rightRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_comparison()
        },
        val: null,
        boolVal: comparison.op === "=="
          ? leftRes.val === rightRes.val
          : comparison.op === '!='
            ? leftRes.val !== rightRes.val
            : this.makeError('unknown comarison op, must be one of ==, !==')
      }
    }

    else if (leftRes.boolVal !== null && rightRes.boolVal !== null) {
      //both bools --> ok, result is nevertheless bool

      return {
        state: {
          ...rightRes.state,
          elapsedTimeInS: rightRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_comparison()
        },
        val: null,
        boolVal: comparison.op === "=="
          ? leftRes.boolVal === rightRes.boolVal
          : comparison.op === '!='
            ? leftRes.boolVal !== rightRes.boolVal
            : this.makeError('unknown comarison op, must be one of ==, !==')
      }
    }

    this.makeError('comparison operands must be of same type')
    return {
      val: null,
      state: rightRes.state,
      boolVal: null
    }
  }

  private static execRelation(relation: RelationUnit, state: MachineState): ExprTuple {

    if (relation.left === null) {
      const res = this.execSum(relation.right, state)
      return res
    }

    if (relation.op === null) {
      this.makeError('no op for relation, expected one of <, >, <=, >=')
      return {
        val: null,
        state,
        boolVal: null
      }
    }

    const sumRes = this.execSum(relation.left, state)
    const rightSumRes = this.execSum(relation.right, sumRes.state)

    if (sumRes.boolVal !== null) {
      this.makeError('relation left type is bool but need to be int')
      return {
        val: null,
        state: rightSumRes.state,
        boolVal: null
      }
    }

    if (rightSumRes.boolVal !== null) {
      this.makeError('relation right type is bool but need to be int')
      return {
        val: null,
        state: rightSumRes.state,
        boolVal: null
      }
    }

    if (sumRes.val !== null && rightSumRes.val !== null) {
      return {
        state: {
          ...rightSumRes.state,
          elapsedTimeInS: rightSumRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_relation()
        },
        val: null,
        boolVal: relation.op === '<'
          ? sumRes.val < rightSumRes.val
          : relation.op === '>'
            ? sumRes.val > rightSumRes.val
            : relation.op === '>='
              ? sumRes.val >= rightSumRes.val
              : relation.op === '<='
                ? sumRes.val <= rightSumRes.val
                : this.makeError('unknown sum op')
      }
    }

    this.makeError('internal error on relation')
    return {
      val: errorVal,
      state: rightSumRes.state,
      boolVal: null
    }
  }

  private static execSum(sum: SumUnit, state: MachineState): ExprTuple {

    if (sum.left === null) {
      const res = this.execTerm(sum.right, state)
      return res
    }

    //we have a sum

    //sum + term
    const sumRes = this.execSum(sum.left, state)
    const termRes = this.execTerm(sum.right, sumRes.state)

    if (sum.op === null) {
      this.makeError('no op for sum, expected on of +, -')
      return {
        val: errorVal,
        state: termRes.state,
        boolVal: null
      }
    }

    if (sumRes.boolVal !== null) {
      this.makeError('sum (+,-) ops cannot have bool args')
      return {
        val: null,
        boolVal: null,
        state: termRes.state,
      }
    }

    if (termRes.boolVal !== null) {
      this.makeError('sum (+,-) ops cannot have bool args')
      return {
        val: null,
        boolVal: null,
        state: termRes.state,
      }
    }

    return {
      state: {
        ...termRes.state,
        elapsedTimeInS: termRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_sum()
      },
      boolVal: null,
      val: sum.op === '+'
        ? sumRes.val + termRes.val
        : sum.op === '-'
          ? sumRes.val - termRes.val
          : this.makeError('unknown sum op')
    }
  }

  private static execTerm(term: TermUnit, state: MachineState): ExprTuple {

    if (term.left === null) {
      const res = this.execFactor(term.right, state)
      return res
    }


    if (term.op === null) {
      this.makeError('no op for term')
      return {
        val: null,
        boolVal: null,
        state,
      }
    }

    const termRes = this.execTerm(term.left, state)

    if (termRes.boolVal !== null) {
      this.makeError('mul (*,/,%) ops cannot have bool args')
      return {
        val: null,
        boolVal: null,
        state: termRes.state,
      }
    }

    const factorRes = this.execFactor(term.right, termRes.state)

    if (factorRes.boolVal !== null) {
      this.makeError('mul (*,/,%) ops cannot have bool args')
      return {
        val: null,
        boolVal: null,
        state,
      }
    }

    return {
      state: {
        ...factorRes.state,
        elapsedTimeInS: factorRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_term()
      },
      boolVal: null,
      val: term.op === '*'
        ? this.forceIntVal(termRes.val * factorRes.val)
        : term.op === '/'
          ? this.forceIntVal(termRes.val / factorRes.val)
          : term.op === '%'
            ? this.forceIntVal(termRes.val % factorRes.val)
            : this.makeError('unknown op for term')
    }
  }

  private static execFactor(factor: FactorUnit, state: MachineState): ExprTuple {


    if (factor.left === null) {
      //this has no un op
      const res = this.execPrimary(factor.right, state)
      return res
    }

    const factorRes = this.execFactor(factor.left, state)

    if (factorRes.boolVal !== null) {
      return {
        state: {
          ...factorRes.state,
          elapsedTimeInS: factorRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_factor()
        },
        val: null,
        boolVal: factor.unOp === "not"
          ? !factorRes.boolVal
          : factorRes.boolVal
      }
    }

    return {
      state: {
        ...factorRes.state,
        elapsedTimeInS: factorRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_factor()
      },
      boolVal: null,
      val: factor.unOp === '+'
        ? factorRes.val
        : -factorRes.val
    }
  }

  private static execPrimary(primary: PrimaryUnit, state: MachineState): ExprTuple {


    switch (primary.primary.type) {
      case "expression": { // we have brackets

        const res = this.execExpression(primary.primary, state)
        return res
      }

      case "primary_ident_leftSteps": {

        return {
          val: state.leftDiceValue,
          boolVal: null,
          state: {
            ...state,
            elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_leftSteps()
          }
        }
      }

      case "primary_roll_dice_func": {

        //this is already set inside roll and expressions

        let maxDiceValue: number = state.maxDiceValue

        if (primary.primary.maxValExpr !== null) {
          const exprRes = this.execExpression(primary.primary.maxValExpr, state)

          if (exprRes.val === null) {
            this.makeError('roll dice argument must return an int')
          }

          maxDiceValue = exprRes.val
          state = exprRes.state
        }

        const rollRes = this.rollDice(state, 1, maxDiceValue) //time is set here

        return {
          state: {...rollRes.state}, //here is no copy needed but we may change roll dice in the future?
          boolVal: null,
          val: rollRes.diceValue
        }
      }

      case "primary_choose_bool_func": {

        const chosenValue = this.rollDice(state, 0, 1) //time is set here

        return {
          state: {
            ...chosenValue.state,
            elapsedTimeInS: (chosenValue.state.elapsedTimeInS - SimulationTimes.timeInS_rollDice()) + SimulationTimes.timeInS_choose_bool_func()
          },
          val: null,
          boolVal: chosenValue.diceValue === 1,
        }

      }

      case "primary_constant": {

        if (primary.primary.intValue !== null) {
          return {
            val: primary.primary.intValue,
            boolVal: null,
            state: {
              ...state,
              elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_constant()
            }
          }
        }

        if (primary.primary.boolVal !== null) {
          return {
            val: null,
            boolVal: primary.primary.boolVal,
            state: {
              ...state,
              elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_constant()
            }
          }
        }

        this.makeError('constant is no int, bool')
        return {
          boolVal: null,
          val: null,
          state
        }
      }

      case "primary_decrement":
      case "primary_increment": {
        return this.execPrimary_inc_or_decrement(primary.primary, state)
      }

      //normal x
      case "primary_ident": {

        return this.execPrimary_ident(primary.primary, state)
      }

      //cp.x --> no global/local var
      case "primary_player_var_ident": {

        return this.execPrimary_player_var(primary.primary, state)
      }

      case "primary_ident_last_result": {

        const lastVal = state.players[state.currentPlayerIndex].lastReturnedValue

        if (lastVal === undefined) {
          this.makeError('last result value was not set yet')
        }

        return {
          boolVal: (typeof lastVal === "boolean")
            ? lastVal
            : null,
          val: (typeof lastVal === "number")
            ? lastVal
            : null,
          state: {
            ...state,
            elapsedTimeInS: state.elapsedTimeInS + SimulationTimes._timeInS_expr_primary_ident //time like accessing a var
          }
        }

      }

      case "primary_num_players": {

        return {
          boolVal: null,
          val: state.players.length,
          state: {
            ...state,
            elapsedTimeInS: state.elapsedTimeInS + SimulationTimes._timeInS_expr_primary_constant
          }
        }

      }

      default:
        notExhaustiveThrow(primary.primary)
    }

  }


  private static execPrimary_inc_or_decrement(
    primary: PrimaryIncrementUnit | PrimaryDecrementUnit, state: MachineState): ExprTuple {

    const increment = primary.type === "primary_increment"

    if (primary.player !== null) { //this must be a player var (no global/local var)

      const playerIndex = this.getSomePlayerIndex(primary.player, state, 'primary_increment invalid player')
      const playerDefTabEntry = state.players[playerIndex].defTable[primary.ident]

      if (playerDefTabEntry === undefined) {
        this.makeError(`def tab entry for player ident ${primary.ident} not found`)
        return {
          state,
          val: null,
          boolVal: null
        }
      }

      if (isBoolVar(playerDefTabEntry)) {
        this.makeError(`bool var player ident ${primary.ident} cannot be increment (only ints)`)
        return {
          val: null,
          boolVal: null,
          state
        }
      }

      const newVal = playerDefTabEntry.val + (increment
        ? 1
        : -1)


      const copy: ExprTuple = {
        val: primary.isPost
          ? playerDefTabEntry.val   //   [some player].x++
          : newVal,                 //++[some player].x
        boolVal: null,
        state: {
          ...state,
          players: state.players.map((p, index) => index !== playerIndex
            ? p
            : {
              ...p,
              defTable: {
                ...p.defTable,
                [primary.ident]: {
                  val: this.circularArithmeticVal(
                    newVal, playerDefTabEntry.maxVal + 1,
                    playerDefTabEntry.maxVal
                  ),
                  maxVal: playerDefTabEntry.maxVal,
                  ident: primary.ident
                } as DefinitionTableIntEntry
              }
            } as PlayerObj),
          elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_incrementOrDecrement()
        }
      }
      return copy
    }

    //player is not explicitly set (e..g only x++)

    //so check local vars only for current player

    if (state.players[state.currentPlayerIndex].localDefTables.length > 0) {

      let scopeIndex = state.players[state.currentPlayerIndex].localDefTables.length - 1

      while (scopeIndex >= 0) {
        const currentDefTableScope: DefinitionTableWrapper = state.players[state.currentPlayerIndex].localDefTables[scopeIndex]

        if (currentDefTableScope.isScopeLimited) {
          //not search any further outer scopes
          break
        }

        const entry = currentDefTableScope.defTable[primary.ident]

        if (entry === undefined) {
          scopeIndex--
          continue
        }

        if (isBoolVar(entry)) {
          this.makeError(`bool local ident ${primary.ident} cannot be increment (only ints)`)
          return {
            val: null,
            boolVal: null,
            state
          }
        }

        const newVal = entry.val + (increment
          ? 1
          : -1)

        const copy: ExprTuple = {
          val: primary.isPost
            ? entry.val               //   x++
            : newVal,                 // ++x
          boolVal: null,
          state: {
            ...state,
            players: state.players.map((p, index) => index !== state.currentPlayerIndex
              ? p
              : {
                ...p, //only change the def table in the scope where we found the var
                localDefTables: p.localDefTables.map(
                  (value, defTableIndex) => defTableIndex !== scopeIndex
                    ? value
                    : {
                      ...value,
                      defTable: {
                        ...value.defTable,
                        [primary.ident]: {
                          val: this.circularArithmeticVal(
                            newVal, entry.maxVal + 1, entry.maxVal),
                          maxVal: entry.maxVal,
                          ident: primary.ident
                        } as DefinitionTableIntEntry
                      }
                    }),
              } as PlayerObj),
            elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_incrementOrDecrement()
          }
        }
        return copy

      }
    }


    //check for implicit player var

    const playerDefTabEntry = state.players[state.currentPlayerIndex].defTable[primary.ident]

    if (playerDefTabEntry !== undefined) {

      if (isBoolVar(playerDefTabEntry)) {
        this.makeError(`bool var player ident ${primary.ident} cannot be increment (only ints)`)
        return {
          val: null,
          boolVal: null,
          state
        }
      }

      const newVal = playerDefTabEntry.val + (increment
        ? 1
        : -1)

      const copy: ExprTuple = {
        val: primary.isPost
          ? playerDefTabEntry.val   //   [some player].x++
          : newVal,                 //++[some player].x
        boolVal: null,
        state: {
          ...state,
          players: state.players.map((p, index) => index !== state.currentPlayerIndex
            ? p
            : {
              ...p,
              defTable: {
                ...p.defTable,
                [primary.ident]: {
                  val: this.circularArithmeticVal(
                    newVal, playerDefTabEntry.maxVal + 1,
                    playerDefTabEntry.maxVal
                  ),
                  maxVal: playerDefTabEntry.maxVal,
                  ident: primary.ident
                } as DefinitionTableIntEntry
              }
            } as PlayerObj),
          elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_incrementOrDecrement()
        }
      }
      return copy
    }


    //global var

    const defTabEntry = state.globalDefTable[primary.ident]

    if (!defTabEntry) {
      this.makeError(`global def tab entry for ident ${primary.ident} not found`)
      return {
        state,
        val: null,
        boolVal: null
      }
    }

    if (isBoolVar(defTabEntry)) {
      this.makeError(`global bool var ident ${primary.ident} cannot be increment (only ints)`)
      return {
        val: null,
        boolVal: null,
        state
      }
    }

    const newVal = defTabEntry.val + (increment
      ? 1
      : -1)

    const copy: ExprTuple = {
      val: primary.isPost
        ? defTabEntry.val             //   x++
        : newVal,                     // ++x
      boolVal: null,
      state: {
        ...state,
        globalDefTable: {
          ...state.globalDefTable,
          [primary.ident]: {
            ident: primary.ident,
            val: this.circularArithmeticVal(newVal, defTabEntry.maxVal + 1, defTabEntry.maxVal),
            maxVal: defTabEntry.maxVal
          }
        },
        elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_incrementOrDecrement()
      }
    }
    return copy
  }

  /**
   * we explicitly used: cp.x
   * @param {PrimaryPlayerVarIdentUnit} primary
   * @param {MachineState} state
   * @returns {ExprTuple}
   */
  private static execPrimary_player_var(primary: PrimaryPlayerVarIdentUnit, state: MachineState): ExprTuple {

    let playerIndex = this.getSomePlayerIndex(primary.player, state, 'primary_player_var_ident unknown player')

    const entry = state.players[playerIndex].defTable[primary.ident]

    if (!entry) {
      this.makeError(`primary_player_var_ident unknown var ${primary.ident} for player`)
    }

    return this.getDefTableVariable(entry, state,
      `primary_player_var_ident unknown var ${primary.ident} unknown type??`
    )

  }

  /**
   * normal varialbe usage: x
   * @param {PrimaryIdentUnit} primary
   * @param {MachineState} state
   * @returns {ExprTuple}
   */
  private static execPrimary_ident(primary: PrimaryIdentUnit, state: MachineState): ExprTuple {

    //check all local variable scopes
    //then check cp.x
    //then check global var x
    //else throw error

    //check local variable

    if (state.players[state.currentPlayerIndex].localDefTables.length > 0) {

      let scopeIndex = state.players[state.currentPlayerIndex].localDefTables.length - 1

      while (scopeIndex >= 0) {
        const currentDefTableScope: DefinitionTableWrapper = state.players[state.currentPlayerIndex].localDefTables[scopeIndex]

        if (currentDefTableScope.isScopeLimited) {
          //not search any further outer scopes
          break
        }

        const entry = currentDefTableScope.defTable[primary.ident]

        if (entry === undefined) {
          scopeIndex--
          continue
        }

        //we found a local variable
        return this.getDefTableVariable(entry, state, `no type found for ident ${primary.ident}`)
      }
    }


    //check cp.x (player variable)
    if (state.players[state.currentPlayerIndex].defTable[primary.ident]) {

      return this.execPrimary_player_var({
        player: state.currentPlayerIndex,
        ident: primary.ident,
        type: "primary_player_var_ident"
      }, state)
    }

    //check global variable

    const defTabEntry = state.globalDefTable[primary.ident]

    if (!defTabEntry) {
      this.makeError(`variable ${primary.ident} was not found (searched all scopes)`)
    }

    return this.getDefTableVariable(defTabEntry, state, `no type found for ident ${primary.ident}`)

  }

  private static getDefTableVariable(defTabEntry: DefinitionTableBoolEntry | DefinitionTableIntEntry,
                                     state: MachineState, errorMessage: string
  ): ExprTuple {
    if (isIntVar(defTabEntry)) {
      const varVal = defTabEntry.val
      return {
        val: varVal,
        boolVal: null,
        state: {
          ...state,
          elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_ident()
        }
      }
    }

    if (isBoolVar(defTabEntry)) {
      const varVal = defTabEntry.boolVal
      return {
        val: null,
        boolVal: varVal,
        state: {
          ...state,
          elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_ident()
        }
      }
    }

    this.makeError(errorMessage)
  }

  //--- end expressions

  /**
   * returns the right player index for the given player in the given state
   * @param {SomePlayer} somePlayer
   * @param {MachineState} state
   * @param {string} errorMessage used when an invalid player is used
   * @returns {number}
   */
  private static getSomePlayerIndex(somePlayer: SomePlayer, state: MachineState, errorMessage: string): number {
    return somePlayer === SomePlayer.currentPlayer
      ? state.currentPlayerIndex
      : somePlayer === SomePlayer.nextPlayer
        ? state.nextPlayerIndex
        : somePlayer === SomePlayer.previousPlayer
          ? state.previousPlayerIndex
          : this.makeError(errorMessage)
  }

  /**
   *
   * @param {number} val
   * @param {number} minAbsVal e.g. if we use -16 this param should be 16
   * @param {number} maxVal
   */
  private static circularArithmeticVal(val: number, minAbsVal: number, maxVal: number) {

    // -16 till 15 = 32 (31 + zero)
    // -2 till 1 = [0, 1, 2, 3]
    const shiftedMaxVal = minAbsVal + maxVal + 1
    const lowerBound = -minAbsVal

    if (lowerBound === val) {
      return val;
    }

    let clampedVal = 0

    //TODO is this correct
    if (val <= 0) {
      clampedVal = ((val + lowerBound) % shiftedMaxVal) - lowerBound
    } else {
      clampedVal = ((val - lowerBound) % shiftedMaxVal) + lowerBound
    }


    // while (val < lowerBound || val > maxVal) {
    //   if (val < lowerBound) {
    //     const diff = val + minVal // -17 + 16 --> 1
    //     val = maxVal - (diff - 1)
    //
    //   } else if (val > maxVal) {
    //     const diff = val - maxVal
    //     val = lowerBound + diff
    //   }
    // }

    return clampedVal
  }


  /**
   * because we have no floats e.g. / needs to be corrected to int (floor)
   * @param {number} val
   * @returns {number}
   */
  public static forceIntVal(val: number) {
    return Math.floor(val)
  }

  private static makeError(message: string): never {

    //console.error(message)
    throw  Error(message)

  }

  private static builtIn_log(val: any) {
    console.log(val)
  }

}


interface ExprTuple {
  readonly state: MachineState
  readonly val: number | null
  readonly boolVal: boolean | null
}
