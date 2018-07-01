import {Compiler} from "../compiler/compiler";
import {isBoolVar, isIntVar, MachineState} from "../machine/machineState";
import {AbstractMachine} from "../machine/AbstractMachine";
import {GameUnit} from "../model/executionUnit";

//all tests with runWithVar depend on var decl to work properly!!!

const langCompiler = require('../compiler/langCompiler').parser

export function getCompiler(): Compiler {
  let comp = new Compiler(langCompiler as any)
  return comp
}

export function runForLocalVar(prog: string, localVar: string = 'x'): number |boolean | undefined {

  const game = getCompiler().parse(prog)
  let state = AbstractMachine.createNewMachineState()

  const state1 = AbstractMachine.executeAllGameDefinitionStatements(game.game_def_stats, state)

  const resState = AbstractMachine.executeAll(game.statements, state1)

  const entry = resState.players[resState.currentPlayerIndex].localDefTables[0].defTable[localVar]

  if (entry === undefined) {
    throw new Error(`var local var x not found, maybe param is wrong or not defined in program`)
  }

  if (isIntVar(entry)) {
    return entry.val
  }

  if (isBoolVar(entry)) {
    return entry.boolVal
  }

  return undefined
}

export function runForState(prog: string): MachineState {

  const game = getCompiler().parse(prog)
  let state = AbstractMachine.createNewMachineState()

  const state1 = AbstractMachine.executeAllGameDefinitionStatements(game.game_def_stats, state)

  const resState = AbstractMachine.executeAll(game.statements, state1)

  return resState
}

export function justParse(prog: string): GameUnit  {
  const game = getCompiler().parse(prog)
  return game
}

export function runWithOtherVar(prog: string, varIdent: string): any {

  const game = getCompiler().parse(prog)
  let state = AbstractMachine.createNewMachineState()

  const state1 = AbstractMachine.executeAllGameDefinitionStatements(game.game_def_stats, state)

  const resState = AbstractMachine.executeAll(game.statements, state1)

  if (resState.players[resState.currentPlayerIndex].defTable[varIdent] === undefined) {
    throw new Error(`var ident ${varIdent} not found, maybe param is wrong or not defined in program`)
  }

  const entry = resState.players[resState.currentPlayerIndex].defTable[varIdent]

  if (isIntVar(entry)) {
    return entry.val
  }

  if (isBoolVar(entry)) {
    return entry.boolVal
  }

  return undefined
}