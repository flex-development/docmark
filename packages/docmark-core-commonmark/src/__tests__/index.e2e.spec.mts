/**
 * @file E2E Tests - api
 * @module docmark-core-commonmark/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-core-commonmark'

describe('e2e:docmark-core-commonmark', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
