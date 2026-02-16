/**
 * @file E2E Tests - api
 * @module docmark/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark'

describe('e2e:docmark', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
