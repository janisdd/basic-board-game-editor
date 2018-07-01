import {justParse} from "../../../initForTests";
import {ControlGotoUnit, ControlIfElseUnit} from "../../../../model/executionUnit";
import {AbstractMachine} from "../../../../machine/AbstractMachine";

describe('control statements', () => {

  test('control goto', () => {
    const prog = `
      control goto 10
    `
    const res = justParse(prog)

    expect(res.statements.length === 1).toEqual(true)
    expect(res.statements[0].type === 'control_goto').toEqual(true)
    expect((res.statements[0] as ControlGotoUnit).targetId).toEqual(10)
  })

  test('control if else', () => {
    const prog = `
      control if true then goto 2 else goto 3 end
    `
    const res = justParse(prog)

    expect(res.statements.length === 1).toEqual(true)
    expect(res.statements[0].type === 'control_ifElse').toEqual(true)

    let state = AbstractMachine.createNewMachineState()
    const exprResult = AbstractMachine.execExpression((res.statements[0] as ControlIfElseUnit).conditionExpr, state)

    expect(exprResult.boolVal).toEqual(true)
    expect((res.statements[0] as ControlIfElseUnit).trueTargetId).toEqual(2)
    expect((res.statements[0] as ControlIfElseUnit).falseTargetId).toEqual(3)
  })

  test('control if else formatted', () => {
    const prog = `
      control if true then
        goto 2
      else
        goto 3
      end
    `
    const res = justParse(prog)

    expect(res.statements.length === 1).toEqual(true)
    expect(res.statements[0].type === 'control_ifElse').toEqual(true)

    let state = AbstractMachine.createNewMachineState()
    const exprResult = AbstractMachine.execExpression((res.statements[0] as ControlIfElseUnit).conditionExpr, state)

    expect(exprResult.boolVal).toEqual(true)
    expect((res.statements[0] as ControlIfElseUnit).trueTargetId).toEqual(2)
    expect((res.statements[0] as ControlIfElseUnit).falseTargetId).toEqual(3)
  })

  test('force', () => {
    const prog = `
      force
    `
    const res = justParse(prog)

    expect(res.statements.length === 1).toEqual(true)
    expect(res.statements[0].type === 'force').toEqual(true)
  })

})