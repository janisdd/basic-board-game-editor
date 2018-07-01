import {justParse} from "../../../initForTests";
import {AbstractMachine} from "../../../../machine/AbstractMachine";
import {MachineState} from "../../../../machine/machineState";

describe('rollback', () => {

  test('rollback', () => {
    const prog = `
        rollback()
    `
    const res = justParse(prog)

    let state = AbstractMachine.createNewMachineState()

    state = {
      ...state,
      rolledDiceValue: 5,
      leftDiceValue: 5,
    }

    //expected state
    const epxectedState: MachineState = {
      ...state,
      leftDiceValue: 0,
      wasStateRolledBack: true
    }

    //change the state here
    state = {
      ...state,
      rollbackState: epxectedState,
      players: [{
        id: 5,
        name: 'asd',
        color: '',
        suspendCounter: -1,
        defTable: {},
        tokens: [],
        localDefTables: [],
        lastReturnedValue: undefined
      }]
    }

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    if (stat.type === "rollback_func") {

      let rolledBackState = AbstractMachine.executeStatement(stat, state)

      rolledBackState = {
        ...rolledBackState,
        elapsedTimeInS: state.elapsedTimeInS
      }

      expect(rolledBackState).toEqual(epxectedState)

    }
    else {
      expect(stat.type).toEqual('rollback_func')
    }
  })

})