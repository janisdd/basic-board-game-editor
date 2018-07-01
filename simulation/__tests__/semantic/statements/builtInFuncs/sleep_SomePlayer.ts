import {justParse} from "../../../initForTests";
import {SomePlayer} from "../../../../model/executionUnit";

describe('sleep', () => {

  test('sleep current player', () => {
    const prog = `
        sleep(cp, 5)
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    if (stat.type === "sleep_func") {

      expect(stat.player).toEqual(SomePlayer.currentPlayer)
    }
    else {
      expect(stat.type).toEqual('sleep_func')
    }
  })

  test('sleep next player', () => {
    const prog = `
        sleep(np, 5)
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    if (stat.type === "sleep_func") {

      expect(stat.player).toEqual(SomePlayer.nextPlayer)
    }
    else {
      expect(stat.type).toEqual('sleep_func')
    }
  })

  test('sleep prev player', () => {
    const prog = `
        sleep(pp, 5)
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    if (stat.type === "sleep_func") {

      expect(stat.player).toEqual(SomePlayer.previousPlayer)
    }
    else {
      expect(stat.type).toEqual('sleep_func')
    }
  })

})