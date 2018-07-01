import {runForLocalVar} from "../../../initForTests";

describe('relations', () => {

  test('< true', () => {
    const prog = `
      bool x = 3 < 5
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('< true assign', () => {
    const prog = `
      bool x = true
      x = 3 < 5
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('> true', () => {
    const prog = `
      bool x = 5 > 3
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('> true assign', () => {
    const prog = `
      bool x = true
      x = 5 > 3
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('<= true', () => {
    const prog = `
      bool x = 3 <=5
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('<= true assign', () => {
    const prog = `
      bool x = true
      x = 3 <=5
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('>= true', () => {
    const prog = `
      bool x = 5 >= 3
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })
  test('>= true assign', () => {
    const prog = `
      bool x = false
      x = 5 >= 3
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

})


describe('should fail because of types', () => {

  test('int = bool', () => {
    const prog = `
      int x {15} = 3 < 5
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('int = bool assign', () => {
    const prog = `
      int x {15} = 1
      x = 3 < 5
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

})