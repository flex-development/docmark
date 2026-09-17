/**
 * @file E2E Tests - api
 * @module docmark-factory-markers/utils/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-factory-markers/utils'
import { describe, expect, it } from 'vitest'

describe('e2e:utils', () => {
  it('should expose public api', () => {
    expect(testSubject).toMatchSnapshot()
  })
})
