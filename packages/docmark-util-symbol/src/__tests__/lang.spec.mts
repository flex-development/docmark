/**
 * @file Unit Tests - lang
 * @module docmark-util-symbol/tests/unit/lang
 */

import { describe, expect, it } from 'vitest'
import testSubject from '../lang.mts'

describe('unit:lang', () => {
  it('should be source language dictionary', () => {
    expect(testSubject).toMatchSnapshot()
  })
})
