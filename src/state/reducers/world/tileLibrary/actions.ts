import {ActionType, SET_possibleTilesAction} from "./tileLibraryReducer";
import {Tile} from "../../../../types/world";
import {BezierPoint, FieldShape, LineShape, PlainPoint} from "../../../../types/drawing";
import {MultiActions} from "../../../../types/ui";
import {
  checkIfTileBorderPointsAndLinePointsAreConnectedAndSnap,
  isFieldAndLineConnectedThroughAnchorPoints
} from "../../../../helpers/interactionHelper";
import {setPropertyEditor_FieldConnectedLinesThroughAnchors} from "../../tileEditor/fieldProperties/actions";
import {_setLinePointNewPos} from "../../tileEditor/lineProperties/actions";
import {Logger} from "../../../../helpers/logger";


export function set_tileLibrary_possibleTiles(possibleTiles: ReadonlyArray<Tile>): SET_possibleTilesAction {
  return {
    type: ActionType.SET_possibleTiles,
    possibleTiles
  }
}


/**
 * sets a point for a line in the tile library for a specific tile
 *
 * this just sets the point coords and not e.g. connect the line to fields or something...
 * this is only used if the connection does not changes e.g. when we change a field symbol
 * @param tileGuide
 * @param lineId
 * @param oldPointId
 * @param newPointPos
 */
export function set_LinePointNewPosAction(tileGuide: string, lineId: number, oldPointId: number, newPointPos: PlainPoint): MultiActions {
  return (dispatch, getState) => {

    const allTiles = getState().tileLibraryState.possibleTiles
    const tileIndex = allTiles.findIndex(p => p.guid === tileGuide)
    const tile = allTiles.find(p => p.guid === tileGuide)

    if (!tile) {
      Logger.fatal(`[internal] could not find a tile with guide '${tileGuide}' to adjust lines because field symbol changed`)
      return
    }

    const line = tile.lineShapes.find(p => p.id === lineId)

    if (!line) {
      Logger.fatal(`[internal] could not find line with id '${lineId}' (in tile '${tileGuide}') to adjust lines because field symbol changed`)
      return
    }

    let lineCopy: LineShape

    if (line.startPoint.id === oldPointId) {

      lineCopy = {
        ...line,
        startPoint: {
          ...line.startPoint,
          x: newPointPos.x,
          y: newPointPos.y
        }
      }

    } else {
      //maybe old point?

      let found = false

      lineCopy = {
        ...line,
        points: line.points.map(p => {
            if (p.id === oldPointId) {
              found = true
              return {
                ...p,
                x: newPointPos.x,
                y: newPointPos.y
              } as BezierPoint
            }
            return p
          }
        )
      }


      if (!found) {
        Logger.fatal(`[internal] could not find line point with id '${oldPointId}' on line with id '${lineId}' (in tile '${tileGuide}') to adjust lines because field symbol changed`)
        return
      }

    }

    const copy: Tile = {
      ...tile,
      lineShapes: tile.lineShapes.map(line =>
        line.id !== lineId
          ? line
          : lineCopy)
    }

    dispatch(set_tileLibrary_possibleTiles(allTiles.map((tile, index) =>
      index !== tileIndex
        ? tile
        : copy
    )))

  }
}
