import {CvRealMachineState, CvScalar, CvToken, TokenPosition} from "../types";
import {Tile} from "../../src/types/world";
import {intersectPoint} from "../../src/helpers/interactionHelper";
import {Rect} from "../../src/types/drawing";
import {isBoolVar, isIntVar, MachineState} from "../../simulation/machine/machineState";


/**
 * player to a color map
 */
export interface PlayerColorMap {
  /**
   * the color is only avg hsv so add some tolerance
   */
  [playerId: number]: CvScalar
}

export class RefereeHelper {
  private constructor() {
  }

  static playerColorMap: PlayerColorMap = {}

  /**
   * try to clip the given tokens to the fields in the tile
   *
   * ASSUMES every play has only one token
   *  AND every token is on only one field (the first intersecting one is taken)
   * @param tokens
   * @param tile
   * @param maxDiffInPx this is added on the size of the field (each direction)
   */
  static getTokenPositionsFromTile(tokens: CvToken[], tile: Tile, maxDiffInPx: number = 0): TokenPosition[] {


    const tokenPositions: TokenPosition[] = []

    for (const fieldShape of tile.fieldShapes) {

      for (const token of tokens) {

        const rect: Rect = {
          x: fieldShape.x - maxDiffInPx,
          y: fieldShape.y - maxDiffInPx,
          width: fieldShape.width + maxDiffInPx,
          height: fieldShape.height + maxDiffInPx
        }
        if (!intersectPoint(rect, token.bottomPoint)) continue

        const playerId = this.getPlayerIdFromColor(token.color, this.playerColorMap)

        if (playerId === null) {
          throw new Error(`could not get player id from color (${this.colorToString(token.color)})`)
        }

        tokenPositions.push({
          fieldId: fieldShape.id,
          tileGuid: tile.guid,
          tokenId: 0, //TODO only allow 1 token per player
          playerId
        })
      }
    }

    return tokenPositions
  }

  static colorToString(color: CvScalar): string {
    return `[${color[0]}, ${color[1]}, ${color[2]}]`
  }

  static getPlayerIdFromColor(color: CvScalar, playerColorMap: PlayerColorMap): number | null {

    for(const playerId in playerColorMap) {

      const playerColor = playerColorMap[playerId]

      const h = color[0], s = color[1], v = color[2]

      const rh = playerColor[0], rs = playerColor[1], rv = playerColor[2]

      //TODO add tolerance
      if (h == rh) {
        return parseInt(playerId)
      }

    }

    return null
  }


  static getVarValuesFromIndicator() {
    //TODO create DefinitionTable from img
  }

  /**
   *
   * RETURNS null (all ok
   *  OR [error message, real state as machine state]
   * @param state
   * @param realState
   */
  static compareStates(state: MachineState, realState: CvRealMachineState): null | [string] {


    //--- check if tokens are on the same fields

    for (const player of state.players) {

      if (player.tokens.length > 1) return ['only 1 token per player is allowed']

      for (const playerToken of player.tokens) {


        let wasFound = false

        for (const realTokenPosition of realState.tokenPositions) {

          //make sure we compare the same tokens... (color)

          if (player.id != realTokenPosition.playerId) continue

          wasFound = true

          if (playerToken.tileGuid != realTokenPosition.tileGuid) return [`player ${player.id} token (color: ${playerToken.color}) is on tileGuid (${realTokenPosition.tileGuid}) but should be on tileGuid (${playerToken.tileGuid})`]

          if (playerToken.fieldId != realTokenPosition.fieldId) return [`player ${player.id} token (color: ${playerToken.color}) is properly on tileGuid (${realTokenPosition.tileGuid}) but fieldId is (${realTokenPosition.fieldId}) and should be on fieldId (${playerToken.fieldId})`]

        }

        if (!wasFound) {
          return [`player ${player.id} token (color: ${playerToken.color}) was not found on the board`]
        }
      }
    }


    //--- check if var values are equal (tokens are on the right field on the var indicator)


    //-- global vars
    for(const ident in state.globalDefTable) {

      const entry = state.globalDefTable[ident]

      if (isIntVar(entry)) {

        const realEntry = realState.globalDefTable[ident]

        if (!realEntry) {
          return [`var (${ident}) was not found in the real state`]
        }

        if (isIntVar(realEntry)) {
          //ok

          if (realEntry.maxVal != entry.maxVal) {
            return [`var (${ident}) has max value (${realEntry.maxVal}) but should have max value (${entry.maxVal})`]
          }

          if (realEntry.val != entry.val) {
            return [`var (${ident}) has value (${realEntry.val}) but should have value (${entry.val})`]
          }

        }
        else {
          return [`var (${ident}) should have type int but is not of type int`]
        }

      }
      else if (isBoolVar(entry)) {

        const realEntry = realState.globalDefTable[ident]

        if (!realEntry) {
          return [`var (${ident}) was not found in the real state`]
        }

        if (isBoolVar(realEntry)) {
          //ok

          if (realEntry.boolVal != entry.boolVal) {
            return [`var (${ident}) has value (${realEntry.boolVal}) but should have value (${entry.boolVal})`]
          }

        }
        else {
          return [`var (${ident}) should have type bool but is not of type bool`]
        }

      }
      else {
        return [`unknown var type for var (${ident})`]
      }
    }


    //-- check player local vars (TODO)




    return null
  }

}
