/**
 * @file Unit Tests - chars
 * @module mark-util-symbol/tests/unit/chars
 */

import testSubject from '../chars.mts'

describe('unit:chars', () => {
  it('should be character dictionary', () => {
    expect(testSubject).toMatchSnapshot()
  })
})
