import {runForLocalVar} from "../../../initForTests";


describe('braces', () => {

  test('bool or bool', () => {
    const prog = `
      int x {100} = (3 + 5) * 2
    `
    const res = runForLocalVar(prog, 'x')
    expect(res).toEqual(16)
  })



})

describe('should fail because of types', ()=> {

})