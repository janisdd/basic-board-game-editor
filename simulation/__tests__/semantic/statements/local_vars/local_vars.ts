import {runForState} from "../../../initForTests";
import {DefinitionTableBoolEntry, DefinitionTableIntEntry} from "../../../../machine/machineState";

describe('players idents (cp, np, pp)', () => {

  test('cp write', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      cp.x = 9
    `
    const res = runForState(prog)

    expect((res.players[0].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
  })

  test('cp access', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      int k {15} = cp.x
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['k'] as DefinitionTableIntEntry).val).toBe(10)

    expect((res.players[res.currentPlayerIndex].defTable['k'] as DefinitionTableIntEntry)).toBe(undefined)

    expect((res.players[res.nextPlayerIndex].localDefTables[0].defTable['k'] as DefinitionTableIntEntry)).toBe(undefined)
    expect((res.players[res.previousPlayerIndex].localDefTables[0].defTable['k'] as DefinitionTableIntEntry)).toBe(undefined)
  })

  test('current_player write', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      current_player.x = 9
    `
    const res = runForState(prog)

    expect((res.players[0].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
  })

  test('current_player access', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      int k {15} = current_player.x
    `
    const res = runForState(prog)

    expect((res.players[0].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['k'] as DefinitionTableIntEntry).val).toBe(10)
  })


  test('np write', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      np.x = 9
    `
    const res = runForState(prog)
    expect(res.currentPlayerIndex).toEqual(0)
    expect(res.nextPlayerIndex).toEqual(1)
    expect(res.previousPlayerIndex).toEqual(2)

    expect((res.players[0].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[1].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
    expect((res.players[2].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
  })

  test('np access', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      np.x = 9
      int k {15} = np.x
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['k'] as DefinitionTableIntEntry).val).toBe(9)
    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
  })

  test('next_player write', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      next_player.x = 9
    `
    const res = runForState(prog)

    expect(res.currentPlayerIndex).toEqual(0)
    expect(res.nextPlayerIndex).toEqual(1)
    expect(res.previousPlayerIndex).toEqual(2)

    expect((res.players[0].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[1].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
    expect((res.players[2].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
  })

  test('next_player access', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      next_player.x = 9
      int k {15} = next_player.x
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['k'] as DefinitionTableIntEntry).val).toBe(9)
    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
  })

  test('pp write', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      pp.x = 9
    `
    const res = runForState(prog)
    expect(res.currentPlayerIndex).toEqual(0)
    expect(res.nextPlayerIndex).toEqual(1)
    expect(res.previousPlayerIndex).toEqual(2)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
  })

  test('pp access', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      pp.x = 9
      int k {15} = pp.x
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['k'] as DefinitionTableIntEntry).val).toBe(9)
    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
  })

  test('previous_player write', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      previous_player.x = 9
    `
    const res = runForState(prog)

    expect(res.currentPlayerIndex).toEqual(0)
    expect(res.nextPlayerIndex).toEqual(1)
    expect(res.previousPlayerIndex).toEqual(2)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
  })

  test('previous_player access', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      previous_player.x = 9
      int k {15} = previous_player.x
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['k'] as DefinitionTableIntEntry).val).toBe(9)
    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
  })


  test('cp write (implicit)', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      x = 9
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(9)
    expect((res.players[res.nextPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.previousPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)

    expect(res.globalDefTable['x']).toBe(undefined)
  })

  test('cp access (implicit)', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      int k {15} = x
    `
    const res = runForState(prog)

    expect((res.players[res.currentPlayerIndex].defTable['x'] as DefinitionTableIntEntry).val).toBe(10)
    expect((res.players[res.currentPlayerIndex].localDefTables[0].defTable['k'] as DefinitionTableIntEntry).val).toBe(10)

    expect(res.players[res.nextPlayerIndex].defTable['k']).toBe(undefined)
    expect(res.players[res.previousPlayerIndex].defTable['k']).toBe(undefined)

    expect(res.globalDefTable['x']).toBe(undefined)
    expect(res.globalDefTable['k']).toBe(undefined)
  })

})


describe('should throw', () => {

  test('np var not yet defined', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      int k {15} = 10
      cp.x = np.k
    `
    expect(() => runForState(prog)).toThrow()
  })

  test('pp var not yet defined', () => {

    const prog = `
      3 players {
        int x {15} = 10
      }
      ---
      int k {15} = 10
      cp.x = pp.k
    `
    expect(() => runForState(prog)).toThrow()
  })

})