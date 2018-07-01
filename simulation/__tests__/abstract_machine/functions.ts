import {AbstractMachine} from "../../machine/AbstractMachine";
import {runForState} from "../initForTests";


describe('abstract machine functions', () => {

  test('advance player index', () => {


    let state = AbstractMachine.createNewMachineState()

    //we don't know how many players we have so all should be 0
    expect(state.previousPlayerIndex).toEqual(0)
    expect(state.currentPlayerIndex).toEqual(0)
    expect(state.nextPlayerIndex).toEqual(0)


    const prog = `
      4 players {
        int x {15} = 10
      }
    `
    state = runForState(prog)

    //  cp  np      pp
    //  0   1   2   3
    expect(state.previousPlayerIndex).toEqual(3)
    expect(state.currentPlayerIndex).toEqual(0)
    expect(state.nextPlayerIndex).toEqual(1)


    state = AbstractMachine.advancePlayerIndex(state)

    //  pp  cp  np
    //  0   1   2   3
    expect(state.previousPlayerIndex).toEqual(0)
    expect(state.currentPlayerIndex).toEqual(1)
    expect(state.nextPlayerIndex).toEqual(2)


    state = AbstractMachine.advancePlayerIndex(state)

    //      pp  cp  np
    //  0   1   2   3
    expect(state.previousPlayerIndex).toEqual(1)
    expect(state.currentPlayerIndex).toEqual(2)
    expect(state.nextPlayerIndex).toEqual(3)

    state = AbstractMachine.advancePlayerIndex(state)

    //  np      pp  cp
    //  0   1   2   3
    expect(state.previousPlayerIndex).toEqual(2)
    expect(state.currentPlayerIndex).toEqual(3)
    expect(state.nextPlayerIndex).toEqual(0)

  })

  //TODO circularArithmeticVal

})


describe('should throw', () => {

})