import {runForState} from "../../initForTests";
import {DefinitionTableBoolEntry, DefinitionTableIntEntry} from "../../../machine/machineState";

describe('players game def', () => {

  test('empty players ', () => {

    const prog = `
      3 players {
      }
    `
    const res = runForState(prog)
    expect(res.players.length).toEqual(3)

  })

  test('players with numTokens', () => {

    const prog = `
      3 players {
        numTokens 1
      }
    `
    const res = runForState(prog)
    expect(res.players.length).toEqual(3)

    for (let i = 0; i < 3; i++) {
      expect(res.players[i].tokens.length === 1).toBe(true)

    }

  })

  test('players with vars', () => {

    const players = 3
    const prog = `
      ${players} players {
        bool x = true
        int y {15} = 15
      }
    `
    const res = runForState(prog)

    expect(res.players.length).toEqual(3)

    for (let i = 0; i < players; i++) {
      expect((res.players[i].defTable['x'] as DefinitionTableBoolEntry).boolVal).toBe(true)
      expect((res.players[i].defTable['y'] as DefinitionTableIntEntry).val).toBe(15)
      expect(res.players[i].tokens.length === 1).toBe(true)
      //always??
      expect(res.players[i].tokens.every(p => p.color === res.players[i].color)).toBe(true)
    }
  })

  test('players with num tokens & vars', () => {

    const players = 3
    const prog = `
      ${players} players {
        numTokens 3
        bool x = true
        int y {15} = 15
      }
    `
    const res = runForState(prog)

    expect(res.players.length).toEqual(3)

    for (let i = 0; i < players; i++) {
      expect((res.players[i].defTable['x'] as DefinitionTableBoolEntry).boolVal).toBe(true)
      expect((res.players[i].defTable['y'] as DefinitionTableIntEntry).val).toBe(15)
      expect(res.players[i].tokens.length === 3).toBe(true)
      //always??
      expect(res.players[i].tokens.every(p => p.color === res.players[i].color)).toBe(true)
    }
  })
})


describe('should throw', () => {

  test('2 players defs', () => {

    const prog = `
      3 players {
        numTokens 1
        bool x = true
        int y {15} = 15
      }
      3 players {
        numTokens 1
        bool x = true
        int y {15} = 15
      }
    `
    expect(() => runForState(prog)).toThrow()
  })

})