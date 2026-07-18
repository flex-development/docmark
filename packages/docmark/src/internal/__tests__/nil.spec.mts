/**
 * @file Unit Tests - nil
 * @module docmark/internal/tests/unit/nil
 */

import { codes } from '@flex-development/docmark-util-symbol'
import { describe, expect, it } from 'vitest'
import testSubject from '../nil.mts'

describe('unit:internal/nil', () => {
  it('should return `false` if `value` is not `null` or `undefined`', () => {
    expect(testSubject(codes.bos)).to.be.false
  })

  it('should return `true` if `value` is `null`', () => {
    expect(testSubject(codes.eos)).to.be.true
  })

  it('should return `true` if `value` is `undefined`', () => {
    expect(testSubject(undefined)).to.be.true
  })
})
