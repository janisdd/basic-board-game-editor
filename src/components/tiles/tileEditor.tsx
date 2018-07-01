import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import TileRenderer from './tileRenderer'
import {Button, Icon, Popup, Tab, Table} from 'semantic-ui-react'
import TileEditorSettings from './editorSettings/tileEditorSettingsModal'
import {
  removeFieldShape, setPropertyEditor_FieldCmdText, setPropertyEditor_fieldsShapes,
  setPropertyEditor_FieldX,
  setPropertyEditor_FieldY
} from "../../state/reducers/tileEditor/fieldProperties/actions";
import {
  removeImageShape,
  setPropertyEditor_ImageX,
  setPropertyEditor_ImageY, setPropertyEditor_imgShapes
} from "../../state/reducers/tileEditor/imgProperties/actions";
import {
  removeLineShape,
  set_selectedLinePointNewPosAction, setPropertyEditor_lineShapes,

} from "../../state/reducers/tileEditor/lineProperties/actions";

import {
  set_editor_isSelectingNextField,
  set_editor_isTileEditorSettingsModalDisplayed,
  set_editor_restoreRightTabActiveIndex,
  set_editor_rightTabActiveIndex,
  set_editor_stageOffsetScaleCorrection,
  setEditor_stageOffset,
  setEditor_stageScale,
  setSelectedFieldShapeIds,
  setSelectedImageShapeIds,
  setSelectedLineShapeIds
} from "../../state/reducers/tileEditor/actions";

import {
  set_selectedFieldSymbolGuid,
  set_selectedImgSymbolGuid,
  set_selectedLineSymbolGuid
} from "../../state/reducers/tileEditor/symbols/actions";
import {Tile} from "../../types/world";
import {getGuid} from "../../helpers/guid";
import {set_world_isTileEditorDisplayed} from "../../state/reducers/world/actions";
import {set_app_activeTabIndex} from "../../state/reducers/actions";
import {set_tileLibrary_possibleTiles} from "../../state/reducers/world/tileLibrary/actions";
import TileEditorSettingsArea from './editorSettings/tileEditorSettingsArea'

import LeftEditorTabMenu from './leftEditorTabMenu'
import RightEditorTabMenu from './rightEditorTabMenu'
import TileActionsBar from './tileActionsBar'
import * as mousetrap from "mousetrap";
import {FieldShape, ImgShape, LineShape} from "../../types/drawing";
import {DuplicateHelper} from "../../helpers/duplicateHelper";
import TileRightActionBar from './tileRightActionBar'
import {getI18n, getRawI18n} from "../../../i18n/i18nRoot";
import TooTip from '../helpers/TooTip'
import {RightTileEditorTabs} from "../../state/reducers/tileEditor/tileEditorReducer";
import {horizontalIconPopupOffsetInPx} from "../helpers/IconTooTip";
import {redo_shapeEditor, undo_shapeEditor} from "../../state/reducers/tileEditor/shapesReducer/actions";
import {CSSProperties} from "react";
import {PrintHelper} from "../../helpers/printHelper";
import {AvailableAppTabs} from "../../state/reducers/appReducer";


export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    fieldShapes: rootState.tileEditorFieldShapesState.present,
    imgShapes: rootState.tileEditorImgShapesState.present,
    lineShapes: rootState.tileEditorLineShapeState.present,

    fieldSymbols: rootState.fieldSymbolState.present,
    imgSymbols: rootState.imgSymbolState.present,
    lineSymbols: rootState.lineSymbolState.present,

    worldSettings: rootState.worldSettingsState,

    selectedFieldShapeIds: rootState.tileEditorState.selectedFieldShapeIds,
    selectedLineShapeIds: rootState.tileEditorState.selectedLineShapeIds,
    selectedImageShapeIds: rootState.tileEditorState.selectedImageShapeIds,

    selectedLineSymbolGuid: rootState.symbolsState.selectedLineSymbolGuid,
    selectedImgSymbolGuid: rootState.symbolsState.selectedImgSymbolGuid,
    selectedFieldSymbolGuid: rootState.symbolsState.selectedFieldSymbolGuid,

    settings: rootState.tileEditorState,

    stageOffsetX: rootState.tileEditorState.stageOffsetX,
    stageOffsetY: rootState.tileEditorState.stageOffsetY,
    stageScaleX: rootState.tileEditorState.stageScaleX,
    stageScaleY: rootState.tileEditorState.stageScaleY,
    stageOffsetXScaleCorrection: rootState.tileEditorState.stageOffsetXScaleCorrection,
    stageOffsetYScaleCorrection: rootState.tileEditorState.stageOffsetYScaleCorrection,

    tileProps: rootState.tileEditorState.tileProps,

    allTiles: rootState.tileLibraryState.possibleTiles,
    isCreatingNewTile: rootState.tileEditorState.isCreatingNewTile,
    editingTileGuide: rootState.tileEditorState.tileGuid,

    amountOfShapesInTile: rootState.tileEditorLineShapeState.present.length + rootState.tileEditorImgShapesState.present.length + rootState.tileEditorFieldShapesState.present.length,

    machineState: rootState.simulationState.machineState,

    isSelectingNextField: rootState.tileEditorState.isSelectingNextField,
    sourceForSelectingNextField: rootState.tileEditorState.sourceForSelectingNextField,

    simulationState: rootState.simulationState,

    shapeReducerState: rootState.shapesReducerState,

    langId: rootState.i18nState.langId

  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_editor_rightTabActiveIndex,
  set_editor_restoreRightTabActiveIndex,

  //--field props editor
  setSelectedFieldShapeIds,
  setPropertyEditor_FieldX,
  setPropertyEditor_FieldY,
  setPropertyEditor_FieldCmdText,
  removeFieldShape,
  setPropertyEditor_fieldsShapes,
  set_editor_isSelectingNextField,


  //--line props editor
  setSelectedLineShapeIds,
  removeLineShape,
  setPropertyEditor_lineShapes,

  setLinePointNewPos: set_selectedLinePointNewPosAction,

  //--img props editor
  setSelectedImageShapeIds,
  setPropertyEditor_ImageX,
  setPropertyEditor_ImageY,
  removeImageShape,
  setPropertyEditor_imgShapes,

  //--
  set_selectedFieldSymbolGuid,
  set_selectedImgSymbolGuid,
  set_selectedLineSymbolGuid,

  setEditor_stageOffset,
  set_editor_stageOffsetScaleCorrection,
  setEditor_stageScale,

  set_world_isTileEditorDisplayed,
  set_app_activeTabIndex,
  set_tileLibrary_possibleTiles,

  set_editor_isTileEditorSettingsModalDisplayed,

  undo_shapeEditor,
  redo_shapeEditor

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

const nop = () => {

}


const shortcutPopupStyle: CSSProperties = {
  maxWidth: '800px'
}

class tileEditor extends React.Component<Props, any> {


  componentDidMount() {
    mousetrap.bind(['backspace', 'del'], this.removeSelectedShapes.bind(this))
    mousetrap.bind(['ctrl+d', 'meta+d'], this.duplicateSelectedShapes.bind(this))
    mousetrap.bind(['ctrl+shift+d', 'meta+shift+d'], this.duplicateSelectedShapes.bind(this))
    mousetrap.bind(['ctrl+n', 'meta+n'], this.setIsSelectingNextField.bind(this))
    mousetrap.bind(['esc'], this.onEscPressed.bind(this))

    mousetrap.bind(['ctrl+z', 'meta+z'], this.onUndoPressed.bind(this))
    mousetrap.bind(['ctrl+y', 'meta+shift+z'], this.onRedoPressed.bind(this))
  }

  componentWillUnmount() {
    mousetrap.unbind(['backspace', 'del'])
    mousetrap.unbind(['ctrl+d', 'meta+d'])
    mousetrap.unbind(['ctrl+shift+d', 'meta+shift+d'])
    mousetrap.unbind(['ctrl+n', 'meta+n'])
    mousetrap.unbind(['esc'])
    mousetrap.unbind(['ctrl+z', 'meta+z'])
    mousetrap.unbind(['ctrl+y', 'meta+shift+z'])
  }

  removeSelectedShapes(e: KeyboardEvent) {

    if (this.props.selectedFieldShapeIds.length > 0) {
      for (const id of this.props.selectedFieldShapeIds) {
        this.props.removeFieldShape(id)
      }
    }

    if (this.props.selectedImageShapeIds.length > 0) {
      for (const id of this.props.selectedImageShapeIds) {
        this.props.removeImageShape(id)
      }
    }

    if (this.props.selectedLineShapeIds.length > 0) {
      for (const id of this.props.selectedLineShapeIds) {
        this.props.removeLineShape(id)
      }
    }
  }

  duplicateSelectedShapes(e: KeyboardEvent) {

    e.preventDefault()

    if (this.props.selectedFieldShapeIds.length > 0) {

      let selectedFieldShapes: FieldShape[] = []
      for (const id of this.props.selectedFieldShapeIds) {
        let fieldShape = this.props.fieldShapes.find(p => p.id === id)
        selectedFieldShapes.push(fieldShape)
      }

      const copies = DuplicateHelper.duplicateFieldShapes(selectedFieldShapes, this.props.amountOfShapesInTile,
        this.props.settings.autoIncrementFieldTextNumbersOnDuplicate, e.shiftKey)
      this.props.setPropertyEditor_fieldsShapes(this.props.fieldShapes.concat(copies))
      this.props.setSelectedFieldShapeIds(copies.map(p => p.id))
    }

    if (this.props.selectedImageShapeIds.length > 0) {

      let selectedImgShapes: ImgShape[] = []
      for (const id of this.props.selectedImageShapeIds) {
        let imgShape = this.props.imgShapes.find(p => p.id === id)
        selectedImgShapes.push(imgShape)
      }
      const copies = DuplicateHelper.duplicateImgShapes(selectedImgShapes, this.props.amountOfShapesInTile)
      this.props.setPropertyEditor_imgShapes(this.props.imgShapes.concat(copies))
      this.props.setSelectedImageShapeIds(copies.map(p => p.id))
    }

    if (this.props.selectedLineShapeIds.length > 0) {
      let selectedLineShapes: LineShape[] = []
      for (const id of this.props.selectedLineShapeIds) {
        let LineShape = this.props.lineShapes.find(p => p.id === id)
        selectedLineShapes.push(LineShape)
      }
      const copies = DuplicateHelper.duplicateLineShapes(selectedLineShapes, this.props.amountOfShapesInTile)
      this.props.setPropertyEditor_lineShapes(this.props.lineShapes.concat(copies))
      this.props.setSelectedLineShapeIds(copies.map(p => p.id))

    }
  }

  setIsSelectingNextField(e: KeyboardEvent) {
    e.preventDefault()

    if (this.props.isSelectingNextField) {
      this.props.set_editor_isSelectingNextField(false, null)
      return
    }

    if (this.props.selectedFieldShapeIds.length === 1) {
      const selectedField = this.props.fieldShapes.find(p => p.id === this.props.selectedFieldShapeIds[0])
      this.props.set_editor_isSelectingNextField(true, selectedField)
      return
    }

    //TODO show message that we need exactly 1 field selected
  }

  onEscPressed(e: KeyboardEvent) {
    if (this.props.isSelectingNextField) {
      this.props.set_editor_isSelectingNextField(false, null)
      return
    }

    //if not deselect all shapes + symbols
    this.onSelectFieldShapes([])
  }

  onUndoPressed(e: KeyboardEvent): void {

    if (this.props.shapeReducerState.past.length === 0) return

    this.props.undo_shapeEditor()
  }

  onRedoPressed(e: KeyboardEvent): void {

    if (this.props.shapeReducerState.future.length === 0) return

    this.props.redo_shapeEditor()
  }

  onSelectFieldShapes(ids: ReadonlyArray<number>) {

    //if we unselect all this will be called so handle special cases here

    //we could also had selected a symbol in another stage
    const wasNoShapeSelectedBeforeClear = this.props.selectedFieldShapeIds.length === 0
      && this.props.selectedLineShapeIds.length === 0
      && this.props.selectedImageShapeIds.length === 0
      && this.props.selectedFieldSymbolGuid === null
      && this.props.selectedLineSymbolGuid === null
      && this.props.selectedImgSymbolGuid === null

    this.props.set_selectedFieldSymbolGuid(null) //hide the symbol props editor
    this.props.setSelectedFieldShapeIds(ids)

    if (ids.length === 0) {
      if (wasNoShapeSelectedBeforeClear) {
        //then we don't need to reset
        //this can happen if we switch right tabs and no shape is selected
        //if we then click on the tile the index should not switch back
        return
      }

      this.props.set_editor_restoreRightTabActiveIndex()

      return
    }


    this.props.set_editor_rightTabActiveIndex(RightTileEditorTabs.propertyEditorTab)


  }


  render(): JSX.Element {
    return (
      <div>

        <div className="flexed" style={{marginBottom: '0.5em'}}>

          {
            //create new tile & abort
          }
          <div className="flexed" style={{flex: '1'}}>

            {
              this.props.isCreatingNewTile &&
              <Button icon labelPosition='left'
                      className={this.props.simulationState.simulationStatus !== null || this.props.simulationState.machineState !== null ? 'div-disabled' : ''}
                      onClick={() => {
                        this.props.set_world_isTileEditorDisplayed(false)
                        this.props.set_app_activeTabIndex(AvailableAppTabs.worldEditor)

                        //add the new tile to the tile library

                        const tile: Tile = {
                          lineShapes: this.props.lineShapes,
                          fieldShapes: this.props.fieldShapes,
                          imgShapes: this.props.imgShapes,
                          rightBorderPoint: this.props.tileProps.rightBorderPoint,
                          botBorderPoints: this.props.tileProps.botBorderPoints,
                          leftBorderPoints: this.props.tileProps.leftBorderPoints,
                          topBorderPoints: this.props.tileProps.topBorderPoints,
                          height: this.props.tileProps.height,
                          width: this.props.tileProps.width,
                          displayName: this.props.tileProps.displayName,
                          guid: getGuid(),
                          simulationStartFieldIds: this.props.tileProps.simulationStartFieldIds,
                          simulationEndFieldIds: this.props.tileProps.simulationEndFieldIds
                        }

                        this.props.set_tileLibrary_possibleTiles(this.props.allTiles.concat(tile))
                      }}>
                <Icon name='asterisk'/>
                {
                  getI18n(this.props.langId, "Add tile to library")
                }
              </Button>
            }

            {
              !this.props.isCreatingNewTile &&
              <Button icon labelPosition='left'
                      className={this.props.simulationState.simulationStatus !== null || this.props.simulationState.machineState !== null ? 'div-disabled' : ''}
                      onClick={() => {
                        this.props.set_world_isTileEditorDisplayed(false)
                        this.props.set_app_activeTabIndex(AvailableAppTabs.worldEditor)

                        //add the new tile to the tile library
                        const tile: Tile = {
                          lineShapes: this.props.lineShapes,
                          fieldShapes: this.props.fieldShapes,
                          imgShapes: this.props.imgShapes,
                          rightBorderPoint: this.props.tileProps.rightBorderPoint,
                          botBorderPoints: this.props.tileProps.botBorderPoints,
                          leftBorderPoints: this.props.tileProps.leftBorderPoints,
                          topBorderPoints: this.props.tileProps.topBorderPoints,
                          height: this.props.tileProps.height,
                          width: this.props.tileProps.width,
                          displayName: this.props.tileProps.displayName,
                          guid: this.props.editingTileGuide,
                          simulationStartFieldIds: this.props.tileProps.simulationStartFieldIds,
                          simulationEndFieldIds: this.props.tileProps.simulationEndFieldIds
                        }


                        const list = this.props.allTiles.map(p =>
                          p.guid !== this.props.editingTileGuide
                            ? p
                            : tile
                        )

                        this.props.set_tileLibrary_possibleTiles(list)
                      }}>
                <Icon name='write'/>
                {
                  getI18n(this.props.langId, "Apply changes to tile")
                }
              </Button>
            }

            <Button icon labelPosition='left'
                    className={this.props.simulationState.simulationStatus !== null || this.props.simulationState.machineState !== null ? 'div-disabled' : ''}
                    onClick={() => {
                      this.props.set_world_isTileEditorDisplayed(false)
                      this.props.set_app_activeTabIndex(AvailableAppTabs.worldEditor)
                    }}>
              <Icon name='cancel'/>
              {
                getI18n(this.props.langId, "Cancel")
              }
            </Button>


            <div className="mar-left">
              <Popup
                flowing
                style={shortcutPopupStyle}
                trigger={
                  <Icon className="hoverable" size="large" name="keyboard"/>
                }
                horizontalOffset={horizontalIconPopupOffsetInPx}
                position="bottom left"
                wide="very"
                content={
                  <div>
                    <div>
                      {getI18n(this.props.langId, "Hint: Make sure you don't have any text field focused to use the shortcuts. Else the text field will receive the shortcuts and they won't work.")}
                    </div>
                    <Table basic='very' celled collapsing>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell width="5">{getI18n(this.props.langId, "Shortcut")}</Table.HeaderCell>
                          <Table.HeaderCell>{getI18n(this.props.langId, "Action")}</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>
                            <div className="keys"><Icon name="long arrow alternate left"/></div>
                            ,
                            <div className="keys">{getI18n(this.props.langId, "Del")}</div>
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              {getI18n(this.props.langId, "Removes the selected shapes")}
                            </div>
                          </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                          <Table.Cell>
                            <div className="keys">ctrl+d</div>
                            ,
                            <div className="keys">cmd+d</div>
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              {getI18n(this.props.langId,
                                "Copy all selected shapes and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) from left to right")}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <div className="keys">ctrl+shift+d</div>
                            ,
                            <div className="keys">cmd+shift+d</div>
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              {getI18n(this.props.langId,
                                "Copy all selected shapes and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) from right to left")}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <div className="keys">ctrl+n</div>
                            ,
                            <div className="keys">cmd+n</div>
                          </Table.Cell>
                          <Table.Cell>
                            <div dangerouslySetInnerHTML={getRawI18n(this.props.langId,
                              "Enables the next field mode. When you then click on a field (the next field) or a border point then a control goto statement is added to the command text and the next field is selected. To quit the mode click elsewhere on the canvas. Shortcut: <div class='keys'>ctrl+n</div>, <div class='keys'>cmd+n</div>. Press the shortcut again to disable the mode or <div class='keys'>esc</div>.")}></div>
                          </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                          <Table.Cell>
                            <div className="keys">esc</div>
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              {getI18n(this.props.langId,
                                "Quits the selected next field mode if active. If not deselects all shapes & symbols")}
                            </div>
                          </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                          <Table.Cell>
                            {getI18n(this.props.langId, "Hold")}
                            <div className="keys">alt</div>
                            + {getI18n(this.props.langId, "Drag tile")}
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              {getI18n(this.props.langId,
                                "Used to disable selection when you click on the tile. This is useful if the tile is covered with shapes but you only want to drag the tile")}
                            </div>
                          </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                          <Table.Cell>
                            {getI18n(this.props.langId, "Hold")}
                            <div className="keys">shift</div>
                            + {getI18n(this.props.langId, "Click on a shape")}
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              {getI18n(this.props.langId,
                                "Used to select multiple shapes. Note that you can only select the same kind of shapes (e.g. 2 fields, 3 lines, ...)")}
                            </div>
                          </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                          <Table.Cell>
                            <div className="keys">ctrl+z</div>
                            ,
                            <div className="keys">cmd+z</div>
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              {getI18n(this.props.langId,
                                "Undo the last shape/symbol edit operation (experimental)")}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <div className="keys">ctrl+y</div>
                            ,
                            <div className="keys">cmd+shift+z</div>
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              {getI18n(this.props.langId,
                                "Redo the last shape/symbol edit operation (experimental)")}
                            </div>
                          </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                          <Table.Cell>
                            <div className="keys">F10</div>
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              {getI18n(this.props.langId,
                                "Do 1 simulation step")}
                            </div>
                          </Table.Cell>
                        </Table.Row>

                      </Table.Body>
                    </Table>
                  </div>
                }
              />

            </div>


            <div className="mar-left">
              <TooTip
                message={getI18n(this.props.langId, "Export as svg (experimental)")}>
                <Button icon onClick={() => {

                  const tile: Tile = {
                    guid: getGuid(),
                    width: this.props.tileProps.width,
                    height: this.props.tileProps.height,
                    imgShapes: this.props.imgShapes,
                    fieldShapes: this.props.fieldShapes,
                    lineShapes: this.props.lineShapes,
                    displayName: this.props.tileProps.displayName,
                    topBorderPoints: this.props.tileProps.topBorderPoints,
                    botBorderPoints: this.props.tileProps.botBorderPoints,
                    leftBorderPoints: this.props.tileProps.leftBorderPoints,
                    rightBorderPoint: this.props.tileProps.rightBorderPoint,
                    simulationStartFieldIds: [],
                    simulationEndFieldIds: []
                  }

                  PrintHelper.exportTileAsLargeSvg(
                    tile,
                    this.props.fieldSymbols,
                    this.props.imgSymbols,
                    this.props.lineSymbols,
                    false,
                    this.props.settings.gridSizeInPx,
                    this.props.worldSettings.gridStrokeThicknessInPx,
                    this.props.worldSettings.gridStrokeColor,
                    this.props.worldSettings,
                  )

                }}>
                  <Icon.Group>
                    <Icon name='upload' />
                    <Icon corner name='image' />
                  </Icon.Group>
                </Button>
              </TooTip>
            </div>

          </div>

          <div className="flexed">

            <TileEditorSettingsArea/>
          </div>

        </div>


        <TileEditorSettings/>

        <div className="tile-editor-content">

          <LeftEditorTabMenu/>

          <div className="tile-editor-center-area">

            <div className="top-bar">
              <TileActionsBar/>
            </div>

            <div className="left-bar">
            </div>

            <TileRenderer

              isSelectingNextField={this.props.isSelectingNextField}
              sourceForSelectingNextField={this.props.sourceForSelectingNextField}
              setPropertyEditor_FieldCmdText={(fieldId, cmdText) => {
                this.props.setPropertyEditor_FieldCmdText(fieldId, cmdText)
              }}
              setTileEditorSelectingNextField={(isSelectingNextField, sourceForSelectingNextField) => {
                this.props.set_editor_isSelectingNextField(isSelectingNextField, sourceForSelectingNextField)
              }}
              simulationMachineState={this.props.machineState}
              viewMaxWidth={1000}
              viewMaxHeight={1000}
              topBorderPoints={this.props.tileProps.topBorderPoints}
              botBorderPoints={this.props.tileProps.botBorderPoints}
              leftBorderPoints={this.props.tileProps.leftBorderPoints}
              rightBorderPoint={this.props.tileProps.rightBorderPoint}
              drawGrid={this.props.settings.showGrid}
              gridSizeInPx={this.props.settings.gridSizeInPx}
              snapToGrid={this.props.settings.snapToGrid}
              drawFieldIds={this.props.settings.showSequenceIds}

              fieldShapes={this.props.fieldShapes}
              imgShapes={this.props.imgShapes}
              lineShapes={this.props.lineShapes}
              canvasHeight={this.props.tileProps.height}
              canvasWidth={this.props.tileProps.width}


              setPropertyEditor_FieldX={(fieldShape, oldX, newX) => {
                this.props.setPropertyEditor_FieldX(fieldShape.id, fieldShape.x + newX - oldX)
              }}
              setPropertyEditor_FieldY={(fieldShape, oldY, newY) => {
                this.props.setPropertyEditor_FieldY(fieldShape.id, fieldShape.y + newY - oldY)
              }}

              setPropertyEditor_ImageX={(imgShape, oldX, newX) => {
                this.props.setPropertyEditor_ImageX(imgShape.id, imgShape.x + newX - oldX)
              }}
              setPropertyEditor_ImageY={(imgShape, oldY, newY) => {
                this.props.setPropertyEditor_ImageY(imgShape.id, imgShape.y + newY - oldY)
              }}

              setLinePointNewPos={(lineId, oldPointId, oldPointPos, newPointPos, canSetFieldAnchorPoints) => {
                this.props.setLinePointNewPos(lineId, oldPointId, newPointPos, canSetFieldAnchorPoints)
              }}
              setSelectedFieldShapeIds={(ids) => {
                this.onSelectFieldShapes(ids)
              }}
              setSelectedImageShapeIds={(ids) => {
                this.props.set_selectedImgSymbolGuid(null) //hide the symbol props editor
                this.props.setSelectedImageShapeIds(ids)

                if (ids.length === 0) {
                  this.props.set_editor_restoreRightTabActiveIndex()
                  return
                }

                this.props.set_editor_rightTabActiveIndex(RightTileEditorTabs.propertyEditorTab)
              }}
              setSelectedLineShapeIds={(ids) => {
                this.props.set_selectedLineSymbolGuid(null) //hide the symbol props editor
                this.props.setSelectedLineShapeIds(ids)

                if (ids.length === 0) {
                  this.props.set_editor_restoreRightTabActiveIndex()
                  return
                }

                this.props.set_editor_rightTabActiveIndex(RightTileEditorTabs.propertyEditorTab)
              }}

              selectedFieldSymbolGuid={null}
              selectedImageSymbolGuid={null}
              selectedLineSymbolGuid={null}

              setSelectedFieldSymbolGuid={nop}
              setSelectedLineSymbolGuid={nop}
              setSelectedImageSymbolGuid={nop}

              selectedFieldShapeIds={this.props.selectedFieldShapeIds}
              selectedImageShapeIds={this.props.selectedImageShapeIds}
              selectedLineShapeIds={this.props.selectedLineShapeIds}
              stageOffsetX={this.props.stageOffsetX}
              stageOffsetY={this.props.stageOffsetY}
              setEditor_stageOffset={this.props.setEditor_stageOffset}

              stageOffsetXScaleCorrection={this.props.stageOffsetXScaleCorrection}
              stageOffsetYScaleCorrection={this.props.stageOffsetYScaleCorrection}
              stageScaleX={this.props.stageScaleX}
              stageScaleY={this.props.stageScaleY}
              setEditor_stageScale={this.props.setEditor_stageScale}
              set_editor_stageOffsetScaleCorrection={this.props.set_editor_stageOffsetScaleCorrection}
            />

            <div className="right-bar">
              <TileRightActionBar/>
            </div>

            <div className="bottom-bar">

            </div>

          </div>

          <RightEditorTabMenu/>


        </div>


      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(tileEditor)

