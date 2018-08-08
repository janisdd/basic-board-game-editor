import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import * as graphics from '../../../graphics/graphicsCore'
import {ZIndexCache} from "../../types/ui";
import MouseEvent = createjs.MouseEvent
import {FieldShape, PlainPoint} from "../../types/drawing";
import {
  set_world_stageOffset,
  set_world_stageOffsetScaleCorrection,
  set_world_stageScale
} from "../../state/reducers/world/worldSettings/actions";
import {globalMinimalZoom, globalZoomStep, worldSelectedTileBorderColor, worldTileBorderColor} from "../../constants";
import {set_world_selectedTilePos} from "../../state/reducers/world/actions";
import {WorldTilesHelper} from "../../helpers/worldTilesHelper";


//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string

}

const mapStateToProps = (rootState: RootState, /*props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    worldTiles: rootState.tileSurrogateState.present,
    selectedTilePos: rootState.worldState.selectedTilePos,
    worldSettings: rootState.worldSettingsState,

    fieldSymbols: rootState.fieldSymbolState.present,
    imgSymbols: rootState.imgSymbolState.present,
    lineSymbols: rootState.lineSymbolState.present,
    allTiles: rootState.tileLibraryState.possibleTiles,

    simulationMachineState: rootState.simulationState.machineState

  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_world_stageOffset,
  set_world_stageScale,
  set_world_selectedTilePos,
  set_world_stageOffsetScaleCorrection,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


const canvasContainerId = 'canvasContainerId'

class worldRenderer extends React.Component<Props, any> {

  canvas: HTMLCanvasElement = null

  canvasContainer: HTMLDivElement = null

  renderStage: createjs.Stage = null

  /**
   * see https://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind
   */
  onWheelReference: (e: WheelEvent) => void

  zIndexCache: ZIndexCache = {}

  /**
   * the absolute canvas down point
   * @type {null}
   */
  stageMouseDownPoint: PlainPoint | null = null

  /**
   * the relative canvas down point
   * @type {null}
   */
  stageMouseDownLocalPoint: PlainPoint | null = null

  isDraggingStage: boolean = false

  resizeHandler: EventListener

  componentDidMount() {
    this.renderStage = new createjs.Stage(this.canvas)
    this.zIndexCache = {}
    this.updateCanvasModel()


    let self = this
    window.addEventListener('resize', this.resizeHandler = debounce(() => {
      self.resizeRenderer()
    }, 200, false))
    self.resizeRenderer()
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  componentDidUpdate() {
    this.updateCanvasModel()
  }

  onWheel(e: WheelEvent) {

    const onCanvasX = e.pageX - this.canvas.offsetLeft
    const onCanvasY = e.pageY - this.canvas.offsetTop

    const referencePoint = this.renderStage.globalToLocal(onCanvasX, onCanvasY)

    let newScale = 0

    if (e.deltaY > 0) {
      //zoom out
      // this.props.stageOffsetX
      // this.props.setEditor_stageOffset()
      const clampVal = Math.max(this.props.worldSettings.stageScaleX - globalZoomStep, globalMinimalZoom)
      newScale = clampVal
      this.props.set_world_stageScale(clampVal, clampVal)
    }
    else {
      //zoom in
      const clampVal = Math.max(this.props.worldSettings.stageScaleX + globalZoomStep, globalMinimalZoom)
      newScale = clampVal
      this.props.set_world_stageScale(clampVal, clampVal)
    }

    const referencePoint2 = this.renderStage.globalToLocal(onCanvasX, onCanvasY)
    //works but why *newScale?? maybe because the diff is still the old scale?
    const diffX = -(referencePoint.x - referencePoint2.x) * newScale
    const diffY = -(referencePoint.y - referencePoint2.y) * newScale


    this.props.set_world_stageOffsetScaleCorrection(this.props.worldSettings.stageOffsetXScaleCorrection + diffX, this.props.worldSettings.stageOffsetYScaleCorrection + diffY)

    e.preventDefault()

  }

  updateCanvasModel() {

    this.canvas.removeEventListener('wheel', this.onWheelReference)

    //clear all old
    this.renderStage.removeAllEventListeners()
    for (const item of this.renderStage.children) {
      item.removeAllEventListeners()
    }
    this.renderStage.clear()
    this.renderStage.removeAllChildren()

    // console.log(this.renderStage)

    this.onWheelReference = this.onWheel.bind(this) //_.throttle(this.onWheel.bind(this), 500)
    this.canvas.addEventListener("wheel", this.onWheelReference)

    this.renderStage.on('selectstart', () => {
      return false
    })
    createjs.Touch.enable(this.renderStage)


    //--- draw
    this.renderStage.scaleX = this.props.worldSettings.stageScaleX
    this.renderStage.scaleY = this.props.worldSettings.stageScaleY

    this.renderStage.x = this.props.worldSettings.stageOffsetX + this.props.worldSettings.stageOffsetXScaleCorrection
    this.renderStage.y = this.props.worldSettings.stageOffsetY + this.props.worldSettings.stageOffsetYScaleCorrection


    const defaultTileWidth = this.props.worldSettings.expectedTileWidth
    const defaultTileHeight = this.props.worldSettings.expectedTileHeight

    for (let j = 0; j < this.props.worldSettings.worldHeightInTiles; j++) {
      for (let i = 0; i < this.props.worldSettings.worldWidthInTiles; i++) {

        const tileSurrogate = WorldTilesHelper.getTileFromPos(i, j, this.props.worldTiles)

        if (this.props.selectedTilePos != null &&
          i === this.props.selectedTilePos.x &&
          j === this.props.selectedTilePos.y) {

          graphics.drawGrid(
            this.renderStage,
            defaultTileWidth,
            defaultTileHeight,
            0,
            1,
            worldSelectedTileBorderColor,
            true,
            i * defaultTileWidth,
            j * defaultTileHeight
          )
        } else {

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
        }


        //maybe error?
        if (!tileSurrogate) continue

        const tile = this.props.allTiles.find(p => p.guid === tileSurrogate.tileGuid)

        if (!tile) continue

        graphics.drawTileBorderPoints(
          this.renderStage,
          defaultTileWidth,
          defaultTileHeight,
          tile.topBorderPoints,
          tile.botBorderPoints,
          tile.leftBorderPoints,
          tile.rightBorderPoint,
          this.props.worldSettings,
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
          this.props.worldSettings,
          this.props.fieldSymbols,
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
          this.props.worldSettings,
          this.props.imgSymbols,
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
          this.props.worldSettings,
          this.props.lineSymbols,
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

    this.renderStage.on('stagemousedown', eventObj => {
      const e = eventObj as MouseEvent


      if (e.nativeEvent.button === 0) {
        //transform in case we translate/scaled
        this.stageMouseDownPoint = {
          x: e.stageX - this.props.worldSettings.stageOffsetX,
          y: e.stageY - this.props.worldSettings.stageOffsetY
        }


        this.stageMouseDownLocalPoint = this.renderStage.globalToLocal(e.stageX, e.stageY)
      }


      //https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
      //mouse middle button --> reset zoom
      if (e.nativeEvent.button === 1) {

        const onCanvasX = e.nativeEvent.pageX - this.canvas.offsetLeft
        const onCanvasY = e.nativeEvent.pageY - this.canvas.offsetTop

        const referencePoint = this.renderStage.globalToLocal(onCanvasX, onCanvasY)

        //zoom to normal
        this.props.set_world_stageScale(1, 1)
        this.props.set_world_stageOffsetScaleCorrection(0, 0)

        const referencePoint2 = this.renderStage.globalToLocal(onCanvasX, onCanvasY)

        const newX = this.props.worldSettings.stageOffsetX - (referencePoint.x - referencePoint2.x)
        const newY = this.props.worldSettings.stageOffsetY - (referencePoint.y - referencePoint2.y)

        this.props.set_world_stageOffset(newX, newY)
      }

      this.isDraggingStage = false

    })

    this.renderStage.on('stagemouseup', eventObj => {
      const e = eventObj as MouseEvent
      //transform in case we translate/scaled
      const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)

      if (this.isDraggingStage === false && mouseX === this.stageMouseDownLocalPoint.x && mouseY === this.stageMouseDownLocalPoint.y) {
        //this is a click, no drag
        const posInTiles = WorldTilesHelper.getTilePosFromCoords(mouseX, mouseY, defaultTileWidth, defaultTileHeight,
          this.props.worldSettings.worldWidthInTiles, this.props.worldSettings.worldHeightInTiles)
        this.props.set_world_selectedTilePos(posInTiles)
      }

      this.stageMouseDownPoint = null
    })

    this.renderStage.on('stagemousemove', eventObj => {
      const e = eventObj as MouseEvent

      this.isDraggingStage = true

      if (this.stageMouseDownPoint !== null) {
        const x = e.stageX - this.stageMouseDownPoint.x
        const y = e.stageY - this.stageMouseDownPoint.y
        this.props.set_world_stageOffset(Math.floor(x), Math.floor(y))
      }


    })

    //draw players

    if (this.props.simulationMachineState !== null) {

      const shiftY = 10
      //TODO make shift right... only shift if we have multiple tokens on one field

      for (let i = 0; i < this.props.simulationMachineState.players.length; i++) {
        const player = this.props.simulationMachineState.players[i]

        for (let j = 0; j < player.tokens.length; j++) {
          const playerToken = player.tokens[j]

          const surrogate = this.props.worldTiles.find(p => p.tileGuid === playerToken.tileGuid)
          const tile = this.props.allTiles.find(p => p.guid === playerToken.tileGuid)

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

  resizeRenderer() {


    if (!this.canvas || !this.canvasContainer) return


    this.canvas.height = this.canvasContainer.offsetHeight
    this.canvas.width = this.canvasContainer.offsetWidth

    //force redraw
    this.updateCanvasModel()

  }

  render(): JSX.Element {
    return (
      <div id={canvasContainerId} className="fh fw" ref={p => this.canvasContainer = p}>

        <canvas id="world-renderer-canvas" className="tile-canvas" ref={p => this.canvas = p}
                width={1200}
                height={700}
        ></canvas>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(worldRenderer)

const debounce = (func: any, wait: any, immediate: any) => {
  var timeout: any;
  return () => {
    const context = this
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context);
  };
};