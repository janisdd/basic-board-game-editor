import {runForLocalVar} from "../../../initForTests";


describe('or', () => {

  test('bool or bool', () => {
    const prog = `
      bool x = true or true
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('bool || bool', () => {
    const prog = `
      bool x = true || true
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('true or false', () => {
    const prog = `
      bool x = true or false
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })


})

describe('should fail because of types', ()=> {

  test('bool = int + bool', () => {
    const prog = `
      int x {15} = true or true
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('bool = int or bool', () => {
    const prog = `
      bool x = 1 or true
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('bool = bool or int', () => {
    const prog = `
      bool x = true or 1
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })


})