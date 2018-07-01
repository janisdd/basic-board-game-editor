import {justParse} from "../../../initForTests";

describe('goto', () => {

  test('goto', () => {
    const prog = `
        goto 10
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    if (stat.type === "goto") {

      expect(stat.targetId).toEqual(10)
    }
    else {
      expect(stat.type).toEqual('goto')
    }
  })

})