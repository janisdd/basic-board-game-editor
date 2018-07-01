import {runForLocalVar} from "../../../initForTests";

describe('mul ops: *, /, %', () => {

  describe('mul', () => {

    test('mul', () => {

      const prog = `
      int x {15} = 2*3
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(6)
    })

    test('mul with neg', () => {

      const prog = `
      int x {15} = -2*3
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(-6)
    })
    test('mul with neg 2', () => {

      const prog = `
      int x {15} = 2*-3
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(-6)
    })

    test('mul before add', () => {

      const prog = `
      int x {15} = 2+2*3
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(8)
    })

    test('mul circular arithmetic', () => {

      const prog = `
      int x {15} = 4*4
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(-16)
    })

    test('mul circular arithmetic neg', () => {

      const prog = `
      int x {15} = -4*5
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(12)
    })
  })

  describe('div', () => {

    test('div', () => {

      const prog = `
      int x {15} = 6/2
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(3)
    })

    test('div with neg', () => {

      const prog = `
      int x {15} = -6/2
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(-3)
    })
    test('div with neg 2', () => {

      const prog = `
      int x {15} = 6/-2
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(-3)
    })

    test('div before add', () => {

      const prog = `
      int x {15} = 2+6/3
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(4)
    })

    test('div no circular arithmetic but large const', () => {

      const prog = `
      int x {15} = 30/15
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(2)
    })

    test('div circular arithmetic', () => {

      const prog = `
      int x {15} = 32/2
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(-16)
    })

    test('div circular arithmetic neg', () => {

      const prog = `
      int x {15} = -34/2
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(15)
    })
  })

  describe('modulo', () => {

    test('modulo', () => {

      const prog = `
      int x {15} = 6%2
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(0)
    })

    test('modulo with neg', () => {

      const prog = `
      int x {15} = -6%2
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(0)
    })
    test('modulo with neg 2', () => {

      const prog = `
      int x {15} = 6%-2
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(0)
    })

    test('modulo before add', () => {

      const prog = `
      int x {15} = 2+6%3
    `
      const res = runForLocalVar(prog)
      expect(res).toEqual(2)
    })

  })

})