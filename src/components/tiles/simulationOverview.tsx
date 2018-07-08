import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Button, Divider, Form, Icon, Input, Table} from "semantic-ui-react";
import {
  DefinitionTable,
  DefinitionTableBoolEntry,
  DefinitionTableIntEntry,
  isBoolVar,
  isIntVar, MachineState, WorldTileSurrogate
} from "../../../simulation/machine/machineState";
import {StringHelper} from "../../helpers/stringHelper";
import {Simulator} from "../../../simulation/simulator";
import {Tile} from "../../types/world";
import {Logger} from "../../helpers/logger";
import {SimulationResult} from "../../state/reducers/tileEditor/tileEditorReducer";


import Worker = require("worker-loader!../../helpers/workers/simulation.worker")
import {SimulationStatus, WorkerInputData, WorkerOutData} from "../../types/states";
import {
  set_simulation_maxTotalStepsPerSimulation,
  set_simulation_numOfSimulationResultsToWaitForBeforeSending,
  set_simulation_numOfSimulationsToRun, set_simulation_randomSeedAction,
  set_simulation_simulationResults, set_simulation_simulationSpeedInDelayInMsBetweenSteps,
  set_simulation_simulationStatus
} from "../../state/reducers/simulation/actions";
import {getI18n, KnownLangs} from "../../../i18n/i18nRoot";
import IconToolTip from '../helpers/IconToolTip'

//const css = require('./styles.styl');

export interface MyProps {
  /**
   * title ... this overview can be used for single (tile editor) or multi tile (world editor) simulations
   */
  readonly title: string

  readonly tiles: ReadonlyArray<Tile>
  readonly tileSurrogates: ReadonlyArray<WorldTileSurrogate> | null
  readonly gameInitCmdText: string

  /**
   * true: use the tile props for end & start fields in addition to the normal commands
   * false: not
   */
  readonly isSingleSimulation: boolean

  readonly className?: string
}

const mapStateToProps = (rootState: RootState, props: MyProps) => {
  return {
    //test0: rootState...
    //test: props.test
    ...props,

    simulationState: rootState.simulationState,
    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_simulation_simulationResults,
  set_simulation_simulationStatus,
  set_simulation_numOfSimulationsToRun,
  set_simulation_simulationSpeedInDelayInMsBetweenSteps,
  set_simulation_numOfSimulationResultsToWaitForBeforeSending,
  set_simulation_maxTotalStepsPerSimulation,

  set_simulation_randomSeedAction,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


let worker: Worker | null = null;


const maxSimulationResultsToShowInTable = 5

//only 1 simulation can be running (single/multi tile simulation)

class simulationOverview extends React.Component<Props, any> {

  componentWillUnmount(): void {
    //if we change the tab (e.g. properties) this would terminate the thread...
    //let the worker terminate itself or use pause/stop buttons
    // if (worker) {
    //   worker.terminate()
    // }
  }

  onWorkerOutput(e: MessageEvent): void {

    const data = e.data as ReadonlyArray<WorkerOutData>

    const results = data.map<SimulationResult>(p => {
      return {
        runNumber: p.runNumber,
        elapsedTime: p.state !== null ? p.state.elapsedTimeInS : -1,
        winnerIds: p.state !== null ? p.state.winnersIds : [],
        error: p.error
      }
    })

    this.props.set_simulation_simulationResults(this.props.simulationState.simulationResults.concat(results))

    if (results[results.length - 1].runNumber === this.props.simulationState.numOfSimulationsToRun) {
      this.props.set_simulation_simulationStatus(SimulationStatus.finished, null)
    }
  }

  onWorkerError(e: ErrorEvent): void {
    Logger.log('worker error', e)
  }

  render(): JSX.Element {


    let errorResults: SimulationResult[] = []
    let notErrorResults: SimulationResult[] = []

    if (this.props.simulationState.simulationResults.length > 0) {


      for (const result of this.props.simulationState.simulationResults) {
        if (result.error !== null) {
          errorResults.push(result)
        }
        else {
          notErrorResults.push(result)
        }
      }
    }


    return (

      <div className={this.props.className}>

        <Form as="div">
          <Form.Field>
            <label>{getI18n(this.props.langId, "Random seed number")}
              <IconToolTip message={getI18n(this.props.langId,
                "You can specify a random seed (a number). Every simulations initializes a random generator. If you specify the same number every simulation run will generate the same sequence of random numbers. For multiple simulations the random generator is only initialized at once. E.g. if you set the seed to 100 and then start the simulation your dice values will be e.g. 5, 3, 2, 6. If you start the simulation again and the seed is still set to 100 then the dice values will be the same (in the same order). If you don't specify a seed you will get different dice values every run.")}
                          wide="very"
              />
            </label>
            <Input
              style={{width: '200px'}}
              value={this.props.simulationState.randomSeed === null ? '' : this.props.simulationState.randomSeed.toString()}
              type="number"
              max={1000000}
              min={0}
              label={
                <Button icon onClick={() => {
                  this.props.set_simulation_randomSeedAction(null)

                }}>
                  <Icon name="trash"/>
                </Button>
              }
              labelPosition='right'
              onChange={(e) => {

                const seed = parseInt(e.currentTarget.value)
                if (isNaN(seed)) return
                this.props.set_simulation_randomSeedAction(seed)
              }}
            />
          </Form.Field>
        </Form>

        <h2>
          {
            getI18n(this.props.langId, "Many simulations")
          }
        </h2>

        <div>
          <Form as="div">

            <Form.Field>
              <label>
                {
                  getI18n(this.props.langId, "Max total steps per simulation")
                }
                <IconToolTip message={getI18n(this.props.langId,
                  "The max steps for the simulation (in total over all players). After we exceed this value an error is thrown. This is useful if the game has an infinite loop")}/>
              </label>
              <input style={{width: '150px'}}
                     type="number"
                     disabled={this.props.simulationState.simulationStatus === SimulationStatus.paused ||
                     this.props.simulationState.simulationStatus === SimulationStatus.running_many ||
                     this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused
                     }
                     value={this.props.simulationState.maxTotalStepsPerSimulation}
                     placeholder='1000'
                     onChange={(e) => {
                       const val = parseInt(e.currentTarget.value)
                       if (isNaN(val)) return

                       if (val <= 0) {
                         Logger.log('max total steps per simulation cannot be below 0')
                         return
                       }

                       this.props.set_simulation_maxTotalStepsPerSimulation(val)
                     }}
              />
            </Form.Field>

            <Form.Field>
              <label>
                {
                  getI18n(this.props.langId, "Run X simulations automatic")
                }
                <IconToolTip message={getI18n(this.props.langId,
                  "The simulation will be run X times in a separate thread and the results are added to the statistic")}/>
              </label>
              <input style={{width: '150px'}}
                     type="number"
                     disabled={this.props.simulationState.simulationStatus === SimulationStatus.paused ||
                     this.props.simulationState.simulationStatus === SimulationStatus.running_many ||
                     this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused
                     }
                     value={this.props.simulationState.numOfSimulationsToRun}
                     placeholder='1'
                     onChange={(e) => {
                       const val = parseInt(e.currentTarget.value)
                       if (isNaN(val)) return

                       if (val <= 0) {
                         Logger.log('run X simulations cannot be below 0')
                         return
                       }

                       this.props.set_simulation_numOfSimulationsToRun(val)
                     }}
              />

              {
                (this.props.simulationState.simulationStatus === null || this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused || this.props.simulationState.simulationStatus === SimulationStatus.finished) &&
                <Button icon
                        onClick={async () => {


                          //parse all fields and find syntax errors & some semantic errors
                          Simulator.parseAllFields(this.props.gameInitCmdText, this.props.tiles,
                            true,
                            true,
                            this.props.isSingleSimulation,
                            this.props.isSingleSimulation
                          )

                          const startPos = Simulator.getStartFieldPosition(this.props.tiles,
                            this.props.isSingleSimulation)

                          //should already be checked by parse all fields but ... why not check again
                          if (!startPos) {
                            Logger.fatal('no start field found')
                            return
                          }

                          let runs = 0
                          let startState: MachineState = null

                          if (this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused) {
                            //resume
                            startState = Simulator.initNew(startPos, true, this.props.gameInitCmdText)
                            runs = this.props.simulationState.simulationResults.length
                            this.props.set_simulation_simulationStatus(SimulationStatus.running_many, null)
                          } else {
                            startState = Simulator.initNew(startPos, true, this.props.gameInitCmdText)
                            this.props.set_simulation_simulationStatus(SimulationStatus.running_many, null)
                            this.props.set_simulation_simulationResults([])
                          }

                          const workerInputData: WorkerInputData = {
                            startState: startState,
                            tileSurrogates: this.props.tileSurrogates,
                            runNumber: runs,
                            numOfSimulationsToRun: this.props.simulationState.numOfSimulationsToRun,
                            startPos: startPos,
                            tiles: this.props.tiles,
                            maxMovesPerSimulation: this.props.simulationState.maxTotalStepsPerSimulation,
                            numOfResultsToSendAtOnce: this.props.simulationState.numOfSimulationResultsToWaitForBeforeSending,
                            isSingleTileSimulation: this.props.isSingleSimulation,
                            randomSeed: this.props.simulationState.randomSeed
                          }

                          worker = new Worker();
                          worker.removeEventListener('message', this.onWorkerOutput)
                          worker.addEventListener('message', this.onWorkerOutput.bind(this))

                          worker.removeEventListener('error', this.onWorkerError)
                          worker.addEventListener('error', this.onWorkerError.bind(this))

                          worker.postMessage(workerInputData)

                        }}
                >
                  <Icon name="play"/>
                </Button>
              }

              {
                this.props.simulationState.simulationStatus === SimulationStatus.running_many &&
                <Button icon
                        onClick={() => {
                          if (worker) {
                            worker.terminate()
                          }
                          //pausing will discard the current simulation run but keep the old results
                          this.props.set_simulation_simulationStatus(SimulationStatus.running_many_paused, null)
                        }}
                >
                  <Icon name="pause"/>
                </Button>
              }

              {
                (this.props.simulationState.simulationStatus === SimulationStatus.running_many || this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused) &&
                <Button icon
                        onClick={() => {

                          if (worker) {
                            worker.terminate()
                          }

                          //also clear results? yes for now to have the same behavior as the normal simulation end button
                          this.props.set_simulation_simulationResults([])
                          this.props.set_simulation_simulationStatus(null, null)
                        }}
                >
                  <Icon name="stop"/>
                </Button>
              }

            </Form.Field>

            <Form.Field>
              <label>
                {
                  getI18n(this.props.langId, "Update ui after X results")
                }
                <IconToolTip message={getI18n(this.props.langId,
                  "Updating the ui is costly (performance wise) so update the ui after X simulations have finished")}/>
              </label>
              <input style={{width: '150px'}}
                     type="number"
                     disabled={this.props.simulationState.simulationStatus === SimulationStatus.paused ||
                     this.props.simulationState.simulationStatus === SimulationStatus.running_many ||
                     this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused
                     }
                     value={this.props.simulationState.numOfSimulationResultsToWaitForBeforeSending}
                     placeholder='10'
                     onChange={(e) => {
                       const val = parseInt(e.currentTarget.value)
                       if (isNaN(val)) return

                       this.props.set_simulation_numOfSimulationResultsToWaitForBeforeSending(val)
                     }}
              />
            </Form.Field>

          </Form>

          {
            //simulation results
            this.props.simulationState.simulationResults.length > 0 &&
            <div style={{marginTop: '1em'}}>

              {
                //the user can click on end simulation...
              }
              {/*<Button icon labelPosition='left'*/}
              {/*disabled={this.props.simulationState.simulationStatus === SimulationStatus.paused ||*/}
              {/*this.props.simulationState.simulationStatus === SimulationStatus.running_many ||*/}
              {/*this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused}*/}
              {/*onClick={() => {*/}
              {/*this.props.set_simulation_simulationResults([])*/}
              {/*}}*/}
              {/*>*/}
              {/*<Icon name="trash"/>*/}
              {/*Clear result list*/}
              {/*</Button>*/}

              {
                getSimulationResultsTable(this.props.simulationState.simulationResults,
                  maxSimulationResultsToShowInTable,
                  this.props.simulationState.numOfSimulationsToRun)
              }

              {
                //only display if we simulate many and if we not finished yet
                this.props.simulationState.simulationResults.length !== this.props.simulationState.numOfSimulationsToRun &&
                this.props.simulationState.machineState === null && this.props.simulationState.simulationStatus !== null && this.props.simulationState.simulationStatus !== SimulationStatus.finished &&
                <div style={{margin: '1em'}}>
                  {this.props.simulationState.simulationResults.length * 100 / this.props.simulationState.numOfSimulationsToRun}%
                  done

                </div>
              }


              <div style={{margin: '1em'}}>
                <Icon name="chevron circle up"/>
                <span>
                  {
                    getI18n(this.props.langId, "Max elapsed time")
                  }
                  :
                  {
                    getElapsedTimeString(
                      Math.floor(Math.max(...notErrorResults.map(p => p.elapsedTime))))
                  }
               </span>
              </div>
              <div style={{margin: '1em'}}>
                <Icon name="chevron circle down"/>
                <span>
                  {
                    getI18n(this.props.langId, "Min elapsed time")
                  }
                  :
                  {
                    getElapsedTimeString(
                      Math.floor(Math.min(...notErrorResults.map(p => p.elapsedTime))))
                  }
               </span>
              </div>
              <div style={{margin: '1em'}}>
                <Icon name="chevron circle right"/>
                <span>
                  {
                    getI18n(this.props.langId, "Average elapsed time")
                  }
                  :
                  {
                    getElapsedTimeString(
                      Math.floor(notErrorResults.reduce((p, c) => p + c.elapsedTime,
                        0) / notErrorResults.length))
                  }
                </span>
              </div>

              {
                errorResults.length > 0 &&
                <div style={{margin: '1em'}}>
                  <Icon name="bug"/>
                  <span>
                    {
                      getI18n(this.props.langId, "Number of error runs")
                    }
                    :
                    {
                      errorResults.length
                    }
                </span>
                </div>
              }

              {
                errorResults.length > 0 &&
                <div className="error-colored" style={{margin: '1em'}}>
                <span>
                  {
                    getI18n(this.props.langId, "Last error")
                  }
                  : {
                  errorResults[errorResults.length - 1].error
                }
                </span>
                </div>
              }


            </div>
          }

        </div>


        <Divider/>

        <h2>
          {
            getI18n(this.props.langId, "Single simulation")
          }
        </h2>

        {
          //for single simulations
        }

        <Form as="div">
          <Form.Field>
            <label>
              {
                getI18n(this.props.langId, "Speed in ms delay per step")
              }
              <IconToolTip message={getI18n(this.props.langId,
                "One step is taken then we pause for delay ms and then take the next step. This is only done for automatic single simulations")}/>
            </label>
            <input value={this.props.simulationState.simulationSpeedInDelayInMsBetweenSteps} min={10} max={2000}
                   type="number"
                   onChange={(e) => {
                     const val = parseInt(e.currentTarget.value)

                     if (isNaN(val)) {
                       return
                     }
                     this.props.set_simulation_simulationSpeedInDelayInMsBetweenSteps(Math.min(Math.max(val, 10), 2000))
                   }}
            />
          </Form.Field>
        </Form>


        {
          this.props.simulationState.machineState === null &&
          <div style={{margin: '1em'}}>
            {
              getI18n(this.props.langId, "No single simulation is running")
            }
          </div>
        }

        {
          this.props.simulationState.machineState !== null &&
          <div style={{margin: '1em'}}>
            calculated elapsed time: {getElapsedTimeString(
            Math.floor(this.props.simulationState.machineState.elapsedTimeInS))}
          </div>
        }

        {
          this.props.simulationState.machineState !== null &&
          <div>
            <Form as="div">
              <Form.Group widths='equal'>
                <Form.Field>
                  <label>
                    {
                      getI18n(this.props.langId, "Rolled dice value")
                    }
                  </label>
                  <input value={this.props.simulationState.machineState.rolledDiceValue} disabled/>
                </Form.Field>

                <Form.Field>
                  <label>
                    {
                      getI18n(this.props.langId, "Left moves")
                    }
                  </label>
                  <input value={this.props.simulationState.machineState.leftDiceValue} disabled/>
                </Form.Field>
              </Form.Group>


              <div className="flexed-h">
                {
                  this.props.simulationState.machineState.players.map((player, index) => {
                    return (
                      <div key={index}>
                        <div
                          className={index === this.props.simulationState.machineState.currentPlayerIndex ? 'active-player' : ''}>
                          <Icon name="user" style={{color: player.color}}/>
                          <span>{getI18n(this.props.langId, "Player")} {index}</span>

                          {
                            player.suspendCounter !== 0 &&
                            <span>
                              {'('}
                              {getI18n(this.props.langId, "suspends for next")}: {player.suspendCounter} {getI18n(
                              this.props.langId, "Round(s)")}
                              {')'}
                            </span>
                          }
                        </div>

                        <div className="flexed">

                          {
                            player.tokens.map((token, i) => {
                              return (
                                <div key={i}
                                     className={[
                                       index === this.props.simulationState.machineState.currentPlayerIndex &&
                                       i === this.props.simulationState.machineState.currentPlayerActiveTokenIndex
                                         ? 'active-player' : '', 'mar-right-half'].join(' ')}>
                                  <Icon name="user" style={{color: player.color}}/>
                                  <span>{getI18n(this.props.langId, "Token")} {i}</span>
                                </div>
                              )
                            })
                          }
                        </div>

                        <h3>{getI18n(this.props.langId, "Player variables")}</h3>
                        <div>
                          {
                            getVarTable(player.defTable, this.props.langId)
                          }
                        </div>

                        {
                          player.localDefTables.map((localDefTable, localDefTableIndex) => {
                            return (
                              <div key={`${player.id}-${localDefTableIndex}`}>
                                <h3>{getI18n(this.props.langId, "Player local variables in scope level")} {localDefTableIndex}</h3>
                                {
                                  localDefTable.isScopeLimited &&
                                  <span>{getI18n(this.props.langId, "Scope is limited")}</span>
                                }
                                <div>
                                  {
                                    getVarTable(localDefTable.defTable, this.props.langId)
                                  }
                                </div>
                              </div>
                            )
                          })
                        }

                        <Divider/>

                      </div>
                    )
                  })
                }
              </div>


              <Divider/>
              <h3>{getI18n(this.props.langId, "Global variables")}</h3>
              {
                getVarTable(this.props.simulationState.machineState.globalDefTable, this.props.langId)
              }


            </Form>
          </div>
        }


      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(simulationOverview)

function getElapsedTimeString(elapsedSeconds: number): string {

  let hours = Math.floor(elapsedSeconds / 3600)
  let leftHourSeconds = elapsedSeconds % 3600

  let minutes = Math.floor(leftHourSeconds / 60)

  let leftSeconds = leftHourSeconds % 60

  return `${StringHelper.padLeft(hours.toString(), '0', 2) }` +
    `:${StringHelper.padLeft(minutes.toString(), '0', 2)}` +
    `:${StringHelper.padLeft(leftSeconds.toString(), '0', 2)}`

}

function getVarTable(defTable: DefinitionTable, langId: KnownLangs): JSX.Element {

  const varList: ReadonlyArray<DefinitionTableBoolEntry | DefinitionTableIntEntry> =
    Object.keys(defTable).map(key => defTable[key])

  return (
    <Table basic='very' celled collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{getI18n(langId, "Var")}</Table.HeaderCell>
          <Table.HeaderCell>{getI18n(langId, "Value")}</Table.HeaderCell>
          <Table.HeaderCell>{getI18n(langId, "Type")}</Table.HeaderCell>
          <Table.HeaderCell>{getI18n(langId, "Range")}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          varList.map((value, index) => {
            return (
              <Table.Row key={value.ident}>
                <Table.Cell>
                  {
                    <span>
                                {value.ident}
                              </span>
                  }
                </Table.Cell>
                <Table.Cell>
                  {
                    isBoolVar(value) &&
                    <span>
                                {value.boolVal ? 'true' : 'false'}
                              </span>
                  }
                  {
                    isIntVar(value) &&
                    <span>
                                {value.val}
                              </span>
                  }
                </Table.Cell>
                <Table.Cell>
                  {
                    isBoolVar(value) &&
                    <span>
                                bool
                              </span>
                  }
                  {
                    isIntVar(value) &&
                    <span>
                                int
                              </span>
                  }
                </Table.Cell>
                <Table.Cell>
                  {
                    isBoolVar(value) &&
                    <span>
                                -
                              </span>
                  }
                  {
                    isIntVar(value) &&
                    <span>
                                from: {-(value.maxVal + 1)} to : {value.maxVal}
                              </span>
                  }
                </Table.Cell>
              </Table.Row>
            )
          })
        }
      </Table.Body>
    </Table>
  )

}


function getSimulationResultsTable(simulationResults: ReadonlyArray<SimulationResult>, maxEntries: number, maxNumOfRuns: number): JSX.Element {


  const list = simulationResults.filter((value, index) => index < maxEntries)

  return (
    <Table basic='very' celled collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>#</Table.HeaderCell>
          <Table.HeaderCell>player won</Table.HeaderCell>
          <Table.HeaderCell>elapsed time</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          list.map((value, index) => {
            return (
              <Table.Row key={value.runNumber}>
                <Table.Cell>
                  {
                    <span>
                      {value.runNumber}
                    </span>
                  }
                </Table.Cell>
                <Table.Cell>
                  <span>
                    {
                      value.winnerIds[0]
                    }
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span>
                    {
                      getElapsedTimeString(value.elapsedTime)
                    }
                  </span>
                </Table.Cell>
              </Table.Row>
            )
          })
        }
        {
          list.length != simulationResults.length &&
          <Table.Row key={-1}>
            <Table.Cell>
              {
                <span>
                  {
                    simulationResults[simulationResults.length - 1].runNumber
                  }
                </span>
              }
            </Table.Cell>
            <Table.Cell>
                  <span>
                    ...
                  </span>
            </Table.Cell>
            <Table.Cell>
                  <span>
                   ...
                  </span>
            </Table.Cell>
          </Table.Row>
        }
      </Table.Body>
    </Table>
  )
}