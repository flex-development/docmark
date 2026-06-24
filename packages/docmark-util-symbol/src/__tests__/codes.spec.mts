/**
 * @file Unit Tests - codes
 * @module docmark-util-symbol/tests/unit/codes
 */

import testSubject from '../codes.mts'

describe('unit:codes', () => {
  expect.addSnapshotSerializer({
    /**
     * @this {void}
     *
     * @param {any} value
     *  The value to serialize
     * @return {string}
     *  The serialized value
     */
    serialize(this: void, value: any): string {
      return JSON.stringify(value, null, 2)
    },

    /**
     * @this {void}
     *
     * @param {unknown} value
     *  The value to check
     * @return {boolean}
     *  `true` if `value` is {@linkcode testSubject}, `false` otherwise
     */
    test(this: void, value: unknown): boolean {
      return value === testSubject
    }
  })

  it('should be character code dictionary', () => {
    expect(testSubject).toMatchSnapshot()
  })
})
