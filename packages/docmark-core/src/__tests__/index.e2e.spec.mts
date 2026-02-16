/**
 * @file E2E Tests - api
 * @module docmark-core/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-core'

describe('e2e:docmark-core', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
