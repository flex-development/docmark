/**
 * @file E2E Tests - api
 * @module docmark-factory-block/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-factory-block'
import { describe, expect, it } from 'vitest'

describe('e2e:docmark-factory-block', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
