/**
 * @file Unit Tests - list
 * @module docmark-util-combine-extensions/internal/tests/unit/list
 */

import { codes } from '@flex-development/docmark-util-symbol'
import { describe, expect, it } from 'vitest'
import testSubject from '../list.mts'

describe('unit:internal/list', () => {
  it('should return `value` if `value` is an array', () => {
    // Arrange
    const value: unknown = []

    // Act + Expect
    expect(testSubject(value)).to.eq(value)
  })

  it('should return new array if `value` is not an array', () => {
    // Arrange
    const value: unknown = codes.asterisk

    // Act
    const result = testSubject(value)

    // Expect
    expect(result).to.not.eq(value)
    expect(result).to.be.an('array').and.eql([value])
  })
})
