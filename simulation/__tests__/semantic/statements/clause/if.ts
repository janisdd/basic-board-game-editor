import {runForLocalVar} from "../../../initForTests";

describe('if tests', () => {

  test('if', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 3 then 
          x = 10
       end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(10)
  })

  test('if one line', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 3 then x = 10 end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(10)
  })

  test('if different formatted 2', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 3 then x = 10 
          end
       
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(10)
  })

  test('if different formatted 3', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 3 then 
       x = 10 end
       
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(10)
  })

  test('if different formatted 4', () => {
    const prog = `
       int x {15} = 5
       
       if true 
       then x = 10 end
       
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(10)
  })

  test('if different formatted 5', () => {
    const prog = `
       int x {15} = 5
       
       if true 
       then x = 10
       end
       
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(10)
  })

  test('if else', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 4 then
          x = 10
        else
          x = 12
        end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(12)
  })

  test('if else one line', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 4 then x = 10 else x = 12 end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(12)
  })

  test('if else  different formatted 2', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 4 then x = 10
        else
          x = 12
        end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(12)
  })

  test('if else  different formatted 3', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 4 then 
       x = 10 else
          x = 12
        end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(12)
  })

  test('if else  different formatted 4', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 4 then x = 10 else
          x = 12
        end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(12)
  })

  test('if else  different formatted 5', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 4 then x = 10 else x = 12
        end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(12)
  })

  test('if else  different formatted 6', () => {
    const prog = `
       int x {15} = 5
       
       if 3 == 4 then x = 10 
       else x = 12 end
    `
    const res = runForLocalVar(prog)
    expect(res).toEqual(12)
  })

})


describe('should fail because of condition type', () => {

  test('condition int', () => {
    const prog = `
       int x {15} = 5
       
       if 3 then 
          x = 10
       end
      
    `
    expect(() =>  runForLocalVar(prog)).toThrow()
  })


})