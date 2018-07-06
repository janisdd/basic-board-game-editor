import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {SimulationStatus} from "../../types/states";
import {Logger} from "../../helpers/logger";
import {Tile} from "../../types/world";
import {Simulator} from "../../../simulation/simulator";
import {MachineState, WorldTileSurrogate} from "../../../simulation/machine/machineState";
import {RootState} from "../../state";
import {Button, Icon} from "semantic-ui-react";
import {
  set_simulation_maxTotalStepsPerSimulation,
  set_simulation_numOfSimulationResultsToWaitForBeforeSending,
  set_simulation_numOfSimulationsToRun,
  set_simulation_simulationResults,
  set_simulation_simulationSpeedInDelayInMsBetweenSteps,
  set_simulation_simulationStatus
} from "../../state/reducers/simulation/actions";
import ToolTip from '../helpers/ToolTip'
import {getI18n} from "../../../i18n/i18nRoot";
import {AbstractMachine} from "../../../simulation/machine/AbstractMachine";
import * as mousetrap from "mousetrap";


export interface MyProps {
  //readonly test: string

  readonly tiles: ReadonlyArray<Tile>

  readonly tileSurrogates: ReadonlyArray<WorldTileSurrogate> | null
  readonly gameInitCmdText: string

  /**
   * true: use the tile props for end & start fields in addition to the normal commands
   * false: not
   */
  readonly isSingleSimulation: boolean

  readonly className?: string;
}

const mapStateToProps = (rootState: RootState, props: MyProps) => {
  return {
    //test0: rootState...
    //test: props.test
    ...props,
    simulationState: rootState.simulationState,
    langId: rootState.i18nState.langId
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

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class controlSimulationBar extends React.Component<Props, any> {

  componentDidMount() {
    mousetrap.bind(['f10'], this.do1SimulationStep.bind(this))
  }

  componentWillUnmount() {
    mousetrap.unbind(['f10'])
  }

  //in own method for shortcut
  do1SimulationStep() {

    if (this.props.simulationState.simulationStatus === null || this.props.simulationState.simulationStatus === SimulationStatus.running || this.props.simulationState.simulationStatus === SimulationStatus.finished || this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused || this.props.simulationState.simulationStatus === SimulationStatus.running_many) {
      return
    }

    const startPos = Simulator.getStartFieldPosition(this.props.tiles, this.props.isSingleSimulation)

    if (startPos === null) {
      Logger.fatal('could not find start field')
      throw new Error()
    }

    let state = this.props.simulationState.machineState

    if (state === null) {
      Logger.fatal('state was null')
      throw new Error()
    }

    if (state.leftDiceValue === 0) {
      //round is finished...
      //next player round

      const res = Simulator.startNextRound(state)
      state = res.state

      if (res.currentPlayerSuspended) {
        Logger.log(`player ${state.currentPlayerIndex} suspends`)

        state = Simulator.endRound(state)
        this.props.set_simulation_simulationStatus(SimulationStatus.paused, state)

        return
      }

      //Logger.log('dice: ', state.rolledDiceValue)

    }

    const token = state.players[state.currentPlayerIndex].tokens[state.currentPlayerActiveTokenIndex]

    //--- move phase

    //this sets the player token to the start pos or execute the first found control statement
    //to set it to the next field
    //this also handles the tile transitions
    const moveResult = Simulator.moveToken(this.props.tiles, this.props.tileSurrogates, state, startPos)
    state = moveResult.state

    //the player token is now on a new field... he could have won
    if (moveResult.hasCurrentPlayerWon || Simulator.currentPlayerHasWon(state)) {
      Logger.message(`player ${state.currentPlayerIndex} has won!`, 'Game over')
      this.props.set_simulation_simulationStatus(SimulationStatus.finished, state)
      return
    }

    try {
      //when we get on the field execute the force statement immediately
      //here we also check if the current player is on an END field (and has won)
      const forceExecuteResult = Simulator.executeForceStatements(this.props.tiles, state,
        this.props.isSingleSimulation)
      state = forceExecuteResult.state

      if (forceExecuteResult.hasCurrentPlayerWon || Simulator.currentPlayerHasWon(state)) {
        Logger.message(`player ${state.currentPlayerIndex} has won!`, 'Game over')
        this.props.set_simulation_simulationStatus(SimulationStatus.finished, state)
        return
      }
    } catch (err) {
      //in case an evaluation error occurred
      const tile = this.props.tiles.find(p => p.guid === token.tileGuid)

      if (!tile) {
        Logger.fatal(`tile with guid ${token.tileGuid} was not found`)
        throw new Error()
      }

      Logger.fatal(`error on field after field with id: '${token.fieldId}', on tile '${token.tileGuid}' (${tile.displayName}), error: ${err.message}`)
    }


    //--- check player round end phase

    if (state.leftDiceValue === 0) {

      //if we rolled back don't execute the field again because here we started off
      if (state.wasStateRolledBack === true) {

        state = Simulator.endRound(state)
      }
      else {

        try {
          //the player stopped and we need to execute the fields command we landed on
          state = Simulator.executeCodeOnCurrentField(this.props.tiles, state)
        } catch (err) {
          //in case an evaluation error occurred
          const tile = this.props.tiles.find(p => p.guid === token.tileGuid)

          if (!tile) {
            Logger.fatal(`tile with guid ${token.tileGuid} was not found`)
            throw new Error()
          }
          Logger.fatal(`error on field after field with id: '${token.fieldId}', on tile '${token.tileGuid}' (${tile.displayName}), error: ${err.message}`)
        }


        //check if current player has won after executing the current fields statement
        if (Simulator.currentPlayerHasWon(state)) {
          Logger.message(`player ${state.currentPlayerIndex} has won!`, 'Game over')
          this.props.set_simulation_simulationStatus(SimulationStatus.finished, state)
          return
        }

        //this field could be a move field... left dive val is now incremented
        if (state.leftDiceValue === 0) {
          //end round
          state = Simulator.endRound(state)
        }
      }
    }

    this.props.set_simulation_simulationStatus(SimulationStatus.paused, state)

  }

  render(): JSX.Element {
    return (
      <div className={['flexed', this.props.className ? this.props.className : ''].join(' ')}>

        {
          //start / resume simulation till end
        }
        <ToolTip
          message={getI18n(this.props.langId,
            "Start automatic simulation till end. This parses all fields before starting the simulation. We expect 1 start field and at least 1 end field")}
        >
          <Button icon
                  disabled={this.props.simulationState.simulationStatus === SimulationStatus.running || this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused || this.props.simulationState.simulationStatus === SimulationStatus.running_many}
                  onClick={async () => {

                    //parse all fields and find syntax errors & some semantic errors
                    Simulator.parseAllFields(this.props.gameInitCmdText, this.props.tiles,
                      true,
                      true,
                      this.props.isSingleSimulation,
                      this.props.isSingleSimulation
                    )

                    //start field in props are only for single tile simulation
                    const startPos = Simulator.getStartFieldPosition(this.props.tiles, this.props.isSingleSimulation)

                    //should already be checked by parse all fields but ... why not check again
                    if (!startPos) {
                      Logger.fatal('no start field found')
                      return
                    }

                    let initState = this.props.simulationState.machineState

                    let ignoreFirstStateUpdate: boolean = false

                    if (this.props.simulationState.simulationStatus === null || this.props.simulationState.simulationStatus !== SimulationStatus.paused) {

                      //start new simulation
                      //this.props.set_simulation_simulationResults([]) //don't clear maybe we want to compare the times
                      initState = Simulator.initNew(startPos, true, this.props.gameInitCmdText)
                      ignoreFirstStateUpdate = true
                      this.props.set_simulation_simulationStatus(SimulationStatus.running, initState)
                    }

                    if (this.props.simulationState.simulationStatus === SimulationStatus.paused) {
                      ignoreFirstStateUpdate = true
                    }

                    let lastKnownState: MachineState |null = null

                    try {

                      //then run the simulation till end
                      await Simulator.runSimulationTillEnd(this.props.tiles,
                        this.props.tileSurrogates,
                        initState,
                        this.props.simulationState.maxTotalStepsPerSimulation,
                        startPos,
                        true,
                        this.props.isSingleSimulation,
                        this.props.simulationState.randomSeed,
                        (state, proposedSimulationStatus) => {

                          lastKnownState = state
                          //if the simulation finished this has top most priority
                          if (proposedSimulationStatus === SimulationStatus.finished) {
                            this.props.set_simulation_simulationStatus(proposedSimulationStatus, state)
                            //in this case result is ignored
                            return {
                              shouldContinue: false,
                              simulationSpeedInDelayInMsBetweenSteps: this.props.simulationState.simulationSpeedInDelayInMsBetweenSteps
                            }
                          }

                          //after a pause (we now resume) the old prop is still paused... use ignoreFirstStateUpdate
                          if (ignoreFirstStateUpdate === false && this.props.simulationState.simulationStatus === SimulationStatus.paused) {
                            this.props.set_simulation_simulationStatus(this.props.simulationState.simulationStatus, state)
                            return {
                              shouldContinue: false,
                              simulationSpeedInDelayInMsBetweenSteps: this.props.simulationState.simulationSpeedInDelayInMsBetweenSteps
                            }
                          }

                          //we abort simulation
                          if (this.props.simulationState.simulationStatus === null) {

                            //in the first update we don't updated the global state yet (we actually not
                            //calculated the new props yet)
                            if (ignoreFirstStateUpdate) {
                              //ignore
                            }
                            else {
                              return {
                                shouldContinue: false,
                                simulationSpeedInDelayInMsBetweenSteps: this.props.simulationState.simulationSpeedInDelayInMsBetweenSteps
                              }
                            }
                          }

                          if (ignoreFirstStateUpdate) {
                            ignoreFirstStateUpdate = false
                          }

                          this.props.set_simulation_simulationStatus(proposedSimulationStatus, state)
                          return {
                            shouldContinue: true,
                            simulationSpeedInDelayInMsBetweenSteps: this.props.simulationState.simulationSpeedInDelayInMsBetweenSteps
                          }
                        })
                    } catch (err) {

                      if (!lastKnownState) {
                        Logger.fatal('there was no last known state')
                      }
                      else {

                        const token = lastKnownState!.players[lastKnownState!.currentPlayerIndex].tokens[lastKnownState!.currentPlayerActiveTokenIndex]
                        //in case an evaluation error occurred
                        const tile = this.props.tiles.find(p => p.guid === token.tileGuid)

                        if (!tile) {
                          Logger.fatal(`could not find tile near field with id: '${token.fieldId}', tile guid: '${token.tileGuid}'`)
                          throw new Error()
                        }

                        Logger.fatal(`error on field after field with id: '${token.fieldId}', on tile '${token.tileGuid}' (${tile.displayName}), error: ${err.message}`)
                      }
                    }

                  }}>
            <Icon name='bug'/>
          </Button>
        </ToolTip>
        {
          //pause running simulation
        }
        <ToolTip
          message={getI18n(this.props.langId, "Pause the running simulation")}
        >
          <Button icon className="mar-right-half"
                  disabled={
                    this.props.simulationState.simulationStatus !== SimulationStatus.running
                  }
                  onClick={() => {

                    let state = this.props.simulationState.machineState
                    this.props.set_simulation_simulationStatus(SimulationStatus.paused, state)

                  }}>
            <Icon name='pause'/>
          </Button>
        </ToolTip>
        {
          //start debug (step through) simulation
          //does not do a full parse check
          //only a start field needs to be set
        }
        <ToolTip
          message={getI18n(this.props.langId, "Start step by step simulation")}
        >
          <Button icon
                  disabled={this.props.simulationState.simulationStatus === SimulationStatus.running || this.props.simulationState.simulationStatus === SimulationStatus.paused || this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused || this.props.simulationState.simulationStatus === SimulationStatus.running_many}
                  onClick={() => {

                    const startPos = Simulator.getStartFieldPosition(this.props.tiles, this.props.isSingleSimulation)

                    if (!startPos) {
                      Logger.fatal('no start field found')
                      return
                    }

                    AbstractMachine.setSeed(this.props.simulationState.randomSeed)
                    const state = Simulator.initNew(startPos, true, this.props.gameInitCmdText)
                    this.props.set_simulation_simulationStatus(SimulationStatus.paused, state)

                  }}>
            <Icon name='play'/>
          </Button>
        </ToolTip>

        {
          //do 1 step
          //do the same as Simulation.runSimulationTillEnd (same flow)
        }
        <ToolTip
          message={getI18n(this.props.langId, "Do 1 simulation step")}
        >
          <Button icon
                  disabled={this.props.simulationState.simulationStatus === null || this.props.simulationState.simulationStatus === SimulationStatus.running || this.props.simulationState.simulationStatus === SimulationStatus.finished || this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused || this.props.simulationState.simulationStatus === SimulationStatus.running_many}
                  onClick={() => {

                    this.do1SimulationStep()

                  }}>
            <Icon name='step forward'/>
          </Button>
        </ToolTip>
        {
          //stop / end simulation
        }
        <ToolTip
          message={getI18n(this.props.langId, "Stop simulation and discard all results")}
        >
          <Button icon
                  disabled={this.props.simulationState.simulationStatus === null || this.props.simulationState.simulationStatus === SimulationStatus.running_many_paused || this.props.simulationState.simulationStatus === SimulationStatus.running_many}
                  onClick={() => {
                    this.props.set_simulation_simulationResults([])
                    this.props.set_simulation_simulationStatus(null, null)
                  }}>
            <Icon name='stop'/>
          </Button>
        </ToolTip>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(controlSimulationBar)