/**
 * @file Unit Tests - mode
 * @module docmark-util-symbol/tests/unit/mode
 */

import { describe, expect, it } from 'vitest'
import testSubject from '../mode.mts'

describe('unit:mode', () => {
  it('should be comment parsing mode dictionary', () => {
    expect(testSubject).toMatchSnapshot()
  })
})
