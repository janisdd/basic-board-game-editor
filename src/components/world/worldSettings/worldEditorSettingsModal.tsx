import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state/index";
import {CSSProperties, SyntheticEvent} from "react";
import {Button, Input, Form, Icon, Modal, Checkbox, Tab, Popup} from "semantic-ui-react";
import {
  set_world_expectedTileHeight,
  set_world_expectedTileWidth,
  set_world_worldWidthInTiles,
  set_world_worldHeightInTiles,
  set_world_worldCmdTextAction,
  set_world_printGameAsOneImageAction,
  set_world_timeInS_rollDiceAction,
  set_world_timeInS_choose_bool_funcAction,
  set_world_timeInS_gotoAction,
  set_world_timeInS_set_varAction,
  set_world_timeInS_advancePlayerAction,
  set_world_timeInS_rollbackAction,
  set_world_timeInS_var_declAction,
  set_world_timeInS_expr_primary_leftStepsAction,
  set_world_timeInS_expr_primary_constantAction,
  set_world_timeInS_expr_primary_identAction,
  set_world_timeInS_expr_primary_incrementOrDecrementAction,
  set_world_timeInS_expr_disjunctionAction,
  set_world_timeInS_expr_conjunctionAction,
  set_world_timeInS_expr_comparisonAction,
  set_world_timeInS_expr_relationAction,
  set_world_timeInS_expr_sumAction,
  set_world_timeInS_expr_termAction,
  set_world_timeInS_expr_factorAction,
  set_world_printScale,
  set_world_additionalBorderWidthInPx,
  set_world_alwaysInsertArrowHeadsWhenAutoConnectingFields,
  set_world_forcedFieldAutoPrependText,
  set_world_forcedFieldBorderColor,
  set_world_branchIfIsFontBold,
  set_world_forcedFieldAutoBorderSizeInPx,
  set_world_branchIfIsFontItalic,
  set_world_forcedFieldIsFontBold,
  set_world_forcedFieldIsFontItalic,
  set_world_branchIfAutoBorderSizeInPx,
  set_world_branchIfBorderColor,
  set_world_branchIfPrependText,
  set_world_forcedFieldBgColor,
  set_world_branchIfColor,
  set_world_branchIfBgColor,
  set_world_forcedFieldColor,
  set_world_startFieldBgColor,
  set_world_startFieldIsFontBold,
  set_world_startFieldBorderColor,
  set_world_startFieldColor,
  set_world_startFieldAutoPrependText,
  set_world_startFieldAutoBorderSizeInPx,
  set_world_startFieldIsFontItalic,
  set_world_endFieldBgColor,
  set_world_endFieldBorderColor,
  set_world_endFieldIsFontItalic,
  set_world_endFieldColor,
  set_world_endFieldAutoPrependText,
  set_world_endFieldIsFontBold, set_world_endFieldAutoBorderSizeInPx

} from "../../../state/reducers/world/worldSettings/actions";
import {
  set_world_isWorldSettingsModalDisplayed
} from "../../../state/reducers/world/actions";
import {getI18n, getRawI18n} from "../../../../i18n/i18nRoot";
import {CheckboxData} from "../../../types/ui";
import IconToolTip, {horizontalIconPopupOffsetInPx} from "../../helpers/IconToolTip";
import ToolTip from "../../helpers/ToolTip";
import {AbstractMachine, SimulationTimes} from "../../../../simulation/machine/AbstractMachine";
import EditorWrapper, {editorInstancesMap} from '../../helpers/editorWrapper'
import {Simulator} from "../../../../simulation/simulator";
import {Logger} from "../../../helpers/logger";
import {GameUnit} from "../../../../simulation/model/executionUnit";
import {DialogHelper} from "../../../helpers/dialogHelper";
import {ChromePicker} from "react-color";

//const css = require('./styles.styl');

export interface MyProps {
}

const mapStateToProps = (rootState: RootState,/* props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    worldSettings: rootState.worldSettingsState,
    isDisplayed: rootState.worldState.isWorldSettingsModalDisplayed,
    simulationState: rootState.simulationState,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_world_worldWidthInTiles,
  set_world_worldHeightInTiles,
  set_world_expectedTileWidth,
  set_world_expectedTileHeight,

  set_world_isWorldSettingsModalDisplayed,
  set_world_worldCmdTextAction,
  set_world_printGameAsOneImageAction,
  set_world_printScale,
  set_world_additionalBorderWidthInPx,


  set_world_timeInS_rollDiceAction,
  set_world_timeInS_choose_bool_funcAction,
  set_world_timeInS_gotoAction,
  set_world_timeInS_set_varAction,
  set_world_timeInS_advancePlayerAction,
  set_world_timeInS_rollbackAction,
  set_world_timeInS_var_declAction,
  set_world_timeInS_expr_primary_leftStepsAction,
  set_world_timeInS_expr_primary_constantAction,
  set_world_timeInS_expr_primary_identAction,
  set_world_timeInS_expr_primary_incrementOrDecrementAction,
  set_world_timeInS_expr_disjunctionAction,
  set_world_timeInS_expr_conjunctionAction,
  set_world_timeInS_expr_comparisonAction,
  set_world_timeInS_expr_relationAction,
  set_world_timeInS_expr_sumAction,
  set_world_timeInS_expr_termAction,
  set_world_timeInS_expr_factorAction,

  set_world_alwaysInsertArrowHeadsWhenAutoConnectingFields,
  set_world_forcedFieldAutoPrependText,
  set_world_forcedFieldBorderColor,
  set_world_forcedFieldAutoBorderSizeInPx,
  set_world_forcedFieldIsFontBold,
  set_world_forcedFieldIsFontItalic,
  set_world_forcedFieldColor,
  set_world_forcedFieldBgColor,

  set_world_startFieldAutoPrependText,
  set_world_startFieldColor,
  set_world_startFieldBgColor,
  set_world_startFieldAutoBorderSizeInPx,
  set_world_startFieldBorderColor,
  set_world_startFieldIsFontBold,
  set_world_startFieldIsFontItalic,

  set_world_endFieldAutoPrependText,
  set_world_endFieldColor,
  set_world_endFieldBgColor,
  set_world_endFieldAutoBorderSizeInPx,
  set_world_endFieldBorderColor,
  set_world_endFieldIsFontBold,
  set_world_endFieldIsFontItalic,

  set_world_branchIfPrependText,
  set_world_branchIfAutoBorderSizeInPx,
  set_world_branchIfBorderColor,
  set_world_branchIfIsFontBold,
  set_world_branchIfIsFontItalic,
  set_world_branchIfColor,
  set_world_branchIfBgColor,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


const inputSimulationTimeStyle: CSSProperties = {
  width: '100px'
}
const defaultSimulationTimeInc = 0.1

const editorId = 'worldSettingsEditor'

class worldEditorSettingsModal extends React.Component<Props, any> {
  render(): JSX.Element {

    return (
      <div>

        <Modal closeIcon={true} centered={false}
               open={this.props.isDisplayed}
               onClose={() => {
                 this.props.set_world_isWorldSettingsModalDisplayed(false)
               }}
               size="large"
        >
          <Modal.Header>{getI18n(this.props.langId, "World setting")}</Modal.Header>
          <Modal.Content>

            <div>
              <Tab menu={{secondary: true, pointing: true}} panes={[
                {
                  menuItem: `${getI18n(this.props.langId, "World settings")}`,
                  render: () => {
                    return (
                      <Form as="div">

                        <Form.Group widths='equal'>
                          <Form.Field>
                            <label>{getI18n(this.props.langId, "World width in tiles")}</label>
                            <Input type="number" placeholder='5' value={this.props.worldSettings.worldWidthInTiles}

                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseInt(e.currentTarget.value)
                                     if (isNaN(val) || val < 0) return
                                     this.props.set_world_worldWidthInTiles(val)
                                   }}
                            />
                          </Form.Field>
                          <Form.Field>
                            <label>{getI18n(this.props.langId, "World height in tiles")}</label>
                            <Input type="number" placeholder='5' value={this.props.worldSettings.worldHeightInTiles}
                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseInt(e.currentTarget.value)
                                     if (isNaN(val) || val < 0) return
                                     this.props.set_world_worldHeightInTiles(val)
                                   }}
                            />
                          </Form.Field>
                        </Form.Group>

                        <Form.Group widths='equal'>
                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Tile width")}</label>
                            <Input type="number" placeholder='500' value={this.props.worldSettings.expectedTileWidth}

                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseInt(e.currentTarget.value)
                                     if (isNaN(val) || val < 0) return
                                     this.props.set_world_expectedTileWidth(val)
                                   }}
                            />
                          </Form.Field>
                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Tile height")}</label>
                            <Input type="number" placeholder='500' value={this.props.worldSettings.expectedTileHeight}
                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseInt(e.currentTarget.value)
                                     if (isNaN(val) || val < 0) return
                                     this.props.set_world_expectedTileHeight(val)
                                   }}
                            />
                          </Form.Field>
                        </Form.Group>

                        <Form.Group widths='equal'>
                          <Form.Field>
                            <Checkbox label={getI18n(this.props.langId, "Print game as one image")}
                                      checked={this.props.worldSettings.printGameAsOneImage}
                                      onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                                        this.props.set_world_printGameAsOneImageAction(data.checked)
                                      }}
                            />
                            <IconToolTip
                              message={getI18n(this.props.langId,
                                "If enable this will print all game tiles combined into one image. The variables will be put into separate images.")}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Print scale")}
                              <IconToolTip
                                message={getI18n(this.props.langId,
                                  "The images will be scaled by this factor. If it is less than 1 then the images will be larger, if is more than 1 the images will be smaller")}
                              />
                            </label>

                            <Input type="number" placeholder='1' value={this.props.worldSettings.printScale}
                                   step='0.1'
                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val) || val < 0) return
                                     this.props.set_world_printScale(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Additional border width")}
                              <IconToolTip
                                message={getI18n(this.props.langId,
                                  "Every export or print image will include a black border with this width (might be better for cutting). Note that the real width will be only half that width because the other half is clipped because of the image dimension.")}
                              />
                            </label>

                            <Input type="number" placeholder='1'
                                   value={this.props.worldSettings.additionalBorderWidthInPx}
                                   step='0.1'
                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val) || val < 0) return
                                     this.props.set_world_additionalBorderWidthInPx(val)
                                   }}
                            />
                          </Form.Field>

                        </Form.Group>

                        <Form.Field>

                          <label>{getI18n(this.props.langId, "Game setup code")}
                            <IconToolTip
                              message={'Click to validate the code'}
                              icon="code"
                              onClick={() => {

                                const editor = editorInstancesMap[editorId]

                                if (!editor) {
                                  Logger.fatal(`could not get editor instance`)
                                  return
                                }

                                let state = AbstractMachine.createNewMachineState()
                                let unit: GameUnit
                                try {
                                  unit = Simulator.compiler.parse(editor.getValue())
                                } catch (err) {
                                  Logger.fatalSyntaxError(`game init code has parse errors: ${err}`)
                                  return
                                }

                                try {
                                  for (const statement of unit.game_def_stats) {
                                    state = AbstractMachine.executeGameDefinitionStatement(statement, state)
                                  }
                                } catch (err) {
                                  Logger.fatal(`error during game setup statements: ${err}`)
                                  return
                                }

                                try {
                                  for (const statement of unit.statements) {
                                    state = AbstractMachine.executeStatement(statement, state)
                                  }
                                } catch (err) {
                                  Logger.fatal(`error during statements: ${err}`)
                                  return
                                }

                                Logger.success('All statements are valid')

                              }}
                            >
                            </IconToolTip>
                          </label>

                          <EditorWrapper
                            readony={false}
                            id={editorId}
                            mode="bbgel"
                            value={this.props.worldSettings.worldCmdText}
                            onLostFocus={(val) => this.props.set_world_worldCmdTextAction(val)}
                            height='300px'
                          />

                        </Form.Field>


                      </Form>
                    )
                  }

                },
                {
                  menuItem: `${getI18n(this.props.langId, "TilesGlobal tiles settings")}`,
                  render: () => {
                    return (
                      <Form as="div">

                        <Form.Group widths='equal'>
                          <Form.Field>
                            <Checkbox
                              label={getI18n(this.props.langId, "Always auto insert arrow heads in tile editor")}
                              checked={this.props.worldSettings.alwaysInsertArrowHeadsWhenAutoConnectingFields}
                              onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                                this.props.set_world_alwaysInsertArrowHeadsWhenAutoConnectingFields(data.checked)
                              }}
                            />
                            <IconToolTip
                              message={getI18n(this.props.langId,
                                "When auto inserting lines always insert lines(true) or just when branching (control if)")}
                            />
                          </Form.Field>
                        </Form.Group>

                        {
                          //forced field style
                        }
                        <h3 className="ui dividing header">
                          {
                            getI18n(this.props.langId, "Forced field style")
                          }
                          <IconToolTip
                            message={getI18n(this.props.langId,
                              "A forced field is a field with the command text containing the force command. The forced style has the lowes priority from all field styles.")}
                          />
                        </h3>
                        <Form.Group widths='equal'>
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Auto prepend text")}
                              <IconToolTip
                                message={getI18n(this.props.langId,
                                  "Auto prepend text")}
                              />
                            </label>
                            <Input value={this.props.worldSettings.forcedFieldAutoPrependText}

                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     this.props.set_world_forcedFieldAutoPrependText(e.currentTarget.value)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Auto border size in px")}
                            </label>
                            <Input value={this.props.worldSettings.forcedFieldAutoBorderSizeInPx}
                                   type="number"
                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseInt(e.currentTarget.value)
                                     if (isNaN(val) || val < 0) return
                                     this.props.set_world_forcedFieldAutoBorderSizeInPx(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Border color")}
                            </label>
                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.forcedFieldBorderColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_forcedFieldBorderColor(color.hex)
                                  }}
                                />}
                              />

                              <Input value={this.props.worldSettings.forcedFieldBorderColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Is font bold")} <br/>
                              {getI18n(this.props.langId, "Is font italic")}
                            </label>

                            <Button.Group>
                              <Button
                                active={this.props.worldSettings.forcedFieldIsFontBold}
                                icon
                                onClick={() => {
                                  this.props.set_world_forcedFieldIsFontBold(!this.props.worldSettings.forcedFieldIsFontBold)
                                }}
                              >
                                <Icon name='bold'/>
                              </Button>
                              <Button
                                active={this.props.worldSettings.forcedFieldIsFontItalic}
                                icon
                                onClick={() => {
                                  this.props.set_world_forcedFieldIsFontItalic(!this.props.worldSettings.forcedFieldIsFontItalic)
                                }}
                              >
                                <Icon name='italic'/>
                              </Button>
                            </Button.Group>

                          </Form.Field>


                          {
                            //color
                          }
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Font color")}
                            </label>
                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.forcedFieldColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_forcedFieldColor(color.hex)
                                  }}
                                />}
                              />

                              <div className="hoverable mar-left-half" style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                <IconToolTip
                                  message={getI18n(this.props.langId, "Transparent color")}
                                  icon="circle outline"
                                  onClick={() => {
                                    this.props.set_world_forcedFieldColor('transparent')
                                  }}
                                />
                              </div>

                              <Input value={this.props.worldSettings.forcedFieldColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>

                          {
                            //bg color
                          }
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Background color")}
                            </label>

                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.forcedFieldBgColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_forcedFieldBgColor(color.hex)
                                  }}
                                />}
                              />

                              <div className="hoverable mar-left-half" style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                <IconToolTip
                                  message={getI18n(this.props.langId, "Transparent color")}
                                  icon="circle outline"
                                  onClick={() => {
                                    this.props.set_world_forcedFieldBgColor('transparent')
                                  }}
                                />
                              </div>

                              <Input value={this.props.worldSettings.forcedFieldBgColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>


                        </Form.Group>


                        {
                          //start field style
                        }
                        <h3 className="ui dividing header">
                          {
                            getI18n(this.props.langId, "Start field style")
                          }
                          <IconToolTip
                            message={getI18n(this.props.langId,
                              "A start field is a field with the command text containing the game start command")}
                          />
                        </h3>
                        <Form.Group widths='equal'>
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Auto prepend text")}
                            </label>
                            <Input value={this.props.worldSettings.startFieldAutoPrependText}

                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     this.props.set_world_startFieldAutoPrependText(e.currentTarget.value)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Auto border size in px")}
                            </label>
                            <Input value={this.props.worldSettings.startFieldAutoBorderSizeInPx}
                                   type="number"
                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseInt(e.currentTarget.value)
                                     if (isNaN(val) || val < 0) return
                                     this.props.set_world_startFieldAutoBorderSizeInPx(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Border color")}
                            </label>
                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.startFieldBorderColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_startFieldBorderColor(color.hex)
                                  }}
                                />}
                              />

                              <Input value={this.props.worldSettings.startFieldBorderColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Is font bold")} <br/>
                              {getI18n(this.props.langId, "Is font italic")}
                            </label>

                            <Button.Group>
                              <Button
                                active={this.props.worldSettings.startFieldIsFontBold}
                                icon
                                onClick={() => {
                                  this.props.set_world_startFieldIsFontBold(!this.props.worldSettings.startFieldIsFontBold)
                                }}
                              >
                                <Icon name='bold'/>
                              </Button>
                              <Button
                                active={this.props.worldSettings.startFieldIsFontItalic}
                                icon
                                onClick={() => {
                                  this.props.set_world_startFieldIsFontItalic(!this.props.worldSettings.startFieldIsFontItalic)
                                }}
                              >
                                <Icon name='italic'/>
                              </Button>
                            </Button.Group>

                          </Form.Field>


                          {
                            //color
                          }
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Font color")}
                            </label>
                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.startFieldColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_startFieldColor(color.hex)
                                  }}
                                />}
                              />

                              <div className="hoverable mar-left-half" style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                <IconToolTip
                                  message={getI18n(this.props.langId, "Transparent color")}
                                  icon="circle outline"
                                  onClick={() => {
                                    this.props.set_world_startFieldColor('transparent')
                                  }}
                                />
                              </div>

                              <Input value={this.props.worldSettings.startFieldColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>

                          {
                            //bg color
                          }
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Background color")}
                            </label>

                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.startFieldBgColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_startFieldBgColor(color.hex)
                                  }}
                                />}
                              />

                              <div className="hoverable mar-left-half" style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                <IconToolTip
                                  message={getI18n(this.props.langId, "Transparent color")}
                                  icon="circle outline"
                                  onClick={() => {
                                    this.props.set_world_startFieldBgColor('transparent')
                                  }}
                                />
                              </div>

                              <Input value={this.props.worldSettings.startFieldBgColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>


                        </Form.Group>


                        {
                          //end field style
                        }
                        <h3 className="ui dividing header">
                          {
                            getI18n(this.props.langId, "End field style")
                          }
                          <IconToolTip
                            message={getI18n(this.props.langId,
                              "An end field is a field with the command text containing the game end command")}
                          />
                        </h3>
                        <Form.Group widths='equal'>
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Auto prepend text")}
                            </label>
                            <Input value={this.props.worldSettings.endFieldAutoPrependText}

                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     this.props.set_world_endFieldAutoPrependText(e.currentTarget.value)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Auto border size in px")}
                            </label>
                            <Input value={this.props.worldSettings.endFieldAutoBorderSizeInPx}
                                   type="number"
                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseInt(e.currentTarget.value)
                                     if (isNaN(val) || val < 0) return
                                     this.props.set_world_endFieldAutoBorderSizeInPx(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Border color")}
                            </label>
                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.endFieldBorderColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_endFieldBorderColor(color.hex)
                                  }}
                                />}
                              />

                              <Input value={this.props.worldSettings.endFieldBorderColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Is font bold")} <br/>
                              {getI18n(this.props.langId, "Is font italic")}
                            </label>

                            <Button.Group>
                              <Button
                                active={this.props.worldSettings.endFieldIsFontBold}
                                icon
                                onClick={() => {
                                  this.props.set_world_endFieldIsFontBold(!this.props.worldSettings.endFieldIsFontBold)
                                }}
                              >
                                <Icon name='bold'/>
                              </Button>
                              <Button
                                active={this.props.worldSettings.endFieldIsFontItalic}
                                icon
                                onClick={() => {
                                  this.props.set_world_endFieldIsFontItalic(!this.props.worldSettings.endFieldIsFontItalic)
                                }}
                              >
                                <Icon name='italic'/>
                              </Button>
                            </Button.Group>

                          </Form.Field>


                          {
                            //color
                          }
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Font color")}
                            </label>
                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.endFieldColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_endFieldColor(color.hex)
                                  }}
                                />}
                              />

                              <div className="hoverable mar-left-half" style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                <IconToolTip
                                  message={getI18n(this.props.langId, "Transparent color")}
                                  icon="circle outline"
                                  onClick={() => {
                                    this.props.set_world_endFieldColor('transparent')
                                  }}
                                />
                              </div>

                              <Input value={this.props.worldSettings.endFieldColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>

                          {
                            //bg color
                          }
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Background color")}
                            </label>

                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.endFieldBgColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_endFieldBgColor(color.hex)
                                  }}
                                />}
                              />

                              <div className="hoverable mar-left-half" style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                <IconToolTip
                                  message={getI18n(this.props.langId, "Transparent color")}
                                  icon="circle outline"
                                  onClick={() => {
                                    this.props.set_world_endFieldBgColor('transparent')
                                  }}
                                />
                              </div>

                              <Input value={this.props.worldSettings.endFieldBgColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>


                        </Form.Group>

                        {
                          //branch if field style
                        }
                        <h3 className="ui dividing header">
                          {
                            getI18n(this.props.langId, "Branch if field style")
                          }
                          <IconToolTip
                            message={getI18n(this.props.langId,
                              "A branch if field is a field with the command text containing the control if command")}
                          />
                        </h3>
                        <Form.Group widths='equal'>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Auto prepend text")}
                            </label>
                            <Input value={this.props.worldSettings.branchIfPrependText}

                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     this.props.set_world_branchIfPrependText(e.currentTarget.value)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Auto border size in px")}
                            </label>
                            <Input value={this.props.worldSettings.branchIfAutoBorderSizeInPx}
                                   type="number"
                                   style={{width: '100px'}}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseInt(e.currentTarget.value)
                                     if (isNaN(val) || val < 0) return
                                     this.props.set_world_branchIfAutoBorderSizeInPx(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Border color")}
                            </label>
                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.branchIfBorderColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_branchIfBorderColor(color.hex)
                                  }}
                                />}
                              />

                              <Input value={this.props.worldSettings.branchIfBorderColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>

                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Is font bold")} <br/>
                              {getI18n(this.props.langId, "Is font italic")}
                            </label>

                            <Button.Group>
                              <Button
                                active={this.props.worldSettings.branchIfIsFontBold}
                                icon
                                onClick={() => {
                                  this.props.set_world_branchIfIsFontBold(!this.props.worldSettings.branchIfIsFontBold)
                                }}
                              >
                                <Icon name='bold'/>
                              </Button>
                              <Button
                                active={this.props.worldSettings.branchIfIsFontItalic}
                                icon
                                onClick={() => {
                                  this.props.set_world_branchIfIsFontItalic(!this.props.worldSettings.branchIfIsFontItalic)
                                }}
                              >
                                <Icon name='italic'/>
                              </Button>
                            </Button.Group>

                          </Form.Field>


                          {
                            //color
                          }
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Font color")}
                            </label>

                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.branchIfColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_branchIfColor(color.hex)
                                  }}
                                />}
                              />

                              <div className="hoverable mar-left-half" style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                <IconToolTip
                                  message={getI18n(this.props.langId, "Transparent color")}
                                  icon="circle outline"
                                  onClick={() => {
                                    this.props.set_world_branchIfColor('transparent')
                                  }}
                                />
                              </div>

                              <Input value={this.props.worldSettings.branchIfColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>

                          {
                            //bg color
                          }
                          <Form.Field>
                            <label>
                              {getI18n(this.props.langId, "Background color")}
                            </label>
                            <div className="flexed">
                              <Popup
                                trigger={<div className="hoverable" style={{margin: 'auto 0'}}>
                                  <Icon style={{
                                    'color': 'black'
                                  }} name="paint brush"/>
                                </div>}
                                on="click"
                                offset={horizontalIconPopupOffsetInPx}
                                content={<ChromePicker
                                  color={this.props.worldSettings.branchIfBgColor}
                                  onChangeComplete={color => {
                                    this.props.set_world_branchIfBgColor(color.hex)
                                  }}
                                />}
                              />

                              <div className="hoverable mar-left-half" style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                <IconToolTip
                                  message={getI18n(this.props.langId, "Transparent color")}
                                  icon="circle outline"
                                  onClick={() => {
                                    this.props.set_world_branchIfBgColor('transparent')
                                  }}
                                />
                              </div>

                              <Input value={this.props.worldSettings.branchIfBgColor}
                                     type="text"
                                     style={{width: '100px'}}
                                     disabled
                              />
                            </div>
                          </Form.Field>

                        </Form.Group>


                      </Form>
                    )
                  }

                },
                {
                  menuItem: `${getI18n(this.props.langId, "Simulation")}`,
                  render: () => {
                    return (
                      <Form as="div" className={this.props.simulationState.machineState !== null ? 'div-disabled' : ''}>

                        <h3>{getI18n(this.props.langId, "Time in seconds needed to...")}</h3>

                        <Form.Group widths='equal'>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Roll the dice")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_rollDice_default}
                                   value={this.props.worldSettings.timeInS_rollDice} step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_rollDiceAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Choose a bool (choose_bool)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_choose_bool_func_default}
                                   value={this.props.worldSettings.timeInS_choose_bool_func}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_choose_bool_funcAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Execute a goto")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_goto_default}
                                   value={this.props.worldSettings.timeInS_goto} step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_gotoAction(val)
                                   }}
                            />
                          </Form.Field>

                        </Form.Group>

                        <Form.Group widths='equal'>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Set a variable to a new value")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_set_var_default}
                                   value={this.props.worldSettings.timeInS_set_var} step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_set_varAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId,
                              "Set the next player (e.g. finish the round/give him the dice)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_advancePlayer_default}
                                   value={this.props.worldSettings.timeInS_advancePlayer}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_advancePlayerAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Rollback the current turn (rollback)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_rollback_default}
                                   value={this.props.worldSettings.timeInS_rollback} step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_rollbackAction(val)
                                   }}
                            />
                          </Form.Field>

                        </Form.Group>

                        <Form.Group widths='equal'>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Define and set a new variable")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_var_decl_default}
                                   value={this.props.worldSettings.timeInS_var_decl} step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_var_declAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Get the left dice value (expr)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_expr_primary_leftSteps_default}
                                   value={this.props.worldSettings.timeInS_expr_primary_leftSteps}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_primary_leftStepsAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Create a constant (expr)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_expr_primary_constant_default}
                                   value={this.props.worldSettings.timeInS_expr_primary_constant}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_primary_constantAction(val)
                                   }}
                            />
                          </Form.Field>

                        </Form.Group>

                        <Form.Group widths='equal'>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Get a variable value (expr)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_expr_primary_ident_default}
                                   value={this.props.worldSettings.timeInS_expr_primary_ident}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_primary_identAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Increment/Decrement a variable (expr)")}</label>
                            <Input type="number"
                                   placeholder={SimulationTimes.timeInS_expr_primary_incrementOrDecrement_default}
                                   value={this.props.worldSettings.timeInS_expr_primary_incrementOrDecrement}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_primary_incrementOrDecrementAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Calculate or (expr)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_expr_disjunction_default}
                                   value={this.props.worldSettings.timeInS_expr_disjunction}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_disjunctionAction(val)
                                   }}
                            />
                          </Form.Field>

                        </Form.Group>

                        <Form.Group widths='equal'>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Calculate and (expr)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_expr_conjunction_default}
                                   value={this.props.worldSettings.timeInS_expr_conjunction}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_conjunctionAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Calculate a comparison (==, !=) (expr)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_expr_comparison_default}
                                   value={this.props.worldSettings.timeInS_expr_comparison}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_comparisonAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label dangerouslySetInnerHTML={getRawI18n(this.props.langId,
                              "Calculate a relation (>,<, <=, >=) (expr)")}></label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_expr_relation_default}
                                   value={this.props.worldSettings.timeInS_expr_relation}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_relationAction(val)
                                   }}
                            />
                          </Form.Field>

                        </Form.Group>

                        <Form.Group widths='equal'>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Calculate a sum (expr)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_expr_sum_default}
                                   value={this.props.worldSettings.timeInS_expr_sum} step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_sumAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId, "Calculate a term (*,/,%) (expr)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_expr_term_default}
                                   value={this.props.worldSettings.timeInS_expr_term} step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_termAction(val)
                                   }}
                            />
                          </Form.Field>

                          <Form.Field>
                            <label>{getI18n(this.props.langId,
                              "Calculate a factor (unary -, unary +, not) (expr)")}</label>
                            <Input type="number" placeholder={SimulationTimes.timeInS_expr_factor_default}
                                   value={this.props.worldSettings.timeInS_expr_factor}
                                   step={defaultSimulationTimeInc}

                                   style={inputSimulationTimeStyle}
                                   onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                     const val = parseFloat(e.currentTarget.value)
                                     if (isNaN(val)) return

                                     this.props.set_world_timeInS_expr_factorAction(val)
                                   }}
                            />
                          </Form.Field>

                        </Form.Group>

                      </Form>

                    )
                  }
                }
              ]}/>
            </div>

          </Modal.Content>
        </Modal>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(worldEditorSettingsModal)
