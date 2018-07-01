import {runForLocalVar} from "../../../initForTests";


describe('ternary exprs', () => {

  test('true case', () => {

    const prog = `
      int x {15} = true ? 1 : 2
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(1)
  })

  test('false case', () => {

    const prog = `
      int x {15} = false ? 1 : 2
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(2)
  })

  test('condition or expression', () => {

    const prog = `
      int x {15} = false || true ? 1 : 2
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(1)
  })

  test('condition is assignment', () => {

    const prog = `
      bool y = true;
      int x {15} = (y = true) ? 1 : 2
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(1)
  })

  test('ternary as statement', () => {

    const prog = `
      bool x = true
      true ? 1 : 2
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

})

describe('should fail', () => {

  test('condition is assignment', () => {

    //expected type is bool for y assignment
    const prog = `
      bool y = true;
      int x {15} = y = true ? 1 : 2
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('not of same type', () => {

    //expected type is bool for y assignment
    const prog = `
      int x {15} = true ? 1 : false
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })
})
