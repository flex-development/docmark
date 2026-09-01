/**
 * @file Unit Tests - eolset
 * @module docmark/internal/tests/unit/eolset
 */

import { codes } from '@flex-development/docmark-util-symbol'
import { describe, expect, it } from 'vitest'
import testSubject from '../eolset.mts'

describe('unit:internal/eolset', () => {
  it.each<Parameters<typeof testSubject>>([
    [codes.carriageReturnLineFeed, 516],
    [codes.carriageReturn, 371],
    [codes.lineFeed, 277]
  ])('should return end offset (%j, %j)', (code, start) => {
    expect(testSubject(code, start)).toMatchSnapshot()
  })
})
