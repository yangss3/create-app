import { add, subtract } from '../src'

it('add', () => {
  expect(add(1, 2)).toBe(3)
})

it('subtract', () => {
  expect(subtract(1, 2)).toBe(-1)
})
