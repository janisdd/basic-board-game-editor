import {runForLocalVar} from "../../../initForTests";


describe('comparison', () => {

  test('int == int', () => {
    const prog = `
      bool x = 1 == 1
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('int == int assign', () => {
    const prog = `
      bool x = true
      x = 1 == 1
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('bool == bool', () => {
    const prog = `
      bool x = true == true
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('bool == bool assign', () => {
    const prog = `
      bool x = true
      x = true == true
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('int != int', () => {
    const prog = `
      bool x = 1 != 1
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(false)
  })

  test('int <> int', () => {
    const prog = `
      bool x = 1 <> 1
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(false)
  })

  test('int != int assign', () => {
    const prog = `
      bool x = true
      x = 1 != 1
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(false)
  })

  test('bool != bool', () => {
    const prog = `
      bool x = true != false
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('bool != bool assign', () => {
    const prog = `
      bool x = true
      x = true != false
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

})


describe('should fail because of types', () => {

  test('int = int == int', () => {
    const prog = `
      int x {15} = 1 == 1
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('int = int != int', () => {
    const prog = `
      int x {15} = 1 != 1
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('int = int == int assign', () => {
    const prog = `
      int x {15} = 1
      x = 1 == 1
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('int = int != int assign', () => {
    const prog = `
      int x {15} = 1
      x = 1 != 1
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

})