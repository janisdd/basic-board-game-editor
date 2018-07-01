import {justParse} from "../../../initForTests";

describe('game end', () => {

  test('game end', () => {
    const prog = `
        game_end()
    `
    const res = justParse(prog)

    expect(res.statements.length).toEqual(1)

    const stat = res.statements[0]

    expect(stat.type).toEqual('end')
  })

})