import {Action} from "redux";
import {notExhaustive} from "../_notExhausiveHelper";
import {MachineState} from "../../../../simulation/machine/machineState";
import {SimulationStatus} from "../../../types/states";
import {SimulationResult} from "../tileEditor/tileEditorReducer";
import {Logger} from "../../../helpers/logger";

export type State = {

  /**
   * shows the current simulation state (ui)
   */
  readonly simulationStatus: SimulationStatus | null

  readonly machineState: MachineState | null

  /**
   * only used for single simulations
   */
  readonly simulationSpeedInDelayInMsBetweenSteps: number

  readonly numOfSimulationsToRun: number

  /**
   * num of sim results to wait for in the worker before
   * sending (updating the ui)
   */
  readonly numOfSimulationResultsToWaitForBeforeSending: number

  readonly simulationResults: ReadonlyArray<SimulationResult>

  /**
   * the max amount of steps in a single simulation (summed over all players)
   * before an errors is thrown (infinite loop)
   */
  readonly maxTotalStepsPerSimulation: number

  /**
   * a seed for the all simulation random generated values or null to use no seed
   * this might be good for debugging
   */
  readonly randomSeed: number | null

}


export const initial: State = {

  machineState: null,
  simulationStatus: null,
  simulationSpeedInDelayInMsBetweenSteps: 500,
  numOfSimulationsToRun: 1,
  simulationResults: [],
  numOfSimulationResultsToWaitForBeforeSending: 10,
  maxTotalStepsPerSimulation: 1000,
  randomSeed: null
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {

  SET_simulation_simulationStatus = 'simulationReducer_SET_simulation_simulationStatus',
  SET_simulation_simulationSpeedInDelayInMsBetweenSteps = 'simulationReducer_SET_simulation_simulationSpeedInDelayInMsBetweenSteps',
  SET_simulation_numOfSimulationsToRun = 'simulationReducer_SET_simulation_numOfSimulationsToRun',
  SET_simulation_simulationResults = 'simulationReducer_SET_simulation_simulationResults',
  SET_simulation_numOfSimulationResultsToWaitForBeforeSending = 'simulationReducer_SET_simulation_numOfSimulationResultsToWaitForBeforeSending',

  SET_simulation_maxTotalStepsPerSimulation = 'simulationReducer_SET_simulation_maxTotalStepsPerSimulation',
  SET_simulation_randomSeed = 'simulationReducer_SET_simulation_randomSeed',


  RESET = 'simulationReducer_RESET',
}


export interface SET_simulation_simulationStatusAction extends ActionBase {
  readonly type: ActionType.SET_simulation_simulationStatus
  readonly simulationStatus: SimulationStatus | null
  readonly machineState: MachineState | null
}

export interface SET_simulation_simulationSpeedInDelayInMsBetweenStepsAction extends ActionBase {
  readonly type: ActionType.SET_simulation_simulationSpeedInDelayInMsBetweenSteps
  readonly simulationSpeedInDelayInMsBetweenSteps: number
}

export interface SET_simulation_numOfSimulationsToRunAction extends ActionBase {
  readonly type: ActionType.SET_simulation_numOfSimulationsToRun
  readonly numOfSimulationsToRun: number
}

export interface SET_simulation_simulationResultsAction extends ActionBase {
  readonly type: ActionType.SET_simulation_simulationResults
  readonly simulationResults: ReadonlyArray<SimulationResult>
}

export interface SET_simulation_numOfSimulationResultsToWaitForBeforeSendingAction extends ActionBase {
  readonly type: ActionType.SET_simulation_numOfSimulationResultsToWaitForBeforeSending
  readonly numOfSimulationResultsToWaitForBeforeSending: number
}

export interface SET_simulation_maxTotalStepsPerSimulationAction extends ActionBase {
  readonly type: ActionType.SET_simulation_maxTotalStepsPerSimulation
  readonly maxTotalStepsPerSimulation: number
}

export interface SET_simulation_randomSeedAction extends ActionBase {
  readonly type: ActionType.SET_simulation_randomSeed
  readonly randomSeed: number
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
  ResetAction
  | SET_simulation_simulationStatusAction
  | SET_simulation_simulationSpeedInDelayInMsBetweenStepsAction
  | SET_simulation_numOfSimulationsToRunAction
  | SET_simulation_simulationResultsAction
  | SET_simulation_numOfSimulationResultsToWaitForBeforeSendingAction
  | SET_simulation_maxTotalStepsPerSimulationAction
  | SET_simulation_randomSeedAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_simulation_simulationStatus:
      return {
        ...state,
        simulationStatus: action.simulationStatus,
        machineState: action.machineState
      }

    case ActionType.SET_simulation_simulationSpeedInDelayInMsBetweenSteps:
      return {
        ...state,
        simulationSpeedInDelayInMsBetweenSteps: action.simulationSpeedInDelayInMsBetweenSteps,
      }
    case ActionType.SET_simulation_numOfSimulationsToRun:
      return {
        ...state,
        numOfSimulationsToRun: action.numOfSimulationsToRun,
      }

    case ActionType.SET_simulation_simulationResults:
      return {
        ...state,
        simulationResults: action.simulationResults,
      }

    case ActionType.SET_simulation_numOfSimulationResultsToWaitForBeforeSending:
      return {
        ...state,
        numOfSimulationResultsToWaitForBeforeSending: action.numOfSimulationResultsToWaitForBeforeSending,
      }
    case ActionType.SET_simulation_maxTotalStepsPerSimulation:
      return {
        ...state,
        maxTotalStepsPerSimulation: action.maxTotalStepsPerSimulation,
      }

    case ActionType.SET_simulation_randomSeed:
      return {
        ...state,
        randomSeed: action.randomSeed,
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}

