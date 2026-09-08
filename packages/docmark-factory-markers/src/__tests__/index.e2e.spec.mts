/**
 * @file E2E Tests - api
 * @module docmark-factory-markers/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-factory-markers'
import { describe, expect, it } from 'vitest'

describe('e2e:docmark-factory-markers', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
