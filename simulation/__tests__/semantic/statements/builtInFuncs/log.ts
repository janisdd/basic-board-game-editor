import {justParse} from "../../../initForTests";
import {AbstractMachine} from "../../../../machine/AbstractMachine";

describe('log', () => {

  test('log', () => {
    const prog = `
        log(true)
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    if (stat.type === "log") {

      const tuple = AbstractMachine.execExpression(stat.expr, AbstractMachine.createNewMachineState())

      expect(tuple.boolVal).toEqual(true)

    }
    else {
      expect(stat.type).toEqual('log')
    }
  })

})