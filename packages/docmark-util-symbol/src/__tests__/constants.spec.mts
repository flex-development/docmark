/**
 * @file Unit Tests - constants
 * @module docmark-util-symbol/tests/unit/constants
 */

import * as micromark from 'micromark-util-symbol'
import testSubject from '../constants.mts'

describe('unit:constants', () => {
  it('should be constants dictionary', () => {
    expect(testSubject).toMatchSnapshot()
  })

  it('should match micromark.constants', () => {
    expect(testSubject).toMatchObject(micromark.constants)
  })
})
