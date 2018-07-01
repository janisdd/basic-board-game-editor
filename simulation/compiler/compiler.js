"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var executionUnitBuilder_1 = require("../builder/executionUnitBuilder");
var Compiler = /** @class */ (function () {
    function Compiler(parser, isErrorRecoveryEnabled) {
        if (isErrorRecoveryEnabled === void 0) { isErrorRecoveryEnabled = false; }
        var _this = this;
        /**
         * true: only log errors to console.error
         * false: throw error and stop
         *
         * to disable errors or to not log to console.error set
         * parser.yy.parseError to custom function
         * @type {boolean}
         */
        this.isErrorRecoveryEnabled = false;
        this.parser = parser;
        this.isErrorRecoveryEnabled = isErrorRecoveryEnabled;
        this.parser.yy = {
            ExecutionUnitBuilder: executionUnitBuilder_1.ExecutionUnitBuilder,
            convertNumber: executionUnitBuilder_1.convertNumber,
            parseError: function (err, hash) {
                if (_this.isErrorRecoveryEnabled) {
                    console.error(err);
                }
                else {
                    throw err;
                }
            }
        };
    }
    Compiler.prototype.preProcessInput = function (program) {
        //the grammar forces a new line at the end of the program...
        if (program[program.length - 1] != '\n') {
            program = program + '\n';
        }
        return program;
    };
    /**
     * tokenizes the input
     *
     * CAN THROW
     * @param {string} program
     * @returns {TokenPair[]}
     */
    Compiler.prototype.tokenize = function (program) {
        program = this.preProcessInput(program);
        var tokens = [];
        this.parser.lexer.setInput(program);
        var token = 0;
        while (!this.parser.lexer.done) {
            token = this.parser.lexer.lex();
            if (token in this.parser.terminals_) {
                token = this.parser.terminals_[token];
            }
            tokens.push({ token: token, text: this.parser.lexer.yytext });
        }
        return tokens;
    };
    /**
     * parses the input and returns a post processed diagram
     *
     * CAN THROW
     * @param {string} program
     * @returns {ExecutionUnit}
     */
    Compiler.prototype.parse = function (program) {
        // program = this.preProcessInput(program)
        var result;
        //if we catch here we can never throw (no error recovery)
        result = this.parser.parse(program);
        return result;
    };
    return Compiler;
}());
exports.Compiler = Compiler;
