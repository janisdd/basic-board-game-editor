import {GameUnit} from "../model/executionUnit";
import {convertNumber, ExecutionUnitBuilder} from "../builder/executionUnitBuilder";

interface JisonErrorHash {
  /**
   * expected keywords
   */
  expected: string[]
  line: number
  loc: {
    first_column: number
    first_line: number
    last_column: number
    last_line: number
  }
  recoverable: boolean
  text: string
  token: string
}

interface TerminalsTable {
  [tokenNum: number]: any //TODO not sure about typing...
}

export interface JisonParser {

  yy: {
    parseError: (err: string, hash: JisonErrorHash) => void
    ExecutionUnitBuilder: ExecutionUnitBuilder
    convertNumber: (num: string) => number | null
  }

  lexer: JisonLexer
  terminals_: any //TODO not sure about typing...

  parse: (input: string) => GameUnit
}

interface TokenPair {
  token: string
  text: string
}

interface JisonLexer {
  yytext: string
  setInput: (input: string) => void
  lex: () => number | string //TODO not sure about typing...
  done: boolean
}

export class Compiler {

  /**
   * the parser
   */
  parser: JisonParser
  /**
   * true: only log errors to console.error
   * false: throw error and stop
   *
   * to disable errors or to not log to console.error set
   * parser.yy.parseError to custom function
   * @type {boolean}
   */
  isErrorRecoveryEnabled: boolean = false

  constructor(parser: JisonParser, isErrorRecoveryEnabled: boolean = false) {
    this.parser = parser

    this.isErrorRecoveryEnabled = isErrorRecoveryEnabled

    this.parser.yy = {
      ExecutionUnitBuilder,
      convertNumber,
      parseError: (err, hash) => {

        if (this.isErrorRecoveryEnabled) {
          console.error(err)
        } else {
          throw err
        }
      }
    }

  }

  private preProcessInput(program: string): string {

    //the grammar forces a new line at the end of the program...
    if (program[program.length - 1] != '\n') {
      program = program + '\n'
    }

    return program
  }

  /**
   * tokenizes the input
   *
   * CAN THROW
   * @param {string} program
   * @returns {TokenPair[]}
   */
  tokenize(program: string): TokenPair[] {
    program = this.preProcessInput(program)

    let tokens: TokenPair[] = []

    this.parser.lexer.setInput(program)
    let token: any = 0
    while (!this.parser.lexer.done) {
      token = this.parser.lexer.lex();
      if (token in this.parser.terminals_) {
        token = this.parser.terminals_[token]
      }
      tokens.push({token: token, text: this.parser.lexer.yytext})
    }

    return tokens
  }

  /**
   * parses the input and returns a post processed diagram
   *
   * CAN THROW
   * @param {string} program
   * @returns {ExecutionUnit}
   */
  parse(program: string): GameUnit {
    // program = this.preProcessInput(program)

    let result: GameUnit

    //if we catch here we can never throw (no error recovery)
    result = this.parser.parse(program)

    return result
  }

}