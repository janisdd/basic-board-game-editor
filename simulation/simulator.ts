import {Tile} from "../src/types/world";
import {Compiler, JisonParser} from "./compiler/compiler";
import {ControlStatementUnit, GameUnit, StatementUnit} from "./model/executionUnit";
import {
  MachineState, PlayerObj, PlayerToken, WorldSimulationPosition, WorldTileSurrogate
} from "./machine/machineState";
import {AbstractMachine, SimulationTimes} from "./machine/AbstractMachine";
import {Logger} from "../src/helpers/logger";
import {SimulationStatus} from "../src/types/states";
import {BorderPoint, FieldShape} from "../src/types/drawing";
import {ChangingDefinitionsObj, LangHelper} from "../src/helpers/langHelper";
import {maxTileBorderPointToBorderPointTransitionWithoutFields} from "../src/constants";

declare function require(s: string): any

const langCompiler = require('../simulation/compiler/langCompiler').parser


export class Simulator {
  private constructor() {
  }

  public static readonly compiler: Compiler = new Compiler(langCompiler)

  /**
   * parses the game init code and all field shapes cmd texts
   *
   * does some more checks e.g. if end field is defined
   * @param {string | null} gameInitCode
   * @param {ReadonlyArray<Tile>} tiles
   * @param checkStartFieldFound true: checks if exactly one start field
   * @param checkEndFieldFound true: checks if at least one start field is found (must be on a force field)
   * @param useTilePropAdditionalStartFields the tile props can contain additional start fields, true: use them, false: ignore
   * @param useTilePropAdditionalEndFields the tile props can contain additional end fields, true: use them, false: ignore
   */
  public static parseAllFields(gameInitCode: string | null, tiles: ReadonlyArray<Tile>, checkStartFieldFound: boolean,
                               checkEndFieldFound: boolean, useTilePropAdditionalStartFields: boolean, useTilePropAdditionalEndFields: boolean
  ) {


    if (gameInitCode) {
      try {
        const game = this.compiler.parse(gameInitCode)
      } catch (err) {
        Logger.fatal(`game init code has parse errors: ${err}`)
        return
      }

      // for (const stat of game.game_def_stats) {
      //   state = AbstractMachine.executeGameDefinitionStatement(stat, state)
      // }
      //
      // for (const stat of game.statements) {
      //   state = AbstractMachine.executeStatement(stat, state)
      // }
    }

    let isAtLeastSomeEndFieldDefined = false
    let isOneStartFieldDefined = false

    let startFields: WorldSimulationPosition[] = []
    let endFields: WorldSimulationPosition[] = []

    let game_stats: GameUnit
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i]

      for (let j = 0; j < tile.fieldShapes.length; j++) {
        const fieldShape = tile.fieldShapes[j]

        if (fieldShape.cmdText === null) continue

        try {
          game_stats = this.compiler.parse(fieldShape.cmdText)
        } catch (err) {
          Logger.fatal(`field ${fieldShape.id} on tile ${tile.guid} has parse errors: ${err}`)
          return
        }

        //some other checks


        //end could be nested inside if
        const isEndField = this.hasGameEndStatementRecursive(game_stats.statements, {
          fieldId: fieldShape.id,
          tileGuid: tile.guid
        }, null)

        const isStartField = game_stats.statements.some(p => p.type === 'start')

        if (isEndField) {
          isAtLeastSomeEndFieldDefined = true
          endFields.push({
            fieldId: fieldShape.id,
            tileGuid: tile.guid
          })
        }

        if (isStartField && isOneStartFieldDefined) {
          //we have 2 start fields... this is not ok
          Logger.fatal(
            `the game has more than 1 start field! 1.: ${startFields[0].fieldId} on tile ${startFields[0].tileGuid}, 2.: ${fieldShape.id} on tile ${tile.guid}`)
        }

        if (isStartField) {
          isOneStartFieldDefined = true
          startFields.push({
            fieldId: fieldShape.id,
            tileGuid: tile.guid
          })
        }

        const statements = this.getNormalStatements(game_stats.statements)
        //only one force statement is allowed
        const hasForceStatement = statements.some(p => p.type === 'force')
        const isFirstStatementAForceStatement = statements.length > 0 && statements[0].type === "force"

        if (hasForceStatement && !isFirstStatementAForceStatement) {

          if (statements.some(p => p.type === 'force')) {
            Logger.fatal(`field ${fieldShape.id} on tile ${tile.guid}: force statements need to be the first statement`)
          }
          return
        }

        //only 1 control statement is allowed per field and needed! only exception is the end field

        const controlStatements = this.getControlStatements(game_stats.statements)

        if (controlStatements.length === 0 && isEndField === false) {
          Logger.fatal(`field ${fieldShape.id} on tile ${tile.guid}: cannot find next field`)
        }

        if (controlStatements.length > 1) {
          //this is just a soft constraint (useful for us bot not generally needed)
          Logger.fatal(`field ${fieldShape.id} on tile ${tile.guid} has more than 1 control statement`)
        }

        //the end field has no next field
        if (controlStatements.length > 0) {
          const controlStatement = controlStatements[0]

          this.checkIfControlStatementGotoItself(controlStatement, {
            tileGuid: tile.guid,
            fieldId: fieldShape.id
          })
        }
      }
    }


    if (isOneStartFieldDefined === false && checkStartFieldFound) {

      //check if we find a start field in the tile props
      if (useTilePropAdditionalStartFields === false) {
        Logger.fatal(`the game has no start field!`)
      }

      for (const tile of tiles) {
        for (const fieldShape of tile.fieldShapes) {
          if (tile.simulationStartFieldIds.indexOf(fieldShape.id) !== -1) {
            isOneStartFieldDefined = true
            startFields.push({
              fieldId: fieldShape.id,
              tileGuid: tile.guid
            })
          }
        }
      }

      //still no start field found
      if (isOneStartFieldDefined === false) {
        Logger.fatal(`the game has no start field!`)
      }
    }

    if (isAtLeastSomeEndFieldDefined === false && checkEndFieldFound) {

      //check if we find a end field in the tile props

      if (useTilePropAdditionalEndFields === false) {
        Logger.fatal(`the game has no end field!`)
      }

      for (const tile of tiles) {
        for (const fieldShape of tile.fieldShapes) {
          if (tile.simulationEndFieldIds.indexOf(fieldShape.id) !== -1) {
            isAtLeastSomeEndFieldDefined = true
            endFields.push({
              fieldId: fieldShape.id,
              tileGuid: tile.guid
            })
          }
        }
      }

      //still no emd field found
      if (isAtLeastSomeEndFieldDefined === false) {
        Logger.fatal(`the game has no end field!`)
      }
    }

    Logger.log(`found ${endFields.length} end fields`)

  }


  public static checkAllVarsDefined(gameInitCode: string, tiles: ReadonlyArray<Tile>) {


    const allVarDefs = LangHelper.getAllVarDefiningStatements(gameInitCode, tiles)

    let gameUnit = null

    try {
      gameUnit = this.compiler.parse(gameInitCode)
    } catch (err) {
      Logger.fatal(`game init code has parse errors: ${err}`)
      return
    }

    const changingDefinitions: ChangingDefinitionsObj = {
      globalVars: allVarDefs.globalVars,
      playerVars: allVarDefs.playerVars,
      isScopeLimit: false,
      currentScopeIndex: 0,
      localVars: []
    }


    for (const statement of gameUnit.statements) {

      //this gathers all local vars on its own (better because of the scopes)
      LangHelper.checkAllVarUsagesInStatement(changingDefinitions, statement, {
        tileGuid: 'game setup code',
        fieldId: -1
      })
    }

    let game_stats: GameUnit
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i]

      for (let j = 0; j < tile.fieldShapes.length; j++) {
        const fieldShape = tile.fieldShapes[j]

        if (fieldShape.cmdText === null) continue

        try {
          game_stats = this.compiler.parse(fieldShape.cmdText)
        } catch (err) {
          Logger.fatal(`field ${fieldShape.id} on tile ${tile.guid} has parse errors: ${err}`)
          return
        }

        for (const statement of game_stats.statements) {

          //check if all vars are defined
          LangHelper.checkAllVarUsagesInStatement(changingDefinitions, statement, {
            fieldId: fieldShape.id,
            tileGuid: tile.guid
          })
        }
      }
    }


  }

  /**
   * true if the this is a force field (first statement is force) and we find a nested game end
   * or if not force and we find a normal game end statement
   *
   *
   * @param {StatementUnit[]} statements
   * @param worldPos the world pos in case of errors
   * @param hasParentForceStatement for recursion: if we are in an if statement we only see the true/false statements not the parent statements, null if no parent
   * @returns {boolean}
   */
  private static hasGameEndStatementRecursive(
    statements: StatementUnit[], worldPos: WorldSimulationPosition, hasParentForceStatement: boolean | null): boolean {

    const isFirstStatementAForceStatement = statements.length > 0 && statements[0].type === "force"

    //not forced e.g. ifs are only executed when we directly stop at that field
    //so when there is no force field we search for a plain (not nested) game end field
    if (isFirstStatementAForceStatement === false && hasParentForceStatement === null) {

      const hasEndStatement = statements.some(p => p.type === 'end')

      if (hasEndStatement) {
        Logger.fatal('game end statement must be on a field with force command else the game could have no end.' + `game end found on field ${worldPos.fieldId} on tile ${worldPos.tileGuid}`)
      }

      return hasEndStatement
    }

    for (const statement of statements) {

      if (statement.type === 'end') {
        return true
      } else if (statement.type === 'if') {
        const hasGameEnd = this.hasGameEndStatementRecursive(statement.trueUnits, worldPos,
          hasParentForceStatement === null
            ? isFirstStatementAForceStatement
            : hasParentForceStatement
        )
        if (hasGameEnd) return true
      } else if (statement.type === 'ifElse') {
        const hasGameEndTrueBranch = this.hasGameEndStatementRecursive(statement.trueUnits, worldPos,
          hasParentForceStatement === null
            ? isFirstStatementAForceStatement
            : hasParentForceStatement
        )
        if (hasGameEndTrueBranch) return true

        const hasGameEndFalseBranch = this.hasGameEndStatementRecursive(statement.falseUnits, worldPos,
          hasParentForceStatement === null
            ? isFirstStatementAForceStatement
            : hasParentForceStatement
        )
        if (hasGameEndFalseBranch) return true
      }
    }

    return false
  }

  /**
   * searches through all field shapes for a cmd with game_start and returns the pos
   * @param {ReadonlyArray<Tile>} tiles
   * @param searchInTileProps true: search also in the tile props for the simulation start field
   * @returns {WorldSimulationPosition | null}
   */
  public static getStartFieldPosition(
    tiles: ReadonlyArray<Tile>, searchInTileProps: boolean): WorldSimulationPosition | null {

    for (const tile of tiles) {
      for (const field of tile.fieldShapes) {

        if (field.cmdText === null) continue

        const game = this.compiler.parse(field.cmdText)

        for (const stat of game.statements) {

          if (stat.type === "start") {
            return {
              tileGuid: tile.guid,
              fieldId: field.id
            }
          }
        }
      }

      if (searchInTileProps && tile.simulationStartFieldIds.length > 0) {
        return {
          tileGuid: tile.guid,
          fieldId: tile.simulationStartFieldIds[0]
        }
      }
    }

    //if not found search for the simulation start field


    return null
  }

  public static getEndFieldPositions(tiles: ReadonlyArray<Tile>): ReadonlyArray<WorldSimulationPosition> {

    //check if we find at least one designated end field

    let endFields: WorldSimulationPosition[] = []

    for (const tile of tiles) {
      for (const field of tile.fieldShapes) {

        if (field.cmdText === null) continue

        const game = this.compiler.parse(field.cmdText)

        for (const stat of game.statements) {

          if (stat.type === "end") {
            endFields.push({
              tileGuid: tile.guid,
              fieldId: field.id
            })
          }
        }
      }
    }

    return endFields
  }

  public static initNew(startPos: WorldSimulationPosition, playersStartBeforeStartField: boolean,
                        gameInitCode: string | null
  ): MachineState {


    let state = AbstractMachine.createNewMachineState()

    if (gameInitCode) {

      const game = this.compiler.parse(gameInitCode)

      for (const stat of game.game_def_stats) {
        state = AbstractMachine.executeGameDefinitionStatement(stat, state)
      }

      for (const stat of game.statements) {
        state = AbstractMachine.executeStatement(stat, state)
      }
    }

    //set start position for players
    if (playersStartBeforeStartField) {
      //set all players before the start
      state = {
        ...state,
        players: state.players.map((value, index) => {
          return {
            ...value,
            tokens: value.tokens.map(p => {
              return {
                ...p,
                fieldId: null,
                tileGuid: null
              }
            })
          }
        })
      }

    } else {
      //set all players on the start field
      state = {
        ...state,
        players: state.players.map((value, index) => {
          return {
            ...value,
            tokens: value.tokens.map(p => {
              return {
                ...p,
                fieldId: startPos.fieldId,
                tileGuid: startPos.tileGuid
              }
            })
          }
        })
      }
    }


    if (state.gameEndCondition !== null) {
      //TODO
    } else {

      //set all player tokens to start?
    }

    let currentPlayerIndex = 0
    state = {
      ...state,
      currentPlayerIndex,
      nextPlayerIndex: (currentPlayerIndex + 1) % state.players.length,
      previousPlayerIndex: Math.abs((currentPlayerIndex - 1) % state.players.length)
    }

    return state
  }

  /**
   * starts a new round (the current player should be already set)
   * decreases the suspend counter or
   * rolls the dice
   * @param {MachineState} state
   * @returns {{state: MachineState; currentPlayerSuspended: boolean}}
   */
  public static startNextRound(state: MachineState): { state: MachineState, currentPlayerSuspended: boolean } {

    /*
    one round:
    if player need to suspend then decrement suspendCounter, else:
    player rolls the dice (x)

    player progresses x fields, every progress needs to be visible (ui change)

    set the next player to be the current player
    */


    if (state.players[state.currentPlayerIndex].suspendCounter > 0) {

      state = {
        ...state,
        players: state.players.map((value, index) => index !== state.currentPlayerIndex
          ? value
          : {
            ...value,
            suspendCounter: state.players[state.currentPlayerIndex].suspendCounter - 1
          }),
      }

      return {
        state,
        currentPlayerSuspended: true
      }
    }

    const tuple = AbstractMachine.rollDice(state, 1, state.maxDiceValue)

    state = tuple.state

    state = {
      ...state,
      rolledDiceValue: tuple.diceValue,
      leftDiceValue: tuple.diceValue,
    }

    //store the rollback state as the player starts the round
    state = {
      ...state,
      rollbackState: {
        ...state
      }
    }

    return {
      state,
      currentPlayerSuspended: false
    }
  }

  /**
   * ends the round:
   * advances the player and resets the rollback state
   * @param {MachineState} state
   * @returns {MachineState}
   */
  public static endRound(state: MachineState): MachineState {
    state = AbstractMachine.advancePlayerIndex(state)

    state = {
      ...state,
      rollbackState: null,
      wasStateRolledBack: false
    }

    return state
  }


  private static getCurrentCmdText(tiles: ReadonlyArray<Tile>, tileGuid: string | null, fieldId: number | null): string | null {

    let tile = tiles.find(p => p.guid === tileGuid)

    if (!tile) {
      tile = Logger.fatal(`current tile ${tileGuid} not found`)
      //throw new Error()
    }

    let field = tile.fieldShapes.find(p => p.id === fieldId)

    if (!field) {
      field = Logger.fatal(`current field ${fieldId} on tile ${tileGuid} not found`)
    }


    if (field.cmdText !== null) {
      if (field.cmdText.trim() === '') return null
    }

    return field.cmdText
  }

  /**
   * searches for the next field and sets the current players token on that field
   * so we search for the first goto field but not execute any statements
   * if we encounter an end statement the current player has won
   *
   * DECREASES/INCREASES the rolled dice value by 1 (depending on the left value)
   *
   * @param tiles
   * @param tileSurrogates null for single tile simulation, array for world simulation we store only one tile but could have multiple instances through surrogates
   * also the surrogates store the position (x,y) needed to find the next tile
   * @param {MachineState} state
   * @param {WorldSimulationPosition} startPos if the players start before the start field they are set to null
   * @returns {MachineState}
   */
  public static moveToken(tiles: ReadonlyArray<Tile>, tileSurrogates: ReadonlyArray<WorldTileSurrogate> | null,
                          state: MachineState, startPos: WorldSimulationPosition
  ): {
    state: MachineState, hasCurrentPlayerWon: boolean
  } {

    const token = state.players[state.currentPlayerIndex].tokens[state.currentPlayerActiveTokenIndex]


    if (token.tileGuid === null && token.fieldId === null) {
      state = {
        ...state,
        players: state.players.map((value, index) => index !== state.currentPlayerIndex
          ? value
          : {
            ...value,
            tokens: value.tokens.map(p => {
              return {
                ...p,
                fieldId: startPos.fieldId,
                tileGuid: startPos.tileGuid
              }
            })
          }as PlayerObj),
        leftDiceValue: state.leftDiceValue - 1
      }

      return {
        state,
        hasCurrentPlayerWon: false
      }
    }
    else if (token.tileGuid === null) {
      Logger.fatal('simulator in invalid sate: token.tileGuid was null')
      throw new Error() //TOOD ts can Logger.fatal somehow do this??
    }
    else if (token.fieldId === null) {
      Logger.fatal('simulator in invalid sate: token.fieldId was null')
      throw new Error() //TOOD ts can Logger.fatal somehow do this??
    }

    let cmdText = this.getCurrentCmdText(tiles, token.tileGuid, token.fieldId)

    if (!cmdText) {
      cmdText = Logger.fatal(`current field ${token.fieldId} on tile ${token.tileGuid} has no command`)
    }

    let game: GameUnit

    try {
      game = this.compiler.parse(cmdText)
    } catch (err) {

      let tokens = this.compiler.tokenize(cmdText)
      Logger.log('tokens before error:')
      Logger.log('', tokens)
      game = Logger.fatal(`current field ${token.fieldId} on tile ${token.tileGuid} has errors: ${err}`)
    }

    const statements = game.statements


    if (state.leftDiceValue < 0) {
      //move back
      if (token.previousPositions.length === 0) {
        Logger.fatal(`current field ${token.fieldId} on tile ${token.tileGuid}: we try to move back but we don't know the previous field.` + `Make sure you don't have some crazy negative move functions [move(-x)]`)
      }

      let previousPos = token.previousPositions[token.previousPositions.length - 1]

      return {
        state: {
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
                    fieldId: previousPos.fieldId,
                    tileGuid: previousPos.tileGuid,
                    previousPositions: token.previousPositions.slice(
                      0, token.previousPositions.length - 1)
                  } as PlayerToken)
            } as PlayerObj),
          leftDiceValue: state.leftDiceValue + 1, //moving back is like a goto
          elapsedTimeInS: state.elapsedTimeInS + SimulationTimes.timeInS_goto()
        },
        hasCurrentPlayerWon: false
      }
    }

    const controlStatements = this.getControlStatements(statements)

    if (controlStatements.length === 0) {
      Logger.fatal(`current field ${token.fieldId} on tile ${token.tileGuid}: cannot find next field`)
    }

    if (controlStatements.length > 1) {
      //this is just a soft constraint (useful for us bot not generally needed)
      Logger.fatal(`current field ${token.fieldId} on tile ${token.tileGuid} has more than 1 control statement`)
    }


    //we allow only 1 control statement
    const statement = controlStatements[0]


    if (statement.type === "control_goto" && statement.targetId === token.fieldId) {
      Logger.fatal(`field ${token.fieldId} on tile ${token.tileGuid}: control goto itself --> infinite loop`)
    }

    this.checkIfControlStatementGotoItself(statement, {
      tileGuid: token.tileGuid,
      fieldId: token.fieldId
    })


    state = AbstractMachine.executeStatement(statement, state)

    if (tileSurrogates === null) {
      return {
        state,
        hasCurrentPlayerWon: false
      }
    }

    //check tile transitions
    const movedToken = state.players[state.currentPlayerIndex].tokens[state.currentPlayerActiveTokenIndex]

    //do tile transition
    //if we are in a tile transition situation:
    //the player token is on a border point id

    const currentTile = tiles.find(p => p.guid === movedToken.tileGuid)

    if (!currentTile) {
      Logger.fatal(`tile transition from tile ${movedToken.tileGuid}: tile not found?`)
      throw new Error()
    }

    const currentTileSurrogate = tileSurrogates.find(p => p.tileGuid === currentTile.guid)

    if (!currentTileSurrogate) {
      Logger.fatal(`tile transition from tile ${movedToken.tileGuid}: tile position not found?`)
      throw new Error()
    }

    const nowField = currentTile.fieldShapes.find(p => p.id === movedToken.fieldId)

    if (nowField) {
      //we are on a normal field
      return {
        state,
        hasCurrentPlayerWon: false
      }
    }

    //else we cannot find a field ... check if we are on a border point
    let nextTile: Tile | null = null
    let nextField: FieldShape | null = null

    const botBorderPoint = currentTile.botBorderPoints.find(p => p.id === movedToken.fieldId)
    if (botBorderPoint) {
      //do transition to bottom
      let {_nextTile, _nextField} = this.getNextTileAndField(botBorderPoint, currentTile, tiles, tileSurrogates,
        surrogate => surrogate.x === currentTileSurrogate.x && surrogate.y === currentTileSurrogate.y + 1,
        nextTile => nextTile.topBorderPoints,
        0
      )
      nextTile = _nextTile
      nextField = _nextField
    }

    const topBorderPoint = currentTile.topBorderPoints.find(p => p.id === movedToken.fieldId)
    if (topBorderPoint) {
      //do transition to top
      let {_nextTile, _nextField} = this.getNextTileAndField(topBorderPoint, currentTile, tiles, tileSurrogates,
        surrogate => surrogate.x === currentTileSurrogate.x && surrogate.y === currentTileSurrogate.y - 1,
        nextTile => nextTile.botBorderPoints,
        0
      )
      nextTile = _nextTile
      nextField = _nextField
    }

    const leftBorderPoint = currentTile.leftBorderPoints.find(p => p.id === movedToken.fieldId)
    if (leftBorderPoint) {
      //do transition to left
      let {_nextTile, _nextField} = this.getNextTileAndField(leftBorderPoint, currentTile, tiles, tileSurrogates,
        surrogate => surrogate.x === currentTileSurrogate.x - 1 && surrogate.y === currentTileSurrogate.y,
        nextTile => nextTile.rightBorderPoint,
        0
      )
      nextTile = _nextTile
      nextField = _nextField
    }

    const rightBorderPoint = currentTile.rightBorderPoint.find(p => p.id === movedToken.fieldId)
    if (rightBorderPoint) {
      //do transition to right
      let {_nextTile, _nextField} = this.getNextTileAndField(rightBorderPoint, currentTile, tiles, tileSurrogates,
        surrogate => surrogate.x === currentTileSurrogate.x + 1 && surrogate.y === currentTileSurrogate.y,
        nextTile => nextTile.leftBorderPoints,
        0
      )
      nextTile = _nextTile
      nextField = _nextField
    }


    if (!nextTile) {
      Logger.fatal(`could not do tile transition because next tile was not found, current field ${movedToken.fieldId}`)
      throw new Error()
    }
    if (!nextField) {
      Logger.fatal(`could not do tile transition because next field was not found, current field ${movedToken.fieldId}`)
      throw new Error()
    }

    state = Simulator.doTileTransition(token.tileGuid, token.fieldId, nextTile, nextField, state)

    return {
      state,
      hasCurrentPlayerWon: false
    }

  }

  private static getNextTileAndField(borderPoint: BorderPoint, currentTile: Tile, tiles: ReadonlyArray<Tile>,
                                     tileSurrogates: ReadonlyArray<WorldTileSurrogate>,
                                     nextTileSurrogateCond: (surrogate: WorldTileSurrogate) => boolean,
                                     nextTileBorderPointsFunc: (tile: Tile) => ReadonlyArray<BorderPoint>,
                                     depthCounter: number //used if we have transitions without fields... we could get into a loop
  ): {
    _nextTile: Tile, _nextField: FieldShape
  } {

    if (depthCounter > maxTileBorderPointToBorderPointTransitionWithoutFields) {
      Logger.fatal(`tile transition error: done ~${depthCounter} transitions without a field, maybe an infinite loop?`)
      throw new Error()
    }

    //find tile below
    const nextTileSurrogate = tileSurrogates.find(p => nextTileSurrogateCond(p))

    if (!nextTileSurrogate) {
      Logger.fatal(`tile transition: cannot find next position for current tile ${currentTile.guid} (${currentTile.displayName})`)
      throw new Error()
    }

    const nextTile: Tile = tiles.find(p => p.guid === nextTileSurrogate.tileGuid)

    if (!nextTile) {
      Logger.fatal(
        `tile transition: cannot find next tile from position x: ${nextTileSurrogate.x}, y: ${nextTileSurrogate.y}, current tile: ${currentTile.guid} (${currentTile.displayName})`)
      throw new Error()
    }

    //find border points with same coords (on the next tile)

    const nextBorderPoint = nextTileBorderPointsFunc(nextTile).find(p => p.val === borderPoint.val)

    if (!nextBorderPoint) {
      Logger.fatal(
        `tile transition: cannot find transition from tile ${currentTile.guid} (${currentTile.displayName}) to tile ${nextTile.guid} because top border point not found`)
      throw new Error()
    }
    if (nextBorderPoint.nextFieldId === null) {
      Logger.fatal(
        `tile transition: cannot find transition from tile ${currentTile.guid} (${currentTile.displayName}) to tile ${nextTile.guid} because top border point has no next field`)
      throw new Error()
    }


    const nextField = nextTile.fieldShapes.find(p => p.id === nextBorderPoint.nextFieldId)

    if (!nextField) {

      //we could do a transition without a field just border point to border point
      const nextBotBorderPoint = nextTile.botBorderPoints.find(p => p.id === nextBorderPoint.nextFieldId)


      if (nextBotBorderPoint) {
        //transition to bot

        const nextCoords = this.getNextTileAndField(nextBotBorderPoint, nextTile, tiles, tileSurrogates,
          nextNextSurrogate => nextNextSurrogate.x === nextTileSurrogate.x && nextNextSurrogate.y === nextTileSurrogate.y+1,
          nextNextTile => nextNextTile.topBorderPoints,
          depthCounter+1
        )

        return nextCoords
      }
      else {

        const nextTopBorderPoint = nextTile.topBorderPoints.find(p => p.id === nextBorderPoint.nextFieldId)

        if (nextTopBorderPoint) {
          //transition to top

          const nextCoords = this.getNextTileAndField(nextTopBorderPoint, nextTile, tiles, tileSurrogates,
            nextNextSurrogate => nextNextSurrogate.x === nextTileSurrogate.x && nextNextSurrogate.y === nextTileSurrogate.y - 1,
            nextNextTile => nextNextTile.botBorderPoints,
            depthCounter+1
          )

          return nextCoords

        }
        else {

          const nextLeftBorderPoint = nextTile.leftBorderPoints.find(p => p.id === nextBorderPoint.nextFieldId)

          if (nextLeftBorderPoint) {
            //transition to left

            const nextCoords = this.getNextTileAndField(nextLeftBorderPoint, nextTile, tiles, tileSurrogates,
              nextNextSurrogate => nextNextSurrogate.x === nextTileSurrogate.x - 1 && nextNextSurrogate.y === nextTileSurrogate.y,
              nextNextTile => nextNextTile.rightBorderPoint,
              depthCounter+1
            )

            return nextCoords
          }
          else {

            const nexRightBorderPoint = nextTile.rightBorderPoint.find(p => p.id === nextBorderPoint.nextFieldId)

            if (nexRightBorderPoint) {
              //transition to right

              const nextCoords = this.getNextTileAndField(nexRightBorderPoint, nextTile, tiles, tileSurrogates,
                nextNextSurrogate => nextNextSurrogate.x === nextTileSurrogate.x + 1 && nextNextSurrogate.y === nextTileSurrogate.y,
                nextNextTile => nextNextTile.leftBorderPoints,
                depthCounter+1
              )

              return nextCoords

            }
            else {
              Logger.fatal(`tile transition: cannot find next field ${nextBorderPoint.nextFieldId} on tile ${nextTile.guid} (${nextTile.displayName})`)
              throw new Error()
            }
          }
        }
      }

    }

    return {
      _nextTile: nextTile,
      _nextField: nextField
    }

  }


  private static checkIfControlStatementGotoItself(
    statement: ControlStatementUnit, position: WorldSimulationPosition): void {

    if (statement.type === "control_goto" && statement.targetId === position.fieldId) {
      Logger.fatal(`field ${position.fieldId} on tile ${position.tileGuid}: control goto itself --> infinite loop`)
    }

    //TODO maybe allow one branch??
    if (statement.type === "control_ifElse" && (statement.trueTargetId === position.fieldId || statement.falseTargetId === position.fieldId)) {
      Logger.fatal(
        `field ${position.fieldId} on tile ${position.tileGuid}: control if else some branch goto itself --> infinite loop`)
    }

  }

  /**
   * if the first statement of the current field is a force statement then
   * we execute all normal (not control) statements
   *
   * if the statements are forced and contain a end statement the current player has won
   * @param {ReadonlyArray<Tile>} tiles
   * @param {MachineState} state
   * @param checkTilePropsEndField the tile end fields can be set in the tile props for single tile simulation true: check, false: ignore
   *    this is evaluated as a forced game_end field
   * @returns {{state: MachineState; hasCurrentPlayerWon: boolean}}
   */
  public static executeForceStatements(tiles: ReadonlyArray<Tile>, state: MachineState,
                                       checkTilePropsEndField: boolean
  ): { state: MachineState, hasCurrentPlayerWon: boolean } {
    const token = state.players[state.currentPlayerIndex].tokens[state.currentPlayerActiveTokenIndex]

    let cmdText = this.getCurrentCmdText(tiles, token.tileGuid, token.fieldId)

    if (!cmdText) {
      Logger.fatal(`field ${token.fieldId} on tile ${token.tileGuid} has no commands`)
      throw new Error()
    }

    let game: GameUnit

    try {
      game = this.compiler.parse(cmdText)
    } catch (err) {

      let tokens = this.compiler.tokenize(cmdText)
      Logger.log('tokens before error:')
      Logger.log('', tokens)
      Logger.fatal(`field ${token.fieldId} on tile ${token.tileGuid}: has errors: ${err}`)
      throw new Error()
    }

    const statements = this.getNormalStatements(game.statements)


    const hasForceStatement = statements.some(p => p.type === 'force')
    const isFirstStatementAForceStatement = statements.length > 0 && statements[0].type === "force"

    if (hasForceStatement && !isFirstStatementAForceStatement) {

      if (statements.some(p => p.type === 'force')) {
        Logger.fatal(
          `field ${token.fieldId} on tile ${token.tileGuid}: force statements need to be the first statement`)
      }
      throw new Error()
    }

    let winnerCount = state.winnersIds.length
    let winnerCountAfterStatement = 0

    //the winner is set internally (in the state) by the game end function

    let hasCurrentPlayerWon = false
    //let hasCurrentPlayerWon = statements.some(p => p.type === 'end')

    const hasSomeImplicitForcedStatement = this.getImplicitForcedStatements(game.statements).length > 0

    if (isFirstStatementAForceStatement || hasSomeImplicitForcedStatement) {
      for (const statement of statements) {
        state = AbstractMachine.executeStatement(statement, state)

        winnerCountAfterStatement = state.winnersIds.length

        if (winnerCountAfterStatement > winnerCount) {
          hasCurrentPlayerWon = true
        }
      }
    }

    if (checkTilePropsEndField) {

      const tile = tiles.find(p => p.guid === token.tileGuid)

      if (!tile) {
        Logger.fatal(`current tile ${token.tileGuid} not found`)
        throw new Error()
      }

      if (token.fieldId === null) {
        Logger.fatal(`current player token field was null`)
        throw new Error()
      }

      //the player token is on the simulation end field for a single simulation
      // this is evaluated as a forced game_end field
      if (tile.simulationEndFieldIds.indexOf(token.fieldId) !== -1) {
        return {
          state,
          hasCurrentPlayerWon: true
        }
      }

    }

    return {
      state,
      hasCurrentPlayerWon
    }
  }


  private static getControlStatements(stats: ReadonlyArray<StatementUnit>): ReadonlyArray<ControlStatementUnit> {
    //TODO this is not properly typed
    return stats.filter(
      (p: StatementUnit) => p.type === "control_ifElse" || p.type === "control_goto") as ReadonlyArray<ControlStatementUnit>
  }

  private static getNormalStatements(stats: ReadonlyArray<StatementUnit>): ReadonlyArray<StatementUnit> {
    return stats.filter(p => !(p.type === "control_ifElse" || p.type === "control_goto"))
  }

  private static getImplicitForcedStatements(stats: ReadonlyArray<StatementUnit>): ReadonlyArray<StatementUnit> {
    return stats.filter(p => (p.type === "begin_scope" || p.type === "end_scope" || p.type === 'limit_scope'))
  }

  /**
   * if a player token reached a tile end we need to move the token to the new tile
   */
  public static doTileTransition(sourceTileGuid: string, sourceFieldId: number, nextTile: Tile, nextField: FieldShape,
                                 state: MachineState
  ): MachineState {


    //make sure to to correct the previous player pos so when correctly move back!

    return {
      ...state,
      players: state.players.map((value, index) => index !== state.currentPlayerIndex
        ? value
        : {
          ...value,
          tokens: value.tokens.map(p => {

            // console.log(p.previousPositions)

            return {
              ...p,
              fieldId: nextField.id,
              tileGuid: nextTile.guid, //the last position is the border point...  and add the last real field
              previousPositions: p.previousPositions.filter((prev, i) => i !== p.previousPositions.length - 1).concat({
                tileGuid: sourceTileGuid,
                fieldId: sourceFieldId
              } as WorldSimulationPosition)
            }
          }),
        },)
    }
  }


  /**
   * checks if we have a game end condition and executes it
   * @param {MachineState} state
   * @returns {boolean} true: the current player has won, false: not
   */
  public static currentPlayerHasWon(state: MachineState): boolean {

    return false
    /*
    TODO currently the compiler is not ready for game end condition because it's not optional yet
    if (state.gameEndCondition === null) return false

    const res = AbstractMachine.execExpression(state.gameEndCondition, state)

    if (res.boolVal !== null) {
      return res.boolVal
    }

    throw new Error('game end condition is not of type bool')
    */
  }

  /**
   * execute the code but ignore all goto statements
   *
   * if the first statement is a force statement do nothing here because we already executed this earlier
   * @param {ReadonlyArray<Tile>} tiles
   * @param {MachineState} state
   * @returns {MachineState}
   */
  public static executeCodeOnCurrentField(tiles: ReadonlyArray<Tile>, state: MachineState): MachineState {

    const token = state.players[state.currentPlayerIndex].tokens[state.currentPlayerActiveTokenIndex]
    let cmdText = this.getCurrentCmdText(tiles, token.tileGuid, token.fieldId)

    if (!cmdText) {
      console.error('current field has no commands!TODO')
      return state
    }

    let game: GameUnit

    try {
      game = this.compiler.parse(cmdText)
    } catch (err) {

      let tokens = this.compiler.tokenize(cmdText)
      console.log('tokens before error:')
      console.log(tokens)
      throw err
    }

    const normalStatements = this.getNormalStatements(game.statements)

    const isFirstStatementAForceStatement = normalStatements.length > 0 && normalStatements[0].type === "force"

    //if this is a force field we already executed it
    if (isFirstStatementAForceStatement) return state


    for (let i = 0; i < normalStatements.length; i++) {
      const statement = normalStatements[i]
      //also allow goto s here because we have control goto s which are only for movement
      //a normal goto is ok here
      state = AbstractMachine.executeStatement(statement, state)
    }

    return state
  }


  /**
   *
   * @param {ReadonlyArray<Tile>} tiles
   * @param tileSurrogates surrogates for tile transitions or null
   * @param {MachineState} state
   * @param {WorldSimulationPosition} startPos
   * @param {number} maxSteps the max steps to take (in case we got some infinite loop)
   * @param showPlayerHasWon true: displays a modal with the winner (also used for errors), false: silent mode, display no dialogs, only log
   * @param checkTilePropsEndField the prop tiles can store temp end fields for single tile simulations true: use them, false: ignore
   * @param {(state: MachineState, proposedSimulationStatus: SimulationState) => boolean} updateStateCallbackAndContinue
   * @param randomSeed the seed for the random values, undefined for not setting the seed (we set the seed outside of this function then)
   * @returns {Promise<MachineState>}
   */
  public static runSimulationTillEnd(tiles: ReadonlyArray<Tile>,
                                     tileSurrogates: ReadonlyArray<WorldTileSurrogate> | null, state: MachineState, maxSteps: number,
                                     startPos: WorldSimulationPosition, showPlayerHasWon: boolean, checkTilePropsEndField: boolean,
                                     randomSeed: number | null | undefined,
                                     updateStateCallbackAndContinue: (state: MachineState, proposedSimulationStatus: SimulationStatus) => {
                                       shouldContinue: boolean, simulationSpeedInDelayInMsBetweenSteps: number,
                                     }
  ): Promise<MachineState> {

    //simulation is already inited

    console.log(SimulationTimes._timeInS_rollDice)

    let promise = new Promise<MachineState>(async (resolve, reject) => {

      let stepsCounter = 0
      let callbackTuple
      let roundsCounter = 0

      if (randomSeed !== undefined) {
        AbstractMachine.setSeed(randomSeed)
      }

      //see https://stackoverflow.com/questions/30649994/can-i-catch-an-error-from-async-without-using-await
      //we need the try because this is async (because everything outside of await delay will not throw errors anymore)
      try {

        while (stepsCounter < maxSteps) {

          if (state.leftDiceValue === 0) {
            //round is finished...
            //next player round

            //start new round
            const res = Simulator.startNextRound(state)
            state = res.state
            roundsCounter++

            //suspend if needed
            if (res.currentPlayerSuspended) {
              Logger.log(`player ${state.currentPlayerIndex} suspends`)

              //end round
              state = Simulator.endRound(state)
              //we know state.leftDiceValue === 0 here

              stepsCounter++
              callbackTuple = updateStateCallbackAndContinue(state, SimulationStatus.running)

              if (!callbackTuple.shouldContinue) {
                //pause the simulation
                resolve(state)
                return
              }

              if (callbackTuple.simulationSpeedInDelayInMsBetweenSteps > 0) {
                await this.delay(callbackTuple.simulationSpeedInDelayInMsBetweenSteps)
              }

              continue
            }

            //Logger.log('dice: ', state.rolledDiceValue)
          }

          //move player token (execute control statements)
          const moveResult = Simulator.moveToken(tiles, tileSurrogates, state, startPos)
          state = moveResult.state

          if (moveResult.hasCurrentPlayerWon || Simulator.currentPlayerHasWon(state)) {
            if (showPlayerHasWon) {
              Logger.message(`player ${state.currentPlayerIndex} has won!`, 'Game over')
            }

            updateStateCallbackAndContinue(state, SimulationStatus.finished)
            resolve(state)
            return
          }

          //execute force statements on the new field
          const forceExecuteResult = Simulator.executeForceStatements(tiles, state, checkTilePropsEndField)
          state = forceExecuteResult.state

          if (forceExecuteResult.hasCurrentPlayerWon || Simulator.currentPlayerHasWon(state)) {
            if (showPlayerHasWon) {
              Logger.message(`player ${state.currentPlayerIndex} has won!`, 'Game over')
            }
            updateStateCallbackAndContinue(state, SimulationStatus.finished)
            resolve(state)
            return
          }

          //if we stop on a field...

          if (state.leftDiceValue === 0) {

            //if we rolled back don't execute the field again because here we started off
            if (state.wasStateRolledBack === true) {

              state = Simulator.endRound(state)
            } else {
              //execute the code on the current field (normal/not control statements) BUT
              //IF we already executed the code because of force DON'T execute any statement
              state = Simulator.executeCodeOnCurrentField(tiles, state)

              if (Simulator.currentPlayerHasWon(state)) {
                if (showPlayerHasWon) {
                  Logger.message(`player ${state.currentPlayerIndex} has won!`, 'Game over')
                }
                updateStateCallbackAndContinue(state, SimulationStatus.finished)
                resolve(state)
                return
              }

              //this field could be a move field... left dive val is now incremented
              if (state.leftDiceValue === 0) {
                //end round
                state = Simulator.endRound(state)
              }
            }
          }

          stepsCounter++
          callbackTuple = updateStateCallbackAndContinue(state, SimulationStatus.running)

          if (!callbackTuple.shouldContinue) {
            //pause the simulation
            resolve(state)
            return
          }

          if (callbackTuple.simulationSpeedInDelayInMsBetweenSteps > 0) {
            await this.delay(callbackTuple.simulationSpeedInDelayInMsBetweenSteps)
          }

        }

      } catch (err) {
        reject(err)
        return
      }

      if (showPlayerHasWon) {
        Logger.fatal(`the game took more than ${maxSteps} steps, probably an infinite loop`, 'Timeout')
      } else {
        Logger.log(`the game took more than ${maxSteps} steps, probably an infinite loop`)
      }


      reject(new Error(`the game took more than ${maxSteps} steps, probably an infinite loop`))

    })


    return promise
  }

  public static delay(timeInMs: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, timeInMs)
    })
  }

}

