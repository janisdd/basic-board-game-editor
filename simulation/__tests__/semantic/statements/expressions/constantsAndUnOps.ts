import {runForLocalVar} from "../../../initForTests";


describe('const, un ops', () => {


  test('true', () => {
    const prog = `
      bool x  = true
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })
  test('false', () => {
    const prog = `
      bool x  = false
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(false)
  })

  test('not true', () => {
    const prog = `
      bool x  = not true
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(false)
  })

  test('! true', () => {
    const prog = `
      bool x  = ! true
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(false)
  })

  test('not(false)', () => {
    const prog = `
      bool x  = not(false)
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(true)
  })

  test('5', () => {
    const prog = `
      int x {15} = 5
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(5)
  })

  test('+5', () => {
    const prog = `
      int x {15} = +5
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(5)
  })

  test('-5', () => {
    const prog = `
      int x {15} = -5
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(-5)
  })

  test('-17', () => {
    const prog = `
      int x {15} = -17
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(15)
  })

  test('-33', () => {
    const prog = `
      int x {15} = -33
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(-1)
  })
  test('17', () => {
    const prog = `
      int x {15} = 17
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(-15)
  })
  test('47 (15+32)', () => {
    const prog = `
      int x {15} = 47
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(15)
  })

})


describe('should fail because of type', () => {


  test('not int', () => {
    const prog = `
      bool x  = not 3
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('int to bool', () => {
    const prog = `
      bool x  = 3
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })


  test('bool true to int', () => {
    const prog = `
      int x {15} = true
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('bool false to int', () => {
    const prog = `
      int x {15} = false
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('int to bool assign', () => {
    const prog = `
      bool x = true
      x = 3
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('bool true to int assign', () => {
    const prog = `
      int x {15} = 3
      x = true
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

  test('bool false to int assign', () => {
    const prog = `
      int x {15} = 3
      x = false 
    `
    expect(() => runForLocalVar(prog)).toThrow()
  })

})