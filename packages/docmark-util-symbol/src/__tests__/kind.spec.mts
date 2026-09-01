/**
 * @file Unit Tests - kind
 * @module docmark-util-symbol/tests/unit/kind
 */

import { describe, expect, it } from 'vitest'
import testSubject from '../kind.mts'

describe('unit:kind', () => {
  it('should be comment kind dictionary', () => {
    expect(testSubject).to.have.keys(['block', 'docblock', 'line'])
    expect(testSubject).to.have.property('block', 'block')
    expect(testSubject).to.have.property('docblock', 'docblock')
    expect(testSubject).to.have.property('line', 'line')
  })
})
