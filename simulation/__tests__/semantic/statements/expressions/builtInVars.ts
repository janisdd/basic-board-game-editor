import {runForState} from "../../../initForTests";
import {DefinitionTableIntEntry} from "../../../../machine/machineState";


describe('built-in vars', () => {

  test('numPlayers 1', () => {
    const prog = `
      3 players {
      }
      ---
      int k {15} = $numPlayers
    `
    const res = runForState(prog)

    const localTable = res.players[res.currentPlayerIndex].localDefTables[0]
    expect((localTable.defTable['k'] as DefinitionTableIntEntry).val).toEqual(3)
  })

  test('numPlayers 2', () => {
    const prog = `
      2 players {
        numTokens 3
        int k {15} = 4
      }
      ---
      int k {15} = $numPlayers
    `
    const res = runForState(prog)

    const localTable = res.players[res.currentPlayerIndex].localDefTables[0]
    expect((localTable.defTable['k'] as DefinitionTableIntEntry).val).toEqual(2)
  })


  test('return value', () => {
    const prog = `
      2 players {
        numTokens 3
        int k {15} = 4
      }
      ---
      
      return 1
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].lastReturnedValue)).toEqual(1)
  })

})
