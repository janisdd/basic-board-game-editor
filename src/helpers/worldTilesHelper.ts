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

        //border point

        //probably we don't need them...
        //if implemented in the future make sure we only include border points on the sides e.g.

        // (0,0) use only lef,top border points
        // (0, max x) use only top, right border points
        // all other (0, i) use only top border points
        // -- if we have more than 1 row
        //...

        //shapes

        const changedLineMapping: ChangedLineMapping = {}

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

        for (const lineShape of tile.lineShapes) {
          const copy: LineShape = {
            ...lineShape,
            id: currentId++,
            dashArray: lineShape.dashArray.concat(), //make sure we have a flat copy... no references
            startPoint: {
              ...lineShape.startPoint,
              id: currentId++
            },
            points: lineShape.points.map(p => {
              return {
                ...p,
                id: currentId++,
                cp1: {
                  ...p.cp1,
                  id: currentId++
                },
                cp2: {
                  ...p.cp2,
                  id: currentId++
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

          const connectedLinesThroughAnchorPoints: ConnectedLinesThroughAnchorPointsMap = {}

          const lineIds = Object.keys(fieldShape.connectedLinesThroughAnchorPoints).map(p => parseInt(p))

          for (let k = 0; k < lineIds.length; k++) {
            const lineId = lineIds[k]
            const entry = changedLineMapping[lineId]
            const newLineId = entry.newLineId

            const oldConnectedLineIds = fieldShape.connectedLinesThroughAnchorPoints[lineId]

            if (oldConnectedLineIds === undefined) {
              connectedLinesThroughAnchorPoints[newLineId] = undefined
              continue
            }


            const newConnectedLinePointIds: number[] = []

            for (let l = 0; l < oldConnectedLineIds.length; l++) {
              const oldConnectedLineId = oldConnectedLineIds[l]

              const mapping = entry.changedLinePoints.find(p => p[0] === oldConnectedLineId)

              if (!mapping) {
                Logger.fatal(`could not find old line point for connected lines, tile guid: ${tile.guid}, field id: ${fieldShape.id}, line id : ${lineId}, old connected line point id: ${oldConnectedLineId}`)
              }

              const newConnectedLineId = mapping[1]
              newConnectedLinePointIds.push(newConnectedLineId)
            }

            connectedLinesThroughAnchorPoints[newLineId] = newConnectedLinePointIds
          }

          const copy: FieldShape = {
            ...fieldShape,
            id: currentId++,
            x: offsetX + fieldShape.x,
            y: offsetY + fieldShape.y,
            anchorPoints: fieldShape.anchorPoints.map(p => { //make sure we have a flat copy... no references
              return {
                ...p
              }
            }),
            padding: {
              ...fieldShape.padding
            },
            connectedLinesThroughAnchorPoints,
            zIndex: currentZIndex++,
          }

          fieldShapes.push(copy)
        }

        //increment offset after we added the tile else the first tile would already be shifted
        offsetX += tile.tileSettings.width
      }


      offsetY += upperLeftTile.tileSettings.height
      //start a new row
      offsetX = 0
    }


    let totalWidth = upperLeftTile.tileSettings.width * widthInTiles
    let totalHeight = upperLeftTile.tileSettings.height * heightInTiles

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
        displayName: 'worldTile 1',
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