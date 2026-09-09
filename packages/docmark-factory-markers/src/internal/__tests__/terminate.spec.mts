/**
 * @file Unit Tests - terminate
 * @module docmark-factory-markers/internal/tests/unit/terminate
 */

import type { State } from '@flex-development/docmark-util-types'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import testSubject from '../terminate.mts'

describe('unit:internal/terminate', () => {
  let nok: State
  let ok: State

  beforeAll(() => {
    nok = vi.fn().mockName('nok')
    ok = vi.fn().mockName('ok')
  })

  it('should return `nok` if `mandatory` is `undefined`', () => {
    expect(testSubject(undefined, ok, nok)).to.eq(nok)
  })

  it('should return `ok` if `mandatory` is `null`', () => {
    expect(testSubject(null, ok, nok)).to.eq(ok)
  })
})
