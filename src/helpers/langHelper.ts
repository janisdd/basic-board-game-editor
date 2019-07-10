import {Tile} from "../types/world";
import {
  ComparisonUnit, ConjunctionUnit, DisjunctionUnit,
  ExpressionUnit, FactorUnit,
  GameUnit,
  PrimaryIdentUnit,
  PrimaryPlayerVarIdentUnit, PrimaryUnit, RelationUnit,
  SomeExprUnits,
  StatementUnit, SumUnit, TermUnit,
  TernaryExpressionUnit,
  VarDeclUnit
} from "../../simulation/model/executionUnit";
import {Logger} from "./logger";
import {AbstractMachine} from "../../simulation/machine/AbstractMachine";
import {Compiler} from "../../simulation/compiler/compiler";
import {notExhaustive} from "../state/reducers/_notExhausiveHelper";
import {MachineState, WorldSimulationPosition} from "../../simulation/machine/machineState";

const langCompiler = require('../../simulation/compiler/langCompiler').parser


/**
 * because we pop the scopes we would lose the vars... store all with scope level
 */
interface LocalVarDefs {
  readonly scopeLevel: number
  readonly localVars: VarDeclUnit[]
}


interface LocalVarPair {
  readonly scopLevel: number
  readonly localVar: VarDeclUnit
}

interface AllDefinitionsObj {
  /**
   * the var definitions found in the game init code
   */
  globalVars: VarDeclUnit[]
  /**
   * the var definitions found in the player section (in game init code)
   */
  playerVars: VarDeclUnit[]

  /**
   * store all scopes we every found in the game
   * this excludes
   * @see globalVars and
   * @see playerVars
   */
  localVars: LocalVarDefs[]
}

/**
 * stores only the current visible vars
 */
export interface ChangingDefinitionsObj {
  /**
   * the var definitions found in the game init code
   */
  globalVars: VarDeclUnit[]
  /**
   * the var definitions found in the player section (in game init code)
   */
  playerVars: VarDeclUnit[]
  /**
   * store all scopes we every found in the game
   * this excludes
   * @see globalVars and
   * @see playerVars
   */
  localVars: LocalVarPair[]

  currentScopeIndex: number

  isScopeLimit: boolean
}

export class LangHelper {

  public static readonly compiler: Compiler = new Compiler(langCompiler)

  private constructor() {
  }


  public static executeGameInitCode(gameInitCode: string): MachineState {

    let state = AbstractMachine.createNewMachineState()

    let game: GameUnit = null

    try {
      game = this.compiler.parse(gameInitCode)
    } catch (err) {
      Logger.fatalSyntaxError(`game init code has parse errors: ${err}`)
      return
    }

    for (const stat of game.game_def_stats) {
      state = AbstractMachine.executeGameDefinitionStatement(stat, state)
    }

    return state
  }

  public static getAllVarDefiningStatements(gameInitCode: string, tiles: ReadonlyArray<Tile>): AllDefinitionsObj {

    let result: AllDefinitionsObj = {
      globalVars: [],
      localVars: [],
      playerVars: []
    }

    let game: GameUnit = null
    let state = AbstractMachine.createNewMachineState()

    try {
      game = this.compiler.parse(gameInitCode)
    } catch (err) {
      Logger.fatalSyntaxError(`game init code has parse errors: ${err}`)
      return
    }

    for (const stat of game.game_def_stats) {
      state = AbstractMachine.executeGameDefinitionStatement(stat, state)

      if (stat.type === "game_vars") {
        for (const globalVarDef of stat.vars) {
          result.globalVars.push(globalVarDef)
        }
      }

      if (stat.type === "players_def") {
        for (const playerVar of stat.vars) {
          result.playerVars.push(playerVar)
        }
      }
    }


    let currentScope: LocalVarDefs = {
      scopeLevel: 0,
      localVars: []
    }
    let lastScopes: LocalVarDefs[] = [currentScope]
    result.localVars.push(currentScope)

    //now get the local vars
    this.getAllDefinitions(result, lastScopes, game.statements)


    //check that all variables are defined is not done here...

    //get all local var definitions we can discover when executing every single field

    let unit: GameUnit
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i]

      for (let j = 0; j < tile.fieldShapes.length; j++) {
        const fieldShape = tile.fieldShapes[j]

        if (fieldShape.cmdText === null) continue

        try {
          unit = this.compiler.parse(fieldShape.cmdText)
        } catch (err) {
          Logger.fatalSyntaxError(`field ${fieldShape.id} on tile ${tile.guid} has parse errors: ${err}`)
          return
        }


        this.getAllDefinitions(result, lastScopes, unit.statements)
      }
    }

    return result
  }


  /**
   * captures all var declaration in result in the given statements
   * begin and end scopes are respected properly
   * @param result store all scopes we every found in the game
   * @param lastScopes the current working scopes (e.g. if we have 2 level 2 scopes we would precess the first then pop it then process the next
   *   where the result will contain both scopes)
   * @param statements
   */
  private static getAllDefinitions(result: AllDefinitionsObj,
                                   lastScopes: LocalVarDefs[],
                                   statements: ReadonlyArray<StatementUnit>) {

    let currentScope = lastScopes[lastScopes.length - 1]

    for (const statement of statements) {

      if (statement.type === "var_decl") {

        currentScope.localVars.push(statement)

      } else if (statement.type === "begin_scope") {

        currentScope = {
          scopeLevel: lastScopes.length,
          localVars: []
        }

        lastScopes.push(currentScope)
        result.localVars.push(currentScope)

      } else if (statement.type === "end_scope") {

        currentScope = lastScopes.pop()

      } else if (statement.type === "if") {

        this.getAllDefinitions(result, lastScopes, statement.trueUnits)

      } else if (statement.type === "ifElse") {

        this.getAllDefinitions(result, lastScopes, statement.trueUnits)
        this.getAllDefinitions(result, lastScopes, statement.falseUnits)
      }
    }

  }


  //we need to respect the scopes!!
  /**
   *
   * @param changingDefs the current definition table
   * @param statement
   * @param fieldPosition
   */
  public static checkAllVarUsagesInStatement(
    changingDefs: ChangingDefinitionsObj, statement: StatementUnit, fieldPosition: WorldSimulationPosition): void {

    let result: Array<PrimaryIdentUnit | PrimaryPlayerVarIdentUnit> = []


    switch (statement.type) {
      case "expression": {

        this.checkAllVarUsagesInExpression(changingDefs, statement, fieldPosition)

        break
      }

      case "ifElse": {

        for (const stat of statement.trueUnits) {
          this.checkAllVarUsagesInStatement(changingDefs, stat, fieldPosition)
        }

        for (const stat of statement.falseUnits) {
          this.checkAllVarUsagesInStatement(changingDefs, stat, fieldPosition)
        }

        break
      }
      case "if": {

        for (const stat of statement.trueUnits) {
          this.checkAllVarUsagesInStatement(changingDefs, stat, fieldPosition)
        }

        break
      }

      case "var_decl": {

        changingDefs.localVars.push({
          scopLevel: changingDefs.currentScopeIndex,
          localVar: statement
        })

        this.checkAllVarUsagesInExpression(changingDefs, statement.expr, fieldPosition)

        break
      }

      case "sleep_func": {

        this.checkAllVarUsagesInExpression(changingDefs, statement.roundsExpr, fieldPosition)

        break
      }

      case "move_func": {

        this.checkAllVarUsagesInExpression(changingDefs, statement.numStepsExpr, fieldPosition)

        break
      }
      case "set_return_result": {

        this.checkAllVarUsagesInExpression(changingDefs, statement.expr, fieldPosition)

        break
      }

      case "end_scope": {

        changingDefs.currentScopeIndex--
        break
      }
      case "begin_scope": {

        changingDefs.currentScopeIndex++
        break
      }

      case "limit_scope": {
        changingDefs.isScopeLimit = true
        break
      }

      case "goto":
      case "control_goto":
      case "control_ifElse":
      case "end":
      case "start":
      case "force":
      case "log":
      case "rollback_func": {
        break
      }

      default:
        notExhaustive(statement)

    }
  }

  public static checkAllVarUsagesInExpression(
    changingDefs: ChangingDefinitionsObj, _expr: ExpressionUnit, fieldPosition: WorldSimulationPosition) {


    this.traverseTree(_expr, treeNode => {

      if (treeNode.type === "assignment") {

        const isDefined = this.isGlobalOrLocalVarDefined(changingDefs, treeNode.ident, fieldPosition)

        if (!isDefined) {
          Logger.fatal(
            `var '${treeNode.ident}' assignment is not defined in the current scope, on field with id '${fieldPosition.fieldId}', on tile '${fieldPosition.tileGuid}'`)
        }

        this.checkAllVarUsagesInExpression(changingDefs, treeNode.expr, fieldPosition)
      } else if (treeNode.type === "player_var_assign") {

        const isDefined = changingDefs.playerVars.find(p => p.ident === treeNode.ident)

        if (!isDefined) {
          Logger.fatal(
            `player var '${treeNode.ident}' assignment is not defined in the current scope, on field with id '${fieldPosition.fieldId}', on tile '${fieldPosition.tileGuid}'`)
        }

        this.checkAllVarUsagesInExpression(changingDefs, treeNode.expr, fieldPosition)

      } else if (treeNode.type === "ternary_expression") {


        if (treeNode.disjunction) {
          //not a ternary expr but normal pass through
        } else {

          this.checkAllVarUsagesInExpression(changingDefs, treeNode.trueExpression, fieldPosition)
          this.checkAllVarUsagesInExpression(changingDefs, treeNode.falseExpression, fieldPosition)

          this.checkAllVarUsagesInExpression(changingDefs, {
            type: "expression",
            right: {
              type: "ternary_expression",
              disjunction: treeNode.condition,
              falseExpression: null,
              trueExpression: null,
              condition: null
            } as TernaryExpressionUnit
          }, fieldPosition)
        }

      } else if (treeNode.type === "primary_ident") {

        this.isGlobalOrLocalVarDefined(changingDefs, treeNode.ident, fieldPosition)

      } else if (treeNode.type === "primary_player_var_ident") {

        const isDefined = changingDefs.playerVars.find(p => p.ident === treeNode.ident)

        if (!isDefined) {
          Logger.fatal(
            `player var '${treeNode.ident}' is used but not defined, on field with id '${fieldPosition.fieldId}', on tile '${fieldPosition.tileGuid}'`)
        }
      } else if (treeNode.type === "primary_increment" || treeNode.type === "primary_decrement") {

        if (treeNode.player !== null) {
          const isDefined = changingDefs.playerVars.find(p => p.ident === treeNode.ident)

          if (!isDefined) {
            Logger.fatal(
              `player var '${treeNode.ident}' should be incremented but was not defined, on field with id '${fieldPosition.fieldId}', on tile '${fieldPosition.tileGuid}'`)
          }
        }

        this.isGlobalOrLocalVarDefined(changingDefs, treeNode.ident, fieldPosition)

      }

    })

  }

  private static isGlobalOrLocalVarDefined(
    changingDefs: ChangingDefinitionsObj, ident: string, fieldPosition: WorldSimulationPosition): boolean {


    let currentScopeIndex = changingDefs.currentScopeIndex


    if (changingDefs.isScopeLimit === false) {

      while (currentScopeIndex >= 0) {

        const isDefined = changingDefs.localVars.find(
          p => p.scopLevel === currentScopeIndex && p.localVar.ident === ident)

        if (isDefined) {
          //found all ok
          return true
        }

        //if not found search outer scope
        currentScopeIndex--
      }


    } else {
      //only current local scope
      const isDefined = changingDefs.localVars.find(
        p => p.scopLevel === currentScopeIndex && p.localVar.ident === ident)

      if (!isDefined) {
        Logger.fatal(
          `local var ${ident} was not defined, scope was limited, on field with id '${fieldPosition.fieldId}', on tile '${fieldPosition.tileGuid}'`)
      }
      return true
    }


    const globalDef = changingDefs.globalVars.find(p => p.ident === ident)

    if (!globalDef) {
      Logger.fatal(
        `var ${ident} was not defined, checked all scopes, on field with id '${fieldPosition.fieldId}', on tile '${fieldPosition.tileGuid}'`)
    }

    return true
  }


  public static traverseTree(_expr: ExpressionUnit, nodeAction: (treeNode: SomeExprUnits) => void) {

    const expr = _expr.right

    switch (expr.type) {

      case "assignment": {

        nodeAction(expr)

        break
      }
      case "player_var_assign": {

        nodeAction(expr)

        break
      }
      case "ternary_expression": {


        nodeAction(expr)

        if (expr.disjunction === null) break

        const disjunction = expr.disjunction
        this.traverseDisjunction(disjunction, nodeAction)

        break
      }

      default:
        notExhaustive(expr)
    }

  }

  public static traverseDisjunction(disjunctionUnit: DisjunctionUnit, nodeAction: (treeNode: SomeExprUnits) => void) {

    if (disjunctionUnit.left === null) {
      //pass through
      this.traverseConjunction(disjunctionUnit.right, nodeAction)
      return
    }

    this.traverseConjunction(disjunctionUnit.right, nodeAction)
    this.traverseDisjunction(disjunctionUnit.left, nodeAction)
  }

  public static traverseConjunction(conjunctionUnit: ConjunctionUnit, nodeAction: (treeNode: SomeExprUnits) => void) {

    if (conjunctionUnit.left === null) {
      //pass through
      this.traverseComparison(conjunctionUnit.right, nodeAction)
      return
    }

    this.traverseComparison(conjunctionUnit.right, nodeAction)
    this.traverseConjunction(conjunctionUnit.left, nodeAction)
  }

  public static traverseComparison(comparisonUnit: ComparisonUnit, nodeAction: (treeNode: SomeExprUnits) => void) {

    if (comparisonUnit.left === null) {
      //pass through
      this.traverseRelation(comparisonUnit.right, nodeAction)
      return
    }

    this.traverseRelation(comparisonUnit.right, nodeAction)
    this.traverseRelation(comparisonUnit.left, nodeAction)
  }

  public static traverseRelation(relationUnit: RelationUnit, nodeAction: (treeNode: SomeExprUnits) => void) {

    if (relationUnit.left === null) {
      //pass through
      this.traverseSum(relationUnit.right, nodeAction)
      return
    }

    this.traverseSum(relationUnit.right, nodeAction)
    this.traverseSum(relationUnit.left, nodeAction)
  }

  public static traverseSum(sumUnit: SumUnit, nodeAction: (treeNode: SomeExprUnits) => void) {

    if (sumUnit.left === null) {
      //pass through
      this.traverseTerm(sumUnit.right, nodeAction)
      return
    }

    this.traverseTerm(sumUnit.right, nodeAction)
    this.traverseSum(sumUnit.left, nodeAction)
  }

  public static traverseTerm(termUnit: TermUnit, nodeAction: (treeNode: SomeExprUnits) => void) {

    if (termUnit.left === null) {
      //pass through
      this.traverseFactor(termUnit.right, nodeAction)
      return
    }

    this.traverseFactor(termUnit.right, nodeAction)
    this.traverseTerm(termUnit.left, nodeAction)
  }

  public static traverseFactor(factorUnit: FactorUnit, nodeAction: (treeNode: SomeExprUnits) => void) {

    if (factorUnit.left === null) {
      //pass through
      this.traversePrimary(factorUnit.right, nodeAction)
      return
    }

    this.traversePrimary(factorUnit.right, nodeAction)
    this.traverseFactor(factorUnit.left, nodeAction)
  }

  public static traversePrimary(primaryUnit: PrimaryUnit, nodeAction: (treeNode: SomeExprUnits) => void) {
    nodeAction(primaryUnit.primary)
  }

}
