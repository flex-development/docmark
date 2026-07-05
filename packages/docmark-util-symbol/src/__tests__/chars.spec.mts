/**
 * @file Unit Tests - chars
 * @module docmark-util-symbol/tests/unit/chars
 */

import * as micromark from 'micromark-util-symbol'
import { describe, expect, it } from 'vitest'
import testSubject from '../chars.mts'

describe('unit:chars', () => {
  it('should be character dictionary', () => {
    expect(testSubject).toMatchSnapshot()
  })

  it('should be superset of micromark.values', () => {
    expect(testSubject).toMatchObject(micromark.values)
  })
})
