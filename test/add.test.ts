import {add} from '../lib'

describe('testAdd', () => {
  it('test Ok', () => {
    expect(add(1, 2)).toEqual(3)
  })
})
