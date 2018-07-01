import {runForState,runForLocalVar} from "../../../initForTests";
import {DefinitionTableIntEntry} from "../../../../machine/machineState";


describe('increment', () => {

  test('post increment y++', () => {
    const prog = `
      int y {15} = 5
      int x {15} = y++
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('post increment player y++', () => {
    const prog = `
      3 players {
        int y {15} = 5
        int x {15} = y++
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.nextPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.previousPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('post increment player y++ explicit', () => {
    const prog = `
      3 players {
        int y {15} = 5
        int x {15} = cp.y++
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.nextPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.previousPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('global post increment y++', () => {
    const prog = `
      game {
        int y {15} = 5
        int x {15} = y++
      }      
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('global post increment local y++', () => {
    const prog = `
      game {
        int y {15} = 5
      }
      ---
      int x {15} = y++
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('global post increment y++ inverted', () => {
    const prog = `
      game {
        int y {15} = 4
      }
      ---
      int x {15} = 5
      y = x++
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test('global post increment y++ inverted player', () => {
    const prog = `
      3 players {
        int y {15} = 4
      }
      ---
      int x {15} = 5
      y = x++
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test(' increment y++ player explicit', () => {
    const prog = `
      3 players {
        int y {15} = 4
      }
      ---
      int x {15} = cp.y++
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('global post increment y++ inverted player explicit', () => {
    const prog = `
      3 players {
        int y {15} = 4
      }
      ---
      int x {15} = 5
      cp.y = x++
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test('all global post increment y++', () => {
    const prog = `
      game {
        int y {15} = 5
        int x {15} = y++
      }
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('post increment y++ in scope', () => {
    const prog = `
      int y {15} = 2
      
      begin_scope()
        int y {15} = 5
        int x {15} = y++
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('post increment y++ in scope 2', () => {
    const prog = `
      int y {15} = 2
      begin_scope()
        int y {15} = 3
        begin_scope()
          int y {15} = 5
          int x {15} = y++
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)

    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })



  test('pre increment ++y', () => {
    const prog = `
      int y {15} = 5
      int x {15} = ++y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test('pre increment ++y player', () => {
    const prog = `
      3 players {
        int y {15} = 5
        int x {15} = ++y
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test(' pre increment y++ player explicit', () => {
    const prog = `
      3 players {
        int y {15} = 4
      }
      ---
      int x {15} = ++cp.y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('global pre increment ++y', () => {
    const prog = `
      game {
        int y {15} = 5
      }
      ---
      int x {15} = ++y
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test('global pre increment ++y inverted player', () => {
    const prog = `
      3 players {
        int y {15} = 4
      }
      ---
      int x {15} = 5
      y = ++x
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test('global pre increment ++y inverted', () => {
    const prog = `
      game {
        int y {15} = 4
      }
      ---
      int x {15} = 5
      y = ++x
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test('all global pre increment ++y', () => {
    const prog = `
      game {
        int y {15} = 5
        int x {15} = ++y
      }
      
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test('pre increment y++ in scope', () => {
    const prog = `
      int y {15} = 2
      
      begin_scope()
        int y {15} = 5
        int x {15} = ++y
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
  })

  test('pre increment y++ in scope 2', () => {
    const prog = `
      int y {15} = 2
      begin_scope()
        int y {15} = 3
        begin_scope()
          int y {15} = 5
          int x {15} = ++y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)

    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['y'] as DefinitionTableIntEntry).val).toEqual(6)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableIntEntry).val).toEqual(6)
  })



  test('post increment with circular arithmetic', () => {
    const prog = `
      int y {15} = 15
      int x {15} = y++
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)

  })

  test('post increment with circular arithmetic player', () => {
    const prog = `
      3 players {
        int y {15} = 15
        int x {15} = y++
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)

  })

  test('post increment with circular arithmetic player explicit', () => {
    const prog = `
      3 players {
        int y {15} = 15
        int x {15} = cp.y++
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)

  })

  test('global post increment with circular arithmetic', () => {
    const prog = `
      game {
        int y {15} = 15
      }
      ---
      int x {15} = y++
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('global post increment with circular arithmetic inverted', () => {
    const prog = `
      game {
        int y {15} = 14
      }
      ---
      int x {15} = 15
      y = x++
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('all global post increment with circular arithmetic', () => {
    const prog = `
      game {
        int y {15} = 15
        int x {15} = y++
      }
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('pre increment y++ in scope with circular arithmetic', () => {
    const prog = `
      int y {15} = 2
      
      begin_scope()
        int y {15} = 15
        int x {15} = ++y
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('pre increment y++ in scope 2 with circular arithmetic', () => {
    const prog = `
      int y {15} = 2
      begin_scope()
        int y {15} = 3
        begin_scope()
          int y {15} = 15
          int x {15} = ++y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)

    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })


  test('pre increment with circular arithmetic', () => {
    const prog = `
      int y {15} = 15
      int x {15} = ++y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('pre increment with circular arithmetic player', () => {
    const prog = `
      3 players {
        int y {15} = 15
        int x {15} = ++y
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('pre increment with circular arithmetic player explicit', () => {
    const prog = `
      3 players {
        int y {15} = 15
        int x {15} = ++cp.y
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('global pre increment with circular arithmetic', () => {
    const prog = `
      game {
        int y {15} = 15
      }
      ---
      int x {15} = ++y
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('global pre increment with circular arithmetic inverted', () => {
    const prog = `
      game {
        int y {15} = 14
      }
      ---
      int x {15} = 15
      y = ++x
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('all global pre increment with circular arithmetic', () => {
    const prog = `
      game {
        int y {15} = 15
        int x {15} = ++y
      }
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('pre increment y++ in scope with circular arithmetic', () => {
    const prog = `
      int y {15} = 2
      
      begin_scope()
        int y {15} = 15
        int x {15} = ++y
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('pre increment y++ in scope 2 with circular arithmetic', () => {
    const prog = `
      int y {15} = 2
      begin_scope()
        int y {15} = 3
        begin_scope()
          int y {15} = 15
          int x {15} = ++y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)

    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

})


//they actually throw because of syntax
describe('increment should fail', () => {

  test('post increment & pre', () => {
    const prog = `
      int y {15} = 5
      int x {15} = ++(y++)
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('post increment true++', () => {
    const prog = `
      int y {15} = true++
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('post increment false++', () => {
    const prog = `
      int y {15} = false++
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('pre increment true++', () => {
    const prog = `
      int y {15} = ++true
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('pre increment ++false', () => {
    const prog = `
      int y {15} = ++false
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })


  test('global post increment ++false', () => {
    const prog = `
      game {
        int y {15} = false++
      }
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('global pre increment ++false', () => {
    const prog = `
      game {
        int y {15} = ++false
      }
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

})

//decrement ist copy pasted with vals modified

describe('decrement', () => {

  test('post increment y--', () => {
    const prog = `
      int y {15} = 5
      int x {15} = y--
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('post increment player y--', () => {
    const prog = `
      3 players {
        int y {15} = 5
        int x {15} = y--
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.nextPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.previousPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('post increment player y-- explicit', () => {
    const prog = `
      3 players {
        int y {15} = 5
        int x {15} = cp.y--
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.nextPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)

    expect((res.players[res.previousPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('global post increment y--', () => {
    const prog = `
      game {
        int y {15} = 5
        int x {15} = y--
      }      
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('global post increment local y--', () => {
    const prog = `
      game {
        int y {15} = 5
      }
      ---
      int x {15} = y--
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('global post increment y-- inverted', () => {
    const prog = `
      game {
        int y {15} = 4
      }
      ---
      int x {15} = 5
      y = x--
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('global post increment y-- inverted player', () => {
    const prog = `
      3 players {
        int y {15} = 4
      }
      ---
      int x {15} = 5
      y = x--
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test(' increment y-- player explicit', () => {
    const prog = `
      3 players {
        int y {15} = 4
      }
      ---
      int x {15} = cp.y--
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('global post increment y-- inverted player explicit', () => {
    const prog = `
      3 players {
        int y {15} = 4
      }
      ---
      int x {15} = 5
      cp.y = x--
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(5)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('all global post increment y--', () => {
    const prog = `
      game {
        int y {15} = 5
        int x {15} = y--
      }
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('post increment y-- in scope', () => {
    const prog = `
      int y {15} = 2
      
      begin_scope()
        int y {15} = 5
        int x {15} = y--
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })

  test('post increment y-- in scope 2', () => {
    const prog = `
      int y {15} = 2
      begin_scope()
        int y {15} = 3
        begin_scope()
          int y {15} = 5
          int x {15} = y--
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)

    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableIntEntry).val).toEqual(5)
  })


  test('pre increment --y', () => {
    const prog = `
      int y {15} = 5
      int x {15} = --y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('pre increment --y player', () => {
    const prog = `
      3 players {
        int y {15} = 5
        int x {15} = --y
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test(' pre increment y-- player explicit', () => {
    const prog = `
      3 players {
        int y {15} = 4
      }
      ---
      int x {15} = --cp.y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(3)
  })

  test('global pre increment --y', () => {
    const prog = `
      game {
        int y {15} = 5
      }
      ---
      int x {15} = --y
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('global pre increment --y inverted player', () => {
    const prog = `
      3 players {
        int y {15} = 6
      }
      ---
      int x {15} = 5
      y = --x
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('global pre increment --y inverted', () => {
    const prog = `
      game {
        int y {15} = 6
      }
      ---
      int x {15} = 5
      y = --x
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('all global pre increment --y', () => {
    const prog = `
      game {
        int y {15} = 5
        int x {15} = --y
      }
      
    `
    const res = runForState(prog)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('pre increment y-- in scope', () => {
    const prog = `
      int y {15} = 2
      
      begin_scope()
        int y {15} = 5
        int x {15} = --y
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })

  test('pre increment y-- in scope 2', () => {
    const prog = `
      int y {15} = 2
      begin_scope()
        int y {15} = 3
        begin_scope()
          int y {15} = 5
          int x {15} = --y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)

    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['y'] as DefinitionTableIntEntry).val).toEqual(4)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableIntEntry).val).toEqual(4)
  })


  test('post increment with circular arithmetic', () => {
    const prog = `
      int y {15} = -16
      int x {15} = y--
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)

  })

  test('post increment with circular arithmetic player', () => {
    const prog = `
      3 players {
        int y {15} = -16
        int x {15} = y--
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)

  })

  test('post increment with circular arithmetic player explicit', () => {
    const prog = `
      3 players {
        int y {15} = -16
        int x {15} = cp.y--
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)

  })

  test('global post increment with circular arithmetic', () => {
    const prog = `
      game {
        int y {15} = -16
      }
      ---
      int x {15} = y--
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('global post increment with circular arithmetic inverted', () => {
    const prog = `
      game {
        int y {15} = -13
      }
      ---
      int x {15} = -16
      y = x--
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(-16)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('all global post increment with circular arithmetic', () => {
    const prog = `
      game {
        int y {15} = -16
        int x {15} = y--
      }
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('post increment y-- in scope with circular arithmetic', () => {
    const prog = `
      int y {15} = 2
      
      begin_scope()
        int y {15} = -16
        int x {15} = y--
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })

  test('post increment y-- in scope 2 with circular arithmetic', () => {
    const prog = `
      int y {15} = 2
      begin_scope()
        int y {15} = 3
        begin_scope()
          int y {15} = -16
          int x {15} = y--
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)

    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableIntEntry).val).toEqual(-16)
  })


  test('pre increment with circular arithmetic', () => {
    const prog = `
      int y {15} = -16
      int x {15} = --y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('pre increment with circular arithmetic player', () => {
    const prog = `
      3 players {
        int y {15} = -16
        int x {15} = --y
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('pre increment with circular arithmetic player explicit', () => {
    const prog = `
      3 players {
        int y {15} = -16
        int x {15} = --cp.y
      }
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].defTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('global pre increment with circular arithmetic', () => {
    const prog = `
      game {
        int y {15} = -16
      }
      ---
      int x {15} = --y
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('global pre increment with circular arithmetic inverted', () => {
    const prog = `
      game {
        int y {15} = -13
      }
      ---
      int x {15} = -16
      y = --x
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('all global pre increment with circular arithmetic', () => {
    const prog = `
      game {
        int y {15} = -16
        int x {15} = --y
      }
    `
    const res = runForState(prog)
    expect((res.globalDefTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.globalDefTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('pre increment y-- in scope with circular arithmetic', () => {
    const prog = `
      int y {15} = 2
      
      begin_scope()
        int y {15} = -16
        int x {15} = --y
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

  test('pre increment y-- in scope 2 with circular arithmetic', () => {
    const prog = `
      int y {15} = 2
      begin_scope()
        int y {15} = 3
        begin_scope()
          int y {15} = -16
          int x {15} = --y
    `
    const res = runForState(prog)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['y'] as DefinitionTableIntEntry).val).toEqual(2)

    expect((res.players[res.currentPlayerIndex].localDefTables[1].defTable['y'] as DefinitionTableIntEntry).val).toEqual(3)

    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['y'] as DefinitionTableIntEntry).val).toEqual(15)
    expect((res.players[res.currentPlayerIndex].localDefTables[2].defTable['x'] as DefinitionTableIntEntry).val).toEqual(15)
  })

})



//they actually throw because of syntax
describe('decrement should', () => {

  test('post decrement & pre braces', () => {
    const prog = `
      int y {15} = 5
      int x {15} = --(y--)
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('post decrement & pre', () => {
    const prog = `
      int y {15} = 5
      int x {15} = --y--
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('post decrement true--', () => {
    const prog = `
      int y {15} = true--
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('post decrement false--', () => {
    const prog = `
      int y {15} = false--
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('post decrement true--', () => {
    const prog = `
      int y {15} = --true
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('post decrement --false', () => {
    const prog = `
      int y {15} = --false
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('global post decrement --false', () => {
    const prog = `
      game {
        int y {15} = false--
      }
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('global pre decrement --false', () => {
    const prog = `
      game {
        int y {15} = --false
      }
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

})
