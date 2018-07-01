import {runForLocalVar} from "../../../initForTests";


describe('and', () => {

  test('bool and bool', () => {
    const prog = `
      bool x = true and true
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('bool && bool', () => {
    const prog = `
      bool x = true && true
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('true and false', () => {
    const prog = `
      bool x = true and false
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(false)
  })


})

describe('should fail because of types', ()=> {

  test('bool = int + bool', () => {
    const prog = `
      int x {15} = true and true
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('bool = int and bool', () => {
    const prog = `
      bool x = 1 and true
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('bool = bool and int', () => {
    const prog = `
      bool x = true and 1
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })


})