import {
  ActionBase,
  ActionType, SET_simulation_maxTotalStepsPerSimulationAction,
  SET_simulation_numOfSimulationResultsToWaitForBeforeSendingAction,
  SET_simulation_numOfSimulationsToRunAction, SET_simulation_randomSeedAction,
  SET_simulation_simulationResultsAction, SET_simulation_simulationSpeedInDelayInMsBetweenStepsAction,
  SET_simulation_simulationStatusAction
} from "./simulationReducer";
import {SimulationStatus} from "../../../types/states";
import {MachineState} from "../../../../simulation/machine/machineState";
import {SimulationResult} from "../tileEditor/tileEditorReducer";


export function set_simulation_simulationStatus(simulationStatus: SimulationStatus | null, machineState: MachineState | null): SET_simulation_simulationStatusAction {
  return {
    type: ActionType.SET_simulation_simulationStatus,
    simulationStatus,
    machineState
  }
}


export function set_simulation_simulationSpeedInDelayInMsBetweenSteps(simulationSpeedInDelayInMsBetweenSteps: number): SET_simulation_simulationSpeedInDelayInMsBetweenStepsAction {
  return {
    type: ActionType.SET_simulation_simulationSpeedInDelayInMsBetweenSteps,
    simulationSpeedInDelayInMsBetweenSteps
  }
}

export function set_simulation_numOfSimulationsToRun(numOfSimulationsToRun: number): SET_simulation_numOfSimulationsToRunAction {
  return {
    type: ActionType.SET_simulation_numOfSimulationsToRun,
    numOfSimulationsToRun
  }
}

export function set_simulation_simulationResults(simulationResults: ReadonlyArray<SimulationResult>): SET_simulation_simulationResultsAction {
  return {
    type: ActionType.SET_simulation_simulationResults,
    simulationResults
  }
}

export function set_simulation_numOfSimulationResultsToWaitForBeforeSending(numOfSimulationResultsToWaitForBeforeSending: number): SET_simulation_numOfSimulationResultsToWaitForBeforeSendingAction {
  return {
    type: ActionType.SET_simulation_numOfSimulationResultsToWaitForBeforeSending,
    numOfSimulationResultsToWaitForBeforeSending
  }
}


export function set_simulation_maxTotalStepsPerSimulation(maxTotalStepsPerSimulation: number): SET_simulation_maxTotalStepsPerSimulationAction {
  return {
    type: ActionType.SET_simulation_maxTotalStepsPerSimulation,
    maxTotalStepsPerSimulation
  }
}

export function set_simulation_randomSeedAction(randomSeed: number | null): SET_simulation_randomSeedAction {
  return {
    type: ActionType.SET_simulation_randomSeed,
    randomSeed
  }
}