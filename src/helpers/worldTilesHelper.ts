import {PlainPoint} from "../types/drawing";
import {WorldTileSurrogate} from "../../simulation/machine/machineState";


export class WorldTilesHelper {
  private constructor() {
  }

  public static getTileFromPos(xInTiles: number, yInTiles: number, allTiles: ReadonlyArray<WorldTileSurrogate>): WorldTileSurrogate | null {

    const res = allTiles.find(p => p.x === xInTiles && p.y === yInTiles)

    if (res) return res

    return null
  }

  public static getTilePosFromCoords(x: number, y: number, tilesWidth: number, tilesHeight: number, maxWidthInTiles: number, maxHeightInTiles: number): PlainPoint | null {

    if (x < 0 || y < 0 ||
      x > tilesWidth * maxWidthInTiles ||
      y > tilesHeight * maxHeightInTiles
    ) {
      return null
    }

    return {
      x: Math.floor(x / tilesWidth),
      y: Math.floor(y / tilesHeight)
    }

  }

  public static getWorldBoundingBox(tileSurrogates: ReadonlyArray<WorldTileSurrogate>): {
    readonly minX: number
    readonly minY: number
    readonly maxX: number
    readonly maxY: number
  } {

    const xVals = tileSurrogates.map(p => p.x)
    const minX = Math.min(...xVals)
    const maxX = Math.max(...xVals)

    const yVals = tileSurrogates.map(p => p.y)
    const minY = Math.min(...yVals)
    const maxY = Math.max(...yVals)

    return {
      maxX,
      maxY,
      minX,
      minY
    }
  }

}