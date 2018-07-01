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
