import {runForLocalVar} from "../../../initForTests";

describe('if else', () => {

  test('if branch', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 3 then 
          x = 10
       else
          x = 20
       end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(10)
  })

  test('else branch', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 4 then 
          x = 3
       else
          x = 4
       end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(4)
  })

})



describe('should fail because of condition type', () => {

  test('condition int', () => {
    const prog = `
       int x {15} = 5
       
       if 3 then 
          x = 10
       else
          x = 20
       end
    `
    expect(() =>  runForLocalVar(prog)).toThrow()
  })


})