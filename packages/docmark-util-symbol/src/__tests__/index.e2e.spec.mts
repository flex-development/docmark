/**
 * @file E2E Tests - api
 * @module docmark-util-symbol/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-util-symbol'

describe('e2e:docmark-util-symbol', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
