import {runForLocalVar} from "../../../initForTests";

describe('var decls', () => {

  test('var int decl', () => {
    const prog = `
        int x {15} = 15
    `
    const res = runForLocalVar(prog)

    expect(res).toEqual(15)
  })
  test('var int circular arithmetic', () => {
    const prog = `
        int x {15} = 3*6-3
    `
    const res = runForLocalVar(prog)

    expect(res).toEqual(15)
  })

  test('var bool decl', () => {
    const prog = `
        bool x = true
    `
    const res = runForLocalVar(prog)

    expect(res).toEqual(true)
  })

})