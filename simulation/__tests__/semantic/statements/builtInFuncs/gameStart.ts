import {justParse} from "../../../initForTests";
import {AbstractMachine} from "../../../../machine/AbstractMachine";

describe('game start', () => {

  test('game start', () => {
    const prog = `
        game_start()
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    if (stat.type === "start") {

      expect(stat.startCondition).toEqual(null)
    }
    else {
      expect(stat.type).toEqual('start')
    }
  })

  test('game start with condition', () => {
    const prog = `
        game_start(true)
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    if (stat.type === "start") {

      if (stat.startCondition === null) {
        expect(stat.startCondition).not.toEqual(null)
        return
      }

      const tuple = AbstractMachine.execExpression(stat.startCondition, AbstractMachine.createNewMachineState())
      expect(tuple.boolVal).toEqual(true)

    }
    else {
      expect(stat.type).toEqual('start')
    }
  })

})