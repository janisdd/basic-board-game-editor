import {PlayerColorMap, RefereeHelper} from "./helpers/RefereeHelper";
import {CvDice, CvScalar, CvToken} from "./types";
import {Cvt} from "./helpers/Cvt";
import {IoHelper} from "../src/helpers/ioHelper";
import {ExportWorld, Tile} from "../src/types/world";
import {MigrationHelper} from "../src/helpers/MigrationHelpers";
import {
  DefinitionTable,
  isBoolVar,
  isIntVar,
  MachineState,
  WorldSimulationPosition
} from "../simulation/machine/machineState";
import {Simulator} from "../simulation/simulator";
import {Logger} from "../src/helpers/logger";
import {SimulationStatus} from "../src/types/states";
import * as React from "react";

declare var cv: any

export class Referee {
  constructor() {
  }

  diceHelper: any = null
  tokenHelper: any = null
  world: ExportWorld

  simulationMachineState: MachineState | null = null

  tiles: Tile[] = []

  startPos: WorldSimulationPosition

   playerColorMap: PlayerColorMap = {}


  init() {
    this.diceHelper = new cv.DiceHelper()
    this.tokenHelper = new cv.TokenHelper()
  }

  getAvailableColorsFromTokens(imgMat: any): CvScalar[] {

    const tokens = this.getTokens(imgMat)
    return tokens.map(p => p.color)
  }

  /**
   * returns [tokens, debug img]
   * @param imgMat
   */
  getTokens(imgMat: any): [CvToken[], any] {

    let hsv = new cv.Mat();
    let binaryOutImg = new cv.Mat()

    cv.cvtColor(imgMat, hsv, cv.COLOR_BGR2HSV)

    let _tokens = this.tokenHelper.getTokensSlow(hsv, binaryOutImg)

    const tokens: CvToken[] = []

    const numDices = _tokens.size()
    for (let i = 0; i < numDices; i++) {
      tokens.push(Cvt.convertToken(_tokens.get(i)))
      console.log(_tokens.get(i))
    }

    let copy = this.tokenHelper.drawTokens(imgMat, _tokens);

    binaryOutImg.delete()
    hsv.delete()

    return [tokens, copy]
  }




  /**
   * returns dices and draws debug into imgMatCopy
   * @param imgMatCopy
   */
  getDiceValue(imgMatCopy: any): CvDice {

    if (!this.diceHelper) this.init()

    let _dices = this.diceHelper.getDiceValues(imgMatCopy)
    this.diceHelper.drawDiceDebug(_dices, imgMatCopy)

    const dices: CvDice[] = []

    const numDices = _dices.size()
    for (let i = 0; i < numDices; i++) {
      dices.push(Cvt.convertDice(_dices.get(i)))
      console.log(_dices.get(i))
    }

    if (dices.length === 0) throw new Error(`no dice found`)

    return dices[0]
  }


  settWorld(exportWorld: ExportWorld) {
    this.world = exportWorld
  }

  startNewSimulation() {
    if (!this.world) throw new Error('import world first')


    //get all tiles where we have an surrogate (instance) in the world
    const tiles = this.world.allTiles.filter(p => this.world.worldTiles.some(surr => surr.tileGuid === p.guid))
    this.tiles = tiles

    Simulator.parseAllFields(this.world.worldSettings.worldCmdText, tiles,
      true,
      true,
      false,
      false
    )

    //start field in props are only for single tile simulation
    const startPos = Simulator.getStartFieldPosition(tiles, false)

    //should already be checked by parse all fields but ... why not check again
    if (!startPos) {
      Logger.fatal('no start field found')
      return
    }

    this.startPos = startPos

    this.simulationMachineState = Simulator.initNew(startPos, true, this.world.worldSettings.worldCmdText)

  }


  /**
   * simulation should be already started here ...
   */
  applyNewColorMapping(playerColorMap: PlayerColorMap) {
    this.playerColorMap = playerColorMap

    this.simulationMachineState = {
      ...this.simulationMachineState,
      players: this.simulationMachineState.players.map((p, index) => {
        return {
          ...p,
          color: Cvt.rgbToHex(playerColorMap[index][1][0], playerColorMap[index][1][1], playerColorMap[index][1][2]),
          tokens: p.tokens.map((token, index1) => {
            return {
              ...token,
              color: Cvt.rgbToHex(playerColorMap[index][1][0], playerColorMap[index][1][1], playerColorMap[index][1][2]),
            }
          })
        }
      })
    }

  }

  updateVariablesTable(wrapperDiv: HTMLDivElement) {


    if (!this.simulationMachineState) {
      wrapperDiv.innerHTML = ""
      return
    }

    let html = ''

    //--- global vars

    html +=
      `<h3>global variables</h3>
`;

    const state = this.simulationMachineState

    html += this._getVarTableHtml(state.globalDefTable)

    //--- player variables

    html += `
    <h3>player local variables </h3>
    `

    for (const player of state.players) {
      html += `
        <h4>player ${player.id} TOOD color</h4>
        
      `
      html += this._getVarTableHtml(player.defTable)


      for(let i = 0; i < player.localDefTables.length;i++) {
        const defTable = player.localDefTables[i]

        html += `
          <h4>player local vars in scope level ${i}</h4>
        `

        html += this._getVarTableHtml(defTable.defTable)
      }

    }

    wrapperDiv.innerHTML = html

    console.log('print vars')



  }

  _getVarTableHtml(defTable: DefinitionTable) {

    let html =
      `
      <table border="1">
  <thead>
    <tr>
        <th>var</th>
        <th>value</th>
        <th>type</th>
        <th>range</th>
    </tr>
  </thead>
  <tbody>
      `

    for (const ident in defTable) {

      const entry = defTable[ident]

      if (isBoolVar(entry)) {
        html +=
          `<tr>
                <td>${ident}</td>
                <td>${entry.boolVal}</td>
                <td>bool</td>
                <td></td> 
           </tr>        
        `;

      } else if (isIntVar(entry)) {

        html +=
          `<tr>
                <td>${ident}</td>
                <td>${entry.val}</td>
                <td>int</td>
                <td>from: ${-(entry.maxVal + 1)} to : ${entry.maxVal}</td> 
           </tr>        
        `;
      }
    }

    html +=
      `
</tbody>
</table>
     `
    return html

  }


  simulateNextRound(rolledDiceValue?: number) {

    const maxSteps = 100
    let numSteps = 0

    const res = Simulator.startNextRound(this.simulationMachineState)
    this.simulationMachineState = res.state

    if (rolledDiceValue !== undefined) {
      this.simulationMachineState = {
        ...this.simulationMachineState,
        leftDiceValue: rolledDiceValue,
        rolledDiceValue,
      }

      this.simulationMachineState = {
        ...this.simulationMachineState,
        rollbackState: {
          ...this.simulationMachineState
        }
      }
    }


    console.log('starting next round')

    while (this.simulationMachineState.leftDiceValue > 0) {

      numSteps++

      if (numSteps > maxSteps) {
        throw new Error(`done more than ${numSteps} steps in single round, probably infinite loop?`)
      }

      if (res.currentPlayerSuspended) {
        Logger.log(`player ${this.simulationMachineState.currentPlayerIndex} suspends`)

        this.simulationMachineState = Simulator.endRound(this.simulationMachineState)
        return
      }


      const token = this.simulationMachineState.players[this.simulationMachineState.currentPlayerIndex].tokens[this.simulationMachineState.currentPlayerActiveTokenIndex]


      //--- move phase

      //this sets the player token to the start pos or execute the first found control statement
      //to set it to the next field
      //this also handles the tile transitions
      const moveResult = Simulator.moveToken(this.tiles, this.world.worldTiles, this.simulationMachineState, this.startPos)
      this.simulationMachineState = moveResult.state


      //the player token is now on a new field... he could have won
      if (moveResult.hasCurrentPlayerWon || Simulator.currentPlayerHasWon(this.simulationMachineState)) {
        Logger.message(`player ${this.simulationMachineState.currentPlayerIndex} has won!`, 'Game over')
        return
      }


      const afterMovePos: WorldSimulationPosition = {
        tileGuid: this.simulationMachineState.players[this.simulationMachineState.currentPlayerIndex].tokens[this.simulationMachineState.currentPlayerActiveTokenIndex].tileGuid,
        fieldId: this.simulationMachineState.players[this.simulationMachineState.currentPlayerIndex].tokens[this.simulationMachineState.currentPlayerActiveTokenIndex].fieldId
      }

      let afterForcePos: WorldSimulationPosition
      let wasForcedField = false


      try {

        //when we get on the field execute the force statement immediately
        //here we also check if the current player is on an END field (and has won)
        const forceExecuteResult = Simulator.executeForceStatements(this.tiles, this.simulationMachineState, false)

        this.simulationMachineState = forceExecuteResult.state

        wasForcedField = forceExecuteResult.wasForcedField

        afterForcePos = {
          tileGuid: this.simulationMachineState.players[this.simulationMachineState.currentPlayerIndex].tokens[this.simulationMachineState.currentPlayerActiveTokenIndex].tileGuid,
          fieldId: this.simulationMachineState.players[this.simulationMachineState.currentPlayerIndex].tokens[this.simulationMachineState.currentPlayerActiveTokenIndex].fieldId
        }

        if (forceExecuteResult.hasCurrentPlayerWon || Simulator.currentPlayerHasWon(this.simulationMachineState)) {
          Logger.message(`player ${this.simulationMachineState.currentPlayerIndex} has won!`, 'Game over')
          return
        }
      } catch (err) {
        //in case an evaluation error occurred
        const tile = this.tiles.find(p => p.guid === token.tileGuid)

        if (!tile) {
          // Logger.fatal(`tile with guid ${token.tileGuid} was not found`)
          Logger.fatal(`error on field after field with id: '${token.fieldId}', on tile '${token.tileGuid}' (tile not found), error: ${err.message}`)
          throw new Error()
        }

        Logger.fatal(`error on field after field with id: '${token.fieldId}', on tile '${token.tileGuid}' (${tile.tileSettings.displayName}), error: ${err.message}`)
      }


      //--- check player round end phase

      if (this.simulationMachineState.leftDiceValue === 0) {

        //if we rolled back don't execute the field again because here we started off
        if (this.simulationMachineState.wasStateRolledBack === true) {

          this.simulationMachineState = Simulator.endRound(this.simulationMachineState)
        } else {

          try {

            //we are still on the same field & we already executed the statements because of force
            if (wasForcedField && afterMovePos.fieldId === afterForcePos.fieldId && afterMovePos.tileGuid === afterForcePos.tileGuid) {
              //do nothing
            } else {

              //the current field was not forced OR we are on another field now
              //so we are sure we don't execute anything twice

              //the player stopped and we need to execute the fields command we landed on
              this.simulationMachineState = Simulator.executeCodeOnCurrentField(this.tiles, this.simulationMachineState)
            }


          } catch (err) {
            //in case an evaluation error occurred
            const tile = this.tiles.find(p => p.guid === token.tileGuid)

            if (!tile) {
              // Logger.fatal(`tile with guid ${token.tileGuid} was not found`)
              Logger.fatal(`error on field after field with id: '${token.fieldId}', on tile '${token.tileGuid}' (tile not found), error: ${err.message}`)
              throw new Error()
            }


            Logger.fatal(`error on field after field with id: '${token.fieldId}', on tile '${token.tileGuid}' (${tile.tileSettings.displayName}), error: ${err.message}`)
          }


          //check if current player has won after executing the current fields statement
          if (Simulator.currentPlayerHasWon(this.simulationMachineState)) {
            Logger.message(`player ${this.simulationMachineState.currentPlayerIndex} has won!`, 'Game over')
            return
          }

          //this field could be a move field... left dive val is now incremented
          if (this.simulationMachineState.leftDiceValue === 0) {
            //end round
            this.simulationMachineState = Simulator.endRound(this.simulationMachineState)
          }
        }
      }


    }

  }


}

