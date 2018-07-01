import {Simulator} from "../../../simulation/simulator";
import {SimulationStatus, WorkerInputData, WorkerOutData} from "../../types/states";
import {AbstractMachine} from "../../../simulation/machine/AbstractMachine";

//from https://github.com/zlepper/typescript-webworker
//and https://github.com/webpack-contrib/worker-loader/issues/94

//every dependency is instanciated separately so use as few as possible

addEventListener('message', (ev) => {
  //start off worker
  const data = ev.data as WorkerInputData
  runMultipleSimulations(data)

})


declare function postMessage(data: ReadonlyArray<WorkerOutData>): any

async function runMultipleSimulations(data: WorkerInputData): Promise<void> {

  let runs = data.runNumber

  let simResults: WorkerOutData[] = []


  //maybe increase the random seed by +1 for every run so the user can actually reproduce all results?
  AbstractMachine.setSeed(data.randomSeed)

  while (runs < data.numOfSimulationsToRun) {

    await Simulator.runSimulationTillEnd(data.tiles,
      data.tileSurrogates,
      data.startState,
      data.maxMovesPerSimulation, data.startPos,
      false,
      data.isSingleTileSimulation,
      undefined,
      (state, proposedSimulationStatus) => {

        if (proposedSimulationStatus === SimulationStatus.finished) {
          return {
            shouldContinue: false,
            simulationSpeedInDelayInMsBetweenSteps: 0
          }
        }

        return {
          shouldContinue: true,
          simulationSpeedInDelayInMsBetweenSteps: 0
        }
      })
      .then(value => {

        runs++

        const outData: WorkerOutData = {
          runNumber: runs,
          state: value,
          error: null
        }

        simResults.push(outData)

        if (simResults.length === data.numOfResultsToSendAtOnce) {
          postMessage(simResults)
          simResults = []
        }

      })
      .catch((reason: Error) => {

        runs++

        const outData: WorkerOutData = {
          runNumber: runs,
          state: null,
          error: reason.message
        }

        simResults.push(outData)

        if (simResults.length === data.numOfResultsToSendAtOnce) {
          postMessage(simResults)
          simResults = []
        }
      })

    //console.log('run: ' + runs)
  }

  if (simResults.length > 0) {
    postMessage(simResults)
  }

  close()
}