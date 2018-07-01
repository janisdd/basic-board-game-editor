"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExecutionUnitBuilder = /** @class */ (function () {
    function ExecutionUnitBuilder() {
    }
    ExecutionUnitBuilder.buildGameUnit = function (game_def_stats, statements) {
        return {
            type: "game",
            game_def_stats: game_def_stats,
            statements: statements
        };
    };
    ExecutionUnitBuilder.buildStartUnit = function (startCondition) {
        return {
            type: "start",
            startCondition: startCondition
        };
    };
    ExecutionUnitBuilder.buildEndUnit = function () {
        return {
            type: "end"
        };
    };
    ExecutionUnitBuilder.buildLogUnit = function (expr) {
        return {
            type: "log",
            expr: expr
        };
    };
    ExecutionUnitBuilder.gotoUnit = function (targetId) {
        return {
            type: 'goto',
            targetId: targetId
        };
    };
    ExecutionUnitBuilder.expressionUnit = function (right) {
        return {
            type: 'expression',
            right: right
        };
    };
    ExecutionUnitBuilder.assignmentUnit = function (ident, expr) {
        return {
            type: 'assignment',
            ident: ident,
            expr: expr
        };
    };
    ExecutionUnitBuilder.playerVarAssignUnit = function (player, ident, expr) {
        return {
            type: 'player_var_assign',
            ident: ident,
            player: player,
            expr: expr
        };
    };
    ExecutionUnitBuilder.varDeclUnit = function (ident, var_type, maxVal, expr) {
        return {
            type: "var_decl",
            expr: expr,
            ident: ident,
            var_type: var_type,
            maxVal: maxVal
        };
    };
    //--- expressions
    ExecutionUnitBuilder.ternaryExpressionUnit = function (disjunction, condition, trueExpression, falseExpression) {
        return {
            type: 'ternary_expression',
            disjunction: disjunction,
            condition: condition,
            trueExpression: trueExpression,
            falseExpression: falseExpression
        };
    };
    ExecutionUnitBuilder.disjunctionUnit = function (left, right) {
        return {
            type: 'disjunction',
            left: left,
            right: right
        };
    };
    ExecutionUnitBuilder.conjunctionUnit = function (left, right) {
        return {
            type: 'conjunction',
            left: left,
            right: right
        };
    };
    ExecutionUnitBuilder.comparisonUnit = function (left, right, op) {
        return {
            type: 'comparison',
            left: left,
            right: right,
            op: op
        };
    };
    ExecutionUnitBuilder.relationUnit = function (left, right, op) {
        return {
            type: 'relation',
            left: left,
            right: right,
            op: op
        };
    };
    ExecutionUnitBuilder.sumUnit = function (left, right, op) {
        return {
            type: 'sum',
            left: left,
            right: right,
            op: op
        };
    };
    ExecutionUnitBuilder.termUnit = function (left, right, op) {
        return {
            type: 'term',
            left: left,
            right: right,
            op: op
        };
    };
    ExecutionUnitBuilder.factorUnit = function (left, right, unOp) {
        return {
            type: 'factor',
            left: left,
            right: right,
            unOp: unOp
        };
    };
    ExecutionUnitBuilder.primaryUnit = function (primary) {
        return {
            type: 'primary',
            primary: primary
        };
    };
    ExecutionUnitBuilder.primaryConstantUnit_int = function (constant) {
        return {
            type: 'primary_constant',
            intValue: constant,
            boolVal: null
        };
    };
    ExecutionUnitBuilder.primaryConstantUnit_bool = function (constant) {
        return {
            type: 'primary_constant',
            intValue: null,
            boolVal: constant
        };
    };
    ExecutionUnitBuilder.primaryIdentUnit = function (ident) {
        return {
            type: 'primary_ident',
            ident: ident
        };
    };
    ExecutionUnitBuilder.primaryIdentLeftStepsUnit = function () {
        return {
            type: 'primary_ident_leftSteps',
        };
    };
    ExecutionUnitBuilder.primaryIdentLastResult = function () {
        return {
            type: 'primary_ident_last_result',
        };
    };
    ExecutionUnitBuilder.primaryRollDiceFunc = function (maxValExpr) {
        return {
            type: 'primary_roll_dice_func',
            maxValExpr: maxValExpr
        };
    };
    ExecutionUnitBuilder.primaryChooseBoolFunc = function () {
        return {
            type: 'primary_choose_bool_func',
        };
    };
    ExecutionUnitBuilder.primaryIncrementUnit = function (ident, isPost, player) {
        return {
            type: 'primary_increment',
            ident: ident,
            isPost: isPost,
            player: player
        };
    };
    ExecutionUnitBuilder.primaryDecrementUnit = function (ident, isPost, player) {
        return {
            type: 'primary_decrement',
            ident: ident,
            isPost: isPost,
            player: player
        };
    };
    ExecutionUnitBuilder.primaryPlayerVarIdentUnit = function (who, ident) {
        return {
            type: 'primary_player_var_ident',
            ident: ident,
            player: who
        };
    };
    //--- END expressions
    ExecutionUnitBuilder.ifUnit = function (conditionExpr, trueUnits) {
        return {
            type: "if",
            trueUnits: trueUnits,
            conditionExpr: conditionExpr
        };
    };
    ExecutionUnitBuilder.ifElseUnit = function (conditionExpr, trueUnits, falseUnits) {
        return {
            type: "ifElse",
            trueUnits: trueUnits,
            falseUnits: falseUnits,
            conditionExpr: conditionExpr
        };
    };
    ExecutionUnitBuilder.forceUnit = function () {
        return {
            type: "force",
        };
    };
    ExecutionUnitBuilder.controlIfElseUnit = function (conditionExpr, trueTargetId, falseTargetId) {
        return {
            type: "control_ifElse",
            conditionExpr: conditionExpr,
            falseTargetId: falseTargetId,
            trueTargetId: trueTargetId
        };
    };
    ExecutionUnitBuilder.controlGotoUnit = function (targetId) {
        return {
            type: "control_goto",
            targetId: targetId
        };
    };
    ExecutionUnitBuilder.moveFunc = function (numStepsExpr) {
        return {
            type: "move_func",
            numStepsExpr: numStepsExpr
        };
    };
    ExecutionUnitBuilder.rollbackFunc = function () {
        return {
            type: "rollback_func",
        };
    };
    ExecutionUnitBuilder.sleepFunc = function (player, roundsExpr) {
        return {
            type: "sleep_func",
            player: player,
            roundsExpr: roundsExpr
        };
    };
    ExecutionUnitBuilder.beginScope = function () {
        return {
            type: "begin_scope",
        };
    };
    ExecutionUnitBuilder.setReturnResult = function (expr) {
        return {
            type: "set_return_result",
            expr: expr
        };
    };
    ExecutionUnitBuilder.limitScope = function () {
        return {
            type: "limit_scope",
        };
    };
    ExecutionUnitBuilder.endScope = function () {
        return {
            type: "end_scope",
        };
    };
    //game defs
    ExecutionUnitBuilder.playersDefUnit = function (numPlayers, numTokensPerPlayer, vars) {
        return {
            type: "players_def",
            vars: vars,
            numPlayers: numPlayers,
            numTokensPerPlayer: numTokensPerPlayer
        };
    };
    ExecutionUnitBuilder.gameVarsUnit = function (maxDiceValue, endCondition, vars) {
        return {
            type: "game_vars",
            maxDiceValue: maxDiceValue === null ? 6 : maxDiceValue,
            endCondition: endCondition,
            vars: vars
        };
    };
    return ExecutionUnitBuilder;
}());
exports.ExecutionUnitBuilder = ExecutionUnitBuilder;
function convertString(stringWithQuotes) {
    return stringWithQuotes.substr(1, stringWithQuotes.length - 2);
}
function convertNumber(num) {
    var result = parseFloat(num);
    if (isNaN(result)) {
        return null;
    }
    return result;
}
exports.convertNumber = convertNumber;
