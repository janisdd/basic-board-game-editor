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
  ForceUnit,
  GameUnit,
  GotoUnit,
  IfElseUnit,
  IfUnit, LimitScopeUnit,
  LogUnit,
  MoveFunc,
  PlayerVarAssignUnit,
  PrimaryChooseBoolFunc,
  PrimaryConstantUnit,
  PrimaryDecrementUnit,
  PrimaryIdentLastResult,
  PrimaryIdentLeftStepsUnit,
  PrimaryIdentUnit,
  PrimaryIncrementUnit, PrimaryNumPlayers,
  PrimaryPlayerVarIdentUnit,
  PrimaryRollDiceFunc,
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
import {GameDefUnits, GameVarsUnit, PlayersDefUnit} from "../model/gameDefUnits";

export class ExecutionUnitBuilder {
  private constructor() {
  }


  public static buildGameUnit(game_def_stats: GameDefUnits[], statements: StatementUnit[]): GameUnit {
    return {
      type: "game",
      game_def_stats,
      statements
    }
  }

  public static buildStartUnit(startCondition: ExpressionUnit | null): StartUnit {
    return {
      type: "start",
      startCondition
    }
  }

  public static buildEndUnit(): EndUnit {
    return {
      type: "end"
    }
  }

  public static buildLogUnit(expr: ExpressionUnit): LogUnit {
    return {
      type: "log",
      expr
    }
  }

  public static gotoUnit(targetId: number): GotoUnit {
    return {
      type: 'goto',
      targetId: targetId
    }
  }


  public static expressionUnit(right: TernaryExpressionUnit | AssignmentUnit): ExpressionUnit {
    return {
      type: 'expression',
      right
    }
  }

  public static assignmentUnit(ident: string, expr: ExpressionUnit): AssignmentUnit {
    return {
      type: 'assignment',
      ident,
      expr
    }
  }

  public static playerVarAssignUnit(player: SomePlayer, ident: string, expr: ExpressionUnit): PlayerVarAssignUnit {
    return {
      type: 'player_var_assign',
      ident,
      player,
      expr
    }
  }


  public static varDeclUnit(ident: string, var_type: VarType, maxVal: number | null, expr: ExpressionUnit): VarDeclUnit {
    return {
      type: "var_decl",
      expr,
      ident,
      var_type,
      maxVal
    }
  }

  //--- expressions

  public static ternaryExpressionUnit(disjunction: DisjunctionUnit | null, condition: DisjunctionUnit | null, trueExpression: ExpressionUnit | null, falseExpression: ExpressionUnit | null): TernaryExpressionUnit {
    return {
      type: 'ternary_expression',
      disjunction,
      condition,
      trueExpression,
      falseExpression
    }
  }

  public static disjunctionUnit(left: DisjunctionUnit | null, right: ConjunctionUnit): DisjunctionUnit {
    return {
      type: 'disjunction',
      left,
      right
    }
  }

  public static conjunctionUnit(left: ConjunctionUnit | null, right: ComparisonUnit): ConjunctionUnit {
    return {
      type: 'conjunction',
      left,
      right
    }
  }

  public static comparisonUnit(left: RelationUnit | null, right: RelationUnit, op: '==' | '!=' | null): ComparisonUnit {
    return {
      type: 'comparison',
      left,
      right,
      op
    }
  }

  public static relationUnit(left: SumUnit | null, right: SumUnit, op: '>' | '<' | '>=' | '<=' | null): RelationUnit {
    return {
      type: 'relation',
      left,
      right,
      op
    }
  }

  public static sumUnit(left: SumUnit | null, right: TermUnit, op: '+' | '-' | null): SumUnit {
    return {
      type: 'sum',
      left,
      right,
      op
    }
  }

  public static termUnit(left: TermUnit | null, right: FactorUnit, op: '*' | '/' | '%' | null): TermUnit {
    return {
      type: 'term',
      left,
      right,
      op
    }
  }

  public static factorUnit(left: FactorUnit | null, right: PrimaryUnit | null, unOp: '+' | '-' | 'not' | null): FactorUnit {
    return {
      type: 'factor',
      left,
      right,
      unOp
    }
  }

  public static primaryUnit(primary: PrimaryConstantUnit | PrimaryIdentUnit | ExpressionUnit | PrimaryIncrementUnit | PrimaryDecrementUnit): PrimaryUnit {
    return {
      type: 'primary',
      primary
    }
  }

  public static primaryConstantUnit_int(constant: number): PrimaryConstantUnit {
    return {
      type: 'primary_constant',
      intValue: constant,
      boolVal: null
    }
  }

  public static primaryConstantUnit_bool(constant: boolean): PrimaryConstantUnit {
    return {
      type: 'primary_constant',
      intValue: null,
      boolVal: constant
    }
  }

  public static primaryIdentUnit(ident: string): PrimaryIdentUnit {
    return {
      type: 'primary_ident',
      ident
    }
  }

  public static primaryIdentLeftStepsUnit(): PrimaryIdentLeftStepsUnit {
    return {
      type: 'primary_ident_leftSteps',
    }
  }
  public static primaryIdentLastResult(): PrimaryIdentLastResult {
    return {
      type: 'primary_ident_last_result',
    }
  }

  public static primaryRollDiceFunc(maxValExpr: ExpressionUnit | null): PrimaryRollDiceFunc {
    return {
      type: 'primary_roll_dice_func',
      maxValExpr
    }
  }

  public static primaryChooseBoolFunc(): PrimaryChooseBoolFunc {
    return {
      type: 'primary_choose_bool_func',
    }
  }

  public static primaryIncrementUnit(ident: string, isPost: boolean, player: SomePlayer | null): PrimaryIncrementUnit {
    return {
      type: 'primary_increment',
      ident,
      isPost,
      player
    }
  }

  public static primaryDecrementUnit(ident: string, isPost: boolean, player: SomePlayer | null): PrimaryDecrementUnit {
    return {
      type: 'primary_decrement',
      ident,
      isPost,
      player
    }
  }

  public static primaryPlayerVarIdentUnit(who: SomePlayer, ident: string): PrimaryPlayerVarIdentUnit {
    return {
      type: 'primary_player_var_ident',
      ident,
      player: who
    }
  }

  public static primaryNumPlayers(): PrimaryNumPlayers {
    return {
      type: 'primary_num_players',
    }
  }

  //--- END expressions

  public static ifUnit(conditionExpr: ExpressionUnit, trueUnits: StatementUnit[]): IfUnit {
    return {
      type: "if",
      trueUnits,
      conditionExpr
    }
  }

  public static ifElseUnit(conditionExpr: ExpressionUnit, trueUnits: StatementUnit[], falseUnits: StatementUnit[]): IfElseUnit {
    return {
      type: "ifElse",
      trueUnits,
      falseUnits,
      conditionExpr
    }
  }

  public static forceUnit(): ForceUnit {
    return {
      type: "force",
    }
  }

  public static controlIfElseUnit(conditionExpr: ExpressionUnit, trueTargetId: number, falseTargetId: number): ControlIfElseUnit {
    return {
      type: "control_ifElse",
      conditionExpr,
      falseTargetId,
      trueTargetId
    }
  }

  public static controlGotoUnit(targetId: number): ControlGotoUnit {
    return {
      type: "control_goto",
      targetId
    }
  }

  public static moveFunc(numStepsExpr: ExpressionUnit): MoveFunc {
    return {
      type: "move_func",
      numStepsExpr
    }
  }

  public static rollbackFunc(): RollbackFunc {
    return {
      type: "rollback_func",
    }
  }

  public static sleepFunc(player: SomePlayer, roundsExpr: ExpressionUnit): SleepFunc {
    return {
      type: "sleep_func",
      player,
      roundsExpr
    }
  }

  public static beginScope(): BeginScopeUnit {
    return {
      type: "begin_scope",
    }
  }

  public static setReturnResult(expr: ExpressionUnit): SetReturnResultUnit {
    return {
      type: "set_return_result",
      expr
    }
  }

  public static limitScope(): LimitScopeUnit {
    return {
      type: "limit_scope",
    }
  }

  public static endScope(): EndScopeUnit {
    return {
      type: "end_scope",
    }
  }



  //game defs

  public static playersDefUnit(numPlayers: number, numTokensPerPlayer: number, vars: VarDeclUnit[]): PlayersDefUnit {
    return {
      type: "players_def",
      vars,
      numPlayers,
      numTokensPerPlayer
    }
  }

  public static gameVarsUnit(maxDiceValue: number | null, endCondition: ExpressionUnit | null, vars: VarDeclUnit[]): GameVarsUnit {
    return {
      type: "game_vars",
      maxDiceValue: maxDiceValue === null ? 6 : maxDiceValue,
      endCondition,
      vars
    }
  }


}

function convertString(stringWithQuotes: string): string {
  return stringWithQuotes.substr(1, stringWithQuotes.length - 2)
}

export function convertNumber(num: string): number | null {

  let result = parseFloat(num)

  if (isNaN(result)) {
    return null
  }

  return result
}


