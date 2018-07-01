import {justParse, runForState} from "../../../initForTests";
import {AbstractMachine} from "../../../../machine/AbstractMachine";
import {DefinitionTableBoolEntry, DefinitionTableIntEntry} from "../../../../machine/machineState";
import {Simulator} from "../../../../simulator";

describe('scopes', () => {

  test('begin_scope', () => {
    const prog = `
        begin_scope()
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    expect(stat.type).toEqual('begin_scope')
  })

  test('end_scope', () => {
    const prog = `
        end_scope()
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    expect(stat.type).toEqual('end_scope')
  })

  test('return syntax', () => {
    const prog = `
        return 3
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    expect(stat.type).toEqual('set_return_result')

    let state = AbstractMachine.createNewMachineState()
    state = AbstractMachine.executeStatement(stat, state)

    expect(state.players[state.currentPlayerIndex].lastReturnedValue).toEqual(3)
  })

  test('initial return value', () => {
    const prog = ``
    const res = runForState(prog)

    expect(res.players[res.currentPlayerIndex].lastReturnedValue).toEqual(undefined)
  })

  test('initial return value after player setup', () => {
    const prog = `
    3 players {}
    `
    const res = runForState(prog)

    expect(res.players[res.currentPlayerIndex].lastReturnedValue).toEqual(undefined)
    expect(res.players[res.nextPlayerIndex].lastReturnedValue).toEqual(undefined)
    expect(res.players[res.previousPlayerIndex].lastReturnedValue).toEqual(undefined)
  })

  test('return alternative syntax', () => {
    const prog = `
        result 3
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    expect(stat.type).toEqual('set_return_result')

    let state = AbstractMachine.createNewMachineState()
    state = AbstractMachine.executeStatement(stat, state)

    expect(state.players[state.currentPlayerIndex].lastReturnedValue).toEqual(3)
  })


  test('multiple scopes int', () => {
    const prog = `
      int x {15} = 5
      begin_scope()
        int x {15} = 10
        
        begin_scope()
          int x {15} = 15
          return x
       
    `
    const res = runForState(prog)


    expect(res.players[res.currentPlayerIndex].lastReturnedValue).toEqual(15)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('multiple scopes bool', () => {
    const prog = `
      bool x = false
      begin_scope()
        bool x = false
        
        begin_scope()
          bool x  = true
          return x
       
    `
    const res = runForState(prog)

    expect(res.players[res.currentPlayerIndex].lastReturnedValue).toEqual(true)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableBoolEntry).boolVal).toEqual(
      false)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableBoolEntry).boolVal).toEqual(
      false)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableBoolEntry).boolVal).toEqual(
      true)
  })

  test('disjoint scopes', () => {
    const prog = `
      int x {15} = 5
      
      begin_scope()
        int x {15} = 10
      end_scope()
      
      begin_scope()
        int x {15} = 15
      end_scope()
       
    `
    const units = justParse(prog)

    let index = 0
    let state = AbstractMachine.createNewMachineState()

    state = AbstractMachine.executeStatement(units.statements[index++], state) //int x {15} = 5

    expect((state.players[state.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)


    state = AbstractMachine.executeStatement(units.statements[index++], state) //begin_scope()
    state = AbstractMachine.executeStatement(units.statements[index++], state) //int x {15} = 10

    expect((state.players[state.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)

    state = AbstractMachine.executeStatement(units.statements[index++], state) //end_scope()

    expect(state.players[state.currentPlayerIndex].localDefTables.length).toEqual(1)


    state = AbstractMachine.executeStatement(units.statements[index++], state) //begin_scope()
    state = AbstractMachine.executeStatement(units.statements[index++], state) //int x {15} = 15

    expect((state.players[state.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)

    state = AbstractMachine.executeStatement(units.statements[index++], state) //end_scope()

    expect(state.players[state.currentPlayerIndex].localDefTables.length).toEqual(1)
    expect((state.players[state.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)

  })

  test('limit scope, use player var', () => {
    const prog = `
      3 players {
        int x {15} = 1
      }
      ---
      int x {15} = 2
      
      begin_scope()
        limit_scope()
        int x {15} = x
             
    `
    const state = runForState(prog)

    expect((state.players[state.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(1)
    expect((state.players[state.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((state.players[state.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(1)

  })

  test('limit scope, use global var', () => {
    const prog = `
      game {
        int x {15} = 1
      }
      ---
      int x {15} = 2
      
      begin_scope()
        limit_scope()
        int x {15} = x
             
    `
    const state = runForState(prog)

    expect((state.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(1)
    expect((state.players[state.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((state.players[state.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(1)
  })

})


describe('should fail', () => {
  test('return not expr', () => {
    const prog = `
        return
    `
    expect(() => justParse(prog)).toThrow()
  })

  test('scoped closed var not longer available', () => {
    const prog = `      
      begin_scope()
        int x {15} = 10
      end_scope()
      
     return x
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('scoped not connected to cp', () => {
    const prog = `      
      begin_scope()
        int x {15} = 10
        
        int y {15} = cp.x
      end_scope()
      
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('limit scope, var not found', () => {
    const prog = `
     
      int x {15} = 2
      
      begin_scope()
        limit_scope()
        int x {15} = x
    `
    expect(() => runForState(prog)).toThrow()
  })
})