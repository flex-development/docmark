/**
 * @file Unit Tests - constants
 * @module docmark-util-symbol/tests/unit/constants
 */

import testSubject from '#lib/constants'
import * as micromark from 'micromark-util-symbol'

describe('unit:constants', () => {
  it('should be readonly record of constant values', () => {
    expect(testSubject).to.be.frozen
    expect(testSubject).toMatchSnapshot()
  })

  it('should match micromark.constants', () => {
    expect(testSubject).toMatchObject(micromark.constants)
  })
})
