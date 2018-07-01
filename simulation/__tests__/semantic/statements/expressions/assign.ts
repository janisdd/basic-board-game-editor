import {runForState} from "../../../initForTests";
import {DefinitionTableBoolEntry, DefinitionTableIntEntry} from "../../../../machine/machineState";

describe('assigns', () => {

  test('int assign', () => {
    const prog = `
      int x {15} = 1 + 1
      x = 10
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
  })

  test('bool assign', () => {
    const prog = `
      bool x = false 
      x = true
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableBoolEntry).boolVal).toEqual(
      true)
  })

  test('player int assign explicit', () => {
    const prog = `
      1 players {
        int x {15} = 0
      }
      ---
      cp.x = 10
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
  })

  test('player int assign implicit', () => {
    const prog = `
      1 players {
        int x {15} = 0
      }
      ---
      x = 10
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
  })

  test('player bool assign explicit', () => {
    const prog = `
      1 players {
        bool x = false
      }
      ---
      cp.x = true
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
  })

  test('player bool assign implicit', () => {
    const prog = `
      1 players {
        bool x = false
      }
      ---
      x = true
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
  })

  test('global int assign', () => {
    const prog = `
      game {
        int x {15} = 9
      }
      ---
      x = 10
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
  })

  test('global bool assign', () => {
    const prog = `
      game {
        bool x = false
      }
      ---
      x = true
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableBoolEntry).boolVal).toEqual(true)
  })

  test('hidden global assign through local', () => {
    const prog = `
      game {
        int x {15} = 5
      }
      ---
      int x {15} = 3
      x = 10
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('hidden global assign through player assign', () => {
    const prog = `
      game {
        int x {15} = 7
      }
      
      3 players {
        int x {15} = 5
      }
      ---
      x = 10
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(7)
  })

  test('hidden player assign', () => {
    const prog = `
      3 players {
        int x {15} = 5
      }
      ---
      int x {15} = 3
      x = 10
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('hidden global, player assign', () => {
    const prog = `
    game {
        int x {15} = 6
      }
      3 players {
        int x {15} = 5
      }
      ---
      int x {15} = 3
      x = 10
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test('hidden global, local assign', () => {
    const prog = `
    game {
        int x {15} = 6
      }
      3 players {
        int x {15} = 5
      }
      ---
      int x {15} = 3
      cp.x = 10
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(10)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test('scope var assign', () => {
    const prog = `
      game {
        int x {15} = 6
      }
      3 players {
        int x {15} = 5
      }
      ---
      int x {15} = 2
      
      begin_scope()
        int x {15} = 3
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
  })


  test('nested scope var assign', () => {
    const prog = `
     
      int x {15} = 1
      int y {15} = 8
      
      begin_scope()
        int x {15} = 2
        int y {15} = 9
        
        begin_scope()
          int x {15} = 4
          int y {15} = 3
          y = x
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(1)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(8)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(2)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(9)

    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
  })

})


describe('should fail because of type', () => {

  test('int assign', () => {
    const prog = `
      int x {15} = 1 + 1
      x = true
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('bool assign', () => {
    const prog = `
      bool x = true 
      x = 1
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('player int assign', () => {
    const prog = `
      1 players {
        numTokens 1
        int x {15} = 0
      }
      ---
      cp.x = true
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('player bool assign', () => {
    const prog = `
      1 players {
        numTokens 1
        bool x = false
      }
      ---
      cp.x = 3
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('scoped closed var not longer available', () => {
    const prog = `      
      int y {15} = 8
      
      begin_scope()
        int x {15} = 10
      end_scope()
      
      y = x
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('scoped closed var not longer available nested', () => {
    const prog = `      
      int y {15} = 8
      
      begin_scope()
        int x {15} = 9
        begin_scope()
          int z {15} = 11
        end_scope()
        y = z
      end_scope()
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('all scoes cleared, var not longer available', () => {
    const prog = `      
      int y {15} = 8
      
      begin_scope()
        int x {15} = 9
        begin_scope()
          int z {15} = 11
        end_scope()
      end_scope()
      y = z
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('all scoes cleared, var not longer available 2', () => {
    const prog = `      
      int y {15} = 8
      
      begin_scope()
        int x {15} = 9
        begin_scope()
          int z {15} = 11
        end_scope()
      end_scope()
      y = x
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('try to end initial scope', () => {
    const prog = `      
      int y {15} = 8
      end_scope()
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('set return value with assign', () => {
    const prog = `
      int x {15} = 5
      int y {15} = 3
      return x
      $result = y
       
    `
    expect(() => runForState(prog)).toThrow()
  })

})