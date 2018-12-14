import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import * as graphics from '../../../graphics/graphicsCore'
import {
  BorderPoint,
  FieldShape,
  FieldSymbol,
  ImgShape, ImgSymbol,
  LineShape, LineSymbol,
  PlainPoint,
  Point, Rect
} from "../../types/drawing";
import MouseEvent = createjs.MouseEvent
import {ZIndexCache} from "../../types/ui";
import {
  globalMinimalZoom,
  globalZoomStep,
  selectionBgAlpha,
  selectionRectBgColor,
  selectionRectBorderColor
} from "../../constants";
import {
  isFieldShape,
  isFieldSymbol,
  isImgShape,
  isImgSymbol,
  isLineShape,
  isLineSymbol
} from "../../helpers/typeHelper";
import {MachineState} from "../../../simulation/machine/machineState";
import {calcLineBoundingBox, intersectRect} from "../../helpers/interactionHelper";
import {Logger} from "../../helpers/logger";
import _ = require("lodash");


//const css = require('./styles.styl');

export interface MyProps {

  readonly simulationMachineState: MachineState | null

  /**
   * the fields because they are not stored in the tile because of different reducers
   */
  readonly fieldShapes: ReadonlyArray<FieldShape | FieldSymbol>
  /**
   * the lines because they are not stored in the tile because of different reducers
   */
  readonly lineShapes: ReadonlyArray<LineShape | LineSymbol>
  /**
   * the images because they are not stored in the tile because of different reducers
   */
  readonly imgShapes: ReadonlyArray<ImgShape | ImgSymbol>

  readonly topBorderPoints: ReadonlyArray<BorderPoint>
  readonly botBorderPoints: ReadonlyArray<BorderPoint>
  readonly leftBorderPoints: ReadonlyArray<BorderPoint>
  readonly rightBorderPoint: ReadonlyArray<BorderPoint>

  readonly drawGrid: boolean
  readonly gridSizeInPx: number
  readonly snapToGrid: boolean

  readonly drawFieldIds: boolean

  /**
   * the canvas width with corresponds to the stage size
   */
  readonly canvasWidth: number
  /**
   * the canvas height with corresponds to the stage size
   */
  readonly canvasHeight: number

  /**
   * the actual width that is rendered by html
   */
  readonly viewMaxWidth: number
  /**
   * the actual height that is rendered by html
   */
  readonly viewMaxHeight: number

  readonly stageOffsetX: number
  readonly stageOffsetY: number

  readonly stageOffsetXScaleCorrection: number
  readonly stageOffsetYScaleCorrection: number

  readonly stageScaleX: number
  readonly stageScaleY: number

  readonly displayPrintGuidesDisplayed: boolean

  readonly printLargeTilePreferredWidthInPx: number
  readonly printLargeTilePreferredHeightInPx: number

  readonly selectionRect: Rect | null

  readonly setSelectionRect: (rect: Rect | null) => void

  /**
   * true: the next select selects
   */
  readonly isSelectingNextField: boolean
  readonly sourceForSelectingNextField: FieldShape | null

  readonly selectedFieldShapeIds: ReadonlyArray<number>
  readonly selectedImageShapeIds: ReadonlyArray<number>
  readonly selectedLineShapeIds: ReadonlyArray<number>

  readonly selectedFieldSymbolGuid: string | null
  readonly selectedImageSymbolGuid: string | null
  readonly selectedLineSymbolGuid: string | null

  //---actions
  readonly setSelectedFieldShapeIds: (fieldShapeIds: ReadonlyArray<number>) => void
  readonly setSelectedLineShapeIds: (lineShapeIds: ReadonlyArray<number>) => void
  readonly setSelectedImageShapeIds: (imgShapeIds: ReadonlyArray<number>) => void

  readonly setSelectedFieldSymbolGuid: (fieldSymbolGuid: string) => void
  readonly setSelectedLineSymbolGuid: (lineSymbolGuid: string) => void
  readonly setSelectedImageSymbolGuid: (imgSymbolGuid: string) => void


  readonly setPropertyEditor_FieldX: (fieldShape: FieldShape, oldX: number, newX: number) => void
  readonly setPropertyEditor_FieldY: (fieldShape: FieldShape, oldY: number, newY: number) => void

  readonly setPropertyEditor_ImageX: (imgShape: ImgShape, oldX: number, newX: number) => void
  readonly setPropertyEditor_ImageY: (imgShape: ImgShape, oldY: number, newY: number) => void
  readonly setLinePointNewPos: (lineId: number, oldPointId: number | null, oldPointPos: PlainPoint, newPointPos: PlainPoint, canSetFieldAnchorPoints: boolean) => void


  readonly setEditor_stageOffset: (x: number, y: number) => void
  readonly set_editor_stageOffsetScaleCorrection: (x: number, y: number) => void
  readonly setEditor_stageScale: (scaleX: number, scaleY: number) => void

  readonly setPropertyEditor_FieldCmdText: (fieldId: number, cmdText: string) => void
  readonly setTileEditorSelectingNextField: (isSelectingNextField: boolean, sourceForSelectingNextField: FieldShape | null) => void

}

const mapStateToProps = (rootState: RootState, props: MyProps) => {
  return {
    //test0: rootState...
    //test: props.test
    ...props,
    worldSettings: rootState.worldSettingsState,

    fieldSymbols: rootState.fieldSymbolState.present,
    imgSymbols: rootState.imgSymbolState.present,
    lineSymbols: rootState.lineSymbolState.present,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here


}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


// createjs.Ticker.addEventListener("tick", handleTick);
//
// function handleTick(event: any) {
//   // Actions carried out each tick (aka frame)
//   if (!event.paused) {
//     // Actions carried out when the Ticker is not paused.
//
//   }
// }

//TODO note that there can be at most one renderer with interactions because
//these vars are global! but would be used by multiple instances
//we can't move them easy inside the component because the component will be re created for every render?
let downX = 0
let downY = 0
let downXContainerOffset = 0
let downYContainerOffset = 0

let isDraggingField = false
let isSelectingMultipleShapes = false
let isDraggingLinePoint = false
let isDraggingImage = false
let isDraggingStage = false
let draggingObjectId = -1
let draggingPointId: number | null = null //if we drag no point only the line --> null

class tileRenderer extends React.Component<Props, any> {

  canvas: HTMLCanvasElement = null

  zIndexCache: ZIndexCache = {}

  renderStage: createjs.Stage = null

  /**
   * see https://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind
   */
  onWheelReference: (e: WheelEvent) => void

  componentDidMount() {
    this.renderStage = new createjs.Stage(this.canvas)
    this.zIndexCache = {}

    //must be called before updating the stage else when we switch tabs (unmount) this is not applied properly
    //also no need to re attache the listeners in every update
    this.setupListeners()
    this.updateCanvasModel()
  }

  componentDidUpdate() {
    this.updateCanvasModel()
  }

  onWheel(e: WheelEvent) {


    //on canvas down pos relative to abs canvas pos in page
    const onCanvasX = e.pageX - this.canvas.offsetLeft
    const onCanvasY = e.pageY - this.canvas.offsetTop

    //we zoom on 100,100  (canvas local)
    //after the zoom + offset we still want to be our mouse on 100,100 canvas local
    const referencePoint = this.renderStage.globalToLocal(onCanvasX, onCanvasY)

    let newScale = 0

    if (e.deltaY > 0) {
      //zoom out
      const clampVal = Math.max(this.props.stageScaleX - globalZoomStep, globalMinimalZoom)
      newScale = clampVal
      this.props.setEditor_stageScale(clampVal, clampVal)
    }
    else {
      //zoom in
      const clampVal = Math.max(this.props.stageScaleX + globalZoomStep, globalMinimalZoom)
      newScale = clampVal
      this.props.setEditor_stageScale(clampVal, clampVal)
    }

    const referencePoint2 = this.renderStage.globalToLocal(onCanvasX, onCanvasY)
    //e.g. new zoom is 2 --> point 100,100 is now at 200,200
    //the distance in the new coordinates (e.g. 2x scale) is 200-100= 100 in x & y
    //but the offset is in absolute coordinates e.g. if we translate x by 100 in 2x zoom this is only 50px in normal zoom
    //so we need to distance x,y = 100 and calculate the normal zoom distance which is 100*2 (new zoom)
    const diffX = -(referencePoint.x - referencePoint2.x) * newScale
    const diffY = -(referencePoint.y - referencePoint2.y) * newScale

    //if the seems not 100% accurate this is because zoom will also use snap to grid (actually the offsets use snap to grid)

    this.props.set_editor_stageOffsetScaleCorrection(this.props.stageOffsetXScaleCorrection + diffX, this.props.stageOffsetYScaleCorrection + diffY)

    e.preventDefault()
  }

  /**
   * clears and attaches the listeners to the stage
   */
  setupListeners() {

    this.canvas.removeEventListener('wheel', this.onWheelReference)

    //clear all old
    this.renderStage.removeAllEventListeners()
    for (const item of this.renderStage.children) {
      item.removeAllEventListeners()
    }

    this.onWheelReference = this.onWheel.bind(this) //_.throttle(this.onWheel.bind(this), 500)
    this.canvas.addEventListener("wheel", this.onWheelReference)

    this.renderStage.on('selectstart', () => {
      return false
    })


    this.renderStage.on('stagemousemove', this.onMouseMove.bind(this))

    this.renderStage.on('stagemousedown', eventObj => {
      const e = eventObj as MouseEvent

      if (e.nativeEvent.button === 0) {
        const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)
        e.preventDefault()

        //see https://createjs.com/docs/easeljs/classes/Container.html#method_getObjectsUnderPoint
        const el = this.renderStage.getObjectUnderPoint(mouseX, mouseY, 1)

        if (e.nativeEvent.altKey) { //if the whole tile is coverd by shapes we want to drag with alt + click + drag

          // if (e.nativeEvent.altKey === false) {
          //
          //
          //   if (this.props.isSelectingNextField) {
          //     this.props.setTileEditorSelectingNextField(false, null)
          //   }
          //   else {
          //     this.props.setSelectedFieldShapeIds([]) //will de-select all other shape types too
          //   }
          // }

          isDraggingStage = true
          downX = mouseX + this.props.stageOffsetX //absolute pos
          downY = mouseY + this.props.stageOffsetY //absolute pos
          downXContainerOffset = e.stageX - this.props.stageOffsetX
          downYContainerOffset = e.stageY - this.props.stageOffsetY

          return
        }

        if (!el) {
          isSelectingMultipleShapes = true
          downX = mouseX
          downY = mouseY

          return
        }
      }

      //https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
      //mouse middle button  --> reset zoom
      if (e.nativeEvent.button === 1) {

        const onCanvasX = e.nativeEvent.pageX - this.canvas.offsetLeft
        const onCanvasY = e.nativeEvent.pageY - this.canvas.offsetTop

        const referencePoint = this.renderStage.globalToLocal(onCanvasX, onCanvasY)

        //zoom to normal
        this.props.setEditor_stageScale(1, 1)
        this.props.set_editor_stageOffsetScaleCorrection(0, 0)

        const referencePoint2 = this.renderStage.globalToLocal(onCanvasX, onCanvasY)

        const newX = this.props.stageOffsetX - (referencePoint.x - referencePoint2.x)
        const newY = this.props.stageOffsetY - (referencePoint.y - referencePoint2.y)

        this.props.setEditor_stageOffset(newX, newY)

        return
      }
    })

    this.renderStage.on('stagemouseup', eventObj => {
      const e = eventObj as MouseEvent

      isDraggingLinePoint = false
      isDraggingField = false
      isDraggingImage = false
      isDraggingStage = false
      isSelectingMultipleShapes = false

      //store.dispatch(setSelectedFieldShapeId(null))

      const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)


      const el = this.renderStage.getObjectUnderPoint(mouseX, mouseY, 1)

      if (!el) {
        if (mouseX === downX && mouseY === downY) {
          //deselect
          if (this.props.isSelectingNextField) {
            this.props.setTileEditorSelectingNextField(false, null)
          }
          else {
            //deselect all
            this.props.setSelectedFieldShapeIds([])
            this.props.setSelectedLineShapeIds([])
            this.props.setSelectedImageShapeIds([])
          }
        }
      }


      if (this.props.selectionRect !== null) {
        this.props.setSelectionRect(null)
      }


    })

  }

  getSelectedShapeTypesCount(): number {
    let selectedShapeTypesCount = 0
    if (this.props.selectedFieldShapeIds.length > 0) {
      selectedShapeTypesCount++
    }
    if (this.props.selectedImageShapeIds.length > 0) {
      selectedShapeTypesCount++
    }
    if (this.props.selectedLineShapeIds.length > 0) {
      selectedShapeTypesCount++
    }
    return selectedShapeTypesCount
  }

  updateCanvasModel() {

    this.renderStage.clear()
    this.renderStage.removeAllChildren()

    createjs.Touch.enable(this.renderStage)

    //--- draw
    this.renderStage.scaleX = this.props.stageScaleX
    this.renderStage.scaleY = this.props.stageScaleY

    this.renderStage.x = this.props.stageOffsetX + this.props.stageOffsetXScaleCorrection
    this.renderStage.y = this.props.stageOffsetY + this.props.stageOffsetYScaleCorrection

    const width = (this.renderStage.canvas as HTMLCanvasElement).width
    const height = (this.renderStage.canvas as HTMLCanvasElement).height

    graphics.drawGrid(this.renderStage, width, height, this.props.gridSizeInPx,
      this.props.worldSettings.gridStrokeThicknessInPx,
      this.props.worldSettings.gridStrokeColor, !this.props.drawGrid, 0, 0)


    if (this.props.displayPrintGuidesDisplayed &&
      (width > this.props.printLargeTilePreferredWidthInPx || height > this.props.printLargeTilePreferredHeightInPx)) {

      graphics.drawPrintGuides(this.renderStage,
        width,
        height,
        this.props.printLargeTilePreferredWidthInPx,
        this.props.printLargeTilePreferredHeightInPx,
        this.props.worldSettings.gridStrokeThicknessInPx,
        this.props.worldSettings.gridStrokeColor
      )
    }

    graphics.drawTileBorderPoints(this.renderStage,
      width,
      height,
      this.props.topBorderPoints,
      this.props.botBorderPoints,
      this.props.leftBorderPoints,
      this.props.rightBorderPoint,
      this.props.worldSettings,
      0,
      0,
      this.props.drawFieldIds,
      (borderPoint, orientation1, shape, e) => {

        if (this.props.isSelectingNextField) {
          let cmdText = `control goto ${borderPoint.id}`

          if (this.props.sourceForSelectingNextField.cmdText !== null && this.props.sourceForSelectingNextField.cmdText.trim() !== '') {

            if (this.props.sourceForSelectingNextField.cmdText.endsWith('\n')) {
              cmdText = `${this.props.sourceForSelectingNextField.cmdText}${cmdText}`
            }
            else {
              cmdText = `${this.props.sourceForSelectingNextField.cmdText}\n${cmdText}`
            }
          }

          this.props.setPropertyEditor_FieldCmdText(this.props.sourceForSelectingNextField.id, cmdText)
          this.props.setTileEditorSelectingNextField(false, null)

          //let the current field selected else we don't know if we just cancelled the next field selection
          //or if we clicked the border point (we cannot select the border point)
          return
        }

      }
    )

    graphics.drawFieldsOnTile(this.renderStage, this.props.fieldShapes,
      this.props.selectedFieldShapeIds,
      [this.props.selectedFieldSymbolGuid],
      null,
      (field, container, e: MouseEvent) => {

        //alt to drag the stage
        if (e.nativeEvent.altKey) return

        const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)

        downX = mouseX
        downY = mouseY
        downXContainerOffset = downX - container.getBounds().x
        downYContainerOffset = downY - container.getBounds().y
        isDraggingLinePoint = false
        isDraggingField = true
        isDraggingImage = false
        isDraggingStage = false

        if (isFieldShape(field)) {

          if (this.props.isSelectingNextField) {
            let cmdText = `control goto ${field.id}`

            if (this.props.sourceForSelectingNextField.cmdText !== null && this.props.sourceForSelectingNextField.cmdText.trim() !== '') {

              if (this.props.sourceForSelectingNextField.cmdText.endsWith('\n')) {
                cmdText = `${this.props.sourceForSelectingNextField.cmdText}${cmdText}`
              }
              else {
                cmdText = `${this.props.sourceForSelectingNextField.cmdText}\n${cmdText}`
              }
            }

            this.props.setPropertyEditor_FieldCmdText(this.props.sourceForSelectingNextField.id, cmdText)
            this.props.setTileEditorSelectingNextField(false, null)
            //select the target field because we probably want to move to the next
            this.props.setSelectedFieldShapeIds([field.id])
            this.props.setSelectedImageShapeIds([])
            this.props.setSelectedLineShapeIds([])


            return
          }

          draggingObjectId = field.id

          if (e.nativeEvent.shiftKey) {
            //additive select
            if (this.props.selectedFieldShapeIds.indexOf(field.id) === -1) {
              this.props.setSelectedFieldShapeIds(this.props.selectedFieldShapeIds.concat(field.id))
            } else {
              //field is already selected
              //deselect
              const newSelectedFieldShapeIds = this.props.selectedFieldShapeIds.filter(p => p !== field.id)
              this.props.setSelectedFieldShapeIds(newSelectedFieldShapeIds)
            }
          }
          else {

            //normal (not additive select click)
            if (this.props.selectedFieldShapeIds.indexOf(field.id) === -1) {
              //not selected --> select only this field
              this.props.setSelectedFieldShapeIds([field.id])

              //deselect if needed
              if (this.getSelectedShapeTypesCount() > 1) {
                this.props.setSelectedImageShapeIds([])
                this.props.setSelectedLineShapeIds([])
              }

            } else {

              //we have the shape already selected (or multiple)
              //when we now do mouse down we might want to move the shape and not select...

              //when mouse up is fired and the pos not changed then we select this shape... see mouse up handler
            }
          }
        }

        if (isFieldSymbol(field)) {
          this.props.setSelectedFieldSymbolGuid(field.guid)
        }

      },
      (field, container, e) => {
        if (isFieldShape(field)) {

          if (e.nativeEvent.altKey) {
            //we not want to select anything alt is drag stage mode
            return
          }

          if (e.nativeEvent.shiftKey) {
            //additive select was already handled in mouse down
            return
          }

          const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)

          //already selected but we are not in multi select mode (no shift) but we have multiple selected
          // so we want to select only this shape
          if (this.props.selectedFieldShapeIds.length > 1 && this.props.selectedFieldShapeIds.indexOf(
            field.id) !== -1) {

            //when we stop moving the shapes the mouse is on the shape and moved up... so
            //to distinct stop moving & click we need to check if the mouse up is on the same position
            if (downX === mouseX && downY === mouseY) {
              this.props.setSelectedFieldShapeIds([field.id])
            }
          }
        }

      },
      this.zIndexCache,
      this.props.drawFieldIds,
      isDraggingLinePoint,
      this.props.worldSettings,
      this.props.fieldSymbols,
      0,
      0,
      true
    )

    graphics.drawLinesOnTile(this.renderStage, this.props.lineShapes,
      this.props.selectedLineShapeIds,
      [this.props.selectedLineSymbolGuid],
      (lineShape, pointIdHit, isCp1Hit, isCp2Hit, shape, e) => {

        //alt to drag the stage
        if (e.nativeEvent.altKey) return

        if (isLineShape(lineShape)) { // && this.props.selectedLineShapeIds.indexOf(line.id) !== -1 //??
          const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)
          downX = mouseX
          downY = mouseY

          if (pointIdHit === null) {
            downXContainerOffset = downX - lineShape.startPoint.x
            downYContainerOffset = downY - lineShape.startPoint.y
          } else {
            downXContainerOffset = downX - (shape.getBounds().x + shape.getBounds().width / 2)
            downYContainerOffset = downY - (shape.getBounds().y + shape.getBounds().height / 2)
          }

          isDraggingLinePoint = true
          isDraggingField = false
          isDraggingImage = false
          isDraggingStage = false
          draggingObjectId = lineShape.id
          draggingPointId = pointIdHit

          if (e.nativeEvent.shiftKey) {
            //additive select

            if (this.props.selectedLineShapeIds.indexOf(lineShape.id) === -1) {
              this.props.setSelectedLineShapeIds(this.props.selectedLineShapeIds.concat(lineShape.id))
            } else {
              //img is already selected
              //deselect

              const newSelectedLineShapeIds = this.props.selectedLineShapeIds.filter(p => p !== lineShape.id)
              this.props.setSelectedLineShapeIds(newSelectedLineShapeIds)
            }
          }
          else {

            //normal (not additive select click)
            if (this.props.selectedLineShapeIds.indexOf(lineShape.id) === -1) {
              //not selected --> select only this field
              this.props.setSelectedLineShapeIds([lineShape.id])

              //deselect if needed
              if (this.getSelectedShapeTypesCount() > 1) {
                this.props.setSelectedImageShapeIds([])
                this.props.setSelectedFieldShapeIds([])
              }

            } else {
              //we have the shape already selected (or multiple)
              //when we now do mouse down we might want to move the shape and not select...

              //when mouse up is fired and the pos not changed then we select this shape... see mouse up handler
            }
          }

        }

        if (isLineSymbol(lineShape)) {
          this.props.setSelectedLineSymbolGuid(lineShape.guid)
        }

      },
      (line, shape, e) => {
        if (isLineShape(line)) {

          if (e.nativeEvent.altKey) {
            //we not want to select anything alt is drag stage mode
            return
          }

          if (e.nativeEvent.shiftKey) {
            //additive select was already handled in mouse down
            return
          }

          const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)

          //already selected but we are not in multi select mode (no shift) but we have multiple selected
          // so we want to select only this shape
          if (this.props.selectedLineShapeIds.length > 1 && this.props.selectedLineShapeIds.indexOf(line.id) !== -1) {

            //when we stop moving the shapes the mouse is on the shape and moved up... so
            //to distinct stop moving & click we need to check if the mouse up is on the same position
            if (downX === mouseX && downY === mouseY) {
              this.props.setSelectedLineShapeIds([line.id])
            }
          }

        }
      },
      this.zIndexCache,
      this.props.worldSettings,
      this.props.lineSymbols,
      0,
      0,
      true
    )

    graphics.drawImagesOnTile(this.renderStage, this.props.imgShapes,
      this.props.selectedImageShapeIds,
      [this.props.selectedImageSymbolGuid],
      null,
      (imgShape, shape, e) => {

        //alt to drag the stage
        if (e.nativeEvent.altKey) return

        const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)
        downX = mouseX
        downY = mouseY

        downXContainerOffset = downX - imgShape.x
        downYContainerOffset = downY - imgShape.y
        isDraggingLinePoint = false
        isDraggingField = false
        isDraggingImage = true
        isDraggingStage = false

        if (isImgShape(imgShape)) {
          draggingObjectId = imgShape.id

          if (e.nativeEvent.shiftKey) {
            //additive select

            if (this.props.selectedImageShapeIds.indexOf(imgShape.id) === -1) {
              this.props.setSelectedImageShapeIds(this.props.selectedImageShapeIds.concat(imgShape.id))
            } else {
              //img is already selected
              //deselect
              const newSelectedImageShapeIds = this.props.selectedImageShapeIds.filter(p => p !== imgShape.id)
              this.props.setSelectedImageShapeIds(newSelectedImageShapeIds)

            }
          }
          else {

            //normal (not additive select click)
            if (this.props.selectedImageShapeIds.indexOf(imgShape.id) === -1) {
              //not selected --> select only this field
              this.props.setSelectedImageShapeIds([imgShape.id])

              //deselect if needed
              if (this.getSelectedShapeTypesCount() > 1) {
                this.props.setSelectedFieldShapeIds([])
                this.props.setSelectedLineShapeIds([])
              }

            } else {
              //we have the shape already selected (or multiple)
              //when we now do mouse down we might want to move the shape and not select...

              //when mouse up is fired and the pos not changed then we select this shape... see mouse up handler
            }
          }
        }

        if (isImgSymbol(imgShape)) {
          this.props.setSelectedImageSymbolGuid(imgShape.guid)
        }

      },
      (imgShape, container, e) => {
        if (isImgShape(imgShape)) {


          if (e.nativeEvent.altKey) {
            //we not want to select anything alt is drag stage mode
            return
          }

          if (e.nativeEvent.shiftKey) {
            //additive select was already handled in mouse down
            return
          }

          const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)

          //already selected but we are not in multi select mode (no shift) but we have multiple selected
          // so we want to select only this shape
          if (this.props.selectedImageShapeIds.length > 1 && this.props.selectedImageShapeIds.indexOf(
            imgShape.id) !== -1) {

            //when we stop moving the shapes the mouse is on the shape and moved up... so
            //to distinct stop moving & click we need to check if the mouse up is on the same position
            if (downX === mouseX && downY === mouseY) {
              this.props.setSelectedImageShapeIds([imgShape.id])
            }
          }

        }

      },
      this.zIndexCache,
      this.props.worldSettings,
      this.props.imgSymbols,
      0,
      0,
      true
    )

    this.renderStage.enableMouseOver(1)


    //set zindex
    for (const zIndex in this.zIndexCache) {
      const list = this.zIndexCache[zIndex]

      for (const child of list) {
        this.renderStage.setChildIndex(child, parseInt(zIndex))
      }
    }

    //draw players

    if (this.props.simulationMachineState !== null) {

      const shiftY = 10
      //TODO make shift right... only shift if we have multiple tokens on one field

      for (let i = 0; i < this.props.simulationMachineState.players.length; i++) {
        const player = this.props.simulationMachineState.players[i]

        for (let j = 0; j < player.tokens.length; j++) {
          const playerToken = player.tokens[j]

          const field = this.props.fieldShapes.find((p: FieldShape) => p.id === playerToken.fieldId)

          if (playerToken.fieldId === null || !field) {
            graphics.drawPlayer(this.renderStage, null, playerToken.color, 0, 0, 0, shiftY * i)
            continue
          }

          graphics.drawPlayer(this.renderStage, field, playerToken.color, 0, 0, 0, shiftY * i)
        }
      }
    }


    //draw selection
    if (this.props.selectionRect !== null) {

      let selectionRect = new createjs.Shape()

      selectionRect.graphics
        .beginStroke(selectionRectBorderColor)
        .drawRect(
          this.props.selectionRect.x,
          this.props.selectionRect.y,
          this.props.selectionRect.width,
          this.props.selectionRect.height
        )
        .endStroke()
        .beginFill(selectionRectBgColor)
        .drawRect(
          this.props.selectionRect.x + 1,
          this.props.selectionRect.y + 1,
          this.props.selectionRect.width - 1,
          this.props.selectionRect.height - 1
        )
        .endFill()

      selectionRect.alpha = selectionBgAlpha

      this.renderStage.addChild(selectionRect)
    }

    this.renderStage.update()
  }


  render(): JSX.Element {

    return (
      <div className="render-area">
        {
          //show drag handles
        }
        {/*<DragHandlesContainer canvasLeft={this.canvas !== null ? this.canvas.offsetLeft : 0}*/}
        {/*canvasTop={this.canvas !== null ? this.canvas.offsetTop : 0}/>*/}

        <canvas
          className={['tile-canvas', this.props.isSelectingNextField ? 'is-selecting-next-field-cursor' : ''].join(' ')}
          ref={p => this.canvas = p} width={this.props.canvasWidth}
          height={this.props.canvasHeight}
          style={{maxHeight: this.props.viewMaxHeight, maxWidth: this.props.viewMaxWidth}}
        ></canvas>


      </div>
    )
  }

  onMouseMove(this: tileRenderer, eventObj: MouseEvent): void {


    const e = eventObj as MouseEvent
    //transform in case we translate/scaled
    const {x: mouseX, y: mouseY} = this.renderStage.globalToLocal(e.stageX, e.stageY)

    if (isDraggingField || isDraggingImage || isDraggingLinePoint) {


      const x = this.props.snapToGrid
        ? Math.floor((mouseX - downXContainerOffset) / this.props.gridSizeInPx) * this.props.gridSizeInPx
        : mouseX - downXContainerOffset

      const y = this.props.snapToGrid
        ? Math.floor((mouseY - downYContainerOffset) / this.props.gridSizeInPx) * this.props.gridSizeInPx
        : mouseY - downYContainerOffset


      if (isDraggingLinePoint && draggingPointId !== null) {

        //move only the selected/clicked point
        //0,0 is only a dummy because currently not used and would be a performance hit to search through all
        //line point + anchor points + too lazy
        this.props.setLinePointNewPos(draggingObjectId, draggingPointId, {x: 0, y: 0}, {x: x, y: y}, true)

      }
      else {


        //same as this.props.setPropertyEditor_FieldX()
        let draggedShape: FieldShape | ImgShape | LineShape = (this.props.fieldShapes as ReadonlyArray<FieldShape>).find(
          p => p.id === draggingObjectId)

        let deltaX = 0
        let deltaY = 0

        if (draggedShape !== undefined) {
          deltaX = x - draggedShape.x
          deltaY = y - draggedShape.y
        }
        else {

          draggedShape = (this.props.imgShapes as ReadonlyArray<ImgShape>).find(
            p => p.id === draggingObjectId)

          if (draggedShape !== undefined) {
            deltaX = x - draggedShape.x
            deltaY = y - draggedShape.y
          }
          else {

            draggedShape = (this.props.lineShapes as ReadonlyArray<LineShape>).find(
              p => p.id === draggingObjectId)

            if (draggedShape !== null) {
              //move all points of all selected lines
              const draggedLine = (this.props.lineShapes as ReadonlyArray<LineShape>).find(
                p => p.id === draggingObjectId)

              if (draggedLine) {
                deltaX = x - draggedLine.startPoint.x
                deltaY = y - draggedLine.startPoint.y
              }

            }
          }
        }


        for (const id of this.props.selectedFieldShapeIds) {
          const field = (this.props.fieldShapes as ReadonlyArray<FieldShape>).find(p => p.id === id)
          this.props.setPropertyEditor_FieldX(field, field.x, field.x + deltaX)
          this.props.setPropertyEditor_FieldY(field, field.y, field.y + deltaY)
        }

        for (const id of this.props.selectedImageShapeIds) {
          const imgShape = (this.props.imgShapes as ReadonlyArray<ImgShape>).find(p => p.id === id)
          this.props.setPropertyEditor_ImageX(imgShape, imgShape.x, imgShape.x + deltaX)
          this.props.setPropertyEditor_ImageY(imgShape, imgShape.y, imgShape.y + deltaY)
        }

        //move all points of all selected lines

        for (const id of this.props.selectedLineShapeIds) {
          const lineShape = (this.props.lineShapes as ReadonlyArray<LineShape>).find(p => p.id === id)

          this.props.setLinePointNewPos(lineShape.id, lineShape.startPoint.id,
            lineShape.startPoint,
            {
              x: lineShape.startPoint.x + deltaX,
              y: lineShape.startPoint.y + deltaY
            }, true)

          for (const linePoint of lineShape.points) {
            this.props.setLinePointNewPos(lineShape.id, linePoint.id,
              linePoint,
              {
                x: linePoint.x + deltaX,
                y: linePoint.y + deltaY
              }, true)
          }
        }
      }

      return
    }

    if (isDraggingStage) {

      //downXContainerOffset is relative to the stage (the click point)
      //e.g. 0,0 can be at 100,100 when the offset x,y is 100

      //mouseX is relative to the offset so we need to add the offset
      const x = e.stageX - downXContainerOffset //mouseX + this.props.stageOffsetX - downXContainerOffset
      const y = e.stageY - downYContainerOffset //mouseY + this.props.stageOffsetY - downYContainerOffset
      this.props.setEditor_stageOffset(Math.floor(x), Math.floor(y))
      return
    }

    if (isSelectingMultipleShapes) {

      const rect: Rect = {
        x: downX,
        y: downY,
        width: mouseX - downX,
        height: mouseY - downY
      }
      this.props.setSelectionRect(rect)

      //select all intersecting shapes... use bounding boxes
      this.selectAllIntersectingShapes(rect, e.nativeEvent.shiftKey)

    }
  }

  selectAllIntersectingShapes(rect: Rect, additiveSelect: boolean): void {

    //respect symbols!!
    let fieldsToSelect = []

    for (const fieldShape of this.props.fieldShapes) {

      if (fieldShape.createdFromSymbolGuid === null) {
        if (intersectRect(rect, fieldShape)) {
          fieldsToSelect.push((fieldShape as FieldShape).id)
        }
      }
      else {
        const fieldSymbol = this.props.fieldSymbols.find(p => p.guid === fieldShape.createdFromSymbolGuid)

        if (!fieldSymbol) {
          Logger.fatal(`could not find field symbol for field with id: ${(fieldShape as FieldShape).id}`)
          throw new Error()
        }

        if (intersectRect(rect, {
          x: fieldShape.x,
          y: fieldShape.y,
          width: fieldSymbol.width,
          height: fieldSymbol.height
        })) {
          fieldsToSelect.push((fieldShape as FieldShape).id)
        }
      }
    }

    let imgsToSelect = []

    for (const imgShape of this.props.imgShapes) {

      if (imgShape.createdFromSymbolGuid === null) {
        if (intersectRect(rect, imgShape)) {
          imgsToSelect.push((imgShape as ImgShape).id)
        }
      }
      else {
        const imgSymbol = this.props.imgSymbols.find(p => p.guid === imgShape.createdFromSymbolGuid)

        if (!imgSymbol) {
          Logger.fatal(`could not find img symbol for img with id: ${(imgShape as ImgShape).id}`)
          throw new Error()
        }

        if (intersectRect(rect, {
          x: imgShape.x,
          y: imgShape.y,
          width: imgSymbol.width,
          height: imgSymbol.height
        })) {
          imgsToSelect.push((imgShape as ImgShape).id)
        }
      }
    }


    let linesToSelect = []

    for (const linesShape of this.props.lineShapes) {

      if (linesShape.createdFromSymbolGuid === null) {
        if (intersectRect(rect, calcLineBoundingBox(linesShape as LineShape))) {
          linesToSelect.push((linesShape as LineShape).id)
        }
      }
    }


    if (additiveSelect) {

      //here it's ok that we cannot deselect because we want to additively select... also better for performance
      if (fieldsToSelect.length > 0)
        this.props.setSelectedFieldShapeIds(_.unionWith(this.props.selectedFieldShapeIds, fieldsToSelect, (a, b) => a === b))


      if (imgsToSelect.length > 0)
        this.props.setSelectedImageShapeIds(_.unionWith(this.props.selectedImageShapeIds, imgsToSelect, (a, b) => a === b))


      if (linesToSelect.length > 0)
        this.props.setSelectedLineShapeIds(_.unionWith(this.props.selectedLineShapeIds, linesToSelect, (a, b) => a === b))

    }
    else {

      //this can also deselect

      //better for performance but we want to deselect fields when we move the selection area away from the field
      // if (fieldsToSelect.length > 0) {
      this.props.setSelectedFieldShapeIds(fieldsToSelect)
      // }
      // if (imgsToSelect.length > 0) {
      this.props.setSelectedImageShapeIds(imgsToSelect)
      // }
      // if (linesToSelect.length > 0) {
      this.props.setSelectedLineShapeIds(linesToSelect)
      // }
    }

  }


}


export default connect(mapStateToProps, mapDispatchToProps)(tileRenderer)

