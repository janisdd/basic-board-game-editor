import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {CurveMode, FieldShape, PlainPoint} from "../../types/drawing";
import {
  defaultFieldShape, defaultImgShapeProps, defaultLineShape
} from "../../constants";
import {MajorLineDirection, Tile} from "../../types/world";
import {getNextShapeId} from "../../state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import {getNiceBezierCurveBetween} from "../../helpers/interactionHelper";
import {Button, Icon} from "semantic-ui-react";
import {addFieldShape} from "../../state/reducers/tileEditor/fieldProperties/actions";
import {addImageShape} from "../../state/reducers/tileEditor/imgProperties/actions";
import {addLineShape} from "../../state/reducers/tileEditor/lineProperties/actions";
import ImageLibrary from './imageLibrary/imageLibrary'
import {
  setEditor_IsAddImgShapeLibraryDisplayed
} from "../../state/reducers/tileEditor/actions";
import {
  set_simulation_simulationResults,
  set_simulation_simulationStatus
} from "../../state/reducers/simulation/actions";
import ControlSimulationBar from './controlSimulationBar'
import {getI18n} from "../../../i18n/i18nRoot";
import ToolTip from "../helpers/ToolTip";
import {redo_shapeEditor, undo_shapeEditor} from "../../state/reducers/tileEditor/shapesReducer/actions";
import {renewAllZIndicesInTile} from "../../helpers/someIndexHelper";
import {CoordHelper} from "../../helpers/CoordHelper";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    tileProps: rootState.tileEditorState.tileProps,
    settings: rootState.tileEditorState,
    worldSettings: rootState.worldSettingsState,

    fieldShapes: rootState.tileEditorFieldShapesState.present,
    imgShapes: rootState.tileEditorImgShapesState.present,
    lineShapes: rootState.tileEditorLineShapeState.present,


    amountOfShapesInTile: rootState.tileEditorLineShapeState.present.length + rootState.tileEditorImgShapesState.present.length + rootState.tileEditorFieldShapesState.present.length,
    amountOfFieldsInTile: rootState.tileEditorFieldShapesState.present.length,

    isAddImgShapeLibraryDisplayed: rootState.tileEditorState.isAddImgShapeLibraryDisplayed,

    simulationState: rootState.simulationState,

    worldCmdText: rootState.worldSettingsState.worldCmdText,

    langId: rootState.i18nState.langId,

    shapeReducerState: rootState.shapesReducerState

  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  addFieldShape,
  addLineShape,
  addImageShape,

  setEditor_IsAddImgShapeLibraryDisplayed,

  set_simulation_simulationStatus,
  set_simulation_simulationResults,

  undo_shapeEditor,
  redo_shapeEditor

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


class tileActionsBar extends React.Component<Props, any> {

  render(): JSX.Element {


    const tile: Tile = {
      ...this.props.tileProps,
      guid: 'single tile simulation',
      imgShapes: [],
      lineShapes: [],
      fieldShapes: this.props.fieldShapes
    }

    return (
      <div>

        <div className="flex-left-right">

          <div className="flexed">

            <ToolTip
              message={getI18n(this.props.langId, "Add field")}
            >
              <Button icon
                      onClick={() => {

                        const newPoint: PlainPoint = {
                          x: defaultFieldShape.x,
                          y: defaultFieldShape.y
                        }

                        const pos: PlainPoint = CoordHelper.toAbsolutePos(newPoint,
                          this.props.settings.stageOffsetX,
                          this.props.settings.stageOffsetY,
                          this.props.settings.stageScaleX,
                          this.props.settings.stageScaleY,
                          this.props.settings.stageOffsetXScaleCorrection,
                          this.props.settings.stageOffsetYScaleCorrection
                        )

                        const shiftedPos = this.props.tileProps.tileSettings.snapToGrid
                          ? CoordHelper.toSnapGridCoords(pos, this.props.tileProps.tileSettings.gridSizeInPx)
                          : pos

                        console.log('aaaaaaaaaaaaaaaa')

                        //make a deep copy
                        const field: FieldShape = {
                          ...defaultFieldShape,
                          id: getNextShapeId(),
                          zIndex: this.props.amountOfShapesInTile,
                          text: 'field: ' + this.props.amountOfFieldsInTile,
                          x: shiftedPos.x,
                          y: shiftedPos.y,
                          padding: { //copy
                            ...defaultFieldShape.padding
                          },
                          anchorPoints: defaultFieldShape.anchorPoints.map(p => {
                            return {
                              ...p
                            }
                          }),
                          connectedLinesThroughAnchorPoints: {}
                        }

                        this.props.addFieldShape(field)
                        renewAllZIndicesInTile()
                      }}
              >
                <Icon name='cube'/>
              </Button>
            </ToolTip>

            <ToolTip
              message={getI18n(this.props.langId, "Add line")}
            >
              <Button icon
                      onClick={() => {

                        const newPoint: PlainPoint = {
                          x: defaultLineShape.startPoint.x,
                          y: defaultLineShape.startPoint.y
                        }

                        const pos: PlainPoint = CoordHelper.toAbsolutePos(newPoint,
                          this.props.settings.stageOffsetX,
                          this.props.settings.stageOffsetY,
                          this.props.settings.stageScaleX,
                          this.props.settings.stageScaleY,
                          this.props.settings.stageOffsetXScaleCorrection,
                          this.props.settings.stageOffsetYScaleCorrection
                        )

                        const shiftedPos = this.props.tileProps.tileSettings.snapToGrid
                          ? CoordHelper.toSnapGridCoords(pos, this.props.tileProps.tileSettings.gridSizeInPx)
                          : pos

                        let firstPointOffsetInPx = 100

                        const newEndPoint = {
                          x: defaultLineShape.startPoint.x + firstPointOffsetInPx,
                          y: defaultLineShape.startPoint.y + firstPointOffsetInPx
                        }

                        const pos2: PlainPoint = CoordHelper.toAbsolutePos(newEndPoint,
                          this.props.settings.stageOffsetX,
                          this.props.settings.stageOffsetY,
                          this.props.settings.stageScaleX,
                          this.props.settings.stageScaleY,
                          this.props.settings.stageOffsetXScaleCorrection,
                          this.props.settings.stageOffsetYScaleCorrection
                        )


                        const shiftedPos2 = this.props.tileProps.tileSettings.snapToGrid
                          ? CoordHelper.toSnapGridCoords(pos2, this.props.tileProps.tileSettings.gridSizeInPx)
                          : pos2


                        this.props.addLineShape({
                          ...defaultLineShape,
                          dashArray: defaultLineShape.dashArray.concat(), //copy
                          id: getNextShapeId(),
                          zIndex: this.props.amountOfShapesInTile,
                          startPoint: {
                            id: getNextShapeId(),
                            x: shiftedPos.x,
                            y: shiftedPos.y,
                          },
                          points: [
                            {
                              ...getNiceBezierCurveBetween({x: shiftedPos.x, y: shiftedPos.y}, {
                                  x: shiftedPos2.x,
                                  y: shiftedPos2.y
                                },
                                this.props.tileProps.tileSettings.majorLineDirection), //MajorLineDirection.topToBottom
                            }
                          ],
                        })

                        renewAllZIndicesInTile()
                      }}
              >
                <Icon name='exchange'/>
              </Button>
            </ToolTip>


            <ToolTip
              message={getI18n(this.props.langId, "Add image")}
            >
              <Button icon onClick={() => {
                this.props.setEditor_IsAddImgShapeLibraryDisplayed(true)
              }}>
                <Icon name='image'/>
              </Button>
            </ToolTip>

            <ImageLibrary
              isCreatingNewImgShape={true}
              onImageTaken={(imgSurrogate) => {

                const newPoint: PlainPoint = {
                  x: defaultImgShapeProps.x,
                  y: defaultImgShapeProps.y
                }

                const pos: PlainPoint = CoordHelper.toAbsolutePos(newPoint,
                  this.props.settings.stageOffsetX,
                  this.props.settings.stageOffsetY,
                  this.props.settings.stageScaleX,
                  this.props.settings.stageScaleY,
                  this.props.settings.stageOffsetXScaleCorrection,
                  this.props.settings.stageOffsetYScaleCorrection
                )

                const shiftedPos = this.props.tileProps.tileSettings.snapToGrid
                  ? CoordHelper.toSnapGridCoords(pos, this.props.tileProps.tileSettings.gridSizeInPx)
                  : pos

                this.props.addImageShape({
                  ...defaultImgShapeProps,
                  id: getNextShapeId(),
                  zIndex: this.props.amountOfShapesInTile,
                  imgGuid: imgSurrogate.guid,
                  x: shiftedPos.x,
                  y: shiftedPos.y
                })

                renewAllZIndicesInTile()
                this.props.setEditor_IsAddImgShapeLibraryDisplayed(false)
              }}
              isDisplayed={this.props.isAddImgShapeLibraryDisplayed}
              set_isDisplayed={(isDisplayed) => {
                this.props.setEditor_IsAddImgShapeLibraryDisplayed(isDisplayed)
              }}
            />


          </div>

          <ControlSimulationBar
            tiles={[tile]}
            gameInitCmdText={this.props.worldCmdText}
            tileSurrogates={null}
            isSingleSimulation={true}
          />

          <div className="flexed">

            <ToolTip
              message={getI18n(this.props.langId, "Undo the last shape/symbol edit operation (experimental)")}
            >
              <Button disabled={this.props.shapeReducerState.past.length === 0} icon onClick={() => {
                this.props.undo_shapeEditor()
              }}>
                <Icon name="undo"/>
              </Button>
            </ToolTip>

            <ToolTip
              message={getI18n(this.props.langId, "Redo the last shape/symbol edit operation (experimental)")}
            >
              <Button disabled={this.props.shapeReducerState.future.length === 0} icon onClick={() => {
                this.props.redo_shapeEditor()
              }}>
                <Icon name="redo"/>
              </Button>
            </ToolTip>
          </div>


        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(tileActionsBar)