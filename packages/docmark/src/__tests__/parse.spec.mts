/**
 * @file Unit Tests - parse
 * @module docmark/tests/unit/parse
 */

import { describe, expect, it } from 'vitest'
import testSubject from '../parse.mts'

describe('unit:parse', () => {
  it('should return parse context', () => {
    expect(testSubject()).toMatchSnapshot()
  })
})
