import {WorldTilesHelper} from "../../src/helpers/worldTilesHelper";
import * as graphics from "../../graphics/graphicsCore";
import {worldSelectedTileBorderColor, worldTileBorderColor} from "../../src/constants";
import {FieldShape} from "../../src/types/drawing";
import {ExportWorld} from "../../src/types/world";
import {ZIndexCache} from "../../src/types/ui";
import MouseEvent = createjs.MouseEvent
import {MachineState} from "../../simulation/machine/machineState";


export class WorldDrawer {

  public constructor() {}

  renderStage: createjs.Stage = null
  canvas: HTMLCanvasElement

  zIndexCache: ZIndexCache = {}

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.renderStage = new createjs.Stage(canvas)
    this.zIndexCache = {}
  }

  drawWorld(exportWorld: ExportWorld, simulationMachineState: MachineState | null) {

    // canvas.removeEventListener('wheel', this.onWheelReference)

    //clear all old
    this.renderStage.removeAllEventListeners()
    for (const item of this.renderStage.children) {
      item.removeAllEventListeners()
    }
    this.renderStage.clear()
    this.renderStage.removeAllChildren()

    // console.log(this.renderStage)

    // this.onWheelReference = this.onWheel.bind(this) //_.throttle(this.onWheel.bind(this), 500)
    // this.canvas.addEventListener("wheel", this.onWheelReference)

    this.renderStage.on('selectstart', () => {
      return false
    })
    createjs.Touch.enable(this.renderStage)


    //--- draw
    // this.renderStage.scaleX = this.props.worldSettings.stageScaleX
    // this.renderStage.scaleY = this.props.worldSettings.stageScaleY

    // this.renderStage.x = this.props.worldSettings.stageOffsetX + this.props.worldSettings.stageOffsetXScaleCorrection
    // this.renderStage.y = this.props.worldSettings.stageOffsetY + this.props.worldSettings.stageOffsetYScaleCorrection


    const defaultTileWidth = exportWorld.worldSettings.expectedTileWidth
    const defaultTileHeight = exportWorld.worldSettings.expectedTileHeight

    for (let j = 0; j < exportWorld.worldSettings.worldHeightInTiles; j++) {
      for (let i = 0; i < exportWorld.worldSettings.worldWidthInTiles; i++) {

        const tileSurrogate = WorldTilesHelper.getTileFromPos(i, j, exportWorld.worldTiles)

        // if (exportWorld.selectedTilePos != null &&
        //   i === exportWorld.selectedTilePos.x &&
        //   j === exportWorld.selectedTilePos.y) {
        //
        //   graphics.drawGrid(
        //     this.renderStage,
        //     defaultTileWidth,
        //     defaultTileHeight,
        //     0,
        //     1,
        //     worldSelectedTileBorderColor,
        //     true,
        //     i * defaultTileWidth,
        //     j * defaultTileHeight
        //   )
        // } else {

          //not selected tile
          graphics.drawGrid(
            this.renderStage,
            defaultTileWidth,
            defaultTileHeight,
            0,
            1,
            worldTileBorderColor,
            true,
            i * defaultTileWidth,
            j * defaultTileHeight
          )
        // }


        //maybe error?
        if (!tileSurrogate) continue

        const tile = exportWorld.allTiles.find(p => p.guid === tileSurrogate.tileGuid)

        if (!tile) continue

        graphics.drawTileBorderPoints(
          this.renderStage,
          defaultTileWidth,
          defaultTileHeight,
          tile.topBorderPoints,
          tile.botBorderPoints,
          tile.leftBorderPoints,
          tile.rightBorderPoint,
          exportWorld.worldSettings,
          i * defaultTileWidth,
          j * defaultTileHeight,
          false,
          null
        )

        graphics.drawFieldsOnTile(
          this.renderStage,
          tile.fieldShapes,
          [],
          [],
          null,
          null,
          null,
          this.zIndexCache,
          false,
          false,
          exportWorld.worldSettings,
          exportWorld.fieldSymbols,
          i * defaultTileWidth,
          j * defaultTileHeight,
          true,
          // null, null, null
        )

        graphics.drawImagesOnTile(
          this.renderStage,
          tile.imgShapes,
          [],
          [],
          null,
          null,
          null,
          this.zIndexCache,
          exportWorld.worldSettings,
          exportWorld.imgSymbols,
          i * defaultTileWidth,
          j * defaultTileHeight,
          true
        )

        graphics.drawLinesOnTile(
          this.renderStage,
          tile.lineShapes,
          [],
          [],
          null,
          null,
          this.zIndexCache,
          exportWorld.worldSettings,
          exportWorld.lineSymbols,
          i * defaultTileWidth,
          j * defaultTileHeight,
          true
        )

      }
    }


    //set zindex
    for (const zIndex in this.zIndexCache) {
      const list = this.zIndexCache[zIndex]

      for (const child of list) {
        this.renderStage.setChildIndex(child, parseInt(zIndex))
      }
    }

    // this.renderStage.on('stagemousedown', eventObj => {
    //   const e = eventObj as MouseEvent
    //
    //
    //   if (e.nativeEvent.button === 0) {
    //     //transform in case we translate/scaled
    //     this.stageMouseDownPoint = {
    //       x: e.stageX - exportWorld.worldSettings.stageOffsetX,
    //       y: e.stageY - exportWorld.worldSettings.stageOffsetY
    //     }
    //
    //
    //     this.stageMouseDownLocalPoint = this.renderStage.globalToLocal(e.stageX, e.stageY)
    //   }
    //
    //
    //   //https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
    //   //mouse middle button --> reset zoom
    //   if (e.nativeEvent.button === 1) {
    //
    //     const onCanvasX = e.nativeEvent.pageX - this.canvas.offsetLeft
    //     const onCanvasY = e.nativeEvent.pageY - this.canvas.offsetTop
    //
    //     const referencePoint = this.renderStage.globalToLocal(onCanvasX, onCanvasY)
    //
    //     //zoom to normal
    //     exportWorld.set_world_stageScale(1, 1)
    //     exportWorld.set_world_stageOffsetScaleCorrection(0, 0)
    //
    //     const referencePoint2 = this.renderStage.globalToLocal(onCanvasX, onCanvasY)
    //
    //     const newX = exportWorld.worldSettings.stageOffsetX - (referencePoint.x - referencePoint2.x)
    //     const newY = exportWorld.worldSettings.stageOffsetY - (referencePoint.y - referencePoint2.y)
    //
    //     exportWorld.set_world_stageOffset(newX, newY)
    //   }
    //
    //   this.isDraggingStage = false
    //
    // })

    // this.renderStage.on('stagemouseup', eventObj => {
    //   const e = eventObj as MouseEvent
    //   //transform in case we translate/scaled
    //   const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)
    //
    //   if (this.isDraggingStage === false && mouseX === this.stageMouseDownLocalPoint.x && mouseY === this.stageMouseDownLocalPoint.y) {
    //     //this is a click, no drag
    //     const posInTiles = WorldTilesHelper.getTilePosFromCoords(mouseX, mouseY, defaultTileWidth, defaultTileHeight,
    //       exportWorld.worldSettings.worldWidthInTiles, exportWorld.worldSettings.worldHeightInTiles)
    //     exportWorld.set_world_selectedTilePos(posInTiles)
    //   }
    //
    //   this.stageMouseDownPoint = null
    // })

    // this.renderStage.on('stagemousemove', eventObj => {
    //   const e = eventObj as MouseEvent
    //
    //   this.isDraggingStage = true
    //
    //   if (this.stageMouseDownPoint !== null) {
    //     const x = e.stageX - this.stageMouseDownPoint.x
    //     const y = e.stageY - this.stageMouseDownPoint.y
    //     exportWorld.set_world_stageOffset(Math.floor(x), Math.floor(y))
    //   }
    // })

    //draw players

    if (simulationMachineState !== null) {

      const shiftY = 10
      //TODO make shift right... only shift if we have multiple tokens on one field

      for (let i = 0; i < simulationMachineState.players.length; i++) {
        const player = simulationMachineState.players[i]

        for (let j = 0; j < player.tokens.length; j++) {
          const playerToken = player.tokens[j]

          const surrogate = exportWorld.worldTiles.find(p => p.tileGuid === playerToken.tileGuid)
          const tile = exportWorld.allTiles.find(p => p.guid === playerToken.tileGuid)

          if (!tile || !surrogate) {
            //error? also true when the player tokens are before the start field...

            graphics.drawPlayer(this.renderStage, null, playerToken.color,
              0,
              0,
              0, shiftY * i)
            continue
          }

          const field = tile.fieldShapes.find((p: FieldShape) => p.id === playerToken.fieldId)

          if (playerToken.fieldId === null || !field) {
            graphics.drawPlayer(this.renderStage, null, playerToken.color,
              surrogate.x * defaultTileWidth,
              surrogate.y * defaultTileHeight,
              0, shiftY * i)
            continue
          }

          graphics.drawPlayer(this.renderStage, field, playerToken.color,
            surrogate.x * defaultTileWidth,
            surrogate.y * defaultTileHeight,
            0, shiftY * i)
        }
      }
    }

    this.renderStage.update()
  }
}

