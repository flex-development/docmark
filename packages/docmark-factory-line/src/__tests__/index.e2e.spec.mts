/**
 * @file E2E Tests - api
 * @module docmark-factory-line/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-factory-line'
import { describe, expect, it } from 'vitest'

describe('e2e:docmark-factory-line', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
