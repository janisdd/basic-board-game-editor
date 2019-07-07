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
import {set_selectedLinePointNewPosAction} from "../../state/reducers/tileEditor/lineProperties/actions";
import {set_editor_isReconnectingLinesToAnchorPoints} from "../../state/reducers/tileEditor/actions";
import {delay} from "../../helpers/functionHelpers";

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

    isReconnectingLinesToAnchorPoints: rootState.tileEditorState.isReconnectingLinesToAnchorPoints,

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
  set_selectedLinePointNewPosAction,
  set_editor_isReconnectingLinesToAnchorPoints,

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
                        this.props.settings.tileProps.tileSettings.insertLinesEvenIfFieldsIntersect,
                        this.props.worldSettings.alwaysInsertArrowHeadsWhenAutoConnectingFields,
                      )
                    } catch (err) {
                      //probably a syntax error
                      console.error(err)
                      Logger.fatalSyntaxError('error connecting fields: ' + err)
                    }


                  }}
          >
            <Icon name="wizard"/>
          </Button>
        </ToolTip>

        <ToolTip
          wide="very"
          message={getI18n(this.props.langId, "Connect all lines to anchor points in snap range. Sometimes the line points will not snap to anchor points properly. This ensures that all lines are properly connected to anchor points if a line point is in snap range. If you have many lines or field this could take a while.")}
        >
          <Button icon
                  loading={this.props.isReconnectingLinesToAnchorPoints}
                  onClick={() => {

                    this.props.set_editor_isReconnectingLinesToAnchorPoints(true)


                    //a new macro task so set_editor_isReconnectingLinesToAnchorPoints(true) is rendered (current script)
                    //so we will see the spinner animation
                    setTimeout(() => {

                      //setting the pos to the old will snap the lines to the anchor points
                      try {

                        for (let i = 0; i < this.props.lineShapes.length; i++) {
                          const lineShape = this.props.lineShapes[i];

                          this.props.set_selectedLinePointNewPosAction(lineShape.id, lineShape.startPoint.id, lineShape.startPoint)

                          for (let j = 0; j < lineShape.points.length; j++) {
                            const linePoint = lineShape.points[j];
                            this.props.set_selectedLinePointNewPosAction(lineShape.id, linePoint.id, linePoint)
                          }
                        }
                      } catch (err) {
                        Logger.fatal(err)
                      } finally {
                        this.props.set_editor_isReconnectingLinesToAnchorPoints(false)
                      }

                    }, 0)

                  }}
          >
            <Icon name="plug"/>
          </Button>
        </ToolTip>

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
