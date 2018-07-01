import {MachineState, WorldSimulationPosition, WorldTileSurrogate} from "../../simulation/machine/machineState";
import {Tile} from "./world";

export enum SimulationStatus {
  init = 0,
  running = 1,
  paused = 2,
  finished = 3,
  running_many = 4,
  running_many_paused = 5
}

export interface WorkerInputData {
  readonly runNumber: number
  readonly startState: MachineState
  readonly numOfSimulationsToRun: number

  readonly startPos: WorldSimulationPosition
  readonly tiles: ReadonlyArray<Tile>
  readonly tileSurrogates: ReadonlyArray<WorldTileSurrogate>

  /**
   * the number of results to wait for before sending
   * the result list (in the worker)
   */
  readonly numOfResultsToSendAtOnce: number

  readonly maxMovesPerSimulation: number

  /**
   * true: use the tile props for end & start fields in addition to the normal commands
   * false: not
   */
  readonly isSingleTileSimulation: boolean

  /**
   * the seed for the random values
   */
  readonly randomSeed: number |null
}

export interface WorkerOutData {
  readonly runNumber: number
  /**
   * null in case of an error
   */
  readonly state: MachineState | null

  readonly error: string | null
}
