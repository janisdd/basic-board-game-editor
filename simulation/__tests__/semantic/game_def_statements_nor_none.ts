import {runForState} from "../initForTests";


test('game_def_statements_nor_none', () => {
  const prog = `
      2 players {}
      ---
      goto 10
    `
  const res = runForState(prog)

  expect(res.players.length).toEqual(2)

  expect(res.players[res.currentPlayerIndex].tokens[res.currentPlayerActiveTokenIndex].fieldId).toEqual(10)
})