import {
  BorderPoint,
  ConnectedLinesThroughAnchorPointsMap,
  FieldShape,
  ImgShape,
  LineShape,
  PlainPoint
} from "../types/drawing";
import {WorldTileSurrogate} from "../../simulation/machine/machineState";
import {Tile} from "../types/world";
import {Logger} from "./logger";
import {getGuid} from "./guid";


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

  /**
   * @example
   * const boundingBox = WorldTilesHelper.getWorldBoundingBox(tileSurrogates)
   * const widthInTiles = boundingBox.maxX - boundingBox.minX + 1 //+1 max = min = 1 --> 0 but this is 1 tile
   * const heightInTiles = boundingBox.maxY - boundingBox.minY + 1
   *
   * @param tileSurrogates
   */
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


  public static cloneTile(tile: Tile): Tile {

    //make a real, deep copy
    const _copy = JSON.parse(JSON.stringify(tile))
    const copy:Tile = {
      ..._copy,
      guid: getGuid()
    }

    return copy

  }

  public static convertWorldToTile(tileSurrogates: ReadonlyArray<WorldTileSurrogate>, allTiles: ReadonlyArray<Tile>, expectedTileWidth: number, expectedTileHeight: number): Tile {


    if (tileSurrogates.length === 0) {
      Logger.fatal(`no tiles in world to convert`)
    }

    const bbox = WorldTilesHelper.getWorldBoundingBox(tileSurrogates)
    const widthInTiles = bbox.maxX - bbox.minX + 1 //coordinates e.g. 1 tile --> we need always +1
    const heightInTiles = bbox.maxY - bbox.minY + 1

    const fieldShapes: FieldShape[] = []
    const imgShapes: ImgShape[] = []
    const lineShapes: LineShape[] = []

    const botBorderPoints: BorderPoint[] = []
    const leftBorderPoints: BorderPoint[] = []
    const rightBorderPoint: BorderPoint[] = []
    const topBorderPoints: BorderPoint[] = []

    let upperLeftTile: Tile | null = null

    let offsetX = 0
    let offsetY = 0

    //first border points then shapes
    let currentId = 0
    let currentZIndex = 0

    for (let j = 0; j < heightInTiles; j++) { //top to bottom

      for (let i = 0; i < widthInTiles; i++) { //left to right

        const tileSurrogate = tileSurrogates.find(p => p.x === bbox.minX + i && p.y === bbox.minY + j)

        if (!tileSurrogate) {
          //no tile here... insert space
          offsetX += expectedTileWidth

          continue
        }

        const tile = allTiles.find(p => p.guid === tileSurrogate.tileGuid)
        if (!tile) {
          Logger.fatal(`for a tiles the data could not be found, guid: ${tileSurrogate.tileGuid}`)
        }

        if (!upperLeftTile) {
          upperLeftTile = tile
        }

        //-- border point

        //probably we don't need them...
        //if implemented in the future make sure we only include border points on the sides e.g.

        // (0,0) use only lef,top border points
        // (0, max x) use only top, right border points
        // all other (0, i) use only top border points
        // -- if we have more than 1 row
        // also make sure to remap the connect lines properly via changedLineMapping

        //-- shapes

        for (const imgShape of tile.imgShapes) {
          const copy: ImgShape = {
            ...imgShape,
            id: currentId++,
            x: offsetX + imgShape.x,
            y: offsetY + imgShape.y,
            zIndex: currentZIndex++
          }
          imgShapes.push(copy)
        }



        const changedLineMapping: ChangedLineMapping = {}

        for (const lineShape of tile.lineShapes) {
          const copy: LineShape = {
            ...lineShape,
            id: currentId++,
            startPoint: {
              ...lineShape.startPoint,
              id: currentId++,
              x: offsetX + lineShape.startPoint.x,
              y: offsetY + lineShape.startPoint.y,
            },
            points: lineShape.points.map(p => {
              return {
                ...p,
                id: currentId++,
                x: offsetX + p.x,
                y: offsetY + p.y,
                cp1: {
                  ...p.cp1,
                  id: currentId++,
                  x: offsetX + p.cp1.x,
                  y: offsetY + p.cp1.y,
                },
                cp2: {
                  ...p.cp2,
                  id: currentId++,
                  x: offsetX + p.cp2.x,
                  y: offsetY + p.cp2.y,
                }
              }
            }),
            zIndex: currentZIndex++
          }

          const arr: Array<[number, number]> = []

          arr.push([lineShape.startPoint.id, copy.startPoint.id])

          for (let k = 0; k < lineShape.points.length; k++) {
            const point = lineShape.points[k]
            const newPoint = copy.points[k]

            arr.push([point.id, newPoint.id])
            arr.push([point.cp2.id, newPoint.cp1.id])
            arr.push([point.cp2.id, newPoint.cp2.id])
          }

          const entry: ChangedLineMappingEntry = {
            newLineId: copy.id,
            changedLinePoints: arr
          }

          changedLineMapping[lineShape.id] = entry

          lineShapes.push(copy)
        }

        for (const fieldShape of tile.fieldShapes) {

          const copy: FieldShape = {
            ...fieldShape,
            id: currentId++,
            x: offsetX + fieldShape.x,
            y: offsetY + fieldShape.y,
            zIndex: currentZIndex++,
            anchorPoints: fieldShape.anchorPoints.map((anchorPoint) => {
              return {
                ...anchorPoint,
                id: currentId++,
                connectedLineTuples: anchorPoint.connectedLineTuples.map((value, index) => {

                  //line and point id changed...find new ids
                  const oldTuple = changedLineMapping[value.lineId]

                  if (!oldTuple) {
                      throw new Error(`old line id not found: ${value.lineId} on tile: ${tile.guid} (${tile.tileSettings.displayName})`)
                  }

                  const oldPointIdTuple = oldTuple.changedLinePoints.find(p => p[0] === value.pointId)

                  if (!oldTuple) {
                    throw new Error(`old line point id not found: ${value.pointId}, on old line id: ${value.lineId} on tile: ${tile.guid} (${tile.tileSettings.displayName})`)
                  }

                  return {
                    ...value,
                    lineId: oldTuple.newLineId,
                    pointId: oldPointIdTuple[1]
                  }
                })
              }
            })
          }

          fieldShapes.push(copy)
        }


        //increment offset after we added the tile else the first tile would already be shifted
        // offsetX += tile.tileSettings.width
        offsetX += expectedTileWidth
      }


      // offsetY += upperLeftTile.tileSettings.height
      offsetY += expectedTileHeight
      //start a new row
      offsetX = 0
    }


    let totalWidth = expectedTileWidth * widthInTiles
    let totalHeight = expectedTileHeight * heightInTiles

    const newTile: Tile = {
      guid: getGuid(),
      fieldShapes,
      imgShapes,
      lineShapes,
      simulationEndFieldIds: [],
      simulationStartFieldIds: [],
      botBorderPoints,
      leftBorderPoints,
      rightBorderPoint,
      topBorderPoints,
      tileSettings: {
        ...upperLeftTile.tileSettings,
        width: totalWidth,
        height: totalHeight,
        displayName: 'worldTile converted',
      }
    }

    return newTile

  }

}


interface ChangedLineMapping {
  [oldLineId: number]: ChangedLineMappingEntry
}

interface ChangedLineMappingEntry {
  readonly newLineId: number

  /**
   * the first entry is the starting point
   * then the first line point
   *    then cp1
   *    then cp2
   * then the next line point
   * a tuple for every line point [0] is the old id, [1] is the new id
   */
  readonly changedLinePoints: ReadonlyArray<[number, number]>
}
