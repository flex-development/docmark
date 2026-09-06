/**
 * @file Unit Tests - kind
 * @module docmark-util-symbol/tests/unit/kind
 */

import { beforeAll, describe, expect, it } from 'vitest'
import testSubject from '../kind.mts'

describe('unit:kind', () => {
  let keys: string[]

  beforeAll(() => {
    keys = ['block', 'docblock', 'hash', 'hashbang', 'line']
  })

  it('should be comment kind dictionary', () => {
    expect(testSubject).to.have.keys(keys)
    expect(testSubject).to.have.property('block', 'block')
    expect(testSubject).to.have.property('docblock', 'docblock')
    expect(testSubject).to.have.property('hash', 'hash')
    expect(testSubject).to.have.property('hashbang', 'hashbang')
    expect(testSubject).to.have.property('line', 'line')
  })
})
