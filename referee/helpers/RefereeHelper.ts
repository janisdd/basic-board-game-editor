import {CvPoint, CvRealMachineState, CvRect, CvScalar, CvToken, TokenPosition} from "../types";
import {Tile} from "../../src/types/world";
import {isBoolVar, isIntVar, MachineState} from "../../simulation/machine/machineState";
import {PlainPoint, Rect} from "../../src/types/drawing";
import {Cvt} from "./Cvt";


/**
 * [0] hsv
 * [1] rgb
 */
export type PlayerColorMapEntry = [CvScalar, CvScalar]

/**
 * player to a color map
 */
export interface PlayerColorMap {
  /**
   * the color is only avg hsv so add some tolerance
   */
  [playerId: number]: PlayerColorMapEntry
}

export class RefereeHelper {


  h_tolerance_getPlayerIdFromColor = 20
  s_tolerance_getPlayerIdFromColorPercenage = 10
  v_tolerance_getPlayerIdFromColorPercentage = 20

  playerColorMap: PlayerColorMap = {}

  isTokenInTile(token: CvToken, tileRect: CvRect, maxDiffInPx: number = 0): boolean {
    return this.intersectPoint(tileRect, token.bottomPoint)
  }

  /**
   * try to clip the given tokens to the fields in the tile
   *
   * ASSUMES every play has only one token
   *  AND every token is on only one field (the first intersecting one is taken)
   * @param tokens
   * @param tileRect the react (coords) in the real img, use this as offset
   * @param tile
   * @param playerColorMap
   * @param homographyMat
   * @param worldHelper
   * @param throwOnNotFoundPlayerColor true: throw if we cannot map the token color to a player color, false: will be null
   * @param maxDiffInPx this is added on the size of the field (each direction)
   */
  getTokenPositionsFromTile(tokens: CvToken[], tileRect: CvRect, tile: Tile, playerColorMap: PlayerColorMap, homographyMat: any, worldHelper: any, throwOnNotFoundPlayerColor: boolean, maxDiffInPx: number = 0): TokenPosition[] {


    //if we use a maxDiffInPx then the token could be on two fields...

    const tokenPositions: TokenPosition[] = []

    for (const token of tokens) {

      for (const fieldShape of tile.fieldShapes) {

        if (this.isTokenInTile(token, tileRect, maxDiffInPx) === false) continue

        const fieldRect: CvRect = {
          x: fieldShape.x,
          y: fieldShape.y,
          width: fieldShape.width,
          height: fieldShape.height
        }

        const fieldPos: CvRect = worldHelper.perspectiveTransformRect(fieldRect, homographyMat)

        const rect: CvRect = {
          x: fieldPos.x - maxDiffInPx,
          y: fieldPos.y - maxDiffInPx,
          width: fieldPos.width + maxDiffInPx * 2,
          height: fieldPos.height + maxDiffInPx * 2
        }

        if (!this.intersectPoint(rect, token.bottomPoint)) continue

        const playerId = this.getPlayerIdFromColor(token.color, playerColorMap)

        if (throwOnNotFoundPlayerColor && playerId === null) {
          throw new Error(`could not get player id from color (${this.colorToString(token.color)})`)
        }

        const fieldPosCenter: CvPoint = {
          x: fieldPos.x + (fieldPos.width / 2),
          y: fieldPos.y + (fieldPos.height / 2)
        }

        const distToFieldCenterInPx = this.calcDist(fieldPosCenter, token.bottomPoint)

        const entry: TokenPosition = {
          fieldId: fieldShape.id,
          tileGuid: tile.guid,
          tokenId: 0, //TODO only allow 1 token per player
          playerId,
          fieldText: fieldShape.text,
          distToFieldCenterInPx
        }

        const oldEntryIndex = tokenPositions.findIndex(p => p.tokenId === 0 && p.playerId === entry.playerId)
        const oldEntry = tokenPositions[oldEntryIndex]

        if (oldEntry) {
          //we found the same token for the same player on a different pos?
          //use the closes one...

          if (entry.distToFieldCenterInPx < oldEntry.distToFieldCenterInPx) {
            //use the new entry
            tokenPositions.splice(oldEntryIndex, 1, entry)
          } else {
            //use the old (don't add the new one)
          }

          continue
        }

        //no old entry, push first
        tokenPositions.push(entry)
      }
    }

    return tokenPositions
  }

  calcDist(p1: CvPoint, p2: CvPoint): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
  }

  colorToString(color: CvScalar): string {
    return `[${color[0]}, ${color[1]}, ${color[2]}]`
  }

  getPlayerIdFromColor(color: CvScalar, playerColorMap: PlayerColorMap): number | null {

    for (const playerId in playerColorMap) {

      const playerColor = playerColorMap[playerId]

      const hsv = playerColor[0]

      //token colors
      const th = color[0], ts = Cvt.getPercentageSV(color[1]), tv = Cvt.getPercentageSV(color[2])

      //player color
      const ph = hsv[0], ps = Cvt.getPercentageSV(hsv[1]), pv = Cvt.getPercentageSV(hsv[2])

      if (th < ph - this.h_tolerance_getPlayerIdFromColor || th > ph + this.h_tolerance_getPlayerIdFromColor) continue

      if (ts < ps - this.s_tolerance_getPlayerIdFromColorPercenage || ts > ps + this.s_tolerance_getPlayerIdFromColorPercenage) continue

      if (this.v_tolerance_getPlayerIdFromColorPercentage >= 0)
        if (tv < pv - this.v_tolerance_getPlayerIdFromColorPercentage || tv > pv + this.v_tolerance_getPlayerIdFromColorPercentage) continue

      return parseInt(playerId)
    }

    return null
  }


  getVarValuesFromIndicator() {
    //TODO create DefinitionTable from img
  }

  /**
   *
   * RETURNS null (all ok
   *  OR [error message, real state as machine state]
   * @param state
   * @param realState
   */
  compareStates(state: MachineState, realState: CvRealMachineState, checkGlobalVars: boolean, checkPlayerVars: boolean): null | [string] {

    console.log(`--- compare states ---`)

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

          if (playerToken.tileGuid === null && playerToken.fieldId === null) {
            //tokens should not be on the board && is not (not found)
            continue
          }

          return [`player ${player.id} token (color: ${playerToken.color}) was not found on the board`]
        }
      }
    }


    //--- check if var values are equal (tokens are on the right field on the var indicator)

    if (checkGlobalVars) {
      //-- global vars
      for (const ident in state.globalDefTable) {

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

          } else {
            return [`var (${ident}) should have type int but is not of type int`]
          }

        } else if (isBoolVar(entry)) {

          const realEntry = realState.globalDefTable[ident]

          if (!realEntry) {
            return [`var (${ident}) was not found in the real state`]
          }

          if (isBoolVar(realEntry)) {
            //ok

            if (realEntry.boolVal != entry.boolVal) {
              return [`var (${ident}) has value (${realEntry.boolVal}) but should have value (${entry.boolVal})`]
            }

          } else {
            return [`var (${ident}) should have type bool but is not of type bool`]
          }

        } else {
          return [`unknown var type for var (${ident})`]
        }
      }

    }


    //-- check player local vars (TODO)
    if (checkPlayerVars) {

    }


    return null
  }


  //IF WE IMPORT THIS FUNC from interactionHelper we get a cyclic dependency somehow...
  intersectPoint(rect1: Rect, point: PlainPoint) {

    if (rect1.width < 0) {
      rect1.x = rect1.x + rect1.width
      rect1.width = -rect1.width
    }
    if (rect1.height < 0) {
      rect1.y = rect1.y + rect1.height
      rect1.height = -rect1.height
    }

    return !(point.x > rect1.x + rect1.width ||
      point.x < rect1.x ||
      point.y > rect1.y + rect1.height ||
      point.y < rect1.y)

  }
}
