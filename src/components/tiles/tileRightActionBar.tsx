import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {getGuid} from "../../helpers/guid";
import {autoConnectFieldsWithLinesByCmdText} from "../../helpers/interactionHelper";
import {PrintHelper} from "../../helpers/printHelper";
import {Tile} from "../../types/world";
import {Button, Icon} from "semantic-ui-react";
import {setPropertyEditor_FieldCmdText} from "../../state/reducers/tileEditor/fieldProperties/actions";
import {DialogHelper} from "../../helpers/dialogHelper";
import {Simulator} from "../../../simulation/simulator";
import {Logger} from "../../helpers/logger";
import {getI18n} from "../../../i18n/i18nRoot";
import ToolTip from '../helpers/ToolTip'
import {exportPngImagesBgColor} from "../../constants";

//const css = require('./styles.styl');

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

    tileProps: rootState.tileEditorState.tileProps,

    amountOfShapesInTile: rootState.tileEditorLineShapeState.present.length + rootState.tileEditorImgShapesState.present.length + rootState.tileEditorFieldShapesState.present.length,
    amountOfFieldsInTile: rootState.tileEditorFieldShapesState.present.length,

    settings: rootState.tileEditorState,
    worldSettings: rootState.worldSettingsState,


    worldCmdText: rootState.worldSettingsState.worldCmdText,
    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  setPropertyEditor_FieldCmdText,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class tileRightActionBar extends React.Component<Props, any> {


  render(): JSX.Element {

    const tile: Tile = {
      ...this.props.tileProps,
      guid: 'single tile simulation',
      imgShapes: [],
      lineShapes: [],
      fieldShapes: this.props.fieldShapes
    }

    return (
      <div className="flexed-h vertical-stacked-buttons">

        <ToolTip
          message={getI18n(this.props.langId, "Check all fields for correct command syntax")}
        >
          <Button icon
                  onClick={() => {
                    //parse all field cmds for syntax errors
                    Simulator.parseAllFields(this.props.worldCmdText, [tile],
                      false,
                      false,
                      false,
                      false
                    )

                    Logger.success('All commands are syntactical ok')
                  }}
          >
            <Icon name="code"/>
          </Button>
        </ToolTip>
        <ToolTip
          message={getI18n(this.props.langId, "Checks if all variables are defined. This also executes the game init/setup code (experimental/not enough tested)")}
        >
          <Button icon
                  onClick={() => {

                    //parse all field cmds for syntax

                    Simulator.checkAllVarsDefined(this.props.worldCmdText, [tile])

                    Logger.success('All variables are defined')
                  }}
          >
            <Icon name="terminal"/>
          </Button>
        </ToolTip>
        <ToolTip
          message={getI18n(this.props.langId, "Auto connect fields by command texts. Fields that are alreay connected through at least one line will be omitted")}
        >
          <Button icon
                  onClick={() => {

                    try {
                      autoConnectFieldsWithLinesByCmdText(
                        this.props.fieldShapes,
                        this.props.fieldSymbols,
                        this.props.amountOfShapesInTile,
                        this.props.tileProps.topBorderPoints,
                        this.props.tileProps.botBorderPoints,
                        this.props.tileProps.leftBorderPoints,
                        this.props.tileProps.rightBorderPoint,
                        this.props.tileProps.tileSettings.width,
                        this.props.tileProps.tileSettings.height,
                        this.props.worldSettings.tileMidPointsDiameter,
                        this.props.settings.tileProps.tileSettings.majorLineDirection,
                        this.props.lineShapes,
                        this.props.settings.tileProps.tileSettings.insertLinesEvenIfFieldsIntersect
                      )
                    } catch (err) {
                      //probably a syntax error
                      console.error(err)
                      Logger.fatal('error connecting fields: ' + err)
                    }


                  }}
          >
            <Icon name="wizard"/>
          </Button>
        </ToolTip>


        <Button icon onClick={() => {

          const tile: Tile = {
            guid: getGuid(),
            imgShapes: this.props.imgShapes,
            fieldShapes: this.props.fieldShapes,
            lineShapes: this.props.lineShapes,
            topBorderPoints: this.props.tileProps.topBorderPoints,
            botBorderPoints: this.props.tileProps.botBorderPoints,
            leftBorderPoints: this.props.tileProps.leftBorderPoints,
            rightBorderPoint: this.props.tileProps.rightBorderPoint,
            simulationStartFieldIds: [],
            simulationEndFieldIds: [],
            tileSettings: {
              displayName: this.props.tileProps.tileSettings.displayName,
              width: this.props.tileProps.tileSettings.width,
              height: this.props.tileProps.tileSettings.height,
              majorLineDirection: this.props.tileProps.tileSettings.majorLineDirection,
              gridSizeInPx: this.props.tileProps.tileSettings.gridSizeInPx,
              showGrid: this.props.tileProps.tileSettings.showGrid,
              snapToGrid: this.props.tileProps.tileSettings.snapToGrid,
              showSequenceIds: this.props.tileProps.tileSettings.showSequenceIds,
              moveBezierControlPointsWhenLineIsMoved: this.props.tileProps.tileSettings.moveBezierControlPointsWhenLineIsMoved,
              arePrintGuidesDisplayed: this.props.tileProps.tileSettings.arePrintGuidesDisplayed,
              autoIncrementFieldTextNumbersOnDuplicate: this.props.tileProps.tileSettings.autoIncrementFieldTextNumbersOnDuplicate,
              printLargeTilePreferredWidthInPx: this.props.tileProps.tileSettings.printLargeTilePreferredWidthInPx,
              printLargeTilePreferredHeightInPx: this.props.tileProps.tileSettings.printLargeTilePreferredHeightInPx,
              splitLargeTileForPrint: this.props.tileProps.tileSettings.splitLargeTileForPrint,
              insertLinesEvenIfFieldsIntersect: this.props.tileProps.tileSettings.insertLinesEvenIfFieldsIntersect
            }
          }

          PrintHelper.printLargeTile(tile,
            this.props.fieldSymbols,
            this.props.imgSymbols,
            this.props.lineSymbols,
            false,
            this.props.settings.tileProps.tileSettings.gridSizeInPx,
            this.props.worldSettings.gridStrokeThicknessInPx,
            this.props.worldSettings.gridStrokeColor,
            this.props.worldSettings,
            this.props.settings.tileProps.tileSettings.width,
            this.props.settings.tileProps.tileSettings.height,
            this.props.settings.tileProps.tileSettings.printLargeTilePreferredWidthInPx,
            this.props.settings.tileProps.tileSettings.printLargeTilePreferredHeightInPx,
            this.props.settings.tileProps.tileSettings.splitLargeTileForPrint,
            this.props.langId,
            null,
            this.props.worldSettings.printScale
          )
        }}>
          <Icon name="print"/>
        </Button>


        <ToolTip
          message={getI18n(this.props.langId, "Clear all commands from all field")}
        >
          <Button icon
                  onClick={async () => {

                    //remove all code from fields

                    const delCmds = await DialogHelper.askDialog('Delete all commands',
                      'Are you sure you want to delete all commands?')

                    if (delCmds) {
                      for (const fieldShape of this.props.fieldShapes) {
                        this.props.setPropertyEditor_FieldCmdText(fieldShape.id, null)
                      }
                    }

                  }}
          >
            <Icon.Group>
              <Icon name='code'/>
              <Icon corner name='remove'/>
            </Icon.Group>
          </Button>
        </ToolTip>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(tileRightActionBar)