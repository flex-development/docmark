/**
 * @file E2E Tests - api
 * @module docmark-grammar/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-grammar'
import { describe, expect, it } from 'vitest'

describe('e2e:docmark-grammar', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
