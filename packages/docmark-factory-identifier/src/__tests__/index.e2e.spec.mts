/**
 * @file E2E Tests - api
 * @module docmark-factory-identifier/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-factory-identifier'
import { describe, expect, it } from 'vitest'

describe('e2e:docmark-factory-identifier', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
