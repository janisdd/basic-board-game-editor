import {runForLocalVar} from "../../../initForTests";

describe('sums / subs', () => {

  test('const + const', () => {
    const prog = `
      int x {15} = 1 + 1
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(2)
  })

  test('circular arithmetic max: 15, val: 15', () => {
    const prog = `
      int x {15} = 14+1
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(15)
  })

  test('circular arithmetic max: 15, val: 16', () => {
    const prog = `
      int x {15} = 14+2
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(-16)
  })

  test('circular arithmetic max: 15, val: 17', () => {
    const prog = `
      int x {15} = 14+3
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(-15)
  })

  test('circular arithmetic max: 15, val: -15', () => {
    const prog = `
      int x {15} = 0-15
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(-15)
  })

  test('circular arithmetic max: 15, val: -16 | 2', () => {
    const prog = `
      int x {15} = -15-1
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(-16)
  })

  test('circular arithmetic max: 15, val: -16 | 2', () => {
    const prog = `
      int x {15} = 0 - 16
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(-16)
  })

  test('circular arithmetic max: 15, val: -17', () => {
    const prog = `
      int x {15} = 0 - 17
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(15)
  })

  test('circular arithmetic max: 15, val: -17', () => {
    const prog = `
      int x {15} = -15-2
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(15)
  })

})

describe('should fail because of types', () => {


  describe('add', () => {

    test('bool = int + bool', () => {
      const prog = `
      bool x = true + 1
    `
      expect(() => runForLocalVar(prog)).toThrow()
    })

    test('int + bool', () => {
      const prog = `
      int x {15} = true + 1
    `
      expect(() => runForLocalVar(prog)).toThrow()
    })

    test('bool + int', () => {
      const prog = `
      int x {15} = 1+true
    `
      expect(() => runForLocalVar(prog)).toThrow()
    })

    test('bool + int assign', () => {
      const prog = `
      int x {15} = 1
      x = true + 1
    `
      expect(() => runForLocalVar(prog)).toThrow()
    })
    test('int + bool assign', () => {
      const prog = `
      int x {15} = 1
      x = 1+true
    `
      expect(() => runForLocalVar(prog)).toThrow()
    })

    test('bool = int + bool assign', () => {
      const prog = `
      bool x = true
      x = true + 1
    `
      expect(() => runForLocalVar(prog)).toThrow()
    })
  })


  describe('sub', () => {
    test('bool - int', () => {
      const prog = `
      int x {15} = true - 1
    `
      expect(() => runForLocalVar(prog)).toThrow()
    })

    test('int - bool', () => {
      const prog = `
      int x {15} = 1-true
    `
      expect(() => runForLocalVar(prog)).toThrow()
    })

    test('bool - int assign', () => {
      const prog = `
      int x {15} = 1
      x = true - 1
    `
      expect(() => runForLocalVar(prog)).toThrow()
    })
    test('int - bool assign', () => {
      const prog = `
      int x {15} = 1
      x = 1-true
    `
      expect(() => runForLocalVar(prog)).toThrow()
    })
  })


})