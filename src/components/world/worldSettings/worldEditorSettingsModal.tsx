import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state/index";
import {CSSProperties, SyntheticEvent} from "react";
import {Button, Input, Form, Icon, Modal, Checkbox, Tab} from "semantic-ui-react";
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
  set_world_printScale, set_world_additionalBorderWidthInPx

} from "../../../state/reducers/world/worldSettings/actions";
import {
  set_world_isWorldSettingsModalDisplayed
} from "../../../state/reducers/world/actions";
import {getI18n, getRawI18n} from "../../../../i18n/i18nRoot";
import {CheckboxData} from "../../../types/ui";
import IconToolTip from "../../helpers/IconToolTip";
import ToolTip from "../../helpers/ToolTip";
import {AbstractMachine, SimulationTimes} from "../../../../simulation/machine/AbstractMachine";
import EditorWrapper, {editorInstancesMap} from '../../helpers/editorWrapper'
import {Simulator} from "../../../../simulation/simulator";
import {Logger} from "../../../helpers/logger";
import {GameUnit} from "../../../../simulation/model/executionUnit";
import {DialogHelper} from "../../../helpers/dialogHelper";

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

                            <Input type="number" placeholder='1' value={this.props.worldSettings.additionalBorderWidthInPx}
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
                            <label>{getI18n(this.props.langId, "Calulcate or (expr)")}</label>
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
                            <label>{getI18n(this.props.langId, "Calulcate and (expr)")}</label>
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
                            <label>{getI18n(this.props.langId, "Calulcate a comparison (==, !=) (expr)")}</label>
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
                              "Calulcate a relation (>,<, <=, >=) (expr)")}></label>
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
                            <label>{getI18n(this.props.langId, "Calulcate a sum (expr)")}</label>
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
                            <label>{getI18n(this.props.langId, "Calulcate a term (*,/,%) (expr)")}</label>
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
                              "Calulcate a factor (unary -, unary +, not) (expr)")}</label>
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
