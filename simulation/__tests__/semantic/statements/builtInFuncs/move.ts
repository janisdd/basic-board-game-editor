import {justParse} from "../../../initForTests";
import {AbstractMachine} from "../../../../machine/AbstractMachine";

describe('move', () => {

  test('move', () => {
    const prog = `
        move(10)
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    if (stat.type === "move_func") {

      const tuple = AbstractMachine.execExpression(stat.numStepsExpr, AbstractMachine.createNewMachineState())

      expect(tuple.val).toEqual(10)
    }
    else {
      expect(stat.type).toEqual('move_func')
    }
  })

})