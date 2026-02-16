/**
 * @file E2E Tests - api
 * @module docmark-factory-space/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-factory-space'

describe('e2e:docmark-factory-space', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
