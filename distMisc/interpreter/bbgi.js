(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["bbgi"] = factory();
	else
		root["bbgi"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(4);
var executionUnit_1 = __webpack_require__(5);
var machineState_1 = __webpack_require__(6);
var _notExhausiveHelper_1 = __webpack_require__(7);
var seedrandom = __webpack_require__(8);
var errorVal = 42;
//--- time constants to calculate elapsed time, these are funcs in case we want to change them e.g. by random numbers
var logTimes = false;
var SimulationTimes = /** @class */ (function () {
    function SimulationTimes() {
    }
    //time to roll the dice
    SimulationTimes.timeInS_rollDice = function () {
        if (logTimes)
            console.log("roll took " + 2 + "s");
        return this._timeInS_rollDice;
    };
    SimulationTimes.timeInS_choose_bool_func = function () {
        if (logTimes)
            console.log("boll func took " + this._timeInS_choose_bool_func + "s");
        return this._timeInS_choose_bool_func;
    };
    //for all goto s
    SimulationTimes.timeInS_goto = function () {
        if (logTimes)
            console.log("goto took " + this._timeInS_goto + "s");
        return this._timeInS_goto;
    };
    //time to set the new var value
    SimulationTimes.timeInS_set_var = function () {
        if (logTimes)
            console.log("set var took " + this._timeInS_set_var + "s");
        return this._timeInS_set_var;
    };
    //time to give the next player the dice
    SimulationTimes.timeInS_advancePlayer = function () {
        if (logTimes)
            console.log("set next player took " + this._timeInS_advancePlayer + "s");
        return this._timeInS_advancePlayer;
    };
    //time to get the token back
    SimulationTimes.timeInS_rollback = function () {
        if (logTimes)
            console.log("rollback took " + this._timeInS_rollback + "s");
        return this._timeInS_rollback;
    };
    SimulationTimes.timeInS_var_decl = function () {
        if (logTimes)
            console.log("var decl took " + this._timeInS_var_decl + "s");
        return this._timeInS_var_decl;
    };
    SimulationTimes.timeInS_expr_primary_leftSteps = function () {
        if (logTimes)
            console.log("primary left steps took " + this._timeInS_expr_primary_leftSteps + "s");
        return this._timeInS_expr_primary_leftSteps;
    };
    SimulationTimes.timeInS_expr_primary_constant = function () {
        if (logTimes)
            console.log("primary constant took " + this._timeInS_expr_primary_constant + "s");
        return this._timeInS_expr_primary_constant;
    };
    SimulationTimes.timeInS_expr_primary_ident = function () {
        if (logTimes)
            console.log("primary ident took " + this._timeInS_expr_primary_ident + "s");
        return this._timeInS_expr_primary_ident;
    };
    SimulationTimes.timeInS_expr_primary_incrementOrDecrement = function () {
        if (logTimes)
            console.log("primary inc/decrement took " + this._timeInS_expr_primary_incrementOrDecrement + "s");
        return this._timeInS_expr_primary_incrementOrDecrement;
    };
    //or
    SimulationTimes.timeInS_expr_disjunction = function () {
        if (logTimes)
            console.log("primary or took " + this._timeInS_expr_disjunction + "s");
        return this._timeInS_expr_disjunction;
    };
    //and
    SimulationTimes.timeInS_expr_conjunction = function () {
        if (logTimes)
            console.log("primary and took " + this._timeInS_expr_conjunction + "s");
        return this._timeInS_expr_conjunction;
    };
    //comparison ops: ==, !=
    SimulationTimes.timeInS_expr_comparison = function () {
        if (logTimes)
            console.log("primary compare took " + this._timeInS_expr_comparison + "s");
        return this._timeInS_expr_comparison;
    };
    //relation ops: <, >, <=, >=
    SimulationTimes.timeInS_expr_relation = function () {
        if (logTimes)
            console.log("primary relation (>, ...) took " + this._timeInS_expr_relation + "s");
        return this._timeInS_expr_relation;
    };
    //sum ops: x + x, x - x
    SimulationTimes.timeInS_expr_sum = function () {
        if (logTimes)
            console.log("primary sum took " + this._timeInS_expr_sum + "s");
        return this._timeInS_expr_sum;
    };
    //mul ops: *, /, %
    SimulationTimes.timeInS_expr_term = function () {
        if (logTimes)
            console.log("primary term/mul op took " + this._timeInS_expr_term + "s");
        return this._timeInS_expr_term;
    };
    //un ops: +x, -x, not x
    SimulationTimes.timeInS_expr_factor = function () {
        if (logTimes)
            console.log("primary factor (un op) took " + this._timeInS_expr_factor + "s");
        return this._timeInS_expr_factor;
    };
    //DON'T move this to constants else the simulation worker would include everything that constants reference to...
    //with webpack worker loader
    SimulationTimes.timeInS_rollDice_default = 2;
    SimulationTimes.timeInS_choose_bool_func_default = 0.3;
    SimulationTimes.timeInS_goto_default = 0.5;
    SimulationTimes.timeInS_set_var_default = 3;
    SimulationTimes.timeInS_advancePlayer_default = 1;
    SimulationTimes.timeInS_rollback_default = 2;
    SimulationTimes.timeInS_var_decl_default = 3;
    SimulationTimes.timeInS_expr_primary_leftSteps_default = 2;
    SimulationTimes.timeInS_expr_primary_constant_default = 0.5;
    SimulationTimes.timeInS_expr_primary_ident_default = 1;
    SimulationTimes.timeInS_expr_primary_incrementOrDecrement_default = 1;
    SimulationTimes.timeInS_expr_disjunction_default = 1;
    SimulationTimes.timeInS_expr_conjunction_default = 1;
    SimulationTimes.timeInS_expr_comparison_default = 1;
    SimulationTimes.timeInS_expr_relation_default = 1;
    SimulationTimes.timeInS_expr_sum_default = 1;
    SimulationTimes.timeInS_expr_term_default = 1;
    SimulationTimes.timeInS_expr_factor_default = 1;
    SimulationTimes._timeInS_rollDice = SimulationTimes.timeInS_rollDice_default;
    SimulationTimes._timeInS_choose_bool_func = SimulationTimes.timeInS_choose_bool_func_default;
    SimulationTimes._timeInS_goto = SimulationTimes.timeInS_goto_default;
    SimulationTimes._timeInS_set_var = SimulationTimes.timeInS_set_var_default;
    SimulationTimes._timeInS_advancePlayer = SimulationTimes.timeInS_advancePlayer_default;
    SimulationTimes._timeInS_rollback = SimulationTimes.timeInS_rollback_default;
    SimulationTimes._timeInS_var_decl = SimulationTimes.timeInS_var_decl_default;
    SimulationTimes._timeInS_expr_primary_leftSteps = SimulationTimes.timeInS_expr_primary_leftSteps_default;
    SimulationTimes._timeInS_expr_primary_constant = SimulationTimes.timeInS_expr_primary_constant_default;
    SimulationTimes._timeInS_expr_primary_ident = SimulationTimes.timeInS_expr_primary_ident_default;
    SimulationTimes._timeInS_expr_primary_incrementOrDecrement = SimulationTimes.timeInS_expr_primary_incrementOrDecrement_default;
    SimulationTimes._timeInS_expr_disjunction = SimulationTimes.timeInS_expr_disjunction_default;
    SimulationTimes._timeInS_expr_conjunction = SimulationTimes.timeInS_expr_conjunction_default;
    SimulationTimes._timeInS_expr_comparison = SimulationTimes.timeInS_expr_comparison_default;
    SimulationTimes._timeInS_expr_relation = SimulationTimes.timeInS_expr_relation_default;
    SimulationTimes._timeInS_expr_sum = SimulationTimes.timeInS_expr_sum_default;
    SimulationTimes._timeInS_expr_term = SimulationTimes.timeInS_expr_term_default;
    SimulationTimes._timeInS_expr_factor = SimulationTimes.timeInS_expr_factor_default;
    return SimulationTimes;
}());
exports.SimulationTimes = SimulationTimes;
//TODO game setup times
//---
exports.playerColors = ['#00dd0a', '#0089dd', '#dd0011', '#f1f300', '#f300b5'
    //TODO more
];
var random = seedrandom();
var defaultPlayerId = -1;
var AbstractMachine = /** @class */ (function () {
    function AbstractMachine() {
    }
    AbstractMachine.createNewMachineState = function () {
        return {
            globalDefTable: {},
            currentPlayerIndex: 0,
            nextPlayerIndex: 0,
            previousPlayerIndex: 0,
            currentPlayerActiveTokenIndex: 0,
            players: [
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
                        }],
                    lastReturnedValue: undefined
                }
            ],
            rolledDiceValue: 0,
            leftDiceValue: 0,
            maxDiceValue: 0,
            gameEndCondition: null,
            rollbackState: null,
            wasStateRolledBack: false,
            elapsedTimeInS: 0,
            winnersIds: [],
        };
    };
    AbstractMachine.setSeed = function (seed) {
        random = seedrandom(seed === null
            ? null
            : seed.toString());
    };
    //game functions e.g. next round, roll dice...
    AbstractMachine.rollDice = function (state, min, max) {
        if (min === void 0) { min = 1; }
        if (max === void 0) { max = 6; }
        return {
            state: tslib_1.__assign({}, state, { elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_rollDice() }),
            diceValue: Math.floor((random.quick() * max) + min)
        };
    };
    AbstractMachine.advancePlayerIndex = function (state) {
        var newCurrentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        return tslib_1.__assign({}, state, { currentPlayerIndex: newCurrentPlayerIndex, nextPlayerIndex: (newCurrentPlayerIndex + 1) % state.players.length, previousPlayerIndex: (newCurrentPlayerIndex - 1) < 0
                ? state.players.length - 1
                : (newCurrentPlayerIndex - 1), elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_advancePlayer() });
    };
    //game def statements
    AbstractMachine.executeAllGameDefinitionStatements = function (statements, state) {
        var newState = state;
        for (var i = 0; i < statements.length; i++) {
            var statement = statements[i];
            newState = this.executeGameDefinitionStatement(statement, newState);
        }
        return newState;
    };
    AbstractMachine.executeGameDefinitionStatement = function (statement, state) {
        switch (statement.type) {
            case "game_vars": {
                var res = this.execGameDef(statement, state);
                return res;
            }
            case "players_def": {
                var res = this.execPlayerDef(statement, state);
                return res;
            }
            default:
                _notExhausiveHelper_1.notExhaustive(statement);
        }
    };
    AbstractMachine.execPlayerDef = function (defs, state) {
        if (state.players.length > 0 && state.players[0].id !== defaultPlayerId) { //allow the default player
            this.makeError("players def can only be defined once");
        }
        if (defs.numTokensPerPlayer <= 0) {
            this.makeError("a player needs at least 1 token --> set numTokensPerPlayer to >= 1");
        }
        var lastState = tslib_1.__assign({}, state, { players: [] //reset because the default player should be removed
         });
        for (var i = 0; i < defs.numPlayers; i++) {
            var color = exports.playerColors[i];
            var tokens = [];
            for (var j = 0; j < defs.numTokensPerPlayer; j++) {
                var token = {
                    color: color,
                    fieldId: null,
                    tileGuid: null,
                    name: "player" + i + "_token" + j,
                    previousPositions: []
                };
                tokens.push(token);
            }
            var player = {
                id: i,
                color: color,
                name: "player" + i,
                defTable: {},
                localDefTables: [{
                        isScopeLimited: false,
                        defTable: {}
                    }],
                tokens: tokens,
                suspendCounter: 0,
                lastReturnedValue: undefined
            };
            lastState = tslib_1.__assign({}, lastState, { players: lastState.players.concat(player), currentPlayerIndex: i //if we use y++ inside player var defs we need to increment the right value
             });
            var newState = this.execPlayerVars(defs.vars, lastState, i);
            lastState = newState;
        }
        var newCurrentPlayerIndex = 0;
        lastState = tslib_1.__assign({}, lastState, { currentPlayerIndex: newCurrentPlayerIndex, nextPlayerIndex: (newCurrentPlayerIndex + 1) % lastState.players.length, previousPlayerIndex: (newCurrentPlayerIndex - 1) < 0
                ? lastState.players.length - 1
                : (newCurrentPlayerIndex - 1) });
        return lastState;
    };
    /**
     *
     * @param {VarDeclUnit[]} vars
     * @param {MachineState} state we need the state in case we use global vars (e.g. x++) & to evaluate the expr
     * @param playerIndex the player index
     * @returns {MachineState}
     */
    AbstractMachine.execPlayerVars = function (vars, state, playerIndex) {
        var _this = this;
        var lastState = state;
        var _loop_1 = function (i) {
            var varDecl = vars[i];
            if (state.players[playerIndex] === undefined) {
                this_1.makeError("player with index " + playerIndex + " was not found (execPlayerVars)");
            }
            var entry = lastState.players[playerIndex].defTable[varDecl.ident];
            if (entry) {
                this_1.makeError("player var " + varDecl.ident + " is already defined");
            }
            var expRes = this_1.execExpression(varDecl.expr, lastState);
            lastState = expRes.state;
            if (varDecl.var_type === executionUnit_1.VarType.int) {
                if (expRes.boolVal !== null) {
                    this_1.makeError("player var " + varDecl.ident + " is of type int but expression is of type bool");
                }
                //replace the modified player
                lastState = tslib_1.__assign({}, lastState, { players: lastState.players.map(function (p, index) {
                        return playerIndex !== index
                            ? p
                            : tslib_1.__assign({}, p, { defTable: tslib_1.__assign({}, p.defTable, (_a = {}, _a[varDecl.ident] = {
                                    val: _this.circularArithmeticVal(expRes.val, varDecl.maxVal + 1, varDecl.maxVal),
                                    ident: varDecl.ident,
                                    maxVal: varDecl.maxVal
                                }, _a)) });
                        var _a;
                    }) });
            }
            else if (varDecl.var_type === executionUnit_1.VarType.bool) {
                if (expRes.val !== null) {
                    this_1.makeError("player var " + varDecl.ident + " is of type bool but expression is of type int");
                }
                //replace the modified player
                lastState = tslib_1.__assign({}, lastState, { players: lastState.players.map(function (p, index) {
                        return playerIndex !== index
                            ? p
                            : tslib_1.__assign({}, p, { defTable: tslib_1.__assign({}, p.defTable, (_a = {}, _a[varDecl.ident] = {
                                    boolVal: expRes.boolVal,
                                    ident: varDecl.ident,
                                }, _a)) });
                        var _a;
                    }) });
            }
        };
        var this_1 = this;
        for (var i = 0; i < vars.length; i++) {
            _loop_1(i);
        }
        return lastState;
    };
    AbstractMachine.execPlayerVarAssign = function (playerVarAssign, state) {
        var playerIndex = this.getSomePlayerIndex(playerVarAssign.player, state, 'primary_player_var_ident unknown player');
        var entry = state.players[playerIndex].defTable[playerVarAssign.ident];
        if (!entry) {
            this.makeError("player var assign unknown var " + playerVarAssign.ident + " for player");
        }
        var exprRes = this.execExpression(playerVarAssign.expr, state);
        state = exprRes.state;
        return this._execPlayerVarAssign(entry, playerIndex, exprRes, state);
    };
    /**
     * same as execPlayerVarAssign but uses an already evaluated expr (we use this method somehwere else too)
     * @param {DefinitionTableIntEntry | DefinitionTableBoolEntry} entry
     * @param {number} playerIndex
     * @param {ExprTuple} exprRes the state is not used! use the state arg instead
     * @param {MachineState} state
     * @returns {ExprTuple}
     * @private
     */
    AbstractMachine._execPlayerVarAssign = function (entry, playerIndex, exprRes, state) {
        if (exprRes.val !== null) {
            if (machineState_1.isBoolVar(entry)) {
                this.makeError("player var assign var " + entry.ident + " is of type bool but epxr is of type int");
            }
            if (machineState_1.isIntVar(entry)) {
                //priori and posteriori type matches (int, int)
                var copyState = tslib_1.__assign({}, exprRes.state, { players: state.players.map(function (p, index) {
                        return index !== playerIndex
                            ? p
                            : tslib_1.__assign({}, p, { defTable: tslib_1.__assign({}, p.defTable, (_a = {}, _a[entry.ident] = {
                                    val: exprRes.val,
                                    maxVal: entry.maxVal,
                                    ident: entry.ident
                                }, _a)) });
                        var _a;
                    }), elapsedTimeInS: exprRes.state.elapsedTimeInS + SimulationTimes.timeInS_set_var() });
                return {
                    val: exprRes.val,
                    boolVal: null,
                    state: copyState
                };
            }
        }
        if (exprRes.boolVal !== null) {
            if (machineState_1.isIntVar(entry)) {
                this.makeError("player var assign var " + entry.ident + " is of type int but epxr is of type bool");
            }
            if (machineState_1.isBoolVar(entry)) {
                var copyState = tslib_1.__assign({}, exprRes.state, { players: state.players.map(function (p, index) {
                        return index !== playerIndex
                            ? p
                            : tslib_1.__assign({}, p, { defTable: tslib_1.__assign({}, p.defTable, (_a = {}, _a[entry.ident] = {
                                    boolVal: exprRes.boolVal,
                                    ident: entry.ident
                                }, _a)) });
                        var _a;
                    }), elapsedTimeInS: exprRes.state.elapsedTimeInS + SimulationTimes.timeInS_set_var() });
                return {
                    val: null,
                    boolVal: exprRes.boolVal,
                    state: copyState
                };
            }
        }
        this.makeError("player var assign var " + entry.ident + " unknown val/type");
        return null;
    };
    AbstractMachine.execGameDef = function (gameVars, state) {
        var res = this.execGameVars(gameVars.vars, state);
        return tslib_1.__assign({}, res, { maxDiceValue: gameVars.maxDiceValue, gameEndCondition: gameVars.endCondition });
    };
    AbstractMachine.execGameVars = function (vars, state) {
        for (var i = 0; i < vars.length; i++) {
            var varDecl = vars[i];
            var entry = state.globalDefTable[varDecl.ident];
            if (entry) {
                this.makeError("global var " + varDecl.ident + " is already defined");
            }
            var expRes = this.execExpression(varDecl.expr, state);
            state = expRes.state;
            if (varDecl.var_type === executionUnit_1.VarType.int) {
                if (expRes.boolVal !== null) {
                    this.makeError("global var " + varDecl.ident + " is of type int but expression is of type bool");
                }
                state = tslib_1.__assign({}, state, { globalDefTable: tslib_1.__assign({}, state.globalDefTable, (_a = {}, _a[varDecl.ident] = {
                        val: this.circularArithmeticVal(expRes.val, varDecl.maxVal + 1, varDecl.maxVal),
                        ident: varDecl.ident,
                        maxVal: varDecl.maxVal
                    }, _a)) });
            }
            else if (varDecl.var_type === executionUnit_1.VarType.bool) {
                if (expRes.val !== null) {
                    this.makeError("global var " + varDecl.ident + " is of type bool but expression is of type int");
                }
                state = tslib_1.__assign({}, state, { globalDefTable: tslib_1.__assign({}, state.globalDefTable, (_b = {}, _b[varDecl.ident] = {
                        boolVal: expRes.boolVal,
                        ident: varDecl.ident,
                    }, _b)) });
            }
        }
        return state;
        var _a, _b;
    };
    // statements
    AbstractMachine.executeAll = function (statements, state) {
        var newState = state;
        for (var i = 0; i < statements.length; i++) {
            var statement = statements[i];
            newState = this.executeStatement(statement, newState);
        }
        return newState;
    };
    AbstractMachine.executeStatement = function (statement, state) {
        switch (statement.type) {
            case "var_decl": {
                var res = this.execVarDecl(statement, state);
                return res;
            }
            case "expression": {
                var res = this.execExpression(statement, state);
                return res.state;
            }
            case "log": {
                var res = this.execExpression(statement.expr, state);
                this.builtIn_log(res.val);
                return state;
            }
            case "if": {
                var res = this.execIf(statement, state);
                return res;
            }
            case "ifElse": {
                var res = this.execIfElse(statement, state);
                return res;
            }
            case "goto": {
                var res = this.execGoto(statement, state);
                return res;
            }
            case "start": {
                var res = this.execStart(statement, state);
                return res;
            }
            case "end": {
                var res = this.execEnd(statement, state);
                return res;
            }
            //this is only important for simulation but not for the normal program flow
            case "force":
                return state;
            case "control_goto": {
                var res = this.execControlGoto(statement, state);
                return res;
            }
            case "control_ifElse": {
                var res = this.execControlIfElse(statement, state);
                return res;
            }
            case "move_func": {
                var res = this.execMoveFunc(statement, state);
                return res;
            }
            case "rollback_func": {
                var res = this.execRollbackFunc(statement, state);
                return res;
            }
            case "sleep_func": {
                var res = this.execSleepFunc(statement, state);
                return res;
            }
            case "begin_scope": {
                var res = this.execBeginScope(statement, state);
                return res;
            }
            case "set_return_result": {
                var res = this.execSetReturnResultUnit(statement, state);
                return res;
            }
            case "end_scope": {
                var res = this.execEndScope(statement, state);
                return res;
            }
            case "limit_scope": {
                var res = this.execLimitScope(statement, state);
                return res;
            }
            default:
                _notExhausiveHelper_1.notExhaustive(statement);
        }
    };
    //-- control stats - all control statements decrease the left dice value
    AbstractMachine.execControlIfElse = function (controlIfElse, state) {
        var conditionRes = this.execExpression(controlIfElse.conditionExpr, state);
        //control statements expression cannot change state
        //state = conditionRes.state
        if (conditionRes.boolVal === null) {
            this.makeError('if condition must be of type bool');
        }
        var playerToken = state.players[state.currentPlayerIndex].tokens[state.currentPlayerActiveTokenIndex];
        return tslib_1.__assign({}, state, { players: state.players.map(function (p, index) { return index !== state.currentPlayerIndex
                ? p
                : tslib_1.__assign({}, p, { tokens: p.tokens.map(function (t, index1) { return index1 !== state.currentPlayerActiveTokenIndex
                        ? t
                        : tslib_1.__assign({}, t, { fieldId: conditionRes.boolVal === true
                                ? controlIfElse.trueTargetId
                                : controlIfElse.falseTargetId, previousPositions: playerToken.previousPositions.concat({
                                tileGuid: playerToken.tileGuid,
                                fieldId: playerToken.fieldId
                            }) }); }) }); }), leftDiceValue: state.leftDiceValue - 1, 
            //use the elapsed time from the expr evaluation
            elapsedTimeInS: conditionRes.state.elapsedTimeInS + SimulationTimes.timeInS_goto() });
    };
    AbstractMachine.execControlGoto = function (controlGoto, state) {
        var playerToken = state.players[state.currentPlayerIndex].tokens[state.currentPlayerActiveTokenIndex];
        return tslib_1.__assign({}, state, { players: state.players.map(function (p, index) { return index !== state.currentPlayerIndex
                ? p
                : tslib_1.__assign({}, p, { tokens: p.tokens.map(function (t, index1) { return index1 !== state.currentPlayerActiveTokenIndex
                        ? t
                        : tslib_1.__assign({}, t, { fieldId: controlGoto.targetId, previousPositions: playerToken.previousPositions.concat({
                                tileGuid: playerToken.tileGuid,
                                fieldId: playerToken.fieldId
                            }) }); }) }); }), leftDiceValue: state.leftDiceValue - 1, elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_goto() });
    };
    //-- end control stats
    //--- built in funcs
    AbstractMachine.execBeginScope = function (beginScope, state) {
        return tslib_1.__assign({}, state, { players: state.players.map(function (value, playerIndex) { return playerIndex !== state.currentPlayerIndex
                ? value
                : tslib_1.__assign({}, value, { localDefTables: value.localDefTables.concat({
                        isScopeLimited: false,
                        defTable: {}
                    }) //push new scope
                 }); }) });
    };
    AbstractMachine.execEndScope = function (endScope, state) {
        if (state.players[state.currentPlayerIndex].localDefTables.length === 1) {
            //this is the initial scope that cannot be ended...
            this.makeError("the initial scope cannot be closed/ended");
        }
        return tslib_1.__assign({}, state, { players: state.players.map(function (value, playerIndex) { return playerIndex !== state.currentPlayerIndex
                ? value
                : tslib_1.__assign({}, value, { localDefTables: value.localDefTables.filter(function (p, index) { return index < value.localDefTables.length - 1; }) //pop last scope
                 }); }) });
    };
    AbstractMachine.execLimitScope = function (limitScope, state) {
        return tslib_1.__assign({}, state, { players: state.players.map(function (value, playerIndex) { return playerIndex !== state.currentPlayerIndex
                ? value
                : tslib_1.__assign({}, value, { localDefTables: value.localDefTables.map(function (p, index) { return index !== value.localDefTables.length - 1
                        ? p
                        : tslib_1.__assign({}, p, { isScopeLimited: true }); }) }); }) });
    };
    AbstractMachine.execSetReturnResultUnit = function (setReturnResult, state) {
        var exprRes = this.execExpression(setReturnResult.expr, state);
        state = exprRes.state;
        if (exprRes.val === null && exprRes.boolVal === null) {
            this.makeError("assigning return result expression did not give a result");
        }
        return tslib_1.__assign({}, state, { players: state.players.map(function (value, playerIndex) { return playerIndex !== state.currentPlayerIndex
                ? value
                : tslib_1.__assign({}, value, { lastReturnedValue: exprRes.val !== null
                        ? exprRes.val
                        : exprRes.boolVal }); }), elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_set_var() });
    };
    AbstractMachine.execSleepFunc = function (sleepFunc, state) {
        var exprRes = this.execExpression(sleepFunc.roundsExpr, state);
        //this sets the elapsed time
        state = exprRes.state;
        if (exprRes.val === null) {
            this.makeError('sleep function rounds arg needs to be of type int');
        }
        var targetPlayerIndex = this.getSomePlayerIndex(sleepFunc.player, state, 'unknown player for sleep function');
        return tslib_1.__assign({}, state, { players: state.players.map(function (p, index) { return index !== targetPlayerIndex
                ? p
                : tslib_1.__assign({}, p, { suspendCounter: Math.max(p.suspendCounter + exprRes.val, 0) //we should not get -x sleep
                 }); }), leftDiceValue: sleepFunc.player === executionUnit_1.SomePlayer.currentPlayer
                ? 0
                : state.leftDiceValue });
    };
    AbstractMachine.execMoveFunc = function (moveFunc, state) {
        var exprRes = this.execExpression(moveFunc.numStepsExpr, state);
        if (exprRes.val === null) {
            this.makeError('move argument must return an int');
        }
        state = exprRes.state;
        return tslib_1.__assign({}, state, { leftDiceValue: state.leftDiceValue + exprRes.val });
    };
    AbstractMachine.execRollbackFunc = function (rollbackFunc, state) {
        if (state.rollbackState === null)
            return state;
        return tslib_1.__assign({}, state.rollbackState, { leftDiceValue: 0, wasStateRolledBack: true, elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_rollback() });
    };
    AbstractMachine.execStart = function (start, state) {
        if (start.startCondition === null)
            return state;
        var exprRes = this.execExpression(start.startCondition, state);
        if (exprRes.boolVal === null) {
            this.makeError('start condition must be of type bool');
        }
        return tslib_1.__assign({}, state, { elapsedTimeInS: exprRes.state.elapsedTimeInS });
    };
    AbstractMachine.execEnd = function (end, state) {
        var currentPlayer = state.players[state.currentPlayerIndex];
        return tslib_1.__assign({}, state, { winnersIds: state.winnersIds.concat(currentPlayer.id) });
    };
    AbstractMachine.execGoto = function (goto, state) {
        //don't decrement dice value because when we need to travel to another tile
        //this should not be counted as move
        return tslib_1.__assign({}, state, { players: state.players.map(function (p, index) { return index !== state.currentPlayerIndex
                ? p
                : tslib_1.__assign({}, p, { tokens: p.tokens.map(function (t, index1) { return index1 !== state.currentPlayerActiveTokenIndex
                        ? t
                        : tslib_1.__assign({}, t, { fieldId: goto.targetId }); }) }); }), elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_goto() });
    };
    //-- end built in funcs
    AbstractMachine.execIf = function (ifStatement, state) {
        var conditionRes = this.execExpression(ifStatement.conditionExpr, state);
        if (conditionRes.boolVal === null) {
            this.makeError('if condition must be of type bool');
        }
        //don't change anything only expression side effects (e.g. x++)
        if (conditionRes.boolVal === false)
            return conditionRes.state;
        var lastState = conditionRes.state;
        for (var i = 0; i < ifStatement.trueUnits.length; i++) {
            var statement = ifStatement.trueUnits[i];
            lastState = this.executeStatement(statement, lastState);
        }
        //time is set inside every statement
        return lastState;
    };
    AbstractMachine.execIfElse = function (ifStatement, state) {
        //time is set inside every statement
        var conditionRes = this.execExpression(ifStatement.conditionExpr, state);
        if (conditionRes.boolVal === null) {
            this.makeError('if else condition must be of type bool');
        }
        var lastState = conditionRes.state;
        if (conditionRes.boolVal === false) {
            for (var i = 0; i < ifStatement.falseUnits.length; i++) {
                var statement = ifStatement.falseUnits[i];
                lastState = this.executeStatement(statement, lastState);
            }
            return lastState;
        }
        //true branch
        for (var i = 0; i < ifStatement.trueUnits.length; i++) {
            var statement = ifStatement.trueUnits[i];
            lastState = this.executeStatement(statement, lastState);
        }
        return lastState;
    };
    AbstractMachine.execVarDecl = function (varDecl, state) {
        //only the current player because local vars are player local
        var _this = this;
        //use the current local vars scope of the current player
        var scopes = state.players[state.currentPlayerIndex].localDefTables;
        var scopeIndex = scopes.length - 1;
        var currentDefTable = scopes[scopeIndex];
        var defTabEntry = currentDefTable.defTable[varDecl.ident];
        if (defTabEntry) {
            this.makeError("var " + varDecl.ident + " is already defined in current local vars scope");
        }
        var expRes = this.execExpression(varDecl.expr, state);
        state = expRes.state;
        var copy;
        if (varDecl.var_type === executionUnit_1.VarType.int) {
            if (expRes.boolVal !== null) {
                this.makeError("var " + varDecl.ident + " is of type int but expression is of type bool");
            }
            copy = tslib_1.__assign({}, state, { players: state.players.map(function (p, playerIdex) { return playerIdex !== state.currentPlayerIndex
                    ? p
                    : tslib_1.__assign({}, p, { localDefTables: p.localDefTables.map(function (value, index) {
                            return index !== scopeIndex
                                ? value
                                : tslib_1.__assign({}, value, { defTable: tslib_1.__assign({}, value.defTable, (_a = {}, _a[varDecl.ident] = {
                                        ident: varDecl.ident,
                                        val: _this.circularArithmeticVal(expRes.val, varDecl.maxVal + 1, varDecl.maxVal),
                                        maxVal: varDecl.maxVal
                                    }, _a)) });
                            var _a;
                        }) }); }), elapsedTimeInS: expRes.state.elapsedTimeInS + SimulationTimes.timeInS_var_decl() });
            return copy;
        }
        if (varDecl.var_type === executionUnit_1.VarType.bool) {
            if (expRes.val !== null) {
                this.makeError("var " + varDecl.ident + " is of type bool but expression is of type int");
            }
            copy = tslib_1.__assign({}, state, { players: state.players.map(function (p, playerIdex) { return playerIdex !== state.currentPlayerIndex
                    ? p
                    : tslib_1.__assign({}, p, { localDefTables: p.localDefTables.map(function (value, index) {
                            return index !== scopeIndex
                                ? value
                                : tslib_1.__assign({}, value, { defTable: tslib_1.__assign({}, value.defTable, (_a = {}, _a[varDecl.ident] = {
                                        ident: varDecl.ident,
                                        boolVal: expRes.boolVal,
                                    }, _a)) });
                            var _a;
                        }) }); }), elapsedTimeInS: expRes.state.elapsedTimeInS + SimulationTimes.timeInS_var_decl() });
            return copy;
        }
        this.makeError("var type for var " + varDecl.ident + " is unknown");
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
    };
    //--- expressions
    AbstractMachine.execExpression = function (expr, state) {
        switch (expr.right.type) {
            case "assignment": {
                var res = this.execAssign(expr.right, state);
                return res;
            }
            case "ternary_expression": {
                var res = this.execTernaryExpr(expr.right, state);
                return res;
            }
            case "player_var_assign": {
                var res = this.execPlayerVarAssign(expr.right, state);
                return res;
            }
            default:
                _notExhausiveHelper_1.notExhaustive(expr.right);
        }
    };
    /**
     * an assignment
     *
     * @param {AssignmentUnit} assign
     * @param {MachineState} state
     * @returns {ExprTuple}
     */
    AbstractMachine.execAssign = function (assign, state) {
        //if the assign is prefixed we would call execPlayerVarAssign directly
        var _this = this;
        var expRes = this.execExpression(assign.expr, state);
        state = expRes.state;
        //check first local var assign
        if (state.players[state.currentPlayerIndex].localDefTables.length > 0) {
            var scopeIndex_1 = state.players[state.currentPlayerIndex].localDefTables.length - 1;
            var _loop_2 = function () {
                var currentDefTableScope = state.players[state.currentPlayerIndex].localDefTables[scopeIndex_1];
                if (currentDefTableScope.isScopeLimited) {
                    return "break";
                }
                var entry = currentDefTableScope.defTable[assign.ident];
                if (entry === undefined) {
                    scopeIndex_1--;
                    return "continue";
                }
                if (machineState_1.isBoolVar(entry)) {
                    if (expRes.boolVal === null) {
                        this_2.makeError("assignment error: tried to assign a not bool value to the bool variable " + assign.ident);
                    }
                    return { value: {
                            val: null,
                            boolVal: expRes.boolVal,
                            state: tslib_1.__assign({}, state, { players: state.players.map(function (p, playerIndex) { return playerIndex !== state.currentPlayerIndex
                                    ? p
                                    : tslib_1.__assign({}, p, { localDefTables: p.localDefTables.map(function (value, index) {
                                            return index !== scopeIndex_1
                                                ? value
                                                : tslib_1.__assign({}, value, { defTable: tslib_1.__assign({}, value.defTable, (_a = {}, _a[assign.ident] = {
                                                        ident: assign.ident,
                                                        boolVal: expRes.boolVal
                                                    }, _a)) });
                                            var _a;
                                        }) }); }), elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_set_var() })
                        } };
                }
                if (machineState_1.isIntVar(entry)) {
                    if (expRes.val === null) {
                        this_2.makeError("assignment error: tried to assign a not int value to the int variable " + assign.ident);
                    }
                    return { value: {
                            val: expRes.val,
                            boolVal: null,
                            state: tslib_1.__assign({}, state, { players: state.players.map(function (p, playerIndex) { return playerIndex !== state.currentPlayerIndex
                                    ? p
                                    : tslib_1.__assign({}, p, { localDefTables: p.localDefTables.map(function (value, index) {
                                            return index !== scopeIndex_1
                                                ? value
                                                : tslib_1.__assign({}, value, { defTable: tslib_1.__assign({}, value.defTable, (_a = {}, _a[assign.ident] = {
                                                        ident: assign.ident,
                                                        maxVal: entry.maxVal,
                                                        val: _this.circularArithmeticVal(expRes.val, entry.maxVal + 1, entry.maxVal)
                                                    }, _a)) });
                                            var _a;
                                        }) }); }), elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_set_var() })
                        } };
                }
            };
            var this_2 = this;
            while (scopeIndex_1 >= 0) {
                var state_1 = _loop_2();
                if (typeof state_1 === "object")
                    return state_1.value;
                if (state_1 === "break")
                    break;
            }
        }
        //then try implicit player variable
        if (state.players[state.currentPlayerIndex].defTable[assign.ident] !== undefined) {
            var entry = state.players[state.currentPlayerIndex].defTable[assign.ident];
            return this._execPlayerVarAssign(entry, state.currentPlayerIndex, expRes, state);
        }
        //then a global var assign
        var defTabEntry = state.globalDefTable[assign.ident];
        if (!defTabEntry) {
            this.makeError("var " + assign.ident + " is not defined");
        }
        if (machineState_1.isBoolVar(defTabEntry)) {
            if (expRes.boolVal === null) {
                this.makeError("global var " + assign.ident + " assing: cannot assign not bool expr to bool var");
            }
            //bool and bool mach
            var copy = {
                val: null,
                boolVal: expRes.boolVal,
                state: tslib_1.__assign({}, expRes.state, { globalDefTable: tslib_1.__assign({}, expRes.state.globalDefTable, (_a = {}, _a[assign.ident] = {
                        ident: assign.ident,
                        boolVal: expRes.boolVal
                    }, _a)), elapsedTimeInS: expRes.state.elapsedTimeInS + SimulationTimes.timeInS_set_var() })
            };
            return copy;
        }
        if (machineState_1.isIntVar(defTabEntry)) {
            if (expRes.val === null) {
                this.makeError("global var " + assign.ident + " assing: cannot assign not int expr to int var");
            }
            //make sure we keep the value range / domain
            //-16 till 15
            var realVal = this.circularArithmeticVal(expRes.val, defTabEntry.maxVal + 1, defTabEntry.maxVal);
            var copy = {
                val: realVal,
                boolVal: null,
                state: tslib_1.__assign({}, expRes.state, { globalDefTable: tslib_1.__assign({}, expRes.state.globalDefTable, (_b = {}, _b[assign.ident] = {
                        ident: assign.ident,
                        val: realVal,
                        maxVal: defTabEntry.maxVal
                    }, _b)), elapsedTimeInS: expRes.state.elapsedTimeInS + SimulationTimes.timeInS_set_var() })
            };
            return copy;
        }
        this.makeError("global var " + assign.ident + " assing: unknown variable type");
        return {
            state: state,
            val: null,
            boolVal: null
        };
        var _a, _b;
    };
    AbstractMachine.execTernaryExpr = function (ternaryExpr, state) {
        if (ternaryExpr.disjunction !== null) {
            var res = this.execDisjunction(ternaryExpr.disjunction, state);
            return res;
        }
        //we have a ternary expression e.g. true ? 0 : 1
        if (ternaryExpr.condition === null) {
            this.makeError('ternary expression has no condition');
        }
        if (ternaryExpr.trueExpression === null) {
            this.makeError('ternary expression has no true expression (left)');
        }
        if (ternaryExpr.falseExpression === null) {
            this.makeError('ternary expression has no false expression (right)');
        }
        var conditionRes = this.execDisjunction(ternaryExpr.condition, state);
        state = conditionRes.state;
        if (conditionRes.boolVal === null) {
            this.makeError("ternary expression condition didn't evaluate to a bool");
        }
        var trueState = tslib_1.__assign({}, state);
        var falseState = tslib_1.__assign({}, state);
        var trueRes = this.execExpression(ternaryExpr.trueExpression, trueState);
        var falseRes = this.execExpression(ternaryExpr.falseExpression, falseState);
        if (trueRes.val !== null && falseRes.val !== null) {
            //both int val --> res is int
        }
        else if (trueRes.boolVal !== null && falseRes.boolVal !== null) {
            //both bool val --> res is bool
        }
        else {
            this.makeError('ternary expression both values must be of the same type');
        }
        if (conditionRes.boolVal) {
            return trueRes;
        }
        return falseRes;
    };
    AbstractMachine.execDisjunction = function (disjunction, state) {
        if (disjunction.left === null) {
            //no other path
            var res = this.execConjunction(disjunction.right, state);
            return res;
        }
        var lefRes = this.execDisjunction(disjunction.left, state);
        var rightRes = this.execConjunction(disjunction.right, lefRes.state);
        if (lefRes.boolVal === null) {
            this.makeError('disjunction (or) left op must be of type bool');
        }
        if (rightRes.boolVal === null) {
            this.makeError('disjunction (or) right op must be of type bool');
        }
        return {
            state: tslib_1.__assign({}, rightRes.state, { elapsedTimeInS: rightRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_disjunction() }),
            val: null,
            boolVal: lefRes.boolVal || rightRes.boolVal
        };
    };
    AbstractMachine.execConjunction = function (conjunction, state) {
        if (conjunction.left === null) {
            var res = this.execComparison(conjunction.right, state);
            return res;
        }
        var lefRes = this.execConjunction(conjunction.left, state);
        var rightRes = this.execComparison(conjunction.right, lefRes.state);
        if (lefRes.boolVal === null) {
            this.makeError('conjunction (and) left op must be of type bool');
        }
        if (rightRes.boolVal === null) {
            this.makeError('conjunction (and) right op must be of type bool');
        }
        return {
            state: tslib_1.__assign({}, rightRes.state, { elapsedTimeInS: rightRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_conjunction() }),
            val: null,
            boolVal: lefRes.boolVal && rightRes.boolVal
        };
    };
    AbstractMachine.execComparison = function (comparison, state) {
        if (comparison.left === null) {
            var res = this.execRelation(comparison.right, state);
            return res;
        }
        if (comparison.op === null) {
            this.makeError('comarison op was null, must be one of ==, !==');
        }
        var leftRes = this.execRelation(comparison.left, state);
        var rightRes = this.execRelation(comparison.right, leftRes.state);
        if (leftRes.val !== null && rightRes.val !== null) {
            //both ints --> ok, result is nevertheless bool
            return {
                state: tslib_1.__assign({}, rightRes.state, { elapsedTimeInS: rightRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_comparison() }),
                val: null,
                boolVal: comparison.op === "=="
                    ? leftRes.val === rightRes.val
                    : comparison.op === '!='
                        ? leftRes.val !== rightRes.val
                        : this.makeError('unknown comarison op, must be one of ==, !==')
            };
        }
        else if (leftRes.boolVal !== null && rightRes.boolVal !== null) {
            //both bools --> ok, result is nevertheless bool
            return {
                state: tslib_1.__assign({}, rightRes.state, { elapsedTimeInS: rightRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_comparison() }),
                val: null,
                boolVal: comparison.op === "=="
                    ? leftRes.boolVal === rightRes.boolVal
                    : comparison.op === '!='
                        ? leftRes.boolVal !== rightRes.boolVal
                        : this.makeError('unknown comarison op, must be one of ==, !==')
            };
        }
        this.makeError('comparison operands must be of same type');
        return {
            val: null,
            state: rightRes.state,
            boolVal: null
        };
    };
    AbstractMachine.execRelation = function (relation, state) {
        if (relation.left === null) {
            var res = this.execSum(relation.right, state);
            return res;
        }
        if (relation.op === null) {
            this.makeError('no op for relation, expected one of <, >, <=, >=');
            return {
                val: null,
                state: state,
                boolVal: null
            };
        }
        var sumRes = this.execSum(relation.left, state);
        var rightSumRes = this.execSum(relation.right, sumRes.state);
        if (sumRes.boolVal !== null) {
            this.makeError('relation left type is bool but need to be int');
            return {
                val: null,
                state: rightSumRes.state,
                boolVal: null
            };
        }
        if (rightSumRes.boolVal !== null) {
            this.makeError('relation right type is bool but need to be int');
            return {
                val: null,
                state: rightSumRes.state,
                boolVal: null
            };
        }
        if (sumRes.val !== null && rightSumRes.val !== null) {
            return {
                state: tslib_1.__assign({}, rightSumRes.state, { elapsedTimeInS: rightSumRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_relation() }),
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
            };
        }
        this.makeError('internal error on relation');
        return {
            val: errorVal,
            state: rightSumRes.state,
            boolVal: null
        };
    };
    AbstractMachine.execSum = function (sum, state) {
        if (sum.left === null) {
            var res = this.execTerm(sum.right, state);
            return res;
        }
        //we have a sum
        //sum + term
        var sumRes = this.execSum(sum.left, state);
        var termRes = this.execTerm(sum.right, sumRes.state);
        if (sum.op === null) {
            this.makeError('no op for sum, expected on of +, -');
            return {
                val: errorVal,
                state: termRes.state,
                boolVal: null
            };
        }
        if (sumRes.boolVal !== null) {
            this.makeError('sum (+,-) ops cannot have bool args');
            return {
                val: null,
                boolVal: null,
                state: termRes.state,
            };
        }
        if (termRes.boolVal !== null) {
            this.makeError('sum (+,-) ops cannot have bool args');
            return {
                val: null,
                boolVal: null,
                state: termRes.state,
            };
        }
        return {
            state: tslib_1.__assign({}, termRes.state, { elapsedTimeInS: termRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_sum() }),
            boolVal: null,
            val: sum.op === '+'
                ? sumRes.val + termRes.val
                : sum.op === '-'
                    ? sumRes.val - termRes.val
                    : this.makeError('unknown sum op')
        };
    };
    AbstractMachine.execTerm = function (term, state) {
        if (term.left === null) {
            var res = this.execFactor(term.right, state);
            return res;
        }
        if (term.op === null) {
            this.makeError('no op for term');
            return {
                val: null,
                boolVal: null,
                state: state,
            };
        }
        var termRes = this.execTerm(term.left, state);
        if (termRes.boolVal !== null) {
            this.makeError('mul (*,/,%) ops cannot have bool args');
            return {
                val: null,
                boolVal: null,
                state: termRes.state,
            };
        }
        var factorRes = this.execFactor(term.right, termRes.state);
        if (factorRes.boolVal !== null) {
            this.makeError('mul (*,/,%) ops cannot have bool args');
            return {
                val: null,
                boolVal: null,
                state: state,
            };
        }
        return {
            state: tslib_1.__assign({}, factorRes.state, { elapsedTimeInS: factorRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_term() }),
            boolVal: null,
            val: term.op === '*'
                ? this.forceIntVal(termRes.val * factorRes.val)
                : term.op === '/'
                    ? this.forceIntVal(termRes.val / factorRes.val)
                    : term.op === '%'
                        ? this.forceIntVal(termRes.val % factorRes.val)
                        : this.makeError('unknown op for term')
        };
    };
    AbstractMachine.execFactor = function (factor, state) {
        if (factor.left === null) {
            //this has no un op
            var res = this.execPrimary(factor.right, state);
            return res;
        }
        var factorRes = this.execFactor(factor.left, state);
        if (factorRes.boolVal !== null) {
            return {
                state: tslib_1.__assign({}, factorRes.state, { elapsedTimeInS: factorRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_factor() }),
                val: null,
                boolVal: factor.unOp === "not"
                    ? !factorRes.boolVal
                    : factorRes.boolVal
            };
        }
        return {
            state: tslib_1.__assign({}, factorRes.state, { elapsedTimeInS: factorRes.state.elapsedTimeInS + SimulationTimes.timeInS_expr_factor() }),
            boolVal: null,
            val: factor.unOp === '+'
                ? factorRes.val
                : -factorRes.val
        };
    };
    AbstractMachine.execPrimary = function (primary, state) {
        switch (primary.primary.type) {
            case "expression": { // we have brackets
                var res = this.execExpression(primary.primary, state);
                return res;
            }
            case "primary_ident_leftSteps": {
                return {
                    val: state.leftDiceValue,
                    boolVal: null,
                    state: tslib_1.__assign({}, state, { elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_leftSteps() })
                };
            }
            case "primary_roll_dice_func": {
                //this is already set inside roll and expressions
                var maxDiceValue = state.maxDiceValue;
                if (primary.primary.maxValExpr !== null) {
                    var exprRes = this.execExpression(primary.primary.maxValExpr, state);
                    if (exprRes.val === null) {
                        this.makeError('roll dice argument must return an int');
                    }
                    maxDiceValue = exprRes.val;
                    state = exprRes.state;
                }
                var rollRes = this.rollDice(state, 1, maxDiceValue); //time is set here
                return {
                    state: tslib_1.__assign({}, rollRes.state),
                    boolVal: null,
                    val: rollRes.diceValue
                };
            }
            case "primary_choose_bool_func": {
                var chosenValue = this.rollDice(state, 0, 1); //time is set here
                return {
                    state: tslib_1.__assign({}, chosenValue.state, { elapsedTimeInS: (chosenValue.state.elapsedTimeInS - SimulationTimes.timeInS_rollDice()) + SimulationTimes.timeInS_choose_bool_func() }),
                    val: null,
                    boolVal: chosenValue.diceValue === 1,
                };
            }
            case "primary_constant": {
                if (primary.primary.intValue !== null) {
                    return {
                        val: primary.primary.intValue,
                        boolVal: null,
                        state: tslib_1.__assign({}, state, { elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_constant() })
                    };
                }
                if (primary.primary.boolVal !== null) {
                    return {
                        val: null,
                        boolVal: primary.primary.boolVal,
                        state: tslib_1.__assign({}, state, { elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_constant() })
                    };
                }
                this.makeError('constant is no int, bool');
                return {
                    boolVal: null,
                    val: null,
                    state: state
                };
            }
            case "primary_decrement":
            case "primary_increment": {
                return this.execPrimary_inc_or_decrement(primary.primary, state);
            }
            //normal x
            case "primary_ident": {
                return this.execPrimary_ident(primary.primary, state);
            }
            //cp.x --> no global/local var
            case "primary_player_var_ident": {
                return this.execPrimary_player_var(primary.primary, state);
            }
            case "primary_ident_last_result": {
                var lastVal = state.players[state.currentPlayerIndex].lastReturnedValue;
                if (lastVal === undefined) {
                    this.makeError('last result value was not set yet');
                }
                return {
                    boolVal: (typeof lastVal === "boolean")
                        ? lastVal
                        : null,
                    val: (typeof lastVal === "number")
                        ? lastVal
                        : null,
                    state: tslib_1.__assign({}, state, { elapsedTimeInS: state.elapsedTimeInS + SimulationTimes._timeInS_expr_primary_ident //time like accessing a var
                     })
                };
            }
            default:
                _notExhausiveHelper_1.notExhaustive(primary.primary);
        }
    };
    AbstractMachine.execPrimary_inc_or_decrement = function (primary, state) {
        var _this = this;
        var increment = primary.type === "primary_increment";
        if (primary.player !== null) { //this must be a player var (no global/local var)
            var playerIndex_1 = this.getSomePlayerIndex(primary.player, state, 'primary_increment invalid player');
            var playerDefTabEntry_1 = state.players[playerIndex_1].defTable[primary.ident];
            if (playerDefTabEntry_1 === undefined) {
                this.makeError("def tab entry for player ident " + primary.ident + " not found");
                return {
                    state: state,
                    val: null,
                    boolVal: null
                };
            }
            if (machineState_1.isBoolVar(playerDefTabEntry_1)) {
                this.makeError("bool var player ident " + primary.ident + " cannot be increment (only ints)");
                return {
                    val: null,
                    boolVal: null,
                    state: state
                };
            }
            var newVal_1 = playerDefTabEntry_1.val + (increment
                ? 1
                : -1);
            var copy_1 = {
                val: primary.isPost
                    ? playerDefTabEntry_1.val //   [some player].x++
                    : newVal_1,
                boolVal: null,
                state: tslib_1.__assign({}, state, { players: state.players.map(function (p, index) {
                        return index !== playerIndex_1
                            ? p
                            : tslib_1.__assign({}, p, { defTable: tslib_1.__assign({}, p.defTable, (_a = {}, _a[primary.ident] = {
                                    val: _this.circularArithmeticVal(newVal_1, playerDefTabEntry_1.maxVal + 1, playerDefTabEntry_1.maxVal),
                                    maxVal: playerDefTabEntry_1.maxVal,
                                    ident: primary.ident
                                }, _a)) });
                        var _a;
                    }), elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_incrementOrDecrement() })
            };
            return copy_1;
        }
        //player is not explicitly set (e..g only x++)
        //so check local vars only for current player
        if (state.players[state.currentPlayerIndex].localDefTables.length > 0) {
            var scopeIndex_2 = state.players[state.currentPlayerIndex].localDefTables.length - 1;
            var _loop_3 = function () {
                var currentDefTableScope = state.players[state.currentPlayerIndex].localDefTables[scopeIndex_2];
                if (currentDefTableScope.isScopeLimited) {
                    return "break";
                }
                var entry = currentDefTableScope.defTable[primary.ident];
                if (entry === undefined) {
                    scopeIndex_2--;
                    return "continue";
                }
                if (machineState_1.isBoolVar(entry)) {
                    this_3.makeError("bool local ident " + primary.ident + " cannot be increment (only ints)");
                    return { value: {
                            val: null,
                            boolVal: null,
                            state: state
                        } };
                }
                var newVal_2 = entry.val + (increment
                    ? 1
                    : -1);
                var copy_2 = {
                    val: primary.isPost
                        ? entry.val //   x++
                        : newVal_2,
                    boolVal: null,
                    state: tslib_1.__assign({}, state, { players: state.players.map(function (p, index) { return index !== state.currentPlayerIndex
                            ? p
                            : tslib_1.__assign({}, p, { localDefTables: p.localDefTables.map(function (value, defTableIndex) {
                                    return defTableIndex !== scopeIndex_2
                                        ? value
                                        : tslib_1.__assign({}, value, { defTable: tslib_1.__assign({}, value.defTable, (_a = {}, _a[primary.ident] = {
                                                val: _this.circularArithmeticVal(newVal_2, entry.maxVal + 1, entry.maxVal),
                                                maxVal: entry.maxVal,
                                                ident: primary.ident
                                            }, _a)) });
                                    var _a;
                                }) }); }), elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_incrementOrDecrement() })
                };
                return { value: copy_2 };
            };
            var this_3 = this;
            while (scopeIndex_2 >= 0) {
                var state_2 = _loop_3();
                if (typeof state_2 === "object")
                    return state_2.value;
                if (state_2 === "break")
                    break;
            }
        }
        //check for implicit player var
        var playerDefTabEntry = state.players[state.currentPlayerIndex].defTable[primary.ident];
        if (playerDefTabEntry !== undefined) {
            if (machineState_1.isBoolVar(playerDefTabEntry)) {
                this.makeError("bool var player ident " + primary.ident + " cannot be increment (only ints)");
                return {
                    val: null,
                    boolVal: null,
                    state: state
                };
            }
            var newVal_3 = playerDefTabEntry.val + (increment
                ? 1
                : -1);
            var copy_3 = {
                val: primary.isPost
                    ? playerDefTabEntry.val //   [some player].x++
                    : newVal_3,
                boolVal: null,
                state: tslib_1.__assign({}, state, { players: state.players.map(function (p, index) {
                        return index !== state.currentPlayerIndex
                            ? p
                            : tslib_1.__assign({}, p, { defTable: tslib_1.__assign({}, p.defTable, (_a = {}, _a[primary.ident] = {
                                    val: _this.circularArithmeticVal(newVal_3, playerDefTabEntry.maxVal + 1, playerDefTabEntry.maxVal),
                                    maxVal: playerDefTabEntry.maxVal,
                                    ident: primary.ident
                                }, _a)) });
                        var _a;
                    }), elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_incrementOrDecrement() })
            };
            return copy_3;
        }
        //global var
        var defTabEntry = state.globalDefTable[primary.ident];
        if (!defTabEntry) {
            this.makeError("global def tab entry for ident " + primary.ident + " not found");
            return {
                state: state,
                val: null,
                boolVal: null
            };
        }
        if (machineState_1.isBoolVar(defTabEntry)) {
            this.makeError("global bool var ident " + primary.ident + " cannot be increment (only ints)");
            return {
                val: null,
                boolVal: null,
                state: state
            };
        }
        var newVal = defTabEntry.val + (increment
            ? 1
            : -1);
        var copy = {
            val: primary.isPost
                ? defTabEntry.val //   x++
                : newVal,
            boolVal: null,
            state: tslib_1.__assign({}, state, { globalDefTable: tslib_1.__assign({}, state.globalDefTable, (_a = {}, _a[primary.ident] = {
                    ident: primary.ident,
                    val: this.circularArithmeticVal(newVal, defTabEntry.maxVal + 1, defTabEntry.maxVal),
                    maxVal: defTabEntry.maxVal
                }, _a)), elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_incrementOrDecrement() })
        };
        return copy;
        var _a;
    };
    /**
     * we explicitly used: cp.x
     * @param {PrimaryPlayerVarIdentUnit} primary
     * @param {MachineState} state
     * @returns {ExprTuple}
     */
    AbstractMachine.execPrimary_player_var = function (primary, state) {
        var playerIndex = this.getSomePlayerIndex(primary.player, state, 'primary_player_var_ident unknown player');
        var entry = state.players[playerIndex].defTable[primary.ident];
        if (!entry) {
            this.makeError("primary_player_var_ident unknown var " + primary.ident + " for player");
        }
        return this.getDefTableVariable(entry, state, "primary_player_var_ident unknown var " + primary.ident + " unknown type??");
    };
    /**
     * normal varialbe usage: x
     * @param {PrimaryIdentUnit} primary
     * @param {MachineState} state
     * @returns {ExprTuple}
     */
    AbstractMachine.execPrimary_ident = function (primary, state) {
        //check all local variable scopes
        //then check cp.x
        //then check global var x
        //else throw error
        //check local variable
        if (state.players[state.currentPlayerIndex].localDefTables.length > 0) {
            var scopeIndex = state.players[state.currentPlayerIndex].localDefTables.length - 1;
            while (scopeIndex >= 0) {
                var currentDefTableScope = state.players[state.currentPlayerIndex].localDefTables[scopeIndex];
                if (currentDefTableScope.isScopeLimited) {
                    //not search any further outer scopes
                    break;
                }
                var entry = currentDefTableScope.defTable[primary.ident];
                if (entry === undefined) {
                    scopeIndex--;
                    continue;
                }
                //we found a local variable
                return this.getDefTableVariable(entry, state, "no type found for ident " + primary.ident);
            }
        }
        //check cp.x (player variable)
        if (state.players[state.currentPlayerIndex].defTable[primary.ident]) {
            return this.execPrimary_player_var({
                player: state.currentPlayerIndex,
                ident: primary.ident,
                type: "primary_player_var_ident"
            }, state);
        }
        //check global variable
        var defTabEntry = state.globalDefTable[primary.ident];
        if (!defTabEntry) {
            this.makeError("variable " + primary.ident + " was not found (searched all scopes)");
        }
        return this.getDefTableVariable(defTabEntry, state, "no type found for ident " + primary.ident);
    };
    AbstractMachine.getDefTableVariable = function (defTabEntry, state, errorMessage) {
        if (machineState_1.isIntVar(defTabEntry)) {
            var varVal = defTabEntry.val;
            return {
                val: varVal,
                boolVal: null,
                state: tslib_1.__assign({}, state, { elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_ident() })
            };
        }
        if (machineState_1.isBoolVar(defTabEntry)) {
            var varVal = defTabEntry.boolVal;
            return {
                val: null,
                boolVal: varVal,
                state: tslib_1.__assign({}, state, { elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_expr_primary_ident() })
            };
        }
        this.makeError(errorMessage);
    };
    //--- end expressions
    /**
     * returns the right player index for the given player in the given state
     * @param {SomePlayer} somePlayer
     * @param {MachineState} state
     * @param {string} errorMessage used when an invalid player is used
     * @returns {number}
     */
    AbstractMachine.getSomePlayerIndex = function (somePlayer, state, errorMessage) {
        return somePlayer === executionUnit_1.SomePlayer.currentPlayer
            ? state.currentPlayerIndex
            : somePlayer === executionUnit_1.SomePlayer.nextPlayer
                ? state.nextPlayerIndex
                : somePlayer === executionUnit_1.SomePlayer.previousPlayer
                    ? state.previousPlayerIndex
                    : this.makeError(errorMessage);
    };
    /**
     *
     * @param {number} val
     * @param {number} minAbsVal e.g. if we use -16 this param should be 16
     * @param {number} maxVal
     */
    AbstractMachine.circularArithmeticVal = function (val, minAbsVal, maxVal) {
        // -16 till 15 = 32 (31 + zero)
        // -2 till 1 = [0, 1, 2, 3]
        var shiftedMaxVal = minAbsVal + maxVal + 1;
        var lowerBound = -minAbsVal;
        if (lowerBound === val) {
            return val;
        }
        var clampedVal = 0;
        //TODO is this correct
        if (val <= 0) {
            clampedVal = ((val + lowerBound) % shiftedMaxVal) - lowerBound;
        }
        else {
            clampedVal = ((val - lowerBound) % shiftedMaxVal) + lowerBound;
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
        return clampedVal;
    };
    /**
     * because we have no floats e.g. / needs to be corrected to int (floor)
     * @param {number} val
     * @returns {number}
     */
    AbstractMachine.forceIntVal = function (val) {
        return Math.floor(val);
    };
    AbstractMachine.makeError = function (message) {
        //console.error(message)
        throw Error(message);
    };
    AbstractMachine.builtIn_log = function (val) {
        console.log(val);
    };
    return AbstractMachine;
}());
exports.AbstractMachine = AbstractMachine;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["__extends"] = __extends;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (immutable) */ __webpack_exports__["__rest"] = __rest;
/* harmony export (immutable) */ __webpack_exports__["__decorate"] = __decorate;
/* harmony export (immutable) */ __webpack_exports__["__param"] = __param;
/* harmony export (immutable) */ __webpack_exports__["__metadata"] = __metadata;
/* harmony export (immutable) */ __webpack_exports__["__awaiter"] = __awaiter;
/* harmony export (immutable) */ __webpack_exports__["__generator"] = __generator;
/* harmony export (immutable) */ __webpack_exports__["__exportStar"] = __exportStar;
/* harmony export (immutable) */ __webpack_exports__["__values"] = __values;
/* harmony export (immutable) */ __webpack_exports__["__read"] = __read;
/* harmony export (immutable) */ __webpack_exports__["__spread"] = __spread;
/* harmony export (immutable) */ __webpack_exports__["__await"] = __await;
/* harmony export (immutable) */ __webpack_exports__["__asyncGenerator"] = __asyncGenerator;
/* harmony export (immutable) */ __webpack_exports__["__asyncDelegator"] = __asyncDelegator;
/* harmony export (immutable) */ __webpack_exports__["__asyncValues"] = __asyncValues;
/* harmony export (immutable) */ __webpack_exports__["__makeTemplateObject"] = __makeTemplateObject;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// export interface PrimitiveValue<T> {
//   readonly value: T
//   readonly location: LexerLocation
// }
/**
 * this should be stay in sync with the grammar
 */
var SomePlayer;
(function (SomePlayer) {
    SomePlayer[SomePlayer["currentPlayer"] = 0] = "currentPlayer";
    SomePlayer[SomePlayer["nextPlayer"] = 1] = "nextPlayer";
    SomePlayer[SomePlayer["previousPlayer"] = 2] = "previousPlayer";
})(SomePlayer = exports.SomePlayer || (exports.SomePlayer = {}));
var VarType;
(function (VarType) {
    VarType[VarType["int"] = 0] = "int";
    VarType[VarType["bool"] = 1] = "bool";
})(VarType = exports.VarType || (exports.VarType = {}));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isIntVar(entry) {
    return entry.val !== undefined;
}
exports.isIntVar = isIntVar;
function isBoolVar(entry) {
    return entry.boolVal !== undefined;
}
exports.isBoolVar = isBoolVar;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * use this in the default block in a switch statement in a reducer
 *
 *
 * see https://basarat.gitbooks.io/typescript/docs/types/never.html
 * and https://stackoverflow.com/questions/39419170/how-do-i-check-that-a-switch-block-is-exhaustive-in-typescript
 * @param {never} x pass the switch variable
 * @returns {any}
 */
function notExhaustive(x) {
    // throw new Error("Didn't expect to get here");
}
exports.notExhaustive = notExhaustive;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = __webpack_require__(9);

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = __webpack_require__(10);

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = __webpack_require__(11);

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = __webpack_require__(12);

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = __webpack_require__(13);

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = __webpack_require__(14);

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = __webpack_require__(15);

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(0) && __webpack_require__(2)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(0)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(0) && __webpack_require__(2)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(0)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(0) && __webpack_require__(2)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(0)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(0) && __webpack_require__(2)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(0)   // present with an AMD loader
);


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(0) && __webpack_require__(2)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(0)   // present with an AMD loader
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(0) && __webpack_require__(2)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(0)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//
var global = this,
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}
math['seed' + rngname] = seedrandom;

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = __webpack_require__(16);
  } catch (ex) {}
} else if (true) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return seedrandom; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);


/***/ }),
/* 16 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);
});