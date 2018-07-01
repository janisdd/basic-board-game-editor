import {runForState} from "../../../initForTests";
import {DefinitionTableBoolEntry, DefinitionTableIntEntry} from "../../../../machine/machineState";

describe('mixed var access', () => {

  test('access return value', () => {
    const prog = `
      int x {15} = 5
      int y {15} = 3
      return x
      y = $result
       
    `
    const res = runForState(prog)


    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.currentPlayerIndex].lastReturnedValue)).toEqual(5)
  })

  test('access return value alternative syntax', () => {
    const prog = `
      int x {15} = 5
      int y {15} = 3
      return x
      y = $result
       
    `
    const res = runForState(prog)


    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.currentPlayerIndex].lastReturnedValue)).toEqual(5)
  })

  test('return different syntax', () => {
    const prog = `
      int x {15} = 5
      int y {15} = 3
      result x
      y = $result
       
    `
    const res = runForState(prog)


    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.currentPlayerIndex].lastReturnedValue)).toEqual(5)
  })

  test('int player var access', () => {
    const prog = `
    
     1 players {
        numTokens 1
        int x {15} = 4
      }
      ---
      int x {15} = cp.x
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('bool player var access', () => {
    const prog = `
    
     1 players {
        numTokens 1
        bool y = true
      }
      ---
      bool x = cp.y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
  })

  test('global and local var, same name', () => {
    const prog = `
       game {
        int x {15} = 0
      }
      ---
      int x {5} = 3
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(0)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
  })

  test('global and local var uses global, same name', () => {
    const prog = `
       game {
        int x {15} = 3
      }
      ---
      int x {5} = x
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
  })

  test('local var hides global var', () => {
    const prog = `
       game {
        int x {15} = 3
      }
      ---
      int x {5} = 5
      int y {5} = x
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('local var hides player var', () => {
    const prog = `
       3 players {
        int x {15} = 3
      }
      ---
      int x {5} = 5
      int y {5} = x
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('player var hides global var', () => {
    const prog = `
     game {
        int x {15} = 2
      }
      
      3 players {
        int x {15} = 5
      }
      ---
      int y {5} = x
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('local var hides player var & global var', () => {
    const prog = `
       game {
        int x {15} = 3
      }
      3 players {
        int x {15} = 2
      }
      ---
      int x {5} = 5
      int y {5} = x
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('explicit player var', () => {
    const prog = `
       game {
        int x {15} = 3
      }
      3 players {
        int x {15} = 2
      }
      ---
      int x {5} = 5
      int y {5} = cp.x
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)
  })

  test('local var = global var', () => {
    const prog = `
       game {
        int x {15} = 3
      }
      ---
      int y {5} = x
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)
  })

  test('scope hides local var', () => {
    const prog = `
      int x {15} = 5
      int y {15} = 8
      
      begin_scope()
        int x {15} = 10
        y = x
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(10)
  })

  test('scope hides player var', () => {
    const prog = `
      3 players {
        int x {15} = 5
        int y {15} = 8
      }
      ---
      begin_scope()
        int x {15} = 10
        y = x
        
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(10)
  })

  test('scope hides local, player var', () => {
    const prog = `
      3 players {
        int x {15} = 1
        int y {15} = 2
      }
      ---
      int x {15} = 3
      int y {15} = 4
      
      begin_scope()
        int x {15} = 5
        cp.y = x
    `
    const res = runForState(prog)


    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(1)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('scope hides global var', () => {
    const prog = `
      game {
        int x {15} = 5
        int y {15} = 8
      }
      ---
      begin_scope()
        int x {15} = 10
        y = x
        
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)

    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(10)
  })

  test('scope hides global, player var', () => {
    const prog = `
      game {
        int x {15} = 5
        int y {15} = 8
      }
      
      3 players {
        int x {15} = 1
        int y {15} = 2
      }
      ---
      begin_scope()
        int x {15} = 10
        y = x
        
    `
    const res = runForState(prog)

    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(8)


    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(1)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(10)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
  })

  test('scope hides local, global, player var', () => {
    const prog = `
      game {
        int x {15} = 5
        int y {15} = 8
      }
      
      3 players {
        int x {15} = 1
        int y {15} = 2
      }
      ---
      int x {15} = 3
      int y {15} = 4
      
      begin_scope()
        int x {15} = 10
        y = x
        
    `
    const res = runForState(prog)

    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(8)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(1)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(10)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
  })

})

describe('local var access', () => {

  test('int access', () => {
    const prog = `
      int x {15} = 1 + 1
      int y {15} = x
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)
  })

  test('bool access', () => {
    const prog = `
      bool x = true
      bool y = true
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
  })

})

describe('player var access', () => {

  test('int access', () => {
    const prog = `
      3 players {
        int x {15} = 1 + 1
        int y {15} = x
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)


    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((res.players[res.nextPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((res.players[res.previousPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

  })

  test('bool access', () => {
    const prog = `
      3 players {
        bool b = true
        bool b2 = b
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['b'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
    expect((res.players[res.currentPlayerIndex].defTable['b2'] as DefinitionTableBoolEntry).boolVal).toEqual(true)

    expect((res.players[res.nextPlayerIndex].defTable['b'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
    expect((res.players[res.nextPlayerIndex].defTable['b2'] as DefinitionTableBoolEntry).boolVal).toEqual(true)

    expect((res.players[res.previousPlayerIndex].defTable['b'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
    expect((res.players[res.previousPlayerIndex].defTable['b2'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
  })

  test('int access explicit', () => {
    const prog = `
      3 players {
        int x {15} = 1 + 1
        int y {15} = cp.x
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)


    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((res.players[res.nextPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((res.players[res.previousPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

  })

  test('bool access explicit', () => {
    const prog = `
      3 players {
        bool b = true
        bool b2 = cp.b
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['b'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
    expect((res.players[res.currentPlayerIndex].defTable['b2'] as DefinitionTableBoolEntry).boolVal).toEqual(true)

    expect((res.players[res.nextPlayerIndex].defTable['b'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
    expect((res.players[res.nextPlayerIndex].defTable['b2'] as DefinitionTableBoolEntry).boolVal).toEqual(true)

    expect((res.players[res.previousPlayerIndex].defTable['b'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
    expect((res.players[res.previousPlayerIndex].defTable['b2'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
  })



})

describe('global var access', () => {

  test('int access', () => {
    const prog = `
      game {
        int x {15} = 1 + 1
        int y {15} = x
      }
    `
    const res = runForState(prog)

    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

  })

  test('bool access', () => {
    const prog = `
      game {
        bool b = true
        bool b2 = b
      }
    `
    const res = runForState(prog)

    expect((res.globalDefTable['b'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
    expect((res.globalDefTable['b2'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
  })
})


describe('should fail', () => {
  test('int access to bool', () => {
    const prog = `
      int x {15} = 1 + 1
      bool y = x
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('bool access to int', () => {
    const prog = `
      bool x = true
      int y {15} = true
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('int player var access to bool', () => {
    const prog = `
    
     1 players {
        numTokens 1
        int x {15} = 4
      }
      ---
      bool x = cp.x
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('bool player var access to int', () => {
    const prog = `
    
     1 players {
        numTokens 1
        bool y = true
      }
      ---
      int x {15} = cp.y
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('player/global var not found', () => {
    const prog = `
      bool y = x
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('player var used, not found, global var same name', () => {
    const prog = `
      game {
        bool y = true
      }
      ---
      bool x = cp.y
    `
    expect(() => runForState(prog)).toThrow()
  })

})