import {DefinitionTableBoolEntry, DefinitionTableIntEntry} from "../../../machine/machineState";
import {runForState, runWithOtherVar} from "../../initForTests";
import {ExpressionUnit} from "../../../model/executionUnit";
import {AbstractMachine} from "../../../machine/AbstractMachine";

describe('game_vars', () => {

  test('maxDiceValue', () => {

    const prog = `
      game {
        maxDiceValue 7
      }
    `
    const res = runForState(prog)

    expect(res.maxDiceValue).toEqual(7)
    expect(res.gameEndCondition).toEqual(null)

  })
  test('endCondition', () => {

    const prog = `
      game {
        endCondition true
      }
    `
    const res = runForState(prog)

    expect(res.gameEndCondition).not.toEqual(null)

    if (res.gameEndCondition !== null) {
      const expr = AbstractMachine.execExpression(res.gameEndCondition, AbstractMachine.createNewMachineState())
      expect(expr.boolVal).toEqual(true)
    }
  })

  test('maxDiceValue & endCondition', () => {

    const prog = `
      game {
        maxDiceValue 7
        endCondition true
      }
    `
    const res = runForState(prog)

    expect(res.maxDiceValue).toEqual(7)
    expect(res.gameEndCondition).not.toEqual(null)

    if (res.gameEndCondition !== null) {
      const expr = AbstractMachine.execExpression(res.gameEndCondition, AbstractMachine.createNewMachineState())
      expect(expr.boolVal).toEqual(true)
    }
  })

  test('maxDiceValue & game vars', () => {

    const prog = `
      game {
        maxDiceValue 7
        int treasure {15} = 3
      }
    `
    const res = runForState(prog)

    expect(res.maxDiceValue).toEqual(7)
    expect((res.globalDefTable['treasure'] as DefinitionTableIntEntry).val).toEqual(3)

  })

  test('maxDiceValue & endCondition & game vars', () => {

    const prog = `
      game {
        maxDiceValue 7
        endCondition true
        int treasure {15} = 3
      }
    `
    const res = runForState(prog)

    expect(res.maxDiceValue).toEqual(7)
    expect((res.globalDefTable['treasure'] as DefinitionTableIntEntry).val).toEqual(3)
    expect(res.gameEndCondition).not.toEqual(null)

    if (res.gameEndCondition !== null) {
      const expr = AbstractMachine.execExpression(res.gameEndCondition, AbstractMachine.createNewMachineState())
      expect(expr.boolVal).toEqual(true)
    }

  })
})


describe('game vars should throw', () => {

  test('endCondition wrong type', () => {

    const prog = `
      game {
        endCondition 5
      }
    `

    const res = runForState(prog)

    const tuple = AbstractMachine.execExpression(res.gameEndCondition, AbstractMachine.createNewMachineState())

    expect(tuple.boolVal).toEqual(null)

  })

})